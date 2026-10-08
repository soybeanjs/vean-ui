import type {
  PaletteColorLevel,
  SimplePaletteKey,
  TailwindPaletteKey,
  TailwindPaletteLevelColorKey
} from '@soybeanjs/colord/palette';
import type {
  AlphaToken,
  ChartToken,
  RoleRampRole,
  CoreToken,
  RegionToken,
  SemanticToken,
  StatusName,
  StatusToken
} from './semantic';

/**
 * The theme engine type surface (docs/design/theme.md §0.3, §3).
 *
 * Three layers, three kinds of values:
 * - **palette** (Layer 1): naked channels, `--zinc-100: 240 4.8% 95.9%`
 * - **semantic** (Layer 2): references to palette levels, `--background: var(--zinc-50)`
 * - **literal**: plain CSS values (radius scale, motion, z-index, typography)
 *
 * Nothing in the semantic layer holds a color literal, which is what makes the
 * palette layer static, the theme switch a reference swap, and `resolveTokenColor`
 * able to return the very same color the CSS resolves to.
 */

/** a built-in palette key of the palette layer (26 keys). */
export type PaletteKey = TailwindPaletteKey;

/** a built-in palette level (`50` … `950`). */
export type PaletteLevel = PaletteColorLevel;

/** a simple palette name shipped as a palette-layer variable (see `SimplePaletteKey`). */
export type SimpleColorName = Extract<SimplePaletteKey, 'white' | 'black'>;

/** a level rule value: a numeric level or the light extreme (`white`). */
export type LevelOrSimple = PaletteLevel | 'white';

/** which palette a token level is read from. */
export type LevelSource = 'base' | 'primary';

/**
 * the `palette.level` reference form used by rules and overrides, e.g. `zinc.200`
 * — colord's level color key, so the engine and the palette library share one
 * definition of the shape.
 */
export type PaletteLevelRef = TailwindPaletteLevelColorKey;

/**
 * an HSL color in the **one unified format** the engine emits and accepts:
 * CSS Color 4 space-separated components, with `%` on saturation and lightness,
 * and the alpha as a slash component.
 *
 * The `%` is required on purpose (the unitless spelling is not accepted): the palette layer stores
 * the same two components with `%` (`240 4.8% 95.9%`), so a value written here is
 * the channel triple plus the `hsl()` wrapper — one shape for input, output and
 * documentation, with no unitless/percentage mix to normalize.
 *
 * @example
 * - hsl(238.732 83.529% 66.667%)
 * - hsl(240 50% 30% / 0.5)
 */
export type HSLColor = `hsl(${number} ${number}% ${number}%)` | `hsl(${number} ${number}% ${number}% / ${number})`;

/**
 * an OKLCH color in the same unified format: `%` on the lightness component,
 * plain numbers for chroma and hue, slash alpha.
 *
 * @example
 * - oklch(58.5% 0.204 277.117)
 * - oklch(60% 0.2 250 / 0.5)
 */
export type OKLCHColor = `oklch(${number}% ${number} ${number})` | `oklch(${number}% ${number} ${number} / ${number})`;

/** the color output format. */
export type ColorFormat = 'hsl' | 'oklch';

/** the resolved color scheme. */
export type ThemeMode = 'light' | 'dark';

/** the style target of the light block. */
export type StyleTarget = 'html' | ':root';

/** how dark mode is expressed in the emitted CSS. */
export type DarkSelectorValue = 'class' | 'media' | (string & {});

/** the color scheme preference including the OS-following `auto`. */
export type ThemeModePreference = ThemeMode | 'auto';

/** the component size / density preset. */
export type ThemeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** a size token value: a preset key or a raw `px` / `rem` length. */
export type ThemeSizeValue = ThemeSize | `${number}px` | `${number}rem`;

/** the border radius preset. */
export type ThemeRadius = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/** a radius token value: a preset key or a raw `px` / `rem` length. */
export type ThemeRadiusValue = ThemeRadius | `${number}px` | `${number}rem`;

/** the spacing (grid unit) preset. */
export type ThemeSpacing = 'compact' | 'default' | 'relaxed' | 'spacious';

