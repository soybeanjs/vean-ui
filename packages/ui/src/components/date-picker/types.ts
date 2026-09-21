import type { CalendarUi } from '@vean/aria/calendar';
import type { DatePickerUi, DatePickerCompactProps, DatePickerCompactEmits } from '@vean/aria/date-picker';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the DatePicker component.
 */
export interface DatePickerProps extends DatePickerCompactProps {
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
  ui?: Partial<DatePickerUi>;
  /**
   * Per-slot class overrides for the Calendar component within the DatePicker.
   */
  calendarUi?: Partial<CalendarUi>;
}

/**
 * Events for the DatePicker component.
 */
export type DatePickerEmits = DatePickerCompactEmits;

/**
 * Slots for the DatePicker component.
 */
export type DatePickerSlots = {
  /**
   * Custom content rendered before the date segments.
   */
  leading?: () => any;
};
