<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRangeUi } from './context';
import type { CalendarRangeGridHeadProps } from './types';

defineOptions({
  name: 'CalendarRangeGridHead'
});

withDefaults(defineProps<CalendarRangeGridHeadProps>(), {
  as: 'thead'
});

const cls = useCalendarRangeUi('gridHead');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-range-grid-head :class="cls" aria-hidden="true">
    <slot />
  </Primitive>
</template>
