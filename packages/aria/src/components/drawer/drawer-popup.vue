<script setup lang="ts">
import { computed, onBeforeUnmount, watch, watchEffect } from 'vue';
import type { ShallowRef } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useDialogRootContext } from '../dialog/context';
import type { SwipeDirection } from '../../types';
import { DialogPopup } from '../dialog';
import { DRAWER_CSS_VARS, HANDLE_ATTR, NO_DRAG_ATTR, SNAP_GESTURE, isVertical } from './shared';
import { useDrawerRootContext } from './context';
import {
  canSwipeFromScrollEdgeOnMove,
  findScrollableTouchTarget,
  getElementAtPoint,
  hasScrollableContentOnAxis,
  isAtSwipeStartEdge,
  isTouchEventOnRangeInput,
  shouldIgnoreSwipeForTextSelection,
  shouldYieldTouchMove
} from './scroll-arbitration';
import type { ScrollAxis, TouchScrollState } from './scroll-arbitration';
import { getSnapPointSwipeMovement, closestSnapPointIndex } from './use-drawer-snap-points';
import { getDisplacement, useSwipeDismiss } from './use-swipe-dismiss';
import type { SwipeProgressDetails, SwipeReleaseDetails } from './use-swipe-dismiss';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

defineOptions({
  name: 'DrawerPopup'
});

const context = useDrawerRootContext('DrawerPopup');

const {
  isOpen,
  fullscreen,
  side,
  swipeDirection,
  dismissible,
  modal,
  handleOnly,
  nestedScale,
  hasSnapPoints,
  snapToSequentialPoints,
  activeSnapPointOffset,
  resolvedSnapPoints,
  maxSnapPointSize,
  viewportRevision,
  popupHeight,
  closeThreshold,
  swiping,
  swipeAreaActive,
  setActiveSnapPoint,
  setDrawerRef,
  setPopupHeight,
  setSwipeProgress,
  emitDrag,
  emitRelease,
  closeDrawer
} = context;

const { popupElement } = useDialogRootContext('DrawerPopup');

watchEffect(() => {
  if (popupElement.value) {
    setDrawerRef(popupElement.value);
  }
});

// --- measured height ---------------------------------------------------------

let resizeObserver: ResizeObserver | undefined;
let measureTimer: ReturnType<typeof setTimeout> | undefined;
let measureBox: (() => void) | undefined;

/**
 * A viewport change re-frames both the box (its `dvh`-driven size) and the
 * snap heights. Measuring straight away keeps the published height in step with
 * the new viewport; waiting for the observer's debounce publishes an offset
 * derived from the new viewport and the old box, which rests the drawer at the
 * wrong place until the correction lands — the "opens at one snap level, then
 * flashes to another" defect.
 */
watch(viewportRevision, () => {
  measureBox?.();
});

watch(popupElement, element => {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  clearTimeout(measureTimer);
  measureTimer = undefined;
  measureBox = undefined;

  if (!element) return;

  // The gesture layer may stretch the popup past its resting height (dragging
  // a bottom drawer upwards, or a swipe-area pull-in). Measuring mid-stretch
  // or mid-settle-transition would feed the grown box back into the height
  // CSS var, so a measurement only lands once the size has been still for a
  // moment and no live movement is written on the element.
  //
  // Fullscreen is the same trap with a longer memory: the popup is forced to the
  // viewport there, and since the published height *is* what the box reads back
  // as its height, capturing it would pin the panel to the viewport for good —
  // switching fullscreen off could never shrink it back to its content.
  const measure = () => {
    measureTimer = undefined;

    if (fullscreen.value || swiping.value) return;

    const style = element.style;
    const movementX = style.getPropertyValue(DRAWER_CSS_VARS.swipeMovementX);
    const movementY = style.getPropertyValue(DRAWER_CSS_VARS.swipeMovementY);

    if ((movementX && movementX !== '0px') || (movementY && movementY !== '0px')) return;

    setPopupHeight(element.offsetHeight);
  };

  const report = () => {
    clearTimeout(measureTimer);
    measureTimer = setTimeout(measure, 100);
  };

  measureBox = measure;

  // The first measurement must land before the popup's first paint: the snap
  // offset var does not exist until `popupHeight` is known, and a debounced
  // first measurement lets the entry animation play at the unmeasured resting
  // position before flashing into the active snap point. ResizeObserver events
  // keep the debounce — they fire mid-layout-change, where the delay guards
  // against measuring a stretched or settling box.
  measure();

  if (typeof ResizeObserver !== 'function') return;

  resizeObserver = new ResizeObserver(report);
  resizeObserver.observe(element);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  clearTimeout(measureTimer);
  measureTimer = undefined;
});

