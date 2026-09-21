import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { SAspectRatio } from '@/components/aspect-ratio';
import { getA11yViolations } from '../../shared/a11y';

describe('SAspectRatio', () => {
  describe('rendering', () => {
    it('renders with default 1:1 ratio', () => {
      const wrapper = mount(SAspectRatio, {
        slots: { default: '<img src="test.jpg" alt="test" />' },
        attachTo: document.body
      });

      const wrapperEl = wrapper.get('[data-vean-aspect-ratio-wrapper]');
      // 1:1 ratio → paddingBottom = (1/1) * 100 = 100%
      expect(wrapperEl.attributes('style')).toContain('padding-bottom: 100%');

      wrapper.unmount();
    });

    it('renders with a custom ratio', () => {
      const wrapper = mount(SAspectRatio, {
        props: { ratio: 16 / 9 },
        slots: { default: '<img src="test.jpg" alt="test" />' },
        attachTo: document.body
      });

      const wrapperEl = wrapper.get('[data-vean-aspect-ratio-wrapper]');
      // 16:9 ratio → paddingBottom = (9/16) * 100 ≈ 56.25%
      expect(wrapperEl.attributes('style')).toContain('padding-bottom: 56.25%');

      wrapper.unmount();
    });

    it('renders slot content inside the aspect ratio container', () => {
      const wrapper = mount(SAspectRatio, {
        slots: { default: '<span data-child>Content</span>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-child]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-aspect-ratio]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('sets position relative on the wrapper', () => {
      const wrapper = mount(SAspectRatio, {
        slots: { default: '<span />' },
        attachTo: document.body
      });

      const wrapperEl = wrapper.get('[data-vean-aspect-ratio-wrapper]');
      expect(wrapperEl.attributes('style')).toContain('position: relative');

      wrapper.unmount();
    });

    it('sets position absolute on the content element', () => {
      const wrapper = mount(SAspectRatio, {
        slots: { default: '<span />' },
        attachTo: document.body
      });

      const contentEl = wrapper.get('[data-vean-aspect-ratio]');
      expect(contentEl.attributes('style')).toContain('position: absolute');

      wrapper.unmount();
    });
  });

  describe('polymorphic rendering', () => {
    it('renders as a div by default', () => {
      const wrapper = mount(SAspectRatio, {
        slots: { default: '<span />' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-aspect-ratio]').element.tagName).toBe('DIV');

      wrapper.unmount();
    });

    it('renders as a custom element via the as prop', () => {
      const wrapper = mount(SAspectRatio, {
        props: { as: 'section' },
        slots: { default: '<span />' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-aspect-ratio]').element.tagName).toBe('SECTION');

      wrapper.unmount();
    });
  });

  describe('slot props', () => {
    it('exposes the aspect percentage via the default slot', () => {
      let slotAspect: number | undefined;

      const wrapper = mount(SAspectRatio, {
        props: { ratio: 16 / 9 },
        slots: {
          default: (scope: { aspect: number }) => {
            slotAspect = scope.aspect;
            return '<span />';
          }
        },
        attachTo: document.body
      });

      // 16:9 ratio → aspect = (9/16) * 100 ≈ 56.25
      expect(slotAspect).toBeCloseTo(56.25, 1);

      wrapper.unmount();
    });
  });

  describe('class forwarding', () => {
    it('forwards class to the content element', () => {
      const wrapper = mount(SAspectRatio, {
        props: { class: 'rounded-lg overflow-hidden' },
        slots: { default: '<span />' },
        attachTo: document.body
      });

      const contentEl = wrapper.get('[data-vean-aspect-ratio]');
      expect(contentEl.classes()).toContain('rounded-lg');
      expect(contentEl.classes()).toContain('overflow-hidden');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SAspectRatio, {
        slots: { default: '<img src="test.jpg" alt="A test image" />' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
