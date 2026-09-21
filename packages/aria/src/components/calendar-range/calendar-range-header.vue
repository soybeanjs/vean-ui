<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRangeUi } from './context';
import type { CalendarRangeHeaderProps } from './types';

defineOptions({
  name: 'CalendarRangeHeader'
});

defineProps<CalendarRangeHeaderProps>();

const cls = useCalendarRangeUi('header');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-range-header :class="cls">
    <slot />
  </Primitive>
</template>
