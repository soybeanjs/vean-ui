import { ref } from 'vue';
import { toDate } from './comparators';
import type { DateValue } from './types';
import { hasTime } from './value';

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
  calendar?: string;
}

export interface Formatter {
  getLocale: () => string;
  setLocale: (newLocale: string) => void;
  custom: (date: Date, options: DateFormatterOptions) => string;
  selectedDate: (date: DateValue, includeTime?: boolean) => string;
  dayOfWeek: (date: Date, length?: DateFormatterOptions['weekday']) => string;
  fullMonthAndYear: (date: Date, options?: DateFormatterOptions) => string;
  fullMonth: (date: Date, options?: DateFormatterOptions) => string;
  fullYear: (date: Date, options?: DateFormatterOptions) => string;
  dayPeriod: (date: Date) => string;
  part: (date: Date, type: Intl.DateTimeFormatPartTypes, options?: DateFormatterOptions) => string;
  toParts: (date: Date, options?: DateFormatterOptions) => Intl.DateTimeFormatPart[];
  getMonths: () => { label: string; value: number }[];
}

function isPmPart(value: string | undefined): boolean {
  return value === 'PM' || value === 'pm' || value === 'p.m.';
}

export function useDateFormatter(initialLocale: string, opts: DateFormatterOptions = {}): Formatter {
  const locale = ref(initialLocale);

  function getLocale() {
    return locale.value;
  }

  function setLocale(newLocale: string) {
    locale.value = newLocale;
  }

  function custom(date: Date, options: DateFormatterOptions) {
    return new Intl.DateTimeFormat(locale.value, { ...opts, ...options }).format(date);
  }

  function selectedDate(date: DateValue, includeTime = true) {
    const showTime = hasTime(date) && includeTime;

    return custom(toDate(date), {
      dateStyle: 'long',
      ...(showTime ? { timeStyle: 'long' as const } : {})
    });
  }

  function fullMonthAndYear(date: Date, options: DateFormatterOptions = {}) {
    return new Intl.DateTimeFormat(locale.value, {
      ...opts,
      month: 'long',
      year: 'numeric',
      ...options
    }).format(date);
  }

  function fullMonth(date: Date, options: DateFormatterOptions = {}) {
    return new Intl.DateTimeFormat(locale.value, { ...opts, month: 'long', ...options }).format(date);
  }

  function getMonths() {
    const referenceYear = new Date().getFullYear();
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return months.map(item => ({
      label: fullMonth(new Date(referenceYear, item - 1, 1)),
      value: item
    }));
  }

  function fullYear(date: Date, options: DateFormatterOptions = {}) {
    return new Intl.DateTimeFormat(locale.value, { ...opts, year: 'numeric', ...options }).format(date);
  }

  function toParts(date: Date, options?: DateFormatterOptions) {
    return new Intl.DateTimeFormat(locale.value, { ...opts, ...options }).formatToParts(date);
  }

  function dayOfWeek(date: Date, length: DateFormatterOptions['weekday'] = 'narrow') {
    return new Intl.DateTimeFormat(locale.value, { ...opts, weekday: length }).format(date);
  }

  function dayPeriod(date: Date) {
    const parts = new Intl.DateTimeFormat(locale.value, {
      ...opts,
      hour: 'numeric',
      minute: 'numeric'
    }).formatToParts(date);
    const value = parts.find(item => item.type === 'dayPeriod')?.value;

    return isPmPart(value) ? 'PM' : 'AM';
  }

  const defaultPartOptions: DateFormatterOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  function part(date: Date, type: Intl.DateTimeFormatPartTypes, options: DateFormatterOptions = {}) {
    const parts = toParts(date, { ...defaultPartOptions, ...options });
    const segment = parts.find(item => item.type === type);

    return segment?.value ?? '';
  }

  return {
    setLocale,
    getLocale,
    fullMonth,
    fullYear,
    fullMonthAndYear,
    toParts,
    custom,
    part,
    dayPeriod,
    selectedDate,
    dayOfWeek,
    getMonths
  };
}
