<script setup lang="ts">
import { ListboxContent } from '../listbox';
import type { ComboboxViewportProps } from './types';

defineOptions({
  name: 'ComboboxViewport'
});

defineProps<ComboboxViewportProps>();
</script>

<template>
  <ListboxContent data-vean-combobox-viewport>
    <slot />
  </ListboxContent>
</template>
