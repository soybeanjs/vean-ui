<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue';
import { toContext } from '../../shared';
import { getMonthOptions, getYearOptions, handleMonthChange, handleYearChange } from '../calendar/shared';
import { useDirection, useLocale } from '../config-provider/context';
import { useControllableState, useForwardElement } from '../../composables';
import {
  isSameDay,
  getDefaultDate,
  getWeekStartsOn,
  handleCalendarInitialFocus,
  isBefore,
  useDateFormatter
} from '../../date';
import type { DateValue } from '../../date';
import { cloneDateValue } from '../../date/value';
import { useCalendar } from '../calendar/use-calendar';
import { Primitive } from '../primitive';
import { provideCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangeRootProps, CalendarRangeRootEmits, CalendarRangeRootSlots } from './types';
import { useCalendarRangeState } from './use-calendar-range';

defineOptions({
  name: 'CalendarRangeRoot'
});

const props = withDefaults(defineProps<CalendarRangeRootProps>(), {
  defaultValue: () => ({ start: null, end: null }),
  defaultPlaceholder: undefined,
  placeholder: undefined,
  allowNonContiguousRanges: false,
  pagedNavigation: false,
  preventDeselect: false,
  weekdayFormat: 'narrow',
  fixedWeeks: false,
  numberOfMonths: 1,
  disabled: false,
  readonly: false,
  initialFocus: false,
  isDateDisabled: undefined,
  isDateUnavailable: undefined,
  isDateHighlightable: undefined,
  maximumDays: undefined,
  disableDaysOutsideCurrentView: false,
  fixedDate: undefined
});

const emit = defineEmits<CalendarRangeRootEmits>();

defineSlots<CalendarRangeRootSlots>();

const cls = useCalendarRangeUi('root');
const [parentElement, setParentElement] = useForwardElement();

const locale = useLocale(() => props.locale);
const dir = useDirection(() => props.dir);
const weekStartsOn = computed(() => props.weekStartsOn ?? getWeekStartsOn(locale.value));
const formatter = useDateFormatter(locale.value);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
    emit('update:startValue', value.start ?? null);
  },
  props.defaultValue ?? { start: null, end: null }
);

const defaultDate = getDefaultDate({
  defaultPlaceholder: props.placeholder,
  defaultValue: modelValue.value.start ?? undefined,
  locale: props.locale
});

const placeholder = useControllableState(
  () => props.placeholder,
  value => {
    emit('update:placeholder', value);
  },
  props.defaultPlaceholder ?? cloneDateValue(defaultDate)
);

const startValue = computed(() => modelValue.value.start ?? undefined);
const endValue = computed(() => modelValue.value.end ?? undefined);
const hoveredDate = shallowRef<DateValue | undefined>();

const {
  fullCalendarLabel,
  headingValue,
  isDateDisabled,
  isDateUnavailable,
  isNextButtonDisabled,
  isPrevButtonDisabled,
  weekdays,
  isOutsideVisibleView,
  nextPage,
  prevPage,
  grid,
  isPlaceholderFocusable,
  firstFocusableDate
} = useCalendar({
  locale,
  placeholder,
  weekStartsOn,
  fixedWeeks: computed(() => props.fixedWeeks),
  numberOfMonths: computed(() => props.numberOfMonths),
  minValue: computed(() => props.minValue),
  maxValue: computed(() => props.maxValue),
  disabled: computed(() => props.disabled),
  weekdayFormat: computed(() => props.weekdayFormat),
  pagedNavigation: computed(() => props.pagedNavigation),
  isDateDisabled: props.isDateDisabled,
  isDateUnavailable: props.isDateUnavailable,
  calendarLabel: computed(() => props.calendarLabel),
  nextPage: computed(() => props.nextPage),
  prevPage: computed(() => props.prevPage)
});

const {
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
} = useCalendarRangeState({
  start: startValue,
  end: endValue,
  hoveredDate,
  isDateDisabled,
  isDateUnavailable,
  isDateHighlightable: props.isDateHighlightable,
  allowNonContiguousRanges: computed(() => props.allowNonContiguousRanges),
  maximumDays: computed(() => props.maximumDays)
});

const monthOptions = computed(() =>
  getMonthOptions({
    placeholder: placeholder.value,
    disabled: props.disabled,
    minValue: props.minValue,
    maxValue: props.maxValue,
    formatter
  })
);

const onMonthChange = (month?: number) => {
  handleMonthChange(month, {
    placeholder: placeholder.value,
    disabled: props.disabled,
    minValue: props.minValue,
    maxValue: props.maxValue,
    onPlaceholderChange
  });
};

const onYearChange = (year?: number) => {
  handleYearChange(year, {
    placeholder: placeholder.value,
    minValue: props.minValue,
    maxValue: props.maxValue,
    onPlaceholderChange
  });
};

const yearOptions = computed(() =>
  getYearOptions({
    placeholder: placeholder.value,
    minValue: props.minValue,
    maxValue: props.maxValue
  })
);

watch(locale, value => {
  if (formatter.getLocale() !== value) {
    formatter.setLocale(value);
  }
});

