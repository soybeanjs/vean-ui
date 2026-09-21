import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SColorField from '@/components/color-field/color-field.vue';

describe('SColorField', () => {
  describe('rendering', () => {
    it('renders an input element', () => {
      const wrapper = mount(SColorField, { attachTo: document.body });

      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('forwards non-prop attrs to the input element', () => {
      const wrapper = mount(SColorField, {
        props: {
          inputProps: {
            'aria-label': 'Accent color'
          }
        },
        attachTo: document.body
      });

      expect(wrapper.find('input[type="text"]').attributes('aria-label')).toBe('Accent color');
      wrapper.unmount();
    });

    it('renders a hidden form input when used inside a form', () => {
      const wrapper = mount(
        {
          components: { SColorField },
          template: '<form><SColorField model-value="#112233" name="accent" /></form>'
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('input[name="accent"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('applies the size variant class to the root', () => {
      const wrapper = mount(SColorField, {
        props: { size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-color-field-root]').classes()).toContain('h-9');
      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('emits update:modelValue after committing a valid color string', async () => {
      const wrapper = mount(SColorField, {
        props: { modelValue: '#112233' },
        attachTo: document.body
      });

      const input = wrapper.find('input[type="text"]');

      await input.setValue('#445566');
      await input.trigger('blur');

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#445566']);
      wrapper.unmount();
    });

    it('updates a single channel with keyboard controls', async () => {
      const wrapper = mount(SColorField, {
        props: {
          modelValue: 'hsl(0 50% 50%)',
          channel: 'lightness',
          colorSpace: 'hsl',
          format: 'hsl'
        },
        attachTo: document.body
      });

      const input = wrapper.find('input[type="text"]');

      await input.trigger('focus');
      await input.trigger('keydown', { key: 'End' });

      expect(wrapper.emitted('update:color')).toBeTruthy();
      expect((input.element as HTMLInputElement).value).toContain('100');
      wrapper.unmount();
    });
  });
});
