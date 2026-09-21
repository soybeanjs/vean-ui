<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarUi } from './context';
import type { CalendarGridRowProps } from './types';

defineOptions({
  name: 'CalendarGridRow'
});

withDefaults(defineProps<CalendarGridRowProps>(), {
  as: 'tr'
});

const cls = useCalendarUi('gridRow');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-grid-row :class="cls">
    <slot />
  </Primitive>
</template>
