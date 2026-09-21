import { computed, ref, watch } from 'vue';
import { provideDialogUi } from '../dialog/context';
import { useContext, useForwardElement, useUiContext } from '../../composables';
import type { SwipeDirection } from '../../types';
import { NESTED_DISPLACEMENT, SWIPE_TO_DISMISS, isVertical } from './shared';
import type { DrawerRootContext, DrawerRootContextParams, DrawerSnapPoint, DrawerUiSlot } from './types';
import { useDrawerSnapPoints } from './use-drawer-snap-points';

export const [provideDrawerRootContext, useDrawerRootContext] = useContext(
  'DrawerRoot',
  (params: DrawerRootContextParams): DrawerRootContext => useDrawer(params)
);

export function useDrawer(params: DrawerRootContextParams): DrawerRootContext {
  const {
    open,
    fullscreen,
    snapPoints,
    snapPoint,
    defaultSnapPoint,
    snapToSequentialPoints,
    dismissible,
    nested,
    modal,
    side,
    swipeDirection,
    handleOnly,
    closeThreshold,
    emitDrag,
    emitRelease,
    emitClose,
    emitOpenChange
  } = params;

  const [overlayRef, setOverlayRef] = useForwardElement();
  const [drawerRef, setDrawerRef] = useForwardElement();
  const [handleRef, setHandleRef] = useForwardElement();

  const isOpen = ref(open.value ?? false);
  const hasBeenOpened = ref(false);
  const swiping = ref(false);
  const swipeProgress = ref(0);
  const popupHeight = ref(0);
  const swipeAreaActive = ref(false);
  const nestedScale = ref(1);
  /**
   * Snapping is only meaningful while the panel can rest at more than one size.
   * Fullscreen fixes that size to the viewport, so keeping a snap point active
   * would translate the panel back down to its resting level and leave the half
   * beyond the anchored edge off-screen. Switching the whole snap machinery off
   * also degrades the drag to the single-resting-position path: release past the
   * threshold dismisses, anything shorter springs back to fully open.
   */
  const hasSnapPoints = computed(() => !fullscreen.value && (snapPoints.value?.length ?? 0) > 0);

  const resolvedSwipeDirection = computed<SwipeDirection>(() => swipeDirection.value ?? SWIPE_TO_DISMISS[side.value]);

  const { resolvedSnapPoints, activeSnapPointOffset, maxSnapPointSize, viewportRevision } = useDrawerSnapPoints({
    snapPoints,
    activeSnapPoint: snapPoint,
    popupHeight,
    side
  });

  // Published for introspection only; an inactive (fullscreen) drawer reports no
  // offsets so consumers keying on `data-vean-snap-points-offset` stay in step
  // with the `data-vean-snap-points` flag they read next to it.
  const snapPointsOffset = computed(() =>
    hasSnapPoints.value ? resolvedSnapPoints.value.map(point => point.offset) : []
  );

  const snapPointRange = computed(() => {
    const offsets = snapPointsOffset.value;

    if (!hasSnapPoints.value || resolvedSnapPoints.value.length < 2 || !isVertical(side.value)) return null;

    const minOffset = Math.min(...offsets);
    const maxOffset = Math.max(...offsets);

    return { minOffset, range: Math.max(maxOffset - minOffset, 1) };
  });

  /** 0 = fully open, 1 = closed; the resting progress of the active snap point. */
  const snapPointProgress = computed(() => {
    const range = snapPointRange.value;
    const offset = activeSnapPointOffset.value;

    if (!range || offset === null) return null;

    return Math.min(1, Math.max(0, (offset - range.minOffset) / range.range));
  });

  function setActiveSnapPoint(value: DrawerSnapPoint | null) {
    if (snapPoint.value === value) return;

    // The controllable `snapPoint` state already emits `update:snapPoint` on
    // write (controlled: via the computed setter; uncontrolled: via the proxy
    // watcher), so no extra emission here — it would double-fire the event.
    snapPoint.value = value;
  }

  function setPopupHeight(height: number) {
    if (Number.isFinite(height) && height >= 0) popupHeight.value = height;
  }

  function closeDrawer() {
    // Sync the controllable `open` state too: an uncontrolled drawer whose
    // internal value stayed `true` would swallow the next trigger click
    // (assigning `true` again is a no-op, so the drawer never reopened).
    open.value = false;
    isOpen.value = false;
  }

  function applySwipeProgress(progress: number) {
    swipeProgress.value = Math.min(1, Math.max(0, progress));
  }

  watch(open, value => {
    isOpen.value = value;
  });

  watch(isOpen, value => {
    if (value) {
      hasBeenOpened.value = true;
      swipeAreaActive.value = false;
      applySwipeProgress(0);
      // An already-active snap point (bound via the controlled prop or left
      // over from the previous session) persists across reopen; the default
      // snap only fills in when none is active. Resetting here (not on close)
      // keeps layout vars stable while the exit animation is still running.
      setActiveSnapPoint(snapPoint.value ?? defaultSnapPoint.value ?? null);
      return;
    }

    // Single source for the `close` event: covers swipe dismissal, escape,
    // outside press, the close button, and an externally flipped `open` prop
    // (the nested root relies on it to restore the parent's nested scale).
    emitClose();
  });

  // --- nested drawer reaction (parent side) ---------------------------------

  function setNestedScale(scale: number) {
    nestedScale.value = scale;
  }

  function onNestedOpenChange(openState: boolean) {
    const dimension = isVertical(side.value) ? window.innerHeight : window.innerWidth;
    const scale = openState ? (dimension - NESTED_DISPLACEMENT) / dimension : 1;

    setNestedScale(scale);
  }

  function onNestedDrag(percentageDragged: number) {
    if (percentageDragged < 0) return;

    const dimension = isVertical(side.value) ? window.innerHeight : window.innerWidth;
    const initialScale = (dimension - NESTED_DISPLACEMENT) / dimension;

    setNestedScale(initialScale + percentageDragged * (1 - initialScale));
  }

  function onNestedRelease(openState: boolean) {
    onNestedOpenChange(openState);
  }

  return {
    open,
    fullscreen,
    isOpen,
    modal,
    hasBeenOpened,
    drawerRef,
    setDrawerRef,
    overlayRef,
    setOverlayRef,
    handleRef,
    setHandleRef,
    side,
    swipeDirection: resolvedSwipeDirection,
    dismissible,
    handleOnly,
    nested,
    snapPoints,
    hasSnapPoints,
    snapPoint,
    setActiveSnapPoint,
    defaultSnapPoint,
    snapToSequentialPoints,
    resolvedSnapPoints,
    snapPointsOffset,
    snapPointRange,
    snapPointProgress,
    activeSnapPointOffset,
    maxSnapPointSize,
    viewportRevision,
    popupHeight,
    setPopupHeight,
    swiping,
    swipeProgress,
    setSwipeProgress: applySwipeProgress,
    swipeAreaActive,
    closeThreshold,
    closeDrawer,
    onNestedDrag,
    onNestedRelease,
    onNestedOpenChange,
    nestedScale,
    emitClose,
    emitDrag,
    emitRelease,
    emitOpenChange
  };
}

export const [provideDrawerUi, useDrawerUi] = useUiContext<DrawerUiSlot>('Drawer', ui => {
  provideDialogUi(ui);

  return ui;
});
