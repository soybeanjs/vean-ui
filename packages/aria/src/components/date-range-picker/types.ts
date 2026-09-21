import type { DateRange, DateValue } from '../../date';
import type { BaseProps, UiClass } from '../../types';
import type { CalendarRangeCompactProps, CalendarRangeCompactEmits } from '../calendar-range/types';
import type { DateRangeFieldUiSlot } from '../date-range-field/types';
import type { PopoverCompactProps, PopoverCompactEmits, PopoverUiSlot } from '../popover/types';

/**
 * Properties for the DateRangePickerCompact component.
 */
export interface DateRangePickerCompactProps extends PopoverCompactProps, CalendarRangeCompactProps {
  dateFieldProps?: BaseProps;
}

/**
 * Events for the DateRangePickerCompact component.
 */
export type DateRangePickerCompactEmits = PopoverCompactEmits & CalendarRangeCompactEmits;

export interface DateRangePickerCompactSlotProps {
  open: boolean;
  close: () => void;
  calendarRangeProps: CalendarRangeCompactProps;
  onUpdateModelValue: (value: DateRange) => void;
  onUpdatePlaceholder: (placeholder: DateValue) => void;
}

/**
 * Slots for the DateRangePickerCompact component.
 */
export type DateRangePickerCompactSlots = {
  /**
   * Custom content rendered before the date range segments.
   */
  leading?: () => any;
  /**
   * Custom content rendered between the start and end segment groups.
   */
  separator?: () => any;
  /**
   * Custom content for the calendar range popup, receiving the open/close controls and calendar props.
   */
  default?: (props: DateRangePickerCompactSlotProps) => any;
};

/**
 * UI slot names for the DateRangePicker component.
 */
export type DateRangePickerUiSlot = PopoverUiSlot | DateRangeFieldUiSlot;

/**
 * UI class for the DateRangePicker component.
 */
export type DateRangePickerUi = UiClass<DateRangePickerUiSlot>;

export type { DateRange };