// --- swipe handling ----------------------------------------------------------

const elementSize = (element: HTMLElement, direction: SwipeDirection) => {
  const rect = element.getBoundingClientRect();

  return (direction === 'left' || direction === 'right' ? rect.width : rect.height) || 0;
};

const isVerticalScrollAxis = computed(() => swipeDirection.value !== 'left' && swipeDirection.value !== 'right');

const scrollAxis = computed<ScrollAxis>(() => (isVerticalScrollAxis.value ? 'vertical' : 'horizontal'));

const dismissThreshold = (element: HTMLElement, direction: SwipeDirection) =>
  Math.max(elementSize(element, direction) * closeThreshold.value, SNAP_GESTURE.MIN_SWIPE_THRESHOLD);

const canStart = (_position: { x: number; y: number }, details: { nativeEvent: PointerEvent | TouchEvent }) => {
  if (!handleOnly.value) return true;

  const target = details.nativeEvent.target as HTMLElement | null;

  return Boolean(target?.closest(`[${HANDLE_ATTR}]`));
};

function handleProgress(progress: number, details?: SwipeProgressDetails) {
  if (!isOpen.value) {
    setSwipeProgress(0);
    return;
  }

  const direction = swipeDirection.value;
  const verticalSnap = hasSnapPoints.value && isVertical(side.value);

  if (popupElement.value && details && verticalSnap) {
    // Damp the drag once it pushes past the fully-open edge so the popup
    // resists travelling above its largest snap point.
    const baseOffset = activeSnapPointOffset.value ?? 0;
    const dragDelta = direction === 'down' ? details.deltaY : -details.deltaY;
    const damped = getSnapPointSwipeMovement(baseOffset, dragDelta);
    const movement = direction === 'down' ? damped : -damped;
    const movementVar =
      direction === 'down' || direction === 'up' ? DRAWER_CSS_VARS.swipeMovementY : DRAWER_CSS_VARS.swipeMovementX;

    popupElement.value.style.setProperty(movementVar, `${movement}px`);
  }

  // The overlay tracks the drag towards close only, measured from the current
  // position — it stays full at rest and while dragging between snap points.
  let resolved = progress;

  if (details && verticalSnap && popupHeight.value > 0) {
    const baseOffset = activeSnapPointOffset.value ?? 0;
    const dragDelta = direction === 'down' ? details.deltaY : -details.deltaY;
    const distanceToClose = Math.max(popupHeight.value - baseOffset, 1);

    resolved = clamp(dragDelta / distanceToClose, 0, 1);
  }

  setSwipeProgress(resolved);
  emitDrag(resolved);
}

