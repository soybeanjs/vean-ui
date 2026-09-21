<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watchEffect } from 'vue';
import { wrapArray } from '../../shared';
import { usePopperRootContext } from '../popper/context';
import { useForwardListeners } from '../../composables';
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../../types';
import { MenuContent } from '../menu';
import { isTriggerLink } from './shared';
import { useMenubarCollectionContext, useMenubarMenuContext, useMenubarRootContext } from './context';
import type { MenubarContentProps, MenubarContentEmits } from './types';

defineOptions({
  name: 'MenubarContent'
});

const props = withDefaults(defineProps<MenubarContentProps>(), {
  align: 'start',
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<MenubarContentEmits>();

const listeners = useForwardListeners(emit);

const { containerElement, getOrderedItems } = useMenubarCollectionContext('MenubarContent');

const { dir, isLinkTriggerHovered, loop, modelValue, onMenuOpen, setTriggerLink } =
  useMenubarRootContext('MenubarContent');
const { value, triggerId, contentId, triggerElement, wasKeyboardTriggerOpen } = useMenubarMenuContext('MenubarContent');

const popperContext = usePopperRootContext('MenubarContent');

const hasInteractedOutside = shallowRef(false);

// In hover mode the Popper positioner's built-in grace area keeps the open menu alive while
// the pointer moves between the menubar and the content. The grace anchor is overridden to the
// whole menubar container so the corridor spans every trigger, not just the open one; leaving
// the shared surface closes the menu through the grace area exit.
// Submenu popups (`data-popper-sub-popup`, teleported to body) count as valid hover
// targets so moving into one does not close the menu.
// While the override is active the trigger hover machines defer closing to this shared
// surface, so it must not be registered when the grace area is disabled
// (`disableHoverableContent`) — then leaving a trigger closes right away instead.
watchEffect(() => {
  popperContext.onGraceTriggerElementChange(props.disableHoverableContent ? undefined : containerElement.value);
});

onBeforeUnmount(() => {
  popperContext.onGraceTriggerElementChange(undefined);
});

const onCloseAutoFocus = (event: Event) => {
  if (!modelValue.value && !hasInteractedOutside.value && !isLinkTriggerHovered.value) {
    triggerElement.value?.focus();
  }

  hasInteractedOutside.value = false;
  event.preventDefault();
};

const isMenubarTriggerTarget = (target: HTMLElement) => getOrderedItems().some(item => item.element.contains(target));

// Pointer-down and focus on menubar triggers are menu-switching interactions,
// not outside dismissals — the trigger decides whether to switch, toggle, or
// keep the menu open.
const onPointerDownOutside = (event: PointerDownOutsideEvent) => {
  if (isMenubarTriggerTarget(event.target as HTMLElement)) {
    event.preventDefault();
  }
};

const onFocusOutside = (event: FocusOutsideEvent) => {
  if (isMenubarTriggerTarget(event.target as HTMLElement)) {
    event.preventDefault();
  }
};

const onInteractOutside = () => {
  hasInteractedOutside.value = true;
};

const onEntryFocus = (event: Event) => {
  if (!wasKeyboardTriggerOpen.value) {
    event.preventDefault();
  }
};

const onArrowNavigation = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  const targetIsSubTrigger = target.hasAttribute('data-vean-menubar-sub-trigger');

  const previousKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const isPreviousKey = event.key === previousKey;

  if (!isPreviousKey && targetIsSubTrigger) return;

  const orderedItems = getOrderedItems();
  const candidateValues = orderedItems.map(item => item.data.value);

  if (isPreviousKey) {
    candidateValues.reverse();
  }

  const currentIndex = candidateValues.findIndex(v => v === value.value);
  const nextValues = loop.value
    ? wrapArray(candidateValues, currentIndex + 1)
    : candidateValues.slice(currentIndex + 1);
  const nextValue = nextValues[0];
  const nextItem = orderedItems.find(item => item.data.value === nextValue);

  if (!nextValue || !nextItem) return;

  if (!isTriggerLink(nextItem.element)) {
    onMenuOpen(nextValue);
  } else {
    setTriggerLink();
    nextItem.element.focus();
  }
};
</script>

<template>
  <MenuContent
    v-bind="props"
    :id="contentId"
    data-vean-menubar-content
    :aria-labelledby="triggerId"
    v-on="listeners"
    @close-auto-focus="onCloseAutoFocus"
    @pointer-down-outside="onPointerDownOutside"
    @focus-outside="onFocusOutside"
    @interact-outside="onInteractOutside"
    @entry-focus="onEntryFocus"
    @keydown.arrow-right.arrow-left="onArrowNavigation"
  >
    <slot />
  </MenuContent>
</template>
