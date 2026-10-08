import type { FeedbackSchemeKey, PaletteKey, ThemeRadius, ThemeSize, ThemeSpacing, ThemeOptions } from './types';

/**
 * Engine defaults and the base-token tables (docs/design/theme.md §3.11).
 */

/** Size preset → root font-size in pixels. */
export const THEME_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24
} as const satisfies Record<ThemeSize, number>;

/**
 * Radius preset → CSS length seed.
 *
 * The nine presets walk the `0.125rem` step, so the slider moves the seed by
 * exactly one rung of the emitted ladder (at the default seed the coefficients
 * land on the same nine lengths: `2xs` … `4xl` = 0.125 / 0.25 / … / 1.125rem).
 * `md` is the default and the center, and because `--radius-md` *is* the seed,
 * picking `md` makes the middle rung and the seed the same value.
 */
export const THEME_RADIUS = {
  '2xs': '0.125rem',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
  xl: '0.75rem',
  '2xl': '0.875rem',
  '3xl': '1rem',
  '4xl': '1.125rem'
} as const satisfies Record<ThemeRadius, string>;

/**
 * the grid the spacing family is built on.
 *
 * `0.25rem` is not arbitrary: it is the step UnoCSS's *numeric* spacing
 * utilities use (`p-4` = `4 × 0.25rem` = `1rem`, computed inside preset-mini and
 * never read from the theme). Sharing that step is what makes the class number
 * and the grid coefficient the same number, so `p-4` and `spacing-md` are the
 * same length at every setting.
 */
export const SPACING_GRID = '0.25rem';

/**
 * Spacing preset → multiplier on the grid unit.
 *
 * A multiplier rather than a length, because the family must keep scaling with
 * the density knob (`size` → root font-size): `calc(0.25rem * 1.25)` still
 * follows the root font-size, an absolute `5px` would not.
 */
export const THEME_SPACING = {
  compact: 0.75,
  default: 1,
  relaxed: 1.25,
  spacious: 1.5
} as const satisfies Record<ThemeSpacing, number>;

/** the built-in feedback (status) schemes. */
export const DEFAULT_FEEDBACK_SCHEME: FeedbackSchemeKey = 'classic';

/** the built-in dark selector shorthands. */
export const DARK_SELECTOR = {
  class: '.dark',
  media: '@media (prefers-color-scheme: dark)'
} as const;

/** the size preset keys, in slider order. */
export const themeSizeKeys = Object.keys(THEME_SIZE) as ThemeSize[];

/** the radius preset keys, in slider order. */
export const themeRadiusKeys = Object.keys(THEME_RADIUS) as ThemeRadius[];

/** the spacing preset keys, in slider order. */
export const themeSpacingKeys = Object.keys(THEME_SPACING) as ThemeSpacing[];

/**
 * The font family catalog, aligned 1:1 with shadcn's `FONT_DEFINITIONS`
 * (`apps/v4/lib/font-definitions.ts`): the same 26 families, in the same order
 * and grouped by the same type.
 *
 * shadcn's model is **three root roles + an independent heading role**:
 * `--font-sans` / `--font-serif` / `--font-mono` are the roots, and
 * `--font-heading` may point at any family. The serif faces therefore live in
 * their own arm rather than inside the heading arm, so body copy can go serif
 * while the heading stays sans (or the reverse) without ambiguity.
 *
 * Each arm is the **single source** for its families; {@link THEME_FONT_HEADING}
 * composes them so a family is never listed twice. `system` maps to `undefined`
 * so the engine keeps its matching `LITERAL_DEFAULTS` stack.
 */

/** the sans families (shadcn `type: "sans"`), in shadcn's declaration order. */
const SANS_FAMILIES = {
  geist: 'Geist',
  inter: 'Inter',
  'noto-sans': 'Noto Sans',
  'nunito-sans': 'Nunito Sans',
  figtree: 'Figtree',
  roboto: 'Roboto',
  raleway: 'Raleway',
  'dm-sans': 'DM Sans',
  'public-sans': 'Public Sans',
  outfit: 'Outfit',
  oxanium: 'Oxanium',
  manrope: 'Manrope',
  'space-grotesk': 'Space Grotesk',
  montserrat: 'Montserrat',
  'ibm-plex-sans': 'IBM Plex Sans',
  'source-sans-3': 'Source Sans 3',
  'instrument-sans': 'Instrument Sans'
} as const satisfies Record<string, string>;

/** the mono families (shadcn `type: "mono"`). */
const MONO_FAMILIES = {
  'jetbrains-mono': 'JetBrains Mono',
  'geist-mono': 'Geist Mono'
} as const satisfies Record<string, string>;

