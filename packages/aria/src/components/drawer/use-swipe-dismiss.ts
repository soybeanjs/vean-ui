import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { isClient } from '../../shared';
import type { SwipeDirection } from '../../types';
import { SWIPE_GESTURE } from './shared';
import { findScrollableTouchTarget, getElementAtPoint } from './scroll-arbitration';
import type { ScrollAxis } from './scroll-arbitration';

interface SwipeSample {
  time: number;
  x: number;
  y: number;
}

interface SwipePoint {
  x: number;
  y: number;
}

interface SwipeOrigin extends SwipePoint {
  target: EventTarget | null;
}

export interface SwipeProgressDetails {
  deltaX: number;
  deltaY: number;
  direction: SwipeDirection | undefined;
}

export interface SwipeReleaseDetails {
  event: PointerEvent | TouchEvent;
  direction: SwipeDirection | undefined;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  releaseVelocityX: number;
  releaseVelocityY: number;
}

export interface UseSwipeDismissOptions {
  /** Whether the gesture is currently allowed. */
  enabled: Ref<boolean> | boolean;
  /** The element the gesture starts from. */
  elementRef: Ref<HTMLElement | null | undefined>;
  /** Directions that commit a dismiss. */
  directions: Ref<SwipeDirection[]> | SwipeDirection[];
  /** CSS custom properties that receive the live movement. */
  movementCssVars?: { x?: string; y?: string };
  /**
   * Freeze `transition` and write movement vars on the element while dragging.
   * Enable only when the consumer CSS derives the element position from the vars.
   */
  trackDrag?: boolean;
  /**
   * Selector of interactive elements where a swipe must not start.
   *
   * @default 'button,a,input,select,textarea,label,[role="button"]'
   */
  ignoreSelector?: string;
  /** Whether touch gestures respect `ignoreSelector` too. */
  ignoreSelectorWhenTouch?: boolean;
  /**
   * Skip the engine's own scrollable-ancestor arbitration. Enable when the host
   * owns touch scroll arbitration through a native touchmove pipeline.
   */
  ignoreScrollableAncestors?: boolean;
  /**
   * Travel (px) that commits a dismiss, or a resolver receiving the element and direction.
   */
  swipeThreshold?: number | ((details: { element: HTMLElement; direction: SwipeDirection }) => number);
  /** Extra gate evaluated on press and again on the first qualifying move. */
  canStart?: (position: SwipePoint, details: { nativeEvent: PointerEvent | TouchEvent }) => boolean;
  /** Called once a gesture activates. */
  onSwipeStart?: (event: PointerEvent | TouchEvent) => void;
  /** Called once a dismiss gesture commits. */
  onDismiss?: (event: PointerEvent | TouchEvent, details: { direction: SwipeDirection }) => void;
  /** Called when a gesture starts (`true`) and ends (`false`). */
  onSwipingChange?: (swiping: boolean) => void;
  /** Called with the live progress along the permitted direction, in the `[0, 1]` range. */
  onProgress?: (progress: number, details?: SwipeProgressDetails) => void;
  /**
   * Release decision hook. Return `true` to dismiss, `false` to settle back in place;
   * the default threshold decision applies when the hook returns nothing.
   */
  onRelease?: (details: SwipeReleaseDetails) => boolean | void;
  /** Called when a gesture is aborted without a release (pointercancel, takeover). */
  onCancel?: (event: PointerEvent | TouchEvent) => void;
}

const HORIZONTAL: SwipeDirection[] = ['left', 'right'];

const DEFAULT_SWIPE_THRESHOLD = SWIPE_GESTURE.DISMISS_DISTANCE;

const DEFAULT_IGNORE_SELECTOR = 'button,a,input,select,textarea,label,[role="button"]';

const MIN_VELOCITY_DURATION_MS = 50;

const MAX_RELEASE_VELOCITY_AGE_MS = SWIPE_GESTURE.VELOCITY_WINDOW;

function isHorizontal(direction: SwipeDirection) {
  return HORIZONTAL.includes(direction);
}

/** Signed travel along a direction; negative means moving against it. */
export function getDisplacement(direction: SwipeDirection | undefined, deltaX: number, deltaY: number) {
  if (!direction) return 0;

  const table = { up: -deltaY, down: deltaY, left: -deltaX, right: deltaX } as const;

  return table[direction];
}

