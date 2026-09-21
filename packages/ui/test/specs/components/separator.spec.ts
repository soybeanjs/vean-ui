import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SSeparator from '@/components/separator/separator.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SSeparator', () => {
  describe('rendering', () => {
    it('renders a separator with the default horizontal orientation', () => {
      const wrapper = mount(SSeparator, { attachTo: document.body });
      const separator = wrapper.get('[role="separator"]');

      expect(separator.attributes('data-orientation')).toBe('horizontal');
      expect(separator.attributes('data-vean-separator-root')).toBe('');
      wrapper.unmount();
    });

    it('renders label text from the label prop', () => {
      const wrapper = mount(SSeparator, {
        props: { label: 'Section' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-label]').text()).toBe('Section');
      wrapper.unmount();
    });

    it('renders the default slot inside the label', () => {
      const wrapper = mount(SSeparator, {
        slots: { default: 'Slot label' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-label]').text()).toBe('Slot label');
      wrapper.unmount();
    });

    it('merges custom root and label classes', () => {
      const wrapper = mount(SSeparator, {
        props: {
          class: 'custom-root',
          ui: {
            label: 'custom-label'
          },
          label: 'Section'
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-root]').classes()).toContain('custom-root');
      expect(wrapper.get('[data-vean-separator-label]').classes()).toContain('custom-label');
      wrapper.unmount();
    });
  });

  describe('orientation state', () => {
    it('does not render a label for vertical separators', () => {
      const wrapper = mount(SSeparator, {
        props: {
          orientation: 'vertical',
          label: 'Section'
        },
        attachTo: document.body
      });

      expect(wrapper.get('[role="separator"]').attributes('data-orientation')).toBe('vertical');
      expect(wrapper.find('[data-vean-separator-label]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('sets aria-orientation to vertical for vertical separators', () => {
      const wrapper = mount(SSeparator, {
        props: { orientation: 'vertical' },
        attachTo: document.body
      });

      expect(wrapper.get('[role="separator"]').attributes('aria-orientation')).toBe('vertical');
      wrapper.unmount();
    });

    it('omits aria-orientation for horizontal separators', () => {
      const wrapper = mount(SSeparator, {
        attachTo: document.body
      });

      expect(wrapper.get('[role="separator"]').attributes('aria-orientation')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('decorative', () => {
    it('sets role="none" when decorative is true', () => {
      const wrapper = mount(SSeparator, {
        props: { decorative: true },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-root]').attributes('role')).toBe('none');
      wrapper.unmount();
    });

    it('omits aria-orientation when decorative and vertical', () => {
      const wrapper = mount(SSeparator, {
        props: { decorative: true, orientation: 'vertical' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-root]').attributes('role')).toBe('none');
      expect(wrapper.get('[data-vean-separator-root]').attributes('aria-orientation')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('border variants', () => {
    it('applies dashed border class', () => {
      const wrapper = mount(SSeparator, {
        props: { border: 'dashed' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-root]').classes()).toContain('border-dashed');
      wrapper.unmount();
    });

    it('applies dotted border class', () => {
      const wrapper = mount(SSeparator, {
        props: { border: 'dotted' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-root]').classes()).toContain('border-dotted');
      wrapper.unmount();
    });

    it('applies solid border class by default', () => {
      const wrapper = mount(SSeparator, {
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-separator-root]').classes()).toContain('border-solid');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations with a visible label', async () => {
      const wrapper = mount(SSeparator, {
        props: { label: 'Section' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
