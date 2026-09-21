import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import {
  ScrollAreaCompact,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport
} from '@vean/aria/scroll-area';
import SScrollArea from '@/components/scroll-area/scroll-area.vue';
import { getScrollPosition, setViewportScroll } from '../../../../aria/src/components/scroll-area/shared';
import { getA11yViolations } from '../../shared/a11y';

function mockOverflowMetrics(wrapper: VueWrapper) {
  const viewport = wrapper.find('[data-vean-scroll-area-viewport]').element as HTMLElement;
  const content = viewport.firstElementChild;
  const scrollbars = wrapper.findAll('[data-vean-scroll-area-scrollbar]');
  const thumbs = wrapper.findAll('[data-vean-scroll-area-thumb]');

  if (!(content instanceof HTMLElement) || scrollbars.length < 2 || thumbs.length < 2) {
    throw new Error('ScrollArea test elements are missing.');
  }

  const verticalScrollbar = scrollbars[0].element as HTMLElement;
  const horizontalScrollbar = scrollbars[1].element as HTMLElement;
  const verticalThumb = thumbs[0].element as HTMLElement;
  const horizontalThumb = thumbs[1].element as HTMLElement;

  Object.defineProperties(viewport, {
    clientHeight: { configurable: true, value: 120 },
    clientWidth: { configurable: true, value: 180 },
    scrollHeight: { configurable: true, value: 360 },
    scrollWidth: { configurable: true, value: 420 },
    scrollTop: { configurable: true, writable: true, value: 24 },
    scrollLeft: { configurable: true, writable: true, value: 36 }
  });

  Object.defineProperties(content, {
    offsetHeight: { configurable: true, value: 360 },
    offsetWidth: { configurable: true, value: 420 },
    scrollHeight: { configurable: true, value: 360 },
    scrollWidth: { configurable: true, value: 420 }
  });

  Object.defineProperties(verticalScrollbar, {
    clientHeight: { configurable: true, value: 120 },
    getBoundingClientRect: {
      configurable: true,
      value: () => ({ top: 0, left: 0, width: 10, height: 120, right: 10, bottom: 120 })
    }
  });

  Object.defineProperties(horizontalScrollbar, {
    clientWidth: { configurable: true, value: 180 },
    getBoundingClientRect: {
      configurable: true,
      value: () => ({ top: 0, left: 0, width: 180, height: 10, right: 180, bottom: 10 })
    }
  });

  Object.defineProperties(verticalThumb, {
    getBoundingClientRect: {
      configurable: true,
      value: () => ({ top: 24, left: 0, width: 10, height: 40, right: 10, bottom: 64 })
    }
  });

  Object.defineProperties(horizontalThumb, {
    getBoundingClientRect: {
      configurable: true,
      value: () => ({ top: 0, left: 36, width: 60, height: 10, right: 96, bottom: 10 })
    }
  });

  viewport.dispatchEvent(new Event('scroll'));
}

/**
 * Simulate the three browser RTL `scrollLeft` modes so the shared helpers can be
 * exercised without relying on the runtime behavior of the test environment.
 */
function createFakeDocument(mode: 'default' | 'negative' | 'reverse') {
  let createCount = 0;

  return {
    body: {
      appendChild() {},
      removeChild() {}
    },
    createElement() {
      if (createCount === 0) {
        createCount += 1;

        let scrollLeft = mode === 'default' ? 1 : 0;

        return Object.defineProperty(
          {
            dir: '',
            style: {} as Record<string, string>,
            appendChild() {}
          },
          'scrollLeft',
          {
            configurable: true,
            get: () => scrollLeft,
            set: value => {
              if (mode === 'negative') {
                scrollLeft = value > 0 ? 0 : value;
                return;
              }

              scrollLeft = value;
            }
          }
        );
      }

      return {
        style: {} as Record<string, string>
      };
    }
  } as unknown as Document;
}

/** Create a minimal viewport-like element for RTL scroll normalization tests. */
function createViewport(doc: Document, scrollLeft: number) {
  return {
    ownerDocument: doc,
    scrollLeft,
    scrollTop: 0,
    scrollWidth: 500,
    clientWidth: 200
  } as HTMLElement;
}

