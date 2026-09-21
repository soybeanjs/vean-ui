<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRootContext, useCalendarUi } from './context';
import type { CalendarHeadingProps } from './types';

defineOptions({
  name: 'CalendarHeading'
});

defineProps<CalendarHeadingProps>();

const cls = useCalendarUi('heading');

const { disabled, headingValue } = useCalendarRootContext('CalendarHeading');
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-calendar-heading
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
  >
    <slot :heading-value="headingValue">{{ headingValue }}</slot>
  </Primitive>
</template>
