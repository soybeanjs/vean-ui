<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  DEFAULT_PROGRESS_CIRCLE_STROKE_WIDTH,
  getProgressCircleDasharray,
  getProgressCircleDashoffset,
  getProgressCircleRadius,
  getValidProgressCircleStrokeWidth,
  PROGRESS_CIRCLE_CENTER,
  PROGRESS_CIRCLE_VIEWBOX_SIZE
} from './shared';
import { useProgressRootContext, useProgressUi } from './context';
import type { ProgressCircleSvgProps } from './types';

defineOptions({
  name: 'ProgressCircleSvg',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ProgressCircleSvgProps>(), {
  strokeWidth: DEFAULT_PROGRESS_CIRCLE_STROKE_WIDTH
});

const attrs = useAttrs();

const circleCls = useProgressUi('circleSvg');
const trackCls = useProgressUi('track');
const indicatorCls = useProgressUi('indicator');

const { max, modelValue, progressState, valuePercent } = useProgressRootContext('ProgressCircleSvg');

const strokeWidth = computed(() => getValidProgressCircleStrokeWidth(props.strokeWidth));

const radius = computed(() => getProgressCircleRadius(strokeWidth.value));

const circumference = computed(() => 2 * Math.PI * radius.value);
</script>

<template>
  <svg
    v-bind="attrs"
    data-vean-progress-circle-svg
    fill="none"
    :class="circleCls"
    :viewBox="`0 0 ${PROGRESS_CIRCLE_VIEWBOX_SIZE} ${PROGRESS_CIRCLE_VIEWBOX_SIZE}`"
    aria-hidden="true"
  >
    <circle
      :cx="PROGRESS_CIRCLE_CENTER"
      :cy="PROGRESS_CIRCLE_CENTER"
      :r="radius"
      :stroke-width="strokeWidth"
      :class="trackCls"
      data-vean-progress-track
    />
    <circle
      :cx="PROGRESS_CIRCLE_CENTER"
      :cy="PROGRESS_CIRCLE_CENTER"
      :r="radius"
      :stroke-width="strokeWidth"
      :stroke-dasharray="getProgressCircleDasharray(circumference, progressState)"
      :stroke-dashoffset="getProgressCircleDashoffset(valuePercent, circumference, progressState)"
      :data-state="progressState"
      :data-value="modelValue ?? undefined"
      :data-max="max"
      :class="indicatorCls"
      data-vean-progress-indicator
      stroke-linecap="round"
      :transform="`rotate(-90 ${PROGRESS_CIRCLE_CENTER} ${PROGRESS_CIRCLE_CENTER})`"
    />
  </svg>
  <slot :model-value="modelValue" :max="max" :progress-state="progressState" :value-percent="valuePercent" />
</template>
