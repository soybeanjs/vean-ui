import { describe, expect, it } from 'vitest';
import { createGenerator } from 'unocss';
import { theme as unoTheme } from '@unocss/preset-mini';
import { SPACING_GRID_COEFFICIENTS, SPACING_RUNGS } from '@vean/theme';
import type { SpacingRung } from '@vean/theme';
import { presetUi } from '../src/preset';
import { buildThemeColors, buildThemeEntries } from '../src/theme';

/**
 * The token adapter (docs/theme.md §5).
 *
 * The assertions that matter:
 * - semantic + palette colors are `hsl(var(--…-x) / <alpha-value>)` so the
 *   opacity modifier survives (a bare `var()` drops it silently — measured);
 * - the preflight carries the static palette layer and the default alias block,
 *   so the tokens resolve with no runtime JS;
 * - the dimension / motion / layering keys read the token literals.
 */

const generate = async (options: Parameters<typeof presetUi>[0], classes: string): Promise<string> => {
  const uno = await createGenerator({ presets: presetUi(options) } as never);
  const { css } = await uno.generate(classes, { preflights: false });

  return css;
};

const preflightOf = (options: Parameters<typeof presetUi>[0]): string => {
  const preset = presetUi(options).find(item => item.name === 'vean-uno') as {
    preflights: { getCSS: () => string }[];
  };

  return preset.preflights.map(preflight => preflight.getCSS()).join('\n');
};

describe('theme adapter — colors', () => {
  it('maps semantic tokens to alpha-capable channel references', async () => {
    const css = await generate({}, 'bg-background text-muted-foreground border-border bg-primary/50');

    expect(css).toContain('hsl(var(--background) / var(--un-bg-opacity))');
    expect(css).toContain('hsl(var(--muted-foreground) / var(--un-text-opacity))');
    expect(css).toContain('hsl(var(--primary) / 0.5)');
  });

  it('composes the border family with its numeric alpha companion', async () => {
    const css = await generate({}, 'border-border border-sidebar-border border-input border-border/60');

    // border / sidebar-border / input 暗色是半透明白：只发裸通道就会画成纯白发丝线，
    // 所以它们的值带上各自的 alpha 伴生变量（§3.4）
    expect(css).toContain('--un-border-opacity:var(--border-alpha, 1)');
    expect(css).toContain('--un-border-opacity:var(--sidebar-border-alpha, 1)');
    expect(css).toContain('--un-border-opacity:var(--input-alpha, 1)');
    expect(css).toContain('border-color:hsl(var(--border) / var(--un-border-opacity))');
    // 透明度修饰符仍然生效：写 `/60` 时 alpha 就是字面值，伴生变量让位
    expect(css).toContain('border-color:hsl(var(--border) / 0.6)');
  });

  it('maps the role ramps to theme-following utilities', async () => {
    const css = await generate({}, 'bg-primary-500/30 text-destructive-600 border-success-100');

    expect(css).toContain('hsl(var(--primary-500) / 0.3)');
    expect(css).toContain('hsl(var(--destructive-600) / var(--un-text-opacity))');
    expect(css).toContain('var(--success-100)');
  });

  it('maps every token family', async () => {
    const css = await generate(
      {},
      'bg-card bg-popover bg-secondary text-muted-foreground bg-destructive text-destructive-foreground border-sidebar-border bg-sidebar text-sidebar-foreground bg-carbon text-foreground'
    );

    expect(css).toContain('var(--card)');
    expect(css).toContain('var(--popover)');
    expect(css).toContain('var(--secondary)');
    expect(css).toContain('var(--muted-foreground)');
    expect(css).toContain('var(--destructive)');
    expect(css).toContain('var(--destructive-foreground)');
    expect(css).toContain('var(--sidebar-border)');
    expect(css).toContain('var(--sidebar)');
    expect(css).toContain('var(--sidebar-foreground)');
    expect(css).toContain('var(--carbon)');
  });

  it('composes the mask with its own concentration', async () => {
    const css = await generate({}, 'bg-mask bg-mask/80');

    // mask 与边框族同一机制：通道在 `--mask`，浓度在 `--mask-alpha`
    // （0.25 亮 / 0.30 暗），组件里不再出现 `bg-black/25 dark:bg-black/30`
    expect(css).toContain('--un-bg-opacity:var(--mask-alpha, 1)');
    expect(css).toContain('background-color:hsl(var(--mask) / var(--un-bg-opacity))');
    // 显式修饰符覆盖浓度（更重的遮罩仍是同一个 token）：媒体查询外的深遮罩用它
    expect(css).toContain('background-color:hsl(var(--mask) / 0.8)');
  });

  it('routes the 26 built-in palettes through the injected palette layer', async () => {
    const css = await generate({}, 'bg-indigo-500/30 text-zinc-950 bg-orange-600 border-sky-400');

    expect(css).toContain('hsl(var(--indigo-500) / 0.3)');
    expect(css).toContain('hsl(var(--zinc-950) / var(--un-text-opacity))');
    expect(css).toContain('var(--orange-600)');
    expect(css).toContain('var(--sky-400)');
  });
});

