import { describe, expect, it } from 'vitest';
import {
  canSwipeFromScrollEdgeOnMove,
  findScrollableTouchTarget,
  isAtSwipeStartEdge,
  shouldIgnoreSwipeForTextSelection,
  shouldYieldTouchMove
} from '../../../src/components/drawer/scroll-arbitration';
import type { TouchScrollState } from '../../../src/components/drawer/scroll-arbitration';

function createScrollable(overflow: string, metrics: { scroll: number; client: number; offset: number }) {
  const element = document.createElement('div');

  element.style.overflowY = overflow;
  element.style.overflowX = overflow;

  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: metrics.scroll });
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: metrics.client });
  Object.defineProperty(element, 'scrollTop', { configurable: true, value: metrics.offset });
  Object.defineProperty(element, 'scrollWidth', { configurable: true, value: metrics.scroll });
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: metrics.client });
  Object.defineProperty(element, 'scrollLeft', { configurable: true, value: metrics.offset });

  return element;
}

function createTouchState(overrides: Partial<TouchScrollState> = {}): TouchScrollState {
  return {
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    scrollTarget: null,
    hasCrossAxisScrollableContent: false,
    allowSwipe: null,
    preserveNativeCrossAxisScroll: false,
    drawerAxisAttributed: false,
    ...overrides
  };
}

function createTouchEvent(init: { cancelable?: boolean; clientX?: number; clientY?: number } = {}) {
  return {
    cancelable: init.cancelable ?? true,
    touches: [{ clientX: init.clientX ?? 0, clientY: init.clientY ?? 0 }]
  } as unknown as TouchEvent;
}

const touch = { clientX: 0, clientY: 0 } as Touch;

describe('findScrollableTouchTarget', () => {
  // happy-dom only resolves computed styles for elements attached to the document.
  it('finds the nearest scrollable ancestor between the target and the root', () => {
    const root = document.createElement('div');
    const scroller = createScrollable('scroll', { scroll: 400, client: 0, offset: 0 });
    const target = document.createElement('div');

    scroller.appendChild(target);
    root.appendChild(scroller);
    document.body.appendChild(root);

    expect(findScrollableTouchTarget(target, root, 'vertical')).toBe(scroller);

    root.remove();
  });

  it('returns null when nothing between the target and the root scrolls', () => {
    const root = document.createElement('div');
    const plain = document.createElement('div');
    const target = document.createElement('div');

    plain.appendChild(target);
    root.appendChild(plain);
    document.body.appendChild(root);

    expect(findScrollableTouchTarget(target, root, 'vertical')).toBeNull();

    root.remove();
  });

  it('respects the overflow style per axis', () => {
    const root = document.createElement('div');
    const scroller = createScrollable('auto', { scroll: 400, client: 0, offset: 0 });
    const target = document.createElement('div');

    scroller.style.overflowY = 'hidden';
    scroller.appendChild(target);
    root.appendChild(scroller);
    document.body.appendChild(root);

    expect(findScrollableTouchTarget(target, root, 'vertical')).toBeNull();
    expect(findScrollableTouchTarget(target, root, 'horizontal')).toBe(scroller);

    root.remove();
  });
});

describe('isAtSwipeStartEdge / canSwipeFromScrollEdgeOnMove', () => {
  it('detects the start edge for a downward dismiss', () => {
    const scroller = createScrollable('scroll', { scroll: 400, client: 100, offset: 0 });

    expect(isAtSwipeStartEdge(scroller, 'vertical', 'down')).toBe(true);
    expect(isAtSwipeStartEdge(scroller, 'vertical', 'up')).toBe(false);
  });

  it('detects the end edge for an upward dismiss', () => {
    const scroller = createScrollable('scroll', { scroll: 400, client: 100, offset: 300 });

    expect(isAtSwipeStartEdge(scroller, 'vertical', 'up')).toBe(true);
    expect(isAtSwipeStartEdge(scroller, 'vertical', 'down')).toBe(false);
  });

  it('only allows swiping toward the dismiss direction from the edge', () => {
    const scroller = createScrollable('scroll', { scroll: 400, client: 100, offset: 0 });

    expect(canSwipeFromScrollEdgeOnMove(scroller, 'vertical', 'down', 5)).toBe(true);
    expect(canSwipeFromScrollEdgeOnMove(scroller, 'vertical', 'down', -5)).toBe(false);
    expect(canSwipeFromScrollEdgeOnMove(scroller, 'vertical', 'up', 5)).toBe(false);
  });
});

describe('shouldYieldTouchMove', () => {
  it('yields to the cross axis once it wins the gesture', () => {
    const state = createTouchState({ hasCrossAxisScrollableContent: true });

    const yielded = shouldYieldTouchMove(
      state,
      createTouchEvent({ clientX: 12, clientY: 3 }),
      {
        clientX: 12,
        clientY: 3
      } as Touch,
      true
    );

    expect(yielded).toBe(true);
    expect(state.preserveNativeCrossAxisScroll).toBe(true);
  });

  it('attributes the drawer axis once it passes the slop', () => {
    const state = createTouchState({ hasCrossAxisScrollableContent: true });

    const yielded = shouldYieldTouchMove(
      state,
      createTouchEvent({ clientX: 2, clientY: 12 }),
      {
        clientX: 2,
        clientY: 12
      } as Touch,
      true
    );

    expect(yielded).toBe(false);
    expect(state.drawerAxisAttributed).toBe(true);
  });

  it('leaves undecided gestures alone before either axis passes the slop', () => {
    const state = createTouchState({ hasCrossAxisScrollableContent: true });

    const yielded = shouldYieldTouchMove(
      state,
      createTouchEvent({ clientX: 2, clientY: 3 }),
      {
        clientX: 2,
        clientY: 3
      } as Touch,
      true
    );

    expect(yielded).toBe(true);
    expect(state.drawerAxisAttributed).toBe(false);
    expect(state.preserveNativeCrossAxisScroll).toBe(false);
  });

  it('yields for good when the browser already committed a native scroll', () => {
    const state = createTouchState({ hasCrossAxisScrollableContent: true });

    const yielded = shouldYieldTouchMove(
      state,
      createTouchEvent({ cancelable: false, clientY: 12 }),
      {
        clientX: 0,
        clientY: 12
      } as Touch,
      true
    );

    expect(yielded).toBe(true);
    expect(state.preserveNativeCrossAxisScroll).toBe(true);
  });

  it('does not re-arbitrate after the drawer axis has won', () => {
    const state = createTouchState({
      hasCrossAxisScrollableContent: true,
      drawerAxisAttributed: true
    });

    expect(shouldYieldTouchMove(state, createTouchEvent({ clientX: 20, clientY: 0 }), touch, true)).toBe(false);
  });
});

describe('shouldIgnoreSwipeForTextSelection', () => {
  it('ignores swipes while a text control inside the root holds a selection', () => {
    const root = document.createElement('div');
    const input = document.createElement('textarea');

    Object.defineProperty(input, 'selectionStart', { configurable: true, value: 0 });
    Object.defineProperty(input, 'selectionEnd', { configurable: true, value: 4 });
    root.appendChild(input);
    document.body.appendChild(root);
    input.focus();

    expect(shouldIgnoreSwipeForTextSelection(document, root)).toBe(true);

    root.remove();
  });

  it('does not ignore swipes for collapsed selections', () => {
    const root = document.createElement('div');

    root.textContent = 'text';
    document.body.appendChild(root);

    expect(shouldIgnoreSwipeForTextSelection(document, root)).toBe(false);

    root.remove();
  });
});
