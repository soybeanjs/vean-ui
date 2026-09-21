import { getHours } from 'date-fns/getHours';
import { getMilliseconds } from 'date-fns/getMilliseconds';
import { getMinutes } from 'date-fns/getMinutes';
import { getSeconds } from 'date-fns/getSeconds';
import { startOfDay } from 'date-fns/startOfDay';
import type { DateValue, DateTimeValue, TimeValue } from './types';

/**
 * Fixed local epoch used to normalize time-of-day values: 2000-01-01 00:00
 * local time. Only the hour/minute/second/millisecond parts are meaningful.
 */
const TIME_EPOCH_YEAR = 2000;
const TIME_EPOCH_MONTH = 0;
const TIME_EPOCH_DAY = 1;

export function isDateTimeValue(value: DateValue): value is DateTimeValue {
  return typeof value === 'object' && value !== null && 'date' in value && value.date instanceof Date;
}

/** 1-based calendar accessors over a date value. */
export function getYearNumber(date: DateValue): number {
  return getDatePart(date).getFullYear();
}

/** 1-based month (1 = January). */
export function getMonthNumber(date: DateValue): number {
  return getDatePart(date).getMonth() + 1;
}

/** 1-based day of month. */
export function getDayNumber(date: DateValue): number {
  return getDatePart(date).getDate();
}

export function getDatePart(value: DateValue): Date {
  return isDateTimeValue(value) ? value.date : value;
}

export function getTimePart(value: DateValue): Date | undefined {
  return isDateTimeValue(value) ? value.time : undefined;
}

export function hasTime(value: DateValue): boolean {
  return Boolean(getTimePart(value));
}

/**
 * Creates a time-of-day value on the fixed local epoch.
 */
export function createTime(hour: number, minute = 0, second = 0, millisecond = 0): TimeValue {
  return new Date(TIME_EPOCH_YEAR, TIME_EPOCH_MONTH, TIME_EPOCH_DAY, hour, minute, second, millisecond);
}

/**
 * Creates a calendar day value from 1-based month/day numbers (local 00:00).
 */
export function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

/**
 * Strips the date part of a time value onto the fixed local epoch, keeping
 * only hour/minute/second/millisecond.
 */
export function normalizeTimeOfDay(time: Date): TimeValue {
  return createTime(getHours(time), getMinutes(time), getSeconds(time), getMilliseconds(time));
}

/**
 * Composes a public date value from a calendar day and an optional
 * time-of-day. The day is normalized to local 00:00; the time, when present,
 * is normalized to the fixed local epoch.
 */
export function makeDateValue(date: Date, time?: Date | null): DateValue {
  if (!time) {
    return startOfDay(date);
  }

  return { date: startOfDay(date), time: normalizeTimeOfDay(time) };
}

export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

export function cloneDateValue(value: DateValue): DateValue {
  if (!isDateTimeValue(value)) {
    return cloneDate(value);
  }

  return { date: cloneDate(value.date), time: value.time ? cloneDate(value.time) : undefined };
}

/**
 * Merges the time-of-day of a `{ date, time }` value into a single `Date`
 * instant. Plain `Date` values pass through unchanged.
 */
export function mergeDateValue(value: DateValue): Date {
  const date = getDatePart(value);
  const time = getTimePart(value);

  if (!time) {
    return cloneDate(date);
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    getHours(time),
    getMinutes(time),
    getSeconds(time),
    getMilliseconds(time)
  );
}
