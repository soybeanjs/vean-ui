import type {
  TimeRangeFieldCompactProps,
  TimeRangeFieldCompactEmits,
  TimeRangeFieldCompactSlots,
  TimeRangeFieldUi
} from '@vean/aria/time-range-field';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the TimeRangeField component.
 */
export interface TimeRangeFieldProps extends TimeRangeFieldCompactProps {
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
  ui?: Partial<TimeRangeFieldUi>;
}

/**
 * Events for the TimeRangeField component.
 */
export type TimeRangeFieldEmits = TimeRangeFieldCompactEmits;

/**
 * Slots for the TimeRangeField component.
 */
export type TimeRangeFieldSlots = TimeRangeFieldCompactSlots;