/** Square-root resistance applied when the gesture moves against every permitted direction. */
function dampAxis(delta: number, allowed: boolean) {
  return allowed ? delta : Math.sign(delta) * Math.abs(delta) ** 0.5;
}

/** Reads the element's current translate/scale so a drag starts from the visual position. */
function getElementTransform(element: HTMLElement) {
  const transform = window.getComputedStyle(element).transform;
  const matrix = transform?.match(/^matrix(3d)?\((.+)\)$/);

  if (!matrix) return { x: 0, y: 0, scale: 1 };

  if (matrix[1]) {
    const values = matrix[2]!.split(',').map(Number);

    return { x: values[12] ?? 0, y: values[13] ?? 0, scale: values[0] || 1 };
  }

  const values = matrix[2]!.split(',').map(Number);

  return { x: values[4] ?? 0, y: values[5] ?? 0, scale: values[0] || 1 };
}

function getElementSize(element: HTMLElement | null | undefined, axis: 'x' | 'y') {
  const rect = element?.getBoundingClientRect();

  if (axis === 'x') return rect?.width || window.innerWidth;

  return rect?.height || window.innerHeight;
}

function hasPrimaryButton(event: PointerEvent) {
  return event.buttons % 2 === 1;
}

function capturePointer(
  element: HTMLElement,
  pointerId: number,
  method: 'setPointerCapture' | 'releasePointerCapture'
) {
  try {
    element[method]?.(pointerId);
  } catch {
    // The pointer may already be gone; a lost capture only ends the drag early.
  }
}

/**
 * Swipe gesture primitive behind the drawer popup and swipe area.
 *
 * It owns the behaviours a plain pointer handler cannot express: axis locking
 * (a diagonal gesture must not half-open a drawer), direction damping (moving
 * the wrong way meets resistance instead of doing nothing), reverse cancel
 * (a change of mind reverts instead of committing), sampled velocity (release
 * intent is measured over a sliding window so it does not depend on frame
 * rate), and scroll arbitration (a gesture that starts inside a scrollable
 * container keeps scrolling instead of being swallowed — fully externalizable
 * to a host that runs a native touchmove pipeline).
 */
