<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarUi } from './context';
import type { CalendarHeaderProps } from './types';

defineOptions({
  name: 'CalendarHeader'
});

defineProps<CalendarHeaderProps>();

const cls = useCalendarUi('header');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-calendar-header :class="cls">
    <slot />
  </Primitive>
</template>
