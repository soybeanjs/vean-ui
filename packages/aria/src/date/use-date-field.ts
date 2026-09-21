import { computed } from 'vue';
import type { Ref } from 'vue';
import { useLocaleMessages } from '../locale';
import type { LocaleDateMessages } from '../locale/types';
import { getDaysInMonth } from './comparators';
import type { Formatter } from './formatter';
import { cycleSegment, getSegmentNumber, setSegmentParts } from './operations';
import type { NumericSegmentPart } from './operations';
import { isAcceptableSegmentKey, isNumberString, isSegmentNavigationKey } from './segment';
import type { DateStep, HourCycle, SegmentPart, SegmentValueObj } from './types';
import { getMonthNumber, getDayNumber, getYearNumber } from './value';

type SegmentAttrOptions = {
  disabled?: boolean;
  segmentValues: SegmentValueObj;
  hourCycle: HourCycle;
  placeholder: Date;
  formatter: Formatter;
  messages: LocaleDateMessages;
};

const commonSegmentAttrs = (disabled?: boolean) => ({
  role: 'spinbutton',
  contenteditable: true,
  tabindex: disabled ? undefined : 0,
  spellcheck: false,
  inputmode: 'numeric',
  autocorrect: 'off',
  enterkeyhint: 'next',
  style: 'caret-color: transparent;'
});

const uses12HourFormat = (hourCycle: HourCycle, locale: string) => {
  if (hourCycle !== undefined) {
    return hourCycle === 12;
  }

  const resolved = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions();
  const resolvedHourCycle = (resolved as { hourCycle?: string }).hourCycle;

  return resolvedHourCycle === 'h11' || resolvedHourCycle === 'h12';
};

const getAccessibleHourValue = (props: SegmentAttrOptions) => {
  const rawHour = props.placeholder.getHours();

  if (!uses12HourFormat(props.hourCycle, props.formatter.getLocale())) {
    return rawHour;
  }

  return rawHour % 12 || 12;
};

const segmentBuilders = {
  day: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      'aria-label': props.messages.daySegment,
      'aria-valuemin': 1,
      'aria-valuemax': getDaysInMonth(props.placeholder),
      'aria-valuenow': getDayNumber(props.placeholder),
      'aria-valuetext': props.segmentValues.day === null ? props.messages.empty : `${getDayNumber(props.placeholder)}`,
      'data-placeholder': props.segmentValues.day === null ? '' : undefined
    })
  },
  month: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      'aria-label': props.messages.monthSegment,
      'aria-valuemin': 1,
      'aria-valuemax': 12,
      'aria-valuenow': getMonthNumber(props.placeholder),
      'aria-valuetext':
        props.segmentValues.month === null
          ? props.messages.empty
          : `${getMonthNumber(props.placeholder)} - ${props.formatter.fullMonth(props.placeholder)}`,
      'data-placeholder': props.segmentValues.month === null ? '' : undefined
    })
  },
  year: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      'aria-label': props.messages.yearSegment,
      'aria-valuemin': 1,
      'aria-valuemax': 9999,
      'aria-valuenow': getYearNumber(props.placeholder),
      'aria-valuetext':
        props.segmentValues.year === null ? props.messages.empty : `${getYearNumber(props.placeholder)}`,
      'data-placeholder': props.segmentValues.year === null ? '' : undefined
    })
  },
  hour: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      'aria-label': props.messages.hourSegment,
      'aria-valuemin': uses12HourFormat(props.hourCycle, props.formatter.getLocale()) ? 1 : 0,
      'aria-valuemax': uses12HourFormat(props.hourCycle, props.formatter.getLocale()) ? 12 : 23,
      'aria-valuenow': getAccessibleHourValue(props),
      'aria-valuetext':
        'hour' in props.segmentValues && props.segmentValues.hour === null
          ? props.messages.empty
          : `${getAccessibleHourValue(props)}`,
      'data-placeholder': 'hour' in props.segmentValues && props.segmentValues.hour === null ? '' : undefined
    })
  },
  minute: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      'aria-label': props.messages.minuteSegment,
      'aria-valuemin': 0,
      'aria-valuemax': 59,
      'aria-valuenow': props.placeholder.getMinutes(),
      'aria-valuetext':
        'minute' in props.segmentValues && props.segmentValues.minute === null
          ? props.messages.empty
          : `${props.placeholder.getMinutes()}`,
      'data-placeholder': 'minute' in props.segmentValues && props.segmentValues.minute === null ? '' : undefined
    })
  },
  second: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      'aria-label': props.messages.secondSegment,
      'aria-valuemin': 0,
      'aria-valuemax': 59,
      'aria-valuenow': props.placeholder.getSeconds(),
      'aria-valuetext':
        'second' in props.segmentValues && props.segmentValues.second === null
          ? props.messages.empty
          : `${props.placeholder.getSeconds()}`,
      'data-placeholder': 'second' in props.segmentValues && props.segmentValues.second === null ? '' : undefined
    })
  },
  dayPeriod: {
    attrs: (props: SegmentAttrOptions) => ({
      ...commonSegmentAttrs(props.disabled),
      inputmode: 'text',
      'aria-label': props.messages.dayPeriodSegment,
      'aria-valuemin': 0,
      'aria-valuemax': 1,
      'aria-valuenow': 'dayPeriod' in props.segmentValues ? (props.segmentValues.dayPeriod === 'PM' ? 1 : 0) : 0,
      'aria-valuetext':
        'dayPeriod' in props.segmentValues && props.segmentValues.dayPeriod === null
          ? props.messages.empty
          : 'dayPeriod' in props.segmentValues
            ? props.segmentValues.dayPeriod
            : undefined
    })
  },
  literal: { attrs: () => ({ 'aria-hidden': true, 'data-segment': 'literal' }) },
  timeZoneName: {
    attrs: (props: SegmentAttrOptions) => ({
      role: 'textbox',
      tabindex: props.disabled ? undefined : 0,
      'aria-label': props.messages.timeZoneSegment,
      'data-readonly': true,
      style: 'caret-color: transparent;'
    })
  }
} as const;

