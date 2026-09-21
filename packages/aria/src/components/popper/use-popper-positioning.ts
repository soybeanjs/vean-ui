import { computed, shallowRef, watchPostEffect } from 'vue';
import type { CSSProperties, ShallowRef } from 'vue';
import { autoUpdate } from '@floating-ui/dom';
import { useFloating } from '../../composables';
import {
  getFloatingUiMiddleware,
  getPlacement,
  getPlacementAlignment,
  getPlacementSide,
  popperCssVars
} from './shared';
import type { PopperPositionerProps, PopperReferenceElement } from './types';

interface UsePopperPositioningOptions {
  /** Positioning props (side / align / offsets / collision...), read reactively. */
  props: PopperPositionerProps;
  referenceElement: ShallowRef<PopperReferenceElement | null | undefined>;
  positionerElement: ShallowRef<HTMLElement | null | undefined>;
  arrowElement: ShallowRef<HTMLElement | null | undefined>;
  /** Whether the layer is open; drives `isPositioned` lifecycle inside `useFloating`. */
  open: () => boolean;
  /** Popup element whose computed z-index is inherited by the positioner. */
  popupElement: ShallowRef<HTMLElement | null | undefined>;
}

/**
 * Positioning core shared by every Popper layer: floating-ui wiring (placement,
 * middleware, autoUpdate), arrow geometry, and the positioner style (including the
 * pre-positioning off-screen transform and reference-hidden visibility). Interactive
 * concerns (dismiss / grace / focus / presence) are assembled by consumers on top.
 *
 * Optional props fall back to the `createPopperPositionerDefaultProps` values; callers
 * wiring `withDefaults` make those fallbacks unreachable.
 */
export function usePopperPositioning(options: UsePopperPositioningOptions) {
  const { props, referenceElement, positionerElement, arrowElement, open, popupElement } = options;

  const { floatingStyles, placement, isPositioned, middlewareData, update } = useFloating(
    referenceElement,
    positionerElement,
    {
      open,
      strategy: () => props.positionStrategy,
      placement: () => props.placement ?? getPlacement(props.side ?? 'bottom', props.align ?? 'center'),
      whileElementsMounted: (...args) =>
        autoUpdate(...args, {
          layoutShift: !props.disableUpdateOnLayoutShift,
          animationFrame: props.updatePositionStrategy === 'always'
        }),
      middleware: () => getFloatingUiMiddleware(props, arrowElement.value)
    }
  );

  const placedSide = computed(() => getPlacementSide(placement.value));
  const placedAlign = computed(() => getPlacementAlignment(placement.value) ?? 'center');
  const arrowCentered = computed(() => middlewareData.value.arrow?.centerOffset === 0);
  const arrowX = computed(() => middlewareData.value.arrow?.x ?? 0);
  const arrowY = computed(() => middlewareData.value.arrow?.y ?? 0);
  const hideArrow = computed(() => (props.hideShiftedArrow ?? true) && !arrowCentered.value);

  const popupZIndex = shallowRef<string>();

  const positionerStyle = computed<CSSProperties>(() => {
    const { transformOrigin, hide } = middlewareData.value;

    return {
      ...floatingStyles.value,
      zIndex: popupZIndex.value,
      transform: isPositioned.value ? floatingStyles.value.transform : 'translate(0, -200%)',
      [popperCssVars.transformOrigin]: [transformOrigin?.x, transformOrigin?.y].join(' '),
      ...(hide?.referenceHidden && {
        visibility: 'hidden',
        pointerEvents: 'none'
      })
    };
  });

  // Inherit the popup's computed z-index so stacked popups layer correctly.
  watchPostEffect(() => {
    if (popupElement.value) {
      popupZIndex.value = window.getComputedStyle(popupElement.value).zIndex;
    }
  });

  return {
    floatingStyles,
    placement,
    isPositioned,
    middlewareData,
    update,
    placedSide,
    placedAlign,
    arrowX,
    arrowY,
    hideArrow,
    positionerStyle
  };
}
