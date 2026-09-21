import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SSlider from '@/components/slider/slider.vue';
import { getA11yViolations } from '../../shared/a11y';

function mockRect(element: Element, rect: { x?: number; y?: number; width?: number; height?: number }) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: rect.x ?? 0,
      y: rect.y ?? 0,
      top: rect.y ?? 0,
      left: rect.x ?? 0,
      right: (rect.x ?? 0) + (rect.width ?? 0),
      bottom: (rect.y ?? 0) + (rect.height ?? 0),
      width: rect.width ?? 0,
      height: rect.height ?? 0,
      toJSON: () => ({})
    })
  });
}

function dispatchPointerEvent(target: EventTarget, type: string, init: PointerEventInit) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe('SSlider', () => {
  describe('rendering', () => {
    it('renders a single thumb by default', () => {
      const wrapper = mount(SSlider, {
        props: { thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="slider"]')).toHaveLength(1);
      wrapper.unmount();
    });

    it('applies custom class to the root element', () => {
      const wrapper = mount(SSlider, {
        props: { class: 'my-slider', thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      expect(wrapper.html()).toContain('my-slider');
      wrapper.unmount();
    });

    it('renders multiple thumbs for range values', () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20, 80] },
        attachTo: document.body
      });

      const thumbs = wrapper.findAll('[role="slider"]');

      expect(thumbs).toHaveLength(2);
      expect(thumbs[0]?.attributes('aria-label')).toBe('Minimum');
      expect(thumbs[1]?.attributes('aria-label')).toBe('Maximum');
      wrapper.unmount();
    });

    it('renders hidden inputs when used as a form field', () => {
      const wrapper = mount(
        {
          components: { SSlider },
          template: '<form class="form"><SSlider :default-value="[20, 80]" name="volume" /></form>'
        },
        { attachTo: document.body }
      );

      const inputs = wrapper.findAll('input[name^="volume"]');

      expect(inputs).toHaveLength(2);
      expect(inputs.map(input => input.element.getAttribute('name'))).toEqual(['volume[0]', 'volume[1]']);
      expect(inputs.map(input => (input.element as HTMLInputElement).value)).toEqual(['20', '80']);
      wrapper.unmount();
    });

    it('renders custom thumb content from slot props', () => {
      const wrapper = mount({
        components: { SSlider },
        template: `
          <SSlider :model-value="[20, 80]">
            <template #default="{ index, value, modelValue }">
              <span class="thumb-label">{{ index }}-{{ value }}-{{ modelValue.join(',') }}</span>
            </template>
          </SSlider>
        `,
        attachTo: document.body
      });

      const labels = wrapper.findAll('.thumb-label');

      expect(labels).toHaveLength(2);
      expect(labels[0]?.text()).toBe('0-20-20,80');
      expect(labels[1]?.text()).toBe('1-80-20,80');
      wrapper.unmount();
    });

    it('allows custom thumb aria-labels in range mode', () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20, 80], thumbProps: { 'aria-label': 'Price range' } },
        attachTo: document.body
      });

      const thumbs = wrapper.findAll('[role="slider"]');

      expect(thumbs[0]?.attributes('aria-label')).toBe('Price range');
      expect(thumbs[1]?.attributes('aria-label')).toBe('Price range');
      wrapper.unmount();
    });

    it('applies per-slot ui overrides to thumb and range', () => {
      const wrapper = mount(SSlider, {
        props: {
          ui: { thumb: 'custom-thumb-class', range: 'custom-range-class' },
          thumbProps: { 'aria-label': 'Volume' }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').classes()).toContain('custom-thumb-class');
      expect(wrapper.find('[data-vean-slider-range]').classes()).toContain('custom-range-class');
      wrapper.unmount();
    });

    it('reflects orientation via data-orientation on root and thumb', () => {
      const wrapper = mount(SSlider, {
        props: { orientation: 'vertical', thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-slider-root]').attributes('data-orientation')).toBe('vertical');
      expect(wrapper.find('[role="slider"]').attributes('aria-orientation')).toBe('vertical');
      wrapper.unmount();
    });
  });

  describe('value state', () => {
    it('reflects modelValue on aria-valuenow', () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [35], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('35');
      expect(wrapper.find('[role="slider"]').attributes('style')).toContain('calc(');
      wrapper.unmount();
    });

    it('emits update:modelValue and valueCommit on keyboard interaction', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'End' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([100]);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toEqual([100]);
      wrapper.unmount();
    });

    it('emits update:modelValue while dragging from the track', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [0], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      const track = wrapper.findComponent({ name: 'SliderTrack' });

      mockRect(track.element, { x: 0, y: 0, width: 100, height: 10 });
      dispatchPointerEvent(track.element, 'pointerdown', { clientX: 25, clientY: 5, pointerId: 1 });
      dispatchPointerEvent(document, 'pointermove', { clientX: 150, clientY: 5, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 150, clientY: 5, pointerId: 1 });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([25]);
      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([100]);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toEqual([100]);
      wrapper.unmount();
    });

    it('emits update:modelValue while dragging a thumb', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      const track = wrapper.findComponent({ name: 'SliderTrack' });
      const thumb = wrapper.find('[role="slider"]');

      mockRect(track.element, { x: 0, y: 0, width: 100, height: 10 });
      dispatchPointerEvent(thumb.element, 'pointerdown', { clientX: 20, clientY: 5, pointerId: 1 });
      dispatchPointerEvent(document, 'pointermove', { clientX: 70, clientY: 5, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 70, clientY: 5, pointerId: 1 });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([70]);
      expect(wrapper.emitted('valueCommit')).toHaveLength(1);
      expect(wrapper.emitted('valueCommit')?.at(-1)?.[0]).toEqual([70]);
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', async () => {
      const wrapper = mount(SSlider, {
        props: { defaultValue: [10], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      const track = wrapper.findComponent({ name: 'SliderTrack' });

      mockRect(track.element, { x: 0, y: 0, width: 100, height: 10 });
      dispatchPointerEvent(track.element, 'pointerdown', { clientX: 50, clientY: 5, pointerId: 1 });

      await wrapper.vm.$nextTick();

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('50');
      wrapper.unmount();
    });

    it('updates the thumb when a controlled modelValue changes', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.setProps({ modelValue: [50] });

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('50');
      wrapper.unmount();
    });

    it('enforces minStepsBetweenThumbs when stepping', async () => {
      const wrapper = mount(SSlider, {
        props: {
          modelValue: [50, 52],
          minStepsBetweenThumbs: 3,
          thumbProps: { 'aria-label': 'Volume' }
        },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.findAll('[role="slider"]')[0]?.attributes('aria-valuenow')).toBe('50');
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('increases the value with ArrowRight', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([21]);
      wrapper.unmount();
    });

    it('decreases the value with ArrowLeft', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([19]);
      wrapper.unmount();
    });

    it('jumps 10 steps with PageUp', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'PageUp' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([30]);
      wrapper.unmount();
    });

    it('jumps 10 steps with Shift+Arrow', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight', shiftKey: true });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([30]);
      wrapper.unmount();
    });

    it('sets the value to min with Home', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [80], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'Home' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([0]);
      wrapper.unmount();
    });

    it('steps the focused thumb in a range', async () => {
      const wrapper = mount(SSlider, {
        props: { modelValue: [20, 80], thumbProps: { 'aria-label': 'Price' } },
        attachTo: document.body
      });

      const thumbs = wrapper.findAll('[role="slider"]');

      await thumbs[1]?.trigger('focus');
      await thumbs[1]?.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([20, 81]);
      wrapper.unmount();
    });
  });

  describe('orientation and direction', () => {
    it('increases the value with ArrowUp in vertical orientation', async () => {
      const wrapper = mount(SSlider, {
        props: {
          orientation: 'vertical',
          modelValue: [20],
          thumbProps: { 'aria-label': 'Volume' }
        },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowUp' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([21]);
      wrapper.unmount();
    });

    it('increases the value with ArrowLeft in RTL mode', async () => {
      const wrapper = mount(SSlider, {
        props: { dir: 'rtl', modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([21]);
      wrapper.unmount();
    });

    it('increases the value with ArrowLeft when inverted', async () => {
      const wrapper = mount(SSlider, {
        props: { inverted: true, modelValue: [20], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([21]);
      wrapper.unmount();
    });

    it('decreases the value with ArrowUp when inverted and vertical', async () => {
      const wrapper = mount(SSlider, {
        props: {
          orientation: 'vertical',
          inverted: true,
          modelValue: [20],
          thumbProps: { 'aria-label': 'Volume' }
        },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowUp' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([19]);
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents keyboard interaction when disabled', async () => {
      const wrapper = mount(SSlider, {
        props: { disabled: true, modelValue: [10], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'End' });

      expect(wrapper.find('[role="slider"]').attributes('aria-disabled')).toBe('true');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('prevents track dragging when disabled', () => {
      const wrapper = mount(SSlider, {
        props: { disabled: true, modelValue: [0], thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      const track = wrapper.findComponent({ name: 'SliderTrack' });

      mockRect(track.element, { x: 0, y: 0, width: 100, height: 10 });
      dispatchPointerEvent(track.element, 'pointerdown', { clientX: 50, clientY: 5, pointerId: 1 });
      dispatchPointerEvent(document, 'pointerup', { clientX: 50, clientY: 5, pointerId: 1 });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SSlider, {
        props: { thumbProps: { 'aria-label': 'Volume' } },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
