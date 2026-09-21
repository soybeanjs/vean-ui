import { describe, expect, it } from 'vitest';
import { tailwindChromaticPaletteKeys } from '@soybeanjs/colord/palette';
import {
  resolveRadiusValue,
  resolveSizeValue,
  resolveSpacingValue,
  isThemeSpacing,
  isPaletteLevelRef,
  getDarkSelector
} from '../src/shared';
import {
  DEFAULT_OPTIONS,
  SPACING_GRID,
  THEME_RADIUS,
  THEME_SIZE,
  THEME_SPACING,
  THEME_FONT_HEADING,
  THEME_FONT_MONO,
  THEME_FONT_SANS,
  THEME_FONT_SERIF,
  themeRadiusKeys,
  themeFontKeys
} from '../src/defaults';
import { generatePaletteCss, emitThemeCss, resolveThemeMap, resolveTokenColor } from '../src/index';
import {
  RADIUS_RUNG_KEYS,
  SPACING_GRID_COEFFICIENTS,
  SPACING_RUNGS,
  LITERAL_DEFAULTS,
  resolveFontValue
} from '../src/literals';
import { NEUTRAL_PALETTES, PALETTE_KEYS, isNeutralFamily } from '../src/palette';
import { FEEDBACK_SCHEMES, feedbackScheme, splitLevelRef } from '../src/schemes';
import { CHART_RAMP, CHART_TOKENS } from '../src/semantic';
import type { ColorValue, PaletteKey, SemanticToken, ThemeRadiusValue, TokenValue } from '../src/types';

/** the multiple a radius rung applies to the seed (`calc(var(--radius) * k)`; the seed itself is 1). */
const coefficientOf = (value: string): number => {
  const match = /^calc\(var\(--radius\) \* ([\d.]+)\)$/u.exec(value);

  return match ? parseFloat(match[1] as string) : 1;
};

/**
 * v2-only engine features: overrides, schemes, prefix, borderOpacity
 * and the base-token tables (docs/theme.md §3.6–§3.11, §4.2).
 */

describe('schemes drive the status and chart tokens', () => {
  it('reads the status palette from the feedback scheme', () => {
    const classic = resolveThemeMap({ base: 'zinc', primary: 'indigo', feedback: 'classic' });
    const vivid = resolveThemeMap({ base: 'zinc', primary: 'indigo', feedback: 'vivid' });

    expect(classic.light.success).toEqual({ kind: 'palette', palette: 'green', level: 500 });
    expect(vivid.light.success).toEqual({ kind: 'palette', palette: 'emerald', level: 500 });
    // 暗色的 solid 级别来自 scheme 自身（classic 暗色取 400）
    expect(classic.dark.success).toEqual({ kind: 'palette', palette: 'green', level: 400 });
  });

  it('keeps every scheme value on a real palette level', () => {
    // scheme 是数据，之前值类型是 `string`——写错色板名不会报错，只会静默产出
    // `var(--typo-500)`。这里用（同样按 colord 成员表校验的）`isPaletteLevelRef` 兜住。
    const invalid = Object.entries(FEEDBACK_SCHEMES).flatMap(([scheme, sides]) =>
      (['light', 'dark'] as const).flatMap(mode =>
        Object.entries(sides[mode])
          .filter(([, ref]) => !isPaletteLevelRef(ref))
          .map(([status, ref]) => `${scheme}.${mode}.${status} = ${ref}`)
      )
    );

    expect(invalid).toEqual([]);
  });

  it('derives the chart series from the primary palette, not a scheme', () => {
    const indigo = resolveThemeMap({ base: 'zinc', primary: 'indigo' });
    const violet = resolveThemeMap({ base: 'zinc', primary: 'violet' });

    // 五档取自 CHART_RAMP，且亮/暗两模式同值（色板层本身不区分模式）
    expect(CHART_TOKENS).toEqual(['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']);
    expect(CHART_RAMP).toEqual({
      'chart-1': 600,
      'chart-2': 500,
      'chart-3': 400,
      'chart-4': 300,
      'chart-5': 200
    });

    CHART_TOKENS.forEach(token => {
      const expected = { kind: 'palette', palette: 'indigo', level: CHART_RAMP[token] };

      expect(indigo.light[token]).toEqual(expected);
      expect(indigo.dark[token]).toEqual(expected);
    });

    // 换主色即换图表色（不再有独立的配色方案可与之冲突）
    expect(violet.light['chart-1']).toEqual({ kind: 'palette', palette: 'violet', level: 600 });
    expect(violet.dark['chart-5']).toEqual({ kind: 'palette', palette: 'violet', level: 200 });
  });

  it('falls back to the default scheme for unknown keys', () => {
    expect(feedbackScheme('nope')).toBe(FEEDBACK_SCHEMES.classic);
    expect(feedbackScheme(undefined).light.warning).toBe('amber.500');
  });

  it('exposes the scheme keys and level-ref helpers', () => {
    expect(Object.keys(FEEDBACK_SCHEMES)).toEqual(['classic', 'vivid', 'subtle', 'modern', 'professional']);
    expect(isPaletteLevelRef('zinc.200')).toBe(true);
    expect(isPaletteLevelRef('oklch(60% 0.2 250)')).toBe(false);
    expect(splitLevelRef('indigo.600')).toEqual({ palette: 'indigo', level: 600 });
  });
});

