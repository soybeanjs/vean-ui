<script setup lang="ts">
import { Primitive } from '../primitive';
import { useListboxItemContext, useListboxUi } from './context';
import type { ListboxItemIndicatorProps } from './types';

defineOptions({
  name: 'ListboxItemIndicator'
});

withDefaults(defineProps<ListboxItemIndicatorProps>(), {
  as: 'span'
});

const { isSelected } = useListboxItemContext('ListboxItemIndicator');

const cls = useListboxUi('itemIndicator');
</script>

<template>
  <Primitive
    v-if="isSelected"
    data-vean-listbox-item-indicator
    :as="as"
    :as-child="asChild"
    :class="cls"
    aria-hidden="true"
  >
    <slot />
  </Primitive>
</template>
