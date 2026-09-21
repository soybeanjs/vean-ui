import type { InputCompactProps, InputCompactSlots, InputRootEmits, InputUi } from '@vean/aria/input';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Input component.
 */
export interface InputProps extends InputCompactProps {
  /**
   * root class
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<InputUi>;
}

/**
 * Events for the Input component.
 */
export type InputEmits = InputRootEmits;

/**
 * Slots for the Input component.
 */
export type InputSlots = InputCompactSlots;
