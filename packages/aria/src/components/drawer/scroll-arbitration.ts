import type { SwipeDirection } from '../../types';

export type ScrollAxis = 'horizontal' | 'vertical';

/**
 * Per-gesture touch state owned by the drawer popup's native touchmove pipeline.
 * It arbitrates every touchmove between the drawer drag and native scrolling.
 */
export interface TouchScrollState {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  scrollTarget: HTMLElement | null;
  hasCrossAxisScrollableContent: boolean;
  /**
   * `null` = undecided (decided on the first qualifying move), `true` = the
   * gesture may feed the swipe pipeline, `false` = the scrollable owns it.
   */
  allowSwipe: boolean | null;
  preserveNativeCrossAxisScroll: boolean;
  drawerAxisAttributed: boolean;
}

/** Gesture attribution slop (px) and the bias favouring the cross axis. */
export const AXIS_LOCK_SLOP = 6;
export const AXIS_LOCK_BIAS = 2;

function isScrollableY(element: HTMLElement) {
  const { overflowY } = window.getComputedStyle(element);

  return (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight;
}

function isScrollableX(element: HTMLElement) {
  const { overflowX } = window.getComputedStyle(element);

  return (overflowX === 'auto' || overflowX === 'scroll') && element.scrollWidth > element.clientWidth;
}

export function isScrollable(element: HTMLElement, axis: ScrollAxis) {
  return axis === 'vertical' ? isScrollableY(element) : isScrollableX(element);
}

function isLastTraversableNode(node: Node) {
  return node === document || node === document.documentElement;
}

function getParentNode(node: Node): Node | null {
  if (node instanceof Element && node.shadowRoot) return node.shadowRoot;

  const parent = node.parentNode;

  // A scrollable assigned to a slot is logically the parent of the slotted content.
  if (parent instanceof ShadowRoot) return parent.host;

  return parent;
}

/**
 * Walks from the touch target up to (but not including) `root` and returns the
 * first scrollable element on the axis, `root` itself when it scrolls, or `null`.
 */
export function findScrollableTouchTarget(
  target: EventTarget | null,
  root: HTMLElement,
  axis: ScrollAxis
): HTMLElement | null {
  let node: Node | null = target instanceof HTMLElement ? target : null;

  while (node instanceof HTMLElement && node !== root && !isLastTraversableNode(node)) {
    if (isScrollable(node, axis)) return node;

    node = getParentNode(node);
  }

  return isScrollable(root, axis) ? root : null;
}

export function hasScrollableAncestor(target: HTMLElement, root: HTMLElement, axes: ScrollAxis[]) {
  let node: Node | null = target;

  while (node instanceof HTMLElement && node !== root && !isLastTraversableNode(node)) {
    if (axes.some(axis => isScrollable(node as HTMLElement, axis))) return true;

    node = getParentNode(node);
  }

  return false;
}

export function getScrollMetrics(scrollTarget: HTMLElement, axis: ScrollAxis) {
  if (axis === 'vertical') {
    const max = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight);

    return { offset: scrollTarget.scrollTop, max };
  }

  const max = Math.max(0, scrollTarget.scrollWidth - scrollTarget.clientWidth);

  return { offset: scrollTarget.scrollLeft, max };
}

export function hasScrollableContentOnAxis(scrollTarget: HTMLElement, axis: ScrollAxis) {
  return getScrollMetrics(scrollTarget, axis).max > 0;
}

function shouldDismissFromStartEdge(direction: SwipeDirection, axis: ScrollAxis) {
  return axis === 'vertical' ? direction === 'down' : direction === 'right';
}

/**
 * Whether a scrollable rests at the edge a dismiss would start from, so the
 * gesture may be claimed for the drawer instead of the native scroll.
 */
export function isAtSwipeStartEdge(scrollTarget: HTMLElement, axis: ScrollAxis, direction: SwipeDirection) {
  const dismissFromStartEdge = shouldDismissFromStartEdge(direction, axis);
  const { offset, max } = getScrollMetrics(scrollTarget, axis);

  return dismissFromStartEdge ? offset <= 0 : offset >= max;
}

