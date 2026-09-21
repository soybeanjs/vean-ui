<script setup lang="ts">
import { useOmitProps } from '../../composables';
import ColorSwatchChecker from './color-swatch-checker.vue';
import ColorSwatchFill from './color-swatch-fill.vue';
import ColorSwatchRoot from './color-swatch-root.vue';
import type { ColorSwatchCompactProps, ColorSwatchCompactSlots } from './types';

defineOptions({
  name: 'ColorSwatchCompact'
});

const props = defineProps<ColorSwatchCompactProps>();

defineSlots<ColorSwatchCompactSlots>();

const forwardedProps = useOmitProps(props, ['checkerProps', 'fillProps']);
</script>

<template>
  <ColorSwatchRoot v-slot="slotProps" v-bind="forwardedProps">
    <ColorSwatchChecker v-bind="checkerProps" />
    <ColorSwatchFill v-bind="fillProps" />
    <slot v-bind="slotProps" />
  </ColorSwatchRoot>
</template>
