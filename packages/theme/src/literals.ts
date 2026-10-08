import { SPACING_GRID } from './defaults';
import type { LiteralToken, ThemeFont, ThemeRadius, TokenPrefix } from './types';

/**
 * The literal (non-color) layer (docs/design/theme.md §3.11).
 *
 * Dimension, layering, line and typography tokens. These are plain CSS values
 * (not palette references), which is why they live beside — not inside — the
 * color maps.
 *
 * Shadows and motion are **not** in here (removed 2026-09-22, decision #23):
 * both families were UnoCSS-owned in practice — the adapter never mapped
 * `boxShadow`, and components write numeric durations — so the five shadow
 * tokens and the three duration / three easing tokens were variables nobody
 * could observe. Elevation is `shadow-md` / `shadow-lg` (UnoCSS's own rungs, the
 * same geometry, `--un-shadow-color`); motion is `duration-200` and friends.
 */

/**
 * the default literal values, in declaration order.
 *
 * These are plain values except for the radius ladder, which is why this table
 * is not just constants: `radius` is a seed whose rungs are `calc()` expressions
 * on it, so changing `--radius` — from the theme option *or* from a consumer's
 * own stylesheet — moves the whole family together, and one knob keeps
 * inner/outer radii consistent. `none` / `full` are the scale's two extremes.
 *
 * The **type scale is not here** (removed 2026-09-22, decision #25): font sizes
 * and line heights are UnoCSS's own `fontSize` tuples (`text-sm` → `0.875rem` /
 * `1.25rem`), with the three small rungs the adapter adds on top (`4xs` / `3xs` /
 * `2xs`, docs/design/theme.md §5.1 / §5.3). Nothing in the library read `--text-*` /
 * `--leading-*` directly, and a themed type scale means a component's text can
 * change size when a theme changes — a typography decision, not a colour one.
 *
 * `spacing` is **not** a rung family here: only its grid unit is a variable
 * (`spacing-unit`, the knob). The 18 rungs are coefficients on that unit
 * (`SPACING_GRID_COEFFICIENTS`) consumed by the UnoCSS mapping — a variable per
 * rung would have exactly one reader (the adapter, which can compute it) while
 * adding 18 declarations to every theme block, so the values live in the class
 * mapping instead (docs/design/theme.md §3.11).
 *
 * Control heights are **not** a family either: the 8 rungs were exactly the
 * numeric height grid (`h-5` … `h-14`), nothing in the library or the
 * user-facing docs used them, and a control height is the size vector's height
 * column rather than a scale of its own (docs/design/theme.md §3.11,
 * docs/design/space-control-scale.md §3.1).
 */
export const LITERAL_DEFAULTS: Record<LiteralToken, string> = {
  size: '16px',
  // —— 半径：`--radius` 是种子，7 档都是它的**正系数倍** ——
  // 不用"种子 ± 固定偏移"：偏移一旦大于种子就会算出负值，而负 `border-radius`
  // 属非法 computed value，声明被丢弃后静默变成 `0`（`radius: '2xs'` 时
  // `2xs`/`xs`/`sm` 三档全部塌成直角）。系数恒为正，任何种子都得到单调递增的
  // 刻度，嵌套比例也不再漂移（md/lg 恒为 80%；偏移制在预设间从 50% 漂到 88%）。
  // 默认种子 0.5rem 下逐档与偏移制等值（0.125/0.25/0.375/0.5/0.625/0.75/0.875/1/1.125rem）。
  radius: '0.5rem',
  'radius-2xs': 'calc(var(--radius) * 0.25)',
  'radius-xs': 'calc(var(--radius) * 0.5)',
  'radius-sm': 'calc(var(--radius) * 0.75)',
  'radius-md': 'var(--radius)',
  'radius-lg': 'calc(var(--radius) * 1.25)',
  'radius-xl': 'calc(var(--radius) * 1.5)',
  'radius-2xl': 'calc(var(--radius) * 1.75)',
  'radius-3xl': 'calc(var(--radius) * 2)',
  'radius-4xl': 'calc(var(--radius) * 2.25)',
  'radius-none': '0',
  'radius-full': '9999px',
  // —— 间距族只发射网格基座（旋钮）；18 档系数见 SPACING_GRID_COEFFICIENTS ——
  'spacing-unit': SPACING_GRID,
  'z-layout': '10',
  'z-base': '50',
  'z-toast': '100',
  'z-max': '2147483647',
  'border-width': '1px',
  'border-width-strong': '2px',
  'ring-width': '3px',
  'ring-offset-width': '2px',
  'font-sans': `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
  'font-heading': `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
  'font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  // 衬线臂的系统栈是 `ui-serif` 家族：与 sans / mono 两条一样，缺省时落回**同类**
  // 系统字体，而不是把 sans 栈塞进 serif 角色（否则 `font-serif` 名不符实）
  'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
};

/**
 * literal tokens that look like a radius rung but are not part of the ladder: the
 * two extremes (`none` is "no rounding", `full` is a pill).
 */
const NON_RUNG_TOKENS = ['radius-none', 'radius-full'] as const satisfies readonly LiteralToken[];

