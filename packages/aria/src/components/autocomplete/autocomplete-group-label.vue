<script setup lang="ts">
import { ComboboxGroupLabel } from '../combobox';
import type { AutocompleteGroupLabelProps } from './types';

defineOptions({
  name: 'AutocompleteGroupLabel'
});

const props = defineProps<AutocompleteGroupLabelProps>();
</script>

<template>
  <ComboboxGroupLabel v-bind="props" data-vean-autocomplete-group-label>
    <slot />
  </ComboboxGroupLabel>
</template>
