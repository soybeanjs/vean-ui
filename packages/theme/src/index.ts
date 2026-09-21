/**
 * @vean/theme — the Vean theme engine.
 *
 * Three layers (docs/theme.md):
 * 1. **palette** (static, `generatePaletteCss`): 26 built-in palettes × 11 levels
 *    plus `white` / `black`, stored as naked channels so alpha composition and
 *    color inheritance both work.
 * 2. **semantic** (`resolveThemeMap` → `emitThemeCss`): the token layer — every
 *    token is a *reference* to a palette level, so a theme change is a reference
 *    swap and the emitted CSS stays tiny.
 * 3. **literal**: radius / sizing / spacing / z-index / line / typography tokens.
 *
 * Token names are unprefixed and follow the shadcn vocabulary (`--background`,
 * `--card`, `--popover`, `--border`, `--ring`, `--sidebar*`), so a stylesheet
 * written against shadcn's token names resolves here unchanged.
 *
 * The engine is **only a declaration**: `CORE_RULES` says which palette level
 * every token takes, and `overrides` are applied verbatim.
 * Nothing is measured, shifted or corrected — readability is the theme author's
 * call, checked in the customizer or by `axe`, not an engine contract
 * (docs/theme.md §4.3).
 */

export { resolveThemeMap } from './theme-map';
export { emitThemeCss, generatePaletteCss } from './emit';
export { resolveTokenColor, resolveThemeColors, resolveColorRef, valueRef } from './resolve';
// `valueRef` 是 UI 层唯一需要越过包边界的东西：定制面板用它把派生值显示成
// `palette.level` / 完整色的引用形式（实现放在 `./resolve`）。
export {
  PALETTE_KEYS,
  PALETTE_LEVELS,
  NEUTRAL_PALETTES,
  isPaletteKey,
  isPaletteLevel,
  isNeutralFamily,
  paletteChannel,
  paletteColor,
  simpleChannel,
  simpleColor
} from './palette';
export {
  ROLE_RAMP_ROLES,
  ALPHA_RULES,
  ALPHA_TOKENS,
  BRAND_TOKENS,
  CHART_RAMP,
  CHART_TOKENS,
  CORE_RULES,
  CORE_TOKENS,
  CARBON_TOKENS,
  FILL_TOKENS,
  LINE_TOKENS,
  REGION_TOKENS,
  BORDER_ALPHA_TOKENS,
  MASK_TOKENS,
  SEMANTIC_TOKENS,
  isSemanticToken,
  STATUS_FOREGROUND_LEVELS,
  STATUS_NAMES,
  STATUS_SUFFIXES,
  SURFACE_TOKENS,
  TEXT_TOKENS
} from './semantic';
export { FEEDBACK_SCHEMES, feedbackScheme } from './schemes';
export type { SpacingRung } from './literals';
export {
  LITERAL_DEFAULTS,
  RADIUS_RUNG_KEYS,
  SPACING_GRID_COEFFICIENTS,
  SPACING_RUNGS,
  literalTokens,
  resolveFontValue
} from './literals';
export {
  DEFAULT_OPTIONS,
  SPACING_GRID,
  THEME_RADIUS,
  THEME_SIZE,
  THEME_SPACING,
  THEME_FONT_SANS,
  THEME_FONT_HEADING,
  THEME_FONT_MONO,
  THEME_FONT_SERIF,
  DARK_SELECTOR,
  themeSizeKeys,
  themeRadiusKeys,
  themeSpacingKeys,
  themeFontSansKeys,
  themeFontHeadingKeys,
  themeFontMonoKeys,
  themeFontSerifKeys,
  themeFontKeys
} from './defaults';
export type { ThemeFontKey } from './defaults';
export {
  darkClassName,
  getDarkSelector,
  isPaletteLevelRef,
  isThemeSpacing,
  resolveColorScheme,
  resolveDocumentColorScheme,
  resolveRadiusValue,
  resolveSizeValue,
  resolveSpacingValue
} from './shared';

export type { FeedbackScheme } from './schemes';
export type {
  AlphaToken,
  ChartToken,
  ColorFormat,
  CoreToken,
  ColorValue,
  DarkSelectorValue,
  EmitThemeOptions,
  FeedbackSchemeKey,
  HSLColor,
  LevelOrSimple,
  LevelSource,
  LiteralToken,
  OKLCHColor,
  PaletteKey,
  PaletteLevel,
  PaletteLevelRef,
  RegionToken,
  RoleRampRole,
  SemanticToken,
  SimpleColorName,
  StatusName,
  StatusToken,
  StyleTarget,
  SurfaceStyle,
  ThemeMap,
  ThemeMode,
  ThemeModePreference,
  ThemeOptions,
  ThemeOverrides,
  ThemeRadius,
  ThemeRadiusValue,
  ThemeSize,
  ThemeSizeValue,
  ThemeSpacing,
  ThemeSpacingValue,
  ThemeFont,
  TokenOverride,
  TokenPrefix,
  TokenRef,
  TokenRule,
  TokenValue
} from './types';
