import { arrow, flip, hide, limitShift, offset, shift, size } from '@floating-ui/dom';
import type { Side, Middleware, MiddlewareState, SideObject } from '@floating-ui/dom';
import { isNullish } from '../../shared';
import type { Direction, Align, InferDefaults, Placement } from '../../types';
import type { PopperPositionerProps, PopperPositioningPositionerProps } from './types';

export const popperCssVars = {
  transformOrigin: '--vean-popper-transform-origin',
  availableWidth: '--vean-popper-available-width',
  availableHeight: '--vean-popper-available-height',
  anchorWidth: '--vean-popper-anchor-width',
  anchorHeight: '--vean-popper-anchor-height'
};

export function createPopperPositionerDefaultProps() {
  const props: InferDefaults<PopperPositionerProps> = {
    placement: undefined,
    side: 'bottom',
    sideOffset: 0,
    sideFlip: true,
    align: 'center',
    alignOffset: 0,
    alignFlip: true,
    arrowPadding: 0,
    avoidCollisions: true,
    prioritizePosition: true,
    collisionPadding: 0,
    collisionBoundary: () => [],
    hideShiftedArrow: true,
    sticky: 'partial',
    hideWhenDetached: false,
    positionStrategy: 'fixed',
    updatePositionStrategy: 'optimized',
    trapFocus: undefined
  };

  return props;
}

/**
 * Defaults for the positioning-only positioner. Kept separate from
 * `createPopperPositionerDefaultProps` because the interactive shell defaults differ:
 * `prioritizePosition` is `false` here — pure positioning must not force-flip — and
 * `hideShiftedArrow` stays off like the historical popper defaults.
 */
export function createPopperPositioningDefaultProps() {
  const props: InferDefaults<PopperPositioningPositionerProps> = {
    // Explicit default: Vue boolean-casts an absent `open` prop to `false`, which would
    // otherwise defeat the documented `true` default and freeze `isPositioned` off.
    open: true,
    placement: undefined,
    side: 'bottom',
    sideOffset: 0,
    sideFlip: true,
    align: 'center',
    alignOffset: 0,
    alignFlip: true,
    arrowPadding: 0,
    avoidCollisions: true,
    prioritizePosition: true,
    collisionPadding: 0,
    collisionBoundary: () => [],
    hideShiftedArrow: false,
    sticky: 'partial',
    hideWhenDetached: false,
    positionStrategy: 'fixed',
    updatePositionStrategy: 'optimized'
  };

  return props;
}

// Alignment to percentage mapping
const ALIGN_TO_PERCENTAGE: Record<Align, string> = {
  start: '0%',
  center: '50%',
  end: '100%'
};

interface TransformOriginParams {
  isArrowHidden: boolean;
  noArrowAlign: string;
  arrowXCenter: number;
  arrowYCenter: number;
  arrowHeight: number;
  floatingWidth: number;
  floatingHeight: number;
}

/** Transform origin calculation strategy for each direction */
interface TransformOriginStrategy {
  getX: (params: TransformOriginParams) => string;
  getY: (params: TransformOriginParams) => string;
}

const TRANSFORM_ORIGIN_STRATEGIES: Record<Side, TransformOriginStrategy> = {
  bottom: {
    getX: ({ isArrowHidden, noArrowAlign, arrowXCenter }) => (isArrowHidden ? noArrowAlign : `${arrowXCenter}px`),
    getY: ({ arrowHeight }) => `${-arrowHeight}px`
  },
  top: {
    getX: ({ isArrowHidden, noArrowAlign, arrowXCenter }) => (isArrowHidden ? noArrowAlign : `${arrowXCenter}px`),
    getY: ({ floatingHeight, arrowHeight }) => `${floatingHeight + arrowHeight}px`
  },
  right: {
    getX: ({ arrowHeight }) => `${-arrowHeight}px`,
    getY: ({ isArrowHidden, noArrowAlign, arrowYCenter }) => (isArrowHidden ? noArrowAlign : `${arrowYCenter}px`)
  },
  left: {
    getX: ({ floatingWidth, arrowHeight }) => `${floatingWidth + arrowHeight}px`,
    getY: ({ isArrowHidden, noArrowAlign, arrowYCenter }) => (isArrowHidden ? noArrowAlign : `${arrowYCenter}px`)
  }
};

