<script setup lang="ts">
import { ComboboxItem } from '../combobox';
import type { AutocompleteItemProps, AutocompleteItemEmits } from './types';

defineOptions({
  name: 'AutocompleteItem'
});

const props = defineProps<AutocompleteItemProps>();

const emit = defineEmits<AutocompleteItemEmits>();
</script>

<template>
  <ComboboxItem v-bind="props" data-vean-autocomplete-item @select="emit('select', $event)">
    <slot />
  </ComboboxItem>
</template>