export function useSwipeDismiss(options: UseSwipeDismissOptions) {
  const {
    movementCssVars,
    ignoreSelector = DEFAULT_IGNORE_SELECTOR,
    ignoreSelectorWhenTouch = true,
    ignoreScrollableAncestors = false,
    onDismiss,
    onSwipingChange,
    onProgress,
    onRelease,
    onCancel,
    onSwipeStart,
    canStart
  } = options;

  const enabled = computed(() => (typeof options.enabled === 'boolean' ? options.enabled : options.enabled.value));
  const directions = computed(() =>
    Array.isArray(options.directions) ? options.directions : options.directions.value
  ) as ComputedRef<SwipeDirection[]>;
  const trackDrag = options.trackDrag ?? false;

  const swiping = ref(false);
  const claimed = ref(false);
  const dragDismissed = ref(false);
  const currentDirection = ref<SwipeDirection | undefined>(undefined);

  let origin: SwipeOrigin | null = null;
  let axis: 'x' | 'y' | null = null;
  let intendedDirection: SwipeDirection | undefined;
  let maxDisplacement = 0;
  let cancelledSwipe = false;
  let cancelBaseline: SwipePoint | null = null;
  let samples: SwipeSample[] = [];
  let startTime: number | null = null;
  let lastSample: SwipeSample | null = null;
  let lastDragVelocity: SwipePoint = { x: 0, y: 0 };
  let lastDetails: SwipeProgressDetails | null = null;
  let progress = 0;
  let threshold: number = DEFAULT_SWIPE_THRESHOLD;
  let yielded = false;
  let sawPrimaryButtons = false;
  let pendingStart: SwipePoint | null = null;
  let initialTransform = { x: 0, y: 0, scale: 1 };
  let dragOffset = { x: 0, y: 0 };
  let transitionSnapshot: string | null = null;
  let swipingRefValue = false;
  let swipeFromScrollable = false;
  let arbitrationExternal = ignoreScrollableAncestors;

  const allows = (direction: SwipeDirection) => directions.value.includes(direction);
  const hasHorizontal = computed(() => directions.value.some(isHorizontal));
  const hasVertical = computed(() => directions.value.some(direction => !isHorizontal(direction)));

  function setSwiping(next: boolean) {
    if (swipingRefValue === next) return;

    swipingRefValue = next;
    swiping.value = next;
    onSwipingChange?.(next);
  }

  function clearMovementVars() {
    const target = options.elementRef.value;

    if (!target || !movementCssVars) return;

    if (movementCssVars.x) target.style.removeProperty(movementCssVars.x);
    if (movementCssVars.y) target.style.removeProperty(movementCssVars.y);
  }

  function syncDragStyles(dragging: boolean) {
    const target = options.elementRef.value;

    if (trackDrag && target) {
      if (dragging) {
        if (transitionSnapshot === null) transitionSnapshot = target.style.transition;
        target.style.transition = 'none';
      } else if (transitionSnapshot !== null) {
        target.style.transition = transitionSnapshot;
        transitionSnapshot = null;
      }
    }

    if (!target || !movementCssVars) return;

    const deltaX = dragOffset.x - initialTransform.x;
    const deltaY = dragOffset.y - initialTransform.y;

    if (movementCssVars.x) target.style.setProperty(movementCssVars.x, `${deltaX}px`);
    if (movementCssVars.y) target.style.setProperty(movementCssVars.y, `${deltaY}px`);
  }

  function resetState() {
    origin = null;
    axis = null;
    intendedDirection = undefined;
    maxDisplacement = 0;
    cancelledSwipe = false;
    cancelBaseline = null;
    samples = [];
    startTime = null;
    yielded = false;
    sawPrimaryButtons = false;
    pendingStart = null;
    dragOffset = { ...initialTransform };
    lastDetails = null;
    currentDirection.value = undefined;
    claimed.value = false;
    swipeFromScrollable = false;
  }

  function updateProgress(next: number, details?: SwipeProgressDetails) {
    const clamped = Number.isFinite(next) ? Math.min(1, Math.max(0, next)) : 0;
    const detailsChanged =
      details !== undefined &&
      (!lastDetails ||
        lastDetails.deltaX !== details.deltaX ||
        lastDetails.deltaY !== details.deltaY ||
        lastDetails.direction !== details.direction);

    if (clamped === progress && !detailsChanged) return;

    progress = clamped;
    if (details) lastDetails = details;
    onProgress?.(clamped, details);
  }

  function resolveThreshold(direction: SwipeDirection | undefined) {
    if (!direction || typeof options.swipeThreshold !== 'function') return;

    const element = options.elementRef.value;
    if (!element) return;

    threshold = Math.max(0, options.swipeThreshold({ element, direction }));
  }

  function sampleVelocity(point: SwipeSample) {
    samples = samples.filter(sample => point.time - sample.time <= SWIPE_GESTURE.VELOCITY_WINDOW);
    samples.push(point);
    lastSample = point;

    if (samples.length < 2) return 0;

    const first = samples[0]!;
    const elapsed = point.time - first.time;

    if (elapsed <= 0) return 0;

    return getDisplacement(intendedDirection, point.x - first.x, point.y - first.y) / elapsed;
  }

  /** Whether an ancestor can still scroll along the locked axis in the gesture direction. */
  function isScrollableAncestor(axisLock: 'x' | 'y', travel: number) {
    let node = origin?.target as HTMLElement | null | undefined;
    const stop = options.elementRef.value;

    while (node && node !== stop) {
      if (node instanceof HTMLElement) {
        const style = window.getComputedStyle(node);
        const overflow = axisLock === 'x' ? style.overflowX : style.overflowY;
        const scrollable = overflow === 'auto' || overflow === 'scroll';

        if (scrollable) {
          const size = axisLock === 'x' ? node.scrollWidth - node.clientWidth : node.scrollHeight - node.clientHeight;
          const position = axisLock === 'x' ? node.scrollLeft : node.scrollTop;
          const room = travel < 0 ? position : size - position;

          if (size > 0 && room > 0) return true;
        }
      }

      node = node.parentElement;
    }

    return false;
  }

  /** The scrollable element a touch gesture begins in, if any (page scrollers excluded). */
  function findGestureScrollableTouchTarget(target: EventTarget | null) {
    const element = options.elementRef.value;

    if (!element) return null;

    const find = (searchAxis: ScrollAxis) => {
      const scrollTarget = findScrollableTouchTarget(target, element, searchAxis);

      return scrollTarget === document.body || scrollTarget === document.documentElement ? null : scrollTarget;
    };

    if (hasHorizontal.value && !hasVertical.value) return find('horizontal');
    if (hasVertical.value && !hasHorizontal.value) return find('vertical');

    return find('vertical') ?? find('horizontal');
  }

  function getTargetAtPoint(position: SwipePoint, nativeEvent: Event) {
    const root = options.elementRef.value?.getRootNode();

    return (getElementAtPoint(root, position.x, position.y) ??
      (nativeEvent.target as HTMLElement | null)) as HTMLElement | null;
  }

  function startSwipe(
    event: PointerEvent | TouchEvent,
    position: SwipePoint,
    startOptions: { ignoreScrollableTarget?: boolean; ignoreScrollableAncestors?: boolean } = {}
  ) {
    const element = options.elementRef.value;
    const target = event.target as HTMLElement | null;
    const touchLike = 'touches' in event;

    const interactive = target?.closest(ignoreSelector);
    if (interactive && (!touchLike || ignoreSelectorWhenTouch)) return false;

    // Touch: defer activation when the gesture begins inside a scrollable
    // element; the pending-move branch decides between scrolling and the drawer.
    let fromScrollable = false;

    if (touchLike) {
      const scrollTarget = findGestureScrollableTouchTarget(target);

      if (scrollTarget && !startOptions.ignoreScrollableTarget) return false;

      fromScrollable = Boolean(scrollTarget);
    }

    if (element && 'pointerId' in event) capturePointer(element, event.pointerId, 'setPointerCapture');

    origin = { x: position.x, y: position.y, target: event.target };
    pendingStart = null;
    cancelledSwipe = false;
    intendedDirection = undefined;
    maxDisplacement = 0;
    cancelBaseline = { ...position };
    samples = [{ time: event.timeStamp, x: position.x, y: position.y }];
    startTime = event.timeStamp;
    lastSample = samples[0]!;
    lastDragVelocity = { x: 0, y: 0 };
    threshold = DEFAULT_SWIPE_THRESHOLD;
    initialTransform = element ? getElementTransform(element) : { x: 0, y: 0, scale: 1 };
    dragOffset = { ...initialTransform };
    swipeFromScrollable = fromScrollable;
    arbitrationExternal = ignoreScrollableAncestors || Boolean(startOptions.ignoreScrollableAncestors);

    return true;
  }

  /** Whether a swipe may start from a scrollable resting at the dismiss edge. */
  function canSwipeFromScrollEdgeOnPendingMove(scrollTarget: HTMLElement, deltaX: number, deltaY: number) {
    const canSwipeOnAxis = (
      delta: number,
      scrollOffset: number,
      maxScrollOffset: number,
      allowTowardStart: boolean,
      allowTowardEnd: boolean
    ) =>
      (delta > 0 && scrollOffset <= 0 && allowTowardStart) ||
      (delta < 0 && scrollOffset >= Math.max(0, maxScrollOffset) && allowTowardEnd);

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (hasVertical.value && deltaY !== 0 && (!hasHorizontal.value || absDeltaY >= absDeltaX)) {
      return canSwipeOnAxis(
        deltaY,
        scrollTarget.scrollTop,
        scrollTarget.scrollHeight - scrollTarget.clientHeight,
        allows('down'),
        allows('up')
      );
    }

    if (hasHorizontal.value && deltaX !== 0 && (!hasVertical.value || absDeltaX > absDeltaY)) {
      return canSwipeOnAxis(
        deltaX,
        scrollTarget.scrollLeft,
        scrollTarget.scrollWidth - scrollTarget.clientWidth,
        allows('right'),
        allows('left')
      );
    }

    return null;
  }

  function touchPoint(event: TouchEvent) {
    // `touches` is empty on touchend; the release position lives in changedTouches.
    const touch = event.touches[0] ?? event.changedTouches[0];

    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleStart(event: PointerEvent | TouchEvent) {
    if (!enabled.value) return;
    if ('button' in event && event.button !== 0) return;
    // Touch is driven by the touch handlers; the pointer pipeline is for mouse/pen.
    if (!('touches' in event) && event.pointerType === 'touch') return;
    // A multi-touch start is a pinch/zoom gesture; the drawer never claims it.
    if ('touches' in event && event.touches.length > 1) return;

    const position = 'touches' in event ? touchPoint(event) : { x: event.clientX, y: event.clientY };
    if (!position) return;

    pendingStart = position;
    sawPrimaryButtons = false;

    if (canStart && !canStart(position, { nativeEvent: event })) return;

    if (startSwipe(event, position)) pendingStart = null;
  }

  function handleMoveCore(event: PointerEvent | TouchEvent, position: SwipePoint) {
    if (!origin) return;

    const deltaX = position.x - origin.x;
    const deltaY = position.y - origin.y;

    if (axis === null) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < SWIPE_GESTURE.AXIS_LOCK_THRESHOLD && absY < SWIPE_GESTURE.AXIS_LOCK_THRESHOLD) return;

      axis = absX > absY ? (hasHorizontal.value ? 'x' : null) : hasVertical.value ? 'y' : null;

      if (axis === null) {
        // The dominant axis is not permitted, so this gesture is never ours.
        endGesture();
        return;
      }

      const travel = signedTravel(deltaX, deltaY);

      if (!arbitrationExternal && isScrollableAncestor(axis, travel)) {
        yielded = true;
        endGesture();
        return;
      }

      // The gesture passed the axis lock and scroll arbitration; it now owns
      // the movement along the locked axis.
      claimed.value = true;
      onSwipeStart?.(event);
      setSwiping(true);
      updateProgress(0);
      syncDragStyles(true);
    }

    // A touch move landing inside a scrollable still belongs to the scroller
    // unless the gesture started from its dismiss edge.
    if ('touches' in event && !swipeFromScrollable) {
      const target = event.target as HTMLElement | null;

      if (findGestureScrollableTouchTarget(target)) return;
    }

    // Re-baseline when the pointer reverses so a change of mind is measured
    // from the turnaround point instead of the original press.
    if (cancelBaseline) {
      if ((deltaY < 0 && position.y > cancelBaseline.y) || (deltaY > 0 && position.y < cancelBaseline.y)) {
        cancelBaseline = { x: cancelBaseline.x, y: position.y };
      }

      if ((deltaX < 0 && position.x > cancelBaseline.x) || (deltaX > 0 && position.x < cancelBaseline.x)) {
        cancelBaseline = { x: position.x, y: cancelBaseline.y };
      }
    }

    if (!intendedDirection) {
      const candidate: SwipeDirection | undefined =
        axis === 'x' ? (deltaX > 0 ? 'right' : 'left') : deltaY > 0 ? 'down' : 'up';

      if (candidate && allows(candidate)) {
        intendedDirection = candidate;
        maxDisplacement = getDisplacement(candidate, deltaX, deltaY);
        currentDirection.value = candidate;
        resolveThreshold(candidate);
      }
    } else {
      const cancelDeltaX = position.x - (cancelBaseline?.x ?? origin.x);
      const cancelDeltaY = position.y - (cancelBaseline?.y ?? origin.y);
      const displacement = getDisplacement(intendedDirection, cancelDeltaX, cancelDeltaY);

      if (displacement > threshold) {
        cancelledSwipe = false;
      } else if (maxDisplacement - displacement >= SWIPE_GESTURE.REVERSE_CANCEL_THRESHOLD) {
        // A change of mind occurred; the release must revert instead of committing.
        cancelledSwipe = true;
      }
    }

    const dampedX = hasHorizontal.value
      ? dampAxis(deltaX, allows(deltaX > 0 ? 'right' : 'left'))
      : Math.sign(deltaX) * Math.abs(deltaX) ** 0.5;
    const dampedY = hasVertical.value
      ? dampAxis(deltaY, allows(deltaY > 0 ? 'down' : 'up'))
      : Math.sign(deltaY) * Math.abs(deltaY) ** 0.5;

    dragOffset = {
      x: initialTransform.x + (axis === 'x' || axis === null ? dampedX : 0),
      y: initialTransform.y + (axis === 'y' || axis === null ? dampedY : 0)
    };

    syncDragStyles(true);
    // Velocity is sampled from raw pointer positions (one consistent frame);
    // sampling the damped transform output would blend the popup's initial
    // transform offset into the delta and corrupt short-window velocities.
    sampleVelocity({ time: event.timeStamp, x: position.x, y: position.y });

    const dragDeltaX = dragOffset.x - initialTransform.x;
    const dragDeltaY = dragOffset.y - initialTransform.y;
    const progressDirection = directions.value.length === 1 ? directions.value[0] : intendedDirection;
    const size = getElementSize(
      options.elementRef.value,
      progressDirection && isHorizontal(progressDirection) ? 'x' : 'y'
    );
    const displacement = getDisplacement(progressDirection, dragDeltaX, dragDeltaY);

    updateProgress(size > 0 && displacement > 0 ? displacement / size : 0, {
      deltaX: dragDeltaX,
      deltaY: dragDeltaY,
      direction: intendedDirection
    });
  }

  function signedTravel(deltaX: number, deltaY: number) {
    let best = Number.NEGATIVE_INFINITY;

    for (const direction of directions.value) {
      const value = getDisplacement(direction, deltaX, deltaY);

      if (value > best) best = value;
    }

    return Number.isFinite(best) ? best : 0;
  }

  function handleMove(event: PointerEvent | TouchEvent) {
    if (!enabled.value || yielded) return;

    // Touch is driven by the touch handlers; the pointer pipeline is for mouse/pen.
    if (!('touches' in event) && event.pointerType === 'touch') return;

    // A drag that grew a second finger became a pinch/zoom; abandon it and
    // leave the gesture to the browser.
    if ('touches' in event && event.touches.length > 1) {
      if (origin) cancelSwipe(event);

      return;
    }

    const position = 'touches' in event ? touchPoint(event) : { x: event.clientX, y: event.clientY };

    if (!position) return;

    if (!origin && pendingStart) {
      // The press was deferred (scrollable under the finger or a failed gate);
      // decide now whether the gesture may activate from this move.
      if (!('touches' in event)) {
        if (event.defaultPrevented) {
          pendingStart = null;
          return;
        }

        if (canStart && !canStart(position, { nativeEvent: event })) return;

        if (startSwipe(event, position)) pendingStart = null;
      } else {
        const element = options.elementRef.value;

        if (element && canStart && !canStart(position, { nativeEvent: event })) return;

        const scrollTarget = findGestureScrollableTouchTarget(getTargetAtPoint(position, event));

        if (scrollTarget && element && (element.contains(scrollTarget) || scrollTarget.contains(element))) {
          const canSwipeFromEdge = canSwipeFromScrollEdgeOnPendingMove(
            scrollTarget,
            position.x - pendingStart.x,
            position.y - pendingStart.y
          );

          if (canSwipeFromEdge === false) return;

          if (canSwipeFromEdge === true) {
            const startOrigin = pendingStart;
            const started = startSwipe(event, position, {
              ignoreScrollableTarget: true,
              ignoreScrollableAncestors: true
            });

            if (started && startOrigin) {
              // Preserve the displacement between touchstart and the claiming
              // move so quick flicks from the scroll edge still register.
              pendingStart = null;
              origin = { x: startOrigin.x, y: startOrigin.y, target: event.target };
              cancelBaseline = { ...startOrigin };
            }
          }
        } else if (startSwipe(event, position)) {
          pendingStart = null;
        }
      }
    }

    if (!origin) return;

    if (!('touches' in event)) {
      if (event.buttons !== 0 && !hasPrimaryButton(event)) {
        cancelSwipe(event);
        return;
      }

      if (hasPrimaryButton(event)) sawPrimaryButtons = true;

      // A `buttons: 0` move after a primary-button drag means the button was
      // already released (fast trackpad flicks dispatch it right before
      // pointerup); treat it as the release.
      if (event.buttons === 0 && sawPrimaryButtons) {
        handleEnd(event);
        return;
      }

      if (event.cancelable) event.preventDefault();
    }

    handleMoveCore(event, position);
  }

  function cancelSwipe(event: PointerEvent | TouchEvent) {
    resetState();

    if (swipingRefValue) {
      setSwiping(false);
      syncDragStyles(false);
      clearMovementVars();
      updateProgress(0);
    }

    onCancel?.(event);
  }

  function endGesture() {
    resetState();

    if (swipingRefValue) {
      setSwiping(false);
      syncDragStyles(false);
      clearMovementVars();
      updateProgress(0);
    }
  }

  function handleEnd(event: PointerEvent | TouchEvent) {
    if (!enabled.value) return;

    // Touch is driven by the touch handlers; the pointer pipeline is for mouse/pen.
    if (!('touches' in event) && event.pointerType === 'touch') return;

    const wasSwiping = swipingRefValue;

    if (pendingStart) {
      resetState();
      updateProgress(0);
      return;
    }

    if (!wasSwiping || !origin) {
      endGesture();
      return;
    }

    setSwiping(false);

    const element = options.elementRef.value;
    const position = 'touches' in event ? touchPoint(event) : { x: event.clientX, y: event.clientY };

    if (element && 'pointerId' in event) capturePointer(element, event.pointerId, 'releasePointerCapture');

    const deltaX = dragOffset.x - initialTransform.x;
    const deltaY = dragOffset.y - initialTransform.y;
    const endTime = event.timeStamp;
    const duration = startTime !== null && endTime > startTime ? endTime - startTime : 0;
    const velocityDuration = duration > 0 ? Math.max(duration, MIN_VELOCITY_DURATION_MS) : 0;
    const velocityX = velocityDuration > 0 ? deltaX / velocityDuration : 0;
    const velocityY = velocityDuration > 0 ? deltaY / velocityDuration : 0;

    let releaseVelocityX = lastDragVelocity.x;
    let releaseVelocityY = lastDragVelocity.y;

    if (lastSample && position && endTime >= lastSample.time) {
      const age = endTime - lastSample.time;

      if (age > MAX_RELEASE_VELOCITY_AGE_MS) {
        releaseVelocityX = 0;
        releaseVelocityY = 0;
      } else {
        // Tail velocity: from the final sampled move to the release position,
        // so a flick keeps its momentum even though `dragOffset` freezes at the
        // last move event.
        const sampleDuration = Math.max(age, 16);
        releaseVelocityX = (position.x - lastSample.x) / sampleDuration;
        releaseVelocityY = (position.y - lastSample.y) / sampleDuration;
      }
    }

    const details: SwipeReleaseDetails = {
      event,
      direction: intendedDirection,
      deltaX,
      deltaY,
      velocityX,
      velocityY,
      releaseVelocityX,
      releaseVelocityY
    };

    const decision = onRelease?.(details);
    const hasDecision = typeof decision === 'boolean';
    let shouldDismiss = decision === true;
    let dismissDirection = intendedDirection;

    if (!hasDecision) {
      if (!cancelledSwipe) {
        const travel = Math.abs(signedTravel(deltaX, deltaY));

        if (travel >= threshold) {
          shouldDismiss = true;
        } else {
          const velocity = position ? sampleVelocity({ time: endTime, x: position.x, y: position.y }) : 0;

          shouldDismiss = Math.abs(velocity) >= SWIPE_GESTURE.VELOCITY_THRESHOLD;
        }
      }
    }

    if (shouldDismiss && dismissDirection) {
      dragDismissed.value = true;
      currentDirection.value = dismissDirection;
      // Keep the movement vars so the popup exits from its dragged position;
      // restore the transition before clearing the internal gesture state.
      syncDragStyles(false);
      resetState();
      onDismiss?.(event, { direction: dismissDirection });
    } else {
      dragOffset = { ...initialTransform };
      resetState();
      syncDragStyles(false);
      clearMovementVars();
      updateProgress(0);
    }
  }

  /** Feeds a native touchmove into the swipe pipeline from a capture-phase listener. */
  function moveNative(nativeEvent: TouchEvent) {
    handleMove(nativeEvent);
  }

  function reset() {
    dragDismissed.value = false;
    endGesture();
    clearMovementVars();
  }

  useEventListener(options.elementRef, 'pointerdown', handleStart as (event: PointerEvent) => void);

  if (isClient) {
    // Pointer moves and releases are tracked on the window so a gesture that
    // leaves the element still resolves instead of staying stuck. Touch events
    // are bound by the host (`touchHandlers`): touch targets never leave the
    // start element, and a capture-phase pipeline may claim moves first.
    useEventListener(window, 'pointermove', handleMove as (event: PointerEvent) => void);
    useEventListener(window, 'pointerup', handleEnd as (event: PointerEvent) => void);
    useEventListener(window, 'pointercancel', cancelSwipe as (event: PointerEvent) => void);
  }

  const touchHandlers = {
    onTouchStart: handleStart as (event: TouchEvent) => void,
    onTouchMove: handleMove as (event: TouchEvent) => void,
    onTouchEnd: handleEnd as (event: TouchEvent) => void,
    onTouchCancel: cancelSwipe as (event: TouchEvent) => void
  };

  return {
    swiping,
    claimed,
    swipeDirection: currentDirection,
    dragDismissed,
    touchHandlers,
    moveNative,
    cancel: endGesture,
    reset
  };
}
