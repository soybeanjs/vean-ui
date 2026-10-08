import {
  ALPHA_TOKENS,
  DEFAULT_OPTIONS,
  PALETTE_KEYS,
  PALETTE_LEVELS,
  RADIUS_RUNG_KEYS,
  SEMANTIC_TOKENS,
  ROLE_RAMP_ROLES,
  SPACING_GRID,
  SPACING_GRID_COEFFICIENTS,
  SPACING_RUNGS,
  emitThemeCss,
  generatePaletteCss,
  resolveThemeMap
} from '@vean/theme';
import type { ColorFormat, EmitThemeOptions, RoleRampRole, ThemeOptions, SemanticToken } from '@vean/theme';

/**
 * The token adapter (docs/design/theme.md §5).
 *
 * Two rules that the emitted utilities depend on:
 *
 * 1. **colors are `hsl(var(--vean-x) / <alpha-value>)`** — a bare `var()` makes
 *    UnoCSS drop the opacity modifier silently, so the function wrapper (and the
 *    `<alpha-value>` slot) is mandatory;
 * 2. **the palette layer + the default alias block ship in the preflight**, so
 *    `--zinc-100` / `--background` resolve with no runtime JS. A themed
 *    (non-default) configuration is injected later on top of them.
 */

/** the CSS-variable name prefix of a token (`acme` → `--acme-x`, `false` → `--vean-x`, the default). */
const varPrefixOf = (prefix: string | false | undefined): string =>
  prefix === false ? '' : `${prefix ?? DEFAULT_OPTIONS.prefix}-`;

/** the CSS variable reference of a semantic token. */
const tokenRef = (token: SemanticToken, prefix: string | false | undefined): string =>
  `--${varPrefixOf(prefix)}${token}`;

/** the tokens whose value must be composed with a separate alpha variable. */
const ALPHA_TOKEN_SET: ReadonlySet<string> = new Set(ALPHA_TOKENS);

/**
 * the color reference UnoCSS needs: function + channel var + alpha slot.
 */
const colorRef = (varName: string, format: ColorFormat): string => `${format}(var(${varName}) / <alpha-value>)`;

/** a static CSS color reference (no UnoCSS alpha slot; alpha defaults to 1). */
export const cssColorRef = (varName: string, format: ColorFormat): string => `${format}(var(${varName}))`;

/** a static CSS color reference with an explicit alpha expression (border family). */
export const cssAlphaColorRef = (varName: string, alpha: string, format: ColorFormat): string =>
  `${format}(var(${varName}) / ${alpha})`;

/** the CSS variable name of a token's numeric alpha companion (`--border-alpha`). */
const alphaVarOf = (token: SemanticToken, prefix: string | false | undefined): string =>
  `--${varPrefixOf(prefix)}${token}-alpha`;

/**
 * `theme.colors` entries for the semantic tokens (50) — the utility name is the
 * token name itself, so `bg-card`, `text-muted-foreground`, `border-input`
 * and `bg-chart-1` all map 1:1 onto the token contract.
 *
 * The border family (`ALPHA_TOKENS`) is the exception to rule 1 above: its dark
 * value is a **translucent white**, so the value carries its numeric alpha
 * companion instead of the `<alpha-value>` slot. Mapping it like every other
 * token would drop the companion and paint a solid white hairline (the
 * pre-refactor look is `oklch(100% 0 0 / 0.1)`). UnoCSS hoists the companion
 * into `--un-border-opacity`, which keeps the opacity modifier meaningful:
 * `border-border` renders the hairline, `border-border/60` overrides the alpha
 * to 0.6 (docs/design/theme.md §3.4 / §5.2).
 */
export function buildSemanticColors(
  format: ColorFormat = 'hsl',
  prefix: string | false = DEFAULT_OPTIONS.prefix
): Record<string, string> {
  return Object.fromEntries(
    SEMANTIC_TOKENS.map(token => [
      token,
      ALPHA_TOKEN_SET.has(token)
        ? cssAlphaColorRef(tokenRef(token, prefix), `var(${alphaVarOf(token, prefix)}, 1)`, format)
        : colorRef(tokenRef(token, prefix), format)
    ])
  );
}