function handleRelease(details: SwipeReleaseDetails): boolean {
  if (!isOpen.value || !popupElement.value) return false;

  const { deltaX, deltaY, velocityY, releaseVelocityX, releaseVelocityY, direction } = details;
  const dismissDirection = swipeDirection.value;
  const verticalSnap = hasSnapPoints.value && isVertical(side.value);

  if (!verticalSnap) {
    if (!direction) return false;

    const displacement = getDisplacement(direction, deltaX, deltaY);

    if (displacement <= 0) return false;

    const releaseVelocity = getDisplacement(direction, releaseVelocityX, releaseVelocityY);

    if (releaseVelocity >= SNAP_GESTURE.FAST_SWIPE_VELOCITY) return true;

    const threshold = dismissThreshold(popupElement.value, dismissDirection);

    if (displacement > threshold) return true;

    emitRelease(true);
    return false;
  }

  if (popupHeight.value <= 0 || resolvedSnapPoints.value.length === 0) return false;

  const verticalDelta = dismissDirection === 'down' ? deltaY : -deltaY;
  const verticalVelocity = dismissDirection === 'down' ? releaseVelocityY : -releaseVelocityY;
  const fallbackVelocity = dismissDirection === 'down' ? velocityY : -velocityY;

  // Ignore touch reversals that would otherwise flip the snap decision.
  let resolvedVelocity = verticalVelocity;

  if (Math.abs(verticalDelta) >= SNAP_GESTURE.MIN_SWIPE_THRESHOLD) {
    const velocitySign = Math.sign(resolvedVelocity);

    if (velocitySign !== 0 && velocitySign !== Math.sign(verticalDelta)) {
      resolvedVelocity = fallbackVelocity;
    }
  }

  const currentOffset = activeSnapPointOffset.value ?? 0;
  const dragTargetOffset = clamp(currentOffset + verticalDelta, 0, popupHeight.value);
  const velocityOffset =
    Math.abs(resolvedVelocity) >= SNAP_GESTURE.SNAP_VELOCITY_THRESHOLD
      ? clamp(resolvedVelocity, -SNAP_GESTURE.MAX_SNAP_VELOCITY, SNAP_GESTURE.MAX_SNAP_VELOCITY) *
        SNAP_GESTURE.SNAP_VELOCITY_MULTIPLIER
      : 0;
  const targetOffset = snapToSequentialPoints.value
    ? dragTargetOffset
    : clamp(dragTargetOffset + velocityOffset, 0, popupHeight.value);

  const offsets = resolvedSnapPoints.value.map(point => point.offset);
  const closest = resolvedSnapPoints.value[closestSnapPointIndex(offsets, targetOffset)];

  if (!closest) return false;

  const closeDistance = Math.abs(targetOffset - popupHeight.value);

  if (
    closeDistance < Math.abs(targetOffset - closest.offset) ||
    (resolvedVelocity >= SNAP_GESTURE.FAST_SWIPE_VELOCITY && verticalDelta > 0)
  ) {
    return true;
  }

  setActiveSnapPoint(closest.value);
  emitRelease(true);

  return false;
}

function handleSwipeDismiss() {
  emitRelease(false);
  closeDrawer();
}

const swipe = useSwipeDismiss({
  // A nested drawer still owns its own swipe gesture; Base UI only suspends it
  // while the drawer's own child drawers are open.
  //
  // Fullscreen suspends the gesture outright, matching how the dialog disables
  // its draggable in fullscreen: the panel is meant to cover the viewport, so
  // both the snap walk and the drag-to-dismiss have nothing left to move it to.
  // Dismissal stays on the explicit paths — the close button, Escape, and an
  // outside press on a non-modal drawer.
  enabled: computed(() => isOpen.value && !fullscreen.value),
  elementRef: popupElement as ShallowRef<HTMLElement | null | undefined>,
  directions: computed(() => {
    const direction = swipeDirection.value;

    if (hasSnapPoints.value && (direction === 'down' || direction === 'up')) {
      const both: SwipeDirection[] = ['down', 'up'];

      return direction === 'down' ? both : [...both].reverse();
    }

    return [direction];
  }),
  trackDrag: true,
  movementCssVars: {
    x: DRAWER_CSS_VARS.swipeMovementX,
    y: DRAWER_CSS_VARS.swipeMovementY
  },
  // The popup owns touch scroll arbitration through its native touchmove
  // pipeline below; the engine's own scrollable-ancestor yield would double up.
  ignoreScrollableAncestors: true,
  swipeThreshold: ({ element, direction }) => dismissThreshold(element, direction),
  ignoreSelector: `button,a,input,select,textarea,label,[role="button"],[${NO_DRAG_ATTR}]`,
  canStart,
  onSwipingChange: value => {
    swiping.value = value;
  },
  onProgress: handleProgress,
  onRelease: handleRelease,
  onDismiss: handleSwipeDismiss
});

// Reset leftover gesture state (movement vars, dismissed flag) from a prior
// dismissal when the popup opens again without remounting.
watch(isOpen, openState => {
  if (!openState) return;

  if (!swipeAreaActive.value) swipe.reset();
});

// Turning fullscreen on mid-gesture has to drop what the drag already wrote:
// with the gesture disabled nothing else clears the movement vars, so the panel
// would keep resting at the offset of an abandoned drag.
watch(fullscreen, isFullscreen => {
  if (isFullscreen) swipe.reset();
});

// --- native touch pipeline ----------------------------------------------------
// Port of the Base UI drawer touch arbitration: a capture-phase touchmove
// listener owns every touch frame and decides per gesture whether the move
// feeds the swipe pipeline or is left to native scrolling.

