<script setup lang="ts">
import { computed } from 'vue';
import { ColorSwatchCompact, provideColorSwatchUi } from '@vean/aria/color-swatch';
import { useOmitProps } from '@vean/aria/composables';
import { colorSwatchVariants } from '@/styles/color-swatch';
import type { ColorSwatchProps, ColorSwatchSlots } from './types';

defineOptions({
  name: 'SColorSwatch'
});

const props = defineProps<ColorSwatchProps>();

defineSlots<ColorSwatchSlots>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size', 'shape']);

const ui = computed(() =>
  colorSwatchVariants({ size: props.size, shape: props.shape }, props.ui, { root: props.class })
);

provideColorSwatchUi(ui);
</script>

<template>
  <ColorSwatchCompact v-slot="slotProps" v-bind="forwardedProps">
    <slot v-bind="slotProps" />
  </ColorSwatchCompact>
</template>