/**
 * `theme.colors` entries for the 26 built-in palettes (all 11 levels each), so
 * `bg-indigo-500/30` reads the injected palette layer and a palette swap in the
 * theme follows automatically. The palette layer is unprefixed by design.
 */
export function buildPaletteColors(format: ColorFormat = 'hsl'): Record<string, Record<string, string>> {
  return Object.fromEntries(
    PALETTE_KEYS.map(palette => [
      palette,
      Object.fromEntries(PALETTE_LEVELS.map(level => [level, colorRef(`--${palette}-${level}`, format)]))
    ])
  );
}

/** the full color map (semantic + palette). */
export function buildThemeColors(
  format: ColorFormat = 'hsl',
  prefix: string | false = DEFAULT_OPTIONS.prefix
): Record<string, unknown> {
  return {
    ...buildSemanticColors(format, prefix),
    ...buildPaletteColors(format),
    ...buildRoleRampColors(format, prefix)
  };
}

/**
 * `theme.colors` entries for the five role ramps (primary / destructive /
 * success / warning / info × 50–950): each utility reads the role's runtime
 * ramp variable (`--primary-500`), which the engine aliases to the palette
 * that currently backs the role — so `bg-primary-500` follows a primary swap
 * and `bg-destructive-*` follows the feedback scheme, in both modes.
 */
export function buildRoleRampColors(
  format: ColorFormat = 'hsl',
  prefix: string | false = DEFAULT_OPTIONS.prefix
): Record<string, string> {
  return Object.fromEntries(
    ROLE_RAMP_ROLES.flatMap((role: RoleRampRole) =>
      PALETTE_LEVELS.map(level => [`${role}-${level}`, colorRef(`--${varPrefixOf(prefix)}${role}-${level}`, format)])
    )
  );
}

/**
 * the preflight CSS that makes the tokens resolvable without runtime JS:
 * the static palette layer (Layer 1) plus the default theme's alias block
 * (Layer 2).
 */
export function buildThemePreflight(options: ThemeOptions): string {
  const format = options.format ?? DEFAULT_OPTIONS.format;
  const emit: EmitThemeOptions = {
    prefix: options.prefix ?? DEFAULT_OPTIONS.prefix,
    styleTarget: options.styleTarget,
    darkSelector: options.darkSelector,
    format,
    weakSelectors: true
  };

  const aliases = emitThemeCss(resolveThemeMap(options), emit);

  // 静态默认层用 `:where()` 降权到零特异性：运行时/首帧快照用普通选择器即可胜出，
  // 不必依赖源码顺序（head 内联脚本无法排在样式表之后），也不需要 `!important`
  return `${generatePaletteCss({ format, styleTarget: options.styleTarget, weakSelectors: true })}\n\n${aliases}\n`;
}

/**
 * the numeric spacing grid: which coefficients the adapter maps.
 *
 * UnoCSS computes numeric spacing as `n × 0.25rem` inside preset-mini, *unless*
 * `theme.spacing[n]` exists — `directionSize` (padding / margin) and `handleGap`
 * read the theme first (`node_modules/@unocss/preset-mini/dist/utils-D9qaB-1B.mjs`).
 * Mapping the grid up to `64` therefore routes the numeric utilities through the
 * same `--spacing-unit` the named rungs use, which is what makes one `spacing`
 * option move paddings, margins and gaps together.
 *
 * Deliberately not mapped: `w-*` / `h-*` / `size-*` (they read `theme.width` /
 * `theme.height`, so control heights and icon sizes stay put — verified), and
 * arbitrary values (`p-[7px]`) or fractions (`p-1/2`), which keep their raw
 * meaning.
 */
