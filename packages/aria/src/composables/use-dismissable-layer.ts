import {
  computed,
  onBeforeUnmount,
  onMounted,
  onWatcherCleanup,
  shallowReactive,
  toValue,
  watch,
  watchEffect
} from 'vue';
import type { MaybeRefOrGetter, ShallowRef } from 'vue';
import { handleAndDispatchCustomEvent, isClient } from '../shared';
import type { DismissableLayerEmits, EmitsToHookProps, FocusOutsideEvent, PointerDownOutsideEvent } from '../types';
import { useEscapeKeyDown } from './use-escape-key-down';

// Event type constants
const POINTER_DOWN_OUTSIDE_EVENT = 'dismissableLayer.pointerDownOutside';
const FOCUS_OUTSIDE_EVENT = 'dismissableLayer.focusOutside';
const DISMISSABLE_LAYER_DATA_ATTRIBUTE = 'data-dismissable-layer';

export interface UseDismissableLayerOptions extends EmitsToHookProps<DismissableLayerEmits> {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `DismissableLayer`. Users will
   * need to click twice on outside elements to interact with them: once to close the `DismissableLayer`, and again to
   * trigger the element.
   */
  disableOutsidePointerEvents?: MaybeRefOrGetter<boolean>;
  /**
   * Whether the layer currently counts as open. Outside interactions (`pointerdown`, focus) are only handled while this
   * is `true`, and it should be wired to the caller's `open` state for any layer kept mounted by an exit animation.
   *
   * A closed-but-still-mounted layer would otherwise keep dismissing outside interactions, and the interaction that
   * re-opens the layer is itself an outside one: the trigger's `pointerdown` opens the layer, the same event then
   * reaches the document, and the closing layer dismisses the layer it just re-opened — the popup flashes open and
   * closes again. Handling only interactions that begin while the layer is open keeps that reopen intact.
   *
   * @defaultValue true
   */
  enable?: MaybeRefOrGetter<boolean>;
  /** Handler called when the `DismissableLayer` should be dismissed */
  onDismiss?: () => void;
}

const layerContext = {
  layers: shallowReactive(new Set<HTMLElement>()),
  layersWithOutsidePointerEventsDisabled: shallowReactive(new Set<HTMLElement>()),
  branches: shallowReactive(new Set<HTMLElement>())
};

let originalBodyPointerEvents: string | undefined;

/**
 * Composable for creating dismissable layers with outside interaction handling
 *
 * @param layerElement - Reference to the dismissable layer element
 * @param options - Configuration options for the dismissable layer
 * @returns Properties and handlers for the dismissable layer
 */
