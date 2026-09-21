<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangeGridProps } from './types';

defineOptions({
  name: 'CalendarRangeGrid'
});

withDefaults(defineProps<CalendarRangeGridProps>(), {
  as: 'table'
});

const cls = useCalendarRangeUi('grid');
const { disabled, readonly } = useCalendarRangeRootContext('CalendarRangeGrid');

const disabledAttr = computed(() => (disabled.value ? true : undefined));
const readonlyAttr = computed(() => (readonly.value ? true : undefined));
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-calendar-range-grid
    :class="cls"
    :aria-disabled="disabledAttr"
    :aria-readonly="readonlyAttr"
    :data-disabled="disabledAttr ? '' : undefined"
    :data-readonly="readonlyAttr ? '' : undefined"
    role="application"
    tabindex="-1"
  >
    <slot />
  </Primitive>
</template>
