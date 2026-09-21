<script setup lang="ts">
import { watch, watchPostEffect, onWatcherCleanup } from 'vue';
import { getActiveElement } from '../../shared';
import { MENU_POPUP_DATA_ATTRIBUTE } from '../menu/shared';
import { TREE_NAV_DATA_ATTRIBUTE } from '../tree-nav/shared';
import { useMenuContext } from '../menu/context';
import { useForwardListeners } from '../../composables';
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../../types';
import { MenuContent } from '../menu';
import { useDropdownMenuRootContext } from './context';
import type { DropdownMenuContentProps, DropdownMenuContentEmits } from './types';

defineOptions({
  name: 'DropdownMenuContent'
});

const props = withDefaults(defineProps<DropdownMenuContentProps>(), {
  sideOffset: 8,
  sideFlip: true,
  alignFlip: true,
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<DropdownMenuContentEmits>();

const listeners = useForwardListeners(emit);

const { open, triggerElement, popupElement } = useMenuContext('DropdownMenuContent');
const { modal, hoverable } = useDropdownMenuRootContext('DropdownMenuContent');

function close() {
  open.value = false;
}

// Whether focus has already settled somewhere else than this popup's own
// surface — another popup or a TreeNav trigger — meaning a keyboard switch
// (menubar-style arrow navigation) is in progress and focus must be left alone.
const isFocusSettledElsewhere = () => {
  const activeElement = getActiveElement();
  const activePopup = activeElement?.closest(`[${MENU_POPUP_DATA_ATTRIBUTE}]`);

  return Boolean(
    (activePopup && activePopup !== popupElement.value) || activeElement?.closest(TREE_NAV_DATA_ATTRIBUTE)
  );
};

// Close on scroll of any ancestor scroll container of the trigger (hover mode only).
watchPostEffect(() => {
  if (!hoverable.value || !open.value) return;

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target?.contains(triggerElement.value!)) {
      close();
    }
  };

  window.addEventListener('scroll', handleScroll);
  onWatcherCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

let hasInteractedOutsideRef = false;

// Click (non-modal) closes should still return focus to the trigger; the shell only refocuses
// for trapped/escape dismissals, so the transition open -> closed is watched here.
watch(open, (value, previousValue) => {
  if (previousValue !== true || value) return;
  if (hoverable.value || hasInteractedOutsideRef) return;

  setTimeout(() => {
    if (isFocusSettledElsewhere()) return;

    triggerElement.value?.focus();
  }, 0);
});

const onCloseAutoFocus = (event: Event) => {
  if (event.defaultPrevented || hoverable.value || hasInteractedOutsideRef) return;

  setTimeout(() => {
    if (isFocusSettledElsewhere()) return;

    triggerElement.value?.focus();
  }, 0);

  hasInteractedOutsideRef = false;

  // Always prevent auto focus because we either focus manually or want user agent focus
  event.preventDefault();
};

const onInteractOutside = (event: PointerDownOutsideEvent | FocusOutsideEvent) => {
  if (event.defaultPrevented) return;

  const originalEvent = event.detail.originalEvent as PointerEvent;
  const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
  const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

  if (!modal.value || isRightClick) {
    hasInteractedOutsideRef = true;
  }
};
</script>

<template>
  <MenuContent
    v-bind="props"
    data-vean-dropdown-menu-content
    v-on="listeners"
    @close-auto-focus="onCloseAutoFocus"
    @interact-outside="onInteractOutside"
  >
    <slot />
  </MenuContent>
</template>
