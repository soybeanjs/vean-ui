import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SSegment from '@/components/segment/segment.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { value: 'segment-1', label: 'Daily' },
  { value: 'segment-2', label: 'Weekly' },
  { value: 'segment-3', label: 'Monthly', disabled: true }
];

const plainItems = [
  { value: 'p1', label: 'One' },
  { value: 'p2', label: 'Two' },
  { value: 'p3', label: 'Three' }
];

async function flushIndicator(wrapper: ReturnType<typeof mount>) {
  for (let i = 0; i < 3; i++) {
    await nextTick();
  }
  return wrapper;
}

describe('SSegment', () => {
  describe('rendering', () => {
    it('renders all segment triggers', () => {
      const wrapper = mount(SSegment, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="tab"]')).toHaveLength(items.length);
      wrapper.unmount();
    });

    it('renders custom item slot content', () => {
      const wrapper = mount(
        {
          components: { SSegment },
          data() {
            return { items };
          },
          template: `
            <SSegment :items="items" model-value="segment-1">
              <template #item="{ label, selected }">
                <span :data-test="'segment-item-' + label">{{ selected ? 'selected' : 'idle' }}-{{ label }}</span>
              </template>
            </SSegment>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-test="segment-item-Daily"]').text()).toBe('selected-Daily');
      wrapper.unmount();
    });

    it('merges custom class onto the root container', () => {
      const wrapper = mount(SSegment, {
        props: { items, class: 'segment-root-class' },
        attachTo: document.body
      });

      expect(wrapper.find('.segment-root-class').exists()).toBe(true);
      wrapper.unmount();
    });

    it('reflects vertical orientation on the root and triggers', () => {
      const wrapper = mount(SSegment, {
        props: { items, orientation: 'vertical' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-segment-root]').attributes('data-orientation')).toBe('vertical');
      expect(wrapper.findAll('[role="tab"]')[0].attributes('data-orientation')).toBe('vertical');
      wrapper.unmount();
    });
  });

  describe('active state', () => {
    it('marks the active segment with aria-selected="true"', () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('true');
      wrapper.unmount();
    });

    it('reflects data-selected on active and inactive segments', () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="tab"]')[0].attributes('data-selected')).toBe('true');
      expect(wrapper.findAll('[role="tab"]')[1].attributes('data-selected')).toBe('false');
      wrapper.unmount();
    });

    it('emits update:modelValue when a segment is selected', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[1].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('segment-2');
      wrapper.unmount();
    });

    it('syncs the active segment when the controlled modelValue changes', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      await wrapper.setProps({ modelValue: 'segment-2' });

      expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
      expect(wrapper.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('false');
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', () => {
      const wrapper = mount(SSegment, {
        props: { items, defaultValue: 'segment-2' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('indicator', () => {
    it('renders the indicator by default after layout measurement', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      await flushIndicator(wrapper);

      expect(wrapper.find('[data-vean-segment-indicator]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('hides the indicator when enableIndicator is false', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1', enableIndicator: false },
        attachTo: document.body
      });

      await flushIndicator(wrapper);

      expect(wrapper.find('[data-vean-segment-indicator]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('renders custom indicator slot content', async () => {
      const wrapper = mount(
        {
          components: { SSegment },
          data() {
            return { items };
          },
          template: `
            <SSegment :items="items" model-value="segment-1">
              <template #indicator>
                <span data-test="custom-indicator">custom</span>
              </template>
            </SSegment>
          `
        },
        { attachTo: document.body }
      );

      await flushIndicator(wrapper);

      expect(wrapper.find('[data-test="custom-indicator"]').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('marks disabled segments with data-disabled', () => {
      const wrapper = mount(SSegment, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="tab"]')[2].attributes('data-disabled')).toBe('');
      wrapper.unmount();
    });

    it('does not emit update:modelValue when a disabled segment is selected', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[2].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('skips disabled segments during roving focus navigation', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-2' },
        attachTo: document.body
      });
      const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]');

      tabs[1].element.focus();
      await tabs[1].trigger('keydown', { key: 'ArrowRight' });

      // item 3 is disabled, so focus wraps to the first segment (loop is enabled by default)
      expect(document.activeElement).toBe(tabs[0].element);
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('moves focus with arrow keys via roving focus', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });
      const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]');

      tabs[0].element.focus();
      await tabs[0].trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(tabs[1].element);
      wrapper.unmount();
    });

    it('wraps around to the first segment when loop is enabled', async () => {
      const wrapper = mount(SSegment, {
        props: { items: plainItems, modelValue: 'p3' },
        attachTo: document.body
      });
      const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]');

      tabs[2].element.focus();
      await tabs[2].trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(tabs[0].element);
      wrapper.unmount();
    });

    it('reverses arrow direction in RTL', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1', dir: 'rtl' },
        attachTo: document.body
      });
      const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]');

      tabs[0].element.focus();
      await tabs[0].trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(tabs[1].element);
      wrapper.unmount();
    });
  });

  describe('styling', () => {
    it('applies fill="full" to stretch the root container', () => {
      const wrapper = mount(SSegment, {
        props: { items, fill: 'full' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-segment-root]').classes()).toContain('items-stretch');
      wrapper.unmount();
    });

    it('applies size variant classes to the root', () => {
      const wrapper = mount(SSegment, {
        props: { items, size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-segment-root]').classes()).toContain('text-base');
      wrapper.unmount();
    });

    it('applies ui.trigger class overrides', () => {
      const wrapper = mount(SSegment, {
        props: { items, ui: { trigger: 'custom-trigger-class' } },
        attachTo: document.body
      });

      expect(wrapper.findAll('[role="tab"]')[0].classes()).toContain('custom-trigger-class');
      wrapper.unmount();
    });

    it('exposes value and disabled state to the item slot', () => {
      const wrapper = mount(
        {
          components: { SSegment },
          data() {
            return { items };
          },
          template: `
            <SSegment :items="items" model-value="segment-1">
              <template #item="{ value, disabled }">
                <span :data-test="'slot-' + value" :data-disabled-attr="disabled ? 'yes' : 'no'">{{ value }}</span>
              </template>
            </SSegment>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-test="slot-segment-1"]').attributes('data-disabled-attr')).toBe('no');
      expect(wrapper.find('[data-test="slot-segment-3"]').attributes('data-disabled-attr')).toBe('yes');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in vertical mode', async () => {
      const wrapper = mount(SSegment, {
        props: { items, modelValue: 'segment-1', orientation: 'vertical' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
