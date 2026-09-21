<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarUi } from './context';
import type { CalendarGridHeadProps } from './types';

defineOptions({
  name: 'CalendarGridHead'
});

withDefaults(defineProps<CalendarGridHeadProps>(), {
  as: 'thead'
});

const cls = useCalendarUi('gridHead');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-grid-head :class="cls" aria-hidden="true">
    <slot />
  </Primitive>
</template>
