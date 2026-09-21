<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRangeUi } from './context';
import type { CalendarRangeGridBodyProps } from './types';

defineOptions({
  name: 'CalendarRangeGridBody'
});

withDefaults(defineProps<CalendarRangeGridBodyProps>(), {
  as: 'tbody'
});

const cls = useCalendarRangeUi('gridBody');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-range-grid-body :class="cls">
    <slot />
  </Primitive>
</template>
