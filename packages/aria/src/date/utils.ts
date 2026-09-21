import { getDate } from 'date-fns/getDate';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';
import { getSeconds } from 'date-fns/getSeconds';
import type { Granularity, HourCycle, TimeGranularity, TimeInputType } from './types';

/** Local-time ISO date string (yyyy-MM-dd), used as stable day keys. */
export function toISODateString(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(getDate(date)).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getOptsByGranularity(granularity: Granularity, hourCycle: HourCycle, isTimeValue = false) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: normalizeHourCycle(hourCycle),
    hour12: normalizeHour12(hourCycle)
  };

  if (isTimeValue) {
    delete options.year;
    delete options.month;
    delete options.day;
  }

  if (granularity === 'day') {
    delete options.hour;
    delete options.minute;
    delete options.second;
  }

  if (granularity === 'hour') {
    delete options.minute;
    delete options.second;
  }

  if (granularity === 'minute') {
    delete options.second;
  }

  return options;
}

export function handleCalendarInitialFocus(calendar: HTMLElement) {
  const selectedDay = calendar.querySelector<HTMLElement>('[data-selected]');
  if (selectedDay) {
    selectedDay.focus();
    return;
  }

  const today = calendar.querySelector<HTMLElement>('[data-today]');
  if (today) {
    today.focus();
    return;
  }

  const firstDay = calendar.querySelector<HTMLElement>(
    '[data-vean-calendar-cell-trigger]:not([data-disabled]):not([data-unavailable])'
  );
  firstDay?.focus();
}

export function normalizeHourCycle(hourCycle: HourCycle) {
  if (hourCycle === 24) {
    return 'h23';
  }

  if (hourCycle === 12) {
    return 'h11';
  }

  return undefined;
}

export function normalizeHour12(hourCycle: HourCycle) {
  if (hourCycle === 24) {
    return false;
  }

  if (hourCycle === 12) {
    return true;
  }

  return undefined;
}

export function getInputType(granularity: Granularity) {
  return granularity === 'day' ? 'date' : 'datetime-local';
}

export function normalizeInputValue(date: Date | undefined, granularity: Granularity): string {
  if (!date) {
    return '';
  }

  const type = getInputType(granularity);
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(getDate(date)).padStart(2, '0');

  if (type === 'date') {
    return `${year}-${month}-${day}`;
  }

  const hour = String(getHours(date)).padStart(2, '0');
  const minute = String(getMinutes(date)).padStart(2, '0');

  if (granularity === 'second') {
    const second = String(getSeconds(date)).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function getTimeInputType(_granularity: TimeGranularity): TimeInputType {
  return 'time';
}

export function normalizeTimeInputValue(time: Date | undefined, granularity: TimeGranularity): string {
  if (!time) {
    return '';
  }

  const hour = String(getHours(time)).padStart(2, '0');
  const minute = String(getMinutes(time)).padStart(2, '0');

  if (granularity === 'second') {
    const second = String(getSeconds(time)).padStart(2, '0');
    return `${hour}:${minute}:${second}`;
  }

  return `${hour}:${minute}`;
}