export function useDismissableLayer(
  layerElement: ShallowRef<HTMLElement | undefined>,
  options: UseDismissableLayerOptions = {}
) {
  const {
    disableOutsidePointerEvents,
    enable = true,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss
  } = options;

  const ownerDocument = (): Document => layerElement.value?.ownerDocument ?? globalThis?.document;

  const index = computed(() => (layerElement.value ? Array.from(layerContext.layers).indexOf(layerElement.value) : -1));

  const isBodyPointerEventsDisabled = computed(() => layerContext.layersWithOutsidePointerEventsDisabled.size > 0);

  const isPointerEventsEnabled = computed(() => {
    const layers = Array.from(layerContext.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [
      ...layerContext.layersWithOutsidePointerEventsDisabled
    ].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = highestLayerWithOutsidePointerEventsDisabled
      ? layers.indexOf(highestLayerWithOutsidePointerEventsDisabled)
      : -1;

    return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex;
  });

  const pointerEvents = computed(() => {
    if (!isBodyPointerEventsDisabled.value) return undefined;
    return isPointerEventsEnabled.value ? 'auto' : 'none';
  });

  const { onPointerdownCapture } = usePointerdownOutside(
    layerElement,
    event => {
      if (!isPointerEventsEnabled.value) return;

      const target = event.target as HTMLElement;

      const isPointerdownOnBranch = [...layerContext.branches].some(branch => branch.contains(target));
      if (isPointerdownOnBranch) return;

      onPointerDownOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    },
    enable
  );

  const { onFocusCapture, onBlurCapture } = useFocusOutside(
    layerElement,
    event => {
      const target = event.target as HTMLElement;

      const isFocusInBranch = [...layerContext.branches].some(branch => branch.contains(target));
      if (isFocusInBranch) return;

      onFocusOutside?.(event);
      onInteractOutside?.(event);

      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    },
    enable
  );

  useEscapeKeyDown(ownerDocument, event => {
    const isHighestLayer = index.value === layerContext.layers.size - 1;

    if (!isHighestLayer) return;

    onEscapeKeyDown?.(event);

    if (!event.defaultPrevented) {
      event.preventDefault();
      onDismiss?.();
    }
  });

  /**
   * Use `watch` with explicit sources (instead of `watchEffect`) so this effect only re-runs when the layer element or
   * `disableOutsidePointerEvents` change. Reading `layerContext.layersWithOutsidePointerEventsDisabled.size` inside the
   * callback must NOT be reactive: otherwise adding/removing any other layer would re-run this effect and its cleanup
   * could prematurely restore the body's `pointer-events` while an ancestor layer is still open.
   *
   * The lock is only in force while the layer counts as open (`enable`). Its whole point is that the first outside
   * press dismisses the layer instead of activating whatever sits under the pointer — a press that lands after the
   * layer closed must not be eaten, or the exit animation turns every reopen into a click that goes nowhere.
   */
  watch(
    [layerElement, () => toValue(enable) && toValue(disableOutsidePointerEvents)],
    ([nodeVal, shouldDisableOutsidePointerEvents], _, onCleanup) => {
      if (!nodeVal) return;

      const ownerNode = ownerDocument();

      if (shouldDisableOutsidePointerEvents) {
        if (layerContext.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerNode.body.style.pointerEvents;
          ownerNode.body.style.pointerEvents = 'none';
        }
        layerContext.layersWithOutsidePointerEventsDisabled.add(nodeVal);

        // Remove this layer from the set on cleanup (re-run via prop toggle, or unmount) and restore the body's
        // `pointer-events` only once the last disabling layer is gone. Removing here — rather than relying solely on
        // the unmount-only effect below — keeps the set accurate when `disableOutsidePointerEvents` toggles to `false`
        // while still mounted (e.g. a modal Menu closing). Checking `size === 0` *after* deletion makes the restore
        // independent of cleanup ordering.
        onCleanup(() => {
          layerContext.layersWithOutsidePointerEventsDisabled.delete(nodeVal);

          if (layerContext.layersWithOutsidePointerEventsDisabled.size === 0) {
            if (!originalBodyPointerEvents) {
              ownerNode.body.style.removeProperty('pointer-events');
            } else {
              ownerNode.body.style.pointerEvents = originalBodyPointerEvents;
            }
          }
        });
      }
    },
    { immediate: true }
  );

  /**
   * Membership in the layer stack is keyed to the layer element only, so a `disableOutsidePointerEvents` toggle never
   * re-orders the stack. Members are removed only when the layer unmounts.
   */
  watch(
    layerElement,
    (nodeVal, _, onCleanup) => {
      if (!nodeVal) return;

      layerContext.layers.add(nodeVal);

      onCleanup(() => {
        layerContext.layers.delete(nodeVal);
      });
    },
    { immediate: true }
  );

  return {
    pointerEvents,
    onPointerdownCapture,
    onFocusCapture,
    onBlurCapture
  };
}

/**
 * Composable for creating dismissable layer branches that don't trigger dismissal
 *
 * @param branchElementRef - Reference to the branch element
 */
export function useDismissableLayerBranch(branchElementRef: ShallowRef<HTMLElement | undefined>): void {
  onMounted(() => {
    if (branchElementRef.value) {
      layerContext.branches.add(branchElementRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (branchElementRef.value) {
      layerContext.branches.delete(branchElementRef.value);
    }
  });
}

/**
 * Listens for `pointerdown` outside a DOM subtree. We use `pointerdown` rather than `pointerup` to mimic layer
 * dismissing behavior present in OS. Returns props to pass to the node we want to check for outside events.
 *
 * `enable` gates the listener itself: while it is `false` no outside `pointerdown` is observed at all, so a layer that
 * is dismissing must pass its `open` state here rather than filtering inside the callback.
 */
export function usePointerdownOutside(
  node: ShallowRef<HTMLElement | undefined>,
  onPointerDownOutside: (event: PointerDownOutsideEvent) => void,
  enable: MaybeRefOrGetter<boolean> = true
) {
  let isPointerInsideDOMTree = false;

  let handleClick = () => {};

  watchEffect(() => {
    if (!isClient || !toValue(enable) || !node.value) return;

    const ownerDocument = node.value.ownerDocument;

    async function handlePointerDown(event: PointerEvent) {
      if (!node.value) return;

      const target = event.target as HTMLElement;

      isPointerInsideDOMTree = isInsideDOMTree(node.value, target);

      if (target && !isPointerInsideDOMTree) {
        const eventDetail = { originalEvent: event };

        function handleAndDispatchPointerDownOutsideEvent() {
          handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE_EVENT, onPointerDownOutside, eventDetail);
        }

        /**
         * On touch devices, we need to wait for a click event because browsers implement a ~350ms delay between the
         * time the user stops touching the display and when the browser executes events. We need to ensure we don't
         * reactivate pointer-events within this timeframe otherwise the browser may execute events that should have
         * been prevented.
         *
         * Additionally, this also lets us deal automatically with cancellations when a click event isn't raised because
         * the page was considered scrolled/drag-scrolled, long-pressed, etc.
         *
         * This is why we also continuously remove the previous listener, because we cannot be certain that it was
         * raised, and therefore cleaned-up.
         */
        if (event.pointerType === 'touch') {
          ownerDocument.removeEventListener('click', handleClick);
          handleClick = handleAndDispatchPointerDownOutsideEvent;
          ownerDocument.addEventListener('click', handleClick, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent();
        }
      } else {
        // We need to remove the event listener in case the outside click has been canceled.
        // See: https://github.com/radix-ui/primitives/issues/2171
        ownerDocument.removeEventListener('click', handleClick);
      }
      isPointerInsideDOMTree = false;
    }

    /**
     * if this hook executes in a component that mounts via a `pointerdown` event, the event would bubble up to the
     * document and trigger a `pointerDownOutside` event. We avoid this by delaying the event listener registration on
     * the document. This is how the DOM works, ie:
     *
     *     button.addEventListener('pointerdown', () => {
     *       console.log('I will log');
     *       document.addEventListener('pointerdown', () => {
     *         console.log('I will also log');
     *       });
     *     });
     */
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener('pointerdown', handlePointerDown);
    }, 0);

    onWatcherCleanup(() => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener('pointerdown', handlePointerDown);
      ownerDocument.removeEventListener('click', handleClick);
    });
  });

  return {
    onPointerdownCapture: () => {
      if (!toValue(enable)) return;

      isPointerInsideDOMTree = true;
    }
  };
}

