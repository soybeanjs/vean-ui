import type { ButtonShape, ButtonVariant } from '@/styles/button';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the ThemeModeToggle component.
 *
 * A context-bound cycling button bound to the active `SConfigProvider` theme.
 * Each click advances the preference through `auto` -> `light` -> `dark` ->
 * `auto`, and the icon always shows the *current* preference (monitor / sun /
 * moon) — so unlike `SThemeModeSwitch` it can express and return to `auto`
 * without a dropdown.
 */
export interface ThemeModeToggleProps {
  /**
   * Visual size of the button.
   *
   * @default 'md'
   */
  size?: ThemeSize;
  /**
   * Theme color of the button.
   *
   * @default 'accent'
   */
  color?: ThemeColor;
  /**
   * Visual variant of the button.
   *
   * @default 'ghost'
   */
  variant?: ButtonVariant;
  /**
   * Shape of the button.
   *
   * @default 'square'
   */
  shape?: ButtonShape;
  /**
   * Accessible label of the button. Defaults to the localized
   * `Scheme: <current preference>` text, which also drives the `title` tooltip.
   */
  ariaLabel?: string;
}
