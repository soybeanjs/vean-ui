import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SColorPicker from '@/components/color-picker/color-picker.vue';

async function openPicker(wrapper: ReturnType<typeof mount<typeof SColorPicker>>) {
  await wrapper.find('button').trigger('click');
  await nextTick();
}

async function selectFormat(text: string) {
  const option = Array.from(document.body.querySelectorAll<HTMLElement>('[role="tab"]')).find(
    item => item.textContent?.trim() === text
  );

  option?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
  await nextTick();
}

function findInput(placeholder: string) {
  return document.body.querySelector<HTMLInputElement>(`input[placeholder="${placeholder}"]`);
}

describe('SColorPicker', () => {
  describe('rendering', () => {
    it('renders the current value in the trigger', () => {
      const wrapper = mount(SColorPicker, {
        props: { modelValue: '#7c3aed', swatches: ['#7c3aed', '#06b6d4'] },
        attachTo: document.body
      });

      expect(wrapper.find('button').text()).toContain('#7c3aed');
      wrapper.unmount();
    });

    it('renders color controls after opening in oklch mode', async () => {
      const wrapper = mount(SColorPicker, {
        props: { modelValue: 'oklch(62% 0.22 312)', colorSpace: 'oklch', defaultFormat: 'oklch' },
        attachTo: document.body
      });

      await openPicker(wrapper);

      expect(document.body.querySelector('[role="application"]')).toBeTruthy();
      expect(document.body.querySelectorAll('[role="slider"]').length).toBeGreaterThanOrEqual(3);
      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('switches the formatted field when the format button is clicked', async () => {
      const wrapper = mount(SColorPicker, {
        props: { modelValue: '#7f007f' },
        attachTo: document.body
      });

      await openPicker(wrapper);
      await selectFormat('RGB');

      const input = findInput('RGB');

      expect(wrapper.emitted('update:format')?.[0]).toEqual(['rgb']);
      expect(input?.value).toContain('rgb(');
      wrapper.unmount();
    });

    it('updates the color from the formatted field value', async () => {
      const wrapper = mount(SColorPicker, {
        props: { modelValue: '#7f007f' },
        attachTo: document.body
      });

      await openPicker(wrapper);
      await selectFormat('RGB');

      const input = findInput('RGB');

      input!.value = 'rgb(255 0 0 / 0.5)';
      input!.dispatchEvent(new Event('input', { bubbles: true }));
      input!.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('rgb(255 0 0 / 0.5)');
      expect(wrapper.emitted('update:color')).toBeTruthy();
      wrapper.unmount();
    });

    it('emits update:modelValue when a preset swatch is selected', async () => {
      const wrapper = mount(SColorPicker, {
        props: { swatches: ['#7c3aed', '#06b6d4'] },
        attachTo: document.body
      });

      await openPicker(wrapper);
      const options = Array.from(document.body.querySelectorAll('[role="option"]')).slice(-2);

      (options[1] as HTMLElement).click();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('#06b6d4');
      expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('#06b6d4');
      wrapper.unmount();
    });
  });

  describe('styles', () => {
    it('applies the compact popup padding from colorPickerVariants', async () => {
      const wrapper = mount(SColorPicker, {
        props: { modelValue: '#7c3aed' },
        attachTo: document.body
      });

      await openPicker(wrapper);

      const popup = document.body.querySelector('[data-vean-popper-popup]');

      expect(popup?.className).toContain('p-2');
      wrapper.unmount();
    });

    it('forwards aliased area thumb classes through the unified ui map', async () => {
      const wrapper = mount(SColorPicker, {
        props: { modelValue: '#7c3aed', ui: { areaThumb: 'data-test-area-thumb' } },
        attachTo: document.body
      });

      await openPicker(wrapper);

      const thumb = document.body.querySelector('[data-vean-color-area-thumb]');

      expect(thumb?.className).toContain('data-test-area-thumb');
      wrapper.unmount();
    });

    it('styles the format segment indicator body', async () => {
      const wrapper = mount(SColorPicker, {
        props: {
          modelValue: '#7c3aed',
          ui: { segmentIndicatorContent: 'data-test-segment-indicator-content' }
        },
        attachTo: document.body
      });

      await openPicker(wrapper);
      await nextTick();

      const indicator = document.body.querySelector('[data-vean-segment-indicator]');
      const indicatorContent = indicator?.firstElementChild;

      expect(indicator).toBeTruthy();
      expect(indicatorContent?.className).toContain('bg-card');
      expect(indicatorContent?.className).toContain('data-test-segment-indicator-content');
      wrapper.unmount();
    });
  });
});