describe('overrides win outright', () => {
  it('applies a palette-level override to both the map and the CSS', () => {
    const map = resolveThemeMap({
      base: 'zinc',
      primary: 'indigo',
      overrides: { light: { primary: 'zinc.800' } }
    });
    const css = emitThemeCss(map);

    expect(map.light.primary).toEqual({ kind: 'palette', palette: 'zinc', level: 800 });
    expect(css).toContain('--primary: var(--zinc-800);');
  });

  it('encodes a complete color into the channels the tokens are consumed as', () => {
    const options = {
      base: 'zinc',
      primary: 'indigo',
      overrides: { light: { primary: 'oklch(60% 0.2 250)' } }
    } as const;
    const map = resolveThemeMap(options);
    const css = emitThemeCss(map);

    expect(map.light.primary).toEqual({ kind: 'color', value: 'oklch(60% 0.2 250)' });
    // 关键：发射的是**通道三元组**，不是完整色。token 的消费形态是
    // `hsl(var(--primary) / <alpha>)`——把 `oklch(...)` 原样塞进去会让每条
    // 声明在 computed-value 阶段失效，token 静默消失（实测于 Chromium，§4.2）
    expect(css).toContain('--primary: 204.994 100% 43.952%;');
    expect(css).not.toContain('--primary: oklch(');
    // JS 与 CSS 同源：解析函数把同一个完整色转成请求的格式
    expect(resolveTokenColor(options, 'primary', 'light', 'hsl')).toBe('hsl(204.994 100% 43.952%)');
    // oklch 形态走 colord 的 RGB 往返，是近似值（hsl 主题下以通道值为准）
    expect(resolveTokenColor(options, 'primary', 'light', 'oklch')).toMatch(/^oklch\(60% 0\.17/);
  });

  it('carries an override color alpha into the border companion', () => {
    // 主题指南里的写法（`border: 'oklch(100% 0 0 / 0.1)'`）必须真的得到 10% 白：
    // 通道里放不下 alpha，它落到数值伴生变量上；此前这条会被静默丢掉。
    const map = resolveThemeMap({ overrides: { light: { border: 'oklch(100% 0 0 / 0.1)' } } });
    const css = emitThemeCss(map);

    expect(css).toContain('--border: 180 100% 100%;');
    expect(css).toContain('--border-alpha: 0.1;');
    expect(resolveTokenColor({ overrides: { light: { border: 'oklch(100% 0 0 / 0.1)' } } }, 'border', 'light')).toBe(
      'hsl(180 100% 100% / 0.1)'
    );
  });

  it('accepts every documented override form and emits a channel triple for each', () => {
    // `ColorValue` 的四种形态（docs/theme.md §4.2）：palette.level 引用、简单键、
    // hsl()、oklch()。断言的是**契约**而不是逐字输出：CSS 侧永远是通道或引用，
    // JS 侧永远是可用的完整色。
    const forms: { token: SemanticToken; value: ColorValue }[] = [
      { token: 'card', value: 'stone.950' },
      { token: 'foreground', value: 'white' },
      { token: 'primary', value: 'hsl(238.732 83.529% 66.667%)' },
      { token: 'ring', value: 'oklch(58.5% 0.204 277.117 / 0.5)' },
      // hex 不在类型词汇内，但运行时（colord 能解析）仍接受——这里刻意用断言把它带进来
      { token: 'chart-1', value: '#6366f1' as ColorValue }
    ];

    const options = {
      overrides: { light: Object.fromEntries(forms.map(form => [form.token, form.value])) }
    } as never;
    const css = emitThemeCss(resolveThemeMap(options));

    forms.forEach(({ token, value }) => {
      const declaration = new RegExp(`--${token}: ([^;]+);`).exec(css)?.[1] ?? '';

      // CSS 侧只允许两种形态：对调色板级别的引用，或通道三元组——绝不是完整色
      expect(declaration, `${token} ← ${value}`).toMatch(/^(?:var\(--[\w-]+\)|[\d.]+ [\d.]+% [\d.]+%)$/);
      expect(resolveTokenColor(options, token, 'light'), `${token} ← ${value}`).toMatch(/^hsl\(/);
    });
  });

  it('ignores override keys outside the token contract', () => {
    // `overrides` 是公共字段而类型在运行时不存在：手写对象 / 老信封都可能带任意键。
    // 未知键若进入模式映射，会为不存在的 token 写声明；只覆盖单一模式时更糟——
    // 暗色差异块读不到该键，`renderValue(undefined)` 直接抛错（§6.2）
    const options = {
      base: 'zinc',
      primary: 'indigo',
      overrides: { light: { card: 'zinc.100', surface: 'zinc.200', ghost: 'zinc.300' } }
    } as never;
    const css = emitThemeCss(resolveThemeMap(options));

    expect(css).toContain('--card: var(--zinc-100);');
    ['--surface', '--ghost'].forEach(token => expect(css).not.toContain(token));
  });

  it('ignores override values the token layer cannot represent', () => {
    // 非法的 palette 引用曾经产出悬空 `var(--…-999)`，而 JS 侧返回空串——
    // 两边不一致；现在这类值被忽略，名义值原样保留。
    const cases = ['not-a-palette.999', 'zinc.999', 'transparent', 'inherit', 'not a color'];

    cases.forEach(value => {
      const options = { overrides: { light: { primary: value } } } as never;
      const css = emitThemeCss(resolveThemeMap(options));

      expect(css, value).toContain('--primary: var(--indigo-500);');
      expect(resolveTokenColor(options, 'primary', 'light'), value).toBe('hsl(238.7 83.5% 66.7%)');
    });

    // 形状校验本身也按 colord 的成员表：只有真实存在的色板与档位才算引用
    expect(isPaletteLevelRef('zinc.200')).toBe(true);
    expect(isPaletteLevelRef('indigo.950')).toBe(true);
    expect(isPaletteLevelRef('not-a-palette.200')).toBe(false);
    expect(isPaletteLevelRef('zinc.999')).toBe(false);
    expect(isPaletteLevelRef('zinc.abc')).toBe(false);
    expect(isPaletteLevelRef('oklch(60% 0.2 250)')).toBe(false);
  });

  it('applies an override as given, uncorrected and unreported', () => {
    // 引擎没有对比度护栏：覆盖值原样进映射表（`zinc.400` 在 {b}.50 页面上
    // 只有约 2.45:1），引擎既不修正也不报告——可读性是主题作者的事
    const options = {
      base: 'zinc',
      primary: 'indigo',
      overrides: { light: { foreground: 'zinc.400' } }
    } as const;
    const map = resolveThemeMap(options);

    expect(map.light.foreground).toEqual({ kind: 'palette', palette: 'zinc', level: 400 });
    expect(emitThemeCss(map)).toContain('--foreground: var(--zinc-400);');
    // 没有 report 字段这回事：映射表就是五个键（light / dark / alpha / literal）
    expect(Object.keys(map).sort()).toEqual(['alpha', 'dark', 'light', 'literal']);
  });
});

describe('token reference overrides', () => {
  it('copies the target token value at resolve time', () => {
    const options = {
      base: 'zinc',
      primary: 'indigo',
      overrides: {
        light: { primary: 'violet.700', ring: 'token.primary', 'sidebar-primary': 'token.primary' }
      }
    } as const;
    const map = resolveThemeMap(options);
    const primary = { kind: 'palette', palette: 'violet', level: 700 } as const;

    expect(map.light.primary).toEqual(primary);
    expect(map.light.ring).toEqual(primary);
    expect(map.light['sidebar-primary']).toEqual(primary);
    // 发射仍是通道/调色板引用，不是 `var(--primary)` 链——与颜色覆盖同一形态
    expect(emitThemeCss(map)).toContain('--ring: var(--violet-700);');
    expect(emitThemeCss(map)).toContain('--sidebar-primary: var(--violet-700);');
    expect(resolveTokenColor(options, 'ring', 'light')).toBe(resolveTokenColor(options, 'primary', 'light'));
  });

  it('follows a chain of references to a non-reference end', () => {
    const options = {
      overrides: {
        light: { primary: 'zinc.800', ring: 'token.sidebar-ring', 'sidebar-ring': 'token.primary' }
      }
    } as const;
    const map = resolveThemeMap(options);
    const expected = { kind: 'palette', palette: 'zinc', level: 800 } as const;

    expect(map.light['sidebar-ring']).toEqual(expected);
    expect(map.light.ring).toEqual(expected);
  });

  it('ignores self-references the same way as any other invalid value', () => {
    // 自引用不是环的特例开关：与 `zinc.999` / `token.ghost` 一样，丢弃并保留名义值
    const options = {
      overrides: { light: { primary: 'token.primary', ring: 'token.ghost' } }
    } as never;
    const css = emitThemeCss(resolveThemeMap(options));

    expect(css).toContain('--primary: var(--indigo-500);');
    expect(css).toContain('--ring: var(--indigo-500);');
    expect(resolveTokenColor(options, 'primary', 'light')).toBe('hsl(238.7 83.5% 66.7%)');
  });

  it('drops every token in a reference cycle', () => {
    const options = {
      overrides: { light: { border: 'token.input', input: 'token.border' } }
    } as const;
    const map = resolveThemeMap(options);
    const nominalBorder = { kind: 'palette', palette: 'zinc', level: 200 } as const;

    expect(map.light.border).toEqual(nominalBorder);
    expect(map.light.input).toEqual(nominalBorder);
    // 名义 alpha 不变（环上没有可拷贝的目标）
    expect(map.alpha.border.light).toBe(1);
    expect(map.alpha.input.light).toBe(1);
    expect(map.alpha.input.dark).toBe(0.15);
  });

  it('copies the alpha companion when both ends own one', () => {
    const options = {
      overrides: { light: { border: 'oklch(100% 0 0 / 0.1)', input: 'token.border' } }
    } as const;
    const map = resolveThemeMap(options);
    const css = emitThemeCss(map);

    expect(map.light.input).toEqual(map.light.border);
    expect(map.alpha.border.light).toBe(0.1);
    expect(map.alpha.input.light).toBe(0.1);
    expect(css).toContain('--input-alpha: 0.1;');
    expect(resolveTokenColor(options, 'input', 'light')).toBe('hsl(180 100% 100% / 0.1)');
  });

  it('adopts the target design alpha when the target has no colour override', () => {
    // dark 下 border 设计 alpha 0.1、input 是 0.15：引用后两者必须同浓度
    const map = resolveThemeMap({ overrides: { dark: { input: 'token.border' } } });

    expect(map.alpha.border.dark).toBe(0.1);
    expect(map.alpha.input.dark).toBe(0.1);
    expect(map.dark.input).toEqual(map.dark.border);
  });

  it('keeps the source alpha rules when the target owns no companion', () => {
    const map = resolveThemeMap({ overrides: { light: { input: 'token.primary' } } });

    expect(map.light.input).toEqual(map.light.primary);
    // 非 alpha 目标不传染浓度：input 仍走自己的 ALPHA_RULES
    expect(map.alpha.input.light).toBe(1);
    expect(map.alpha.input.dark).toBe(0.15);
  });

  it('ignores reference values outside the token contract', () => {
    const options = { overrides: { light: { ring: 'token.ghost', sidebar: 'token.' } } } as never;
    const map = resolveThemeMap(options);
    const nominalRing = { kind: 'palette', palette: 'indigo', level: 500 } as const;

    expect(map.light.ring).toEqual(nominalRing);
    expect(map.light.sidebar).toEqual(map.light.background);
  });
});

describe('emission options', () => {
  const map = resolveThemeMap({ base: 'zinc', primary: 'indigo' });

  it('emits channels and references only — never a complete color', () => {
    // 没有 `solidVars` 这类开关：颜色只有"裸通道 + 引用"一种形态，任何 token 都不
    // 会额外产出一个完整色变量（需要完整色的 JS 场景走 `resolveTokenColor`）
    const css = emitThemeCss(map);

    expect(css).not.toContain('-solid:');
    expect(css).not.toMatch(/^\s*--(primary|background|card):\s*(hsl|oklch)\(/m);
  });

  it('honors a custom prefix', () => {
    expect(emitThemeCss(map, { prefix: 'sui' })).toContain('--sui-background: var(--zinc-50);');
  });

  it('supports the media dark selector', () => {
    expect(emitThemeCss(map, { darkSelector: 'media' })).toContain('@media (prefers-color-scheme: dark)');
    expect(getDarkSelector('media')).toBe('@media (prefers-color-scheme: dark)');
    expect(getDarkSelector('[data-theme="dark"]')).toBe('[data-theme="dark"]');
  });

  it('scales the border alpha with borderOpacity', () => {
    const full = resolveThemeMap({ base: 'zinc', primary: 'indigo' });
    const half = resolveThemeMap({ base: 'zinc', primary: 'indigo', borderOpacity: 0.5 });

    expect(full.alpha.border).toEqual({ light: 1, dark: 0.1 });
    expect(half.alpha.border).toEqual({ light: 0.5, dark: 0.05 });
    expect(emitThemeCss(half)).toContain('--border-alpha: 0.5;');
  });
});

describe('palette data source', () => {
  it('partitions the built-in palettes into the neutral and chromatic families', () => {
    // 家族清单来自 colord（tailwindNeutralPaletteKeys / tailwindChromaticPaletteKeys）：
    // 二者必须恰好划分 PALETTE_KEYS，否则 isNeutralFamily 的判定就会与色板表脱节
    expect([...NEUTRAL_PALETTES, ...tailwindChromaticPaletteKeys]).toEqual([...PALETTE_KEYS]);
    expect(new Set(PALETTE_KEYS).size).toBe(PALETTE_KEYS.length);

    const neutral = new Set<string>(NEUTRAL_PALETTES);

    tailwindChromaticPaletteKeys.forEach(key => expect(neutral.has(key)).toBe(false));
    PALETTE_KEYS.forEach(key => expect(isNeutralFamily(key)).toBe(neutral.has(key)));
  });
});

describe('palette layer formats and base tokens', () => {
  it('emits oklch channels that are wrapper-free', () => {
    const css = generatePaletteCss({ format: 'oklch' });

    expect(css).toContain('--white: 100% 0 0;');
    expect(css).not.toContain('oklch(');
    expect(css).toContain('--zinc-100:');
  });

  it('resolves the size and radius presets', () => {
    expect(resolveSizeValue('md')).toBe('16px');
    expect(resolveSizeValue('20px')).toBe('20px');
    expect(resolveSizeValue(undefined)).toBe('16px');
    expect(resolveRadiusValue('md')).toBe('0.5rem');
    expect(resolveRadiusValue('1rem')).toBe('1rem');
    expect(THEME_SIZE.md).toBe(16);
    expect(THEME_RADIUS.md).toBe('0.5rem');
    // 预设表与 `LITERAL_DEFAULTS` 的种子是同一个值：选 `md` 不改变默认外观
    expect(THEME_RADIUS.md).toBe(LITERAL_DEFAULTS.radius);
    // 九档以 0.125rem 为步长，与默认种子下 rung 的系数倍落在同一组长度上
    expect(THEME_RADIUS['2xs']).toBe('0.125rem');
    expect(THEME_RADIUS['4xl']).toBe('1.125rem');
    expect(Object.keys(THEME_RADIUS)).toEqual(RADIUS_RUNG_KEYS);
  });

  it('keeps the documented defaults together', () => {
    expect(DEFAULT_OPTIONS).toMatchObject({
      base: 'zinc',
      primary: 'indigo',
      feedback: 'classic',
      surfaceStyle: 'layered',
      prefix: false,
      size: 'md',
      radius: 'md',
      spacing: 'default'
    });
    // font 无单一预设键：缺省即回落 LITERAL_DEFAULTS 系统栈
    expect(DEFAULT_OPTIONS.font).toBeUndefined();
  });

  it('resolves ThemeOptions.font into the four typography literals', () => {
    const system = resolveThemeMap({}).literal;
    const themed = resolveThemeMap({
      font: {
        sans: 'Inter',
        heading: 'Playfair Display, Georgia, serif',
        mono: 'JetBrains Mono',
        serif: 'Lora'
      }
    }).literal;

    // 单一家族名：前缀到系统栈，保证仍能降级
    expect(themed['font-sans']).toBe(`Inter, ${system['font-sans']}`);
    expect(themed['font-mono']).toBe(`JetBrains Mono, ${system['font-mono']}`);
    expect(themed['font-serif']).toBe(`Lora, ${system['font-serif']}`);
    // 已是完整 stack：原样使用
    expect(themed['font-heading']).toBe('Playfair Display, Georgia, serif');
    // 四条臂彼此独立：serif 是**根角色**，不是 heading 的别名
    expect(themed['font-serif']).not.toBe(themed['font-heading']);
    // serif 的缺省栈是 serif 系（`ui-serif`），与 sans 的缺省栈不同族
    expect(system['font-serif']).toContain('ui-serif');
    expect(system['font-serif']).not.toBe(system['font-sans']);
    // 未声明的臂保持默认
    expect(system['font-sans']).toBe(resolveFontValue('sans', undefined));
    expect(resolveFontValue('sans', 'Inter')).toBe(`Inter, ${LITERAL_DEFAULTS['font-sans']}`);
    expect(resolveFontValue('serif', 'Lora')).toBe(`Lora, ${LITERAL_DEFAULTS['font-serif']}`);
    // 发射层带上覆盖后的值
    expect(emitThemeCss(resolveThemeMap({ font: { sans: 'Inter' } }))).toContain(
      `--font-sans: Inter, ${LITERAL_DEFAULTS['font-sans']};`
    );
  });

  it('carries the literal layer into the emitted CSS', () => {
    const css = emitThemeCss(resolveThemeMap({ base: 'zinc', primary: 'indigo', radius: 'lg' }));

    expect(css).toContain('--radius: 0.625rem;');
    expect(css).toContain('--radius-2xl: calc(var(--radius) * 1.75);');
    expect(css).toContain('--radius-4xl: calc(var(--radius) * 2.25);');
  });

  it('keeps the font catalog aligned with shadcn (26 families, three root roles)', () => {
    // 对齐 shadcn 的 `FONT_DEFINITIONS`：同样的 26 个字族、同样的三分类。
    // 这张清单是**契约**（customizer 的下拉、vean.json 的 picklist、docs 的字体
    // 加载都读它），所以逐类冻结，任何增删都必须有意识地改这里。
    expect(Object.keys(THEME_FONT_SANS)).toEqual([
      'system',
      'geist',
      'inter',
      'noto-sans',
      'nunito-sans',
      'figtree',
      'roboto',
      'raleway',
      'dm-sans',
      'public-sans',
      'outfit',
      'oxanium',
      'manrope',
      'space-grotesk',
      'montserrat',
      'ibm-plex-sans',
      'source-sans-3',
      'instrument-sans'
    ]);
    expect(Object.keys(THEME_FONT_SERIF)).toEqual([
      'system',
      'noto-serif',
      'roboto-slab',
      'merriweather',
      'lora',
      'playfair-display',
      'eb-garamond',
      'instrument-serif'
    ]);
    expect(Object.keys(THEME_FONT_MONO)).toEqual(['system', 'jetbrains-mono', 'geist-mono']);

    // 可加载清单 = 三条根角色去掉 `system`，共 26 个（shadcn 的数量）
    expect(themeFontKeys).toHaveLength(26);
    expect(themeFontKeys).not.toContain('system');

    // heading 是「任意字族」的独立角色：它必须覆盖三条根角色的全部家族
    for (const key of themeFontKeys) {
      expect(THEME_FONT_HEADING).toHaveProperty(key);
    }
  });

  it('derives the radius scale as multiples of the seed', () => {
    const { literal } = resolveThemeMap({});

    // `md` 是种子的直接引用（不是 0.8 倍）：刻度中央与种子同值，读数最直观
    expect(literal['radius-md']).toBe('var(--radius)');
    expect(literal['radius-2xs']).toBe('calc(var(--radius) * 0.25)');
    expect(literal['radius-xs']).toBe('calc(var(--radius) * 0.5)');
    expect(literal['radius-sm']).toBe('calc(var(--radius) * 0.75)');
    expect(literal['radius-lg']).toBe('calc(var(--radius) * 1.25)');
    expect(literal['radius-xl']).toBe('calc(var(--radius) * 1.5)');
    expect(literal['radius-2xl']).toBe('calc(var(--radius) * 1.75)');
    expect(literal['radius-3xl']).toBe('calc(var(--radius) * 2)');
    expect(literal['radius-4xl']).toBe('calc(var(--radius) * 2.25)');
    expect(literal['radius-none']).toBe('0');
    expect(literal['radius-full']).toBe('9999px');

    // 种子是整条刻度的唯一输入：换种子后 rung 仍然只引用它（系数与种子无关）
    const large = resolveThemeMap({ radius: '1rem' }).literal;

    expect(large['radius']).toBe('1rem');
    expect(large['radius-md']).toBe('var(--radius)');
  });

  it('keeps every radius rung a positive multiple of the seed', () => {
    const coefficients = RADIUS_RUNG_KEYS.map(rung => coefficientOf(resolveThemeMap({}).literal[`radius-${rung}`]));

    // 系数表（文档化的刻度）：md = 种子本身，逐档 +0.25
    expect(coefficients).toEqual([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25]);
    // 单调递增（内层永远比外层小/相等）
    expect([...coefficients].sort((a, b) => a - b)).toEqual(coefficients);
    expect(coefficients.every(coefficient => coefficient > 0)).toBe(true);

    // 回归守卫（旧"种子 ± 固定偏移"制的缺陷）：**任何**预设与原始种子下，
    // 每一档都必须是正值——负 border-radius 属非法 computed value，会静默变 0
    const seeds: string[] = [...themeRadiusKeys, '0.25rem', '0.3rem', '1px', '2px', '2rem'];
    const degenerate: string[] = [];

    seeds.forEach(seed => {
      const { literal } = resolveThemeMap({ radius: seed as ThemeRadiusValue });
      const value = parseFloat(literal.radius);

      RADIUS_RUNG_KEYS.forEach((rung, index) => {
        if (value * (coefficients[index] as number) <= 0) {
          degenerate.push(`${seed}/${rung}`);
        }
      });
    });

    expect(degenerate).toEqual([]);

    // 默认种子下逐档的字面值（文档化的刻度）：2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18px
    const documentedPx = [2, 4, 6, 8, 10, 12, 14, 16, 18];
    const defaultSeed = parseFloat(resolveThemeMap({}).literal.radius) * 16;

    coefficients.forEach((coefficient, index) =>
      expect(defaultSeed * coefficient).toBeCloseTo(documentedPx[index] as number, 10)
    );
  });

  it('publishes the spacing scale as grid multiples', () => {
    const { literal } = resolveThemeMap({});
    // spacing 以 UnoCSS 的 theme.spacing 为底（同名同值），向下扩充 6xs…2xs 与 md，
    // 合成一条 2px 网格
    const spacingPx = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128];

    expect(SPACING_RUNGS).toEqual([
      '6xs',
      '5xs',
      '4xs',
      '3xs',
      '2xs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
      '7xl',
      '8xl',
      '9xl'
    ]);
    expect(RADIUS_RUNG_KEYS).toEqual(['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']);

    // 间距族只有一个变量（旋钮），18 档是系数而不是 token：一个变量配 18 条声明
    // 而唯一读者是适配器自己，所以档位值进 `theme.spacing` 映射（§3.11）
    expect(literal['spacing-unit']).toBe(SPACING_GRID);
    expect(Object.keys(literal).filter(key => key.startsWith('spacing-'))).toEqual(['spacing-unit']);

    // 系数 × 网格 = 文档化的字面值（默认单位下零视觉变化）：class 名里的数字
    // 与系数是同一个数，所以 `p-4` 永远等于 `spacing-md`
    SPACING_RUNGS.forEach((rung, index) => {
      const coefficient = spacingPx[index] / 4;

      expect(SPACING_GRID_COEFFICIENTS[rung]).toBe(coefficient);
      expect(coefficient * parseFloat(SPACING_GRID)).toBeCloseTo(spacingPx[index] / 16, 10);
    });

    // UnoCSS 定义过的档位保持它的取值；扩充档与它无缝相接
    // （同名同值的上游守卫在 @vean/unocss 的适配器测试里）
    expect(SPACING_GRID_COEFFICIENTS['2xs'] * 0.25).toBeCloseTo(0.625, 10);
    expect(SPACING_GRID_COEFFICIENTS.xs * 0.25).toBeCloseTo(0.75, 10);
    expect(SPACING_GRID_COEFFICIENTS.md * 0.25).toBeCloseTo(1, 10);
    expect(SPACING_GRID_COEFFICIENTS.lg * 0.25).toBeCloseTo(1.125, 10);

    // 控件高度不进字面量层（docs/space-control-scale.md §3.1）：8 档本来就等于数字
    // height 刻度（`h-5`…`h-14`），且库内零消费
    expect(Object.keys(literal).filter(key => key.includes('control'))).toEqual([]);
  });

  it('resolves the spacing unit from a preset or a raw grid multiplier', () => {
    const literalOf = (spacing: Parameters<typeof resolveSpacingValue>[0]) => resolveThemeMap({ spacing }).literal;

    // 预设档：四个档位，1 就是默认
    expect(THEME_SPACING).toEqual({ compact: 0.75, default: 1, relaxed: 1.25, spacious: 1.5 });
    expect(resolveSpacingValue('default')).toBe(SPACING_GRID);
    expect(resolveSpacingValue('compact')).toBe('calc(0.25rem * 0.75)');
    expect(resolveSpacingValue('relaxed')).toBe('calc(0.25rem * 1.25)');
    expect(resolveSpacingValue('spacious')).toBe('calc(0.25rem * 1.5)');

    // 任意倍率（与 ThemeSizeValue / ThemeRadiusValue 同一形态）
    expect(resolveSpacingValue(1.4)).toBe('calc(0.25rem * 1.4)');

    // 非法值回落到网格基座，而不是把整族清零或撑爆
    expect(resolveSpacingValue(0)).toBe(SPACING_GRID);
    expect(resolveSpacingValue(-2)).toBe(SPACING_GRID);
    expect(resolveSpacingValue(Number.NaN)).toBe(SPACING_GRID);
    expect(resolveSpacingValue('huge' as never)).toBe(SPACING_GRID);
    expect(isThemeSpacing('compact')).toBe(true);
    expect(isThemeSpacing('unit')).toBe(false);

    // 单位是间距族唯一的变量：改单位只动这一个声明，档位与数字类都从它派生
    expect(literalOf('spacious')['spacing-unit']).toBe('calc(0.25rem * 1.5)');
    expect(Object.keys(literalOf('spacious')).filter(key => key.startsWith('spacing-'))).toEqual(['spacing-unit']);
    // 其余族不受影响
    expect(literalOf('spacious')['size']).toBe('16px');
    expect(literalOf('spacious')['radius-md']).toBe('var(--radius)');
  });

  it('exposes the resolved literal layer on the map', () => {
    const map = resolveThemeMap({ base: 'zinc', primary: 'indigo', size: 'lg' });
    const smoke: SemanticToken[] = ['background', 'primary', 'sidebar'];
    const values: TokenValue[] = smoke.map(token => map.light[token] as TokenValue);

    expect(map.literal.size).toBe('18px');
    expect(values.every(value => value !== undefined)).toBe(true);
    expect(DEFAULT_OPTIONS.base satisfies PaletteKey).toBe('zinc');
  });
});
