<script setup lang="ts">
import { computed } from 'vue';
import { ColorSliderCompact, provideColorSliderUi } from '@vean/aria/color-slider';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { sliderVariants } from '@/styles/slider';
import type { ColorSliderProps, ColorSliderEmits } from './types';

defineOptions({
  name: 'SColorSlider'
});

const props = withDefaults(defineProps<ColorSliderProps>(), {
  color: 'primary',
  size: 'md'
});

const emit = defineEmits<ColorSliderEmits>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const ui = computed(() => sliderVariants({ color: props.color, size: props.size }, props.ui, { root: props.class }));

provideColorSliderUi(ui);
</script>

<template>
  <ColorSliderCompact v-bind="forwardedProps" v-on="listeners" />
</template>
