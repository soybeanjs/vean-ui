import type { SemanticToken, TokenOverride } from '@vean/theme';

export type { ThemeSize } from '@vean/theme';

/**
 * the component `color` prop vocabulary — the v2 role families a component can
 * paint with (fills, statuses, carbon). Maps 1:1 onto the style recipes.
 */
export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | 'info' | 'carbon';

/**
 * the color payload of a custom theme preset: light/dark token overrides in the
 * engine's own vocabulary (`primary: 'indigo.600'`, complete colors, …).
 */
export interface ThemePresetColors {
  light: Partial<Record<SemanticToken, TokenOverride>>;
  dark?: Partial<Record<SemanticToken, TokenOverride>>;
}

/** a preset input: inline colors, or a `{ name }` reference to a stored preset. */
export type ThemePresetInput = ThemePresetColors | { name: string };
