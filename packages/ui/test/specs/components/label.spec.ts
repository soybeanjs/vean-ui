import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SLabel from '@/components/label/label.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SLabel', () => {
  describe('rendering', () => {
    it('renders a native label element with default slot content', () => {
      const wrapper = mount(SLabel, {
        slots: { default: 'Email address' },
        attachTo: document.body
      });

      const label = wrapper.get('label');
      expect(label.attributes('data-vean-label')).toBe('');
      expect(label.text()).toBe('Email address');

      wrapper.unmount();
    });

    it('renders the for attribute on the label', () => {
      const wrapper = mount(SLabel, {
        props: { for: 'email-input' },
        slots: { default: 'Email' },
        attachTo: document.body
      });

      expect(wrapper.get('label').attributes('for')).toBe('email-input');

      wrapper.unmount();
    });

    it('applies custom root class', () => {
      const wrapper = mount(SLabel, {
        props: { class: 'custom-label' },
        slots: { default: 'Label' },
        attachTo: document.body
      });

      expect(wrapper.get('label').classes()).toContain('custom-label');

      wrapper.unmount();
    });

    it('forwards HTML attributes to the label element', () => {
      const wrapper = mount(SLabel, {
        props: { for: 'name', id: 'name-label', 'data-testid': 'name-label' },
        slots: { default: 'Name' },
        attachTo: document.body
      });

      const label = wrapper.get('label');
      expect(label.attributes('for')).toBe('name');
      expect(label.attributes('id')).toBe('name-label');
      expect(label.attributes('data-testid')).toBe('name-label');

      wrapper.unmount();
    });
  });

  describe('size variants', () => {
    it('applies md text size by default', () => {
      const wrapper = mount(SLabel, {
        slots: { default: 'Label' },
        attachTo: document.body
      });

      expect(wrapper.get('label').classes()).toContain('text-sm');
      wrapper.unmount();
    });

    it('applies lg text size', () => {
      const wrapper = mount(SLabel, {
        props: { size: 'lg' },
        slots: { default: 'Label' },
        attachTo: document.body
      });

      expect(wrapper.get('label').classes()).toContain('text-base');
      wrapper.unmount();
    });

    it('applies xs text size', () => {
      const wrapper = mount(SLabel, {
        props: { size: 'xs' },
        slots: { default: 'Label' },
        attachTo: document.body
      });

      expect(wrapper.get('label').classes()).toContain('text-2xs');
      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('prevents text selection on double-click', async () => {
      const wrapper = mount(SLabel, {
        slots: { default: 'Label' },
        attachTo: document.body
      });

      const label = wrapper.get('label');
      const event = new MouseEvent('mousedown', { detail: 2, cancelable: true });
      label.element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);

      wrapper.unmount();
    });

    it('does not prevent default on single click', async () => {
      const wrapper = mount(SLabel, {
        slots: { default: 'Label' },
        attachTo: document.body
      });

      const label = wrapper.get('label');
      const event = new MouseEvent('mousedown', { detail: 1, cancelable: true });
      label.element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SLabel, {
        props: { for: 'test-input' },
        slots: { default: 'Test Label' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
