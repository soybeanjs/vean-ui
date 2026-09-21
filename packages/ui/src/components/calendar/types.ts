import type { CalendarCompactProps, CalendarCompactEmits, CalendarCompactSlots, CalendarUi } from '@vean/aria/calendar';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Calendar component.
 */
export interface CalendarProps<M extends boolean = false> extends CalendarCompactProps<M> {
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
  ui?: Partial<CalendarUi>;
}

/**
 * Events for the Calendar component.
 */
export type CalendarEmits<M extends boolean = false> = CalendarCompactEmits<M>;

/**
 * Slots for the Calendar component.
 */
export type CalendarSlots<M extends boolean = false> = CalendarCompactSlots<M>;