watch(
  () => modelValue.value.start,
  value => {
    if (value && !isSameDay(placeholder.value, value)) {
      placeholder.value = cloneDateValue(value);
    }
  }
);

function onPlaceholderChange(value: DateValue) {
  placeholder.value = cloneDateValue(value);
}

function onDateChange(value: DateValue) {
  if (props.readonly || isDateDisabled(value) || isDateUnavailable(value)) {
    return;
  }

  const { start, end } = modelValue.value;

  if (!start) {
    modelValue.value = { start: cloneDateValue(value), end: null };
    return;
  }

  if (!end) {
    if (!props.preventDeselect && isSameDay(start, value)) {
      modelValue.value = { start: null, end: null };
      placeholder.value = cloneDateValue(value);
      hoveredDate.value = undefined;
      return;
    }

    const nextRange = sortRange(start, value);

    if (
      props.maximumDays &&
      nextRange.start &&
      nextRange.end &&
      getInclusiveRangeDays(nextRange.start, nextRange.end) > props.maximumDays
    ) {
      modelValue.value = { start: cloneDateValue(value), end: null };
      return;
    }

    if (
      !props.allowNonContiguousRanges &&
      nextRange.start &&
      nextRange.end &&
      isRangeInvalid(nextRange.start, nextRange.end, {
        isDateDisabled,
        isDateUnavailable,
        isDateHighlightable: props.isDateHighlightable,
        allowNonContiguousRanges: props.allowNonContiguousRanges,
        maximumDays: props.maximumDays
      })
    ) {
      modelValue.value = { start: cloneDateValue(value), end: null };
      return;
    }

    modelValue.value = nextRange;
    hoveredDate.value = undefined;
    return;
  }

  if (props.fixedDate === 'start') {
    modelValue.value = isBefore(value, start)
      ? { start: cloneDateValue(value), end: cloneDateValue(start) }
      : { start: cloneDateValue(start), end: cloneDateValue(value) };
    hoveredDate.value = undefined;
    return;
  }

  if (props.fixedDate === 'end') {
    modelValue.value = isBefore(end, value)
      ? { start: cloneDateValue(end), end: cloneDateValue(value) }
      : { start: cloneDateValue(value), end: cloneDateValue(end) };
    hoveredDate.value = undefined;
    return;
  }

  modelValue.value = { start: cloneDateValue(value), end: null };
  hoveredDate.value = undefined;
}

provideCalendarRangeRootContext({
  locale,
  dir,
  weekStartsOn,
  weekdayFormat: computed(() => props.weekdayFormat),
  modelValue,
  placeholder,
  grid,
  parentElement,
  fullCalendarLabel,
  headingValue,
  isInvalid,
  minValue: computed(() => props.minValue),
  maxValue: computed(() => props.maxValue),
  isPlaceholderFocusable,
  firstFocusableDate,
  hasSelectedDate,
  isSelectedDateDisabled,
  selectedFocusableDate,
  formatter,
  highlightedRange,
  fixedDate: computed(() => props.fixedDate),
  maximumDays: computed(() => props.maximumDays),
  isDateUnavailable: props.isDateUnavailable,
  isDateHighlightable: props.isDateHighlightable,
  onDateChange,
  onPlaceholderChange,
  isDateDisabled,
  isDateSelected,
  isDateInRange,
  isSelectionStart,
  isSelectionEnd,
  isHighlightedStart,
  isHighlightedEnd,
  isOutsideVisibleView,
  setHoveredDate(date) {
    hoveredDate.value = date ? cloneDateValue(date) : undefined;
  },
  hoveredDate,
  prevPage,
  nextPage,
  isPrevButtonDisabled,
  isNextButtonDisabled,
  ...toContext(props, [
    'allowNonContiguousRanges',
    'disableDaysOutsideCurrentView',
    'disabled',
    'fixedWeeks',
    'initialFocus',
    'numberOfMonths',
    'pagedNavigation',
    'preventDeselect',
    'readonly'
  ])
});

onMounted(() => {
  if (props.initialFocus && parentElement.value) {
    handleCalendarInitialFocus(parentElement.value);
  }
});
</script>

<template>
  <Primitive
    :ref="setParentElement"
    :as="as"
    :as-child="asChild"
    data-vean-calendar-range-root
    :class="cls"
    :aria-label="fullCalendarLabel"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :dir="dir"
  >
    <slot
      :date="placeholder"
      :disabled="disabled"
      :formatter="formatter"
      :heading-value="headingValue"
      :fixed-weeks="fixedWeeks"
      :grid="grid"
      :locale="locale"
      :min-value="minValue"
      :max-value="maxValue"
      :model-value="modelValue"
      :placeholder="placeholder"
      :on-placeholder-change="onPlaceholderChange"
      :week-days="weekdays"
      :week-starts-on="weekStartsOn"
      :year-options="yearOptions"
      :on-year-change="onYearChange"
      :month-options="monthOptions"
      :on-month-change="onMonthChange"
    />
  </Primitive>
</template>
