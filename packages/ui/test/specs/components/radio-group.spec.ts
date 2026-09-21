import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { RadioGroupControl, RadioGroupItem, RadioGroupRoot } from '@vean/aria/radio-group';
import SRadioGroup from '@/components/radio-group/radio-group.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { value: 'option-1', label: 'Option 1' },
  { value: 'option-2', label: 'Option 2' },
  { value: 'option-3', label: 'Option 3', disabled: true }
];

describe('SRadioGroup', () => {
  describe('rendering', () => {
    it('renders a radio control for each item', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="radio"]')).toHaveLength(items.length);
      expect(wrapper.text()).toContain('Option 1');
      wrapper.unmount();
    });

    it('merges a custom class onto the root container', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, class: 'radio-group-root-class' },
        attachTo: document.body
      });

      expect(wrapper.find('.radio-group-root-class').exists()).toBe(true);
      wrapper.unmount();
    });

    it('reflects orientation via aria-orientation', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, orientation: 'vertical' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="radiogroup"]').attributes('aria-orientation')).toBe('vertical');
      wrapper.unmount();
    });

    it('reflects data-state for checked and unchecked items', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="radio"]')[0].attributes('data-state')).toBe('checked');
      expect(wrapper.findAll('[role="radio"]')[1].attributes('data-state')).toBe('unchecked');
      wrapper.unmount();
    });
  });

  describe('active state', () => {
    it('reflects the checked item with aria-checked', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="radio"]')[0].attributes('aria-checked')).toBe('true');
      expect(wrapper.findAll('[role="radio"]')[1].attributes('aria-checked')).toBe('false');
      wrapper.unmount();
    });

    it('emits update:modelValue when a radio is clicked', async () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="radio"]')[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('option-2');
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, defaultValue: 'option-2' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="radio"]')[1].attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    });

    it('updates the checked item when a controlled modelValue changes', async () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      await wrapper.setProps({ modelValue: 'option-2' });

      expect(wrapper.findAll('[role="radio"]')[1].attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('selects the focused radio on Enter key', async () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="radio"]')[1].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('option-2');
      wrapper.unmount();
    });

    it('moves focus with ArrowDown and checks the focused radio', async () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      const [first, second] = wrapper.findAll('[role="radio"]');
      await first.trigger('keydown', { key: 'ArrowDown' });

      expect(second.element).toBe(document.activeElement);

      // the focused radio is checked after the focus-derived click is flushed
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('option-2');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('applies disabled to disabled radio items', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items },
        attachTo: document.body
      });

      const disabledControl = wrapper.findAll('[role="radio"]')[2];
      // @ts-expect-error - Vue Test Utils does not recognize the disabled property on role selectors
      expect(disabledControl.element.disabled).toBe(true);
      wrapper.unmount();
    });

    it('does not emit update:modelValue when a disabled radio is clicked', async () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="radio"]')[2].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('disables every item when the group root is disabled', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, disabled: true },
        attachTo: document.body
      });

      const controls = wrapper.findAll('[role="radio"]');
      expect(controls).toHaveLength(items.length);
      controls.forEach(control => {
        // @ts-expect-error - Vue Test Utils does not recognize the disabled property on role selectors
        expect(control.element.disabled).toBe(true);
      });
      wrapper.unmount();
    });
  });

  describe('form proxy', () => {
    it('renders a visually hidden input carrying the current value when name is set', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, name: 'favorite', modelValue: 'option-1', class: 'form' },
        attachTo: document.body
      });

      const input = wrapper.find('[data-vean-visually-hidden-input]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('name')).toBe('favorite');
      expect(input.attributes('value')).toBe('option-1');
      wrapper.unmount();
    });
  });

  describe('label association', () => {
    it('associates each label with its control via for/id', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items },
        attachTo: document.body
      });

      const labels = wrapper.findAll('label');
      const controlId = wrapper.findAll('[role="radio"]')[0].attributes('id');
      expect(controlId).toBeTruthy();
      expect(labels[0].attributes('for')).toBe(controlId);
      wrapper.unmount();
    });

    it('does not fall back to the item value as the accessible name when no label is associated', async () => {
      document.body.innerHTML = '';
      const wrapper = mount(
        {
          components: { RadioGroupRoot, RadioGroupItem, RadioGroupControl },
          template: `
            <RadioGroupRoot>
              <RadioGroupItem value="option-1">
                <RadioGroupControl id="r1" />
              </RadioGroupItem>
            </RadioGroupRoot>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      expect(wrapper.find('[role="radio"]').attributes('aria-label')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('class overrides', () => {
    it('applies per-slot ui overrides to the control', () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, ui: { control: 'custom-control-class' } },
        attachTo: document.body
      });

      expect(wrapper.find('[role="radio"]').classes()).toContain('custom-control-class');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SRadioGroup, {
        props: { items, modelValue: 'option-1' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
