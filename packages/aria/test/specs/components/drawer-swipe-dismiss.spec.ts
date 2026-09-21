import { describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useSwipeDismiss } from '../../../src/components/drawer/use-swipe-dismiss';
import type { SwipeDirection } from '../../../src/types';

interface PointerInit {
  x: number;
  y: number;
  time: number;
  pointerId?: number;
}

function createPointerEvent(type: string, init: PointerInit) {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.x,
    clientY: init.y,
    pointerId: init.pointerId ?? 1,
    button: 0
  });

  // `timeStamp` is read-only and derived from the clock, so the velocity window
  // is pinned explicitly to keep the gesture timing deterministic.
  Object.defineProperty(event, 'timeStamp', { value: init.time });

  return event;
}

interface HarnessOptions {
  directions: SwipeDirection[];
  enabled?: boolean;
}

async function mountHarness(options: HarnessOptions) {
  const element = ref<HTMLElement>();
  const onDismiss = vi.fn();
  const swipingChanges: boolean[] = [];
  const progressValues: number[] = [];

  const Harness = defineComponent({
    setup() {
      const enabled = ref(options.enabled ?? true);
      const directions = ref<SwipeDirection[]>(options.directions);

      useSwipeDismiss({
        enabled,
        elementRef: element,
        directions,
        onDismiss,
        onSwipingChange(swiping) {
          swipingChanges.push(swiping);
        },
        onProgress(progress) {
          progressValues.push(progress);
        }
      });

      return { element };
    },
    template: '<div ref="element" data-harness><div data-scroller /></div>'
  });

  const wrapper = mount(Harness, { attachTo: document.body });
  // The element-scoped listener is attached by a watcher, so let it flush before gesturing.
  await nextTick();
  const root = wrapper.get('[data-harness]').element as HTMLElement;
  const scroller = wrapper.get('[data-scroller]').element as HTMLElement;

  return { wrapper, root, scroller, onDismiss, swipingChanges, progressValues };
}

function press(target: EventTarget, init: PointerInit) {
  target.dispatchEvent(createPointerEvent('pointerdown', init));
}

function move(init: PointerInit) {
  window.dispatchEvent(createPointerEvent('pointermove', init));
}

function release(init: PointerInit) {
  window.dispatchEvent(createPointerEvent('pointerup', init));
}

describe('useSwipeDismiss', () => {
  describe('axis locking', () => {
    it('ignores a gesture whose dominant axis is not permitted', async () => {
      const { wrapper, root, onDismiss, swipingChanges } = await mountHarness({
        directions: ['right']
      });

      press(root, { x: 0, y: 100, time: 0 });
      move({ x: 6, y: 220, time: 16 });
      release({ x: 6, y: 220, time: 32 });

      expect(swipingChanges).toEqual([]);
      expect(onDismiss).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('tracks a gesture on the permitted axis', async () => {
      const { wrapper, root, swipingChanges, progressValues } = await mountHarness({
        directions: ['right']
      });

      press(root, { x: 0, y: 0, time: 0 });
      move({ x: 40, y: 2, time: 16 });

      expect(swipingChanges).toEqual([true]);
      expect(Math.max(...progressValues)).toBeGreaterThan(0);

      release({ x: 40, y: 2, time: 900 });

      wrapper.unmount();
    });
  });

  describe('dismiss threshold', () => {
    it('dismisses past the travel threshold', async () => {
      const { wrapper, root, onDismiss } = await mountHarness({ directions: ['right'] });

      press(root, { x: 0, y: 0, time: 0 });
      move({ x: 120, y: 0, time: 400 });
      release({ x: 120, y: 0, time: 900 });

      expect(onDismiss).toHaveBeenCalledTimes(1);

      wrapper.unmount();
    });

    it('does not dismiss below the travel threshold', async () => {
      const { wrapper, root, onDismiss } = await mountHarness({ directions: ['right'] });

      press(root, { x: 0, y: 0, time: 0 });
      move({ x: 24, y: 0, time: 400 });
      release({ x: 24, y: 0, time: 900 });

      expect(onDismiss).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('damps movement against the permitted direction', async () => {
      const { wrapper, root, onDismiss, progressValues } = await mountHarness({
        directions: ['right']
      });

      press(root, { x: 200, y: 0, time: 0 });
      move({ x: 100, y: 0, time: 400 });
      release({ x: 100, y: 0, time: 900 });

      // 100px against the direction is damped well below the travel threshold.
      expect(Math.max(...progressValues)).toBeLessThan(1);
      expect(onDismiss).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('dismisses on a fast short swipe', async () => {
      const { wrapper, root, onDismiss } = await mountHarness({ directions: ['up'] });

      press(root, { x: 0, y: 200, time: 0 });
      move({ x: 0, y: 170, time: 10 });
      move({ x: 0, y: 150, time: 16 });
      release({ x: 0, y: 150, time: 20 });

      expect(onDismiss).toHaveBeenCalledTimes(1);

      wrapper.unmount();
    });
  });

  describe('scroll yielding', () => {
    it('yields when an ancestor can still scroll along the gesture axis', async () => {
      const { wrapper, scroller, onDismiss, swipingChanges } = await mountHarness({
        directions: ['right']
      });

      scroller.style.overflowX = 'scroll';
      Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 400 });
      Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 0 });
      Object.defineProperty(scroller, 'scrollLeft', { configurable: true, value: 0 });

      press(scroller, { x: 0, y: 0, time: 0 });
      move({ x: 120, y: 0, time: 400 });
      release({ x: 120, y: 0, time: 900 });

      expect(swipingChanges).toEqual([]);
      expect(onDismiss).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('does not yield once the ancestor is scrolled to the edge', async () => {
      const { wrapper, scroller, onDismiss } = await mountHarness({ directions: ['right'] });

      scroller.style.overflowX = 'scroll';
      Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 400 });
      Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 0 });
      Object.defineProperty(scroller, 'scrollLeft', { configurable: true, value: 400 });

      press(scroller, { x: 0, y: 0, time: 0 });
      move({ x: 120, y: 0, time: 400 });
      release({ x: 120, y: 0, time: 900 });

      expect(onDismiss).toHaveBeenCalledTimes(1);

      wrapper.unmount();
    });
  });

  describe('enablement', () => {
    it('ignores pointers while disabled', async () => {
      const { wrapper, root, onDismiss, swipingChanges } = await mountHarness({
        directions: ['right'],
        enabled: false
      });

      press(root, { x: 0, y: 0, time: 0 });
      move({ x: 200, y: 0, time: 400 });
      release({ x: 200, y: 0, time: 900 });

      expect(swipingChanges).toEqual([]);
      expect(onDismiss).not.toHaveBeenCalled();

      wrapper.unmount();
    });
  });
});
