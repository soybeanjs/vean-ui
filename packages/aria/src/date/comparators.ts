import { addDays } from 'date-fns/addDays';
import { getDaysInMonth as getDaysInMonthFns } from 'date-fns/getDaysInMonth';
import { getMonth as getMonthOf } from 'date-fns/getMonth';
import { getYear as getYearOf } from 'date-fns/getYear';
import { isSameDay as isSameDayFns } from 'date-fns/isSameDay';
import { isSameMonth as isSameMonthFns } from 'date-fns/isSameMonth';
import { isSameYear as isSameYearFns } from 'date-fns/isSameYear';
import { parseISO } from 'date-fns/parseISO';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfToday } from 'date-fns/startOfToday';
import { setSegmentParts } from './operations';
import type { DateMatcher, DateValue, Granularity, TimeValue } from './types';
import {
  cloneDate,
  cloneDateValue,
  getDatePart,
  isDateTimeValue,
  makeDateValue,
  mergeDateValue,
  createTime
} from './value';

const TIME_DESIGNATOR_PATTERN = /T\d{2}|\s\d{2}:\d{2}/;

export function isSameDay(a: DateValue, b: DateValue): boolean {
  return isSameDayFns(getDatePart(a), getDatePart(b));
}

export function isSameMonth(a: DateValue, b: DateValue): boolean {
  return isSameMonthFns(getDatePart(a), getDatePart(b));
}

export function isSameYear(a: DateValue, b: DateValue): boolean {
  return isSameYearFns(getDatePart(a), getDatePart(b));
}

export function isEqualDay(a: DateValue, b: DateValue): boolean {
  return isSameDayFns(getDatePart(a), getDatePart(b));
}

export function isEqualMonth(a: DateValue, b: DateValue): boolean {
  return isSameMonthFns(getDatePart(a), getDatePart(b));
}

export function isToday(date: DateValue): boolean {
  return isSameDayFns(getDatePart(date), startOfToday());
}

export function getDaysInMonth(date: DateValue): number {
  return getDaysInMonthFns(getDatePart(date));
}

/**
 * Converts a date value into a single local `Date` instant, merging the
 * time-of-day part when present.
 */
export function toDate(value: DateValue): Date {
  return mergeDateValue(value);
}

export function isBefore(a: DateValue, b: DateValue): boolean {
  return toDate(a).getTime() < toDate(b).getTime();
}

export function isAfter(a: DateValue, b: DateValue): boolean {
  return toDate(a).getTime() > toDate(b).getTime();
}

export function isBeforeOrSame(a: DateValue, b: DateValue): boolean {
  return toDate(a).getTime() <= toDate(b).getTime();
}

export function isAfterOrSame(a: DateValue, b: DateValue): boolean {
  return toDate(a).getTime() >= toDate(b).getTime();
}

export function isEqualValue(a: DateValue, b: DateValue): boolean {
  return toDate(a).getTime() === toDate(b).getTime();
}

export function isBetweenInclusive(date: DateValue, start: DateValue, end: DateValue): boolean {
  return isAfterOrSame(date, start) && isBeforeOrSame(date, end);
}

export function isBetween(date: DateValue, start: DateValue, end: DateValue): boolean {
  return isAfter(date, start) && isBefore(date, end);
}

/**
 * Parses an ISO-like date string into a date value matching the reference
 * value's shape: a `{ date, time }` reference keeps the parsed time-of-day
 * (or the reference's own time when the string is date-only), while a plain
 * `Date` reference yields a local-midnight `Date`.
 */
export function parseStringToDateValue(dateStr: string, referenceValue: DateValue): DateValue {
  const parsed = parseISO(dateStr);
  const instant = Number.isNaN(parsed.getTime()) ? new Date(dateStr) : parsed;

  if (Number.isNaN(instant.getTime())) {
    return cloneDateValue(referenceValue);
  }

  if (isDateTimeValue(referenceValue)) {
    if (TIME_DESIGNATOR_PATTERN.test(dateStr)) {
      return makeDateValue(instant, instant);
    }

    return makeDateValue(instant, referenceValue.time);
  }

  return startOfDay(instant);
}

