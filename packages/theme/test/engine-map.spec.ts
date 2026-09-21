import { describe, expect, it } from 'vitest';
import { emitThemeCss, generatePaletteCss } from '../src/emit';
import { LITERAL_DEFAULTS } from '../src/literals';
import { PALETTE_KEYS, PALETTE_LEVELS, paletteChannel, paletteColor, simpleChannel, simpleColor } from '../src/palette';
import { resolveTokenColor, resolveThemeColors } from '../src/resolve';
import { FEEDBACK_SCHEMES } from '../src/schemes';
import { ALPHA_TOKENS, SEMANTIC_TOKENS } from '../src/semantic';
import { resolveThemeMap } from '../src/theme-map';
import type { ThemeMode, TokenValue } from '../src/types';

/**
 * P0/P1 —— map resolution, emission and JS resolution (docs/theme.md §3, §4, §5).
 */

/**
 * the hsl channel of a token value (`palette.level` → the palette layer's channel).
 *
 * Lives here rather than in the engine: with the contrast guard removed
 * (docs/theme.md §4.3) nothing in `src/` needs to read a channel back, but the
 * ladder invariant below is still worth asserting.
 */
const channelHsl = (value: TokenValue): string | undefined => {
  if (value.kind === 'palette') {
    return paletteChannel(value.palette, value.level, 'hsl');
  }

  return value.kind === 'simple' ? simpleChannel(value.name, 'hsl') : undefined;
};

/** parse an `h s% l%` channel triple into linear-space RGB. */
const channelToRgb = (channel: string): [number, number, number] | undefined => {
  const [h, s, l] = channel.trim().split(/\s+/);

  if (h === undefined || s === undefined || l === undefined) {
    return undefined;
  }

  const hue = Number.parseFloat(h) / 360;
  const saturation = Number.parseFloat(s) / 100;
  const lightness = Number.parseFloat(l) / 100;
  const a = saturation * Math.min(lightness, 1 - lightness);
  const f = (n: number): number => {
    const k = (n + hue * 12) % 12;

    return lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };

  return [f(0), f(8), f(4)];
};

