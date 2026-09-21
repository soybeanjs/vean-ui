import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SInputNumber from '@/components/input-number/input-number.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SInputNumber', () => {
  describe('rendering', () => {
    it('renders a spinbutton input', () => {
      const wrapper = mount(SInputNumber, { attachTo: document.body });

      expect(wrapper.find('input[role="spinbutton"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('passes placeholder attribute', () => {
      const wrapper = mount(SInputNumber, {
        props: { placeholder: 'Enter a number' },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter a number');

      wrapper.unmount();
    });

    it('exposes min, max and current value through ARIA', () => {
      const wrapper = mount(SInputNumber, {
        props: { min: 0, max: 100, modelValue: 42 },
        attachTo: document.body
      });
      const input = wrapper.find('input');

      expect(input.attributes('aria-valuemin')).toBe('0');
      expect(input.attributes('aria-valuemax')).toBe('100');
      expect(input.attributes('aria-valuenow')).toBe('42');

      wrapper.unmount();
    });

    it('applies the size variant class to the root element', () => {
      const wrapper = mount(SInputNumber, {
        props: { size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-number-root]').classes()).toContain('h-9');

      wrapper.unmount();
    });

    it('renders a visually hidden input for form submission when a name is set', () => {
      const wrapper = mount(SInputNumber, {
        props: { name: 'amount', modelValue: 5 },
        attachTo: document.body
      });
      const hiddenInputs = wrapper.findAll('[data-vean-visually-hidden-input]');

      expect(hiddenInputs).toHaveLength(1);
      expect(hiddenInputs[0].attributes('name')).toBe('amount');

      wrapper.unmount();
    });

    it('does not render a visually hidden input without a name', () => {
      const wrapper = mount(SInputNumber, { attachTo: document.body });

      expect(wrapper.find('[data-vean-visually-hidden-input]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('renders increment and decrement triggers with i18n aria-labels', () => {
      const wrapper = mount(SInputNumber, { attachTo: document.body });

      expect(wrapper.find('[data-vean-input-number-increment]').attributes('aria-label')).toBe('Increase');
      expect(wrapper.find('[data-vean-input-number-decrement]').attributes('aria-label')).toBe('Decrease');

      wrapper.unmount();
    });

    it('forwards the increment slot', () => {
      const wrapper = mount(SInputNumber, {
        slots: {
          increment: '<button type="button" data-test="custom-increment">Add</button>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-test="custom-increment"]').text()).toContain('Add');

      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('reflects the formatted modelValue in the input', () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 42 },
        attachTo: document.body
      });

      expect(wrapper.find('input').element.value).toBe('42');

      wrapper.unmount();
    });

    it('increments by step when the increment trigger is clicked', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 1, step: 2 },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-number-increment]').trigger('pointerdown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3]);

      wrapper.unmount();
    });

    it('decrements by step when the decrement trigger is clicked', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 1, step: 2 },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-number-decrement]').trigger('pointerdown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([-1]);

      wrapper.unmount();
    });

    it('increments and decrements with the arrow keys', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 5, step: 1 },
        attachTo: document.body
      });
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowUp' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([6]);

      // Controlled mode: modelValue prop is unchanged, so the next tick still
      // reads 5 from the input and decrements to 4.
      await input.trigger('keydown', { key: 'ArrowDown' });
      expect(wrapper.emitted('update:modelValue')![1]).toEqual([4]);

      wrapper.unmount();
    });

    it('moves by 10 with PageUp and PageDown', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 50 },
        attachTo: document.body
      });
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'PageUp' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([60]);

      // Controlled mode: modelValue prop is unchanged, so the next tick still
      // reads 50 from the input and moves down to 40.
      await input.trigger('keydown', { key: 'PageDown' });
      expect(wrapper.emitted('update:modelValue')![1]).toEqual([40]);

      wrapper.unmount();
    });

    it('jumps to min and max with Home and End', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 50, min: 0, max: 100 },
        attachTo: document.body
      });
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'Home' });
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([0]);

      await input.trigger('keydown', { key: 'End' });
      expect(wrapper.emitted('update:modelValue')![1]).toEqual([100]);

      wrapper.unmount();
    });

    it('applies typed input on Enter, clamped to min and max', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 50, min: 0, max: 100 },
        attachTo: document.body
      });
      const input = wrapper.find('input');

      await input.setValue('999');
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([100]);

      wrapper.unmount();
    });

    it('clears the value through the clear trigger', async () => {
      const wrapper = mount(SInputNumber, {
        props: {
          modelValue: 12,
          clearable: true
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-number-clear]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([null]);

      wrapper.unmount();
    });

    it('disables decrement at min and increment at max', async () => {
      const wrapper = mount(SInputNumber, {
        props: { modelValue: 10, min: 0, max: 10 },
        attachTo: document.body
      });

      expect((wrapper.find('[data-vean-input-number-decrement]').element as HTMLButtonElement).disabled).toBe(false);
      expect((wrapper.find('[data-vean-input-number-increment]').element as HTMLButtonElement).disabled).toBe(true);

      await wrapper.setProps({ modelValue: 0 });

      expect((wrapper.find('[data-vean-input-number-decrement]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[data-vean-input-number-increment]').element as HTMLButtonElement).disabled).toBe(false);

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('disables the input and control triggers', () => {
      const wrapper = mount(SInputNumber, {
        props: {
          disabled: true,
          clearable: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').element.disabled).toBe(true);
      expect((wrapper.find('[aria-label="Increase"]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[aria-label="Decrease"]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[data-vean-input-number-clear]').element as HTMLButtonElement).disabled).toBe(true);

      wrapper.unmount();
    });

    it('disables the input and triggers when readonly', () => {
      const wrapper = mount(SInputNumber, {
        props: {
          modelValue: 5,
          readonly: true,
          clearable: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('readonly')).toBeDefined();
      expect((wrapper.find('[aria-label="Increase"]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[aria-label="Decrease"]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[data-vean-input-number-clear]').element as HTMLButtonElement).disabled).toBe(true);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SInputNumber },
          template: `
            <div>
              <label for="test-input-number">Amount</label>
              <SInputNumber id="test-input-number" clearable />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with a labelled input number at a min bound', async () => {
      const wrapper = mount(
        {
          components: { SInputNumber },
          template: `
            <div>
              <label for="test-bounded">Amount</label>
              <SInputNumber id="test-bounded" :min="0" :max="10" :model-value="0" clearable />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
