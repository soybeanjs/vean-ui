import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SRating from '@/components/rating/rating.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SRating', () => {
  describe('rendering', () => {
    it('renders a slider with aria-valuenow 0 by default', () => {
      const wrapper = mount(SRating, { attachTo: document.body });

      const slider = wrapper.find('[role="slider"]');

      expect(slider.attributes('aria-valuenow')).toBe('0');
      expect(slider.attributes('aria-valuemin')).toBe('0');
      expect(slider.attributes('aria-valuemax')).toBe('5');
      wrapper.unmount();
    });

    it('renders max items by default', () => {
      const wrapper = mount(SRating, { attachTo: document.body });

      expect(wrapper.findAll('[data-vean-rating-item]')).toHaveLength(5);
      wrapper.unmount();
    });

    it('applies custom class to the root element', () => {
      const wrapper = mount(SRating, {
        props: { class: 'my-rating' },
        attachTo: document.body
      });

      expect(wrapper.html()).toContain('my-rating');
      wrapper.unmount();
    });

    it('reflects modelValue on aria-valuenow', () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('3');
      wrapper.unmount();
    });

    it('reflects item state via data-state', () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      const items = wrapper.findAll('[data-vean-rating-item]');

      expect(items[0]?.attributes('data-state')).toBe('full');
      expect(items[2]?.attributes('data-state')).toBe('full');
      expect(items[3]?.attributes('data-state')).toBe('empty');
      wrapper.unmount();
    });

    it('renders custom max count of items', () => {
      const wrapper = mount(SRating, {
        props: { max: 10 },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-rating-item]')).toHaveLength(10);
      wrapper.unmount();
    });

    it('applies data-orientation horizontal by default', () => {
      const wrapper = mount(SRating, { attachTo: document.body });

      expect(wrapper.find('[role="slider"]').attributes('data-orientation')).toBe('horizontal');
      wrapper.unmount();
    });

    it('applies data-orientation vertical when set', () => {
      const wrapper = mount(SRating, {
        props: { orientation: 'vertical' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('data-orientation')).toBe('vertical');
      wrapper.unmount();
    });
  });

  describe('hover preview', () => {
    it('previews the hovered item via data-state on hover', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 1 },
        attachTo: document.body
      });

      const items = wrapper.findAll('[data-vean-rating-item]');

      await items[2]?.trigger('pointerenter');

      expect(items[0]?.attributes('data-state')).toBe('full');
      expect(items[1]?.attributes('data-state')).toBe('full');
      expect(items[2]?.attributes('data-state')).toBe('full');
      expect(items[3]?.attributes('data-state')).toBe('empty');
      wrapper.unmount();
    });

    it('resets the preview to the model value on pointer leave of the root', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 1 },
        attachTo: document.body
      });

      const items = wrapper.findAll('[data-vean-rating-item]');

      await items[2]?.trigger('pointerenter');
      await wrapper.find('[role="slider"]').trigger('pointerleave');

      expect(items[0]?.attributes('data-state')).toBe('full');
      expect(items[1]?.attributes('data-state')).toBe('empty');
      expect(items[2]?.attributes('data-state')).toBe('empty');
      expect(items[3]?.attributes('data-state')).toBe('empty');
      wrapper.unmount();
    });
  });

  describe('value state', () => {
    it('emits update:modelValue and valueCommit on ArrowRight', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 0 },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(1);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toBe(1);
      wrapper.unmount();
    });

    it('sets value to 0 on Home', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'Home' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(0);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toBe(0);
      wrapper.unmount();
    });

    it('sets value to max on End', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 0 },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'End' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(5);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toBe(5);
      wrapper.unmount();
    });

    it('increments by 0.5 when allowHalf on ArrowRight', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 0, allowHalf: true },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(0.5);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toBe(0.5);
      wrapper.unmount();
    });

    it('clears to 0 when clicking the current value with allowClear', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3, allowClear: true },
        attachTo: document.body
      });

      const items = wrapper.findAll('[data-vean-rating-item]');

      await items[2]?.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(0);
      expect(wrapper.emitted('valueCommit')?.[0]?.[0]).toBe(0);
      wrapper.unmount();
    });

    it('decrements by 1 on ArrowLeft', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(2);
      wrapper.unmount();
    });

    it('decrements by 0.5 when allowHalf on ArrowLeft', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3, allowHalf: true },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(2.5);
      wrapper.unmount();
    });

    it('does not exceed max on End', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 5 },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'End' });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('supports uncontrolled defaultValue', () => {
      const wrapper = mount(SRating, {
        props: { defaultValue: 3 },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('3');
      wrapper.unmount();
    });
  });

  describe('hover preview', () => {
    it('emits hoverChange on pointermove', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 0 },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-rating-item]').trigger('pointermove', { clientX: 5 });

      expect(wrapper.emitted('hoverChange')).toBeTruthy();
      wrapper.unmount();
    });

    it('does not emit hoverChange when disabled', async () => {
      const wrapper = mount(SRating, {
        props: { disabled: true },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-rating-item]').trigger('pointermove', { clientX: 5 });

      expect(wrapper.emitted('hoverChange')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents keyboard interaction when disabled', async () => {
      const wrapper = mount(SRating, {
        props: { disabled: true, modelValue: 2 },
        attachTo: document.body
      });

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'End' });

      expect(wrapper.find('[role="slider"]').attributes('aria-disabled')).toBe('true');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('renders data-disabled attribute', () => {
      const wrapper = mount(SRating, {
        props: { disabled: true },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('data-disabled')).toBe('');
      wrapper.unmount();
    });
  });

  describe('readonly state', () => {
    it('exposes aria-readonly and skips hover preview', async () => {
      const wrapper = mount(SRating, {
        props: { readonly: true, modelValue: 3 },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('aria-readonly')).toBe('true');

      await wrapper.find('[data-vean-rating-item]').trigger('pointermove', { clientX: 10 });

      expect(wrapper.emitted('hoverChange')).toBeFalsy();
      wrapper.unmount();
    });

    it('renders data-readonly attribute', () => {
      const wrapper = mount(SRating, {
        props: { readonly: true },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').attributes('data-readonly')).toBe('');
      wrapper.unmount();
    });
  });

  describe('variants', () => {
    it('applies size class to root', () => {
      const wrapper = mount(SRating, {
        props: { size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="slider"]').classes()).toContain('gap-2');
      wrapper.unmount();
    });

    it('applies color class to items', () => {
      const wrapper = mount(SRating, {
        props: { color: 'primary' },
        attachTo: document.body
      });

      const item = wrapper.find('[data-vean-rating-item]');

      expect(item.classes()).toContain('data-[state=full]:text-primary');
      wrapper.unmount();
    });

    it('applies variant class to items', () => {
      const wrapper = mount(SRating, {
        props: { variant: 'outline' },
        attachTo: document.body
      });

      const item = wrapper.find('[data-vean-rating-item]');

      expect(item.classes()).toContain('text-muted-foreground/40');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('provides default aria-label from locale', () => {
      const wrapper = mount(SRating, { attachTo: document.body });

      expect(wrapper.find('[role="slider"]').attributes('aria-label')).toBe('Rating');
      wrapper.unmount();
    });

    it('reflects aria-valuetext with count and max', () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      const valuetext = wrapper.find('[role="slider"]').attributes('aria-valuetext');

      expect(valuetext).toContain('3');
      expect(valuetext).toContain('5');
      wrapper.unmount();
    });

    it('reflects aria-valuetext empty when value is 0', () => {
      const wrapper = mount(SRating, { attachTo: document.body });

      expect(wrapper.find('[role="slider"]').attributes('aria-valuetext')).toBe('No rating');
      wrapper.unmount();
    });
  });

  describe('form integration', () => {
    it('renders hidden input when name is provided', () => {
      const wrapper = mount(SRating, {
        props: { name: 'rating', modelValue: 3, class: 'form' },
        attachTo: document.body
      });

      const input = wrapper.find('input[type="number"]');

      expect(input.exists()).toBe(true);
      expect(input.attributes('name')).toBe('rating');
      expect((input.element as HTMLInputElement).value).toBe('3');
      wrapper.unmount();
    });

    it('does not render hidden input without name', () => {
      const wrapper = mount(SRating, {
        props: { modelValue: 3 },
        attachTo: document.body
      });

      expect(wrapper.find('input[type="number"]').exists()).toBe(false);
      wrapper.unmount();
    });
  });

  describe('slot', () => {
    it('renders custom icon slot', () => {
      const wrapper = mount(SRating, {
        slots: {
          icon: '<span class="slot-state">{{ state }}</span>'
        },
        attachTo: document.body
      });

      const states = wrapper.findAll('.slot-state');

      expect(states[0]?.text()).toBe('empty');
      wrapper.unmount();
    });
  });
});
