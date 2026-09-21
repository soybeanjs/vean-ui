<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { addDays } from 'date-fns/addDays';
import { useOmitProps, useForwardElement } from '../../composables';
import { isBetweenInclusive, isSameDay, isSameMonth, isToday, toISODateString, toDate } from '../../date';
import type { DateValue } from '../../date';
import Button from '../button/button.vue';
import { useCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangeCellTriggerProps, CalendarRangeCellTriggerSlots } from './types';

defineOptions({
  name: 'CalendarRangeCellTrigger'
});

const props = defineProps<CalendarRangeCellTriggerProps>();

defineSlots<CalendarRangeCellTriggerSlots>();

const forwardedProps = useOmitProps(props, ['day', 'month']);

const cls = useCalendarRangeUi('cellTrigger');
const {
  locale,
  formatter,
  isDateUnavailable,
  isOutsideVisibleView: checkOutsideVisibleView,
  isDateDisabled,
  disableDaysOutsideCurrentView,
  isDateSelected,
  isSelectionStart,
  isSelectionEnd,
  isHighlightedStart,
  isHighlightedEnd,
  highlightedRange,
  disabled,
  isPlaceholderFocusable,
  placeholder,
  hasSelectedDate,
  isSelectedDateDisabled,
  firstFocusableDate,
  selectedFocusableDate,
  minValue,
  maxValue,
  parentElement,
  isNextButtonDisabled,
  nextPage,
  isPrevButtonDisabled,
  prevPage,
  onPlaceholderChange,
  setHoveredDate,
  onDateChange,
  dir
} = useCalendarRangeRootContext('CalendarRangeCellTrigger');
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
const isDisabled = computed(
  () => isDateDisabled(props.day) || Boolean(disableDaysOutsideCurrentView.value && isOutsideView.value)
);
const isSelectedDate = computed(() => isDateSelected(props.day));
const isSelectionStartResult = computed(() => isSelectionStart(props.day));
const isSelectionEndResult = computed(() => isSelectionEnd(props.day));
const isHighlightedStartResult = computed(() => isHighlightedStart(props.day));
const isHighlightedEndResult = computed(() => isHighlightedEnd(props.day));
const isHighlighted = computed(() => {
  if (!highlightedRange.value?.start || !highlightedRange.value?.end) {
    return false;
  }

  return isBetweenInclusive(props.day, highlightedRange.value.start, highlightedRange.value.end);
});
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
  if (selectedFocusableDate.value && !isPlaceholderFocusable.value) {
    return isSameDay(props.day, selectedFocusableDate.value);
  }

  return false;
});

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
  setHoveredDate(candidateDayValue);
  candidateDay.focus();
};

const handleClick = () => {
  onDateChange(props.day);
};

const handlePointerEnter = () => {
  if (isDisabled.value || isUnavailable.value) {
    return;
  }

  setHoveredDate(props.day);
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
      onDateChange(props.day);
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
    data-vean-calendar-range-cell-trigger
    :class="cls"
    :disabled="isDisabled || isUnavailable"
    :aria-label="props['aria-label'] ?? labelText"
    :aria-pressed="isSelectedDate ? true : undefined"
    :data-focused="isFocusedDate ? '' : undefined"
    :data-highlighted="isHighlighted ? '' : undefined"
    :data-highlighted-end="isHighlightedEndResult ? '' : undefined"
    :data-highlighted-start="isHighlightedStartResult ? '' : undefined"
    :data-outside-view="isOutsideView ? '' : undefined"
    :data-outside-visible-view="isOutsideVisibleView ? '' : undefined"
    :data-selected="isSelectedDate ? '' : undefined"
    :data-selection-end="isSelectionEndResult ? '' : undefined"
    :data-selection-start="isSelectionStartResult ? '' : undefined"
    :data-today="isDateToday ? '' : undefined"
    :data-unavailable="isUnavailable ? '' : undefined"
    :data-value="toISODateString(day)"
    :tabindex="isFocusedDate ? 0 : isOutsideView || isDisabled ? undefined : -1"
    @click="handleClick"
    @focusin="handlePointerEnter"
    @keydown="handleKeydown"
    @mouseleave="setHoveredDate(undefined)"
    @mouseenter="handlePointerEnter"
  >
    <slot
      :day-value="dayValue"
      :disabled="isDisabled"
      :highlighted="isHighlighted"
      :highlighted-end="isHighlightedEndResult"
      :highlighted-start="isHighlightedStartResult"
      :outside-view="isOutsideView"
      :outside-visible-view="isOutsideVisibleView"
      :selected="isSelectedDate"
      :selection-end="isSelectionEndResult"
      :selection-start="isSelectionStartResult"
      :today="isDateToday"
      :unavailable="isUnavailable"
    >
      {{ dayValue }}
    </slot>
  </Button>
</template>
