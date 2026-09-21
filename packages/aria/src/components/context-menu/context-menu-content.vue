<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import { useForwardListeners } from '../../composables';
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../../types';
import { MenuContent } from '../menu';
import type { ContextMenuContentProps, ContextMenuContentEmits } from './types';

defineOptions({
  name: 'ContextMenuContent'
});

const props = withDefaults(defineProps<ContextMenuContentProps>(), {
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<ContextMenuContentEmits>();

const listeners = useForwardListeners(emit);

const { modal, triggerElement } = usePopperRootContext('ContextMenuContent');

let hasInteractedOutside = false;

function onCloseAutoFocus(event: Event) {
  if (!event.defaultPrevented && hasInteractedOutside) {
    event.preventDefault();
  }
  hasInteractedOutside = false;
}

function onInteractOutside(event: PointerDownOutsideEvent | FocusOutsideEvent) {
  const originalEvent = event.detail.originalEvent as PointerEvent;
  const target = event.target as HTMLElement;
  // A right click is the gesture that opened the menu, so it repositions the open menu instead
  // of closing it. It counts anywhere inside the trigger: a real right click lands on the
  // trigger's inner content, not on the trigger node itself.
  if (originalEvent.button === 2 && triggerElement.value?.contains(target)) {
    event.preventDefault();
  }

  if (!event.defaultPrevented && !modal.value) {
    hasInteractedOutside = true;
  }
}
</script>

<template>
  <MenuContent
    v-bind="props"
    data-vean-context-menu-content
    side="right"
    :side-offset="2"
    align="start"
    v-on="listeners"
    @close-auto-focus="onCloseAutoFocus"
    @interact-outside="onInteractOutside"
  >
    <slot />
  </MenuContent>
</template>
