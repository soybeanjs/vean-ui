import type { ComputedRef, ShallowRef } from 'vue';
import type { DateValue, DateGrid, DateMatcher, WeekDayFormat, WeekStartsOn, DateRange, Formatter } from '../../date';
import type { Direction, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { SelectOptionData } from '../select/types';

/**
 * Properties for the CalendarRangeRoot component.
 */
export interface CalendarRangeRootProps extends Omit<PrimitiveWithBaseProps, 'placeholder'> {
  /**
   * Default value.
   */
  defaultValue?: DateRange;
  /**
   * Default placeholder.
   */
  defaultPlaceholder?: DateValue;
  /**
   * Placeholder.
   */
  placeholder?: DateValue;
  /**
   * Current model value.
   */
  modelValue?: DateRange;
  /**
   * Whether to allow non contiguous ranges.
   */
  allowNonContiguousRanges?: boolean;
  /**
   * Whether paged navigation.
   */
  pagedNavigation?: boolean;
  /**
   * Whether prevent deselect.
   */
  preventDeselect?: boolean;
  /**
   * Maximum days.
   */
  maximumDays?: number;
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
   * Locale.
   */
  locale?: string;
  /**
   * Number of months.
   */
  numberOfMonths?: number;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Whether the component is readonly.
   */
  readonly?: boolean;
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
   * Whether a date highlightable.
   */
  isDateHighlightable?: DateMatcher;
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
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
  /**
   * Fixed date.
   */
  fixedDate?: 'start' | 'end';
}

/**
 * Events for the CalendarRangeRoot component.
 */
export type CalendarRangeRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [range: DateRange];
  /**
   * Emitted when the placeholder value changes.
   */
  'update:placeholder': [date: DateValue];
  /**
   * Emitted when the start value changes.
   */
  'update:startValue': [date: DateValue | null];
};

export interface CalendarRangeRootSlotProps {
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
  modelValue: DateRange;
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
 * Slots for the CalendarRangeRoot component.
 */
export type CalendarRangeRootSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: CalendarRangeRootSlotProps) => any;
};

/**
 * Properties for the CalendarRangeHeader component.
 */
export interface CalendarRangeHeaderProps extends PrimitiveWithBaseProps {}

/**
 * Slot properties for the CalendarRangeHeading component.
 */
export interface CalendarRangeHeadingSlotProps extends Pick<
  CalendarRangeRootSlotProps,
  'headingValue' | 'yearOptions' | 'onYearChange' | 'monthOptions' | 'onMonthChange'
> {
  selectedMonth: number;
  selectedYear: number;
}

/**
 * Properties for the CalendarRangeHeading component.
 */
export interface CalendarRangeHeadingProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarRangeGrid component.
 */
export interface CalendarRangeGridProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarRangeGridHead component.
 */
export interface CalendarRangeGridHeadProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarRangeGridBody component.
 */
export interface CalendarRangeGridBodyProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarRangeGridRow component.
 */
export interface CalendarRangeGridRowProps extends PrimitiveWithBaseProps {}
/**
 * Properties for the CalendarRangeHeadCell component.
 */
export interface CalendarRangeHeadCellProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the CalendarRangeCell component.
 */
export interface CalendarRangeCellProps extends PrimitiveWithBaseProps {
  /**
   * Date.
   */
  date: DateValue;
}

/**
 * Properties for the CalendarRangeCellTrigger component.
 */
