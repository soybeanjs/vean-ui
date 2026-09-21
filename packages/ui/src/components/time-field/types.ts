import type { TimeFieldCompactProps, TimeFieldCompactEmits, TimeFieldUi } from '@vean/aria/time-field';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the TimeField component.
 */
export interface TimeFieldProps extends TimeFieldCompactProps {
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
  ui?: Partial<TimeFieldUi>;
}

/**
 * Events for the TimeField component.
 */
export type TimeFieldEmits = TimeFieldCompactEmits;

/**
 * Slots for the TimeField component.
 */
export type TimeFieldSlots = {
  /**
   * Content rendered before the time segments.
   */
  leading?: () => any;
  /**
   * Content rendered after the time segments.
   */
  trailing?: () => any;
};
