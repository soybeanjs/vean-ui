<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, shallowRef, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';
import { getTabbableCandidates, removeFromTabOrder } from '../../shared';
import { popperCssVars } from '../popper/shared';
import { usePopperRootContext } from '../popper/context';
import { PopperPopup } from '../popper';
import { hoverCardCssVars } from './shared';
import { useHoverCardRootContext } from './context';
import type { HoverCardPopupProps } from './types';

defineOptions({
  name: 'HoverCardPopup'
});

defineProps<HoverCardPopupProps>();

const { hasSelectionRef, isPointerDownOnPopupRef } = useHoverCardRootContext('HoverCardPopup');
const { dataState, popupElement, triggerElement, onOpenChange } = usePopperRootContext('HoverCardPopup');

const containSelection = shallowRef(false);

const cssVarsStyle: CSSProperties = {
  [hoverCardCssVars.transformOrigin]: `var(${popperCssVars.transformOrigin})`,
  [hoverCardCssVars.availableWidth]: `var(${popperCssVars.availableWidth})`,
  [hoverCardCssVars.availableHeight]: `var(${popperCssVars.availableHeight})`,
  [hoverCardCssVars.anchorWidth]: `var(${popperCssVars.anchorWidth})`,
  [hoverCardCssVars.anchorHeight]: `var(${popperCssVars.anchorHeight})`
};

const onPointerDown = (event: PointerEvent) => {
  if ((event.currentTarget as HTMLElement).contains(event.target as HTMLElement)) {
    containSelection.value = true;
  }

  hasSelectionRef.value = false;
  isPointerDownOnPopupRef.value = true;
};

const onPointerUp = () => {
  containSelection.value = false;
  isPointerDownOnPopupRef.value = false;

  nextTick(() => {
    hasSelectionRef.value = document.getSelection()?.toString() !== '';
  });
};

const onScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (triggerElement.value && target?.contains(triggerElement.value)) {
    onOpenChange(false, 'imperative');
  }
};

let restoreTabOrder: (() => void) | undefined;

watchEffect(onCleanup => {
  if (!containSelection.value) return;

  const body = document.body;
  const previousUserSelect = body.style.userSelect;
  const previousWebkitUserSelect = body.style.webkitUserSelect;

  body.style.userSelect = 'none';
  body.style.webkitUserSelect = 'none';

  onCleanup(() => {
    body.style.userSelect = previousUserSelect;
    body.style.webkitUserSelect = previousWebkitUserSelect;
  });
});

onMounted(() => {
  document.addEventListener('pointerup', onPointerUp);
  window.addEventListener('scroll', onScroll, true);

  if (popupElement.value) {
    restoreTabOrder = removeFromTabOrder(getTabbableCandidates(popupElement.value));
  }
});

onUnmounted(() => {
  document.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('scroll', onScroll, true);
  restoreTabOrder?.();
  hasSelectionRef.value = false;
  isPointerDownOnPopupRef.value = false;
});
</script>

<template>
  <PopperPopup
    data-vean-hover-card-popup
    data-dismissable-layer
    :data-state="dataState"
    :style="{
      ...cssVarsStyle,
      userSelect: containSelection ? 'text' : undefined,
      WebkitUserSelect: containSelection ? 'text' : undefined
    }"
    @pointerdown="onPointerDown"
  >
    <slot />
  </PopperPopup>
</template>
