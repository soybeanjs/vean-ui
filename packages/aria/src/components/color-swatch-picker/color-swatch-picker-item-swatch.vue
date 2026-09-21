<script setup lang="ts">
import ColorSwatchCompact from '../color-swatch/color-swatch-compact.vue';
import { useColorSwatchPickerItemContext } from './context';
import type { ColorSwatchPickerItemSwatchProps } from './types';

defineOptions({
  name: 'ColorSwatchPickerItemSwatch'
});

const props = defineProps<ColorSwatchPickerItemSwatchProps>();

const { color } = useColorSwatchPickerItemContext('ColorSwatchPickerItemSwatch');
</script>

<template>
  <ColorSwatchCompact v-bind="props" data-vean-color-swatch-picker-item-swatch :color="color">
    <slot />
  </ColorSwatchCompact>
</template>
