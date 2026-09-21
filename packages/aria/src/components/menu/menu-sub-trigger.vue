<script setup lang="ts">
import { nextTick, mergeProps, computed } from 'vue';
import { isMouseEvent } from '../../shared';
import { usePopperRootContext } from '../popper/context';
import { useForwardElement } from '../../composables';
import type { HorizontalSide } from '../../types';
import { PopperAnchor } from '../popper';
import { SUB_OPEN_KEYS } from './shared';
import {
  useMenuContentContext,
  useMenuContext,
  useMenuRootContext,
  useMenuUi,
  useMenuSubAttributeContext
} from './context';
import MenuItemImpl from './menu-item-impl.vue';
import type { MenuSubTriggerProps } from './types';

const props = defineProps<MenuSubTriggerProps>();

const { open, dataState, popupElement, popupId, triggerId, onTriggerElementChange, initTriggerId, onOpenChange } =
  useMenuContext('MenuSubTrigger');
const { dir } = useMenuRootContext('MenuSubTrigger');
const attrContext = useMenuSubAttributeContext();
const {
  pointerGraceTimer,
  searchRef,
  onPointerGraceIntentChange,
  resetPointerGraceIntent,
  onItemEnter,
  onTriggerLeave
} = useMenuContentContext('MenuSubTrigger');
// Register on both contexts: menu (grace polygon / close refocus) and Popper (dismiss refocus).
const popperContext = usePopperRootContext('MenuSubTrigger');
const [_, setSubTriggerElement] = useForwardElement(element => {
  onTriggerElementChange(element);
  popperContext.onTriggerElementChange(element);
});

const mergedProps = computed(() => mergeProps(props, { ...attrContext?.subTrigger?.value }));

const cls = useMenuUi('subTrigger');

let openTimer: number | null = null;

const clearOpenTimer = () => {
  if (openTimer) {
    window.clearTimeout(openTimer);
  }
  openTimer = null;
};

const onClick = (event: MouseEvent) => {
  if (props.disabled || event.defaultPrevented) return;
  /**
   * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons) and we rely heavily on
   * `onFocusOutside` for submenus to close when switching between separate submenus.
   */
  (event.currentTarget as HTMLElement).focus();
  if (!open.value) {
    onOpenChange(true);
  }
};

const onPointerMove = (event: PointerEvent) => {
  if (!isMouseEvent(event)) return;

  const defaultPrevented = onItemEnter(event);
  if (defaultPrevented) return;

  if (props.disabled || open.value || openTimer) return;

  resetPointerGraceIntent();
  openTimer = window.setTimeout(() => {
    onOpenChange(true);
    clearOpenTimer();
  }, 100);
};

const onPointerLeave = (event: PointerEvent) => {
  if (!isMouseEvent(event)) return;
  clearOpenTimer();

  const popupRect = popupElement.value?.getBoundingClientRect();
  if (popupRect?.width) {
    // make sure to update this when we change positioning logic
    const side = popupElement.value?.dataset.side as HorizontalSide;

    const rightSide = side === 'right';
    const bleed = rightSide ? -5 : +5;
    const contentNearEdge = popupRect[rightSide ? 'left' : 'right'];
    const contentFarEdge = popupRect[rightSide ? 'right' : 'left'];

    onPointerGraceIntentChange({
      area: [
        // Apply a bleed on clientX to ensure that our exit point is
        // consistently within polygon bounds
        { x: event.clientX + bleed, y: event.clientY },
        { x: contentNearEdge, y: popupRect.top },
        { x: contentFarEdge, y: popupRect.top },
        { x: contentFarEdge, y: popupRect.bottom },
        { x: contentNearEdge, y: popupRect.bottom }
      ],
      side
    });

    window.clearTimeout(pointerGraceTimer.value);
    pointerGraceTimer.value = window.setTimeout(() => onPointerGraceIntentChange(null), 300);
  } else {
    const defaultPrevented = onTriggerLeave(event);
    if (defaultPrevented) return;

    // There's 100ms where the user may leave an item before the submenu was opened.
    resetPointerGraceIntent();
  }
};

const onKeyDown = async (event: KeyboardEvent) => {
  if (props.disabled) return;

  const isTypingAhead = searchRef.value !== '';
  if (isTypingAhead && event.key === ' ') return;

  if (!SUB_OPEN_KEYS[dir.value].includes(event.key)) return;

  onOpenChange(true);

  await nextTick();
  // The trigger may hold focus if opened via pointer interaction
  // so we ensure content is given focus again when switching to keyboard.
  popupElement.value?.focus();
  // prevent window from scrolling
  event.preventDefault();
};

initTriggerId();
</script>

<template>
  <PopperAnchor as-child>
    <MenuItemImpl
      v-bind="mergedProps"
      :id="triggerId"
      :ref="setSubTriggerElement"
      data-vean-menu-sub-trigger
      :class="cls"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="popupId"
      :data-state="dataState"
      @click="onClick"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
      @keydown="onKeyDown"
    >
      <slot />
    </MenuItemImpl>
  </PopperAnchor>
</template>
