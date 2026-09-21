<script setup lang="ts">
import { Primitive } from '../primitive';
import { useCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangeHeadingProps } from './types';

defineOptions({
  name: 'CalendarRangeHeading'
});

defineProps<CalendarRangeHeadingProps>();

const cls = useCalendarRangeUi('heading');
const { disabled, headingValue } = useCalendarRangeRootContext('CalendarRangeHeading');
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-calendar-range-heading
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
  >
    <slot :heading-value="headingValue">{{ headingValue }}</slot>
  </Primitive>
</template>
