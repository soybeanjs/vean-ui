import type {
  InputNumberCompactEmits,
  InputNumberCompactProps,
  InputNumberCompactSlots,
  InputNumberUi
} from '@vean/aria/input-number';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the InputNumber component.
 */
export interface InputNumberProps extends InputNumberCompactProps {
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
  ui?: Partial<InputNumberUi>;
  /**
   * Whether to center the input.
   *
   * @defaultValue false
   */
  center?: boolean;
}

/**
 * Events for the InputNumber component.
 */
export type InputNumberEmits = InputNumberCompactEmits;

/**
 * Slots for the InputNumber component.
 */
export type InputNumberSlots = InputNumberCompactSlots;