/**
 * Listens for when focus happens outside a DOM subtree. Returns props to pass to the root (node) of the subtree we want
 * to check.
 */
export function useFocusOutside(
  node: ShallowRef<HTMLElement | undefined>,
  onFocusOutside: (event: FocusOutsideEvent) => void,
  enable: MaybeRefOrGetter<boolean> = true
) {
  let isFocusInsideDOMTree = false;

  const handleFocus = (event: FocusEvent) => {
    if (!node.value) return;

    if (isFocusInsideDOMTree) return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    isFocusInsideDOMTree = isInsideDOMTree(node.value, target);

    if (!isFocusInsideDOMTree) {
      const eventDetail = { originalEvent: event };
      handleAndDispatchCustomEvent(FOCUS_OUTSIDE_EVENT, onFocusOutside, eventDetail);
    }
  };

  watchEffect(() => {
    if (!isClient || !toValue(enable) || !node.value) return;

    const ownerDocument = node.value.ownerDocument;

    ownerDocument.addEventListener('focusin', handleFocus);

    onWatcherCleanup(() => {
      ownerDocument.removeEventListener('focusin', handleFocus);
    });
  });

  return {
    onFocusCapture: () => {
      if (!toValue(enable)) return;
      isFocusInsideDOMTree = true;
    },
    onBlurCapture: () => {
      if (!toValue(enable)) return;
      isFocusInsideDOMTree = false;
    }
  };
}

function isInsideDOMTree(mainLayer: HTMLElement, targetElement: HTMLElement) {
  if (!mainLayer) return false;

  if (mainLayer.contains(targetElement)) return true;

  const mainDismissableLayer = getDismissableLayerElement(mainLayer);
  const targetLayer = targetElement.closest<HTMLElement>(`[${DISMISSABLE_LAYER_DATA_ATTRIBUTE}]`);

  if (!mainDismissableLayer || !targetLayer) return false;

  if (mainDismissableLayer === targetLayer) return true;

  // Prefer the layer stack registration order (mount order) over DOM order:
  // teleported layers are inserted at fixed portal-anchor positions, so DOM
  // order can disagree with the actual stacking order (e.g. a menubar menu
  // replaced by an earlier-anchored menu during its exit animation would
  // otherwise be treated as "outside" and dismiss the new menu).
  const stack = Array.from(layerContext.layers).map(getDismissableLayerElement);
  const mainIndex = stack.indexOf(mainDismissableLayer);
  const targetIndex = stack.indexOf(targetLayer);

  if (mainIndex !== -1 && targetIndex !== -1) {
    return mainIndex < targetIndex;
  }

  // Fallback to DOM order for layers not tracked in the stack (e.g. rendered
  // by another document or outside this layer context).
  const layerList = Array.from(
    mainDismissableLayer.ownerDocument.querySelectorAll<HTMLElement>(`[${DISMISSABLE_LAYER_DATA_ATTRIBUTE}]`)
  );

  if (layerList.indexOf(mainDismissableLayer) < layerList.indexOf(targetLayer)) return true;

  return false;
}

function getDismissableLayerElement(layerElement: HTMLElement) {
  if (layerElement.hasAttribute(DISMISSABLE_LAYER_DATA_ATTRIBUTE)) {
    return layerElement;
  }

  return layerElement.querySelector<HTMLElement>(`[${DISMISSABLE_LAYER_DATA_ATTRIBUTE}]`);
}
