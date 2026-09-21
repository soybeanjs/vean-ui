<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useForwardListeners, useOmitProps, usePopupEvents, usePresence } from '../../composables';
import type { PointerDownOutsideEvent, FocusOutsideEvent } from '../../types';
import { useDialogRootContext } from './context';
import DialogPopupImpl from './dialog-popup-impl.vue';
import type { DialogPopupProps, DialogPopupEmits } from './types';

defineOptions({
  name: 'DialogPopup'
});

const props = defineProps<DialogPopupProps>();

const emit = defineEmits<DialogPopupEmits>();

const forwardedProps = useOmitProps(props, ['forceMount']);

const listeners = useForwardListeners(emit);

const { popupElement, open, modal, isAlert, triggerElement } = useDialogRootContext('DialogPopup');

const isPresent = props.forceMount ? shallowRef(true) : usePresence(popupElement, open);

// Modality tiers: `true` traps focus and blocks outside pointer events, `'trap-focus'`
// traps focus only, `false` is fully non-modal.
const trapFocus = computed(() => modal.value !== false && open.value);

const disableOutsidePointerEvents = computed(() => modal.value === true);

const { onFocusOutside, onInteractOutside, onCloseAutoFocus } = usePopupEvents({
  modal,
  triggerElement
});

const handlePointerDownOutside = (event: PointerDownOutsideEvent) => {
  // An alert dialog swallows every outside press so focus stays inside.
  if (isAlert.value) {
    event.preventDefault();
    return;
  }

  if (modal.value === false) return;

  const originalEvent = event.detail.originalEvent;
  const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;

  // If the event is a right-click, we shouldn't close because
  // it is effectively as if we right-clicked the `Overlay`.
  if (originalEvent.button === 2 || ctrlLeftClick) {
    event.preventDefault();
  }
};

const handleInteractOutside = (event: PointerDownOutsideEvent | FocusOutsideEvent) => {
  if (isAlert.value) {
    event.preventDefault();
  }

  onInteractOutside(event);
};
</script>

<template>
  <DialogPopupImpl
    v-if="isPresent"
    v-bind="forwardedProps"
    data-vean-dialog-popup
    :trap-focus="trapFocus"
    :disable-outside-pointer-events="disableOutsidePointerEvents"
    v-on="listeners"
    @pointer-down-outside="handlePointerDownOutside"
    @focus-outside="onFocusOutside"
    @interact-outside="handleInteractOutside"
    @close-auto-focus="onCloseAutoFocus"
  >
    <slot />
  </DialogPopupImpl>
</template>
