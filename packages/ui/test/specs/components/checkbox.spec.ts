import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SCheckbox from '@/components/checkbox/checkbox.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SCheckbox', () => {
  describe('rendering', () => {
    it('renders a checkbox control', () => {
      const wrapper = mount(SCheckbox, { attachTo: document.body });
      // CheckboxControl renders as a div with role="checkbox"
      expect(wrapper.find('[role="checkbox"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders label text when label prop is provided', () => {
      const wrapper = mount(SCheckbox, {
        props: { label: 'Accept terms' },
        attachTo: document.body
      });
      expect(wrapper.text()).toContain('Accept terms');
      wrapper.unmount();
    });

    it('renders default slot as label', () => {
      const wrapper = mount(SCheckbox, {
        slots: { default: 'My checkbox' },
        attachTo: document.body
      });
      expect(wrapper.text()).toContain('My checkbox');
      wrapper.unmount();
    });
  });

  describe('checked state', () => {
    it('is unchecked by default', () => {
      const wrapper = mount(SCheckbox, { attachTo: document.body });
      const control = wrapper.find('[role="checkbox"]');
      expect(control.attributes('aria-checked')).toBe('false');
      wrapper.unmount();
    });

    it('reflects modelValue=true as checked', () => {
      const wrapper = mount(SCheckbox, {
        props: { modelValue: true },
        attachTo: document.body
      });
      const control = wrapper.find('[role="checkbox"]');
      expect(control.attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    });

    it('reflects modelValue="indeterminate" state', () => {
      const wrapper = mount(SCheckbox, {
        props: { modelValue: 'indeterminate' },
        attachTo: document.body
      });
      const control = wrapper.find('[role="checkbox"]');
      expect(control.attributes('aria-checked')).toBe('mixed');
      wrapper.unmount();
    });

    it('emits update:modelValue on click', async () => {
      const wrapper = mount(SCheckbox, {
        props: { modelValue: false },
        attachTo: document.body
      });
      await wrapper.find('[role="checkbox"]').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('applies disabled to checkbox control when disabled', () => {
      const wrapper = mount(SCheckbox, {
        props: { disabled: true },
        attachTo: document.body
      });
      const control = wrapper.find('[role="checkbox"]');
      // CheckboxControl uses native disabled
      // @ts-expect-error - Vue Test Utils does not recognize the disabled attribute on non-native elements
      expect(control.element.disabled).toBe(true);
      wrapper.unmount();
    });
  });

  describe('data-state', () => {
    it('reflects data-state for unchecked and checked states', () => {
      const unchecked = mount(SCheckbox, { attachTo: document.body });
      expect(unchecked.find('[role="checkbox"]').attributes('data-state')).toBe('unchecked');
      unchecked.unmount();

      const checked = mount(SCheckbox, { props: { modelValue: true }, attachTo: document.body });
      expect(checked.find('[role="checkbox"]').attributes('data-state')).toBe('checked');
      checked.unmount();
    });

    it('reflects data-state="indeterminate" for indeterminate modelValue', () => {
      const wrapper = mount(SCheckbox, {
        props: { modelValue: 'indeterminate' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="checkbox"]').attributes('data-state')).toBe('indeterminate');
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('toggles the checkbox on Enter key', async () => {
      const wrapper = mount(SCheckbox, {
        props: { modelValue: false },
        attachTo: document.body
      });

      await wrapper.find('[role="checkbox"]').trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe(true);
      wrapper.unmount();
    });
  });

  describe('form proxy', () => {
    it('renders a visually hidden checkbox input with name and value', () => {
      const wrapper = mount(SCheckbox, {
        props: { name: 'terms', value: 'on', class: 'form', modelValue: true },
        attachTo: document.body
      });

      const input = wrapper.find('[data-vean-visually-hidden-input]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('name')).toBe('terms');
      expect(input.attributes('value')).toBe('on');
      expect((input.element as HTMLInputElement).checked).toBe(true);
      wrapper.unmount();
    });

    it('submits the custom value prop', () => {
      const wrapper = mount(SCheckbox, {
        props: { name: 'option', value: 'custom-value', class: 'form', modelValue: true },
        attachTo: document.body
      });

      const input = wrapper.find('[data-vean-visually-hidden-input]');
      expect(input.attributes('value')).toBe('custom-value');
      wrapper.unmount();
    });
  });

  describe('label association', () => {
    it('associates the label with the control via for/id', () => {
      const wrapper = mount(SCheckbox, {
        props: { label: 'Accept terms' },
        attachTo: document.body
      });

      const controlId = wrapper.find('[role="checkbox"]').attributes('id');
      expect(controlId).toBeTruthy();
      expect(wrapper.find('label').attributes('for')).toBe(controlId);
      wrapper.unmount();
    });
  });

  describe('class overrides', () => {
    it('merges a custom class onto the root', () => {
      const wrapper = mount(SCheckbox, {
        props: { label: 'Terms', class: 'checkbox-root-class' },
        attachTo: document.body
      });

      expect(wrapper.find('.checkbox-root-class').exists()).toBe(true);
      wrapper.unmount();
    });

    it('applies per-slot ui overrides to the control', () => {
      const wrapper = mount(SCheckbox, {
        props: { label: 'Terms', ui: { control: 'custom-control-class' } },
        attachTo: document.body
      });

      expect(wrapper.find('[role="checkbox"]').classes()).toContain('custom-control-class');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations with a label prop', async () => {
      const wrapper = mount(SCheckbox, {
        props: { label: 'Accept terms' },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in indeterminate state', async () => {
      const wrapper = mount(SCheckbox, {
        props: { modelValue: 'indeterminate', label: 'Accept terms' },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
