import { computed, shallowRef, watch } from 'vue';
import type { ShallowRef } from 'vue';
import { addMonths } from 'date-fns/addMonths';
import {
  createMonths,
  getDaysInMonth,
  isAfter,
  isBefore,
  isSameMonth,
  setSegmentParts,
  toDate,
  useDateFormatter
} from '../../date';
import type { DateMatcher, DateGrid, DateValue, WeekDayFormat, WeekStartsOn } from '../../date';

const DAY_MS = 24 * 60 * 60 * 1000;

function isSameDayValue(a: DateValue, b: DateValue) {
  const aDay = toDate(a);
  const bDay = toDate(b);

  return (
    aDay.getFullYear() === bDay.getFullYear() &&
    aDay.getMonth() === bDay.getMonth() &&
    aDay.getDate() === bDay.getDate()
  );
}

export interface UseCalendarOptions {
  locale: ShallowRef<string>;
  placeholder: ShallowRef<DateValue>;
  weekStartsOn: ShallowRef<WeekStartsOn>;
  fixedWeeks: ShallowRef<boolean>;
  numberOfMonths: ShallowRef<number>;
  minValue: ShallowRef<DateValue | undefined>;
  maxValue: ShallowRef<DateValue | undefined>;
  disabled: ShallowRef<boolean>;
  weekdayFormat: ShallowRef<WeekDayFormat>;
  pagedNavigation: ShallowRef<boolean>;
  isDateDisabled?: DateMatcher;
  isDateUnavailable?: DateMatcher;
  calendarLabel: ShallowRef<string | undefined>;
  nextPage: ShallowRef<((placeholder: DateValue) => DateValue) | undefined>;
  prevPage: ShallowRef<((placeholder: DateValue) => DateValue) | undefined>;
}

export interface UseCalendarStateOptions {
  isDateDisabled: DateMatcher;
  isDateUnavailable: DateMatcher;
  date: ShallowRef<DateValue | DateValue[] | undefined>;
}

export function useCalendarState(options: UseCalendarStateOptions) {
  const { date, isDateDisabled, isDateUnavailable } = options;

  function isDateSelected(dateObj: DateValue) {
    if (Array.isArray(date.value)) {
      return date.value.some(item => isSameDayValue(item, dateObj));
    }

    if (!date.value) {
      return false;
    }

    return isSameDayValue(date.value, dateObj);
  }

  const isInvalid = computed(() => {
    if (Array.isArray(date.value)) {
      if (!date.value.length) {
        return false;
      }

      return date.value.some(dateObj => isDateDisabled?.(toDate(dateObj)) || isDateUnavailable?.(toDate(dateObj)));
    }

    if (!date.value) {
      return false;
    }

    return Boolean(isDateDisabled?.(toDate(date.value)) || isDateUnavailable?.(toDate(date.value)));
  });

  const hasSelectedDate = computed(() => {
    return Array.isArray(date.value) ? date.value.length > 0 : Boolean(date.value);
  });

  const isSelectedDateDisabled = computed(() => {
    if (Array.isArray(date.value)) {
      if (!date.value.length) {
        return false;
      }

      return date.value.some(dateObj => isDateDisabled?.(toDate(dateObj)));
    }

    if (!date.value) {
      return false;
    }

    return Boolean(isDateDisabled?.(toDate(date.value)));
  });

  return {
    isDateSelected,
    isInvalid,
    hasSelectedDate,
    isSelectedDateDisabled
  };
}

function dayDiff(later: Date, earlier: Date) {
  return Math.round((startOfDayOf(later).getTime() - startOfDayOf(earlier).getTime()) / DAY_MS);
}

