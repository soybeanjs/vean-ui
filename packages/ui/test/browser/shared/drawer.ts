import { defineComponent, h, ref } from 'vue';
import type { Ref } from 'vue';
import SDrawer from '@/components/drawer/drawer.vue';
import type { DrawerProps } from '@/components/drawer/types';
import { renderComponent } from './render';

/**
 * Gesture test helpers for the drawer e2e specs.
 *
 * Pointer swipes are dispatched as real PointerEvents whose `timeStamp` is
 * pinned per step (the engine derives release velocity from event time, not
 * the wall clock), so velocity-based contracts stay deterministic. Touch
 * arbitration is driven with synthetic TouchEvents dispatched on real DOM
 * targets so the capture-phase pipeline sees truthful hit testing.
 */

export const POPUP_SELECTOR = '[data-vean-drawer-popup]';
export const SWIPE_AREA_SELECTOR = '[data-vean-drawer-swipe-area]';

export const SNAP_OFFSET_VAR = '--vean-drawer-snap-point-offset';
export const MOVEMENT_Y_VAR = '--vean-drawer-swipe-movement-y';
export const MOVEMENT_X_VAR = '--vean-drawer-swipe-movement-x';
export const HEIGHT_VAR = '--vean-drawer-height';

export const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export function getPopups() {
  return Array.from(document.querySelectorAll<HTMLElement>(POPUP_SELECTOR));
}

export function getSwipeArea() {
  return document.querySelector<HTMLElement>(SWIPE_AREA_SELECTOR);
}

/** The drag origin for a bottom drawer popup: centered horizontally, on the handle. */
export function popupDragPoint(popup: HTMLElement) {
  const rect = popup.getBoundingClientRect();

  return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + 16) };
}

/** Popup measured height (`--vean-drawer-height`), or 0 before the first measurement. */
export function popupHeight(popup: HTMLElement) {
  return Number.parseFloat(popup.style.getPropertyValue(HEIGHT_VAR)) || 0;
}

/**
 * The resting translateY offset of a fractional snap point, derived from the
 * measured popup height: `offset = popupHeight - min(fraction * viewport, popupHeight)`.
 */
export function snapOffsetFor(popup: HTMLElement, fraction: number) {
  const height = popupHeight(popup);

  return height - Math.min(fraction * window.innerHeight, height);
}

export function readMovementY(popup: HTMLElement) {
  return Number.parseFloat(popup.style.getPropertyValue(MOVEMENT_Y_VAR));
}

/** Default-slot content of `count` 32px-tall rows, tall enough to overflow the popup. */
export function itemSlots(count: number) {
  return {
    default: () => Array.from({ length: count }, (_, index) => h('div', { key: index, class: 'h-8' }, 'Item'))
  };
}

// --- pointer events -----------------------------------------------------------

type PointerType = 'pointerdown' | 'pointermove' | 'pointerup';

interface PointerInit {
  timeStamp?: number;
  pointerId?: number;
}

export function createPointerEvent(type: PointerType, x: number, y: number, init: PointerInit = {}) {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    pointerId: init.pointerId ?? 1,
    pointerType: 'mouse',
    button: 0,
    buttons: type === 'pointerup' ? 0 : 1
  });

  // `timeStamp` is read-only and derived from the clock; pinning it per step
  // keeps the velocity window deterministic regardless of dispatch timing.
  if (init.timeStamp !== undefined) {
    Object.defineProperty(event, 'timeStamp', { value: init.timeStamp });
  }

  return event;
}

function dispatchPointerStep(type: PointerType, x: number, y: number, init: PointerInit = {}) {
  const event = createPointerEvent(type, x, y, init);

  if (type === 'pointerdown') {
    (document.elementFromPoint(x, y) ?? window).dispatchEvent(event);
  } else {
    window.dispatchEvent(event);
  }

  return event;
}

export interface TimedSwipeStep {
  type: 'down' | 'move' | 'up';
  x: number;
  y: number;
  time: number;
}

const POINTER_TYPE_BY_STEP = {
  down: 'pointerdown',
  move: 'pointermove',
  up: 'pointerup'
} as const;

/**
 * Dispatch a pointer gesture whose every step carries its own `timeStamp`,
 * mirroring Base UI's timed-swipe test helper: the gesture timeline no longer
 * depends on the wall clock.
 */
export async function timedSwipe(steps: TimedSwipeStep[]) {
  const events: PointerEvent[] = [];

  for (const step of steps) {
    events.push(
      dispatchPointerStep(POINTER_TYPE_BY_STEP[step.type], step.x, step.y, {
        timeStamp: step.time
      })
    );
    await sleep(0);
  }

  return events;
}