export function canSwipeFromScrollEdgeOnMove(
  scrollTarget: HTMLElement,
  axis: ScrollAxis,
  direction: SwipeDirection,
  delta: number
) {
  const dismissFromStartEdge = shouldDismissFromStartEdge(direction, axis);
  const movingTowardDismiss = dismissFromStartEdge ? delta > 0 : delta < 0;

  if (!movingTowardDismiss) return false;

  return isAtSwipeStartEdge(scrollTarget, axis, direction);
}

/**
 * Per-move arbitration between the drawer swipe and a native cross-axis scroll.
 * Returns `true` when the move must be left alone — either because the cross
 * axis already won the gesture, or because neither axis has passed the slop yet
 * and the gesture cannot be attributed (on iOS, `preventDefault` on the first
 * cancelable touchmove cancels native scrolling for the entire gesture).
 */
export function shouldYieldTouchMove(
  touchState: TouchScrollState,
  event: TouchEvent,
  touch: Touch,
  isVerticalScrollAxis: boolean
) {
  if (touchState.preserveNativeCrossAxisScroll) return true;

  // Attribution happens once per gesture; re-arbitrating after the drawer axis
  // has won would freeze the popup and drop `preventDefault()`.
  if (touchState.drawerAxisAttributed || touchState.allowSwipe === true || !touchState.hasCrossAxisScrollableContent) {
    return false;
  }

  // A non-cancelable touchmove means the browser already committed the gesture
  // to a native scroll; claiming it would drag the popup alongside the content.
  if (!event.cancelable) {
    touchState.preserveNativeCrossAxisScroll = true;
    return true;
  }

  const drawerAxisGestureDelta = isVerticalScrollAxis
    ? touch.clientY - touchState.startY
    : touch.clientX - touchState.startX;
  const crossAxisGestureDelta = isVerticalScrollAxis
    ? touch.clientX - touchState.startX
    : touch.clientY - touchState.startY;
  const absDrawerAxisGestureDelta = Math.abs(drawerAxisGestureDelta);
  const absCrossAxisGestureDelta = Math.abs(crossAxisGestureDelta);

  if (
    absCrossAxisGestureDelta >= AXIS_LOCK_SLOP &&
    absCrossAxisGestureDelta > absDrawerAxisGestureDelta + AXIS_LOCK_BIAS
  ) {
    touchState.preserveNativeCrossAxisScroll = true;
    return true;
  }

  if (absDrawerAxisGestureDelta >= AXIS_LOCK_SLOP) {
    touchState.drawerAxisAttributed = true;
    return false;
  }

  return true;
}

/**
 * Whether a drag must be ignored because an active text selection (or a focused
 * text control mid-selection) covers the gesture surface.
 */
export function shouldIgnoreSwipeForTextSelection(doc: Document, rootElement: HTMLElement) {
  const activeEl = doc.activeElement;

  if (activeEl && rootElement.contains(activeEl) && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
    const input = activeEl as HTMLInputElement | HTMLTextAreaElement;

    if (input.selectionStart != null && input.selectionEnd != null && input.selectionStart < input.selectionEnd) {
      return true;
    }
  }

  const selection = doc.getSelection?.();

  if (!selection || selection.isCollapsed) return false;

  const anchor =
    (selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement) ?? null;
  const focus =
    (selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement) ?? null;

  return (
    selection.containsNode(rootElement, true) ||
    (anchor !== null && rootElement.contains(anchor)) ||
    (focus !== null && rootElement.contains(focus))
  );
}

export function isTouchEventOnRangeInput(event: TouchEvent) {
  return event.composedPath().some(target => target instanceof HTMLInputElement && target.type === 'range');
}

type ElementFromPointRoot = Node & Partial<Pick<Document, 'elementFromPoint'>>;

// `document.elementFromPoint` retargets shadow content to the shadow host, which
// then fails `contains()` checks against a popup inside that shadow root, so
// callers pass `getRootNode()` (a document or a shadow root) instead.
export function getElementAtPoint(root: Node | null | undefined, x: number, y: number): Element | null {
  const fromPoint = (root as ElementFromPointRoot | null)?.elementFromPoint;

  return typeof fromPoint === 'function' ? (fromPoint.call(root, x, y) ?? null) : null;
}
