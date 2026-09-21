<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useCalendarRootContext, useCalendarUi } from './context';
import type { CalendarCellProps } from './types';

defineOptions({
  name: 'CalendarCell'
});

const props = withDefaults(defineProps<CalendarCellProps>(), {
  as: 'td'
});

const cls = useCalendarUi('cell');
const { isDateSelected, isDateDisabled, isDateUnavailable } = useCalendarRootContext('CalendarCell');

const selected = computed(() => isDateSelected(props.date));
const disabled = computed(() => isDateDisabled(props.date) || isDateUnavailable?.(props.date));
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-calendar-cell
    :aria-disabled="disabled ? true : undefined"
    :aria-selected="selected ? true : undefined"
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :data-selected="selected ? '' : undefined"
    role="gridcell"
  >
    <slot />
  </Primitive>
</template>