export function getDefaultDate(props: {
  defaultValue?: DateValue | DateValue[] | undefined;
  defaultPlaceholder?: DateValue | undefined;
  granularity?: Granularity | undefined;
  locale?: string | undefined;
}): DateValue {
  const { defaultValue, defaultPlaceholder, granularity = 'day' } = props;
  const timeGranularities: readonly string[] = ['hour', 'minute', 'second'];

  if (Array.isArray(defaultValue) && defaultValue.length) {
    return cloneDateValue(defaultValue.at(-1)!);
  }

  if (defaultValue && !Array.isArray(defaultValue)) {
    return cloneDateValue(defaultValue);
  }

  if (defaultPlaceholder) {
    return cloneDateValue(defaultPlaceholder);
  }

  const now = new Date();
  const today = startOfDay(now);

  if (timeGranularities.includes(granularity)) {
    return makeDateValue(today, createTime(0));
  }

  return today;
}

export function getDefaultTime(props: { defaultValue?: TimeValue; defaultPlaceholder?: TimeValue }): TimeValue {
  if (props.defaultValue) {
    return cloneDate(props.defaultValue);
  }

  if (props.defaultPlaceholder) {
    return cloneDate(props.defaultPlaceholder);
  }

  return createTime(0);
}

export function getLastFirstDayOfWeek(date: Date, firstDayOfWeek: number): Date {
  const day = date.getDay();

  if (firstDayOfWeek > day) {
    return setSegmentParts(date, { day: date.getDate() - (day + 7 - firstDayOfWeek) });
  }

  if (firstDayOfWeek === day) {
    return date;
  }

  return setSegmentParts(date, { day: date.getDate() - (day - firstDayOfWeek) });
}

export function getNextLastDayOfWeek(date: Date, firstDayOfWeek: number): Date {
  const day = date.getDay();
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  if (day === lastDayOfWeek) {
    return date;
  }

  if (day > lastDayOfWeek) {
    return setSegmentParts(date, { day: date.getDate() + (7 - day + lastDayOfWeek) });
  }

  return setSegmentParts(date, { day: date.getDate() + (lastDayOfWeek - day) });
}

export function isSameYearMonth(a: DateValue, b: DateValue): boolean {
  return (
    getYearOf(getDatePart(a)) === getYearOf(getDatePart(b)) && getMonthOf(getDatePart(a)) === getMonthOf(getDatePart(b))
  );
}

export function areAllDaysBetweenValid(
  start: DateValue,
  end: DateValue,
  isUnavailable: DateMatcher | undefined,
  isDisabled: DateMatcher | undefined,
  isHighlightable?: DateMatcher | undefined
): boolean {
  if (isUnavailable === undefined && isDisabled === undefined && isHighlightable === undefined) {
    return true;
  }

  const endDay = startOfDay(getDatePart(end));
  let current = addDays(getDatePart(start), 1);
  const isInvalidDay = (date: Date) => (isDisabled?.(date) || isUnavailable?.(date)) && !isHighlightable?.(date);

  while (current.getTime() < endDay.getTime()) {
    if (isInvalidDay(current)) {
      return false;
    }

    current = addDays(current, 1);
  }

  return true;
}

export function compareYearMonth(a: DateValue, b: DateValue): number {
  const yearDiff = getYearOf(getDatePart(a)) - getYearOf(getDatePart(b));

  if (yearDiff !== 0) {
    return yearDiff;
  }

  return getMonthOf(getDatePart(a)) - getMonthOf(getDatePart(b));
}

export function isMonthBetweenInclusive(date: DateValue, start: DateValue, end: DateValue): boolean {
  return compareYearMonth(date, start) >= 0 && compareYearMonth(date, end) <= 0;
}

export function isYearBetweenInclusive(date: DateValue, start: DateValue, end: DateValue): boolean {
  return (
    getYearOf(getDatePart(date)) >= getYearOf(getDatePart(start)) &&
    getYearOf(getDatePart(date)) <= getYearOf(getDatePart(end))
  );
}

export function getMonthsBetween(start: DateValue, end: DateValue): number {
  return (
    (getYearOf(getDatePart(end)) - getYearOf(getDatePart(start))) * 12 +
    (getMonthOf(getDatePart(end)) - getMonthOf(getDatePart(start))) +
    1
  );
}
