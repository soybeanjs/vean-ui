import type {
  DateRangeFieldCompactProps,
  DateRangeFieldCompactEmits,
  DateRangeFieldCompactSlots,
  DateRangeFieldUi
} from '@vean/aria/date-range-field';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the DateRangeField component.
 */
export interface DateRangeFieldProps extends DateRangeFieldCompactProps {
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
  ui?: Partial<DateRangeFieldUi>;
}

/**
 * Events for the DateRangeField component.
 */
export type DateRangeFieldEmits = DateRangeFieldCompactEmits;

/**
 * Slots for the DateRangeField component.
 */
export type DateRangeFieldSlots = DateRangeFieldCompactSlots;