const SPACING_GRID_MAX = 64;

/**
 * how finely the numeric keys subdivide the grid unit.
 *
 * The unit (`SPACING_GRID` = `0.25rem`, the coefficient-1 length) and the
 * *enumeration* step are two different numbers. Walking the unit alone only
 * registers its integer multiples (`0.25`, `0.75`, `1.25`…), which leaves every
 * half step to preset-mini's hard-coded `n × 0.25rem`: `p-0.625` emitted
 * `0.15625rem` and ignored the `spacing` option while its neighbour `p-0.75`
 * scaled — 77 usages (26 distinct classes, eighths and one sixteenth) across
 * `packages/ui` were frozen that way. Subdividing by 4 (`0.0625rem`) covers the
 * library's whole ladder; extra keys cost nothing until a utility is used,
 * because an unused `theme.spacing` key emits no CSS. A coefficient off the
 * lattice (`p-0.3`) still falls back — this is a fixed key list, not a catch-all,
 * so widen the subdivisions (or switch to a rule-level fallback) if a recipe ever
 * writes one.
 */
const SPACING_GRID_SUBDIVISIONS = 4;

/** the enumeration step the numeric keys walk: the engine's grid unit, subdivided. */
const SPACING_GRID_STEP = parseFloat(SPACING_GRID) / SPACING_GRID_SUBDIVISIONS;

/**
 * The remaining `theme` keys that the token contract owns (docs/design/theme.md §5.1).
 *
 * Mapped families:
 *
 * - `borderRadius` — the whole family: `2xs` … `4xl` rungs (derived from the
 *   seed with `calc()`), the `none` / `full` extremes, and `DEFAULT` → the seed,
 *   so `rounded` is the theme radius. `rounded-3xl` / `rounded-4xl` are taken
 *   over too (UnoCSS's own `3xl` is `1.5rem`), because the ladder must stay one
 *   monotonic family — a rung owned by upstream would not follow the seed;
 * - `spacing` — the whole grid, built here from `SPACING_GRID_COEFFICIENTS`: the
 *   named rungs (`gap-md`, `p-2xl`, `mt-3xs`…) and the numeric coefficients
 *   (`p-4`, `gap-2.5`, `p-0.625`) are the *same* `calc(var(--spacing-unit) * k)`
 *   shape, because the class number and the coefficient are the same number; the
 *   numeric keys subdivide the unit (`SPACING_GRID_SUBDIVISIONS`) so a half step
 *   is a key too. Only the coefficients above the mapped range fall back to
 *   UnoCSS's own `n × 0.25rem`.
 *
 * Deliberately left out:
 *
 * - `height` / `minHeight` — left to UnoCSS: its numeric height utilities read
 *   `theme.height`, and the 20–56px control range is exactly the numeric grid
 *   (`h-5` … `h-14`), so nothing needs mapping. A control height is the height
 *   column of the size vector rather than a scale of its own, and numeric
 *   heights scale with the density knob (`size`) because they are rem
 *   (docs/design/space-control-scale.md §3.1);
 * - `boxShadow` / `duration` / `easing` — UnoCSS owns these three families
 *   outright, and so does the theme: a `--shadow-*` / `--duration-*` / `--ease-*`
 *   token would have no reader at all, because the adapter does not map
 *   `boxShadow` and components write numeric durations. Elevation is
 *   `shadow-sm|md|lg|xl`, motion is `duration-200` / `ease-in-out`; both are
 *   UnoCSS's own values, so a theme cannot silently change how a component moves
 *   (docs/design/theme.md §5.3).
 *
 * `fontSize` is *extended*, not replaced: the adapter contributes the three
 * rungs below Wind3's `xs` and leaves `xs`…`9xl` to Wind3 (deep-merged themes).
 */
