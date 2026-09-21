<script setup lang="ts">
import { computed, shallowRef, useId, watch } from 'vue';
import { wrapArray } from '../../shared';
import { provideMenuSubAttributeContext } from '../menu/context';
import { MenuRoot } from '../menu';
import { provideMenubarMenuContext, useMenubarCollectionContext, useMenubarRootContext } from './context';
import type { MenubarMenuProps } from './types';

defineOptions({
  name: 'MenubarMenu'
});

const props = defineProps<MenubarMenuProps>();

const { dir, onMenuClose, modelValue, loop, onMenuOpen } = useMenubarRootContext('MenubarMenu');
const { getOrderedItems } = useMenubarCollectionContext('MenubarMenu');

const generatedValue = `vean-menubar-menu-${useId()}`;
const menuValue = computed(() => props.value ?? generatedValue);

const triggerElement = shallowRef<HTMLElement>();
const contentId = shallowRef(`vean-menubar-content-${useId()}`);
const wasKeyboardTriggerOpen = shallowRef(false);

const open = computed(() => modelValue.value === menuValue.value);
const triggerId = `vean-menubar-trigger-${useId()}`;

// Opens are driven either by the trigger (click switching / keyboard) or by the Popper
// hover machine in hover mode; both funnel through the shared model value so only one menu
// is open at a time.
const onOpenChange = (isOpen: boolean) => {
  if (isOpen) {
    onMenuOpen(menuValue.value);
  } else {
    onMenuClose();
  }
};

const onContentArrowNavigation = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  const nextKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

  if (event.key !== nextKey) return;
  if (target.hasAttribute('data-vean-menubar-sub-trigger')) return;

  const candidateValues = getOrderedItems().map(item => item.data.value);

  const currentIndex = candidateValues.findIndex(v => v === modelValue.value);
  const nextValues = loop.value
    ? wrapArray(candidateValues, currentIndex + 1)
    : candidateValues.slice(currentIndex + 1);
  const nextValue = nextValues[0];

  if (!nextValue) return;

  onMenuOpen(nextValue);
};

watch(open, isOpen => {
  if (!isOpen) {
    wasKeyboardTriggerOpen.value = false;
  }
});

provideMenubarMenuContext({
  value: menuValue,
  triggerId,
  contentId,
  triggerElement,
  wasKeyboardTriggerOpen,
  open
});

provideMenuSubAttributeContext({
  subTrigger: computed(() => ({
    'data-vean-menubar-sub-trigger': ''
  })),
  subContent: computed(() => ({ onKeydown: onContentArrowNavigation }))
});
</script>

<template>
  <MenuRoot :open="open" :dir="dir" :modal="false" @update:open="onOpenChange">
    <slot :open="open" :value="menuValue" />
  </MenuRoot>
</template>