/**
 * font family roles for the four literal typography tokens.
 *
 * Mirrors shadcn's own font model: three **root roles** (`sans` / `serif` /
 * `mono`, each backing a root variable) plus an independent `heading` role that
 * may point at any family. The serif role exists on its own rather than being
 * folded into `heading`, so body copy can go serif while the heading stays sans
 * (or the reverse) without ambiguity.
 *
 * Each arm is either a complete CSS `font-family` stack or a single family
 * name (the engine appends the matching system fallback). `undefined` keeps
 * the engine default from `LITERAL_DEFAULTS`.
 */
export interface ThemeFont {
  /** body / UI font → `--font-sans`. */
  sans?: string;
  /** heading font → `--font-heading` (any family; independent of the root roles). */
  heading?: string;
  /** code font → `--font-mono`. */
  mono?: string;
  /** serif copy / pull quotes → `--font-serif`. */
  serif?: string;
}

/**
 * a spacing token value: a preset key or a raw multiplier on the `0.25rem` grid.
 *
 * The multiplier moves the grid *unit* (`--spacing-unit`), the one variable
 * the family emits; the rungs themselves are coefficients on that unit and live
 * in UnoCSS's `theme.spacing` mapping rather than in CSS variables
 * (docs/design/theme.md §3.11).
 */
export type ThemeSpacingValue = ThemeSpacing | number;

/**
 * the surface style.
 *
 * - `layered` (default): the page is tinted so raised surfaces can sit above it
 * - `flat`: every surface keeps the mode extreme (the pre-v2 look)
 */
export type SurfaceStyle = 'layered' | 'flat';

/** the CSS variable prefix; `false` emits bare names. */
export type TokenPrefix = string | false;

/** the feedback (status) scheme key. */
export type FeedbackSchemeKey = string;

/**
 * a color value as a user supplies it — the vocabulary of the override API
 * (docs/design/theme.md §4.2):
 *
 * - a `palette.level` reference: `stone.950` / `indigo.600` (colord's level
 *   color key, so the engine and the palette library agree on the shape);
 * - a simple palette key: `white` / `black` / `transparent` / `inherit` /
 *   `current`;
 * - a complete HSL or OKLCH color in CSS Color 4 syntax:
 *   `hsl(238.732 83.529% 66.667%)` / `oklch(58.5% 0.204 277.117)`.
 *
 * Raw channel triples stay out on purpose: they are format-ambiguous, so a JS
 * consumer could not tell whether to wrap them in `hsl()` or `oklch()` (use the
 * resolver functions from §0.2-3 instead). A *dynamic* string (e.g.
 * `colord(x).toHslString()`, which types as `string`) needs an explicit cast or
 * one of those helpers.
 *
 * The type advertises the supported formats; the runtime parser is deliberately
 * more lenient — an unrecognised complete color still becomes a `kind: 'color'`
 * value — so JavaScript callers and already-persisted envelopes keep working.
 */
export type ColorValue = HSLColor | OKLCHColor | SimplePaletteKey | TailwindPaletteLevelColorKey;

/**
 * a semantic-token reference form used by overrides: `token.primary` /
 * `token.background` …
 *
 * Resolved at map-build time by **copying** the target token's `TokenValue`
 * (and, when both ends own one, the alpha companion). A self-reference or a
 * cycle is an invalid override value and is dropped the same way as any other
 * unrepresentable value — the nominal token stays in place.
 */
export type TokenRef = `token.${SemanticToken}`;

/** a semantic token override value: a color vocabulary, or a token reference. */
export type TokenOverride = ColorValue | TokenRef;

/** inline overrides applied on top of the resolved tokens (highest priority). */
export interface ThemeOverrides {
  light?: Partial<Record<SemanticToken, TokenOverride>>;
  dark?: Partial<Record<SemanticToken, TokenOverride>>;
}

/**
 * how a token gets its value: a palette level (with an optional neutral-palette
 * variant), a mirror of another token, or a simple palette key. Every arm is
 * *declared* — the engine never measures one value to decide another
 * (docs/design/theme.md §4.3).
 */
