import { MAP_KEY_TO_FOCUS_INTENT } from '../constants';
import type { DataOrientation, Direction, NavigationKey } from '../types';
import { getActiveElement } from './dom';

type FocusableTarget = HTMLElement | { focus: () => void };

/** Attempts focusing the first element in a list of candidates. Stops when focus has actually moved. */
export function focusFirstAndSelect(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = getActiveElement();

  for (const candidate of candidates) {
    focus(candidate, { select });

    if (getActiveElement() !== previouslyFocusedElement) return;
  }
}

export function tryFocusFirst(candidates: HTMLElement[], preventScroll = false) {
  const previouslyFocusedElement = getActiveElement();

  return candidates.some(candidate => {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus({ preventScroll });

    return getActiveElement() !== previouslyFocusedElement;
  });
}

export function removeFromTabOrder(candidates: HTMLElement[]) {
  candidates.forEach(candidate => {
    candidate.dataset.tabindex = candidate.getAttribute('tabindex') || '';
    candidate.setAttribute('tabindex', '-1');
  });
  return () => {
    candidates.forEach(candidate => {
      const prevTabIndex = candidate.dataset.tabindex as string;
      candidate.setAttribute('tabindex', prevTabIndex);
    });
  };
}

/** Returns the first and last tabbable elements inside a container. */
export function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.slice().reverse(), container);
  return [first, last] as const;
}

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when elements are not
 * visible. This cannot be worked out easily by just reading a property, but rather necessitate runtime knowledge
 * (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker Credit:
 * https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
export function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node: HTMLInputElement) {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as HTMLElement);
  }
  // we do not take into account the order of nodes with positive `tabIndex` as it
  // hinders accessibility to have tab order different from visual order.
  return nodes;
}

/** Returns the first visible element in a list. NOTE: Only checks visibility up to the `container`. */
function findVisible(elements: HTMLElement[], container: HTMLElement) {
  const visibleItem = elements.find(element => !isHidden(element, { upTo: container }));

  return visibleItem;
}

function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden') return true;

  let $node = node;

  while ($node) {
    // we stop at `upTo` (excluding it)
    if (upTo !== undefined && $node === upTo) {
      return false;
    }

    if (getComputedStyle($node).display === 'none') {
      return true;
    }

    $node = $node.parentElement as HTMLElement;
  }

  return false;
}

function isSelectableInput(element: any): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element;
}

export function focus(element?: FocusableTarget | null, { select = false } = {}) {
  // only focus if that element is focusable
  if (!element || !element.focus) return;

  const previouslyFocusedElement = getActiveElement();
  // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
  element.focus({ preventScroll: true });

  // only select if its not the same element, it supports selection and we need to select
  if (!select) return;
  if (element === previouslyFocusedElement) return;
  if (!isSelectableInput(element)) return;

  element.select();
}

export function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key;

  if (key === 'ArrowLeft') return 'ArrowRight';

  if (key === 'ArrowRight') return 'ArrowLeft';

  return key;
}

export function getFocusIntent(event: KeyboardEvent, orientation?: DataOrientation, dir?: Direction) {
  const key = getDirectionAwareKey(event.key, dir);

  if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key)) {
    return undefined;
  }

  if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key)) {
    return undefined;
  }

  return MAP_KEY_TO_FOCUS_INTENT[key as NavigationKey];
}
