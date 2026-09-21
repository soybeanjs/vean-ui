<script setup lang="ts">
import { nextTick, useAttrs } from 'vue';
import { getTabbableCandidates, isMouseEvent, tryFocusFirst } from '../../shared';
import { usePopperRootContext } from '../popper/context';
import { useForwardElement } from '../../composables';
import { Primitive } from '../primitive';
import { useNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuSubTriggerProps } from './types';

defineOptions({
  name: 'NavMenuSubTrigger',
  inheritAttrs: false
});

const props = withDefaults(defineProps<NavMenuSubTriggerProps>(), {
  as: 'button'
});

const attrs = useAttrs();

const { dir, delayDuration, skipDelayDuration, disableHoverTrigger, disablePointerLeaveClose } =
  useNavMenuRootContext('NavMenuSubTrigger');

// Each nested flyout owns a nested Popper root (created by `PopperSub` in the compact).
// Its hover machine mirrors the root's timing so the two levels behave identically.
const popperContext = usePopperRootContext('NavMenuSubTrigger');

popperContext.configureTrigger({
  type: disableHoverTrigger.value ? 'click' : 'hover',
  openDelay: delayDuration.value,
  focusOpenDelay: 0,
  closeDelay: disablePointerLeaveClose.value ? 150 : 0,
  skipDelayDuration: skipDelayDuration.value,
  pressOpenDelay: 700,
  openOnFocus: false,
  disabled: false
});

const cls = useNavMenuUi('subTrigger');

const { open, dataState, popupId } = popperContext;

const [_, setTriggerAnchorRef] = useForwardElement(el => {
  popperContext.onTriggerElementChange(el);
  popperContext.onAnchorElementChange(el);
});

const onPointerEnter = (event: PointerEvent) => {
  popperContext.onTriggerPointerInsideChange(true);
  popperContext.cancelHoverClose();

  if (props.disabled || disableHoverTrigger.value) return;
  if (!isMouseEvent(event)) return;

  popperContext.onHoverOpen('trigger-hover');
};

const onPointerLeave = (event: PointerEvent) => {
  popperContext.onTriggerPointerInsideChange(false);

  if (props.disabled || disableHoverTrigger.value) return;
  if (!isMouseEvent(event)) return;

  popperContext.onHoverClose('trigger-hover');
};

const onClick = (event: PointerEvent) => {
  if (props.disabled) return;

  // Sub-trigger click only opens (menu semantics); closing is left to hover-leave,
  // Escape or an outside dismissal so a click never collapses an open flyout.
  if (open.value) return;

  popperContext.onOpenChange(true, 'trigger-click');
  // Keep the trigger from being focused/navigated by the click so the flyout can take focus.
  event.preventDefault();
};

const onKeydown = (event: KeyboardEvent) => {
  const openKey = dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const closeKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

  if (event.key === openKey) {
    popperContext.onOpenChange(true, 'imperative');
    nextTick(() => {
      const content = popperContext.popupElement.value;
      if (!content) return;
      const candidates = getTabbableCandidates(content);
      if (candidates.length) tryFocusFirst(candidates);
    });
    event.preventDefault();
    event.stopPropagation();
  } else if (event.key === closeKey && open.value) {
    popperContext.onOpenChange(false, 'imperative');
    popperContext.triggerElement.value?.focus();
    event.preventDefault();
    event.stopPropagation();
  }
};
</script>

<template>
  <Primitive
    v-bind="attrs"
    :ref="setTriggerAnchorRef"
    :as="as"
    :as-child="asChild"
    :class="cls"
    :disabled="disabled"
    :data-disabled="disabled ? '' : undefined"
    :data-state="dataState"
    aria-haspopup="menu"
    :aria-expanded="open"
    :aria-controls="popupId"
    data-vean-nav-menu-sub-trigger
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </Primitive>
</template>
