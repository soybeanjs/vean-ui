<script setup lang="ts">
import { computed, shallowRef, useAttrs, watch, watchEffect } from 'vue';
import { usePopperRootContext } from '../popper/context';
import type { PointerDownOutsideEvent } from '../../types';
import { PopperArrow, PopperPopup, PopperPositioner } from '../popper';
import { useNavMenuRootContext } from './context';
import type { NavMenuViewportProps } from './types';

defineOptions({
  name: 'NavMenuViewport',
  inheritAttrs: false
});

const props = withDefaults(defineProps<NavMenuViewportProps>(), {
  align: 'start',
  sideOffset: 8
});

const attrs = useAttrs();

const { dir, orientation, open, setViewportElement, activeTriggerElement, onItemDismiss, wasEscapeCloseRef } =
  useNavMenuRootContext('NavMenuViewport');

const popperContext = usePopperRootContext('NavMenuViewport');

// The shared popup surface is what the active content teleports into.
watchEffect(() => {
  setViewportElement(popperContext.popupElement.value);
});

// A horizontal menu drops the viewport below the active trigger; a vertical menu opens to
// the side, flipping for RTL (the popup follows the reading direction).
const side = computed(() => {
  if (orientation.value === 'vertical') {
    return dir.value === 'rtl' ? 'left' : 'right';
  }
  return 'bottom';
});

// Floating UI aligns logically: in RTL `start` maps to the right edge, so no manual swap.
const align = computed(() => props.align);

// The shared positioner carries Floating UI's `transform`. A transform transition slides the
// viewport when the active trigger switches — but it must not animate the very first position
// (the popup plays its own `animate-in` on open). The positioner emits `placed` once its first
// position has been committed to the DOM (`isPositioned` flips true in a post-flush effect), so
// flagging the settled state here never animates the initial placement — only later movements.
// The transition class itself lives in the UI layer, gated on `data-nav-menu-settled`.
const hasPositioned = shallowRef(false);

const onPlaced = () => {
  requestAnimationFrame(() => {
    hasPositioned.value = true;
  });
};

// Reset on any open change so a fresh open starts transition-free; `placed` re-enables it.
watch(open, () => {
  hasPositioned.value = false;
});

const onEscapeKeyDown = (event: KeyboardEvent) => {
  // Own the escape close so focus returns to the active trigger and the hover machine
  // remembers not to immediately re-open.
  event.preventDefault();
  onItemDismiss();
  activeTriggerElement.value?.focus();
  wasEscapeCloseRef.value = true;
};

// Pointer-downs on nav triggers are menu-switching interactions, not outside dismissals:
// the trigger decides whether to switch, toggle or keep the menu open.
const onPointerDownOutside = (event: PointerDownOutsideEvent) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest('[data-vean-nav-menu-trigger]')) {
    event.preventDefault();
  }
};
</script>

<template>
  <PopperPositioner
    v-if="open || forceMount"
    :reference="activeTriggerElement"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    position-strategy="fixed"
    :data-settled="hasPositioned ? '' : undefined"
    data-vean-nav-menu-viewport
    @escape-key-down="onEscapeKeyDown"
    @pointer-down-outside="onPointerDownOutside"
    @placed="onPlaced"
  >
    <PopperPopup v-bind="attrs">
      <slot />
      <PopperArrow />
    </PopperPopup>
  </PopperPositioner>
</template>
