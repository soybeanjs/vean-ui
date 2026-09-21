import type {
  ColorSwatchPickerCompactEmits,
  ColorSwatchPickerCompactProps,
  ColorSwatchPickerUiSlot
} from '@vean/aria/color-swatch-picker';
import type { ClassValue, UiClass } from '@vean/aria/types';
import type { ColorSwatchPickerShape } from '@/styles/color-swatch-picker';
import type { ThemeSize } from '@/theme';

/**
 * Additional UI slots for the color swatch picker component.
 */
export type ColorSwatchPickerExtraUiSlot = 'checker' | 'fill';

/**
 * Extended UI class overrides for the ColorSwatchPicker component.
 */
export type ColorSwatchPickerExtendedUi = UiClass<ColorSwatchPickerUiSlot | ColorSwatchPickerExtraUiSlot>;

/**
 * Properties for the ColorSwatchPicker component.
 */
export interface ColorSwatchPickerProps extends ColorSwatchPickerCompactProps<boolean> {
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
  ui?: Partial<ColorSwatchPickerExtendedUi>;
  /**
   * Shape of the component.
   */
  shape?: ColorSwatchPickerShape;
}

/**
 * Events for the ColorSwatchPicker component.
 */
export type ColorSwatchPickerEmits = ColorSwatchPickerCompactEmits<boolean>;

export type { ColorSwatchPickerShape };
