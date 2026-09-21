<script setup lang="ts">
import { ListboxItemIndicator } from '../listbox';
import type { ComboboxItemIndicatorProps } from './types';

defineOptions({
  name: 'ComboboxItemIndicator'
});

const props = defineProps<ComboboxItemIndicatorProps>();
</script>

<template>
  <ListboxItemIndicator v-bind="props" data-vean-combobox-item-indicator>
    <slot />
  </ListboxItemIndicator>
</template>
