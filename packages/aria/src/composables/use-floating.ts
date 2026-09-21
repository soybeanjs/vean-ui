import { computed, getCurrentScope, onScopeDispose, shallowReadonly, shallowRef, toValue, watch } from 'vue';
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue';
import { computePosition } from '@floating-ui/dom';
import type {
  FloatingElement,
  Middleware,
  MiddlewareData,
  Placement,
  ReferenceElement,
  Strategy
} from '@floating-ui/dom';
import { isNullish } from '../shared';

export type UseFloatingOptions<T extends ReferenceElement = ReferenceElement> = {
  /**
   * Represents the open/close state of the floating element.
   * @default true
   */
  open?: MaybeRefOrGetter<boolean | undefined>;
  /**
   * Where to place the floating element relative to its reference element.
   * @default 'bottom'
   */
  placement?: MaybeRefOrGetter<Placement | undefined>;
  /**
   * The type of CSS position property to use.
   * @default 'absolute'
   */
  strategy?: MaybeRefOrGetter<Strategy | undefined>;
  /**
   * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
   * @default undefined
   */
  middleware?: MaybeRefOrGetter<Middleware[] | undefined>;
  /**
   * Whether to use `transform` instead of `top` and `left` styles to
   * position the floating element (`floatingStyles`).
   * @default true
   */
  transform?: MaybeRefOrGetter<boolean | undefined>;
  /**
   * Callback to handle mounting/unmounting of the elements.
   * @default undefined
   */
  whileElementsMounted?: (reference: T, floating: FloatingElement, update: () => void) => () => void;
};

export type UseFloatingReturn = {
  /**
   * The x-coord of the floating element.
   */
  x: Readonly<Ref<number>>;
  /**
   * The y-coord of the floating element.
   */
  y: Readonly<Ref<number>>;
  /**
   * The stateful placement, which can be different from the initial `placement` passed as options.
   */
  placement: Readonly<Ref<Placement>>;
  /**
   * The type of CSS position property to use.
   */
  strategy: Readonly<Ref<Strategy>>;
  /**
   * Additional data from middleware.
   */
  middlewareData: Readonly<Ref<MiddlewareData>>;
  /**
   * The boolean that let you know if the floating element has been positioned.
   */
  isPositioned: Readonly<Ref<boolean>>;
  /**
   * CSS styles to apply to the floating element to position it.
   */
  floatingStyles: Readonly<
    Ref<{
      position: Strategy;
      top: string;
      left: string;
      transform?: string;
      willChange?: string;
    }>
  >;
  /**
   * The function to update floating position manually.
   */
  update: () => void;
};

/**
 * Computes the `x` and `y` coordinates that will place the floating element next to a reference element when it is given a certain CSS positioning strategy.
 * @param reference The reference template ref.
 * @param floating The floating template ref.
 * @param options The floating options.
 */
export function useFloating<T extends ReferenceElement = ReferenceElement>(
  referenceElement: ShallowRef<T | null | undefined>,
  floatingElement: ShallowRef<FloatingElement | null | undefined>,
  options: UseFloatingOptions<T> = {}
): UseFloatingReturn {
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = computed(() => toValue(options.open) ?? true);
  const middlewareOption = computed(() => toValue(options.middleware));
  const placementOption = computed(() => toValue(options.placement) ?? 'bottom');
  const strategyOption = computed(() => toValue(options.strategy) ?? 'absolute');
  const transformOption = computed(() => toValue(options.transform) ?? true);
  const x = shallowRef(0);
  const y = shallowRef(0);
  const strategy = shallowRef(strategyOption.value);
  const placement = shallowRef(placementOption.value);
  const middlewareData = shallowRef<MiddlewareData>({});
  const isPositioned = shallowRef(false);
  const floatingStyles = computed(() => {
    const initialStyles = {
      position: strategy.value,
      left: '0',
      top: '0'
    };

    if (!floatingElement.value) {
      return initialStyles;
    }

    const xVal = roundByDPR(floatingElement.value, x.value);
    const yVal = roundByDPR(floatingElement.value, y.value);

    if (transformOption.value) {
      return {
        ...initialStyles,
        transform: `translate(${xVal}px, ${yVal}px)`,
        ...(getDPR(floatingElement.value) >= 1.5 && { willChange: 'transform' })
      };
    }

    return {
      position: strategy.value,
      left: `${xVal}px`,
      top: `${yVal}px`
    };
  });

  let whileElementsMountedCleanup: (() => void) | undefined;

  function update() {
    if (isNullish(referenceElement.value) || isNullish(floatingElement.value)) {
      return;
    }

    const open = openOption.value;

    computePosition(referenceElement.value, floatingElement.value, {
      middleware: middlewareOption.value,
      placement: placementOption.value,
      strategy: strategyOption.value
    }).then(position => {
      x.value = position.x;
      y.value = position.y;
      strategy.value = position.strategy;
      placement.value = position.placement;
      middlewareData.value = position.middlewareData;
      /**
       * The floating element's position may be recomputed while it's closed
       * but still mounted (such as when transitioning out). `isPositioned`
       * must then stay `true` so the exit animation plays in place (inline
       * `animation: none` fallback and the off-screen transform are bound to
       * it); the re-enter of the unpositioned state on the next open is
       * handled by `reset()`. Only flag as positioned while open (or when no
       * `open` option is specified).
       */
      if (open !== false) {
        isPositioned.value = true;
      }
    });
  }

  function cleanup() {
    if (typeof whileElementsMountedCleanup === 'function') {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = undefined;
    }
  }

  function attach() {
    cleanup();

    if (whileElementsMountedOption === undefined) {
      update();
      return;
    }

    if (!isNullish(referenceElement.value) && !isNullish(floatingElement.value)) {
      whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
    }
  }

  function reset() {
    // A fresh open starts a new positioning cycle: re-enter the unpositioned state so the first
    // frame stays hidden at the fallback transform until `computePosition` resolves. While closed
    // (exit transition / forceMount), keep the last position so the out-animation plays in place.
    if (openOption.value) {
      isPositioned.value = false;
    }
  }

  watch([middlewareOption, placementOption, strategyOption, openOption], update, {
    flush: 'sync'
  });
  watch([referenceElement, floatingElement], attach, { flush: 'sync' });
  watch(openOption, reset, { flush: 'sync' });

  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }

  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    strategy: shallowReadonly(strategy),
    placement: shallowReadonly(placement),
    middlewareData: shallowReadonly(middlewareData),
    isPositioned: shallowReadonly(isPositioned),
    floatingStyles,
    update
  };
}

function getDPR(element: Element): number {
  if (typeof window === 'undefined') {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element: Element, value: number) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
