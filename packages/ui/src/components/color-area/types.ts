import type { ColorAreaCompactEmits, ColorAreaCompactProps, ColorAreaUi } from '@vean/aria/color-area';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the ColorArea component.
 */
export interface ColorAreaProps extends ColorAreaCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ColorAreaUi>;
}

/**
 * Events for the ColorArea component.
 */
export type ColorAreaEmits = ColorAreaCompactEmits;
