<script setup lang="ts">
import { nextTick, useAttrs } from 'vue';
import { refAutoReset } from '@vueuse/core';
import { isMouseEvent, isNullish } from '../../shared';
import { usePopperRootContext } from '../popper/context';
import { useForwardElement } from '../../composables';
import { Primitive } from '../primitive';
import { VisuallyHidden } from '../visually-hidden';
import { LINK_DISMISSED } from './shared';
import { useCollectionItem, useNavMenuItemContext, useNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuTriggerProps } from './types';

defineOptions({
  name: 'NavMenuTrigger',
  inheritAttrs: false
});

const props = withDefaults(defineProps<NavMenuTriggerProps>(), {
  as: 'button'
});

const attrs = useAttrs();

const {
  dir,
  orientation,
  disableClickTrigger,
  disableHoverTrigger,
  modelValue,
  pendingValue,
  wasEscapeCloseRef,
  onItemSelect,
  onItemDismiss
} = useNavMenuRootContext('NavMenuTrigger');
const {
  value,
  triggerId,
  contentId,
  open,
  dataState,
  onTriggerElementChange,
  setFocusProxyElement,
  onEntryKeyDown,
  onFocusProxyEnter
} = useNavMenuItemContext('NavMenuTrigger');

const cls = useNavMenuUi('trigger');

const popperContext = usePopperRootContext('NavMenuTrigger');

const { onItemElementChange } = useCollectionItem();
const [triggerElement, setTriggerElement] = useForwardElement(el => {
  onTriggerElementChange(el);
  onItemElementChange(el);
});

// A click shortly after a hover-open must confirm it instead of toggling the menu closed.
const hasPointerMoveOpenedRef = refAutoReset(false, 300);

const onPointerEnter = (event: PointerEvent) => {
  popperContext.onTriggerPointerInsideChange(true);

  if (props.disabled || disableHoverTrigger.value) return;
  if (!isMouseEvent(event)) return;

  wasEscapeCloseRef.value = false;

  if (modelValue.value) {
    // already open — switching triggers is instant (the shared machine stays open, so its
    // boolean `open` cannot re-route the value; set `modelValue` directly)
    onItemSelect(value);
  } else {
    // first open runs through the shared hover machine (open delay / skip-delay window)
    pendingValue.value = value;
    popperContext.onHoverOpen('trigger-hover');
  }
  hasPointerMoveOpenedRef.value = true;
};

const onPointerLeave = (event: PointerEvent) => {
  popperContext.onTriggerPointerInsideChange(false);

  if (props.disabled || disableHoverTrigger.value) return;
  if (!isMouseEvent(event)) return;

  // When a shared grace anchor (the nav) is registered, closing is owned by the viewport
  // corridor: leaving a single trigger must not close while the pointer can still be on
  // (or transit to) the shared surface.
  if (popperContext.graceTriggerElement.value) return;

  popperContext.onHoverClose('trigger-hover');
  hasPointerMoveOpenedRef.value = false;
};

const onClick = (event: PointerEvent) => {
  const matchEvent = isNullish(event.pointerType) || event.pointerType === 'mouse';

  if (matchEvent && disableClickTrigger.value) return;

  // if open via hover, we prevent the click from toggling it closed
  if (hasPointerMoveOpenedRef.value) return;

  // when the trigger renders a nested link as child, the link already dismissed the
  // menu on this click; skip toggling so the menu stays closed
  if ((event as unknown as Record<string, unknown>)[LINK_DISMISSED]) return;

  if (modelValue.value === value) {
    onItemDismiss();
  } else {
    pendingValue.value = value;
    onItemSelect(value);
  }
};

const onKeydown = (event: KeyboardEvent) => {
  const verticalEntryKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const entryKey = { horizontal: 'ArrowDown', vertical: verticalEntryKey }[orientation.value];

  // Mirror menubar: the entry key (down in horizontal, toward-the-flyout in vertical) opens
  // the flyout — idempotent when already open — and moves focus to the first content item,
  // instead of moving between triggers. The item's arrow navigation is restricted to the
  // orientation axis, so it never navigates on the entry key.
  if (event.key === entryKey) {
    pendingValue.value = value;
    onItemSelect(value);
    nextTick(() => onEntryKeyDown());
    event.preventDefault();
    event.stopPropagation();
  }
};

const onVisuallyHiddenFocus = (event: FocusEvent) => {
  const contentElement = document.getElementById(contentId);
  const prevFocusedElement = event.relatedTarget as HTMLElement | null;

  const wasTriggerFocused = prevFocusedElement === triggerElement.value;
  const wasFocusFromContent = contentElement?.contains(prevFocusedElement);

  if (wasTriggerFocused || !wasFocusFromContent) {
    onFocusProxyEnter(wasTriggerFocused ? 'start' : 'end');
  }
};
</script>

<template>
  <Primitive
    v-bind="attrs"
    :id="triggerId"
    :ref="setTriggerElement"
    :as="as"
    :as-child="asChild"
    data-vean-nav-menu-trigger
    data-vean-collection-item
    :class="cls"
    :disabled="disabled"
    :data-disabled="disabled ? '' : undefined"
    :data-state="dataState"
    aria-haspopup="menu"
    :aria-expanded="open"
    :aria-controls="contentId"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </Primitive>

  <template v-if="open">
    <VisuallyHidden :ref="setFocusProxyElement" aria-hidden="true" :tabindex="0" @focus="onVisuallyHiddenFocus" />
  </template>
</template>