export type UseDateFieldOptions = {
  hasLeftFocus: Ref<boolean>;
  lastKeyZero: Ref<boolean>;
  placeholder: Ref<Date>;
  hourCycle: HourCycle;
  step: Ref<DateStep>;
  formatter: Formatter;
  segmentValues: Ref<SegmentValueObj>;
  disabled: Ref<boolean | undefined>;
  readonly: Ref<boolean | undefined>;
  part: SegmentPart;
  modelValue: Ref<Date | undefined>;
  focusNext: () => void;
};

const NUMERIC_SEGMENT_PARTS: readonly NumericSegmentPart[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];

export function useDateField(props: UseDateFieldOptions) {
  const messages = useLocaleMessages();

  const attributes = computed(
    () =>
      segmentBuilders[props.part]?.attrs({
        disabled: props.disabled.value,
        placeholder: props.placeholder.value,
        hourCycle: props.hourCycle,
        segmentValues: props.segmentValues.value,
        formatter: props.formatter,
        messages: messages.value.date
      }) ?? {}
  );

  const deleteValue = (prevValue: number | null) => {
    props.hasLeftFocus.value = false;

    if (prevValue === null) {
      return prevValue;
    }

    const str = prevValue.toString();
    if (str.length === 1) {
      props.modelValue.value = undefined;
      return null;
    }

    return Number.parseInt(str.slice(0, -1));
  };

  const incrementSegment = (part: NumericSegmentPart, dateRef: Date, prevValue: number | null, sign: number) => {
    const step = props.step.value[part] ?? 1;

    if (prevValue === null) {
      return getSegmentNumber(dateRef, part);
    }

    const base = setSegmentParts(dateRef, { [part]: prevValue });

    return getSegmentNumber(cycleSegment(base, part, sign * step), part);
  };

  const updateDayOrMonth = (max: number, num: number, prev: number | null) => {
    let moveToNext = false;
    const maxStart = Math.floor(max / 10);

    if (props.hasLeftFocus.value) {
      props.hasLeftFocus.value = false;
      props.lastKeyZero.value = false;
      prev = null;
    }

    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.value = true;
        return { moveToNext, value: null };
      }

      if (props.lastKeyZero.value || num > maxStart) {
        moveToNext = true;
      }

      props.lastKeyZero.value = false;

      return { moveToNext, value: num };
    }

    const digits = prev.toString().length;
    const total = Number.parseInt(prev.toString() + num.toString());

    if (digits === 2 || total > max) {
      if (num > maxStart || total > max) {
        moveToNext = true;
      }

      return { moveToNext, value: num };
    }

    moveToNext = true;

    return { moveToNext, value: total };
  };

  const updateMinuteOrSecond = (num: number, prev: number | null) => {
    const max = 59;
    let moveToNext = false;
    const maxStart = Math.floor(max / 10);

    if (props.hasLeftFocus.value) {
      props.hasLeftFocus.value = false;
      props.lastKeyZero.value = false;
      prev = null;
    }

    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.value = true;
        return { moveToNext, value: 0 };
      }

      if (props.lastKeyZero.value || num > maxStart) {
        moveToNext = true;
      }

      props.lastKeyZero.value = false;

      return { moveToNext, value: num };
    }

    const digits = prev.toString().length;
    const total = Number.parseInt(prev.toString() + num.toString());

    if (digits === 2 || total > max) {
      if (num > maxStart) {
        moveToNext = true;
      }

      return { moveToNext, value: num };
    }

    moveToNext = true;

    return { moveToNext, value: total };
  };

  const updateHour = (max: number, num: number, prev: number | null) => {
    let moveToNext = false;
    const maxStart = Math.floor(max / 10);

    if (props.hasLeftFocus.value) {
      props.hasLeftFocus.value = false;
      props.lastKeyZero.value = false;
      prev = null;
    }

    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.value = true;
        return { moveToNext, value: 0 };
      }

      if (props.lastKeyZero.value || num > maxStart) {
        moveToNext = true;
      }

      props.lastKeyZero.value = false;

      return { moveToNext, value: num };
    }

    const digits = prev.toString().length;
    const total = Number.parseInt(prev.toString() + num.toString());

    if (digits === 2 || total > max) {
      if (num > maxStart) {
        moveToNext = true;
      }

      return { moveToNext, value: num };
    }

    moveToNext = true;

    return { moveToNext, value: total };
  };

  const updateYear = (num: number, prev: number | null) => {
    let moveToNext = false;

    if (props.hasLeftFocus.value) {
      props.hasLeftFocus.value = false;
      prev = null;
    }

    if (prev === null) {
      return { moveToNext, value: num === 0 ? 1 : num };
    }

    const str = prev.toString() + num.toString();

    if (str.length > 4) {
      return { moveToNext, value: num === 0 ? 1 : num };
    }

    if (str.length === 4) {
      moveToNext = true;
    }

    return { moveToNext, value: Number.parseInt(str) };
  };

  const handleDaySegmentKeydown = (event: KeyboardEvent) => {
    if (!isAcceptableSegmentKey(event.key) || isSegmentNavigationKey(event.key)) {
      return;
    }

    const prevValue = props.segmentValues.value.day;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const sign = event.key === 'ArrowUp' ? 1 : -1;

      props.segmentValues.value.day = incrementSegment('day', props.placeholder.value, prevValue, sign);
      return;
    }

    if (isNumberString(event.key)) {
      const num = Number.parseInt(event.key);
      const month = props.segmentValues.value.month;
      const daysInMonth = month ? getDaysInMonth(setSegmentParts(props.placeholder.value, { month })) : 31;
      const { moveToNext, value } = updateDayOrMonth(daysInMonth, num, prevValue);

      props.segmentValues.value.day = value;

      if (moveToNext) {
        props.focusNext();
      }
    }

    if (event.key === 'Backspace') {
      props.segmentValues.value.day = deleteValue(prevValue);
    }
  };

  const handleMonthSegmentKeydown = (event: KeyboardEvent) => {
    if (!isAcceptableSegmentKey(event.key) || isSegmentNavigationKey(event.key)) {
      return;
    }

    const prevValue = props.segmentValues.value.month;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const sign = event.key === 'ArrowUp' ? 1 : -1;

      props.segmentValues.value.month = incrementSegment('month', props.placeholder.value, prevValue, sign);
      return;
    }

    if (isNumberString(event.key)) {
      const { moveToNext, value } = updateDayOrMonth(12, Number.parseInt(event.key), prevValue);

      props.segmentValues.value.month = value;

      if (moveToNext) {
        props.focusNext();
      }
    }

    if (event.key === 'Backspace') {
      props.segmentValues.value.month = deleteValue(prevValue);
    }
  };

  const handleYearSegmentKeydown = (event: KeyboardEvent) => {
    if (!isAcceptableSegmentKey(event.key) || isSegmentNavigationKey(event.key)) {
      return;
    }

    const prevValue = props.segmentValues.value.year;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const sign = event.key === 'ArrowUp' ? 1 : -1;

      props.segmentValues.value.year = incrementSegment('year', props.placeholder.value, prevValue, sign);
      return;
    }

    if (isNumberString(event.key)) {
      const { moveToNext, value } = updateYear(Number.parseInt(event.key), prevValue);

      props.segmentValues.value.year = value;

      if (moveToNext) {
        props.focusNext();
      }
    }

    if (event.key === 'Backspace') {
      props.segmentValues.value.year = deleteValue(prevValue);
    }
  };

  const handleHourSegmentKeydown = (event: KeyboardEvent) => {
    if (
      !isAcceptableSegmentKey(event.key) ||
      isSegmentNavigationKey(event.key) ||
      !('hour' in props.segmentValues.value)
    ) {
      return;
    }

    const prevValue = props.segmentValues.value.hour;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const sign = event.key === 'ArrowUp' ? 1 : -1;
      const nextHour = incrementSegment('hour', props.placeholder.value, prevValue, sign);

      props.segmentValues.value.hour = nextHour;

      if ('dayPeriod' in props.segmentValues.value && nextHour !== null) {
        props.segmentValues.value.dayPeriod = nextHour >= 12 ? 'PM' : 'AM';
      }

      return;
    }

    if (isNumberString(event.key)) {
      const num = Number.parseInt(event.key);
      const is12Hour = uses12HourFormat(props.hourCycle, props.formatter.getLocale());
      const max = is12Hour ? 12 : 24;

      let displayPrev = prevValue;

      if (is12Hour && prevValue !== null) {
        displayPrev = prevValue % 12 === 0 ? 0 : prevValue > 12 ? prevValue - 12 : prevValue;
      }

      const { moveToNext, value } = updateHour(max, num, displayPrev);

      let internalValue = value;

      if (is12Hour && value !== null && 'dayPeriod' in props.segmentValues.value) {
        const period = props.segmentValues.value.dayPeriod || 'AM';

        if (value === 12) {
          internalValue = period === 'AM' ? 0 : 12;
        } else {
          internalValue = period === 'PM' ? value + 12 : value;
        }
      }

      props.segmentValues.value.hour = internalValue;

      if (moveToNext) {
        props.focusNext();
      }
    }

    if (event.key === 'Backspace') {
      props.segmentValues.value.hour = deleteValue(prevValue);
    }
  };

  const handleMinuteSegmentKeydown = (event: KeyboardEvent) => {
    if (
      !isAcceptableSegmentKey(event.key) ||
      isSegmentNavigationKey(event.key) ||
      !('minute' in props.segmentValues.value)
    ) {
      return;
    }

    const prevValue = props.segmentValues.value.minute;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const sign = event.key === 'ArrowUp' ? 1 : -1;

      props.segmentValues.value.minute = incrementSegment('minute', props.placeholder.value, prevValue, sign);
      return;
    }

    if (isNumberString(event.key)) {
      const { moveToNext, value } = updateMinuteOrSecond(Number.parseInt(event.key), prevValue);

      props.segmentValues.value.minute = value;

      if (moveToNext) {
        props.focusNext();
      }
    }

    if (event.key === 'Backspace') {
      props.segmentValues.value.minute = deleteValue(prevValue);
    }
  };

  const handleSecondSegmentKeydown = (event: KeyboardEvent) => {
    if (
      !isAcceptableSegmentKey(event.key) ||
      isSegmentNavigationKey(event.key) ||
      !('second' in props.segmentValues.value)
    ) {
      return;
    }

    const prevValue = props.segmentValues.value.second;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const sign = event.key === 'ArrowUp' ? 1 : -1;

      props.segmentValues.value.second = incrementSegment('second', props.placeholder.value, prevValue, sign);
      return;
    }

    if (isNumberString(event.key)) {
      const { moveToNext, value } = updateMinuteOrSecond(Number.parseInt(event.key), prevValue);

      props.segmentValues.value.second = value;

      if (moveToNext) {
        props.focusNext();
      }
    }

    if (event.key === 'Backspace') {
      props.segmentValues.value.second = deleteValue(prevValue);
    }
  };

  const handleDayPeriodSegmentKeydown = (event: KeyboardEvent) => {
    if (
      ((!isAcceptableSegmentKey(event.key) || isSegmentNavigationKey(event.key)) &&
        !['a', 'A', 'p', 'P'].includes(event.key)) ||
      !('dayPeriod' in props.segmentValues.value)
    ) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (props.segmentValues.value.dayPeriod === 'AM') {
        props.segmentValues.value.dayPeriod = 'PM';
        props.segmentValues.value.hour = (props.segmentValues.value.hour ?? 0) + 12;
        return;
      }

      props.segmentValues.value.dayPeriod = 'AM';
      props.segmentValues.value.hour = (props.segmentValues.value.hour ?? 12) - 12;
      return;
    }

    if (['a', 'A'].includes(event.key) && props.segmentValues.value.dayPeriod !== 'AM') {
      props.segmentValues.value.dayPeriod = 'AM';
      props.segmentValues.value.hour = (props.segmentValues.value.hour ?? 12) - 12;
      return;
    }

    if (['p', 'P'].includes(event.key) && props.segmentValues.value.dayPeriod !== 'PM') {
      props.segmentValues.value.dayPeriod = 'PM';
      props.segmentValues.value.hour = (props.segmentValues.value.hour ?? 0) + 12;
    }
  };

  const handleSegmentClick = (event: MouseEvent) => {
    if (props.disabled.value) {
      event.preventDefault();
    }
  };

  const composeModelValue = () => {
    const segmentValues = props.segmentValues.value as Record<string, number | 'AM' | 'PM' | null>;
    const parts = NUMERIC_SEGMENT_PARTS.reduce<Record<string, number>>((acc, part) => {
      const value = segmentValues[part];

      if (typeof value === 'number') {
        acc[part] = value;
      }

      return acc;
    }, {});

    return setSegmentParts(props.placeholder.value, parts);
  };

  const handleSegmentKeydown = (event: KeyboardEvent) => {
    if (props.disabled.value || props.readonly.value) {
      return;
    }

    if (event.key !== 'Tab') {
      event.preventDefault();
    }

    const handlers = {
      day: handleDaySegmentKeydown,
      dayPeriod: handleDayPeriodSegmentKeydown,
      hour: handleHourSegmentKeydown,
      minute: handleMinuteSegmentKeydown,
      month: handleMonthSegmentKeydown,
      second: handleSecondSegmentKeydown,
      timeZoneName: () => undefined,
      year: handleYearSegmentKeydown
    } as const;

    if (props.part === 'literal') {
      return;
    }

    handlers[props.part](event as never);

    if (
      !['ArrowLeft', 'ArrowRight', 'Shift', 'Tab'].includes(event.key) &&
      isAcceptableSegmentKey(event.key) &&
      Object.values(props.segmentValues.value).every(value => value !== null)
    ) {
      props.modelValue.value = composeModelValue();
    }
  };

  const handleSegmentFocusOut = () => {
    if (!Object.values(props.segmentValues.value).every(value => value !== null)) {
      return;
    }

    props.modelValue.value = composeModelValue();
  };

  return {
    attributes,
    handleSegmentClick,
    handleSegmentFocusOut,
    handleSegmentKeydown
  };
}
