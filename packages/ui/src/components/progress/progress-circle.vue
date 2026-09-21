<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { ProgressCircleCompact, provideProgressUi } from '@vean/aria/progress';
import { progressCircleVariants } from '@/styles/progress';
import type { ProgressCircleProps, ProgressCircleEmits, ProgressCircleSlots } from './types';

defineOptions({
  name: 'SProgressCircle'
});

const props = defineProps<ProgressCircleProps>();

const emit = defineEmits<ProgressCircleEmits>();

const slots = defineSlots<ProgressCircleSlots>();

const forwardedProps = useOmitProps(props, ['class', 'color', 'size', 'ui', 'strokeWidth']);

const listeners = useForwardListeners(emit);

const ui = computed(() =>
  progressCircleVariants({ color: props.color, size: props.size }, props.ui, { root: props.class })
);

const hasDefaultSlot = computed(() => Boolean(slots.default));

provideProgressUi(ui);
</script>

<template>
  <ProgressCircleCompact v-bind="forwardedProps" v-on="listeners">
    <template v-if="hasDefaultSlot" #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ProgressCircleCompact>
</template>
