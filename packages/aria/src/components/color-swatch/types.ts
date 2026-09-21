import type { ColorValue, BaseProps, UiClass } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the ColorSwatch component.
 */
export interface ColorSwatchRootProps extends Omit<PrimitiveWithBaseProps, 'color'> {
  /**
   * Theme color of the component.
   */
  color?: string | ColorValue;
  /**
   * Label text rendered by the component.
   */
  label?: string;
}

/**
 * Properties for the ColorSwatch component slots.
 */
export interface ColorSwatchSlotProps {
  /**
   * Color value in RGB format, e.g., "rgb(255, 0, 0)".
   */
  color: string;
  /**
   * Alpha value of the color, ranging from 0 to 1.
   */
  alpha: number;
}

/**
 * Slots for the ColorSwatch component.
 */
export type ColorSwatchRootSlots = {
  default?: (props: ColorSwatchSlotProps) => any;
};

/**
 * Events for the ColorSwatch component.
 */
export interface ColorSwatchCheckerProps extends BaseProps {}

/**
 * Events for the ColorSwatch component.
 */
export interface ColorSwatchFillProps extends BaseProps {}

/**
 * Properties for the ColorSwatch component in compact mode.
 */
export interface ColorSwatchCompactProps extends ColorSwatchRootProps {
  /**
   * Props for the checker element of the ColorSwatch component.
   */
  checkerProps?: ColorSwatchCheckerProps;
  /**
   * Props for the fill element of the ColorSwatch component.
   */
  fillProps?: ColorSwatchFillProps;
}

/**
 * Slots for the ColorSwatch component in compact mode.
 */
export type ColorSwatchCompactSlots = ColorSwatchRootSlots;

/**
 * Slots for the ColorSwatch component.
 */
export type ColorSwatchUiSlot = 'root' | 'checker' | 'fill';

/**
 * UI classes for the ColorSwatch component.
 */
export type ColorSwatchUi = UiClass<ColorSwatchUiSlot>;
