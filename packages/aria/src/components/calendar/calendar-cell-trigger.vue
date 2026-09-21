<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { addDays } from 'date-fns/addDays';
import { useOmitProps, useForwardElement } from '../../composables';
import { isSameDay, isSameMonth, isToday, toISODateString, toDate } from '../../date';
import type { DateValue } from '../../date';
import Button from '../button/button.vue';
import { useCalendarRootContext, useCalendarUi } from './context';
import type { CalendarCellTriggerProps, CalendarCellTriggerSlots } from './types';

defineOptions({
  name: 'CalendarCellTrigger'
});

const props = defineProps<CalendarCellTriggerProps>();

defineSlots<CalendarCellTriggerSlots>();

const forwardedProps = useOmitProps(props, ['day', 'month']);

const cls = useCalendarUi('cellTrigger');

const {
  locale,
  formatter,
  isDateUnavailable,
  isOutsideVisibleView: checkOutsideVisibleView,
  isDateDisabled,
  disableDaysOutsideCurrentView,
  isDateSelected,
  disabled,
  isPlaceholderFocusable,
  placeholder,
  hasSelectedDate,
  isSelectedDateDisabled,
  firstFocusableDate,
  readonly,
  onDateChange,
  minValue,
  maxValue,
  parentElement,
  isNextButtonDisabled,
  nextPage,
  isPrevButtonDisabled,
  prevPage,
  onPlaceholderChange,
  dir
} = useCalendarRootContext('CalendarCellTrigger');
const [_, setElement] = useForwardElement();

const dayValue = computed(() => props.day.getDate().toLocaleString(locale.value));
const labelText = computed(() => {
  return formatter.custom(props.day, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});
const isUnavailable = computed(() => isDateUnavailable?.(props.day) ?? false);
const isDateToday = computed(() => isToday(props.day));
const isOutsideView = computed(() => !isSameMonth(props.day, props.month));
const isOutsideVisibleView = computed(() => checkOutsideVisibleView(props.day));
const isDisabled = computed(() => {
  return isDateDisabled(props.day) || Boolean(disableDaysOutsideCurrentView.value && isOutsideView.value);
});
const isSelectedDate = computed(() => isDateSelected(props.day));
const isFocusedDate = computed(() => {
  if (isOutsideView.value || isDisabled.value) {
    return false;
  }
  if (!disabled.value && isPlaceholderFocusable.value && isSameDay(props.day, placeholder.value)) {
    return true;
  }
  if ((!hasSelectedDate.value || isSelectedDateDisabled.value) && !isPlaceholderFocusable.value) {
    return Boolean(firstFocusableDate.value && isSameDay(props.day, firstFocusableDate.value));
  }

  return false;
});

const changeDate = (date: DateValue) => {
  if (readonly.value) {
    return;
  }
  if (isDateDisabled(toDate(date)) || isDateUnavailable?.(toDate(date))) {
    return;
  }

  onDateChange(date);
};

const shiftFocus = (day: DateValue, add: number) => {
  const candidateDayValue = addDays(toDate(day), add);

  if (
    (minValue.value && candidateDayValue.getTime() < toDate(minValue.value).getTime()) ||
    (maxValue.value && candidateDayValue.getTime() > toDate(maxValue.value).getTime())
  ) {
    return;
  }

  const candidateDay = parentElement.value?.querySelector<HTMLElement>(
    `[data-value='${toISODateString(candidateDayValue)}']:not([data-outside-view])`
  );

  if (!candidateDay) {
    if (add > 0) {
      if (isNextButtonDisabled()) {
        return;
      }
      nextPage();
    } else {
      if (isPrevButtonDisabled()) {
        return;
      }
      prevPage();
    }

    nextTick(() => {
      shiftFocus(day, add);
    });
    return;
  }

  if (candidateDay.hasAttribute('data-disabled') || candidateDay.hasAttribute('data-unavailable')) {
    shiftFocus(candidateDayValue, add);
    return;
  }

  onPlaceholderChange(candidateDayValue);
  candidateDay.focus();
};

const handleClick = () => {
  changeDate(props.day);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (isDisabled.value) {
    return;
  }

  const sign = dir.value === 'rtl' ? -1 : 1;

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      shiftFocus(props.day, sign);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      shiftFocus(props.day, -sign);
      break;
    case 'ArrowUp':
      event.preventDefault();
      shiftFocus(props.day, -7);
      break;
    case 'ArrowDown':
      event.preventDefault();
      shiftFocus(props.day, 7);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      changeDate(props.day);
      break;
    default:
      break;
  }
};
</script>

<template>
  <Button
    :ref="setElement"
    v-bind="forwardedProps"
    data-vean-calendar-cell-trigger
    :class="cls"
    :disabled="isDisabled || isUnavailable"
    :aria-label="labelText"
    :data-focused="isFocusedDate ? '' : undefined"
    :data-outside-view="isOutsideView ? '' : undefined"
    :data-outside-visible-view="isOutsideVisibleView ? '' : undefined"
    :data-selected="isSelectedDate ? '' : undefined"
    :data-today="isDateToday ? '' : undefined"
    :data-unavailable="isUnavailable ? '' : undefined"
    :data-value="toISODateString(day)"
    :tabindex="isFocusedDate ? 0 : isOutsideView || isDisabled ? undefined : -1"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot
      :day-value="dayValue"
      :disabled="isDisabled"
      :outside-view="isOutsideView"
      :outside-visible-view="isOutsideVisibleView"
      :selected="isSelectedDate"
      :today="isDateToday"
      :unavailable="isUnavailable"
    >
      {{ dayValue }}
    </slot>
  </Button>
</template>
