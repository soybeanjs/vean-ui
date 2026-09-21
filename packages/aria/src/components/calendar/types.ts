import type { ComputedRef, ShallowRef } from 'vue';
import type { DateValue, Formatter, DateGrid, DateMatcher, WeekDayFormat, WeekStartsOn } from '../../date';
import type { Direction, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { SelectOptionData } from '../select/types';

/**
 * Model value type for the calendar component.
 */
export type CalendarModelValue<M extends boolean = false> = M extends true
  ? DateValue[] | undefined
  : DateValue | undefined;

/**
 * Properties for the CalendarRoot component.
 */
export interface CalendarRootProps<M extends boolean = false> extends Omit<
  PrimitiveWithBaseProps,
  'dir' | 'placeholder'
> {
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
  /**
   * Locale.
   */
  locale?: string;
  /**
   * Current model value.
   */
  modelValue?: CalendarModelValue<M>;
  /**
   * Default value.
   */
  defaultValue?: CalendarModelValue<M>;
  /**
   * Whether multiple values are supported.
   */
  multiple?: M;
  /**
   * Placeholder.
   */
  placeholder?: DateValue;
  /**
   * Default placeholder.
   */
  defaultPlaceholder?: DateValue;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Whether the component is readonly.
   */
  readonly?: boolean;
  /**
   * Whether paged navigation.
   */
  pagedNavigation?: boolean;
  /**
   * Whether prevent deselect.
   */
  preventDeselect?: boolean;
  /**
   * Week starts on.
   */
  weekStartsOn?: WeekStartsOn;
  /**
   * Weekday format.
   */
  weekdayFormat?: WeekDayFormat;
  /**
   * Calendar label.
   */
  calendarLabel?: string;
  /**
   * Whether fixed weeks.
   */
  fixedWeeks?: boolean;
  /**
   * Max value.
   */
  maxValue?: DateValue;
  /**
   * Min value.
   */
  minValue?: DateValue;
  /**
   * Number of months.
   */
  numberOfMonths?: number;
  /**
   * Whether initial focus.
   */
  initialFocus?: boolean;
  /**
   * Whether the date is disabled.
   */
  isDateDisabled?: DateMatcher;
  /**
   * Whether the date is unavailable.
   */
  isDateUnavailable?: DateMatcher;
  /**
   * Next page.
   */
  nextPage?: (placeholder: DateValue) => DateValue;
  /**
   * Prev page.
   */
  prevPage?: (placeholder: DateValue) => DateValue;
  /**
   * Whether to disable days outside current view.
   */
  disableDaysOutsideCurrentView?: boolean;
}

/**
 * Events for the CalendarRoot component.
 */
export type CalendarRootEmits<M extends boolean = false> = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [date: CalendarModelValue<M>];
  /**
   * Emitted when the placeholder value changes.
   */
  'update:placeholder': [date: DateValue];
};

/**
 * Properties for the CalendarHeader component.
 */
export interface CalendarHeaderProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarHeading component.
 */
export interface CalendarHeadingProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarGrid component.
 */
export interface CalendarGridProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarGridHead component.
 */
export interface CalendarGridHeadProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarGridBody component.
 */
export interface CalendarGridBodyProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarGridRow component.
 */
export interface CalendarGridRowProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarHeadCell component.
 */
export interface CalendarHeadCellProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the CalendarCell component.
 */
export interface CalendarCellProps extends PrimitiveWithBaseProps {
  /**
   * Date.
   */
  date: Date;
}

/**
 * Properties for the CalendarCellTrigger component.
 */
export interface CalendarCellTriggerProps extends ButtonProps {
  /**
   * Day.
   */
  day: Date;
  /**
   * Month.
   */
  month: Date;
}

/**
 * Slot properties for the CalendarCellTrigger component.
 */
export interface CalendarCellTriggerSlotProps {
  /**
   * Day value string exposed in the slot scope.
   */
  dayValue: string;
  /**
   * Whether the date is disabled.
   */
  disabled: boolean;
  /**
   * Whether the date is selected.
   */
  selected: boolean;
  /**
   * Whether the date is unavailable.
   */
  unavailable: boolean;
  /**
   * Whether the date is today.
   */
  today: boolean;
  /**
   * Whether the date is outside the current view.
   */
  outsideView: boolean;
  /**
   * Whether the date is outside the visible view.
   */
  outsideVisibleView: boolean;
}

/**
 * Slots for the CalendarCellTrigger component.
 */
export type CalendarCellTriggerSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: CalendarCellTriggerSlotProps) => any;
};