export interface CalendarRangeCellTriggerProps extends ButtonProps {
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
 * Slot properties for the CalendarRangeCellTrigger component.
 */
export interface CalendarRangeCellTriggerSlotProps {
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
  /**
   * Whether the date is focused.
   */
  highlighted: boolean;
  /**
   * Whether the date is a highlighted start.
   */
  highlightedStart: boolean;
  /**
   * Whether the date is a highlighted end.
   */
  highlightedEnd: boolean;
  /**
   * Whether the date is a selection start.
   */
  selectionStart: boolean;
  /**
   * Whether the date is a selection end.
   */
  selectionEnd: boolean;
}

/**
 * Slots for the CalendarRangeCellTrigger component.
 */
export type CalendarRangeCellTriggerSlots = {
  default?: (props: CalendarRangeCellTriggerSlotProps) => any;
};

/**
 * Properties for the CalendarRangePrev component.
 */
export interface CalendarRangePrevProps extends ButtonProps {
  /**
   * Prev page.
   */
  prevPage?: (placeholder: DateValue) => DateValue;
}

/**
 * Properties for the CalendarRangeNext component.
 */
export interface CalendarRangeNextProps extends ButtonProps {
  /**
   * Next page.
   */
  nextPage?: (placeholder: DateValue) => DateValue;
}

/**
 * Context for the CalendarRangeRoot component.
 */
export interface CalendarRangeRootContext extends ToContext<
  CalendarRangeRootProps,
  | 'allowNonContiguousRanges'
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
  modelValue: ShallowRef<DateRange>;
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
   * Selected focusable date used by the component context.
   */
  selectedFocusableDate: ComputedRef<DateValue | undefined>;
  /**
   * Formatter used by the component context.
   */
  formatter: Formatter;
  /**
   * Highlighted range used by the component context.
   */
  highlightedRange: ComputedRef<DateRange | null>;
  /**
   * Fixed date used by the component context.
   */
  fixedDate: ComputedRef<'start' | 'end' | undefined>;
  /**
   * Maximum days used by the component context.
   */
  maximumDays: ComputedRef<number | undefined>;
  /**
   * Whether the date is unavailable.
   */
  isDateUnavailable?: DateMatcher;
  /**
   * Whether a date highlightable.
   */
  isDateHighlightable?: DateMatcher;
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
   * Whether the date belongs to the committed range band (both ends chosen).
   */
  isDateInRange: DateMatcher;
  /**
   * Whether a selection start.
   */
  isSelectionStart: DateMatcher;
  /**
   * Whether a selection end.
   */
  isSelectionEnd: DateMatcher;
  /**
   * Whether a highlighted start.
   */
  isHighlightedStart: DateMatcher;
  /**
   * Whether a highlighted end.
   */
  isHighlightedEnd: DateMatcher;
  /**
   * Whether an outside visible view.
   */
  isOutsideVisibleView: (date: DateValue) => boolean;
  /**
   * Set hovered date used by the component context.
   */
  setHoveredDate: (date?: DateValue) => void;
  /**
   * Hovered date used by the component context.
   */
  hoveredDate: ShallowRef<DateValue | undefined>;
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
 * Available UI slots for the CalendarRange component.
 */
export type CalendarRangeUiSlot =
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
 * UI class overrides for the CalendarRange component.
 */
export type CalendarRangeUi = UiClass<CalendarRangeUiSlot>;

/**
 * Properties for the CalendarRangeCompact component.
 */
export interface CalendarRangeCompactProps extends CalendarRangeRootProps {
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: CalendarRangeHeaderProps;
  /**
   * Properties forwarded to the heading element.
   */
  headingProps?: CalendarRangeHeadingProps;
  /**
   * Properties forwarded to the prev element.
   */
  prevProps?: CalendarRangePrevProps;
  /**
   * Properties forwarded to the next element.
   */
  nextProps?: CalendarRangeNextProps;
  /**
   * Properties forwarded to the grid element.
   */
  gridProps?: CalendarRangeGridProps;
  /**
   * Properties forwarded to the grid head element.
   */
  gridHeadProps?: CalendarRangeGridHeadProps;
  /**
   * Properties forwarded to the grid body element.
   */
  gridBodyProps?: CalendarRangeGridBodyProps;
  /**
   * Properties forwarded to the grid row element.
   */
  gridRowProps?: CalendarRangeGridRowProps;
  /**
   * Properties forwarded to the head cell element.
   */
  headCellProps?: CalendarRangeHeadCellProps;
  /**
   * Properties forwarded to the cell element.
   */
  cellProps?: CalendarRangeCellProps;
  /**
   * Properties forwarded to the cell trigger element.
   */
  cellTriggerProps?: CalendarRangeCellTriggerProps;
}

/**
 * Events for the CalendarRangeCompact component.
 */
export type CalendarRangeCompactEmits = CalendarRangeRootEmits;

/**
 * Slot properties for the CalendarRangeDay component.
 */
export interface CalendarRangeDaySlotProps extends CalendarRangeCellTriggerSlotProps {
  /**
   * Day exposed in the slot scope.
   */
  day: Date;
  /**
   * Month exposed in the slot scope.
   */
  month: Date;
}

/**
 * Slots for the CalendarRangeCompact component.
 */
export type CalendarRangeCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: { modelValue: DateRange }) => any;
  /**
   * Custom content for the prev slot.
   */
  prev?: (props: { disabled: boolean }) => any;
  /**
   * Custom content for the heading slot.
   */
  heading?: (props: CalendarRangeHeadingSlotProps) => any;
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
  day?: (props: CalendarRangeDaySlotProps) => any;
};
