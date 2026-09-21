import type { ColorSwatchCompactProps, ColorSwatchCompactSlots, ColorSwatchUi } from '@vean/aria/color-swatch';
import type { ClassValue } from '@vean/aria/types';
import type { ColorSwatchShape } from '@/styles/color-swatch';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the ColorSwatch component.
 */
export interface ColorSwatchProps extends ColorSwatchCompactProps {
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
  ui?: Partial<ColorSwatchUi>;
  /**
   * Shape of the component.
   */
  shape?: ColorSwatchShape;
}

/**
 * Slots for the ColorSwatch component.
 */
export type ColorSwatchSlots = ColorSwatchCompactSlots;

export type { ColorSwatchShape };