/**
 * Properties for the CalendarPrev component.
 */
export interface CalendarPrevProps extends ButtonProps {
  /**
   * Prev page.
   */
  prevPage?: (placeholder: DateValue) => DateValue;
}

/**
 * Properties for the CalendarNext component.
 */
export interface CalendarNextProps extends ButtonProps {
  /**
   * Next page.
   */
  nextPage?: (placeholder: DateValue) => DateValue;
}

/**
 * Context for the CalendarRoot component.
 */
export interface CalendarRootContext extends ToContext<
  CalendarRootProps,
  | 'disableDaysOutsideCurrentView'
  | 'disabled'
  | 'fixedWeeks'
  | 'initialFocus'
  | 'numberOfMonths'
  | 'pagedNavigation'
  | 'preventDeselect'
  | 'readonly'
> {
  /**
   * Locale used by the component context.
   */
  locale: ComputedRef<string>;
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Week starts on used by the component context.
   */
  weekStartsOn: ComputedRef<WeekStartsOn>;
  /**
   * Weekday format used by the component context.
   */
  weekdayFormat: ComputedRef<WeekDayFormat>;
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DateValue | DateValue[] | undefined>;
  /**
   * Whether multiple values are supported.
   */
  multiple: ComputedRef<boolean>;
  /**
   * Placeholder used by the component context.
   */
  placeholder: ShallowRef<DateValue>;
  /**
   * Grid used by the component context.
   */
  grid: ShallowRef<DateGrid<Date>[]>;
  /**
   * Parent element used by the component context.
   */
  parentElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Full calendar label used by the component context.
   */
  fullCalendarLabel: ComputedRef<string>;
  /**
   * Heading value used by the component context.
   */
  headingValue: ComputedRef<string>;
  /**
   * Whether the current value is invalid.
   */
  isInvalid: ComputedRef<boolean>;
  /**
   * Min value used by the component context.
   */
  minValue: ComputedRef<DateValue | undefined>;
  /**
   * Max value used by the component context.
   */
  maxValue: ComputedRef<DateValue | undefined>;
  /**
   * Whether the placeholder is focusable.
   */
  isPlaceholderFocusable: ComputedRef<boolean>;
  /**
   * First focusable date used by the component context.
   */
  firstFocusableDate: ComputedRef<DateValue | undefined>;
  /**
   * Whether the component has selected date.
   */
  hasSelectedDate: ComputedRef<boolean>;
  /**
   * Whether the selected date is disabled.
   */
  isSelectedDateDisabled: ComputedRef<boolean>;
  /**
   * Formatter used by the component context.
   */
  formatter: Formatter;
  /**
   * Callback invoked when the date changes.
   */
  onDateChange: (date: DateValue) => void;
  /**
   * Callback invoked when the placeholder changes.
   */
  onPlaceholderChange: (date: DateValue) => void;
  /**
   * Whether the date is disabled.
   */
  isDateDisabled: DateMatcher;
  /**
   * Whether the date is selected.
   */
  isDateSelected: DateMatcher;
  /**
   * Whether the date is unavailable.
   */
  isDateUnavailable?: DateMatcher;
  /**
   * Whether an outside visible view.
   */
  isOutsideVisibleView: (date: DateValue) => boolean;
  /**
   * Prev page used by the component context.
   */
  prevPage: (prevPageFunc?: (date: DateValue) => DateValue) => void;
  /**
   * Next page used by the component context.
   */
  nextPage: (nextPageFunc?: (date: DateValue) => DateValue) => void;
  /**
   * Whether the previous button is disabled.
   */
  isPrevButtonDisabled: (prevPageFunc?: (date: DateValue) => DateValue) => boolean;
  /**
   * Whether the next button is disabled.
   */
  isNextButtonDisabled: (nextPageFunc?: (date: DateValue) => DateValue) => boolean;
}

/**
 * Slot properties for the CalendarRoot component.
 */