/**
 * the radius rungs, in declaration order.
 *
 * Derived from the literal table itself (the `radius-*` tokens minus the two
 * extremes), so a rung can never exist in one place only — this list is what the
 * UnoCSS adapter maps and what the tests iterate. The names mirror the seed
 * presets' keys (`themeRadiusKeys`), which is why the rung type is `ThemeRadius`
 * rather than a union of its own.
 */
export const RADIUS_RUNG_KEYS = Object.keys(LITERAL_DEFAULTS)
  .filter(key => key.startsWith('radius-') && !(NON_RUNG_TOKENS as readonly string[]).includes(key))
  .map(key => key.slice('radius-'.length)) as ThemeRadius[];

/**
 * the spacing scale, as coefficients on the grid unit.
 *
 * `0.25` is the grid: the default of `--spacing-unit` **and** the step
 * UnoCSS's numeric spacing utilities use (`p-4` = `4 × 0.25rem` = `1rem`), which
 * is why the class number and the coefficient are the same number at every
 * setting. Derived values at the default unit: `6xs` 2px … `9xl` 128px; the
 * UnoCSS-defined rungs keep its own values (preset-mini `_theme/misc.ts`,
 * `xs` 0.75rem … `9xl` 8rem, asserted against upstream in the adapter tests) and
 * the downward extension `6xs` … `2xs` plus the missing middle name `md` continues
 * the 2px grid below it (docs/design/space-control-scale.md §1.1 / §1.3).
 */
export const SPACING_GRID_COEFFICIENTS = {
  '6xs': 0.5,
  '5xs': 1,
  '4xs': 1.5,
  '3xs': 2,
  '2xs': 2.5,
  xs: 3,
  sm: 3.5,
  md: 4,
  lg: 4.5,
  xl: 5,
  '2xl': 6,
  '3xl': 7.5,
  '4xl': 9,
  '5xl': 12,
  '6xl': 15,
  '7xl': 18,
  '8xl': 24,
  '9xl': 32
} as const satisfies Record<string, number>;

/** a spacing rung name. */
export type SpacingRung = keyof typeof SPACING_GRID_COEFFICIENTS;

/** the spacing rungs, in declaration order. */
export const SPACING_RUNGS = Object.keys(SPACING_GRID_COEFFICIENTS) as SpacingRung[];

/**
 * resolve one font role from `ThemeOptions.font` into a CSS `font-family` value.
 *
 * - empty / missing → the matching `LITERAL_DEFAULTS` system stack;
 * - a single family name (`Inter`) → that name prefixed onto the system stack,
 *   so a bare name still degrades safely;
 * - a value that already looks like a stack (contains a comma) → used verbatim.
 */
export function resolveFontValue(role: 'sans' | 'heading' | 'mono' | 'serif', value: string | undefined): string {
  const fallback = LITERAL_DEFAULTS[`font-${role}`];
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed.includes(',') ? trimmed : `${trimmed}, ${fallback}`;
}

/**
 * resolve the four typography roles from the optional `font` option.
 *
 * The three root roles (`sans` / `serif` / `mono`) plus the independent
 * `heading` role, matching shadcn's variable set.
 */
export function resolveFontOptions(font: ThemeFont | undefined): {
  'font-sans': string;
  'font-heading': string;
  'font-mono': string;
  'font-serif': string;
} {
  return {
    'font-sans': resolveFontValue('sans', font?.sans),
    'font-heading': resolveFontValue('heading', font?.heading),
    'font-mono': resolveFontValue('mono', font?.mono),
    'font-serif': resolveFontValue('serif', font?.serif)
  };
}

/**
 * the CSS variable name of a literal token, honoring the prefix.
 */
export function literalVar(token: LiteralToken, prefix: TokenPrefix): string {
  return prefix ? `--${prefix}-${token}` : `--${token}`;
}

/**
 * resolve the literal layer for a theme.
 *
 * `size` / `radius` / `spacingUnit` are the resolved base tokens; the `calc()`
 * chains in the radius scale are rewritten to the emitted variable
 * (`var(--radius)`) so the derivation survives both prefixing and a runtime
 * change of a seed. The spacing unit needs no rewrite: it is a plain length,
 * and the rungs that reference it are built in the UnoCSS mapping
 * (`calc(var(--spacing-unit) * <coefficient>)`).
 *
 * `font` (optional) overrides the four typography roles on top of
 * `LITERAL_DEFAULTS`; see {@link resolveFontValue}.
 */
export function literalTokens(input: {
  size: string;
  radius: string;
  /** the spacing grid unit; defaults to the engine grid (`0.25rem`). */
  spacingUnit?: string;
  /** font family overrides for sans / heading / mono / serif. */
  font?: ThemeFont;
  prefix?: TokenPrefix;
}): Record<LiteralToken, string> {
  const { size, radius, spacingUnit = LITERAL_DEFAULTS['spacing-unit'], font, prefix = false } = input;
  const radiusRef = `var(${literalVar('radius', prefix)})`;

  return Object.entries({
    ...LITERAL_DEFAULTS,
    size,
    radius,
    'spacing-unit': spacingUnit,
    ...resolveFontOptions(font)
  }).reduce<Record<string, string>>((acc, [token, value]) => {
    const resolved = value.replaceAll('var(--radius)', radiusRef);

    return Object.assign(acc, { [token]: resolved });
  }, {}) as Record<LiteralToken, string>;
}
