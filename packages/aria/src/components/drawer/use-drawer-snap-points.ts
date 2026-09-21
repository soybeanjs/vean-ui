import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import type { Side } from '../../types';
import type { DrawerSnapPoint } from './types';

export interface ResolvedDrawerSnapPoint {
  /** The original snap point value. */
  value: DrawerSnapPoint;
  /** The resolved visible height in px, clamped to the popup and viewport. */
  height: number;
  /** The translateY offset that leaves `height` visible from the anchor edge. */
  offset: number;
}

export interface UseDrawerSnapPointsOptions {
  snapPoints: Ref<DrawerSnapPoint[] | undefined>;
  activeSnapPoint: Ref<DrawerSnapPoint | null | undefined>;
  popupHeight: Ref<number>;
  side: Ref<Side>;
}

function resolveSnapPointValue(value: DrawerSnapPoint, viewportSize: number, rootFontSize: number) {
  if (!Number.isFinite(viewportSize) || viewportSize <= 0) return null;

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    if (value <= 1) return Math.min(1, Math.max(0, value)) * viewportSize;

    return value;
  }

  const trimmed = value.trim();

  if (trimmed.endsWith('px')) return Number.parseFloat(trimmed) || null;
  if (trimmed.endsWith('rem')) return (Number.parseFloat(trimmed) || 0) * rootFontSize;

  return null;
}

/** Index of the value closest to `target`, or `-1` when empty. */
export function closestSnapPointIndex(values: number[], target: number) {
  let closestIndex = -1;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const [index, value] of values.entries()) {
    const distance = Math.abs(value - target);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

/**
 * Square-root resistance applied once a drag pushes the popup past the fully-open
 * edge (`nextOffset < 0`), so it resists travelling beyond its largest snap point.
 */
export function getSnapPointSwipeMovement(baseOffset: number, movementValue: number) {
  const nextOffset = baseOffset + movementValue;

  if (nextOffset >= 0) return movementValue;

  return -Math.sqrt(-nextOffset) - baseOffset;
}

/**
 * Resolves snap point values to `{ value, height, offset }` triplets from the
 * measured popup height and the viewport, so positioning is a plain CSS
 * variable change instead of imperative transforms.
 */
export function useDrawerSnapPoints({ snapPoints, activeSnapPoint, popupHeight, side }: UseDrawerSnapPointsOptions) {
  const viewportSize = ref(0);
  const rootFontSize = ref(16);
  /** Bumped whenever the measured viewport actually changes. */
  const viewportRevision = ref(0);

  function measure() {
    if (typeof window === 'undefined') return;

    const nextSize = side.value === 'left' || side.value === 'right' ? window.innerWidth : window.innerHeight;

    if (nextSize !== viewportSize.value) {
      viewportSize.value = nextSize;
      viewportRevision.value += 1;
    }

    const fontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize);

    if (Number.isFinite(fontSize) && fontSize > 0) rootFontSize.value = fontSize;
  }

  // Measured during setup, not only on mount: the cap derived from the viewport
  // has to be on the popup before the popup's first height measurement runs,
  // otherwise that first measurement publishes the uncapped box and the drawer
  // visibly corrects once the observer catches up.
  measure();

  onMounted(() => {
    measure();
    window.addEventListener('resize', measure);
    // iOS does not always fire `resize` when its dynamic viewport changes, so
    // the visual viewport is watched as well; the snap heights are computed
    // from `innerHeight`, which only this signal keeps up to date.
    window.visualViewport?.addEventListener('resize', measure);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', measure);
    window.visualViewport?.removeEventListener('resize', measure);
  });

  const resolvedSnapPoints = computed<ResolvedDrawerSnapPoint[]>(() => {
    const values = snapPoints.value;

    if (!values?.length || popupHeight.value <= 0 || viewportSize.value <= 0) return [];

    const maxHeight = Math.min(popupHeight.value, viewportSize.value);

    const resolved = values
      .map((value): ResolvedDrawerSnapPoint | null => {
        const height = resolveSnapPointValue(value, viewportSize.value, rootFontSize.value);

        if (height === null) return null;

        const clampedHeight = Math.min(Math.max(height, 0), maxHeight);

        return {
          value,
          height: clampedHeight,
          offset: Math.max(0, popupHeight.value - clampedHeight)
        };
      })
      .filter((point): point is ResolvedDrawerSnapPoint => point !== null);

    // Drop points whose heights are within a pixel of an earlier one; they are
    // indistinguishable positions and would make nearest-point resolution ambiguous.
    return resolved.filter(
      (point, index) => !resolved.slice(0, index).some(other => Math.abs(other.height - point.height) <= 1)
    );
  });

  const activeSnapPointOffset = computed(() => {
    const active = activeSnapPoint.value;

    if (active === null || active === undefined) return null;

    const exact = resolvedSnapPoints.value.find(point => Object.is(point.value, active));

    if (exact) return exact.offset;

    const maxHeight = Math.min(popupHeight.value, viewportSize.value);
    const height = resolveSnapPointValue(active, viewportSize.value, rootFontSize.value);

    if (height === null) return null;

    return (
      resolvedSnapPoints.value[
        closestSnapPointIndex(
          resolvedSnapPoints.value.map(point => point.height),
          Math.min(Math.max(height, 0), maxHeight)
        )
      ]?.offset ?? null
    );
  });

  /**
   * The largest snap point size in px, or `null` when none resolves. Read from
   * the raw values instead of `resolvedSnapPoints` on purpose: those heights are
   * clamped by the measured box, so a cap taken from them could never let the box
   * grow back after the viewport does — the previous, smaller measurement would
   * keep pinning it — and it would not exist yet for the very measurement that
   * first sizes the box.
   */
  const maxSnapPointSize = computed(() => {
    const values = snapPoints.value;

    if (!values?.length || viewportSize.value <= 0) return null;

    const sizes = values
      .map(value => resolveSnapPointValue(value, viewportSize.value, rootFontSize.value))
      .filter((size): size is number => size !== null && size > 0);

    if (!sizes.length) return null;

    return Math.min(Math.max(...sizes), viewportSize.value);
  });

  return {
    resolvedSnapPoints,
    activeSnapPointOffset,
    maxSnapPointSize,
    viewportRevision
  };
}
