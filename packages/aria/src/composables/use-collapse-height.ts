import { onScopeDispose, watch } from 'vue';
import { useMutationObserver } from '@vueuse/core';
import { COLLAPSE_MOTION_DEFAULTS, prefersReducedMotion } from '../shared';
import { useForwardElement } from './use-forward-element';

/**
 * Options for the content-observed collapse height motion.
 */
export interface UseCollapseHeightOptions {
  /**
   * Duration of the height transition.
   *
   * @defaultValue '200ms'
   */
  duration?: string;
  /**
   * Timing function of the height transition.
   *
   * @defaultValue 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  easing?: string;
}

// The safety fallback outlives the transition so a lost `transitionend`
// (e.g. an interrupted transition) still clears the pinned inline styles.
const SAFETY_CLEAR_MS = 400;

/**
 * Minimal mutation-record shape: enough to inspect added/removed child nodes.
 * Real `MutationRecord`s satisfy it structurally (`NodeList` is iterable).
 */
export interface StructuralChangeRecord {
  addedNodes: Iterable<Node>;
  removedNodes: Iterable<Node>;
}

/**
 * Whether the mutation records contain a structural change to the observed
 * container's direct children — element nodes added or removed. Text or
 * attribute changes inside an existing child must not animate the container.
 *
 * Accepts the minimal record shape so tests can pass plain objects.
 */
export function hasStructuralChildChange(records: ReadonlyArray<StructuralChangeRecord>): boolean {
  return records.some(record =>
    [...record.addedNodes, ...record.removedNodes].some(child => child.nodeType === Node.ELEMENT_NODE)
  );
}

function parsePixels(value: string): number {
  return value.endsWith('px') ? Number.parseFloat(value) : 0;
}

/**
 * Natural (auto) border-box height of the node, measurable even while an
 * inline height pins the box: a Range over the contents ignores the box's own
 * clipping, unlike `scrollHeight`, which never reports below the visible box
 * and would make chained changes mid-animation measure the clipped height.
 * Padding and border are added back to match what writing `height` renders
 * under the animation's forced `box-sizing: border-box`.
 */
function measureNaturalHeight(node: HTMLElement): number {
  const range = document.createRange();

  range.selectNodeContents(node);

  const box = range.getBoundingClientRect();
  const style = getComputedStyle(node);

  return (
    box.height +
    parsePixels(style.paddingTop) +
    parsePixels(style.paddingBottom) +
    parsePixels(style.borderTopWidth) +
    parsePixels(style.borderBottomWidth)
  );
}

/**
 * Animates a persistent container's height when its direct-child content
 * changes structurally (rows or items added or removed): pins the previous
 * height, then transitions to the newly measured `scrollHeight`. For content
 * that mounts and unmounts as a whole, prefer `collapseMotion` instead.
 *
 * The observation cannot be expressed with `<Transition>`: children render
 * through consumer slots as fragments, so the container is the only stable
 * element to animate. Everything is driven through inline styles, so no
 * companion CSS is required. Users with `prefers-reduced-motion: reduce`
 * get the instant height change instead. Observation is disabled in test
 * environments: happy-dom has no CSS transition support, so the pinned
 * styles would never settle through `transitionend`.
 *
 * @param options Duration/easing overrides.
 * @returns `setElementRef` binds onto the container element (function ref);
 * `elementRef` exposes the resolved element for measurement.
 */
export function useCollapseHeight(options: UseCollapseHeightOptions = {}) {
  const [elementRef, setElementRef] = useForwardElement();

  const { duration = COLLAPSE_MOTION_DEFAULTS.duration, easing = COLLAPSE_MOTION_DEFAULTS.easing } = options;
  const transition = `height ${duration} ${easing}`;

  let lastHeight = 0;
  let clearTimer: ReturnType<typeof setTimeout> | null = null;

  function clearCollapse(node: HTMLElement) {
    node.removeEventListener('transitionend', handleTransitionEnd);
    node.style.height = '';
    node.style.overflow = '';
    node.style.transition = '';
    node.style.boxSizing = '';

    if (clearTimer !== null) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }
  }

  function handleTransitionEnd(event: TransitionEvent) {
    const node = elementRef.value;

    // `transitionend` bubbles: children animating their own properties must
    // not end the container's collapse.
    if (node && event.target === node && event.propertyName === 'height') {
      clearCollapse(node);
    }
  }

  function collapseBetween(node: HTMLElement, current: number, next: number) {
    lastHeight = next;
    clearCollapse(node);

    node.style.overflow = 'hidden';
    // Pin as border-box so the measured border-box start/end heights render
    // exactly, whatever box model the container's own styles declare.
    node.style.boxSizing = 'border-box';
    node.style.height = `${current}px`;
    // Force a style recalc so the browser interpolates from the pinned height.
    void node.scrollHeight;
    node.style.transition = transition;
    node.style.height = `${next}px`;

    node.addEventListener('transitionend', handleTransitionEnd);
    clearTimer = setTimeout(() => clearCollapse(node), SAFETY_CLEAR_MS);
  }

  function handleMutations(records: ReadonlyArray<StructuralChangeRecord>) {
    const node = elementRef.value;

    if (!node || !hasStructuralChildChange(records)) return;

    const next = measureNaturalHeight(node);

    if (prefersReducedMotion()) {
      // Reduced-motion users get the instant height change, no transition.
      lastHeight = next;
      clearCollapse(node);
      return;
    }

    // While a collapse is in flight the element still carries its pinned
    // inline height, so `offsetHeight` reports the interpolated value and
    // chained changes animate smoothly. Otherwise the layout already jumped
    // to the new content and only `lastHeight` remembers the pre-change one.
    const inFlight = node.style.height !== '';
    const current = inFlight ? node.offsetHeight : lastHeight;

    if (inFlight || current !== next) {
      collapseBetween(node, current, next);
    }
  }

  watch(
    elementRef,
    node => {
      if (node) {
        lastHeight = measureNaturalHeight(node);
      }
    },
    { flush: 'post' }
  );

  if (import.meta.env.MODE !== 'test') {
    useMutationObserver(elementRef, handleMutations, { childList: true });
  }

  onScopeDispose(() => {
    if (clearTimer !== null) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }
  });

  return { elementRef, setElementRef };
}