export type TokenRule =
  | {
      kind: 'level';
      source: LevelSource;
      light: LevelOrSimple;
      dark: LevelOrSimple;
      /** level override when the primary palette is a neutral family. */
      neutral?: { light: LevelOrSimple; dark: LevelOrSimple };
    }
  | { kind: 'mirror'; light: SemanticToken; dark: SemanticToken }
  | { kind: 'simple'; light: SimpleColorName; dark: SimpleColorName };

/** the value a semantic token resolves to. */
export type TokenValue =
  | { kind: 'palette'; palette: PaletteKey; level: PaletteLevel }
  | { kind: 'simple'; name: SimpleColorName }
  | { kind: 'color'; value: string };

/** a non-color token name. */
export type LiteralToken =
  | 'size'
  | 'radius'
  | 'radius-2xs'
  | 'radius-xs'
  | 'radius-sm'
  | 'radius-md'
  | 'radius-lg'
  | 'radius-xl'
  | 'radius-2xl'
  | 'radius-3xl'
  | 'radius-4xl'
  | 'radius-none'
  | 'radius-full'
  | 'spacing-unit'
  | 'z-layout'
  | 'z-base'
  | 'z-toast'
  | 'z-max'
  | 'border-width'
  | 'border-width-strong'
  | 'ring-width'
  | 'ring-offset-width'
  | 'font-sans'
  | 'font-heading'
  | 'font-mono'
  | 'font-serif';

/**
 * the resolved theme: two mode maps, the alpha companions and the literal layer.
 *
 * This is the single intermediate representation: the CSS emitter and the JS
 * resolvers both read it, so they cannot disagree. There is no report field: the
 * map holds the *declared* values and nothing measures or corrects them
 * (docs/design/theme.md §2.2).
 */
export interface ThemeMap {
  light: Record<SemanticToken, TokenValue>;
  dark: Record<SemanticToken, TokenValue>;
  alpha: Record<AlphaToken, { light: number; dark: number }>;
  literal: Record<LiteralToken, string>;
}

/** the engine options. */
export interface ThemeOptions {
  /** the neutral palette (9 built-ins). @default 'zinc' */
  base?: PaletteKey;
  /** the brand palette (any of the 26 built-ins). @default 'indigo' */
  primary?: PaletteKey;
  /** the status color scheme. @default 'classic' */
  feedback?: FeedbackSchemeKey;
  /** inline token overrides, applied last. */
  overrides?: ThemeOverrides;
  /** @default 'layered' */
  surfaceStyle?: SurfaceStyle;
  /** @default false */
  prefix?: TokenPrefix;
  /** the root font-size preset or length (the density zoom). @default 'md' */
  size?: ThemeSizeValue;
  /** the radius seed. @default 'md' */
  radius?: ThemeRadiusValue;
  /** the spacing grid unit multiplier (padding / margin / gap / inset). @default 'default' */
  spacing?: ThemeSpacingValue;
  /** font family stacks for sans / heading / mono (runtime-swappable). */
  font?: ThemeFont;
  /** multiplies the decorative border alpha (0 – 1). @default 1 */
  borderOpacity?: number;
  /** the palette layer format. @default 'hsl' */
  format?: ColorFormat;
  /** @default ':root' */
  styleTarget?: StyleTarget;
  /** @default 'class' */
  darkSelector?: DarkSelectorValue;
}

/** emit options of the semantic layer. */
export interface EmitThemeOptions {
  styleTarget?: StyleTarget;
  darkSelector?: DarkSelectorValue;
  /**
   * the format a **complete-colour override** is encoded into; the channel
   * values themselves are format-free.
   *
   * @default 'hsl'
   */
  format?: ColorFormat;
  /**
   * wrap the block selectors in `:where(…)` (zero specificity).
   *
   * Used by the **static default block** that ships with the preset: it must be
   * beatable by the runtime/snapshot block regardless of source order, and
   * `:where()` achieves that without `!important` (a head inline script cannot
   * be placed after the stylesheet, so order alone cannot decide).
   *
   * @default false
   */
  weakSelectors?: boolean;
  /**
   * the token name prefix; must match the prefix `resolveThemeMap` used, because
   * the literal layer references other tokens (`var(--radius)`).
   */
  prefix?: TokenPrefix;
}

export type { AlphaToken, RoleRampRole, ChartToken, CoreToken, RegionToken, SemanticToken, StatusName, StatusToken };