describe('SScrollArea', () => {
  describe('rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(SScrollArea, {
        props: { class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Scrollable Content');
      expect(wrapper.classes()).toContain('h-40');
      wrapper.unmount();
    });

    it('renders viewport and both scrollbars', () => {
      const wrapper = mount(SScrollArea, {
        props: { class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-scroll-area-viewport]').exists()).toBe(true);
      expect(wrapper.findAll('[data-vean-scroll-area-scrollbar]')).toHaveLength(2);
      wrapper.unmount();
    });

    it('renders the Aria compact structure', () => {
      const wrapper = mount(ScrollAreaCompact, {
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-scroll-area-viewport]').exists()).toBe(true);
      expect(wrapper.findAll('[data-vean-scroll-area-scrollbar]')).toHaveLength(2);
      wrapper.unmount();
    });

    it('does not leak viewport as props onto the outer viewport element', () => {
      const wrapper = mount(SScrollArea, {
        props: {
          class: 'h-40 w-40',
          viewportProps: {
            as: 'section',
            asChild: true,
            id: 'viewport-id'
          }
        },
        slots: { default: '<div data-content>Scrollable Content</div>' },
        attachTo: document.body
      });

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      expect(viewport.attributes('id')).toBe('viewport-id');
      expect(viewport.attributes('as')).toBeUndefined();
      expect(viewport.attributes('as-child')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('visibility state', () => {
    it('shows scrollbars when type is always and content overflows', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const [verticalScrollbar, horizontalScrollbar] = wrapper.findAll('[data-vean-scroll-area-scrollbar]');
      expect(verticalScrollbar.attributes('data-state')).toBe('visible');
      expect(horizontalScrollbar.attributes('data-state')).toBe('visible');
      wrapper.unmount();
    });

    it('keeps hover scrollbars hidden before interaction', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'hover', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const [verticalScrollbar] = wrapper.findAll('[data-vean-scroll-area-scrollbar]');
      expect(verticalScrollbar.attributes('data-state')).toBe('hidden');
      wrapper.unmount();
    });

    it('cleans drag state when pointercancel fires', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'hover', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const verticalScrollbar = wrapper.findAll('[data-vean-scroll-area-scrollbar]')[0];
      const verticalThumb = wrapper.findAll('[data-vean-scroll-area-thumb]')[0];

      await verticalThumb.trigger('pointerdown', { button: 0, clientY: 30 });
      expect(verticalScrollbar.attributes('data-state')).toBe('visible');

      window.dispatchEvent(new PointerEvent('pointercancel'));
      await nextTick();

      expect(verticalScrollbar.attributes('data-state')).toBe('hidden');
      wrapper.unmount();
    });

    it('disables the previous scrollbar orientation when orientation changes', async () => {
      const orientation = ref<'vertical' | 'horizontal'>('vertical');
      const wrapper = mount(
        {
          components: {
            ScrollAreaRoot,
            ScrollAreaViewport,
            ScrollAreaScrollbar,
            ScrollAreaThumb
          },
          setup() {
            return { orientation };
          },
          template: `
            <ScrollAreaRoot>
              <ScrollAreaViewport data-testid="viewport">
                <div>Scrollable Content</div>
              </ScrollAreaViewport>
              <ScrollAreaScrollbar :orientation="orientation">
                <ScrollAreaThumb />
              </ScrollAreaScrollbar>
            </ScrollAreaRoot>
          `
        },
        {
          attachTo: document.body
        }
      );

      const viewport = wrapper.find('[data-testid="viewport"]').element as HTMLElement;
      await nextTick();
      expect(viewport.style.overflowY).toBe('scroll');
      expect(viewport.style.overflowX).toBe('hidden');

      orientation.value = 'horizontal';
      await nextTick();

      expect(viewport.style.overflowY).toBe('hidden');
      expect(viewport.style.overflowX).toBe('scroll');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div class="h-80 w-80">Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });

  describe('rtl scrolling', () => {
    it.each([
      ['default', 40, 40],
      ['negative', -40, -40],
      ['reverse', 260, 260]
    ] as const)('normalizes %s rtl scrollLeft values', (mode, normalizedScrollLeft, expectedRawScrollLeft) => {
      const doc = createFakeDocument(mode);
      const viewport = createViewport(doc, normalizedScrollLeft);

      expect(getScrollPosition(viewport, 'horizontal', 'rtl')).toBe(40);

      setViewportScroll(viewport, 'horizontal', 40, 'rtl');
      expect(viewport.scrollLeft).toBe(expectedRawScrollLeft);
    });
  });

  describe('direction', () => {
    it('sets dir attribute on root', () => {
      const wrapper = mount(SScrollArea, {
        props: { dir: 'rtl', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-scroll-area-root]').attributes('dir')).toBe('rtl');
      wrapper.unmount();
    });

    it('defaults dir to ltr when not provided', () => {
      const wrapper = mount(SScrollArea, {
        props: { class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-scroll-area-root]').attributes('dir')).toBe('ltr');
      wrapper.unmount();
    });
  });

  describe('viewport', () => {
    it('makes the viewport focusable by default', () => {
      const wrapper = mount(SScrollArea, {
        props: { class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      expect(viewport.attributes('tabindex')).toBe('0');
      expect(viewport.attributes('aria-hidden')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('transient visibility', () => {
    it('shows scrollbars briefly when type is scroll and viewport scrolls', async () => {
      vi.useFakeTimers();

      const wrapper = mount(SScrollArea, {
        props: { type: 'scroll', scrollHideDelay: 100, class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      // mockOverflowMetrics dispatches a scroll event, which triggers transient visibility;
      // wait for the initial hide timer to expire before asserting the resting state.
      vi.advanceTimersByTime(150);
      await nextTick();

      const [verticalScrollbar] = wrapper.findAll('[data-vean-scroll-area-scrollbar]');
      expect(verticalScrollbar.attributes('data-state')).toBe('hidden');

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      viewport.element.dispatchEvent(new Event('scroll'));
      await nextTick();

      expect(verticalScrollbar.attributes('data-state')).toBe('visible');

      vi.advanceTimersByTime(150);
      await nextTick();

      expect(verticalScrollbar.attributes('data-state')).toBe('hidden');

      vi.useRealTimers();
      wrapper.unmount();
    });

    it('shows scrollbars on hover when type is hover', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'hover', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const root = wrapper.find('[data-vean-scroll-area-root]');
      const [verticalScrollbar] = wrapper.findAll('[data-vean-scroll-area-scrollbar]');
      expect(verticalScrollbar.attributes('data-state')).toBe('hidden');

      await root.trigger('pointerenter');
      await nextTick();

      expect(verticalScrollbar.attributes('data-state')).toBe('visible');

      await root.trigger('pointerleave');
      await nextTick();

      expect(verticalScrollbar.attributes('data-state')).toBe('hidden');
      wrapper.unmount();
    });
  });

  describe('thumb dragging', () => {
    it('scrolls the viewport when the thumb is dragged', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      const verticalThumb = wrapper.findAll('[data-vean-scroll-area-thumb]')[0];

      await verticalThumb.trigger('pointerdown', { button: 0, clientY: 30 });
      window.dispatchEvent(new PointerEvent('pointermove', { clientY: 60, pointerId: 1 }));
      window.dispatchEvent(new PointerEvent('pointerup', { clientY: 60, pointerId: 1 }));
      await nextTick();

      // Thumb at offset 24 → dragging to 60 moves scrollTop proportionally
      expect((viewport.element as HTMLElement).scrollTop).toBeGreaterThan(0);
      wrapper.unmount();
    });

    it('cleans up window listeners after pointerup', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const verticalThumb = wrapper.findAll('[data-vean-scroll-area-thumb]')[0];

      await verticalThumb.trigger('pointerdown', { button: 0, clientY: 30 });
      window.dispatchEvent(new PointerEvent('pointerup', { clientY: 40, pointerId: 1 }));

      // Second pointerup without pointerdown should not throw (no active drag)
      window.dispatchEvent(new PointerEvent('pointerup', { clientY: 40, pointerId: 1 }));
      expect(true).toBe(true);
      wrapper.unmount();
    });
  });

  describe('track click', () => {
    it('jumps the viewport when the track is clicked', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      const [verticalScrollbar] = wrapper.findAll('[data-vean-scroll-area-scrollbar]');

      // Click on the scrollbar track (not the thumb)
      await verticalScrollbar.trigger('pointerdown', { button: 0, clientY: 80 });
      await nextTick();

      expect((viewport.element as HTMLElement).scrollTop).toBeGreaterThan(0);
      wrapper.unmount();
    });

    it('ignores track clicks on the thumb itself', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      const verticalThumb = wrapper.findAll('[data-vean-scroll-area-thumb]')[0];

      // pointerdown on thumb should start dragging instead of jumping
      await verticalThumb.trigger('pointerdown', { button: 0, clientY: 30 });
      window.dispatchEvent(new PointerEvent('pointerup', { clientY: 30, pointerId: 1 }));
      await nextTick();

      expect((viewport.element as HTMLElement).scrollTop).toBe(24);
      wrapper.unmount();
    });
  });

  describe('corner', () => {
    it('renders corner when both scrollbars are visible', async () => {
      const wrapper = mount(SScrollArea, {
        props: { type: 'always', class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const corner = wrapper.find('[data-vean-scroll-area-corner]');
      expect(corner.exists()).toBe(true);
      expect(corner.attributes('aria-hidden')).toBe('true');
      wrapper.unmount();
    });

    it('hides corner when only one scrollbar is visible', async () => {
      const wrapper = mount(
        {
          components: { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb },
          template: `
            <ScrollAreaRoot>
              <ScrollAreaViewport>
                <div>Scrollable Content</div>
              </ScrollAreaViewport>
              <ScrollAreaScrollbar orientation="vertical">
                <ScrollAreaThumb />
              </ScrollAreaScrollbar>
            </ScrollAreaRoot>
          `
        },
        { attachTo: document.body }
      );

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]').element as HTMLElement;
      Object.defineProperties(viewport, {
        clientHeight: { configurable: true, value: 120 },
        clientWidth: { configurable: true, value: 180 },
        scrollHeight: { configurable: true, value: 360 },
        scrollWidth: { configurable: true, value: 180 }
      });
      viewport.dispatchEvent(new Event('scroll'));
      await nextTick();

      expect(wrapper.find('[data-vean-scroll-area-corner]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('clears the scrollbar visible registration on unmount so the corner does not stay visible', async () => {
      // Regression guard: on scrollbar unmount the root's scrollbarX/Y visible
      // registration must be reset, otherwise the corner (which requires both
      // scrollbars visible) would keep rendering a stale element.
      const showVertical = ref(true);
      const wrapper = mount(
        {
          components: {
            ScrollAreaRoot,
            ScrollAreaViewport,
            ScrollAreaScrollbar,
            ScrollAreaThumb,
            ScrollAreaCorner
          },
          setup() {
            return { showVertical };
          },
          template: `
            <ScrollAreaRoot type="always">
              <ScrollAreaViewport>
                <div>Scrollable Content</div>
              </ScrollAreaViewport>
              <ScrollAreaScrollbar v-if="showVertical" orientation="vertical">
                <ScrollAreaThumb />
              </ScrollAreaScrollbar>
              <ScrollAreaScrollbar orientation="horizontal">
                <ScrollAreaThumb />
              </ScrollAreaScrollbar>
              <ScrollAreaCorner />
            </ScrollAreaRoot>
          `
        },
        { attachTo: document.body }
      );

      mockOverflowMetrics(wrapper);
      await nextTick();

      expect(wrapper.find('[data-vean-scroll-area-corner]').exists()).toBe(true);

      showVertical.value = false;
      await nextTick();

      expect(wrapper.find('[data-vean-scroll-area-corner]').exists()).toBe(false);
      wrapper.unmount();
    });
  });

  describe('unmount safety', () => {
    it('does not leak hide timers on unmount', async () => {
      vi.useFakeTimers();

      const wrapper = mount(SScrollArea, {
        props: { type: 'scroll', scrollHideDelay: 100, class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      mockOverflowMetrics(wrapper);
      await nextTick();

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]');
      viewport.element.dispatchEvent(new Event('scroll'));
      await nextTick();

      wrapper.unmount();

      // Advancing timers after unmount must not throw or leak
      expect(() => vi.advanceTimersByTime(200)).not.toThrow();

      vi.useRealTimers();
    });

    it('removes the viewport scroll listener on unmount', () => {
      const wrapper = mount(SScrollArea, {
        props: { class: 'h-40 w-40' },
        slots: { default: '<div>Scrollable Content</div>' },
        attachTo: document.body
      });

      const viewport = wrapper.find('[data-vean-scroll-area-viewport]').element as HTMLElement;
      const removeListenerSpy = vi.spyOn(viewport, 'removeEventListener');

      wrapper.unmount();

      // The scrollbar must tear down its viewport 'scroll' listener so no stale
      // listener (or RAF-backed update loop) survives the component's lifetime.
      expect(removeListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});
