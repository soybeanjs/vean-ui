<script setup lang="ts">
import { ComboboxItemIndicator } from '../combobox';
import type { AutocompleteItemIndicatorProps } from './types';

defineOptions({
  name: 'AutocompleteItemIndicator'
});

const props = defineProps<AutocompleteItemIndicatorProps>();
</script>

<template>
  <ComboboxItemIndicator v-bind="props" data-vean-autocomplete-item-indicator>
    <slot />
  </ComboboxItemIndicator>
</template>
