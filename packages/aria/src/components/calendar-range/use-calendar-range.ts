import { computed } from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { areAllDaysBetweenValid, isBefore, isBetweenInclusive } from '../../date';
import type { DateRange, DateMatcher, DateValue } from '../../date';
import { cloneDateValue } from '../../date/value';

export interface UseCalendarRangeStateProps {
  start: ComputedRef<DateValue | null | undefined>;
  end: ComputedRef<DateValue | null | undefined>;
  hoveredDate: ShallowRef<DateValue | undefined>;
  isDateDisabled: DateMatcher;
  isDateUnavailable: DateMatcher;
  isDateHighlightable?: DateMatcher;
  allowNonContiguousRanges: ComputedRef<boolean>;
  maximumDays: ComputedRef<number | undefined>;
}

function sortRange(a: DateValue, b: DateValue): DateRange {
  if (isBefore(b, a)) {
    return { start: cloneDateValue(b), end: cloneDateValue(a) };
  }

  return { start: cloneDateValue(a), end: cloneDateValue(b) };
}

function getInclusiveRangeDays(start: DateValue, end: DateValue) {
  const startTime = startOfDayTimestamp(start);
  const endTime = startOfDayTimestamp(end);

  return Math.floor((endTime - startTime) / 86400000) + 1;
}

function dayPartOf(date: DateValue) {
  return date instanceof Date ? date : date.date;
}

function startOfDayTimestamp(date: DateValue) {
  const value = dayPartOf(date);

  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

/**
 * Whether a candidate range is invalid. Computed against the range itself, so
 * it can be used both for the derived `isInvalid` state and to validate a
 * candidate range before committing it in `onDateChange`.
 */
function isRangeInvalid(
  start: DateValue,
  end: DateValue,
  options: Pick<UseCalendarRangeStateProps, 'isDateDisabled' | 'isDateUnavailable' | 'isDateHighlightable'> & {
    allowNonContiguousRanges: boolean;
    maximumDays: number | undefined;
  }
) {
  if (options.isDateDisabled(dayPartOf(start)) || options.isDateUnavailable(dayPartOf(start))) {
    return true;
  }

  if (options.isDateDisabled(dayPartOf(end)) || options.isDateUnavailable(dayPartOf(end))) {
    return true;
  }

  if (isBefore(end, start)) {
    return true;
  }

  if (options.maximumDays && getInclusiveRangeDays(start, end) > options.maximumDays) {
    return true;
  }

  if (options.allowNonContiguousRanges) {
    return false;
  }

  return !areAllDaysBetweenValid(
    start,
    end,
    options.isDateUnavailable,
    options.isDateDisabled,
    options.isDateHighlightable
  );
}

export function useCalendarRangeState(props: UseCalendarRangeStateProps) {
  const highlightedRange = computed<DateRange | null>(() => {
    if (!props.start.value || props.end.value || !props.hoveredDate.value) {
      return null;
    }

    return sortRange(props.start.value, props.hoveredDate.value);
  });

  const isDateSelected = (date: DateValue) => {
    if (!props.start.value) {
      return false;
    }

    if (!props.end.value) {
      return isSameDateValue(props.start.value, date);
    }

    return isBetweenInclusive(date, props.start.value, props.end.value);
  };

  /**
   * Whether `date` belongs to the committed range band: both ends are chosen and the
   * range spans more than one day. A lone start (the range is still being picked) is
   * `selected` but not `inRange`, so the styled band only renders once the range is
   * complete; a same-day range draws no band at all, since the end chips already
   * cover it.
   */
  const isDateInRange = (date: DateValue) => {
    if (!props.start.value || !props.end.value || isSameDateValue(props.start.value, props.end.value)) {
      return false;
    }

    return isBetweenInclusive(date, props.start.value, props.end.value);
  };

  const isSelectionStart = (date: DateValue) => Boolean(props.start.value && isSameDateValue(props.start.value, date));
  const isSelectionEnd = (date: DateValue) => Boolean(props.end.value && isSameDateValue(props.end.value, date));
  const isHighlightedStart = (date: DateValue) =>
    Boolean(highlightedRange.value?.start && isSameDateValue(highlightedRange.value.start, date));
  const isHighlightedEnd = (date: DateValue) =>
    Boolean(highlightedRange.value?.end && isSameDateValue(highlightedRange.value.end, date));

  const hasSelectedDate = computed(() => Boolean(props.start.value));
  const selectedFocusableDate = computed(() => (props.start.value ? cloneDateValue(props.start.value) : undefined));
  const isSelectedDateDisabled = computed(() => {
    return Boolean(
      (props.start.value && props.isDateDisabled(dayPartOf(props.start.value))) ||
      (props.end.value && props.isDateDisabled(dayPartOf(props.end.value)))
    );
  });

  const isInvalid = computed(() => {
    if (!props.start.value || !props.end.value) {
      return false;
    }

    return isRangeInvalid(props.start.value, props.end.value, {
      isDateDisabled: props.isDateDisabled,
      isDateUnavailable: props.isDateUnavailable,
      isDateHighlightable: props.isDateHighlightable,
      allowNonContiguousRanges: props.allowNonContiguousRanges.value,
      maximumDays: props.maximumDays.value
    });
  });

  return {
    highlightedRange,
    isDateSelected,
    isDateInRange,
    isSelectionStart,
    isSelectionEnd,
    isHighlightedStart,
    isHighlightedEnd,
    hasSelectedDate,
    isSelectedDateDisabled,
    selectedFocusableDate,
    isInvalid,
    sortRange,
    getInclusiveRangeDays,
    isRangeInvalid
  };
}

function isSameDateValue(a: DateValue, b: DateValue) {
  const aDay = a instanceof Date ? a : a.date;
  const bDay = b instanceof Date ? b : b.date;

  return (
    aDay.getFullYear() === bDay.getFullYear() &&
    aDay.getMonth() === bDay.getMonth() &&
    aDay.getDate() === bDay.getDate()
  );
}
