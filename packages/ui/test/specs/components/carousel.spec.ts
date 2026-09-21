import { beforeEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { SCarousel } from '@/components/carousel';
import { getA11yViolations } from '../../shared/a11y';

const emblaMock = vi.hoisted(() => {
  const listeners = new Map<string, Set<(api: any) => void>>();
  const state = {
    canScrollNext: true,
    canScrollPrev: false,
    scrollSnaps: [0, 1, 2],
    selectedIndex: 0
  };

  const api = {
    canScrollNext: vi.fn(() => state.canScrollNext),
    canScrollPrev: vi.fn(() => state.canScrollPrev),
    containerNode: vi.fn(() => document.createElement('div')),
    destroy: vi.fn(),
    emit: vi.fn(),
    internalEngine: vi.fn(),
    off: vi.fn((event: string, callback: (api: any) => void) => {
      listeners.get(event)?.delete(callback);
    }),
    on: vi.fn((event: string, callback: (api: any) => void) => {
      let eventListeners = listeners.get(event);

      if (!eventListeners) {
        eventListeners = new Set();
        listeners.set(event, eventListeners);
      }

      eventListeners.add(callback);
    }),
    plugins: vi.fn(() => ({})),
    previousScrollSnap: vi.fn(() => Math.max(state.selectedIndex - 1, 0)),
    reInit: vi.fn(),
    rootNode: vi.fn(() => document.createElement('div')),
    scrollNext: vi.fn(),
    scrollPrev: vi.fn(),
    scrollProgress: vi.fn(() => 0),
    scrollSnapList: vi.fn(() => state.scrollSnaps),
    scrollTo: vi.fn(),
    selectedScrollSnap: vi.fn(() => state.selectedIndex),
    slideNodes: vi.fn(() => []),
    slidesInView: vi.fn(() => [state.selectedIndex]),
    slidesNotInView: vi.fn(() => [])
  };

  return {
    api,
    listeners,
    options: { current: undefined as unknown },
    plugins: { current: undefined as unknown },
    reset() {
      listeners.clear();
      state.canScrollNext = true;
      state.canScrollPrev = false;
      state.scrollSnaps = [0, 1, 2];
      state.selectedIndex = 0;
      this.options.current = undefined;
      this.plugins.current = undefined;
      vi.clearAllMocks();
    },
    state,
    trigger(event: string) {
      listeners.get(event)?.forEach(callback => callback(api));
    }
  };
});

vi.mock('embla-carousel', () => ({
  default: vi.fn((_: HTMLElement, options: unknown, plugins: unknown) => {
    emblaMock.options.current = options;
    emblaMock.plugins.current = plugins;

    return emblaMock.api;
  })
}));

vi.mock('embla-carousel-reactive-utils', () => ({
  areOptionsEqual: vi.fn(() => false),
  arePluginsEqual: vi.fn(() => false)
}));

function mountCarousel(props: Record<string, unknown> = {}) {
  return mount(SCarousel, {
    props: {
      slides: ['Slide 1', 'Slide 2', 'Slide 3'],
      'aria-label': 'Demo carousel',
      ...props
    },
    slots: {
      item: ({ slide }) => slide
    },
    attachTo: document.body
  });
}

describe('SCarousel', () => {
  beforeEach(() => {
    emblaMock.reset();
  });

  describe('rendering', () => {
    it('renders slides and initializes the embla api', async () => {
      const wrapper = mountCarousel();
      await nextTick();

      expect(wrapper.text()).toContain('Slide 1');
      expect(wrapper.findAll('[data-vean-carousel-item]')).toHaveLength(3);
      expect(wrapper.find('[data-vean-carousel-root]').attributes('role')).toBe('region');
      expect(wrapper.emitted('init')?.[0]?.[0]).toStrictEqual(emblaMock.api);
      wrapper.unmount();
    });

    it('passes orientation and direction to embla options', async () => {
      const wrapper = mountCarousel({ dir: 'rtl', orientation: 'vertical' });
      await nextTick();

      const options = emblaMock.options.current as Record<string, unknown>;
      const container = wrapper.find('[data-vean-carousel-container]');
      const root = wrapper.find('[data-vean-carousel-root]');
      const previousButton = wrapper.find('[data-vean-carousel-previous]');
      const nextButton = wrapper.find('[data-vean-carousel-next]');

      expect(options.axis).toBe('y');
      expect(options.direction).toBe('rtl');
      expect(root.attributes('data-orientation')).toBe('vertical');
      expect(root.attributes('dir')).toBe('rtl');
      expect(container.classes()).toContain('h-full');
      expect(container.classes()).toContain('flex-col');
      expect(previousButton.exists()).toBe(true);
      expect(nextButton.exists()).toBe(true);
      wrapper.unmount();
    });

    it('falls back to localized default labels when no aria-label is provided', async () => {
      const wrapper = mount(SCarousel, {
        props: {
          slides: ['Slide 1', 'Slide 2', 'Slide 3']
        },
        slots: {
          item: ({ slide }) => slide
        },
        attachTo: document.body
      });
      await nextTick();

      expect(wrapper.find('[data-vean-carousel-root]').attributes('aria-label')).toBe('Carousel');
      expect(wrapper.find('[data-vean-carousel-previous]').attributes('aria-label')).toBe('Previous slide');
      expect(wrapper.find('[data-vean-carousel-next]').attributes('aria-label')).toBe('Next slide');
      expect(wrapper.findAll('[data-vean-visually-hidden]')).toHaveLength(2);
      wrapper.unmount();
    });
  });

  describe('interaction state', () => {
    it('updates controls and handles keyboard navigation', async () => {
      const wrapper = mountCarousel();
      await nextTick();

      const previousButton = wrapper.find('[data-vean-carousel-previous]');
      const nextButton = wrapper.find('[data-vean-carousel-next]');

      expect(previousButton.attributes('aria-disabled')).toBe('true');
      expect(nextButton.attributes('aria-disabled')).toBeUndefined();

      emblaMock.state.canScrollPrev = true;
      emblaMock.trigger('select');
      await nextTick();

      expect(previousButton.attributes('aria-disabled')).toBeUndefined();

      await previousButton.trigger('click');
      await nextButton.trigger('click');
      await wrapper.find('[data-vean-carousel-root]').trigger('keydown', { key: 'ArrowLeft' });
      await wrapper.find('[data-vean-carousel-root]').trigger('keydown', { key: 'ArrowRight' });

      expect(emblaMock.api.scrollPrev).toHaveBeenCalledTimes(2);
      expect(emblaMock.api.scrollNext).toHaveBeenCalledTimes(2);
      wrapper.unmount();
    });

    it('swaps horizontal arrow key behavior in rtl mode', async () => {
      emblaMock.state.canScrollPrev = true;

      const wrapper = mountCarousel({ dir: 'rtl' });
      await nextTick();

      await wrapper.find('[data-vean-carousel-root]').trigger('keydown', { key: 'ArrowLeft' });
      await wrapper.find('[data-vean-carousel-root]').trigger('keydown', { key: 'ArrowRight' });

      expect(emblaMock.api.scrollNext).toHaveBeenCalledTimes(1);
      expect(emblaMock.api.scrollPrev).toHaveBeenCalledTimes(1);
      wrapper.unmount();
    });

    it('does not intercept arrow keys from descendant inputs', async () => {
      const wrapper = mount(SCarousel, {
        props: {
          slides: ['Slide 1', 'Slide 2', 'Slide 3'],
          'aria-label': 'Interactive carousel'
        },
        slots: {
          item: () => h('input', { 'data-test-input': true })
        },
        attachTo: document.body
      });
      await nextTick();

      const input = wrapper.find('[data-test-input]');
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true
      });

      input.element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(emblaMock.api.scrollPrev).not.toHaveBeenCalled();
      expect(emblaMock.api.scrollNext).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mountCarousel();
      await nextTick();

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
