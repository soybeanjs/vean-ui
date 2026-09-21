<script setup lang="ts">
import { computed, onBeforeUnmount, useId } from 'vue';
import { getActiveElement, getTabbableCandidates, removeFromTabOrder, tryFocusFirst } from '../../shared';
import { useArrowNavigation } from '../../composables';
import type { Align } from '../../types';
import { createContentId, createTriggerId } from './shared';
import { provideNavMenuItemContext, useCollectionContext, useNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuItemProps } from './types';

defineOptions({
  name: 'NavMenuItem'
});

const props = defineProps<NavMenuItemProps>();

const { baseId, modelValue, orientation, onItemDismiss, addValue, removeValue } = useNavMenuRootContext('NavMenuItem');
const { getOrderedElements } = useCollectionContext('NavMenuItem');

const ui = useNavMenuUi();

const cls = computed(() => ui.value?.item);

const value = props.value ?? useId();

const contentId = createContentId(baseId, value);
const triggerId = createTriggerId(baseId, value);

let restoreContentTabOrder: () => void = () => ({});

const onContentEntry = async (side: Exclude<Align, 'center'> = 'start') => {
  const el = document.getElementById(contentId);
  if (!el) return;

  restoreContentTabOrder();
  const candidates = getTabbableCandidates(el);
  if (candidates.length) {
    tryFocusFirst(side === 'start' ? candidates : candidates.slice().reverse());
  }
};

const onContentExit = () => {
  const el = document.getElementById(contentId);
  if (!el) return;

  const candidates = getTabbableCandidates(el);
  if (candidates.length) {
    restoreContentTabOrder = removeFromTabOrder(candidates);
  }
};

provideNavMenuItemContext({
  value,
  modelValue,
  contentId,
  triggerId,
  onEntryKeyDown: onContentEntry,
  onFocusProxyEnter: onContentEntry,
  onContentFocusOutside: onContentExit
});

const onClose = () => {
  onItemDismiss();
  const el = document.getElementById(triggerId);
  el?.focus();
};

const onKeydown = (event: KeyboardEvent) => {
  const currentFocus = getActiveElement();
  if (!currentFocus) return;

  if (event.key === 'Enter' || event.key === ' ') {
    if (modelValue.value === value) {
      onClose();
      event.preventDefault();
      return;
    }

    (event.target as HTMLElement).click();
    event.preventDefault();
    return;
  }

  const items = getOrderedElements().filter(el => el.parentElement?.hasAttribute('data-nav-menu-item'));

  // prevent triggering when the focus is on link
  if (!items.includes(currentFocus)) return;

  // Mirror menubar: arrows only move between triggers along the orientation axis (left/right
  // in horizontal, up/down in vertical). The entry key (down in horizontal) opens the flyout
  // instead of moving focus, so it must not navigate here.
  const newSelectedElement = useArrowNavigation(event, currentFocus, undefined, {
    itemsArray: items,
    loop: false,
    arrowKeyOptions: orientation.value === 'horizontal' ? 'horizontal' : 'vertical'
  });

  // only swallow the event when a focus move actually happened (skipped axes/entry keys are
  // left to the trigger's own keydown or the browser)
  if (newSelectedElement) {
    newSelectedElement.focus?.();
    event.preventDefault();
    event.stopPropagation();
  }
};

addValue(value);

onBeforeUnmount(() => {
  removeValue(value);
});
</script>

<template>
  <li data-vean-nav-menu-item :class="cls" data-nav-menu-item @keydown.up.down.left.right.home.end.space="onKeydown">
    <slot />
  </li>
</template>
