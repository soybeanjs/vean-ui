<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useDialogRootContext } from '../dialog/context';
import { useForwardElement } from '../../composables';
import type { SwipeDirection } from '../../types';
import { DRAWER_CSS_VARS, SWIPE_GESTURE } from './shared';
import { useDrawerRootContext, useDrawerUi } from './context';
import type { DrawerSwipeAreaProps } from './types';
import { getDisplacement, useSwipeDismiss } from './use-swipe-dismiss';

defineOptions({
  name: 'DrawerSwipeArea'
});

const props = withDefaults(defineProps<DrawerSwipeAreaProps>(), {
  swipeDirection: undefined,
  disabled: false
});

const cls = useDrawerUi('swipeArea');

const {
  isOpen,
  swipeDirection: dismissDirection,
  swipeAreaActive,
  setSwipeProgress,
  emitOpenChange,
  closeDrawer
} = useDrawerRootContext('DrawerSwipeArea');

const { popupElement, overlayElement } = useDialogRootContext('DrawerSwipeArea');

const [elementRef, setElementRef] = useForwardElement();

/** The gesture that opens the drawer runs opposite to the dismiss direction. */
const openDirection = computed<SwipeDirection>(() => {
  const opposites: Record<SwipeDirection, SwipeDirection> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };

  return props.swipeDirection ?? opposites[dismissDirection.value];
});

const swipeActive = ref(false);
const openedBySwipe = ref(false);
const dragDelta = ref({ x: 0, y: 0 });
const appliedSwipeStyles = ref(false);

const enabled = computed(() => !props.disabled && (!isOpen.value || swipeActive.value));

const isHorizontalDismiss = computed(() => dismissDirection.value === 'left' || dismissDirection.value === 'right');

/** Closed-position sign: down/right drawers rest beyond the positive axis. */
const dismissSign = computed(() => (dismissDirection.value === 'down' || dismissDirection.value === 'right' ? 1 : -1));

const movementVar = computed(() =>
  isHorizontalDismiss.value ? DRAWER_CSS_VARS.swipeMovementX : DRAWER_CSS_VARS.swipeMovementY
);

function applySwipeMovement() {
  const popup = popupElement.value;

  if (!popup || !isOpen.value) return;

  const size = isHorizontalDismiss.value ? popup.offsetWidth : popup.offsetHeight;

  if (size <= 0) return;

  const { x, y } = dragDelta.value;
  const displacement = getDisplacement(openDirection.value, x, y);
  const clamped = Math.max(0, displacement);

  // Square-root damping once the drag overshoots the closed position.
  const damped = clamped > size ? size + Math.sqrt(clamped - size) : clamped;
  const remaining = size - damped;
  const movement = remaining * dismissSign.value;
  const openProgress = Math.min(1, clamped / size);

  popup.style.setProperty(movementVar.value, `${movement}px`);
  popup.setAttribute('data-vean-swiping', '');
  popup.style.transition = 'none';

  if (overlayElement.value) {
    overlayElement.value.style.setProperty(DRAWER_CSS_VARS.swipeProgress, `${1 - openProgress}`);
  }

  setSwipeProgress(1 - openProgress);
  appliedSwipeStyles.value = true;
  swipeAreaActive.value = true;
}

function clearSwipeStyles() {
  const popup = popupElement.value;

  if (popup) {
    popup.style.removeProperty(movementVar.value);
    popup.removeAttribute('data-vean-swiping');
    popup.style.transition = '';
  }

  if (overlayElement.value) {
    overlayElement.value.style.removeProperty(DRAWER_CSS_VARS.swipeProgress);
  }

  setSwipeProgress(0);
  appliedSwipeStyles.value = false;
  swipeAreaActive.value = false;
}

function finishInteraction() {
  swipeActive.value = false;
  openedBySwipe.value = false;
  dragDelta.value = { x: 0, y: 0 };
  clearSwipeStyles();
}

function openDrawer() {
  openedBySwipe.value = true;
  emitOpenChange(true);
}

const swipe = useSwipeDismiss({
  enabled,
  elementRef,
  directions: computed(() => [openDirection.value]),
  onSwipeStart() {
    swipeActive.value = true;
    openedBySwipe.value = false;
    dragDelta.value = { x: 0, y: 0 };
  },
  onProgress(_progress, details) {
    if (!details) return;

    dragDelta.value = { x: details.deltaX, y: details.deltaY };

    if (details.direction !== openDirection.value) return;

    const displacement = getDisplacement(openDirection.value, details.deltaX, details.deltaY);

    if (!openedBySwipe.value && displacement < 1) return;

    if (!openedBySwipe.value && !isOpen.value) openDrawer();

    applySwipeMovement();
  },
  onRelease({ direction, deltaX, deltaY, releaseVelocityX, releaseVelocityY }) {
    const displacement = getDisplacement(openDirection.value, deltaX, deltaY);
    const releaseVelocity = getDisplacement(openDirection.value, releaseVelocityX, releaseVelocityY);
    const popup = popupElement.value;
    const popupSize = popup ? (isHorizontalDismiss.value ? popup.offsetWidth : popup.offsetHeight) : 0;
    const threshold = Math.max(popupSize * 0.5, 40);
    const shouldOpen =
      direction === openDirection.value &&
      !props.disabled &&
      (displacement >= threshold || releaseVelocity >= SWIPE_GESTURE.VELOCITY_THRESHOLD * 0.3);

    if (shouldOpen) {
      if (!isOpen.value) openDrawer();
    } else if (openedBySwipe.value && isOpen.value) {
      closeDrawer();
    }

    finishInteraction();

    return false;
  },
  onCancel: finishInteraction
});

// Re-assert the drag styles after the popup mounts mid-gesture: the opening
// commit renders the popup with fresh (unset) movement vars.
watch(isOpen, () => {
  if (!swipeActive.value || !appliedSwipeStyles.value) return;

  nextTick(() => applySwipeMovement());
});
</script>

<template>
  <div
    :ref="setElementRef"
    :class="cls"
    :style="{ pointerEvents: enabled ? undefined : 'none' }"
    data-vean-drawer-swipe-area
    :data-state="isOpen ? 'open' : 'closed'"
    :data-vean-drawer-swipe-direction="openDirection"
    :data-vean-swiping="swipe.swiping.value ? 'true' : undefined"
    v-on="swipe.touchHandlers"
  >
    <slot />
  </div>
</template>
