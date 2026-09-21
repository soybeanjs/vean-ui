import type { PopperReferenceElement } from './types';

interface UseVirtualPointReferenceOptions {
  /**
   * Invoked after the point moves so the caller can request a positioner update. Repositioning is
   * event-driven: without this notification a stable reference alone would never re-render.
   */
  onPointChange: () => void;
}

interface UseVirtualPointReferenceReturn {
  /**
   * A stable zero-size virtual reference whose rect reflects the latest point. The object identity
   * never changes, so `useFloating`'s reference watch keeps `autoUpdate` mounted instead of tearing
   * it down and rebuilding it on every point move.
   */
  reference: PopperReferenceElement;
  /** Move the virtual point to the given viewport coordinates and notify the caller. */
  setPoint: (x: number, y: number) => void;
}

/**
 * Creates a movable virtual-point reference (e.g. the contextmenu pointer coordinates).
 *
 * Unlike a computed reference that produces a new object per point change (which forces
 * `useFloating` to re-attach `autoUpdate` on every update), the reference here is created once and
 * `getBoundingClientRect` reads the current point at compute time.
 */
export function useVirtualPointReference(options: UseVirtualPointReferenceOptions): UseVirtualPointReferenceReturn {
  const point = { x: 0, y: 0 };

  const reference: PopperReferenceElement = {
    getBoundingClientRect: () =>
      DOMRect.fromRect({
        x: point.x,
        y: point.y,
        width: 0,
        height: 0
      })
  };

  function setPoint(x: number, y: number) {
    point.x = x;
    point.y = y;
    options.onPointChange();
  }

  return { reference, setPoint };
}
