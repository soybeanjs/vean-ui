<script setup lang="ts">
import { wrapArray } from '../../shared';
import { useForwardListeners } from '../../composables';
import { MenuSubContent } from '../menu';
import { useMenubarCollectionContext, useMenubarMenuContext, useMenubarRootContext } from './context';
import type { MenubarSubContentProps, MenubarSubContentEmits } from './types';

defineOptions({
  name: 'MenubarSubContent'
});

const props = defineProps<MenubarSubContentProps>();

const emit = defineEmits<MenubarSubContentEmits>();

const listeners = useForwardListeners(emit);

const { dir, loop, onMenuOpen } = useMenubarRootContext('MenubarSubContent');
const { value } = useMenubarMenuContext('MenubarSubContent');
const { getOrderedItems } = useMenubarCollectionContext('MenubarSubContent');

const onArrowNavigation = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  const nextKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

  if (event.key !== nextKey) return;
  if (target.hasAttribute('data-vean-menubar-sub-trigger')) return;

  const candidateValues = getOrderedItems().map(item => item.data.value);

  const currentIndex = candidateValues.findIndex(v => v === value.value);
  const nextValues = loop.value
    ? wrapArray(candidateValues, currentIndex + 1)
    : candidateValues.slice(currentIndex + 1);
  const nextValue = nextValues[0];

  if (!nextValue) return;

  onMenuOpen(nextValue);
};
</script>

<template>
  <MenuSubContent v-bind="props" data-vean-menubar-sub-content v-on="listeners" @keydown="onArrowNavigation">
    <slot />
  </MenuSubContent>
</template>
