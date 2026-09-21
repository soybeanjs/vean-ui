import type { DateValue } from '../../date';
import type { BaseProps, UiClass } from '../../types';
import type { CalendarCompactProps, CalendarCompactEmits } from '../calendar/types';
import type { DateFieldUiSlot } from '../date-field/types';
import type { PopoverCompactProps, PopoverCompactEmits, PopoverUiSlot } from '../popover/types';

/**
 * Properties for the DatePickerCompact component.
 */
export interface DatePickerCompactProps extends PopoverCompactProps, CalendarCompactProps<false> {
  dateFieldProps?: BaseProps;
}

/**
 * Events for the DatePickerCompact component.
 */
export type DatePickerCompactEmits = PopoverCompactEmits & CalendarCompactEmits<false>;

export interface DatePickerCompactSlotProps {
  open: boolean;
  close: () => void;
  calendarProps: CalendarCompactProps<false>;
  onUpdateModelValue: (value: DateValue | undefined) => void;
  onUpdatePlaceholder: (placeholder: DateValue) => void;
}

/**
 * Slots for the DatePickerCompact component.
 */
export type DatePickerCompactSlots = {
  /**
   * Custom content rendered before the date segments.
   */
  leading?: () => any;
  /**
   * Custom content for the calendar popup, receiving the open/close controls and calendar props.
   */
  default?: (props: DatePickerCompactSlotProps) => any;
};

/**
 * UI slot names for the DatePicker component.
 */
export type DatePickerUiSlot = PopoverUiSlot | DateFieldUiSlot;

/**
 * UI class for the DatePicker component.
 */
export type DatePickerUi = UiClass<DatePickerUiSlot>;
