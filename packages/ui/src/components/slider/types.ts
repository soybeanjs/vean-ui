import type { SliderCompactProps, SliderCompactEmits, SliderUi } from '@vean/aria/slider';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Slider component.
 */
export interface SliderProps extends SliderCompactProps {
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
   * Per-slot class overrides for the component.
   */
  ui?: Partial<SliderUi>;
}

/**
 * Events for the Slider component.
 */
export type SliderEmits = SliderCompactEmits;
