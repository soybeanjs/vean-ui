<script setup lang="ts">
import { computed } from 'vue';
import { toDate } from '../../date';
import { Primitive } from '../primitive';
import { useCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangeCellProps } from './types';

defineOptions({
  name: 'CalendarRangeCell'
});

const props = withDefaults(defineProps<CalendarRangeCellProps>(), {
  as: 'td'
});

const cls = useCalendarRangeUi('cell');
const { isDateSelected, isDateInRange, isDateDisabled, isDateUnavailable } =
  useCalendarRangeRootContext('CalendarRangeCell');

const selected = computed(() => isDateSelected(toDate(props.date)));
const inRange = computed(() => isDateInRange(toDate(props.date)));
const disabled = computed(() => isDateDisabled(toDate(props.date)) || isDateUnavailable?.(toDate(props.date)));
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-calendar-range-cell
    :class="cls"
    :aria-disabled="disabled ? true : undefined"
    :aria-selected="selected ? true : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-selected="selected ? '' : undefined"
    :data-in-range="inRange ? '' : undefined"
    role="gridcell"
  >
    <slot />
  </Primitive>
</template>
