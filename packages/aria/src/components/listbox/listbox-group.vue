<script setup lang="ts">
import { provideListboxGroupContext, useListboxUi } from './context';
import type { ListboxGroupProps } from './types';

defineOptions({
  name: 'ListboxGroup'
});

defineProps<ListboxGroupProps>();

const { id } = provideListboxGroupContext();

const cls = useListboxUi('group');
</script>

<template>
  <div data-vean-listbox-group :aria-labelledby="id" role="group" :class="cls">
    <slot />
  </div>
</template>
