<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useDialogRootContext } from '../dialog/context';
import { DialogOverlay } from '../dialog';
import { DRAWER_CSS_VARS, TRANSITIONS } from './shared';
import { useDrawerRootContext } from './context';

defineOptions({
  name: 'DrawerOverlay'
});

const { overlayElement } = useDialogRootContext('DrawerOverlay');

const { setOverlayRef, hasSnapPoints, isOpen, swiping, swipeProgress } = useDrawerRootContext('DrawerOverlay');

watchEffect(() => {
  if (overlayElement.value) {
    setOverlayRef(overlayElement.value);
  }
});

// The overlay fades with the live swipe progress; the transition is suspended
// while a gesture is in flight so the opacity tracks the pointer exactly.
const overlayStyle = computed(() => ({
  [DRAWER_CSS_VARS.swipeProgress]: String(swipeProgress.value),
  opacity: `calc(1 - var(${DRAWER_CSS_VARS.swipeProgress}, 0))`,
  transition: swiping.value ? 'none' : `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
}));
</script>

<template>
  <DialogOverlay
    data-vean-overlay
    :data-vean-snap-points="isOpen && hasSnapPoints ? 'true' : 'false'"
    :data-vean-swiping="swiping ? 'true' : undefined"
    :style="overlayStyle"
  />
</template>
