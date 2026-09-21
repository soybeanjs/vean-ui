<script setup lang="ts">
import { Primitive } from '../primitive';
import { useSelectItemContext, useSelectUi } from './context';
import type { SelectItemIndicatorProps } from './types';

defineOptions({
  name: 'SelectItemIndicator'
});

withDefaults(defineProps<SelectItemIndicatorProps>(), {
  as: 'span'
});

const { isSelected } = useSelectItemContext('SelectItemIndicator');

const cls = useSelectUi('itemIndicator');
</script>

<template>
  <Primitive
    v-if="isSelected"
    data-vean-select-item-indicator
    :as="as"
    :as-child="asChild"
    :class="cls"
    aria-hidden="true"
  >
    <slot />
  </Primitive>
</template>
