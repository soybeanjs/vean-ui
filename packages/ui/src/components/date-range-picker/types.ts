import type { CalendarRangeUi } from '@vean/aria/calendar-range';
import type {
  DateRangePickerCompactProps,
  DateRangePickerCompactEmits,
  DateRangePickerUi
} from '@vean/aria/date-range-picker';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the DateRangePicker component.
 */
export interface DateRangePickerProps extends DateRangePickerCompactProps {
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
  ui?: Partial<DateRangePickerUi>;
  /**
   * Per-slot class overrides for the CalendarRange component within the DateRangePicker.
   */
  calendarRangeUi?: Partial<CalendarRangeUi>;
}

/**
 * Events for the DateRangePicker component.
 */
export type DateRangePickerEmits = DateRangePickerCompactEmits;

/**
 * Slots for the DateRangePicker component.
 */
export type DateRangePickerSlots = {
  /**
   * Custom content rendered before the date range segments.
   */
  leading?: () => any;
  /**
   * Custom content rendered between the start and end segment groups.
   */
  separator?: () => any;
};
