<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { getValuePercent } from './shared';
import { useProgressRootContext, useProgressUi } from './context';
import type { ProgressIndicatorProps } from './types';

defineOptions({
  name: 'ProgressIndicator'
});

defineProps<ProgressIndicatorProps>();

const cls = useProgressUi('indicator');

const { dir, max, modelValue, progressState, valuePercent } = useProgressRootContext('ProgressIndicator');

const style = computed(() => {
  const value = getValuePercent(valuePercent.value, dir.value);
  if (value === undefined) {
    return {};
  }

  return {
    '--progress-indicator-value': `${value}%`,
    transform: `translateX(${value}%)`
  };
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-progress-indicator
    :class="cls"
    :data-state="progressState"
    :data-value="modelValue ?? undefined"
    :data-max="max"
    :style="style"
  >
    <slot />
  </Primitive>
</template>
