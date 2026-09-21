<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useComboboxRootContext, useComboboxUi } from './context';
import type { ComboboxEmptyProps } from './types';

defineOptions({
  name: 'ComboboxEmpty'
});

const props = defineProps<ComboboxEmptyProps>();

const cls = useComboboxUi('empty');

const { allItems, filterState, ignoreFilter } = useComboboxRootContext('ComboboxEmpty');

const visible = computed(() => {
  if (ignoreFilter.value) {
    return allItems.value.size === 0;
  }

  return filterState.value.count === 0;
});
</script>

<template>
  <Primitive v-if="visible" v-bind="props" data-vean-combobox-empty :class="cls">
    <slot />
  </Primitive>
</template>