describe('theme adapter — preflight', () => {
  it('ships the static palette layer plus the default alias block', () => {
    const css = preflightOf({ uiCSS: true });

    // Layer 1（静态调色板层）
    expect(css).toContain('--slate-50:');
    expect(css).toContain('--indigo-600:');
    expect(css).toContain('--white: 0 0% 100%;');
    expect(css).toContain('--black: 0 0% 0%;');
    // Layer 2（默认主题别名块）
    expect(css).toContain('--background: var(--zinc-50);');
    expect(css).toContain('--primary: var(--indigo-500);');
    // 角色 ramp（50–950）：指向角色背后的调色板，主题切换随别名块整体重发
    expect(css).toContain('--primary-500: var(--indigo-500);');
    expect(css).toContain('--destructive-100: var(--red-100);');
    expect(css).toContain('--warning-950: var(--amber-950);');
    expect(css).toContain('--border-alpha: 1;');
    expect(css).toContain('--sidebar-border-alpha: 1;');
    expect(css).toContain('--input-alpha: 1;');
    expect(css).toContain('--radius: 0.5rem;');
    // 静态默认层降权到零特异性：运行时/首帧快照用普通选择器即可胜出，
    // 不依赖源码顺序（head 内联脚本无法排在样式表之后），也不用 `!important`
    expect(css).toContain(':where(:root) {');
    expect(css).toContain(':where(.dark) {');
    expect(css).not.toContain('!important');
  });

  it('follows the preset options (base / primary / size / radius)', () => {
    const css = preflightOf({
      uiCSS: true,
      base: 'slate',
      primary: 'emerald',
      size: 'lg',
      radius: 'lg'
    });

    expect(css).toContain('--background: var(--slate-50);');
    expect(css).toContain('--primary: var(--emerald-500);');
    expect(css).toContain('--primary-500: var(--emerald-500);');
    expect(css).toContain('--size: 18px;');
    expect(css).toContain('--radius: 0.625rem;');
  });

  it('is omitted unless uiCSS is requested', () => {
    expect(preflightOf({})).not.toContain('--background');
    expect(preflightOf({})).not.toContain('--indigo-600');
  });
});

describe('theme adapter — helpers', () => {
  it('exposes the semantic and palette color maps', () => {
    const colors = buildThemeColors('hsl');

    expect(colors.background).toBe('hsl(var(--background) / <alpha-value>)');
    expect(colors.mask).toBe('hsl(var(--mask) / var(--mask-alpha, 1))');
    expect((colors.indigo as Record<string, string>)['600']).toBe('hsl(var(--indigo-600) / <alpha-value>)');
  });

  it('respects a custom token prefix', () => {
    const colors = buildThemeColors('hsl', 'acme');

    expect(colors.background).toBe('hsl(var(--acme-background) / <alpha-value>)');

    const entries = buildThemeEntries('acme');

    expect(entries.borderRadius.md).toBe('var(--acme-radius-md)');
  });
});

describe('theme adapter — global base styles', () => {
  it('reads the theme variables so the page and the utilities share one source', () => {
    const css = preflightOf({ globalCSS: true, uiCSS: true });

    expect(css).toContain('body{color:hsl(var(--foreground));background-color:hsl(var(--background))}');
    expect(css).toContain('border-color:hsl(var(--border) / var(--border-alpha, 1))');
    expect(css).toContain('html{font-size:var(--size)}');
  });
});