/** the serif families (shadcn `type: "serif"`). */
const SERIF_FAMILIES = {
  'noto-serif': 'Noto Serif',
  'roboto-slab': 'Roboto Slab',
  merriweather: 'Merriweather',
  lora: 'Lora',
  'playfair-display': 'Playfair Display',
  'eb-garamond': 'EB Garamond',
  'instrument-serif': 'Instrument Serif'
} as const satisfies Record<string, string>;

/** body / UI family presets → `--font-sans`. */
export const THEME_FONT_SANS = { system: undefined, ...SANS_FAMILIES } as const satisfies Record<
  string,
  string | undefined
>;

/** code family presets → `--font-mono`. */
export const THEME_FONT_MONO = { system: undefined, ...MONO_FAMILIES } as const satisfies Record<
  string,
  string | undefined
>;

/** serif copy family presets → `--font-serif`. */
export const THEME_FONT_SERIF = { system: undefined, ...SERIF_FAMILIES } as const satisfies Record<
  string,
  string | undefined
>;

/**
 * heading family presets → `--font-heading`.
 *
 * Every family may be a heading (shadcn's `FONT_HEADING_OPTIONS` is `inherit` +
 * the full 26-family list), so this composes the three arms rather than listing
 * families again. `system` first mirrors shadcn's "Inherit" option.
 */
export const THEME_FONT_HEADING = {
  system: undefined,
  ...SANS_FAMILIES,
  ...MONO_FAMILIES,
  ...SERIF_FAMILIES
} as const satisfies Record<string, string | undefined>;

/** the font sans preset keys, in option order. */
export const themeFontSansKeys = Object.keys(THEME_FONT_SANS) as (keyof typeof THEME_FONT_SANS)[];

/** the font heading preset keys, in option order. */
export const themeFontHeadingKeys = Object.keys(THEME_FONT_HEADING) as (keyof typeof THEME_FONT_HEADING)[];

/** the font mono preset keys, in option order. */
export const themeFontMonoKeys = Object.keys(THEME_FONT_MONO) as (keyof typeof THEME_FONT_MONO)[];

/** the font serif preset keys, in option order. */
export const themeFontSerifKeys = Object.keys(THEME_FONT_SERIF) as (keyof typeof THEME_FONT_SERIF)[];

/** a loadable font family key (`'inter'` / `'eb-garamond'` / …): the three root tables minus `system`. */
export type ThemeFontKey =
  | Exclude<keyof typeof THEME_FONT_SANS, 'system'>
  | Exclude<keyof typeof THEME_FONT_MONO, 'system'>
  | Exclude<keyof typeof THEME_FONT_SERIF, 'system'>;

/**
 * every loadable font family key, in shadcn's declaration order (sans → mono →
 * serif).
 *
 * `system` is deliberately absent: it is a theme-only sentinel for "keep the
 * engine's system stack", not a family a consumer can load — the CLI's preset
 * picklist and any "which families exist" check want the loadable set.
 *
 * Each arm's `Object.keys` is cast to the key union (rather than inferred) so the
 * element type is exactly that union: an inferred `string[]` would widen the
 * vocabulary away for downstream consumers like `PRESET_FONTS`.
 */
export const themeFontKeys = [
  ...Object.keys(THEME_FONT_SANS).filter(key => key !== 'system'),
  ...Object.keys(THEME_FONT_MONO).filter(key => key !== 'system'),
  ...Object.keys(THEME_FONT_SERIF).filter(key => key !== 'system')
] as ThemeFontKey[];

/** every engine default in one place. */
export const DEFAULT_OPTIONS = {
  base: 'zinc' as PaletteKey,
  primary: 'indigo' as PaletteKey,
  feedback: DEFAULT_FEEDBACK_SCHEME,
  surfaceStyle: 'layered',
  // 语义层与字面量层都**不加前缀**：token 名与 shadcn 一一对应（`--background` /
  // `--card` / `--ring`…），这是"对齐 shadcn 词表"的前提（docs/design/theme.md §4.4）。
  // 需要命名空间的宿主把 `prefix` 设成自己的字符串即可（`false` 是默认）。
  prefix: false,
  size: 'md',
  radius: 'md',
  spacing: 'default',
  // font 无单一预设键：缺省时走 LITERAL_DEFAULTS 系统栈
  font: undefined,
  borderOpacity: 1,
  format: 'hsl',
  styleTarget: ':root',
  darkSelector: 'class'
} as const satisfies ThemeOptions;
