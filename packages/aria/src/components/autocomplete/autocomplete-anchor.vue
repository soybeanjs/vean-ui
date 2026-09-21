<script setup lang="ts">
import { ComboboxAnchor } from '../combobox';
import type { AutocompleteAnchorProps } from './types';

defineOptions({
  name: 'AutocompleteAnchor'
});

const props = defineProps<AutocompleteAnchorProps>();
</script>

<template>
  <ComboboxAnchor v-bind="props" data-vean-autocomplete-anchor>
    <slot />
  </ComboboxAnchor>
</template>
