<script setup lang="ts">
import { ComboboxTrigger } from '../combobox';
import type { AutocompleteTriggerProps } from './types';

defineOptions({
  name: 'AutocompleteTrigger'
});

const props = defineProps<AutocompleteTriggerProps>();
</script>

<template>
  <ComboboxTrigger v-slot="slotProps" v-bind="props" data-vean-autocomplete-trigger>
    <slot v-bind="slotProps" />
  </ComboboxTrigger>
</template>