describe('theme adapter — dimension / layering keys', () => {
  it('maps the neutral subset onto token literals', async () => {
    const css = await generate({}, 'rounded-md text-sm font-sans z-base border ring');

    expect(css).toContain('border-radius:var(--radius-md)');
    expect(css).toContain('font-size:0.875rem;line-height:1.25rem');
    expect(css).toContain('font-family:var(--font-sans)');
    expect(css).toContain('z-index:var(--z-base)');
    expect(css).toContain('border-width:var(--border-width)');
    expect(css).toContain('--un-ring-width:var(--ring-width)');
  });

  it('extends the type scale by three rungs and leaves the rest to UnoCSS', async () => {
    // 字号/行高归 UnoCSS——`xs`…`9xl` 是 Wind3 自己的元组（deep merge），
    // 适配器只补 Wind3 起点的下面三档，它们也是库内实际写的那三个类
    const css = await generate({}, 'text-4xs text-3xs text-2xs text-xs text-sm text-2xl text-9xl');

    expect(css).toContain('font-size:0.375rem;line-height:0.5rem'); // 4xs（本库补的）
    expect(css).toContain('font-size:0.5rem;line-height:0.625rem'); // 3xs
    expect(css).toContain('font-size:0.625rem;line-height:0.75rem'); // 2xs
    expect(css).toContain('font-size:0.75rem;line-height:1rem'); // xs（Wind3）
    expect(css).toContain('font-size:0.875rem;line-height:1.25rem'); // sm
    expect(css).toContain('font-size:1.5rem;line-height:2rem'); // 2xl
    expect(css).toContain('font-size:8rem;line-height:1'); // 9xl
    // 适配器只贡献三档（Wind3 的 `xs`…`9xl` 是它自己的，deep merge 后仍生效）
    expect(buildThemeEntries().fontSize).toEqual({
      '4xs': ['0.375rem', '0.5rem'],
      '3xs': ['0.5rem', '0.625rem'],
      '2xs': ['0.625rem', '0.75rem']
    });
  });

  it('leaves shadows and motion to UnoCSS (no token behind them)', async () => {
    // 阴影与动效不是主题 token（§5.3）：这两族一律由 UnoCSS
    // 自己的取值输出，因此改主题不可能悄悄改掉某个组件的动效或高度感
    const css = await generate({}, 'shadow-sm shadow-md duration-200 ease-out ease-in-out');

    expect(css).toContain('--un-shadow');
    expect(css).toContain('transition-duration:200ms');
    expect(css).toContain('transition-timing-function:cubic-bezier(0, 0, 0.2, 1)');
    expect(css).not.toContain('--shadow-');
    expect(css).not.toContain('--duration-');
    expect(css).not.toContain('--ease-');
  });

  it('routes the numeric spacing coefficients through the grid unit', async () => {
    const css = await generate({}, 'p-4 py-1.25 gap-3 px-2.5 -mt-4 space-x-3 p-0 p-64');

    // 数字工具类与具名档同源：都读 `--spacing-unit`，所以一个 spacing 选项
    // 能同时带动 `p-4` 与 `p-md`（class 名里的数字就是网格系数）
    expect(css).toContain('padding:calc(var(--spacing-unit) * 4)');
    expect(css).toContain('padding-top:calc(var(--spacing-unit) * 1.25)');
    expect(css).toContain('gap:calc(var(--spacing-unit) * 3)');
    expect(css).toContain('padding-left:calc(var(--spacing-unit) * 2.5)');
    expect(css).toContain('margin-top:calc(calc(var(--spacing-unit) * 4) * -1)');
    expect(css).toContain('margin-left:calc(calc(var(--spacing-unit) * 3)');
    // 0 保持字面 `0`；映射区间之外回落到 UnoCSS 的 `n × 0.25rem`
    expect(css).toContain('padding:0');
    expect(css).toContain('padding:calc(var(--spacing-unit) * 64)');
  });

  it('registers the sub-grid coefficients so half steps follow the unit too', async () => {
    const css = await generate({}, 'p-0.625 py-0.875 my-0.4375 gap-1.125 px-1.875');

    // 网格单位（系数 1 = 0.25rem）不是枚举步长：只走单位的多重数会把库里 77 处
    // 八分之一 / 十六分之一档漏给 preset-mini 硬编码的 `n × 0.25rem`。默认主题下
    // 两者数值相同，所以它只在改了 `spacing` 之后显形——`p-0.625` 冻结成
    // `0.15625rem` 而 `p-0.75` 跟着旋钮走（docs/space-control-scale.md §1.4）
    expect(css).toContain('padding:calc(var(--spacing-unit) * 0.625)');
    expect(css).toContain('padding-top:calc(var(--spacing-unit) * 0.875)');
    expect(css).toContain('margin-top:calc(var(--spacing-unit) * 0.4375)');
    expect(css).toContain('gap:calc(var(--spacing-unit) * 1.125)');
    expect(css).toContain('padding-left:calc(var(--spacing-unit) * 1.875)');
    // 冻结形态（`n × 0.25rem` 的字面 rem）不再产出
    expect(css).not.toContain('0.15625rem');
    expect(css).not.toContain('0.21875rem');
    expect(css).not.toContain('0.109375rem');
  });

  it('leaves sizes and arbitrary values out of the spacing family', async () => {
    const css = await generate({}, 'h-8 w-4 size-4 basis-4 p-[7px] p-1/2');

    // 尺寸类读 `theme.width` / `theme.height`，不经过 `theme.spacing`：
    // 控件高度与图标尺寸不会被 spacing 选项带走（这是"只调间距"的前提）
    expect(css).toContain('height:2rem');
    expect(css).toContain('width:1rem');
    // 任意值与分数是逃生舱：保留原义，不被包一层 calc
    expect(css).toContain('padding:7px');
    expect(css).toContain('padding:50%');
    // 已知副作用（docs/space-control-scale.md §1.4）：inset / basis 与间距同表，会一起缩放
    expect(css).toContain('flex-basis:calc(var(--spacing-unit) * 4)');
  });

  it('builds the named spacing rungs from the same grid unit as the numeric ones', async () => {
    const css = await generate({}, 'gap-md p-2xl mt-3xs gap-7xl px-4xs gap-5xs');

    // 具名档与数字类产出**同一个形态**：class 名里的数字与网格系数是同一个数，
    // 所以 `gap-md` 与 `gap-4` 逐字节相同（这正是档位不再需要自己的 CSS 变量的原因）
    expect(css).toContain('gap:calc(var(--spacing-unit) * 4)');
    expect(css).toContain('padding:calc(var(--spacing-unit) * 6)');
    expect(css).toContain('margin-top:calc(var(--spacing-unit) * 2)');
    expect(css).toContain('gap:calc(var(--spacing-unit) * 18)');
    expect(css).toContain('padding-left:calc(var(--spacing-unit) * 1.5)');
    // 系数 1 直接发单位引用
    expect(css).toContain('gap:var(--spacing-unit)');
    // 具名档与数字类产出同一个值（选择器不同，取声明比较）
    const gapValue = (rules: string): string => /gap:([^;}]+)/.exec(rules)?.[1] ?? '';

    expect(gapValue(await generate({}, 'gap-md'))).toBe(gapValue(await generate({}, 'gap-4')));
  });

  it('keeps every shared spacing rung identical to UnoCSS’s own scale', () => {
    // 对齐契约：UnoCSS 定义过的档位，我们同名同值（`DEFAULT` / `none` 由 UnoCSS 提供）。
    // 档位以网格单位的倍数发射，所以比较的是**基础值**：系数 × 网格 = 上游的字面值
    const shared = Object.keys(unoTheme.spacing).filter(key => key !== 'DEFAULT' && key !== 'none');
    const mismatched = shared.filter(
      key =>
        SPACING_GRID_COEFFICIENTS[key as SpacingRung] === undefined ||
        SPACING_GRID_COEFFICIENTS[key as SpacingRung] * 0.25 !== parseFloat(unoTheme.spacing[key] as string)
    );

    expect(mismatched).toEqual([]);
    expect(shared.length).toBeGreaterThanOrEqual(12);
    // 扩充只发生在 UnoCSS 刻度的两端：小端 6xs…2xs 与 UnoCSS 的 `xs` 无缝相接，中段补 `md`
    expect(SPACING_GRID_COEFFICIENTS['2xs'] * 0.25).toBe(0.625);
    expect(SPACING_GRID_COEFFICIENTS.xs * 0.25).toBe(parseFloat(unoTheme.spacing.xs as string));
    expect(SPACING_GRID_COEFFICIENTS.md * 0.25).toBe(parseFloat(unoTheme.spacing.DEFAULT as string));
  });

  it('leaves heights to UnoCSS’s numeric grid (no control-height family)', async () => {
    const css = await generate({}, 'h-control-md min-h-control-md size-control-md h-5 h-8 h-14 min-h-8 size-8');

    // 控件高度不是刻度族：这些类名不产出任何声明
    expect(css).not.toContain('control-');
    expect(buildThemeEntries().height).toBeUndefined();
    expect(buildThemeEntries().minHeight).toBeUndefined();
    // 控件区间 20–56px 由数字 height 刻度精确覆盖，且它读 `theme.height`、随 `size` 缩放
    expect(css).toContain('height:1.25rem');
    expect(css).toContain('height:2rem');
    expect(css).toContain('height:3.5rem');
    expect(css).toContain('min-height:2rem');
    expect(css).toContain('width:2rem;height:2rem');
    // 布局高度刻度不受影响（`h-xl` 走 UnoCSS 自己的 height 表）
    const layout = await generate({}, 'h-xl');

    expect(layout).toContain('height:36rem');
  });

  it('exposes every radius rung plus none / full and points DEFAULT at the theme radius', async () => {
    const css = await generate(
      {},
      'rounded rounded-2xs rounded-xs rounded-2xl rounded-3xl rounded-4xl rounded-none rounded-full'
    );

    expect(css).toContain('border-radius:var(--radius)');
    expect(css).toContain('border-radius:var(--radius-2xs)');
    expect(css).toContain('border-radius:var(--radius-xs)');
    expect(css).toContain('border-radius:var(--radius-2xl)');
    // 3xl / 4xl 也归主题：上游的 `rounded-3xl`（1.5rem）不随种子移动，接管后整族一致
    expect(css).toContain('border-radius:var(--radius-3xl)');
    expect(css).toContain('border-radius:var(--radius-4xl)');
    expect(css).toContain('border-radius:var(--radius-none)');
    expect(css).toContain('border-radius:var(--radius-full)');
  });

  it('derives the mapped keys from the engine rung lists', () => {
    const entries = buildThemeEntries();

    expect(Object.keys(entries.borderRadius)).toEqual([
      '2xs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      'none',
      'full',
      'DEFAULT'
    ]);
    // spacing = 18 具名档 + 数字系数网格（0 … 64，步长 = 网格单位的 1/4）+ DEFAULT，
    // 全部由引擎的系数表派生。键序不作断言：JS 会把整数形态的键排到字符串键之前。
    expect(
      SPACING_RUNGS.every(rung => {
        const coefficient = SPACING_GRID_COEFFICIENTS[rung];

        return (
          entries.spacing[rung] ===
          (coefficient === 1 ? 'var(--spacing-unit)' : `calc(var(--spacing-unit) * ${coefficient})`)
        );
      })
    ).toBe(true);
    expect(entries.spacing['6xs']).toBe('calc(var(--spacing-unit) * 0.5)');
    expect(entries.spacing['5xs']).toBe('var(--spacing-unit)');
    expect(entries.spacing['4']).toBe('calc(var(--spacing-unit) * 4)');
    expect(entries.spacing['2.5']).toBe('calc(var(--spacing-unit) * 2.5)');
    expect(entries.spacing['64']).toBe('calc(var(--spacing-unit) * 64)');
    expect(Object.keys(entries.spacing).filter(key => /^[\d.]+$/.test(key))).toHaveLength(1025);
    // `0` 保持字面量：`p-0` / `gap-0` 的产出不该因为多了个选项而变形
    expect(entries.spacing['0']).toBe('0');
    // 具名档与数字键同源：`gap-md` 与 `gap-4` 是同一个值
    expect(entries.spacing.md).toBe(entries.spacing['4']);
    // UnoCSS 的 `spacing.DEFAULT` 是 1rem = `md` 档（4 个网格步）
    expect(entries.spacing.DEFAULT).toBe(entries.spacing.md);
    // 区间之外不接管：`p-80` 回落到 UnoCSS 的原生 `n × 0.25rem`
    expect(entries.spacing['80']).toBeUndefined();
    // 高度不再由主题映射：`h-*` 全部走 UnoCSS 自己的 height 表（含数字与布局刻度）
    expect(entries.height).toBeUndefined();
    expect(entries.minHeight).toBeUndefined();
  });
});