/** WCAG relative luminance of a token value. */
const luminanceOf = (value: TokenValue): number => {
  const channel = channelHsl(value);
  const rgb = channel ? channelToRgb(channel) : undefined;

  if (!rgb) {
    return 0;
  }

  const [r, g, b] = rgb.map(component =>
    component <= 0.03928 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4
  ) as [number, number, number];

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const DEFAULTS = { base: 'zinc', primary: 'indigo' } as const;

describe('theme map — structure and invariants', () => {
  it('resolves every semantic token in both modes', () => {
    const map = resolveThemeMap(DEFAULTS);

    // 41 after the pressed-companion removal: the six `{role}-active` tokens are
    // gone (pressed states use the fill with an alpha modifier instead); the
    // status `-text` / `-subtle` / `-border` roles and `border-strong` were
    // already gone, `card-foreground` / `popover-foreground` and the two
    // sidebar pairs are in
    expect(SEMANTIC_TOKENS.length).toBe(41);
    SEMANTIC_TOKENS.forEach(token => {
      expect(map.light[token], `light:${token}`).toBeDefined();
      expect(map.dark[token], `dark:${token}`).toBeDefined();
    });
  });

  it('resolves the region tokens as mirrors of the global roles', () => {
    const map = resolveThemeMap(DEFAULTS);

    expect(map.light.sidebar).toEqual(map.light.background);
    expect(map.dark.sidebar).toEqual(map.dark.muted);
    // 暗色必须与主画布 `card` 分开一档，否则侧栏与主体完全同色、读不出分界；
    // 亮色按设计取页面基底 `background`（与页面同调），分界由 `sidebar-border` 承担
    expect(map.dark.sidebar).not.toEqual(map.dark.card);
    expect(map.light['sidebar-foreground']).toEqual(map.light.foreground);
    expect(map.light['sidebar-accent']).toEqual(map.light.accent);
    // 暗色 `sidebar` = `muted` = `accent` = `sidebar-accent`：镜像与折叠后的填充族同值，
    // 因此侧栏交互面**不能**再用实心 `bg-sidebar-accent`（与静止面同色），
    // 改由 `bg-sidebar-accent-foreground/10` 洗色表达（packages/ui/src/styles/tree-menu.ts）。
    // 这一条同时是信号：若哪天 `sidebar-accent` 与 `sidebar` 重新分开，请回头复核该洗色。
    expect(map.dark.sidebar).toEqual(map.dark['sidebar-accent']);
    expect(map.light['sidebar-accent-foreground']).toEqual(map.light['accent-foreground']);
    expect(map.light['sidebar-primary']).toEqual(map.light.primary);
    expect(map.light['sidebar-border']).toEqual(map.light.border);
    expect(map.light['sidebar-primary-foreground']).toEqual(map.light['primary-foreground']);
    expect(map.light['sidebar-ring']).toEqual(map.light.ring);
  });

  it('keeps the weak fills on the collapsed shadcn-parity rung', () => {
    // `muted` / `accent` **同档**（对齐 shadcn 默认，docs/theme.md §3.2）：一个是静态弱化面、
    // 一个是瞬时交互面，交互可见性不再由档差承担，而由配方的 alpha 阶梯承担
    // （字符串层 `packages/ui/test/specs/styles/neutral-faces.spec.ts`，
    // 实测色差层 `packages/ui/test/browser/specs/theme/neutral-faces.e2e.spec.ts`）。
    // 同档是**有意**的：任何"静止实心 `muted` → 瞬时实心 `accent`"的配方都会 Δ = 0，
    // 所以同档必须锁在这里，配方不能再假设两者有档差。
    // `secondary` **不在**这一档（见下一条）：它是静态**实心**填充，白底上要靠档差读出来。
    const map = resolveThemeMap(DEFAULTS);

    (['light', 'dark'] as const).forEach(mode => {
      expect(map[mode].accent, mode).toEqual(map[mode].muted);
    });
  });

  it('lifts the static strong fill one rung in light mode', () => {
    // `secondary` 是次级按钮 / badge / tag / alert 的静止面，亮色下直接压在白 `card` 上：
    // 弱档在那里只有 Δ11（页面底上 Δ6），读不出"这是个填充"，所以抬一档到 `{b}.200`。
    // **暗色刻意不抬**：弱档 `{b}.800` 在 `card`（`{b}.900`）上已有 Δ15，chip 读得出来，
    // 再抬会变成 Δ43 的亮块（`primary` 选中性色板时的亮 800 / 暗 200 是同一类"两模式独立定档"）。
    const map = resolveThemeMap(DEFAULTS);

    expect(map.light.secondary).toEqual({ kind: 'palette', palette: 'zinc', level: 200 });
    expect(map.dark.secondary).toEqual({ kind: 'palette', palette: 'zinc', level: 800 });

    // 亮色：比弱档更沉，且与弱档、瞬时面都不同值
    expect(luminanceOf(map.light.secondary)).toBeLessThan(luminanceOf(map.light.muted));
    expect(map.light.secondary).not.toEqual(map.light.muted);
    expect(map.light.secondary).not.toEqual(map.light.accent);

    // 暗色：仍留在弱档上（与 `muted` / `accent` 同值）——chip 在 `card` 上已有 Δ15，不需要抬档
    expect(map.dark.secondary).toEqual(map.dark.muted);
    expect(map.dark.secondary).toEqual(map.dark.accent);

    // 填充上的文字必须读得到（同 status on-solid 的判据：断言对比度，不断言档位）
    (['light', 'dark'] as const).forEach(mode => {
      const fill = luminanceOf(map[mode].secondary);
      const text = luminanceOf(map[mode]['secondary-foreground']);
      const [hi, lo] = fill > text ? [fill, text] : [text, fill];

      expect((hi + 0.05) / (lo + 0.05), `${mode}: secondary-foreground on secondary`).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('keeps the elevation ladder ordered in both modes', () => {
    const failures: string[] = [];

    (['light', 'dark'] as ThemeMode[]).forEach(mode => {
      const map = resolveThemeMap(DEFAULTS);
      const background = luminanceOf(map[mode].background);
      const card = luminanceOf(map[mode].card);
      const popover = luminanceOf(map[mode].popover);

      if (!(background < card && card <= popover)) {
        failures.push(`${mode}: ${background} / ${card} / ${popover}`);
      }

      // 审计 P0-4 的回归护栏：页面与容器不得同值
      if (mode === 'light' && background === card) {
        failures.push('light: background === card');
      }

      // 弱化面必须与所在表面可辨（fill 与 line 同档是允许的：二者都是"离页面一档"，
      // 旧实现的缺陷是三面同值，而不是 fill 与 line 同值）
      if (mode === 'light' && channelHsl(map[mode].muted) === channelHsl(map[mode].background)) {
        failures.push('light: muted === background');
      }
    });

    expect(failures).toEqual([]);
  });

  it('drops the page tint when surfaceStyle is flat (pre-refactor look)', () => {
    const map = resolveThemeMap({ ...DEFAULTS, surfaceStyle: 'flat' });

    expect(map.light.background).toEqual({ kind: 'simple', name: 'white' });
    expect(map.light.card).toEqual({ kind: 'simple', name: 'white' });
    expect(map.light.popover).toEqual({ kind: 'simple', name: 'white' });
    expect(map.dark.background).toEqual({ kind: 'palette', palette: 'zinc', level: 950 });
    expect(map.dark.card).toEqual({ kind: 'palette', palette: 'zinc', level: 900 });
    expect(map.dark.popover).toEqual({ kind: 'palette', palette: 'zinc', level: 900 });
  });

  it('snapshots the default theme map', () => {
    expect(resolveThemeMap(DEFAULTS)).toMatchSnapshot();
  });

  it('gives status foregrounds the same light base level as primary-foreground in light mode', () => {
    // docs/theme.md §7-2：亮色下状态 on-solid 文字与 primary 视觉一致（`{b}.50`）
    const map = resolveThemeMap(DEFAULTS);
    const expected = { kind: 'palette', palette: 'zinc', level: 50 } as const;

    expect(map.light['primary-foreground']).toEqual(expected);
    (['destructive', 'success', 'warning', 'info'] as const).forEach(status => {
      expect(map.light[`${status}-foreground`], `light:${status}`).toEqual(expected);
    });

    // `primary-foreground` 的暗色仍是 `.50`：primary 的填充两模式同为 `.500`（中性预设走
    // `neutral` 分支另算），不存在"填充变浅"的问题，所以它不需要翻档
    expect(map.dark['primary-foreground']).toEqual(expected);
  });

  /**
   * 回归护栏：**暗色**下状态实心上的文字必须与填充拉开距离。
   *
   * 填充在暗色下会变浅（`{c}.500` → `{c}.400`），文字若恒定近白，间隙就被压没——
   * 这正是重构时丢掉的那条分支：旧引擎亮色 `.50`、暗色 `.900`，新版一度两模式都是 `.50`，
   * 暗色实测掉到 1.34–2.65:1，真实浏览器里 axe 对四个状态全部报 serious。
   *
   * 断言的是**对比度**而非具体档位：档位是策略，对比度才是契约，将来改档位只要仍达标就不该失败。
   *
   * 只覆盖暗色：亮色侧状态实心配 `{b}.50` 是旧版就有的基线缺陷（2.06–3.60:1），
   * 修它会把"白字色块"改成"淡彩块"这一视觉语言变更，属于单独的设计决策（docs/theme.md §3.6）。
   * 所以这里只钉住"暗色确实翻档了"，不把亮色的已知缺口写成硬约束。
   */
  it('keeps every status foreground readable on its fill in dark mode', () => {
    const contrast = (fg: TokenValue, bg: TokenValue): number => {
      const a = luminanceOf(fg);
      const b = luminanceOf(bg);
      const [hi, lo] = a > b ? [a, b] : [b, a];

      return (hi + 0.05) / (lo + 0.05);
    };

    const failures: string[] = [];

    Object.keys(FEEDBACK_SCHEMES).forEach(scheme => {
      const map = resolveThemeMap({ ...DEFAULTS, feedback: scheme });

      (['destructive', 'success', 'warning', 'info'] as const).forEach(status => {
        const value = contrast(map.dark[`${status}-foreground`], map.dark[status]);

        if (value < 4.5) {
          failures.push(`${scheme}/dark/${status}: ${value.toFixed(2)}:1`);
        }
      });
    });

    expect(failures).toEqual([]);
  });
});

describe('palette layer (Layer 1)', () => {
  it('emits every built-in palette level plus white and black', () => {
    const css = generatePaletteCss({ format: 'hsl' });
    const declarations = css.match(/^\s*--[\w-]+:/gm) ?? [];

    expect(PALETTE_KEYS.length).toBe(26);
    expect(PALETTE_LEVELS.length).toBe(11);
    expect(declarations.length).toBe(26 * 11 + 2);
    expect(css).toContain('--white: 0 0% 100%;');
    expect(css).toContain('--black: 0 0% 0%;');
  });

  it('stores naked channels that are parseable as hsl', () => {
    const failures = PALETTE_KEYS.flatMap(palette =>
      PALETTE_LEVELS.map(level => {
        const channel = paletteChannel(palette, level, 'hsl');

        return channel && channelToRgb(channel) ? '' : `${palette}.${level}`;
      })
    ).filter(Boolean);

    expect(failures).toEqual([]);
  });

  it('keeps the static palette layer inside its size budget (§10: ≤ 10 KB raw)', () => {
    expect(generatePaletteCss({ format: 'hsl' }).length).toBeLessThan(10_000);
  });
});

describe('semantic layer (Layer 2) emission', () => {
  const map = resolveThemeMap(DEFAULTS);
  const css = emitThemeCss(map);

  it('declares every token exactly once in the light block', () => {
    const light = css.slice(css.indexOf(':root'), css.indexOf('.dark'));
    const duplicated = SEMANTIC_TOKENS.filter(
      token => (light.match(new RegExp(`--${token}:`, 'g')) ?? []).length !== 1
    );

    expect(duplicated).toEqual([]);
  });

  it('emits aliases, never literals, for colors', () => {
    expect(css).toContain('--background: var(--zinc-50);');
    expect(css).toContain('--primary: var(--indigo-500);');
    expect(css).toContain('--mask: var(--black);');
    expect(css).not.toMatch(/--(background|primary): (oklch|hsl)\(/);
  });

  it('emits the dark block as a diff only', () => {
    const dark = css.slice(css.indexOf('.dark'));
    const declarations = dark.match(/^\s*--[\w-]+:/gm) ?? [];

    expect(declarations.length).toBeGreaterThan(10);
    expect(declarations.length).toBeLessThan(SEMANTIC_TOKENS.length);
    expect(dark).toContain('--background: var(--zinc-950);');
  });

  it('emits the alpha companion and the literal layer', () => {
    expect(css).toContain('--border-alpha: 1;');
    expect(css).toContain('--radius: 0.5rem;');
    // 半径刻度是种子的正系数倍（改系数或改种子都只影响这一条链）：改种子整条刻度一起变。
    // `md` 是种子的**直接引用**，所以中央档位与 `--radius` 逐字相同
    expect(css).toContain('--radius-md: var(--radius);');
    expect(css).toContain('--radius-4xl: calc(var(--radius) * 2.25);');
    expect(css).toContain('--radius-none: 0;');
    expect(css).toContain('--radius-full: 9999px;');
    expect(css).toContain('--z-base: 50;');
    // 控件高度不是刻度族（docs/space-control-scale.md §3.1）：不发射任何 control-height 变量
    expect(css).not.toContain('--control-height');
    // 间距族只发网格单位（旋钮）；18 档是 `theme.spacing` 映射里的系数，不进 CSS 变量
    expect(css).toContain('--spacing-unit: 0.25rem;');
    expect(css).not.toContain('--spacing-md');
    ALPHA_TOKENS.forEach(token => expect(css).toContain(`--${token}-alpha`));
  });

  it('emits no type-scale variables (font sizes and line heights are UnoCSS-owned)', () => {
    // 字号与行高不是主题 token——`text-sm` 这类工具类直接取
    // UnoCSS（Wind3）的元组，主题只在适配器里补了最小的三档。库内没有一处读
    // `--text-*` / `--leading-*`，而"字体大小随主题变"本身就不是排版该有的行为
    expect(Object.keys(LITERAL_DEFAULTS).filter(token => /^(text|leading|line-height)-/.test(token))).toEqual([]);
    expect(css).not.toContain('--text-');
    expect(css).not.toContain('--leading-');
  });

  it('emits no shadow or motion variables (both families are UnoCSS-owned)', () => {
    // 五条阴影 token 与 duration / ease 六条一起从字面量层删除——
    // 它们的读者为零（适配器不映射 boxShadow，组件写数字时长），却让"组件怎么动、
    // 多高"变成主题可覆盖的东西。这条断言防止它们以任何形式回流。
    const families = Object.keys(LITERAL_DEFAULTS).filter(
      token => token.startsWith('shadow') || token.startsWith('duration') || token.startsWith('ease')
    );

    expect(families).toEqual([]);
    ['--shadow', '--duration', '--ease'].forEach(family => expect(css).not.toContain(family));
  });

  it('emits bare token names by default and honors an opt-in prefix', () => {
    const bare = emitThemeCss(resolveThemeMap(DEFAULTS));
    // 解析与发射必须用同一个前缀，否则字面量层的内部引用（`calc(var(--radius) * k)`）
    // 会指向不存在的变量
    const prefixed = emitThemeCss(resolveThemeMap({ ...DEFAULTS, prefix: 'vean' }), {
      prefix: 'vean'
    });

    expect(bare).toContain('--background: var(--zinc-50);');
    expect(bare).not.toContain('--vean-background');
    expect(prefixed).toContain('--vean-background: var(--zinc-50);');
    expect(prefixed).toContain('--vean-radius: 0.5rem;');
    expect(prefixed).toContain('--vean-radius-md: var(--vean-radius);');
  });

  it('keeps the semantic layer inside its size budget (§10: ≤ 10 KB raw)', () => {
    // 实测 ≈5.5 KB / 153 条声明（emitThemeCss(resolveThemeMap(DEFAULTS))）；
    // 预算留了余量给维度刻度与未来的 token
    expect(css.length).toBeLessThan(10_000);
  });
});

describe('JS resolution (§3.1 — no complete-color variables needed)', () => {
  it('resolves the same color as the CSS reference it points at', () => {
    const map = resolveThemeMap(DEFAULTS);
    const css = emitThemeCss(map);
    const failures: string[] = [];
    const lightBlock = css.slice(css.indexOf(':root'), css.indexOf('.dark'));
    const darkBlock = css.slice(css.indexOf('.dark'));

    (['light', 'dark'] as ThemeMode[]).forEach(mode => {
      const block = mode === 'light' ? lightBlock : darkBlock;

      SEMANTIC_TOKENS.forEach(token => {
        // 暗色块是差异块：缺声明即沿用亮色值
        const declaration =
          block.match(new RegExp(`--${token}: var\\(--([\\w-]+)\\);`))?.[1] ??
          (mode === 'dark' ? lightBlock.match(new RegExp(`--${token}: var\\(--([\\w-]+)\\);`))?.[1] : undefined);

        if (!declaration) {
          return;
        }

        // CSS 侧：变量指向调色板级别（`zinc-100`）或简单色（`white` / `black`）；
        // border 族还要乘上它自己的 alpha 伴生变量（§3.4 的消费形态），
        // 所以这里从发射结果里读 alpha 而不是照抄实现
        const fromCss = (() => {
          const channel =
            declaration === 'white' || declaration === 'black'
              ? simpleColor(declaration, 'hsl')
              : (() => {
                  const segments = declaration.split('-');
                  const level = Number(segments.pop());

                  return paletteColor(segments.join('-') as never, level as never, 'hsl');
                })();
          const alphaPattern = new RegExp(`--${token}-alpha: ([\\d.]+);`);
          const alphaSource =
            block.match(alphaPattern)?.[1] ?? (mode === 'dark' ? lightBlock.match(alphaPattern)?.[1] : undefined);
          const alpha = alphaSource === undefined ? 1 : Number(alphaSource);

          return alpha >= 1 ? channel : (channel ?? '').replace(/\)$/, ` / ${alpha})`);
        })();
        const fromJs = resolveTokenColor(DEFAULTS, token, mode, 'hsl');

        if (fromCss !== fromJs) {
          failures.push(`${mode} ${token}: css=${fromCss} js=${fromJs}`);
        }
      });
    });

    expect(failures).toEqual([]);
  });

  it('returns complete colors in both formats', () => {
    expect(resolveTokenColor(DEFAULTS, 'background', 'light', 'hsl')).toMatch(/^hsl\(/);
    expect(resolveTokenColor(DEFAULTS, 'background', 'light', 'oklch')).toMatch(/^oklch\(/);
    // mask 的浓度由伴生变量承载（0.25 亮 / 0.30 暗），解析函数与 CSS 同源地拼出它
    expect(resolveTokenColor(DEFAULTS, 'mask', 'light')).toBe('hsl(0 0% 0% / 0.25)');
    expect(resolveTokenColor(DEFAULTS, 'mask', 'dark')).toBe('hsl(0 0% 0% / 0.3)');
  });

  it('resolves every token of a mode as a complete color', () => {
    const colors = resolveThemeColors(DEFAULTS, 'dark');

    expect(Object.keys(colors).length).toBe(SEMANTIC_TOKENS.length);
    expect(Object.values(colors).every(value => /^(hsl|oklch)\(/.test(value))).toBe(true);
  });
});

describe('color-scheme (§4.4 of the audit: UA-drawn surfaces follow the theme)', () => {
  const map = resolveThemeMap(DEFAULTS);

  it('advertises the scheme per mode in class mode', () => {
    const css = emitThemeCss(map, { darkSelector: 'class' });
    const light = css.slice(css.indexOf(':root'), css.indexOf('.dark'));
    const dark = css.slice(css.indexOf('.dark'));

    expect(light).toContain('color-scheme: light;');
    expect(dark).toContain('color-scheme: dark;');
  });

  it('lets the UA pick in media mode', () => {
    const css = emitThemeCss(map, { darkSelector: 'media' });
    const dark = css.slice(css.indexOf('@media'));

    expect(css).toContain('color-scheme: light dark;');
    // 注意：`@media (prefers-color-scheme: dark)` 本身包含子串，必须按声明匹配
    expect(dark).not.toMatch(/^\s*color-scheme:/m);
  });

  it('follows a custom selector and a custom style target', () => {
    const css = emitThemeCss(map, {
      darkSelector: '[data-theme="dark"]',
      styleTarget: 'html'
    });

    expect(css.startsWith('html {')).toBe(true);
    expect(css).toContain('[data-theme="dark"] {');
    expect(css).toContain('color-scheme: dark;');
  });
});