const crossScrollAxis = computed<ScrollAxis>(() => (isVerticalScrollAxis.value ? 'horizontal' : 'vertical'));

let touchState: TouchScrollState | null = null;
let ignoreTouchSwipe = false;
let lastPointerType = '';
let ignoreNextTouchStartFromPen = false;

function resetTouchSwipeState(ignoreSwipe: boolean) {
  ignoreTouchSwipe = ignoreSwipe;
  touchState = null;
}

function resetTouchTrackingState() {
  resetTouchSwipeState(false);
  lastPointerType = '';
  ignoreNextTouchStartFromPen = false;
}

function isSwipeIgnoredTarget(target: Element | null) {
  return Boolean(target?.closest(`[${NO_DRAG_ATTR}]`));
}

function handleTouchStart(event: TouchEvent) {
  const startedFromPenPointerDown = lastPointerType === 'pen' && ignoreNextTouchStartFromPen;

  lastPointerType = 'touch';

  if (startedFromPenPointerDown) {
    ignoreNextTouchStartFromPen = false;
    resetTouchSwipeState(false);
    return;
  }

  const rootElement = popupElement.value;

  if (!rootElement || !isOpen.value) {
    resetTouchSwipeState(false);
    return;
  }

  // A frozen (fullscreen) drawer never claims a touch: marking the gesture as
  // ignored keeps the move pipeline out of the way, so the panel's own content
  // scrolls natively instead of being absorbed by a drag that cannot move.
  if (fullscreen.value) {
    resetTouchSwipeState(true);
    return;
  }

  const touch = event.touches[0];

  if (!touch) return;

  if (isTouchEventOnRangeInput(event)) {
    resetTouchSwipeState(false);
    return;
  }

  const eventTarget = event.target;
  const target = eventTarget instanceof Element ? eventTarget : rootElement;

  if (!rootElement.contains(target)) {
    resetTouchSwipeState(true);
    return;
  }

  if (shouldIgnoreSwipeForTextSelection(document, rootElement)) {
    resetTouchSwipeState(true);
    return;
  }

  const elementAtPoint = getElementAtPoint(rootElement.getRootNode(), touch.clientX, touch.clientY);

  if (isSwipeIgnoredTarget(elementAtPoint)) {
    resetTouchSwipeState(true);
    return;
  }

  ignoreTouchSwipe = false;

  const scrollTarget = findScrollableTouchTarget(target, rootElement, scrollAxis.value);
  const hasCrossAxisScrollableContent = findScrollableTouchTarget(target, rootElement, crossScrollAxis.value) != null;

  let allowSwipe: boolean | null = null;

  if (scrollTarget) {
    const canSwipeFromEdge = isAtSwipeStartEdge(scrollTarget, scrollAxis.value, swipeDirection.value);

    allowSwipe = canSwipeFromEdge ? null : false;
  }

  touchState = {
    startX: touch.clientX,
    startY: touch.clientY,
    lastX: touch.clientX,
    lastY: touch.clientY,
    scrollTarget,
    hasCrossAxisScrollableContent,
    allowSwipe,
    preserveNativeCrossAxisScroll: false,
    drawerAxisAttributed: false
  };

  swipe.touchHandlers.onTouchStart(event);
}

function handleTouchEnd(event: TouchEvent) {
  resetTouchTrackingState();
  swipe.touchHandlers.onTouchEnd(event);
}

function handleTouchCancel(event: TouchEvent) {
  resetTouchTrackingState();
  swipe.touchHandlers.onTouchCancel(event);
}

