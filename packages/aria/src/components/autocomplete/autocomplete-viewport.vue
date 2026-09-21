<script setup lang="ts">
import { ComboboxViewport } from '../combobox';
import type { AutocompleteViewportProps } from './types';

defineOptions({
  name: 'AutocompleteViewport'
});

const props = defineProps<AutocompleteViewportProps>();
</script>

<template>
  <ComboboxViewport v-bind="props" data-vean-autocomplete-viewport>
    <slot />
  </ComboboxViewport>
</template>
