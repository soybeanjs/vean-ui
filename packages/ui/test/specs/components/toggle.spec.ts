import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SToggle from '@/components/toggle/toggle.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SToggle', () => {
  describe('rendering', () => {
    it('renders a button element with data-vean-toggle', () => {
      const wrapper = mount(SToggle, {
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.exists()).toBe(true);
      expect(button.attributes('data-vean-toggle')).toBeDefined();
      wrapper.unmount();
    });

    it('renders default slot content', () => {
      const wrapper = mount(SToggle, {
        slots: { default: 'Bold' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Bold');
      wrapper.unmount();
    });

    it('applies custom class', () => {
      const wrapper = mount(SToggle, {
        props: { class: 'my-toggle-class' },
        attachTo: document.body
      });

      expect(wrapper.find('button').classes()).toContain('my-toggle-class');
      wrapper.unmount();
    });
  });

  describe('pressed state', () => {
    it('is off by default', () => {
      const wrapper = mount(SToggle, {
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.attributes('aria-pressed')).toBe('false');
      expect(button.attributes('data-state')).toBe('off');
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', () => {
      const wrapper = mount(SToggle, {
        props: { defaultValue: true },
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.attributes('aria-pressed')).toBe('true');
      expect(button.attributes('data-state')).toBe('on');
      wrapper.unmount();
    });

    it('reflects modelValue as on state', () => {
      const wrapper = mount(SToggle, {
        props: { modelValue: true },
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.attributes('aria-pressed')).toBe('true');
      expect(button.attributes('data-state')).toBe('on');
      wrapper.unmount();
    });

    it('updates when a controlled modelValue changes', async () => {
      const wrapper = mount(SToggle, {
        props: { modelValue: false },
        attachTo: document.body
      });

      await wrapper.setProps({ modelValue: true });

      expect(wrapper.find('button').attributes('aria-pressed')).toBe('true');
      expect(wrapper.find('button').attributes('data-state')).toBe('on');
      wrapper.unmount();
    });

    it('toggles data-state when clicked in uncontrolled mode', async () => {
      const wrapper = mount(SToggle, {
        attachTo: document.body
      });

      expect(wrapper.find('button').attributes('data-state')).toBe('off');

      await wrapper.find('button').trigger('click');

      expect(wrapper.find('button').attributes('data-state')).toBe('on');
      wrapper.unmount();
    });

    it('emits update:modelValue on click', async () => {
      const wrapper = mount(SToggle, {
        props: { modelValue: false },
        attachTo: document.body
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
      wrapper.unmount();
    });
  });

  describe('variants', () => {
    it('applies variant and size classes', () => {
      const wrapper = mount(SToggle, {
        props: { variant: 'outline', size: 'sm', shape: 'rounded' },
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.classes()).toContain('border-border');
      expect(button.classes()).toContain('h-7');
      expect(button.classes()).toContain('rounded-full');
      wrapper.unmount();
    });

    it('applies color classes', () => {
      const wrapper = mount(SToggle, {
        props: { color: 'primary' },
        attachTo: document.body
      });

      expect(wrapper.find('button').classes()).toContain('focus-visible:ring-primary/30');
      wrapper.unmount();
    });
  });

  describe('slot props', () => {
    it('exposes pressed state to the default slot', () => {
      const wrapper = mount(SToggle, {
        props: { modelValue: true, disabled: true },
        slots: {
          default:
            '<template #default="{ modelValue, pressed, state, disabled }">{{ modelValue }}-{{ pressed }}-{{ state }}-{{ disabled }}</template>'
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('true-true-on-true');
      wrapper.unmount();
    });
  });

  describe('events', () => {
    it('forwards native click events', async () => {
      const onClick = vi.fn();

      const wrapper = mount(SToggle, {
        props: { onClick },
        attachTo: document.body
      });

      await wrapper.find('button').trigger('click');

      expect(onClick).toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('renders disabled and aria-disabled attributes', () => {
      const wrapper = mount(SToggle, {
        props: { disabled: true },
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBeDefined();
      expect(button.attributes('aria-disabled')).toBe('true');
      wrapper.unmount();
    });

    it('prevents interaction when disabled', async () => {
      const wrapper = mount(SToggle, {
        props: { disabled: true, modelValue: false },
        attachTo: document.body
      });

      const button = wrapper.find('button');

      expect(button.attributes('disabled')).toBe('');
      await button.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SToggle, {
        slots: { default: 'Bold' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations when pressed', async () => {
      const wrapper = mount(SToggle, {
        props: { modelValue: true },
        slots: { default: 'Bold' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
