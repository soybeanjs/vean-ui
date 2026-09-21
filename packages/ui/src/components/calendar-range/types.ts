import type {
  CalendarRangeCompactProps,
  CalendarRangeCompactEmits,
  CalendarRangeCompactSlots,
  CalendarRangeUi
} from '@vean/aria/calendar-range';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the CalendarRange component.
 */
export interface CalendarRangeProps extends CalendarRangeCompactProps {
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
  ui?: Partial<CalendarRangeUi>;
}

/**
 * Events for the CalendarRange component.
 */
export type CalendarRangeEmits = CalendarRangeCompactEmits;

/**
 * Slots for the CalendarRange component.
 */
export type CalendarRangeSlots = CalendarRangeCompactSlots;
