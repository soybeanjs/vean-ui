import type { DateFieldCompactProps, DateFieldCompactEmits, DateFieldUi } from '@vean/aria/date-field';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the DateField component.
 */
export interface DateFieldProps extends DateFieldCompactProps {
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
  ui?: Partial<DateFieldUi>;
}

/**
 * Events for the DateField component.
 */
export type DateFieldEmits = DateFieldCompactEmits;
