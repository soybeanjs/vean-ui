import { addDays } from 'date-fns/addDays';
import { addMonths } from 'date-fns/addMonths';
import { endOfWeek } from 'date-fns/endOfWeek';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { getWeek as getLocaleWeek } from 'date-fns/getWeek';
import { setDate } from 'date-fns/setDate';
import { startOfWeek } from 'date-fns/startOfWeek';
import { startOfYear } from 'date-fns/startOfYear';
import { chunk } from '../shared';
import { setSegmentParts } from './operations';
import type { DateGrid, DateRange, DayOfWeek, WeekStartsOn } from './types';
import { getDatePart } from './value';

export const DEFAULT_DATE_LOCALE = 'en-US';

export interface CreateSelectOptions {
  dateObj: Date;
}

export function getDaysBetween(start: Date, end: Date) {
  const days: Date[] = [];
  let current = addDays(start, 1);

  while (current.getTime() < end.getTime()) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

export interface CreateMonthOptions {
  dateObj: Date;
  weekStartsOn: WeekStartsOn;
  fixedWeeks: boolean;
  locale: string;
}

export function createMonth(options: CreateMonthOptions): DateGrid<Date> {
  const { dateObj, weekStartsOn, fixedWeeks } = options;
  const daysInMonth = getDaysInMonth(dateObj);
  const datesArray = Array.from({ length: daysInMonth }, (_, index) => setDate(dateObj, index + 1));
  const firstDayOfMonth = setDate(dateObj, 1);
  const lastDayOfMonth = setDate(dateObj, daysInMonth);
  const lastWeekStart = startOfWeek(firstDayOfMonth, { weekStartsOn });
  const nextWeekEnd = endOfWeek(lastDayOfMonth, { weekStartsOn });
  const lastMonthDays = getDaysBetween(lastWeekStart, firstDayOfMonth);
  const nextMonthDays = getDaysBetween(lastDayOfMonth, nextWeekEnd);
  const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length;

  if (fixedWeeks && totalDays < 42) {
    const extraDays = 42 - totalDays;
    const startFrom = nextMonthDays.at(-1) ?? lastDayOfMonth;
    const extraDaysArray = Array.from({ length: extraDays }, (_, index) => addDays(startFrom, index + 1));

    nextMonthDays.push(...extraDaysArray);
  }

  const allDays = lastMonthDays.concat(datesArray, nextMonthDays);

  return {
    value: dateObj,
    cells: allDays,
    rows: chunk(allDays, 7)
  };
}

export function startOfDecade(dateObj: Date) {
  const startYear = Math.floor(dateObj.getFullYear() / 10) * 10;

  return startOfYear(setSegmentParts(dateObj, { year: startYear, month: 1, day: 1 }));
}

export function endOfDecade(dateObj: Date) {
  return setSegmentParts(startOfDecade(dateObj), {
    year: startOfDecade(dateObj).getFullYear() + 9,
    month: 12,
    day: 31
  });
}

interface CreateDecadeOptions extends CreateSelectOptions {
  startIndex?: number;
  endIndex: number;
}

export function createDecade(props: CreateDecadeOptions): Date[] {
  const { dateObj, startIndex = 0, endIndex } = props;
  const decadeLength = endIndex - startIndex + 1;

  if (decadeLength <= 0) {
    return [];
  }

  return Array.from({ length: decadeLength }, (_, index) =>
    setSegmentParts(dateObj, {
      year: dateObj.getFullYear() + startIndex + index,
      month: 1,
      day: 1
    })
  );
}

interface CreateYearOptions extends CreateSelectOptions {
  numberOfMonths?: number;
  pagedNavigation?: boolean;
}

export function createYear(props: CreateYearOptions): Date[] {
  const { dateObj, numberOfMonths = 1, pagedNavigation = false } = props;

  if (numberOfMonths && pagedNavigation) {
    const months: Date[] = [];

    for (let month = 1; month <= 12; month += numberOfMonths) {
      months.push(setSegmentParts(dateObj, { month, day: 1 }));
    }

    return months;
  }

  return Array.from({ length: 12 }, (_, index) => setSegmentParts(dateObj, { month: index + 1, day: 1 }));
}

interface CreateMonthsOptions extends CreateMonthOptions {
  numberOfMonths: number | undefined;
  currentMonths?: DateGrid<Date>[];
}

export function createMonths(options: CreateMonthsOptions) {
  const { numberOfMonths, dateObj, ...monthProps } = options;

  if (!numberOfMonths || numberOfMonths === 1) {
    return [
      createMonth({
        ...monthProps,
        dateObj
      })
    ];
  }

  const months = [
    createMonth({
      ...monthProps,
      dateObj
    })
  ];

  for (let index = 1; index < numberOfMonths; index += 1) {
    months.push(
      createMonth({
        ...monthProps,
        dateObj: addMonths(dateObj, index)
      })
    );
  }

  return months;
}

export function createMonthGrid(options: CreateSelectOptions): DateGrid<Date> {
  const { dateObj } = options;
  const months = createYear({ dateObj });

  return {
    value: dateObj,
    cells: months,
    rows: chunk(months, 4)
  };
}

export interface CreateYearGridOptions extends CreateSelectOptions {
  yearsPerPage?: number;
  decadeAligned?: boolean;
}

export function createYearGrid(options: CreateYearGridOptions): DateGrid<Date> {
  const { dateObj, yearsPerPage = 12, decadeAligned = true } = options;
  const startYear = decadeAligned ? startOfDecade(dateObj).getFullYear() : dateObj.getFullYear();
  const years = Array.from({ length: yearsPerPage }, (_, index) =>
    setSegmentParts(dateObj, { year: startYear + index, month: 1, day: 1 })
  );

  return {
    value: years[0],
    cells: years,
    rows: chunk(years, 4)
  };
}

export function createYearRange({ start, end }: DateRange): Date[] {
  const years: Date[] = [];

  if (!start || !end) {
    return years;
  }

  const endDay = getDatePart(end);
  let current = startOfYear(getDatePart(start));

  while (current.getTime() <= endDay.getTime()) {
    years.push(current);
    current = startOfYear(setSegmentParts(current, { year: current.getFullYear() + 1 }));
  }

  return years;
}

export function createDateRange({ start, end }: DateRange): Date[] {
  const dates: Date[] = [];

  if (!start || !end) {
    return dates;
  }

  const startDay = getDatePart(start);
  const endDay = getDatePart(end);
  let current = startDay;

  while (current.getTime() <= endDay.getTime()) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}

/**
 * Resolves the locale's first day of week as a Sunday-based index (0 = Sunday,
 * 1 = Monday, ...). Falls back to Sunday when the runtime lacks week info.
 */
export function getWeekStartsOn(locale: string): WeekStartsOn {
  try {
    const localeObj = new Intl.Locale(locale);
    const weekInfoHolder = localeObj as Intl.Locale & {
      weekInfo?: { firstDay?: number };
      getWeekInfo?: () => { firstDay?: number };
    };
    const firstDay = weekInfoHolder.weekInfo?.firstDay ?? weekInfoHolder.getWeekInfo?.().firstDay;

    if (firstDay) {
      return (firstDay % 7) as WeekStartsOn;
    }
  } catch {
    // Invalid locale tags fall back to the Sunday-based default.
  }

  return 0;
}

export function getWeekNumber(date: Date, locale: string = DEFAULT_DATE_LOCALE, firstDayOfWeek?: DayOfWeek): number {
  const weekStartsOn = firstDayOfWeek ? mapDayOfWeekToNumber(firstDayOfWeek) : getWeekStartsOn(locale);
  // ISO week rules (first week contains at least 4 days) apply to Monday-based weeks.
  const firstWeekContainsDate = weekStartsOn === 1 ? 4 : 1;

  return getLocaleWeek(date, { weekStartsOn, firstWeekContainsDate });
}

function mapDayOfWeekToNumber(day: DayOfWeek): WeekStartsOn {
  return (['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const).indexOf(day) as WeekStartsOn;
}
