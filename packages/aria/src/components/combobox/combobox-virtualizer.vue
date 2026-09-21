<script setup lang="ts">
import { onUnmounted } from 'vue';
import { ListboxVirtualizer } from '../listbox';
import { useComboboxRootContext } from './context';
import type { ComboboxVirtualizerProps } from './types';

defineOptions({
  name: 'ComboboxVirtualizer'
});

const props = defineProps<ComboboxVirtualizerProps>();

const { isVirtual } = useComboboxRootContext('ComboboxVirtualizer');

isVirtual.value = true;

onUnmounted(() => {
  isVirtual.value = false;
});
</script>

<template>
  <ListboxVirtualizer v-slot="slotProps" v-bind="props" data-vean-combobox-virtualizer>
    <slot v-bind="slotProps" />
  </ListboxVirtualizer>
</template>