/**
 * A slow vertical drag with a pinned timeline: the release velocity lands
 * around 1px/16ms, safely below the fast-swipe threshold, so the release
 * decision is made by distance alone.
 */
export async function slowVerticalSwipe(from: { x: number; y: number }, dy: number) {
  const direction = Math.sign(dy) || 1;

  return timedSwipe([
    { type: 'down', x: from.x, y: from.y, time: 1000 },
    { type: 'move', x: from.x, y: from.y + direction, time: 1010 },
    { type: 'move', x: from.x, y: from.y + dy - direction, time: 2000 },
    { type: 'move', x: from.x, y: from.y + dy, time: 2990 },
    { type: 'up', x: from.x, y: from.y + dy, time: 3000 }
  ]);
}

/** Untimed pointer drag used by gesture contracts that do not depend on velocity. */
export async function drag(from: { x: number; y: number }, to: { x: number; y: number }, steps = 8) {
  dispatchPointerStep('pointerdown', from.x, from.y);

  for (let step = 1; step <= steps; step += 1) {
    dispatchPointerStep(
      'pointermove',
      from.x + ((to.x - from.x) * step) / steps,
      from.y + ((to.y - from.y) * step) / steps
    );
    await sleep(16);
  }

  dispatchPointerStep('pointerup', to.x, to.y);
  await sleep(60);
}

// --- touch events --------------------------------------------------------------

type TouchType = 'touchstart' | 'touchmove' | 'touchend';

interface TouchDispatchInit {
  cancelable?: boolean;
  timeStamp?: number;
}

export function createTouchEvent(
  type: TouchType,
  target: Element,
  points: Array<{ x: number; y: number }>,
  init: TouchDispatchInit = {}
) {
  const touches = points.map(
    (point, index) => new Touch({ identifier: index, target, clientX: point.x, clientY: point.y })
  );
  const ended = type === 'touchend';
  const event = new TouchEvent(type, {
    bubbles: true,
    cancelable: init.cancelable ?? true,
    touches: ended ? [] : touches,
    targetTouches: ended ? [] : touches,
    changedTouches: touches
  });

  if (init.timeStamp !== undefined) {
    Object.defineProperty(event, 'timeStamp', { value: init.timeStamp });
  }

  return event;
}

/** Dispatch a synthetic touch event on `target` and return the event for assertions. */
export function dispatchTouch(
  type: TouchType,
  target: Element,
  points: Array<{ x: number; y: number }>,
  init: TouchDispatchInit = {}
) {
  const event = createTouchEvent(type, target, points, init);

  target.dispatchEvent(event);

  return event;
}

// --- controlled drawer harness ---------------------------------------------------

export interface ControlledDrawerHandles {
  open: Ref<boolean>;
  snapPoint: Ref<number | string | null>;
  openChanges: boolean[];
  snapPointChanges: Array<number | string | null>;
  unmount: () => void;
}

interface ControlledDrawerOptions {
  open?: boolean;
  snapPoint?: number | string | null;
  slots?: Record<string, () => unknown>;
}

/**
 * Render `SDrawer` with `v-model:open` / `v-model:snapPoint` wired to test-local
 * refs, recording every `update:open` / `update:snapPoint` event.
 */
export async function renderControlledDrawer(props: DrawerProps, options: ControlledDrawerOptions = {}) {
  const open = ref(options.open ?? true);
  const snapPoint = ref<number | string | null>(options.snapPoint ?? null);
  const openChanges: boolean[] = [];
  const snapPointChanges: Array<number | string | null> = [];

  const Harness = defineComponent({
    name: 'DrawerControlledHarness',
    setup() {
      return () =>
        h(
          SDrawer,
          {
            ...props,
            open: open.value,
            // Only control the snap point when the test asks for it: passing
            // `null` would enter controlled mode, where an already-open drawer
            // receives no default fill (the fill runs on `isOpen` change only).
            snapPoint: props.snapPoints && options.snapPoint !== undefined ? snapPoint.value : undefined,
            'onUpdate:open': (value: boolean) => {
              openChanges.push(value);
              open.value = value;
            },
            'onUpdate:snapPoint': (value: number | string | null) => {
              snapPointChanges.push(value);
              snapPoint.value = value;
            }
          },
          options.slots
        );
    }
  });

  const { unmount } = await renderComponent(Harness);

  return { open, snapPoint, openChanges, snapPointChanges, unmount };
}