function startOfDayOf(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function handleNextDisabled(lastPeriodInView: Date, nextPageFunc: (date: DateValue) => DateValue): Date {
  const firstPeriodOfNextPage = toDate(nextPageFunc(lastPeriodInView));
  const diff = dayDiff(firstPeriodOfNextPage, lastPeriodInView);
  const parts: { day?: number; month?: number } = {};

  if (diff >= 7) {
    parts.day = 1;
  }
  if (diff >= getDaysInMonth(lastPeriodInView)) {
    parts.month = 1;
  }

  return setSegmentParts(firstPeriodOfNextPage, parts);
}

function handlePrevDisabled(firstPeriodInView: Date, prevPageFunc: (date: DateValue) => DateValue): Date {
  const lastPeriodOfPrevPage = toDate(prevPageFunc(firstPeriodInView));
  const diff = dayDiff(firstPeriodInView, lastPeriodOfPrevPage);
  const parts: { day?: number; month?: number } = {};

  if (diff >= 7) {
    parts.day = 35;
  }
  if (diff >= getDaysInMonth(firstPeriodInView)) {
    parts.month = 13;
  }

  return setSegmentParts(lastPeriodOfPrevPage, parts);
}

export function useCalendar(options: UseCalendarOptions) {
  const {
    locale,
    placeholder,
    weekStartsOn,
    fixedWeeks,
    numberOfMonths,
    minValue,
    maxValue,
    disabled,
    weekdayFormat,
    pagedNavigation,
    nextPage,
    prevPage,
    calendarLabel
  } = options;

  const formatter = useDateFormatter(locale.value);

  const grid = shallowRef<DateGrid<Date>[]>(
    createMonths({
      dateObj: toDate(placeholder.value),
      weekStartsOn: weekStartsOn.value,
      locale: locale.value,
      fixedWeeks: fixedWeeks.value,
      numberOfMonths: numberOfMonths.value
    })
  );

  const visibleView = computed(() => grid.value.map(month => month.value));

  function isOutsideVisibleView(date: DateValue) {
    return !visibleView.value.some(month => isSameMonth(toDate(date), month));
  }

  const isNextButtonDisabled = (nextPageFunc?: (date: DateValue) => DateValue) => {
    if (!maxValue.value || !grid.value.length) {
      return false;
    }
    if (disabled.value) {
      return true;
    }

    const lastPeriodInView = grid.value.at(-1)!.value;

    if (!nextPageFunc && !nextPage.value) {
      const firstPeriodOfNextPage = setSegmentParts(addMonths(lastPeriodInView, 1), { day: 1 });
      return isAfter(firstPeriodOfNextPage, maxValue.value);
    }

    const firstPeriodOfNextPage = handleNextDisabled(lastPeriodInView, nextPageFunc || nextPage.value!);
    return isAfter(firstPeriodOfNextPage, maxValue.value);
  };

  const isPrevButtonDisabled = (prevPageFunc?: (date: DateValue) => DateValue) => {
    if (!minValue.value || !grid.value.length) {
      return false;
    }
    if (disabled.value) {
      return true;
    }

    const firstPeriodInView = grid.value[0].value;

    if (!prevPageFunc && !prevPage.value) {
      const lastPeriodOfPrevPage = setSegmentParts(addMonths(firstPeriodInView, -1), { day: 35 });
      return isBefore(lastPeriodOfPrevPage, minValue.value);
    }

    const lastPeriodOfPrevPage = handlePrevDisabled(firstPeriodInView, prevPageFunc || prevPage.value!);
    return isBefore(lastPeriodOfPrevPage, minValue.value);
  };

  function isDateDisabled(dateObj: DateValue) {
    if (options.isDateDisabled?.(toDate(dateObj)) || disabled.value) {
      return true;
    }
    if (maxValue.value && isAfter(dateObj, maxValue.value)) {
      return true;
    }
    if (minValue.value && isBefore(dateObj, minValue.value)) {
      return true;
    }

    return false;
  }

  const isDateUnavailable = (date: DateValue) => Boolean(options.isDateUnavailable?.(toDate(date)));

  const weekdays = computed(() => {
    if (!grid.value.length) {
      return [];
    }

    return grid.value[0].rows[0].map(date => formatter.dayOfWeek(date, weekdayFormat.value));
  });

  const handleNextPage = (nextPageFunc?: (date: DateValue) => DateValue) => {
    const firstDate = grid.value[0].value;

    if (!nextPageFunc && !nextPage.value) {
      const newDate = addMonths(firstDate, pagedNavigation.value ? numberOfMonths.value : 1);
      const newGrid = createMonths({
        dateObj: newDate,
        weekStartsOn: weekStartsOn.value,
        locale: locale.value,
        fixedWeeks: fixedWeeks.value,
        numberOfMonths: numberOfMonths.value
      });

      grid.value = newGrid;
      placeholder.value = setSegmentParts(newGrid[0].value, { day: 1 });
      return;
    }

    const newDate = toDate((nextPageFunc || nextPage.value!)(firstDate));
    const newGrid = createMonths({
      dateObj: newDate,
      weekStartsOn: weekStartsOn.value,
      locale: locale.value,
      fixedWeeks: fixedWeeks.value,
      numberOfMonths: numberOfMonths.value
    });

    grid.value = newGrid;

    const parts: { day?: number; month?: number } = {};

    if (!nextPageFunc) {
      const diff = dayDiff(newGrid[0].value, firstDate);
      if (diff >= getDaysInMonth(firstDate)) {
        parts.day = 1;
      }
      if (diff >= 365) {
        parts.month = 1;
      }
    }

    placeholder.value = setSegmentParts(newGrid[0].value, parts);
  };

  const handlePrevPage = (prevPageFunc?: (date: DateValue) => DateValue) => {
    const firstDate = grid.value[0].value;

    if (!prevPageFunc && !prevPage.value) {
      const newDate = addMonths(firstDate, -(pagedNavigation.value ? numberOfMonths.value : 1));
      const newGrid = createMonths({
        dateObj: newDate,
        weekStartsOn: weekStartsOn.value,
        locale: locale.value,
        fixedWeeks: fixedWeeks.value,
        numberOfMonths: numberOfMonths.value
      });

      grid.value = newGrid;
      placeholder.value = setSegmentParts(newGrid[0].value, { day: 1 });
      return;
    }

    const newDate = toDate((prevPageFunc || prevPage.value!)(firstDate));
    const newGrid = createMonths({
      dateObj: newDate,
      weekStartsOn: weekStartsOn.value,
      locale: locale.value,
      fixedWeeks: fixedWeeks.value,
      numberOfMonths: numberOfMonths.value
    });

    grid.value = newGrid;

    const parts: { day?: number; month?: number } = {};

    if (!prevPageFunc) {
      const diff = dayDiff(firstDate, newGrid[0].value);
      if (diff >= getDaysInMonth(firstDate)) {
        parts.day = 1;
      }
      if (diff >= 365) {
        parts.month = 1;
      }
    }

    placeholder.value = setSegmentParts(newGrid[0].value, parts);
  };

  watch(placeholder, value => {
    if (visibleView.value.some(month => isSameMonth(toDate(value), month))) {
      return;
    }

    grid.value = createMonths({
      dateObj: toDate(value),
      weekStartsOn: weekStartsOn.value,
      locale: locale.value,
      fixedWeeks: fixedWeeks.value,
      numberOfMonths: numberOfMonths.value
    });
  });

  watch([locale, weekStartsOn, fixedWeeks, numberOfMonths], () => {
    grid.value = createMonths({
      dateObj: toDate(placeholder.value),
      weekStartsOn: weekStartsOn.value,
      locale: locale.value,
      fixedWeeks: fixedWeeks.value,
      numberOfMonths: numberOfMonths.value
    });
  });

  const headingValue = computed(() => {
    if (!grid.value.length) {
      return '';
    }

    if (locale.value !== formatter.getLocale()) {
      formatter.setLocale(locale.value);
    }

    if (grid.value.length === 1) {
      return formatter.fullMonthAndYear(grid.value[0].value);
    }

    const startMonth = grid.value[0].value;
    const endMonth = grid.value.at(-1)!.value;
    const startMonthName = formatter.fullMonth(startMonth);
    const endMonthName = formatter.fullMonth(endMonth);
    const startMonthYear = formatter.fullYear(startMonth);
    const endMonthYear = formatter.fullYear(endMonth);

    if (startMonthYear === endMonthYear) {
      return `${startMonthName} - ${endMonthName} ${endMonthYear}`;
    }

    return `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;
  });

  const fullCalendarLabel = computed(() => `${calendarLabel.value ?? 'Event Date'}, ${headingValue.value}`);

  const isPlaceholderFocusable = computed(() => {
    return !(
      isDateDisabled(placeholder.value) ||
      isDateUnavailable?.(placeholder.value) ||
      isOutsideVisibleView(placeholder.value)
    );
  });

  const firstFocusableDate = computed(() => {
    for (const month of grid.value) {
      if (minValue.value && isBefore(month.value, minValue.value)) {
        continue;
      }

      const daysInMonth = getDaysInMonth(month.value);
      const minValueDay = minValue.value ? toDate(minValue.value) : undefined;
      const startDay = minValueDay && isSameMonth(minValueDay, month.value) ? minValueDay.getDate() : 1;

      for (let day = startDay; day <= daysInMonth; day += 1) {
        const date = setSegmentParts(month.value, { day });
        if (isDateDisabled(date) || isDateUnavailable(date)) {
          continue;
        }

        return date;
      }
    }

    return undefined;
  });

  return {
    isDateDisabled,
    isDateUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    grid,
    weekdays,
    visibleView,
    isOutsideVisibleView,
    formatter,
    nextPage: handleNextPage,
    prevPage: handlePrevPage,
    headingValue,
    fullCalendarLabel,
    isPlaceholderFocusable,
    firstFocusableDate
  };
}