export function getFloatingUiMiddleware(props: PopperPositionerProps, arrowElement: Element | null | undefined) {
  const {
    sideOffset = 0,
    alignOffset = 0,
    sideFlip,
    alignFlip,
    prioritizePosition,
    sticky,
    avoidCollisions,
    arrowPadding,
    hideWhenDetached
  } = props;

  const detectOverflowOptions = getDetectOverflowOptions(props);

  const middlewares: (Middleware | false | null | undefined)[] = [
    offset(() => {
      const arrowHeight = arrowElement?.clientHeight ?? 0;

      return {
        mainAxis: sideOffset + arrowHeight,
        crossAxis: alignOffset,
        alignmentAxis: alignOffset
      };
    })
  ];

  if (avoidCollisions) {
    const $middlewares: Middleware[] = [
      shift({
        mainAxis: true,
        crossAxis: Boolean(prioritizePosition),
        limiter: sticky === 'partial' ? limitShift() : undefined,
        ...detectOverflowOptions
      })
    ];

    const flipMiddleware: Middleware = flip({
      mainAxis: sideFlip,
      crossAxis: alignFlip,
      ...detectOverflowOptions
    });

    if (prioritizePosition) {
      $middlewares.unshift(flipMiddleware);
    } else {
      $middlewares.push(flipMiddleware);
    }

    middlewares.push(...$middlewares);
  }

  middlewares.push(
    size({
      ...detectOverflowOptions,
      apply: ({ elements: { floating }, rects, availableWidth, availableHeight }) => {
        const { width: anchorWidth, height: anchorHeight } = rects.reference;

        floating.style.setProperty(popperCssVars.availableWidth, `${availableWidth}px`);
        floating.style.setProperty(popperCssVars.availableHeight, `${availableHeight}px`);
        floating.style.setProperty(popperCssVars.anchorWidth, `${anchorWidth}px`);
        floating.style.setProperty(popperCssVars.anchorHeight, `${anchorHeight}px`);
      }
    })
  );

  if (arrowElement) {
    const transformOrigin: Middleware = {
      name: 'transformOrigin',
      fn(data: MiddlewareState) {
        const { placement, rects, middlewareData } = data;

        const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
        const isArrowHidden = cannotCenterArrow;
        const { width: arrowWidth, height: arrowHeight } = arrowElement.getBoundingClientRect();
        const arrowW = isArrowHidden ? 0 : arrowWidth;
        const arrowH = isArrowHidden ? 0 : arrowHeight;

        const placedSide = getPlacementSide(placement);
        const placedAlign = getPlacementAlignment(placement) ?? 'center';
        const noArrowAlign = ALIGN_TO_PERCENTAGE[placedAlign];

        const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowW / 2;
        const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowH / 2;

        const strategy = TRANSFORM_ORIGIN_STRATEGIES[placedSide];
        const params: TransformOriginParams = {
          isArrowHidden,
          noArrowAlign,
          arrowXCenter,
          arrowYCenter,
          arrowHeight,
          floatingWidth: rects.floating.width,
          floatingHeight: rects.floating.height
        };

        const x = strategy.getX(params);
        const y = strategy.getY(params);

        return { data: { x, y } };
      }
    };

    middlewares.push(arrow({ element: arrowElement, padding: arrowPadding }), transformOrigin);
  }

  if (hideWhenDetached) {
    middlewares.push(hide({ strategy: 'referenceHidden', ...detectOverflowOptions }));
  }

  return middlewares.filter(Boolean) as Middleware[];
}

function getDetectOverflowOptions(props: PopperPositionerProps) {
  const { collisionPadding, collisionBoundary } = props;

  // Create a bias to the preferred side.
  // On iOS, when the mobile software keyboard opens, the input is exactly centered
  // in the viewport, but this can cause it to flip to the top undesirably.
  const bias = 1;

  const padding: SideObject = {
    top: bias,
    right: bias,
    bottom: bias,
    left: bias
  };
  if (typeof collisionPadding === 'number') {
    padding.top += collisionPadding;
    padding.right += collisionPadding;
    padding.bottom += collisionPadding;
    padding.left += collisionPadding;
  } else if (collisionPadding) {
    padding.top += collisionPadding.top ?? 0;
    padding.right += collisionPadding.right ?? 0;
    padding.bottom += collisionPadding.bottom ?? 0;
    padding.left += collisionPadding.left ?? 0;
  }

  const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
  const hasExplicitBoundaries = boundary.length > 0;

  return {
    padding,
    boundary: boundary.filter(item => !isNullish(item)),
    // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
    altBoundary: hasExplicitBoundaries
  };
}

/**
 * Get placement from side and align
 *
 * @param side - The side
 * @param align - The align
 * @returns The placement
 */
export function getPlacement(side: Side, align: Align) {
  let placement: Placement = side;

  if (align !== 'center') {
    placement += `-${align}`;
  }

  return placement as Placement;
}

/**
 * Get the side part of a placement string (`'bottom-start'` → `'bottom'`).
 */
export function getPlacementSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}

/**
 * Get the alignment part of a placement string (`'bottom-start'` → `'start'`).
 */
export function getPlacementAlignment(placement: Placement): Align | undefined {
  return placement.split('-')[1] as Align | undefined;
}

/**
 * Resolve the nested popup side from the text direction (`rtl` → left, otherwise right).
 */
export function getNestedPopupSide(dir: Direction): Side {
  return dir === 'rtl' ? 'left' : 'right';
}
