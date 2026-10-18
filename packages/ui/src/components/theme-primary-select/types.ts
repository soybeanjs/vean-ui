import type { ThemeSize } from '@/theme';

/**
 * Properties for the ThemePrimarySelect component.
 *
 * A context-bound dropdown bound to the active `SConfigProvider` theme. It
 * lists every built-in palette (`PaletteKey`) and writes the chosen one back as
 * the theme `primary`, so no `modelValue` is accepted.
 */
export interface ThemePrimarySelectProps {
  /**
   * Visual size of the select trigger.
   *
   * @default 'md'
   */
  size?: ThemeSize;
  /**
   * Render the minimal form: a single `500` swatch in the trigger and in each
   * option, instead of the five-level palette stack the theme customizer shows.
   *
   * @default true
   */
  simple?: boolean;
}
