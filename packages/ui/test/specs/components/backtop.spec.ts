import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Backtop } from '@vean/aria/backtop';
import SBacktop from '@/components/backtop/backtop.vue';
import { getA11yViolations } from '../../shared/a11y';

interface MockScrollTarget {
  target: HTMLElement;
  getScrollTop: () => number;
  setScrollTop: (value: number) => void;
}

function createMockScrollTarget(initialScrollTop = 0): MockScrollTarget {
  const target = document.createElement('div');
  let scrollTop = initialScrollTop;

  Object.defineProperty(target, 'scrollTop', {
    configurable: true,
    get() {
      return scrollTop;
    },
    set(value: number) {
      scrollTop = value;
    }
  });

  Object.defineProperty(target, 'scrollTo', {
    configurable: true,
    value(options?: ScrollToOptions | number, top?: number) {
      if (typeof options === 'number') {
        scrollTop = top ?? options;

        return;
      }

      scrollTop = options?.top ?? 0;
    }
  });

  document.body.appendChild(target);

  return {
    target,
    getScrollTop: () => scrollTop,
    setScrollTop: value => {
      scrollTop = value;
    }
  };
}

async function waitForBacktopUpdate() {
  // Backtop schedules visibility updates with requestAnimationFrame, so the extra ticks keep the assertions aligned with
  // the component's async update cycle.
  await nextTick();
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve());
  });
  await nextTick();
}

function getBacktop(wrapper: ReturnType<typeof mount>) {
  return wrapper.findComponent({ name: 'Backtop' }).vm;
}

describe('SBacktop', () => {
  describe('rendering', () => {
    it('renders custom slot content', async () => {
      const wrapper = mount(SBacktop, {
        props: {
          visibilityHeight: 0
        },
        slots: {
          default: 'Top'
        },
        attachTo: document.body
      });

      await waitForBacktopUpdate();

      expect(wrapper.text()).toContain('Top');
      wrapper.unmount();
    });

    it('applies custom class names to the root button', async () => {
      const wrapper = mount(SBacktop, {
        props: {
          class: 'backtop-class',
          visibilityHeight: 0
        },
        attachTo: document.body
      });

      await waitForBacktopUpdate();

      expect(wrapper.find('button').classes()).toContain('backtop-class');
      wrapper.unmount();
    });

    it('supports direct Aria composition', async () => {
      const { target, setScrollTop } = createMockScrollTarget(0);

      const wrapper = mount(
        {
          components: {
            Backtop
          },
          setup() {
            return { target };
          },
          template: `
            <Backtop :target="target" :visibility-height="100" class="aria-backtop">
              Aria
            </Backtop>
          `
        },
        {
          attachTo: document.body
        }
      );

      setScrollTop(160);
      target.dispatchEvent(new Event('scroll'));
      await waitForBacktopUpdate();

      const button = wrapper.find('button');

      expect(button.classes()).toContain('aria-backtop');
      expect(button.attributes('data-vean-backtop')).toBe('');

      wrapper.unmount();
      target.remove();
    });
  });

  describe('visible state', () => {
    it('updates visible state when the target scroll position changes', async () => {
      const { target, setScrollTop } = createMockScrollTarget(0);

      const wrapper = mount(SBacktop, {
        props: {
          target,
          visibilityHeight: 100
        },
        attachTo: document.body
      });

      getBacktop(wrapper).updateVisibility();
      await waitForBacktopUpdate();

      const button = wrapper.find('button');

      expect(button.attributes('data-state')).toBe('hidden');
      expect(button.attributes('hidden')).toBe('');

      setScrollTop(160);
      target.dispatchEvent(new Event('scroll'));
      await waitForBacktopUpdate();

      expect(button.attributes('data-state')).toBe('visible');
      expect(button.attributes('hidden')).toBeUndefined();
      expect(wrapper.emitted('change')).toEqual([[true]]);

      wrapper.unmount();
      target.remove();
    });

    it('scrolls the target back to the top on click', async () => {
      const { target, getScrollTop } = createMockScrollTarget(180);

      const wrapper = mount(SBacktop, {
        props: {
          duration: 0,
          target,
          visibilityHeight: 100
        },
        attachTo: document.body
      });

      getBacktop(wrapper).updateVisibility();
      await waitForBacktopUpdate();

      await wrapper.find('button').trigger('click');
      await waitForBacktopUpdate();

      expect(getScrollTop()).toBe(0);
      expect(wrapper.emitted('click')).toHaveLength(1);

      wrapper.unmount();
      target.remove();
    });

    it('blurs the focused button before hiding it after scrolling to the top', async () => {
      const { target } = createMockScrollTarget(180);

      const wrapper = mount(SBacktop, {
        props: {
          duration: 0,
          target,
          visibilityHeight: 100
        },
        attachTo: document.body
      });

      getBacktop(wrapper).updateVisibility();
      await waitForBacktopUpdate();

      const button = wrapper.find('button');
      (button.element as HTMLButtonElement).focus();
      const blurSpy = vi.spyOn(button.element as HTMLButtonElement, 'blur');

      expect(document.activeElement).toBe(button.element);

      await button.trigger('click');
      await waitForBacktopUpdate();

      expect(blurSpy).toHaveBeenCalledTimes(1);
      expect(button.attributes('hidden')).toBe('');
      expect(button.attributes('aria-hidden')).toBeUndefined();

      wrapper.unmount();
      target.remove();
    });
  });

  describe('disabled state', () => {
    it('does not scroll or emit click when disabled', async () => {
      const { target, getScrollTop } = createMockScrollTarget(180);

      const wrapper = mount(SBacktop, {
        props: {
          disabled: true,
          duration: 0,
          target,
          visibilityHeight: 100
        },
        attachTo: document.body
      });

      getBacktop(wrapper).updateVisibility();
      await waitForBacktopUpdate();

      const button = wrapper.find('button');

      await button.trigger('click');
      await waitForBacktopUpdate();

      expect(button.attributes('aria-disabled')).toBe('true');
      expect(getScrollTop()).toBe(180);
      expect(wrapper.emitted('click')).toBeUndefined();

      wrapper.unmount();
      target.remove();
    });
  });

  describe('target resolution', () => {
    it('resolves a CSS selector string target', async () => {
      const { target } = createMockScrollTarget(0);
      target.id = 'scroll-container';

      const wrapper = mount(SBacktop, {
        props: {
          target: '#scroll-container',
          visibilityHeight: 100
        },
        attachTo: document.body
      });

      getBacktop(wrapper).updateVisibility();
      await waitForBacktopUpdate();

      const button = wrapper.find('button');
      expect(button.attributes('data-state')).toBe('hidden');

      wrapper.unmount();
      target.remove();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations with the default icon button', async () => {
      const wrapper = mount(SBacktop, {
        props: {
          visibilityHeight: 0
        },
        attachTo: document.body
      });

      await waitForBacktopUpdate();

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