export function buildThemeEntries(prefix: string | false = DEFAULT_OPTIONS.prefix): {
  borderRadius: Record<string, string>;
  spacing: Record<string, string>;
  fontSize: Record<string, string | [string, string]>;
  fontFamily: { sans: string; heading: string; mono: string; serif: string };
  zIndex: Record<string, string>;
  lineWidth: Record<string, string>;
  ringWidth: Record<string, string>;
} {
  const literal = (name: string): string => `var(--${varPrefixOf(prefix)}${name})`;
  /** map a token family's rungs onto theme keys: `keyPrefix + rung` → `var(--{token}-{rung})`. */
  const rungs = (token: string, keys: readonly string[], keyPrefix = '') =>
    Object.fromEntries(keys.map(key => [`${keyPrefix}${key}`, literal(`${token}-${key}`)]));

  /**
   * the value of one spacing coefficient: the grid unit times it. The whole
   * spacing family is built with this one rule, so `p-4`, `gap-md` and the
   * `DEFAULT` key cannot drift apart — at the default unit they all resolve to
   * UnoCSS's own scale. Coefficient 1 emits the bare unit reference (`p-1`,
   * `gap-5xs`): the same length, fewer bytes, and one format for both paths.
   */
  const unit = literal('spacing-unit');
  const gridValue = (coefficient: number): string => (coefficient === 1 ? unit : `calc(${unit} * ${coefficient})`);

  /** the named rungs (`gap-md`, `p-2xl`…) from the engine's coefficient table. */
  const namedSpacing = Object.fromEntries(
    SPACING_RUNGS.map(rung => [rung, gridValue(SPACING_GRID_COEFFICIENTS[rung])])
  );

  /**
   * the numeric coefficients (`p-4`, `gap-2.5`, `p-0.625`). Registered because
   * preset-mini computes `n × 0.25rem` only when `theme.spacing[n]` is *absent*,
   * so this is what routes the numeric utilities through the same unit — without
   * it the knob would move the named rungs and leave 98.6% of the library's
   * spacing behind. The step is the subdivided unit, so the eighths the recipes
   * write are keys rather than frozen fallbacks.
   */
  const numericSpacing: Record<string, string> = { 0: '0' };

  for (let step = 1; step * SPACING_GRID_STEP <= SPACING_GRID_MAX; step++) {
    const coefficient = step * SPACING_GRID_STEP;

    numericSpacing[String(coefficient)] = gridValue(coefficient);
  }

  return {
    borderRadius: {
      ...rungs('radius', RADIUS_RUNG_KEYS),
      none: literal('radius-none'),
      full: literal('radius-full'),
      DEFAULT: literal('radius')
    },
    spacing: {
      ...namedSpacing,
      ...numericSpacing,
      // UnoCSS's `spacing.DEFAULT` is `1rem` = the `md` rung, so keep them equal
      DEFAULT: gridValue(SPACING_GRID_COEFFICIENTS.md)
    },
    /**
     * The type scale belongs to UnoCSS (Wind3): `xs`…`9xl` keep its own
     * size / line-height pairs, and only the three rungs below its smallest one
     * are added here (they are also the three the library writes: `text-2xs` /
     * `text-3xs` / `text-4xs`). Wind3's theme is deep-merged with this one, so
     * nothing below replaces its scale — and a theme can no longer change how
     * large a component's text is (docs/design/theme.md §5.3).
     */
    fontSize: {
      '4xs': ['0.375rem', '0.5rem'],
      '3xs': ['0.5rem', '0.625rem'],
      '2xs': ['0.625rem', '0.75rem']
    },
    fontFamily: {
      sans: literal('font-sans'),
      heading: literal('font-heading'),
      mono: literal('font-mono'),
      serif: literal('font-serif')
    },
    zIndex: {
      layout: literal('z-layout'),
      base: literal('z-base'),
      toast: literal('z-toast'),
      max: literal('z-max')
    },
    lineWidth: {
      DEFAULT: literal('border-width'),
      strong: literal('border-width-strong')
    },
    ringWidth: {
      DEFAULT: literal('ring-width')
    }
  };
}
