import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SSwitch from '@/components/switch/switch.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SSwitch', () => {
  describe('rendering', () => {
    it('renders a switch control', () => {
      const wrapper = mount(SSwitch, { attachTo: document.body });
      expect(wrapper.find('[role="switch"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders leading and trailing slots', () => {
      const wrapper = mount(SSwitch, {
        slots: {
          leading: '<span data-testid="leading">Off</span>',
          trailing: '<span data-testid="trailing">On</span>'
        },
        attachTo: document.body
      });
      expect(wrapper.find('[data-testid="leading"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="trailing"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders default slot content inside the thumb', () => {
      const wrapper = mount(SSwitch, {
        slots: {
          default: '<span data-testid="thumb-slot">T</span>'
        },
        attachTo: document.body
      });
      expect(wrapper.find('[data-vean-switch-thumb] [data-testid="thumb-slot"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('merges a custom class onto the root container', () => {
      const wrapper = mount(SSwitch, {
        props: { class: 'switch-root-class' },
        attachTo: document.body
      });
      expect(wrapper.find('.switch-root-class').exists()).toBe(true);
      wrapper.unmount();
    });

    it('reflects data-state on control, thumb and root', () => {
      const wrapper = mount(SSwitch, {
        props: { modelValue: true },
        attachTo: document.body
      });
      expect(wrapper.find('[role="switch"]').attributes('data-state')).toBe('checked');
      expect(wrapper.find('[data-vean-switch-thumb]').attributes('data-state')).toBe('checked');
      expect(wrapper.find('[data-vean-switch-root]').attributes('data-state')).toBe('checked');
      wrapper.unmount();
    });
  });

  describe('checked state', () => {
    it('is unchecked by default', () => {
      const wrapper = mount(SSwitch, { attachTo: document.body });
      const control = wrapper.find('[role="switch"]');
      expect(control.attributes('aria-checked')).toBe('false');
      expect(control.attributes('data-state')).toBe('unchecked');
      wrapper.unmount();
    });

    it('reflects modelValue=true as checked', () => {
      const wrapper = mount(SSwitch, {
        props: { modelValue: true },
        attachTo: document.body
      });
      const control = wrapper.find('[role="switch"]');
      expect(control.attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    });

    it('emits update:modelValue on click', async () => {
      const wrapper = mount(SSwitch, {
        props: { modelValue: false },
        attachTo: document.body
      });
      await wrapper.find('[role="switch"]').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      const [emittedValue] = wrapper.emitted('update:modelValue')![0];
      expect(emittedValue).toBe(true);
      wrapper.unmount();
    });

    it('toggles off when currently on', async () => {
      const wrapper = mount(SSwitch, {
        props: { modelValue: true },
        attachTo: document.body
      });
      await wrapper.find('[role="switch"]').trigger('click');
      const [emittedValue] = wrapper.emitted('update:modelValue')![0];
      expect(emittedValue).toBe(false);
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', () => {
      const wrapper = mount(SSwitch, {
        props: { defaultValue: true },
        attachTo: document.body
      });
      expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    });

    it('supports custom trueValue/falseValue', async () => {
      const wrapper = mount(SSwitch, {
        props: { trueValue: 'on', falseValue: 'off', modelValue: 'on' },
        attachTo: document.body
      });
      const control = wrapper.find('[role="switch"]');
      expect(control.attributes('aria-checked')).toBe('true');
      await control.trigger('click');
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('off');
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('toggles on Enter key', async () => {
      const wrapper = mount(SSwitch, {
        props: { modelValue: false },
        attachTo: document.body
      });
      await wrapper.find('[role="switch"]').trigger('keydown', { key: 'Enter' });
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe(true);
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('does not emit when disabled', async () => {
      const wrapper = mount(SSwitch, {
        props: { disabled: true, modelValue: false },
        attachTo: document.body
      });
      await wrapper.find('[role="switch"]').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('form proxy', () => {
    it('renders a visually hidden input carrying name/value when inside a form control', () => {
      const wrapper = mount(SSwitch, {
        props: { name: 'dark-mode', value: 'on', modelValue: true, class: 'form' },
        attachTo: document.body
      });
      const input = wrapper.find('[data-vean-visually-hidden-input]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('name')).toBe('dark-mode');
      expect(input.attributes('value')).toBe('on');
      wrapper.unmount();
    });

    it('checks the hidden input only when modelValue equals trueValue', () => {
      const wrapper = mount(SSwitch, {
        props: {
          name: 'dark-mode',
          trueValue: 'on',
          falseValue: 'off',
          modelValue: 'off',
          class: 'form'
        },
        attachTo: document.body
      });
      const input = wrapper.find('[data-vean-visually-hidden-input]');
      expect((input.element as HTMLInputElement).checked).toBe(false);
      wrapper.unmount();
    });

    it('checks the hidden input when modelValue equals trueValue', () => {
      const wrapper = mount(SSwitch, {
        props: {
          name: 'dark-mode',
          trueValue: 'on',
          falseValue: 'off',
          modelValue: 'on',
          class: 'form'
        },
        attachTo: document.body
      });
      const input = wrapper.find('[data-vean-visually-hidden-input]');
      expect((input.element as HTMLInputElement).checked).toBe(true);
      wrapper.unmount();
    });
  });

  describe('required state', () => {
    it('reflects required via aria-required', () => {
      const wrapper = mount(SSwitch, {
        props: { required: true },
        attachTo: document.body
      });
      expect(wrapper.find('[role="switch"]').attributes('aria-required')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('class overrides', () => {
    it('applies per-slot ui overrides to the control', () => {
      const wrapper = mount(SSwitch, {
        props: { ui: { control: 'custom-control-class' } },
        attachTo: document.body
      });
      expect(wrapper.find('[role="switch"]').classes()).toContain('custom-control-class');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in off state', async () => {
      const wrapper = mount(SSwitch, {
        // Pass aria-label directly to the inner control button
        props: { controlProps: { 'aria-label': 'Dark mode' } },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in on state', async () => {
      const wrapper = mount(SSwitch, {
        props: { modelValue: true, controlProps: { 'aria-label': 'Dark mode' } },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
