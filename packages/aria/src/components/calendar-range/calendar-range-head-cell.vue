<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRangeUi } from './context';
import type { CalendarRangeHeadCellProps } from './types';

defineOptions({
  name: 'CalendarRangeHeadCell'
});

withDefaults(defineProps<CalendarRangeHeadCellProps>(), {
  as: 'th'
});

const cls = useCalendarRangeUi('headCell');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-range-head-cell :class="cls">
    <slot />
  </Primitive>
</template>
