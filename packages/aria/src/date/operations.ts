import { getDate } from 'date-fns/getDate';
import { getDaysInMonth } from 'date-fns/getDaysInMonth';
import { setDate } from 'date-fns/setDate';
import { setHours } from 'date-fns/setHours';
import { setMilliseconds } from 'date-fns/setMilliseconds';
import { setMinutes } from 'date-fns/setMinutes';
import { setSeconds } from 'date-fns/setSeconds';
import type { DateStep, DateValue } from './types';
import { mergeDateValue } from './value';

export type NumericSegmentPart = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

export interface DateParts {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

/**
 * Sets one or more calendar parts on a local date. Months are 1-based. The
 * day-of-month is clamped to the target month length to keep `set({ month })`
 * from rolling over into the next month (Jan 31 + month=2 stays Feb 28/29).
 */
export function setSegmentParts(date: DateValue, parts: DateParts): Date {
  const next = mergeDateValue(date);

  if (parts.year !== undefined) {
    next.setFullYear(parts.year);
  }

  if (parts.month !== undefined) {
    const targetMonth = parts.month - 1;
    const daysInTargetMonth = getDaysInMonth(new Date(next.getFullYear(), targetMonth, 1));

    if (next.getDate() > daysInTargetMonth) {
      next.setDate(daysInTargetMonth);
    }

    next.setMonth(targetMonth);
  }

  if (parts.day !== undefined) {
    const daysInCurrentMonth = getDaysInMonth(new Date(next.getFullYear(), next.getMonth(), 1));

    next.setDate(Math.min(parts.day, daysInCurrentMonth));
  }

  if (parts.hour !== undefined) {
    next.setHours(parts.hour);
  }

  if (parts.minute !== undefined) {
    next.setMinutes(parts.minute);
  }

  if (parts.second !== undefined) {
    next.setSeconds(parts.second);
  }

  if (parts.millisecond !== undefined) {
    next.setMilliseconds(parts.millisecond);
  }

  return next;
}

/**
 * Cycles a single segment by `amount`, wrapping within the segment's natural
 * range: day within the current month length, month 1-12, year 1-9999, and
 * hour/minute/second/millisecond within their fixed ranges.
 */
export function cycleSegment(date: Date, part: NumericSegmentPart, amount: number): Date {
  switch (part) {
    case 'day': {
      const daysInMonth = getDaysInMonth(date);
      const day = ((((getDate(date) - 1 + amount) % daysInMonth) + daysInMonth) % daysInMonth) + 1;

      return setDate(date, day);
    }
    case 'month': {
      const month = (((date.getMonth() + amount) % 12) + 12) % 12;

      return setSegmentParts(date, { month: month + 1 });
    }
    case 'year': {
      const year = ((((date.getFullYear() - 1 + amount) % 9999) + 9999) % 9999) + 1;

      return setSegmentParts(date, { year });
    }
    case 'hour': {
      const hour = (((date.getHours() + amount) % 24) + 24) % 24;

      return setHours(date, hour);
    }
    case 'minute': {
      const minute = (((date.getMinutes() + amount) % 60) + 60) % 60;

      return setMinutes(date, minute);
    }
    case 'second': {
      const second = (((date.getSeconds() + amount) % 60) + 60) % 60;

      return setSeconds(date, second);
    }
    case 'millisecond': {
      const millisecond = (((date.getMilliseconds() + amount) % 1000) + 1000) % 1000;

      return setMilliseconds(date, millisecond);
    }
  }
}

export function getSegmentNumber(date: Date, part: NumericSegmentPart): number {
  switch (part) {
    case 'year':
      return date.getFullYear();
    case 'month':
      return date.getMonth() + 1;
    case 'day':
      return date.getDate();
    case 'hour':
      return date.getHours();
    case 'minute':
      return date.getMinutes();
    case 'second':
      return date.getSeconds();
    case 'millisecond':
      return date.getMilliseconds();
  }
}

export function normalizeDateStep(step?: DateStep): DateStep {
  return {
    year: step?.year ?? 1,
    month: step?.month ?? 1,
    day: step?.day ?? 1,
    hour: step?.hour ?? 1,
    minute: step?.minute ?? 1,
    second: step?.second ?? 1,
    millisecond: step?.millisecond ?? 1
  };
}
