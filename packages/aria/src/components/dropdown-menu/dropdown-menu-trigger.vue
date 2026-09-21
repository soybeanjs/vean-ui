<script setup lang="ts">
import { computed } from 'vue';
import { useMenuContext } from '../menu/context';
import { usePopperRootContext } from '../popper/context';
import { PopperTrigger } from '../popper';
import type { PopperTriggerType } from '../popper/types';
import { useDropdownMenuRootContext } from './context';
import type { DropdownMenuTriggerProps } from './types';

defineOptions({
  name: 'DropdownMenuTrigger'
});

const props = withDefaults(defineProps<DropdownMenuTriggerProps>(), {
  as: 'button'
});

const { open, popupElement, popupId, triggerId, initTriggerId } = useMenuContext('DropdownMenuTrigger');
const popperContext = usePopperRootContext('DropdownMenuTrigger');
const { hoverable, delayDuration, skipDelayDuration } = useDropdownMenuRootContext('DropdownMenuTrigger');

initTriggerId();

const triggerMode = computed<PopperTriggerType>(() => (hoverable.value ? 'hover' : 'click'));

// ArrowDown opens the menu, or moves focus into it while it is already open
// (menubar semantics: switching keeps focus on the trigger). Enter/Space toggle
// through the native button click the shell handles.
function onKeyDown(event: KeyboardEvent) {
  if (props.disabled) return;
  if (event.key !== 'ArrowDown') return;

  if (open.value) {
    popupElement.value?.focus({ preventScroll: true });
  } else {
    popperContext.onOpenChange(true, 'trigger-click');
  }
  // prevent keydown from scrolling window / first focused item to execute
  // that keydown (inadvertently closing the menu)
  event.preventDefault();
}

// Hover-mode dropdowns close on trigger blur without opening on focus — unless
// focus moved into the popup itself (keyboard opens hand focus to the first
// menu item, which must not close the popup again).
function onBlurClose(event: FocusEvent) {
  if (props.disabled || !hoverable.value) return;

  const relatedTarget = event.relatedTarget as HTMLElement | null;

  // The popup id is only assigned when the content mounts; a trigger whose
  // menu never opened has no popup to check (and nothing to keep open).
  if (popupId.value && relatedTarget?.closest(`#${popupId.value}`)) return;

  popperContext.onOpenChange(false, 'trigger-hover');
}
</script>

<template>
  <PopperTrigger
    v-bind="props"
    :id="triggerId"
    :trigger="triggerMode"
    :open-delay="delayDuration"
    :skip-delay-duration="skipDelayDuration"
    :open-on-focus="false"
    :aria-controls="popperContext.open ? popupId : undefined"
    aria-haspopup="menu"
    data-vean-dropdown-menu-trigger
    @keydown="onKeyDown"
    @blur="onBlurClose"
  >
    <slot />
  </PopperTrigger>
</template>
