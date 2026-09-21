import { describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { STextareaClear } from '@/components/textarea';
import STextarea from '@/components/textarea/textarea.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('STextarea', () => {
  describe('rendering', () => {
    it('renders a textarea element', () => {
      const wrapper = mount(STextarea, { attachTo: document.body });

      expect(wrapper.find('textarea').exists()).toBe(true);

      wrapper.unmount();
    });

    it('passes placeholder attribute', () => {
      const wrapper = mount(STextarea, {
        props: { placeholder: 'Enter text' },
        attachTo: document.body
      });

      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text');

      wrapper.unmount();
    });

    it('passes readonly attribute', () => {
      const wrapper = mount(STextarea, {
        props: { readonly: true },
        attachTo: document.body
      });

      expect(wrapper.find('textarea').attributes('readonly')).toBeDefined();

      wrapper.unmount();
    });

    it('passes maxlength and minlength attributes', () => {
      const wrapper = mount(STextarea, {
        props: { maxlength: 10, minlength: 2 },
        attachTo: document.body
      });
      const textarea = wrapper.find('textarea');

      expect(textarea.attributes('maxlength')).toBe('10');
      expect(textarea.attributes('minlength')).toBe('2');

      wrapper.unmount();
    });

    it('applies the size variant class to the root and control elements', () => {
      const wrapper = mount(STextarea, {
        props: { size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-textarea-root]').classes()).toContain('text-base');
      expect(wrapper.find('[data-vean-textarea-control]').classes()).toContain('min-h-9');

      wrapper.unmount();
    });

    it('forwards counter and footer slots through compact', () => {
      const wrapper = mount(
        {
          components: {
            STextarea
          },
          template: `
            <STextarea model-value="hello" show-counter :maxlength="10">
              <template #counter="{ count, maxlength }">{{ count }} / {{ maxlength }}</template>
              <template #footer="{ modelValue }">Footer: {{ modelValue }}</template>
            </STextarea>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.text()).toContain('5 / 10');
      expect(wrapper.text()).toContain('Footer: hello');

      wrapper.unmount();
    });

    it('renders a visually hidden input for form submission when a name is set', () => {
      const wrapper = mount(STextarea, {
        props: { name: 'message' },
        attachTo: document.body
      });
      const hiddenInputs = wrapper.findAll('[data-vean-visually-hidden-input]');

      expect(hiddenInputs).toHaveLength(1);
      expect(hiddenInputs[0].attributes('name')).toBe('message');

      wrapper.unmount();
    });

    it('does not render a visually hidden input without a name', () => {
      const wrapper = mount(STextarea, { attachTo: document.body });

      expect(wrapper.find('[data-vean-visually-hidden-input]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('renders the default counter text as count / maxlength', () => {
      const wrapper = mount(STextarea, {
        props: { modelValue: 'hello', showCounter: true, maxlength: 10 },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-textarea-counter]').text()).toBe('5 / 10');

      wrapper.unmount();
    });

    it('renders the counter with only the count when no maxlength is set', () => {
      const wrapper = mount(STextarea, {
        props: { modelValue: 'abc', showCounter: true },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-textarea-counter]').text()).toBe('3');

      wrapper.unmount();
    });

    it('renders the clear trigger only when clearable', () => {
      const wrapper = mount(STextarea, { attachTo: document.body });

      expect(wrapper.find('[data-vean-textarea-clearable]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('autosize', () => {
    it('applies inline resize and overflow styles when autosize is enabled', async () => {
      const wrapper = mount(STextarea, {
        props: { autosize: true },
        attachTo: document.body
      });

      await flushPromises();

      const style = wrapper.find('[data-vean-textarea-control]').attributes('style');
      expect(style).toContain('resize: none');
      expect(style).toContain('overflow-y: hidden');

      wrapper.unmount();
    });

    it('does not apply inline resize styles when autosize is disabled', () => {
      const wrapper = mount(STextarea, { attachTo: document.body });

      expect(wrapper.find('[data-vean-textarea-control]').attributes('style')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('reflects modelValue in textarea', () => {
      const wrapper = mount(STextarea, {
        props: { modelValue: 'hello' },
        attachTo: document.body
      });

      expect(wrapper.find('textarea').element.value).toBe('hello');

      wrapper.unmount();
    });

    it('emits update:modelValue on input', async () => {
      const wrapper = mount(STextarea, { attachTo: document.body });

      await wrapper.find('textarea').setValue('typed text');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['typed text']);

      wrapper.unmount();
    });

    it('uses defaultValue as the uncontrolled initial value', () => {
      const wrapper = mount(STextarea, {
        props: { defaultValue: 'initial' },
        attachTo: document.body
      });

      expect(wrapper.find('textarea').element.value).toBe('initial');

      wrapper.unmount();
    });

    it('calls textareaRef with the textarea element', () => {
      const textareaRef = vi.fn();
      mount(STextarea, {
        props: { textareaRef },
        attachTo: document.body
      });

      expect(textareaRef).toHaveBeenCalledOnce();
      expect(textareaRef.mock.calls[0]?.[0]).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('renders clear trigger and emits empty value when clearing', async () => {
      const wrapper = mount(STextarea, {
        props: {
          modelValue: 'hello',
          clearable: true
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-textarea-clearable]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);

      wrapper.unmount();
    });

    it('clears through STextareaClear in the clear slot', async () => {
      const wrapper = mount(
        {
          components: {
            STextarea,
            STextareaClear
          },
          template: `
            <STextarea model-value="hello" clearable @update:model-value="$emit('update:modelValue', $event)">
              <template #clear>
                <STextareaClear aria-label="Custom clear">Clear</STextareaClear>
              </template>
            </STextarea>
          `
        },
        { attachTo: document.body }
      );

      await wrapper.findComponent(STextareaClear).trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('disables the textarea and clear trigger', () => {
      const wrapper = mount(STextarea, {
        props: {
          disabled: true,
          clearable: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('textarea').element.disabled).toBe(true);
      expect((wrapper.find('[data-vean-textarea-clearable]').element as HTMLButtonElement).disabled).toBe(true);

      wrapper.unmount();
    });

    it('does not clear when disabled', async () => {
      const wrapper = mount(STextarea, {
        props: {
          modelValue: 'hello',
          clearable: true,
          disabled: true
        },
        attachTo: document.body
      });

      const clearButton = wrapper.find('[data-vean-textarea-clearable]');
      expect((clearButton.element as HTMLButtonElement).disabled).toBe(true);

      await clearButton.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();

      wrapper.unmount();
    });

    it('disables the clear trigger when readonly', () => {
      const wrapper = mount(STextarea, {
        props: {
          modelValue: 'hello',
          clearable: true,
          readonly: true
        },
        attachTo: document.body
      });

      expect((wrapper.find('[data-vean-textarea-clearable]').element as HTMLButtonElement).disabled).toBe(true);

      wrapper.unmount();
    });
  });

  describe('clear trigger accessibility', () => {
    it('renders a default i18n aria-label on the clear trigger', () => {
      const wrapper = mount(STextarea, {
        props: { clearable: true },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-textarea-clearable]').attributes('aria-label')).toBe('Clear textarea');

      wrapper.unmount();
    });

    it('lets the consumer override the clear trigger aria-label', () => {
      const wrapper = mount(STextarea, {
        props: {
          clearable: true,
          clearProps: { 'aria-label': 'Empty the field' }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-textarea-clearable]').attributes('aria-label')).toBe('Empty the field');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      const wrapper = mount(
        {
          template: `
            <div>
              <label for="test-textarea">Description</label>
              <STextarea id="test-textarea" />
            </div>
          `,
          components: { STextarea }
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with a labelled clearable textarea with a counter', async () => {
      const wrapper = mount(
        {
          template: `
            <div>
              <label for="test-full-textarea">Description</label>
              <STextarea id="test-full-textarea" clearable show-counter :maxlength="20" model-value="hello" />
            </div>
          `,
          components: { STextarea }
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
