<script setup lang="ts">
import { computed, onBeforeUnmount, watchPostEffect } from 'vue';
import { useForwardElement, useGraceArea } from '../../composables';
import { createPopperPositionerDefaultProps } from './shared';
import { providePopperPositionerContext, usePopperRootContext, usePopperUi } from './context';
import type { PopperPositionerProps, PopperPositionerEmits } from './types';
import { usePopperDismiss } from './use-popper-dismiss';
import { usePopperPositioning } from './use-popper-positioning';

defineOptions({
  name: 'PopperPositionerImpl'
});

const props = withDefaults(defineProps<PopperPositionerProps>(), createPopperPositionerDefaultProps());

const emit = defineEmits<PopperPositionerEmits>();

const cls = usePopperUi('positioner');

const context = usePopperRootContext('PopperPositionerImpl');
const {
  dataState,
  popupElement,
  triggerElement,
  graceTriggerElement,
  triggerType,
  isPointerInTransit,
  anchorElement,
  onPositionerElementChange,
  onPositionerUpdateChange
} = context;
const [positionerElement, setPositionerElement] = useForwardElement(onPositionerElementChange);
const [arrowElement, setArrowElement] = useForwardElement();

const referenceElement = computed(() => props.reference ?? anchorElement.value);

const { isPositioned, update, placedSide, placedAlign, arrowX, arrowY, hideArrow, positionerStyle } =
  usePopperPositioning({
    props,
    referenceElement,
    positionerElement,
    arrowElement,
    open: () => context.open.value,
    popupElement
  });

// Expose manual repositioning for stable virtual references (see `useVirtualPointReference`).
onPositionerUpdateChange(update);

providePopperPositionerContext({
  arrowX,
  arrowY,
  hideArrow,
  placedSide,
  placedAlign,
  isPositioned: computed(() => isPositioned.value),
  setArrowElement
});

// Grace polygons only matter for hover triggers; click / contextmenu layers close on outside
// interaction instead of pointer transit, so the polygon + pointer listeners are skipped.
// `disableHoverableContent` additionally disables the grace so leaving the trigger closes right away.
const graceDisabled = computed(() => triggerType.value !== 'hover' || Boolean(props.disableHoverableContent));

// Domains with a shared hover surface (e.g. a menubar container) override the grace anchor so
// the corridor spans the whole surface instead of the single trigger element.
const graceTrigger = computed(() => graceTriggerElement.value ?? triggerElement.value);

useGraceArea({
  triggerElement: graceTrigger,
  areaElement: positionerElement,
  disabled: graceDisabled,
  subAreaAttribute: 'data-popper-sub-popup',
  onPointerInTransitChange: value => {
    isPointerInTransit.value = value;
  },
  onSubAreaEnter: () => {
    context.cancelHoverClose();
  },
  onPointerExit: () => {
    if (triggerType.value === 'hover') {
      context.onHoverClose('trigger-hover');
    }
    props.onGracePointerExit?.();
  }
});

const { pointerEvents, onPointerdownCapture, onFocusCapture, onBlurCapture, onKeydown } = usePopperDismiss({
  layerElement: positionerElement,
  context,
  trapFocus: () => props.trapFocus ?? context.modal.value,
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
  onOpenAutoFocus: event => {
    emit('openAutoFocus', event);
  },
  onCloseAutoFocus: event => {
    emit('closeAutoFocus', event);
  }
});

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === 'touch') return;
  context.onPopupPointerInsideChange(true);
  context.cancelHoverClose();
}

function onPointerLeave(event: PointerEvent) {
  if (event.pointerType === 'touch') return;
  context.onPopupPointerInsideChange(false);

  if (triggerType.value === 'hover') {
    context.onHoverClose('trigger-hover');
  }
}

watchPostEffect(() => {
  if (isPositioned.value) {
    emit('placed');
  }
});

watchPostEffect(() => {
  if (!popupElement.value) return;

  if (pointerEvents.value) {
    popupElement.value.style.pointerEvents = pointerEvents.value;
    return;
  }

  popupElement.value.style.removeProperty('pointer-events');
});

onBeforeUnmount(() => {
  onPositionerUpdateChange(undefined);
  context.onPopupPointerInsideChange(false);
  context.onPositionerElementChange(undefined);
  isPointerInTransit.value = false;
});
</script>

<template>
  <div
    :ref="setPositionerElement"
    data-vean-popper-positioner-impl
    data-vean-popper-positioner
    :class="cls"
    :style="positionerStyle"
    :data-state="dataState"
    @focus.capture="onFocusCapture"
    @blur.capture="onBlurCapture"
    @pointerdown.capture="onPointerdownCapture"
    @keydown="onKeydown"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <slot />
  </div>
</template>
