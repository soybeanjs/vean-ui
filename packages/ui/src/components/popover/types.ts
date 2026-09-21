import type { PopoverCompactProps, PopoverCompactEmits, PopoverCompactSlots, PopoverUi } from '@vean/aria/popover';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Popover component.
 */
export interface PopoverProps extends PopoverCompactProps {
  /**
   * class of popup
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<PopoverUi>;
}

/**
 * Events for the Popover component.
 */
export type PopoverEmits = PopoverCompactEmits;

/**
 * Slots for the Popover component.
 */
export type PopoverSlots = PopoverCompactSlots;
