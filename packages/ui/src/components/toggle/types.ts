import type { ToggleEmits, ToggleProps as _ToggleProps } from '@vean/aria/toggle';
import type { ClassValue } from '@vean/aria/types';
import type { ToggleVariant, ToggleShape } from '@/styles/toggle';
import type { ThemeSize, ThemeColor } from '@/theme';

/**
 * Properties for the Toggle component.
 */
export interface ToggleProps extends _ToggleProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Visual variant of the component.
   */
  variant?: ToggleVariant;
  /**
   * Shape of the component.
   */
  shape?: ToggleShape;
}

export type { ToggleEmits, ToggleVariant, ToggleShape };
