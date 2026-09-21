import { computed, nextTick, onBeforeUnmount, shallowRef, watchEffect } from 'vue';
import type { ComputedRef } from 'vue';
import type { PopperRootContext, PopperTriggerProps } from './types';
import { useVirtualPointReference } from './use-virtual-point-reference';

interface UsePopperTriggerOptions {
  /**
   * Invoked when the contextmenu virtual point moves; should request a positioner update so an
   * already-open popup repositions without rebuilding `autoUpdate`.
   */
  onVirtualPointChange: () => void;
}

interface UsePopperTriggerReturn {
  reference: ComputedRef<PopperTriggerProps['reference']>;
  onBlur: (event: FocusEvent) => void;
  onClick: (event: PointerEvent) => Promise<void>;
  onContextMenu: (event: MouseEvent) => Promise<void>;
  onFocus: (event: FocusEvent) => void;
  onPointerCancel: () => void;
  onPointerDown: (event: PointerEvent) => Promise<void>;
  onPointerEnter: (event: PointerEvent) => void;
  onPointerLeave: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: () => void;
}

interface Point {
  x: number;
  y: number;
}

const longPressMoveTolerance = 8;

export function usePopperTrigger(
  props: PopperTriggerProps,
  context: PopperRootContext,
  options: UsePopperTriggerOptions
): UsePopperTriggerReturn {
  const { reference: virtualReference, setPoint } = useVirtualPointReference({
    onPointChange: options.onVirtualPointChange
  });

  const reference = computed(() => (props.trigger === 'contextmenu' ? virtualReference : props.reference));
  const openOnFocus = computed(() => props.openOnFocus ?? props.trigger === 'hover');
  const pressOpenDelay = computed(() => props.pressOpenDelay ?? 700);

  const pointerDownPoint = shallowRef<Point>();

  let isPointerDown = false;
  let longPressTimer: ReturnType<typeof setTimeout> | undefined;
  let pointerEndTimer: ReturnType<typeof setTimeout> | undefined;
  let pointerOwnerDocument: Document | undefined;

  function clearLongPressTimer() {
    if (longPressTimer === undefined) return;
    clearTimeout(longPressTimer);
    longPressTimer = undefined;
  }

  function clearPointerEndTimer() {
    if (pointerEndTimer === undefined) return;
    clearTimeout(pointerEndTimer);
    pointerEndTimer = undefined;
  }

  function removeDocumentPointerListeners() {
    pointerOwnerDocument?.removeEventListener('pointerup', onDocumentPointerEnd);
    pointerOwnerDocument?.removeEventListener('pointercancel', onDocumentPointerEnd);
    pointerOwnerDocument = undefined;
  }

  function onDocumentPointerEnd() {
    clearLongPressTimer();
    removeDocumentPointerListeners();

    // Deferred (rather than synchronous) so focus/click events dispatched after pointerup in the
    // same task still observe `isPointerDown === true`; the timer is tracked and cleared on
    // unmount so no async work outlives the component.
    clearPointerEndTimer();
    pointerEndTimer = setTimeout(() => {
      isPointerDown = false;
      pointerEndTimer = undefined;
    }, 0);
  }

  function registerDocumentPointerListeners(ownerDocument: Document) {
    removeDocumentPointerListeners();
    pointerOwnerDocument = ownerDocument;
    ownerDocument.addEventListener('pointerup', onDocumentPointerEnd, { once: true });
    ownerDocument.addEventListener('pointercancel', onDocumentPointerEnd, { once: true });
  }

  function isTouchOrPen(event: PointerEvent) {
    return event.pointerType !== 'mouse';
  }

  function hasPointerMoved(event: PointerEvent) {
    if (!pointerDownPoint.value) return false;

    const deltaX = event.clientX - pointerDownPoint.value.x;
    const deltaY = event.clientY - pointerDownPoint.value.y;

    return Math.hypot(deltaX, deltaY) > longPressMoveTolerance;
  }

  function onPointerEnter(event: PointerEvent) {
    context.onTriggerPointerInsideChange(true);
    context.cancelHoverClose();

    if (props.trigger !== 'hover' || event.pointerType === 'touch') return;
    context.onHoverOpen('trigger-hover');
  }

  function onPointerLeave(event: PointerEvent) {
    context.onTriggerPointerInsideChange(false);

    if (props.trigger !== 'hover' || event.pointerType === 'touch') return;

    // When a domain overrides the grace anchor to a shared hover surface (e.g. the menubar
    // container), closing is owned by that surface's grace area: leaving a single trigger
    // must not close while the pointer can still be on (or transit to) the shared surface.
    if (context.graceTriggerElement.value) return;

    context.onHoverClose('trigger-hover');
  }

  async function onPointerDown(event: PointerEvent) {
    // `isPointerDown` only gates focus-driven opening; the document listeners also serve the
    // contextmenu long-press cleanup. Skip both when nothing can read the state.
    if (openOnFocus.value || props.trigger === 'contextmenu') {
      isPointerDown = true;
      registerDocumentPointerListeners((event.currentTarget as HTMLElement).ownerDocument);
    }

    if (props.trigger !== 'contextmenu' || !isTouchOrPen(event)) return;

    await nextTick();
    if (event.defaultPrevented || context.disabled.value) return;

    clearLongPressTimer();
    setPoint(event.clientX, event.clientY);
    pointerDownPoint.value = { x: event.clientX, y: event.clientY };
    longPressTimer = setTimeout(() => {
      context.onOpenChange(true, 'trigger-contextmenu');
      longPressTimer = undefined;
    }, pressOpenDelay.value);
  }

  function onPointerMove(event: PointerEvent) {
    if (props.trigger !== 'contextmenu' || !isTouchOrPen(event) || !hasPointerMoved(event)) return;
    clearLongPressTimer();
  }

  function onPointerUp() {
    onDocumentPointerEnd();
  }

  function onPointerCancel() {
    onDocumentPointerEnd();
  }

  async function onClick(event: PointerEvent) {
    if (props.trigger !== 'click') return;
    if (event.button !== 0 || event.ctrlKey) return;
    if (context.disabled.value) return;

    context.onOpenToggle('trigger-click');

    await nextTick();
    if (event.defaultPrevented) return;

    // Prevent the trigger from taking focus when opening (Safari / iOS focus on click) so the
    // popup content can receive focus without competition.
    if (context.open.value) {
      event.preventDefault();
    }
  }

  async function onContextMenu(event: MouseEvent) {
    if (props.trigger !== 'contextmenu') return;

    await nextTick();
    if (event.defaultPrevented || context.disabled.value) return;

    clearLongPressTimer();
    setPoint(event.clientX, event.clientY);
    context.onOpenChange(true, 'trigger-contextmenu');
    event.preventDefault();
  }

  function onFocus(event: FocusEvent) {
    if (!openOnFocus.value || isPointerDown || context.disabled.value) return;

    if (props.focusVisibleOnly && !(event.target as HTMLElement | null)?.matches?.(':focus-visible')) {
      return;
    }

    context.onHoverOpen('trigger-focus');
  }

  function onBlur(event: FocusEvent) {
    if (!openOnFocus.value) return;

    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && context.positionerElement.value?.contains(relatedTarget)) {
      return;
    }

    context.onHoverClose('trigger-focus');
  }

  watchEffect(() => {
    const type = props.trigger ?? 'click';

    context.configureTrigger({
      type,
      openDelay: props.openDelay ?? (type === 'hover' ? 150 : 0),
      focusOpenDelay: props.focusOpenDelay ?? props.openDelay ?? (type === 'hover' ? 150 : 0),
      closeDelay: props.closeDelay ?? 0,
      skipDelayDuration: props.skipDelayDuration ?? 300,
      pressOpenDelay: props.pressOpenDelay ?? 700,
      openOnFocus: props.openOnFocus ?? type === 'hover',
      disabled: props.disabled ?? false
    });

    if (props.id) {
      context.triggerId.value = props.id;
    }
  });

  onBeforeUnmount(() => {
    clearLongPressTimer();
    clearPointerEndTimer();
    removeDocumentPointerListeners();
    isPointerDown = false;
    context.onTriggerPointerInsideChange(false);
  });

  return {
    reference,
    onBlur,
    onClick,
    onContextMenu,
    onFocus,
    onPointerCancel,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    onPointerUp
  };
}
