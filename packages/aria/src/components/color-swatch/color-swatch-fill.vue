<script setup lang="ts">
import { useColorSwatchUi } from './context';
import type { ColorSwatchFillProps } from './types';

defineOptions({
  name: 'ColorSwatchFill'
});

defineProps<ColorSwatchFillProps>();

const cls = useColorSwatchUi('fill');
</script>

<template>
  <span data-vean-color-swatch-fill :class="cls"></span>
</template>
