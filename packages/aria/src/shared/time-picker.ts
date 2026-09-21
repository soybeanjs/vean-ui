import { isEqual } from 'date-fns/isEqual';
import { set } from 'date-fns/set';
import { getOptsByGranularity } from '../date/utils';
import { isAfter, isBefore, isBetweenInclusive } from '../date';
import type { DateStep, Formatter, HourCycle, TimeGranularity, TimeMatcher, TimeValue } from '../date';

export interface TimePickerOption {
  value: TimeValue;
  label: string;
  key: string;
}

export interface FormatTimeValueProps {
  formatter: Formatter;
  granularity: TimeGranularity;
  hourCycle?: HourCycle;
  value: TimeValue;
}

export interface CreateTimeOptionsProps extends Omit<FormatTimeValueProps, 'value'> {
  isTimeUnavailable?: TimeMatcher;
  maxValue?: TimeValue;
  minValue?: TimeValue;
  reference: TimeValue;
  step?: DateStep;
}

export function compareTimeValues(a: TimeValue, b: TimeValue): number {
  if (isBefore(a, b)) {
    return -1;
  }

  if (isAfter(a, b)) {
    return 1;
  }

  return 0;
}

export function isTimeBetweenInclusive(date: TimeValue, start: TimeValue, end: TimeValue): boolean {
  return isBetweenInclusive(date, start, end);
}

export function formatTimeValue(props: FormatTimeValueProps): string {
  return props.formatter
    .toParts(props.value, getOptsByGranularity(props.granularity, props.hourCycle, true))
    .map(part => part.value)
    .join('');
}

export function createTimeOptions(props: CreateTimeOptionsProps): TimePickerOption[] {
  const optionStep = resolveTimeOptionStep(props.granularity, props.step);
  const optionCount = Math.ceil((24 * 60 * 60) / optionStep);

  return Array.from({ length: optionCount }, (_, index) => {
    const totalSeconds = index * optionStep;
    const hour = Math.floor(totalSeconds / 3600) % 24;
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const second = totalSeconds % 60;
    const value = set(props.reference, {
      hours: hour,
      minutes: minute,
      seconds: second,
      milliseconds: 0
    });

    return {
      value,
      label: formatTimeValue({
        formatter: props.formatter,
        granularity: props.granularity,
        hourCycle: props.hourCycle,
        value
      }),
      key: String(value.getTime())
    };
  }).filter(option => {
    if (props.minValue && isBefore(option.value, props.minValue)) {
      return false;
    }

    if (props.maxValue && isAfter(option.value, props.maxValue)) {
      return false;
    }

    if (props.isTimeUnavailable?.(option.value)) {
      return false;
    }

    return true;
  });
}

export function findClosestTimeOption(options: TimePickerOption[], value: TimeValue | undefined) {
  if (!value) {
    return options[0];
  }

  return options.find(option => isEqual(option.value, value)) ?? options[0];
}

function resolveTimeOptionStep(granularity: TimeGranularity, step?: DateStep) {
  const resolvedStep = (step?.hour ?? 0) * 3600 + (step?.minute ?? 0) * 60 + (step?.second ?? 0);

  if (resolvedStep > 0) {
    return resolvedStep;
  }

  if (granularity === 'hour') {
    return 3600;
  }

  if (granularity === 'second') {
    return 30;
  }

  return 1800;
}
