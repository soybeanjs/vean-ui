import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { SInputClear } from '@/components/input';
import SInput from '@/components/input/input.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SInput', () => {
  describe('rendering', () => {
    it('renders an input element', () => {
      const wrapper = mount(SInput, { attachTo: document.body });
      expect(wrapper.find('input').exists()).toBe(true);
      wrapper.unmount();
    });

    it('passes placeholder attribute', () => {
      const wrapper = mount(SInput, {
        attrs: { placeholder: 'Enter text' },
        attachTo: document.body
      });
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text');
      wrapper.unmount();
    });

    it('passes type attribute', () => {
      const wrapper = mount(SInput, {
        props: {
          controlProps: {
            type: 'email'
          }
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('type')).toBe('email');

      wrapper.unmount();
    });

    it('applies custom class to root element', () => {
      const wrapper = mount(SInput, {
        props: { class: 'my-input' },
        attachTo: document.body
      });
      // Root element should carry the custom class
      expect(wrapper.html()).toContain('my-input');
      wrapper.unmount();
    });

    it('passes readonly attribute', () => {
      const wrapper = mount(SInput, {
        props: { readonly: true },
        attachTo: document.body
      });
      expect(wrapper.find('input').attributes('readonly')).toBeDefined();
      wrapper.unmount();
    });

    it('passes maxlength, minlength and pattern attributes', () => {
      const wrapper = mount(SInput, {
        props: { maxlength: 10, minlength: 2, pattern: '[a-z]+' },
        attachTo: document.body
      });
      const input = wrapper.find('input');
      expect(input.attributes('maxlength')).toBe('10');
      expect(input.attributes('minlength')).toBe('2');
      expect(input.attributes('pattern')).toBe('[a-z]+');
      wrapper.unmount();
    });

    it('renders leading and trailing slots', () => {
      const wrapper = mount(
        {
          components: { SInput },
          template: `
            <SInput>
              <template #leading>@</template>
              <template #trailing>#</template>
            </SInput>
          `
        },
        { attachTo: document.body }
      );
      expect(wrapper.text()).toContain('@');
      expect(wrapper.text()).toContain('#');
      wrapper.unmount();
    });

    it('renders a visually hidden input for form submission when a name is set', () => {
      const wrapper = mount(SInput, {
        props: { name: 'email' },
        attachTo: document.body
      });
      const hiddenInputs = wrapper.findAll('[data-vean-visually-hidden-input]');
      expect(hiddenInputs).toHaveLength(1);
      expect(hiddenInputs[0].attributes('name')).toBe('email');
      wrapper.unmount();
    });

    it('does not render a visually hidden input without a name', () => {
      const wrapper = mount(SInput, { attachTo: document.body });
      expect(wrapper.find('[data-vean-visually-hidden-input]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('applies the size variant class to the root element', () => {
      const wrapper = mount(SInput, {
        props: { size: 'lg' },
        attachTo: document.body
      });
      expect(wrapper.find('[data-vean-input-root]').classes()).toContain('h-9');
      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('reflects modelValue in input', () => {
      const wrapper = mount(SInput, {
        props: { modelValue: 'hello' },
        attachTo: document.body
      });
      expect(wrapper.find('input').element.value).toBe('hello');
      wrapper.unmount();
    });

    it('emits update:modelValue on input', async () => {
      const wrapper = mount(SInput, { attachTo: document.body });
      await wrapper.find('input').setValue('typed text');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['typed text']);
      wrapper.unmount();
    });

    it('uses defaultValue as the uncontrolled initial value', () => {
      const wrapper = mount(SInput, {
        props: { defaultValue: 'initial' },
        attachTo: document.body
      });
      expect(wrapper.find('input').element.value).toBe('initial');
      wrapper.unmount();
    });

    it('calls inputRef with the input element', () => {
      const inputRef = vi.fn();
      mount(SInput, {
        props: { inputRef },
        attachTo: document.body
      });
      expect(inputRef).toHaveBeenCalledOnce();
      expect(inputRef.mock.calls[0]?.[0]).toBeInstanceOf(HTMLInputElement);
    });

    it('renders clear trigger and emits empty value when clearing', async () => {
      const wrapper = mount(SInput, {
        props: {
          modelValue: 'hello',
          clearable: true
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-clearable]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);

      wrapper.unmount();
    });

    it('clears through SInputClear in the clear slot', async () => {
      const wrapper = mount(
        {
          components: {
            SInput,
            SInputClear
          },
          template: `
            <SInput model-value="hello" clearable @update:model-value="$emit('update:modelValue', $event)">
              <template #clear>
                <SInputClear aria-label="Custom clear">Clear</SInputClear>
              </template>
            </SInput>
          `
        },
        { attachTo: document.body }
      );

      await wrapper.findComponent(SInputClear).trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('applies disabled attribute', () => {
      const wrapper = mount(SInput, {
        props: { disabled: true },
        attachTo: document.body
      });
      expect(wrapper.find('input').element.disabled).toBe(true);
      wrapper.unmount();
    });

    it('disables the clear trigger and does not clear when disabled', async () => {
      const wrapper = mount(SInput, {
        props: {
          modelValue: 'hello',
          clearable: true,
          disabled: true
        },
        attachTo: document.body
      });

      const clearButton = wrapper.find('[data-vean-input-clearable]');
      expect(clearButton.attributes('aria-disabled')).toBe('true');

      await clearButton.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();

      wrapper.unmount();
    });

    it('disables the clear trigger when readonly', () => {
      const wrapper = mount(SInput, {
        props: {
          modelValue: 'hello',
          clearable: true,
          readonly: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-clearable]').attributes('aria-disabled')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('clear trigger accessibility', () => {
    it('renders a default i18n aria-label on the clear trigger', () => {
      const wrapper = mount(SInput, {
        props: { clearable: true },
        attachTo: document.body
      });
      expect(wrapper.find('[data-vean-input-clearable]').attributes('aria-label')).toBe('Clear input');
      wrapper.unmount();
    });

    it('lets the consumer override the clear trigger aria-label', () => {
      const wrapper = mount(SInput, {
        props: {
          clearable: true,
          clearProps: { 'aria-label': 'Empty the field' }
        },
        attachTo: document.body
      });
      expect(wrapper.find('[data-vean-input-clearable]').attributes('aria-label')).toBe('Empty the field');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      // Wrap in a labelled form field to satisfy a11y rules
      const wrapper = mount(
        {
          template: `
            <div>
              <label for="test-input">Name</label>
              <SInput id="test-input" />
            </div>
          `,
          components: { SInput }
        },
        { attachTo: document.body }
      );
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations with a labelled clearable input', async () => {
      const wrapper = mount(
        {
          template: `
            <div>
              <label for="test-clear-input">Name</label>
              <SInput id="test-clear-input" clearable model-value="hello" />
            </div>
          `,
          components: { SInput }
        },
        { attachTo: document.body }
      );
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
