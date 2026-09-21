<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import { useProgressUi } from './context';
import ProgressCircle from './progress-circle-svg.vue';
import ProgressRoot from './progress-root.vue';
import type { ProgressCircleCompactProps, ProgressCircleCompactEmits, ProgressCircleCompactSlots } from './types';

defineOptions({
  name: 'ProgressCircleCompact'
});

const props = defineProps<ProgressCircleCompactProps>();

const emit = defineEmits<ProgressCircleCompactEmits>();

const slots = defineSlots<ProgressCircleCompactSlots>();

const forwardedProps = useOmitProps(props, ['strokeWidth', 'circleSvgProps']);

const listeners = useForwardListeners(emit);

const labelCls = useProgressUi('label');

const circleSvgProps = computed(() => ({
  ...props.circleSvgProps,
  strokeWidth: props.strokeWidth ?? props.circleSvgProps?.strokeWidth
}));
</script>

<template>
  <ProgressRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <ProgressCircle v-bind="circleSvgProps" />
    <div v-if="slots.default" :class="labelCls" data-vean-progress-label>
      <slot v-bind="slotProps" />
    </div>
  </ProgressRoot>
</template>
