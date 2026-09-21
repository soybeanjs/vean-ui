<script setup lang="ts">
import { ListboxItemIndicator } from '../listbox';
import type { ColorSwatchPickerItemIndicatorProps } from './types';

defineOptions({
  name: 'ColorSwatchPickerItemIndicator'
});

defineProps<ColorSwatchPickerItemIndicatorProps>();
</script>

<template>
  <ListboxItemIndicator :as="as" :as-child="asChild" data-vean-color-swatch-picker-item-indicator>
    <slot />
  </ListboxItemIndicator>
</template>