function processTouchMove(event: TouchEvent, state: TouchScrollState, touch: Touch) {
  const rootElement = popupElement.value;

  if (!rootElement) return;

  const drawerAxisDelta = isVerticalScrollAxis.value ? touch.clientY - state.lastY : touch.clientX - state.lastX;

  // Avoid blocking pinch zoom or text selection adjustments on iOS Safari.
  if (event.touches.length === 2) return;

  if (shouldIgnoreSwipeForTextSelection(document, rootElement)) return;

  if (!isOpen.value) return;

  if (shouldYieldTouchMove(state, event, touch, isVerticalScrollAxis.value)) return;

  const scrollTarget = state.scrollTarget;

  if (!scrollTarget || scrollTarget === document.documentElement || scrollTarget === document.body) {
    if (event.cancelable) event.preventDefault();
    // Claim the gesture before it reaches the delegated touch handlers.
    event.stopPropagation();
    swipe.moveNative(event);
    return;
  }

  if (!hasScrollableContentOnAxis(scrollTarget, scrollAxis.value)) {
    // The scroll container does not overflow on the drawer axis, so prevent
    // the window from scrolling instead of dragging.
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (drawerAxisDelta !== 0) {
    const canSwipeFromEdge = canSwipeFromScrollEdgeOnMove(
      scrollTarget,
      scrollAxis.value,
      swipeDirection.value,
      drawerAxisDelta
    );

    if (!state.allowSwipe) {
      if (event.cancelable && canSwipeFromEdge) {
        state.allowSwipe = true;
        event.preventDefault();
      } else {
        state.allowSwipe = false;
      }
    } else if (event.cancelable) {
      event.preventDefault();
    }
  }

  if (state.allowSwipe === true) {
    event.stopPropagation();
    swipe.moveNative(event);
  }
}

const handleCapturedTouchMove = (event: TouchEvent) => {
  if (ignoreTouchSwipe) return;

  const state = touchState;
  const touch = event.touches[0];

  if (!touch || !state) return;

  processTouchMove(event, state, touch);

  state.lastX = touch.clientX;
  state.lastY = touch.clientY;
};

useEventListener(popupElement, 'touchmove', handleCapturedTouchMove, {
  passive: false,
  capture: true
});

// --- outside press / escape --------------------------------------------------

function handlePointerDownOutside(event: Event) {
  if (event.defaultPrevented) {
    event.preventDefault();
    return;
  }

  // A non-modal drawer keeps its own outside-press contract: no implicit dismiss.
  if (modal.value === false) {
    event.preventDefault();
    return;
  }

  if (dismissible.value) {
    closeDrawer();
  } else {
    event.preventDefault();
  }
}

function onEscapeKeyDown(event: Event) {
  if (dismissible.value) return;

  event.preventDefault();
}

function handleOpenAutoFocus(event: Event) {
  event.preventDefault();

  popupElement.value?.focus({
    preventScroll: true
  });
}

// --- declarative CSS variables ------------------------------------------------

const popupStyle = computed(() => {
  const style: Record<string, string> = {};
  const offset = activeSnapPointOffset.value;

  if (hasSnapPoints.value && offset !== null && offset !== undefined) {
    const sign = side.value === 'bottom' || side.value === 'right' ? 1 : -1;

    style[DRAWER_CSS_VARS.snapPointOffset] = `${sign * offset}px`;
  }

  if (popupHeight.value > 0) {
    style[DRAWER_CSS_VARS.height] = `${popupHeight.value}px`;
  }

  // The box must not rest taller than the largest snap point: a resting position
  // is reached by translating the box down, so any size past the viewport edge
  // puts the end of the scrolling content below the fold, where no snap level can
  // bring it back into view. `hasSnapPoints` also drops the cap in fullscreen,
  // where the panel is meant to rest at the viewport edge instead.
  const maxSize = hasSnapPoints.value ? maxSnapPointSize.value : null;

  if (maxSize !== null && maxSize > 0) {
    style[isVertical(side.value) ? DRAWER_CSS_VARS.maxHeight : DRAWER_CSS_VARS.maxWidth] = `${maxSize}px`;
  }

  if (nestedScale.value !== 1) {
    style[DRAWER_CSS_VARS.nestedScale] = String(nestedScale.value);
  }

  return style;
});
</script>

<template>
  <DialogPopup
    data-vean-drawer-popup
    :data-vean-drawer-side="side"
    :data-vean-snap-points="isOpen && hasSnapPoints ? 'true' : 'false'"
    :data-vean-swiping="swiping ? 'true' : undefined"
    :data-vean-swipe-dismissed="swipe.dragDismissed.value ? 'true' : undefined"
    :style="popupStyle"
    @touchstart="handleTouchStart"
    @touchmove="swipe.touchHandlers.onTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchCancel"
    @pointer-down-outside="handlePointerDownOutside"
    @escape-key-down="onEscapeKeyDown"
    @open-auto-focus="handleOpenAutoFocus"
  >
    <slot />
  </DialogPopup>
</template>
