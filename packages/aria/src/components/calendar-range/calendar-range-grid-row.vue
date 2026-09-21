<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRangeUi } from './context';
import type { CalendarRangeGridRowProps } from './types';

defineOptions({
  name: 'CalendarRangeGridRow'
});

withDefaults(defineProps<CalendarRangeGridRowProps>(), {
  as: 'tr'
});

const cls = useCalendarRangeUi('gridRow');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-range-grid-row :class="cls">
    <slot />
  </Primitive>
</template>
