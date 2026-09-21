<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useCalendarRootContext, useCalendarUi } from './context';
import type { CalendarGridProps } from './types';

defineOptions({
  name: 'CalendarGrid'
});

withDefaults(defineProps<CalendarGridProps>(), {
  as: 'table'
});

const cls = useCalendarUi('grid');
const { disabled, readonly } = useCalendarRootContext('CalendarGrid');

const disabledAttr = computed(() => (disabled.value ? true : undefined));
const readonlyAttr = computed(() => (readonly.value ? true : undefined));
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-calendar-grid
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
