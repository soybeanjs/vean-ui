<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarUi } from './context';
import type { CalendarHeadCellProps } from './types';

defineOptions({
  name: 'CalendarHeadCell'
});

withDefaults(defineProps<CalendarHeadCellProps>(), {
  as: 'th'
});

const cls = useCalendarUi('headCell');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-head-cell :class="cls">
    <slot />
  </Primitive>
</template>
