<script setup lang="ts">
import { computed } from 'vue';
import { ColorPickerCompact, provideColorPickerUi } from '@vean/aria/color-picker';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { colorPickerVariants } from '@/styles/color-picker';
import type { ColorPickerProps, ColorPickerEmits } from './types';

defineOptions({
  name: 'SColorPicker'
});

const props = withDefaults(defineProps<ColorPickerProps>(), {
  open: undefined,
  showArrow: true,
  showAlpha: true,
  showFields: true,
  showSwatches: true
});

const emit = defineEmits<ColorPickerEmits>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const ui = computed(() => colorPickerVariants({ size: props.size }, props.ui, { trigger: props.class }));

provideColorPickerUi(ui);
</script>

<template>
  <ColorPickerCompact v-bind="forwardedProps" v-on="listeners" />
</template>
