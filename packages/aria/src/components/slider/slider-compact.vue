<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import SliderRange from './slider-range.vue';
import SliderRoot from './slider-root.vue';
import SliderThumb from './slider-thumb.vue';
import SliderTrack from './slider-track.vue';
import type { SliderCompactProps, SliderCompactEmits, SliderCompactSlots } from './types';

defineOptions({
  name: 'SliderCompact'
});

const props = defineProps<SliderCompactProps>();

const emit = defineEmits<SliderCompactEmits>();

defineSlots<SliderCompactSlots>();

const forwardedProps = useOmitProps(props, ['trackProps', 'rangeProps', 'thumbProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <SliderRoot v-slot="{ modelValue }" v-bind="forwardedProps" v-on="listeners">
    <SliderTrack v-bind="trackProps">
      <SliderRange v-bind="rangeProps" />
    </SliderTrack>
    <SliderThumb v-for="(value, index) in modelValue" :key="index" v-bind="thumbProps" :index="index">
      <slot :index="index" :model-value="modelValue" :value="value" />
    </SliderThumb>
  </SliderRoot>
</template>
