<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { useDraggable } from '@vueuse/core';
import { getActiveElement } from '../../shared';
import { useDismissableLayer, useFocusGuards, useFocusScope, useHideOthers, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogPopupImplProps, DialogPopupImplEmits } from './types';

defineOptions({
  name: 'DialogPopupImpl'
});

const props = defineProps<DialogPopupImplProps>();

const emit = defineEmits<DialogPopupImplEmits>();

const {
  dir,
  modal,
  isAlert,
  alertType,
  draggable,
  fullscreen,
  open,
  onOpenChange,
  setTriggerElement,
  popupElement,
  setPopupElement,
  headerElement,
  popupId,
  initPopupId,
  dataState,
  titleId,
  descriptionId,
  focusCancel
} = useDialogRootContext('DialogPopupImpl');

const { pointerEvents, onFocusCapture, onBlurCapture } = useDismissableLayer(popupElement, {
  disableOutsidePointerEvents: () => props.disableOutsidePointerEvents,
  // A closed (still exit-animating) popup must not dismiss the interaction that re-opens it.
  enable: () => Boolean(open.value),
  onEscapeKeyDown: event => {
    emit('escapeKeyDown', event);
  },
  onPointerDownOutside: event => {
    emit('pointerDownOutside', event);
  },
  onFocusOutside: event => {
    emit('focusOutside', event);
  },
  onInteractOutside: event => {
    emit('interactOutside', event);
  },
  onDismiss: () => {
    onOpenChange(false);
  }
});

const { onKeydown } = useFocusScope(popupElement, {
  trapped: () => props.trapFocus,
  loop: true,
  onOpenAutoFocus: event => {
    if (isAlert.value) {
      focusCancel();
    }

    emit('openAutoFocus', event);
  },
  onCloseAutoFocus: event => {
    emit('closeAutoFocus', event);
  }
});

const forwardedProps = useOmitProps(props, ['trapFocus', 'disableOutsidePointerEvents']);

const cls = useDialogUi('popup');

// Draggable behavior: the popup is moved by dragging its header. The offset is
// derived from raw pointer deltas and added on top of the offset captured at
// drag start, so consecutive drags accumulate instead of resetting. It is
// applied as the CSS `translate` property so it composes with the centering
// `transform` utilities injected by the UI layer.
const offset = shallowRef({ x: 0, y: 0 });
const dragStartPointer = shallowRef({ x: 0, y: 0 });
const dragStartOffset = shallowRef({ x: 0, y: 0 });

const { isDragging } = useDraggable(popupElement, {
  handle: headerElement,
  disabled: computed(() => !draggable.value || fullscreen.value === true || !headerElement.value),
  onStart: (_position, event) => {
    dragStartPointer.value = { x: event.clientX, y: event.clientY };
    dragStartOffset.value = { ...offset.value };
  },
  onMove: (_position, event) => {
    offset.value = {
      x: dragStartOffset.value.x + event.clientX - dragStartPointer.value.x,
      y: dragStartOffset.value.y + event.clientY - dragStartPointer.value.y
    };
  }
});

watch(fullscreen, value => {
  if (value) {
    offset.value = { x: 0, y: 0 };
  }
});

const style = computed<CSSProperties>(() => {
  const { x: dx, y: dy } = offset.value;

  return {
    pointerEvents: pointerEvents.value,
    translate: dx !== 0 || dy !== 0 ? `${dx}px ${dy}px` : undefined
  };
});

const preserveTriggerElement = () => {
  const activeElement = getActiveElement();

  // Preserve the `DialogTrigger` element in case it was triggered programmatically
  if (activeElement !== document.body) {
    setTriggerElement(activeElement);
  }
};

// Make sure the whole tree has focus guards as our `Dialog` will be
// the last element in the DOM (because of the `Portal`)
useFocusGuards();
// Only a full modal hides the rest of the tree; the `'trap-focus'` tier keeps
// outside content reachable by pointer and assistive technology.
useHideOthers(
  popupElement,
  computed(() => modal.value === true)
);
initPopupId();
onMounted(() => {
  preserveTriggerElement();
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :id="popupId"
    :ref="setPopupElement"
    :class="cls"
    :dir="dir"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    data-dismissable-layer
    :data-state="dataState"
    :data-type="isAlert ? alertType : undefined"
    :data-fullscreen="fullscreen ? '' : undefined"
    :data-dragging="isDragging ? '' : undefined"
    :role="isAlert ? 'alertdialog' : 'dialog'"
    :aria-live="isAlert ? (alertType === 'error' ? 'assertive' : 'polite') : undefined"
    tabindex="-1"
    :style="style"
    @focus.capture="onFocusCapture"
    @blur.capture="onBlurCapture"
    @keydown="onKeydown"
  >
    <slot />
  </Primitive>
</template>