export interface CalendarRootSlotProps<M extends boolean = false> {
  /**
   * Date exposed in the slot scope.
   */
  date: DateValue;
  /**
   * Heading value exposed in the slot scope.
   */
  headingValue: string;
  /**
   * Placeholder exposed in the slot scope.
   */
  placeholder: DateValue;
  /**
   * Grid exposed in the slot scope.
   */
  grid: DateGrid<Date>[];
  /**
   * Week days exposed in the slot scope.
   */
  weekDays: string[];
  /**
   * Week starts on exposed in the slot scope.
   */
  weekStartsOn: number;
  /**
   * Locale exposed in the slot scope.
   */
  locale: string;
  /**
   * Whether fixed weeks.
   */
  fixedWeeks: boolean;
  /**
   * Current model value.
   */
  modelValue: CalendarModelValue<M>;
  /**
   * Formatter exposed in the slot scope.
   */
  formatter: Formatter;
  /**
   * Min value exposed in the slot scope.
   */
  minValue: DateValue | undefined;
  /**
   * Max value exposed in the slot scope.
   */
  maxValue: DateValue | undefined;
  /**
   * Whether the component is disabled.
   */
  disabled: boolean;
  /**
   * Callback invoked when the placeholder changes.
   */
  onPlaceholderChange: (date: DateValue) => void;
  /**
   * Year options exposed in the slot scope.
   */
  yearOptions: SelectOptionData<number>[];
  /**
   * Callback invoked when the year changes.
   */
  onYearChange: (value?: number | undefined) => void;
  /**
   * Month options exposed in the slot scope.
   */
  monthOptions: SelectOptionData<number>[];
  /**
   * Callback invoked when the month changes.
   */
  onMonthChange: (value?: number | undefined) => void;
}

/**
 * Slots for the Calendar component.
 */
export type CalendarRootSlots<M extends boolean = false> = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: CalendarRootSlotProps<M>) => any;
};

/**
 * Slot properties for the CalendarHeading component.
 */
export interface CalendarHeadingSlotProps extends Pick<
  CalendarRootSlotProps,
  'headingValue' | 'yearOptions' | 'onYearChange' | 'monthOptions' | 'onMonthChange'
> {
  selectedMonth: number;
  selectedYear: number;
}

/**
 * Available UI slots for the Calendar component.
 */
export type CalendarUiSlot =
  | 'root'
  | 'header'
  | 'heading'
  | 'prev'
  | 'next'
  | 'grid'
  | 'gridHead'
  | 'gridBody'
  | 'gridRow'
  | 'headCell'
  | 'cell'
  | 'cellTrigger';

/**
 * UI class overrides for the Calendar component.
 */
export type CalendarUi = UiClass<CalendarUiSlot>;

/**
 * Properties for the CalendarCompact component.
 */
export interface CalendarCompactProps<M extends boolean = false> extends CalendarRootProps<M> {
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: CalendarHeaderProps;
  /**
   * Properties forwarded to the heading element.
   */
  headingProps?: CalendarHeadingProps;
  /**
   * Properties forwarded to the prev element.
   */
  prevProps?: CalendarPrevProps;
  /**
   * Properties forwarded to the next element.
   */
  nextProps?: CalendarNextProps;
  /**
   * Properties forwarded to the grid element.
   */
  gridProps?: CalendarGridProps;
  /**
   * Properties forwarded to the grid head element.
   */
  gridHeadProps?: CalendarGridHeadProps;
  /**
   * Properties forwarded to the grid body element.
   */
  gridBodyProps?: CalendarGridBodyProps;
  /**
   * Properties forwarded to the grid row element.
   */
  gridRowProps?: CalendarGridRowProps;
  /**
   * Properties forwarded to the head cell element.
   */
  headCellProps?: CalendarHeadCellProps;
  /**
   * Properties forwarded to the cell element.
   */
  cellProps?: CalendarCellProps;
  /**
   * Properties forwarded to the cell trigger element.
   */
  cellTriggerProps?: CalendarCellTriggerProps;
}

/**
 * Events for the CalendarCompact component.
 */
export type CalendarCompactEmits<M extends boolean = false> = CalendarRootEmits<M>;

/**
 * Slot properties for the day slot of the Calendar component.
 */
export interface CalendarDaySlotProps extends CalendarCellTriggerSlotProps {
  /**
   * Day value exposed in the slot scope.
   */
  day: Date;
  /**
   * Month value exposed in the slot scope.
   */
  month: Date;
}

/**
 * Slots for the CalendarCompact component.
 */
export type CalendarCompactSlots<M extends boolean = false> = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: { modelValue: CalendarModelValue<M> }) => any;
  /**
   * Custom content for the prev slot.
   */
  prev?: (props: { disabled: boolean }) => any;
  /**
   * Custom content for the heading slot.
   */
  heading?: (props: CalendarHeadingSlotProps) => any;
  /**
   * Custom content for the next slot.
   */
  next?: (props: { disabled: boolean }) => any;
  /**
   * Custom content for the head cell slot.
   */
  'head-cell'?: (props: { date: Date; index: number; label: string }) => any;
  /**
   * Custom content for the day slot.
   */
  day?: (props: CalendarDaySlotProps) => any;
};
