<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { provideListboxGroupContext, useListboxUi } from '../listbox/context';
import { useComboboxRootContext } from './context';
import type { ComboboxGroupProps } from './types';

defineOptions({
  name: 'ComboboxGroup'
});

defineProps<ComboboxGroupProps>();

const { id } = provideListboxGroupContext();
const { filterSearch, ignoreFilter, filterState, allGroups } = useComboboxRootContext('ComboboxGroup');
const cls = useListboxUi('group');

const visible = computed(() => {
  if (!filterSearch.value || ignoreFilter.value) {
    return true;
  }

  return filterState.value.groups.has(id);
});

onMounted(() => {
  if (!allGroups.value.has(id)) {
    const nextGroups = new Map(allGroups.value);

    nextGroups.set(id, new Set());
    allGroups.value = nextGroups;
  }
});

onUnmounted(() => {
  const nextGroups = new Map(allGroups.value);

  nextGroups.delete(id);
  allGroups.value = nextGroups;
});
</script>

<template>
  <div :aria-labelledby="id" role="group" data-vean-combobox-group :class="cls" :hidden="visible ? undefined : true">
    <slot />
  </div>
</template>
