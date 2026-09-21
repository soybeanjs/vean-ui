import type { ColorPickerCompactProps, ColorPickerCompactEmits, ColorPickerUi } from '@vean/aria/color-picker';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the ColorPicker component.
 */
export interface ColorPickerProps extends ColorPickerCompactProps {
  /**
   * Additional class names applied to the trigger element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ColorPickerUi>;
}

/**
 * Events for the ColorPicker component.
 */
export type ColorPickerEmits = ColorPickerCompactEmits;
