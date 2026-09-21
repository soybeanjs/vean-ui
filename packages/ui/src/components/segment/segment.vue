<script setup lang="ts" generic="T extends SegmentOptionData = SegmentOptionData">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { provideSegmentUi, SegmentCompact } from '@vean/aria/segment';
import { segmentVariants } from '@/styles/segment';
import type { SegmentProps, SegmentEmits, SegmentSlots, SegmentOptionData } from './types';

defineOptions({
  name: 'SSegment'
});

const props = withDefaults(defineProps<SegmentProps<T>>(), {
  modelValue: undefined,
  unmountOnHide: true,
  loop: true,
  fill: 'auto',
  enableIndicator: true
});

const emit = defineEmits<SegmentEmits<T['value']>>();

defineSlots<SegmentSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'fill', 'shape']);

const listeners = useForwardListeners(emit);

const ui = computed(() =>
  segmentVariants(
    {
      size: props.size,
      orientation: props.orientation,
      shape: props.shape,
      fill: props.fill,
      enableIndicator: props.enableIndicator
    },
    props.ui,
    { root: props.class }
  )
);

provideSegmentUi(ui);
</script>

<template>
  <SegmentCompact v-bind="forwardedProps" v-on="listeners">
    <template #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
    <template #indicator>
      <slot name="indicator" />
    </template>
  </SegmentCompact>
</template>
