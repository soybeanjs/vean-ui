import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { TimeRange } from '@vean/aria/date';
import STimeRangeField from '@/components/time-range-field/time-range-field.vue';
import { getA11yViolations } from '../../shared/a11y';

function timeString(value?: Date | null) {
  return value ? value.toTimeString().slice(0, 8) : '';
}

const start = new Date(2000, 0, 1, 9, 0, 0);
const end = new Date(2000, 0, 1, 17, 30, 0);
const timeRange = { start, end };

function mountRangeField(props?: Record<string, unknown>, slots?: Record<string, string>) {
  return mount(STimeRangeField, {
    props: { modelValue: timeRange, 'aria-label': 'Working hours range', ...props },
    attachTo: document.body,
    slots
  });
}

function partOf(wrapper: ReturnType<typeof mount>, part: 'start' | 'end') {
  return wrapper.find(`[data-time-range-field-part="${part}"]`);
}

function firstSegmentOf(wrapper: ReturnType<typeof mount>, part: 'start' | 'end') {
  return partOf(wrapper, part).find('[data-segment]:not([data-segment="literal"])');
}

function lastSegmentOf(wrapper: ReturnType<typeof mount>, part: 'start' | 'end') {
  const segments = partOf(wrapper, part).findAll('[data-segment]:not([data-segment="literal"])');
  return segments.at(-1)!;
}

describe('STimeRangeField', () => {
  describe('rendering', () => {
    it('renders start and end time segments with custom class', () => {
      const wrapper = mountRangeField({ class: 'test-time-range-field' });

      expect(wrapper.classes()).toContain('test-time-range-field');
      expect(wrapper.findAll('[data-vean-date-field-segment]').length).toBeGreaterThanOrEqual(6);
      expect(partOf(wrapper, 'start').exists()).toBe(true);
      expect(partOf(wrapper, 'end').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders second segments when using second granularity', () => {
      const wrapper = mountRangeField({
        modelValue: {
          start: new Date(2000, 0, 1, 9, 0, 15),
          end: new Date(2000, 0, 1, 17, 30, 45)
        },
        granularity: 'second'
      });

      const secondSegments = wrapper.findAll('[data-segment="second"]');

      expect(secondSegments.length).toBeGreaterThanOrEqual(2);
      wrapper.unmount();
    });

    it('renders custom separator', () => {
      const wrapper = mountRangeField({ separator: '→' });

      expect(wrapper.text()).toContain('→');
      wrapper.unmount();
    });

    it('renders the separator slot', () => {
      const wrapper = mountRangeField(undefined, {
        separator: '<span data-test="separator">TO</span>'
      });

      expect(wrapper.find('[data-test="separator"]').text()).toBe('TO');
      wrapper.unmount();
    });

    it('renders leading and trailing slots around the segments', () => {
      const wrapper = mountRangeField(undefined, {
        leading: '<span data-test="leading">L</span>',
        trailing: '<span data-test="trailing">T</span>'
      });

      expect(wrapper.find('[data-test="leading"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="trailing"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders hidden native inputs with names for both sides', () => {
      const wrapper = mountRangeField({
        name: 'work',
        startName: 'work_start',
        endName: 'work_end',
        required: true
      });

      const inputs = wrapper.findAll('input[type="time"]');

      expect(inputs.length).toBe(2);
      expect(inputs[0].attributes('name')).toBe('work_start');
      expect(inputs[0].attributes('value')).toBe('09:00');
      expect(inputs[1].attributes('name')).toBe('work_end');
      expect(inputs[1].attributes('value')).toBe('17:30');
      expect(inputs[0].attributes('tabindex')).toBe('-1');
      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('emits update:modelValue when start time changes', async () => {
      const wrapper = mountRangeField();

      const minuteSegment = partOf(wrapper, 'start').find('[data-segment="minute"]');

      await minuteSegment.trigger('focusin');
      await minuteSegment.trigger('keydown', { key: '4', preventDefault() {} });
      await minuteSegment.trigger('keydown', { key: '5', preventDefault() {} });
      await nextTick();

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(timeString((emitted?.at(-1)?.[0] as TimeRange)?.start)).toBe('09:45:00');
      wrapper.unmount();
    });

    it('validates that end time is not before start time', () => {
      const wrapper = mountRangeField({
        modelValue: {
          start: new Date(2000, 0, 1, 17, 30, 0),
          end: new Date(2000, 0, 1, 9, 0, 0)
        }
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();
      expect(partOf(wrapper, 'end').find('[data-segment="hour"]').attributes('aria-invalid')).toBe('true');
      wrapper.unmount();
    });

    it('syncs the controlled modelValue from outside', async () => {
      const wrapper = mountRangeField();

      await wrapper.setProps({
        modelValue: { start: new Date(2000, 0, 1, 8, 15, 0), end: new Date(2000, 0, 1, 18, 45, 0) }
      });

      expect(partOf(wrapper, 'start').find('[data-segment="hour"]').text()).toBe('8');
      expect(partOf(wrapper, 'start').find('[data-segment="minute"]').text()).toBe('15');
      expect(partOf(wrapper, 'end').find('[data-segment="hour"]').text()).toBe('6');
      wrapper.unmount();
    });

    it('uses defaultValue when uncontrolled', () => {
      const wrapper = mount(STimeRangeField, {
        props: {
          defaultValue: {
            start: new Date(2000, 0, 1, 6, 30, 0),
            end: new Date(2000, 0, 1, 22, 0, 0)
          },
          'aria-label': 'Default range'
        },
        attachTo: document.body
      });

      expect(partOf(wrapper, 'start').find('[data-segment="hour"]').text()).toBe('6');
      expect(partOf(wrapper, 'end').find('[data-segment="hour"]').text()).toBe('10');
      wrapper.unmount();
    });

    it('marks invalid when isTimeUnavailable matches a value', () => {
      const wrapper = mountRangeField({
        isTimeUnavailable: (time: Date) => time.getHours() === 9
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();
      wrapper.unmount();
    });

    it('marks invalid when a value is outside minValue/maxValue', () => {
      const wrapper = mountRangeField({
        maxValue: new Date(2000, 0, 1, 12, 0, 0)
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();
      wrapper.unmount();
    });
  });

  describe('keyboard', () => {
    it('increments the hour with ArrowUp', async () => {
      const wrapper = mountRangeField();

      const hour = partOf(wrapper, 'end').find('[data-segment="hour"]');

      await hour.trigger('focusin');
      await hour.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });
      await nextTick();

      expect(timeString((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as TimeRange)?.end)).toBe('18:30:00');
      wrapper.unmount();
    });

    it('moves focus to the next segment with ArrowRight', async () => {
      const wrapper = mountRangeField();

      const hour = partOf(wrapper, 'start').find('[data-segment="hour"]');

      await hour.trigger('focusin');
      await hour.trigger('keydown', { key: 'ArrowRight', preventDefault() {} });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).not.toBe('hour');
      wrapper.unmount();
    });

    it('crosses from the start group into the end group on ArrowRight', async () => {
      const wrapper = mountRangeField();

      const lastStart = lastSegmentOf(wrapper, 'start');

      await lastStart.trigger('focusin');
      await lastStart.trigger('keydown', { key: 'ArrowRight', preventDefault() {} });
      await nextTick();

      expect(document.activeElement?.closest('[data-time-range-field-part="end"]')).not.toBeNull();
      wrapper.unmount();
    });

    it('moves focus from the end group back to the start group on ArrowLeft', async () => {
      const wrapper = mountRangeField();

      const firstEnd = firstSegmentOf(wrapper, 'end');

      await firstEnd.trigger('focusin');
      await firstEnd.trigger('keydown', { key: 'ArrowLeft', preventDefault() {} });
      await nextTick();

      expect(document.activeElement?.closest('[data-time-range-field-part="start"]')).not.toBeNull();
      wrapper.unmount();
    });

    it('reverses arrow direction in RTL', async () => {
      const wrapper = mountRangeField({ dir: 'rtl' });

      // In RTL, ArrowLeft moves forward, so the last start segment crosses into the end group.
      const lastStart = lastSegmentOf(wrapper, 'start');

      await lastStart.trigger('focusin');
      await lastStart.trigger('keydown', { key: 'ArrowLeft', preventDefault() {} });
      await nextTick();

      expect(document.activeElement?.closest('[data-time-range-field-part="end"]')).not.toBeNull();
      wrapper.unmount();
    });

    it('clears the start value with Backspace and emits undefined', async () => {
      const wrapper = mountRangeField();

      const minute = partOf(wrapper, 'start').find('[data-segment="minute"]');

      await minute.trigger('focusin');
      await minute.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await minute.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await nextTick();

      expect((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as TimeRange)?.start).toBeNull();
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('marks all segments as disabled and prevents tab focus', () => {
      const wrapper = mountRangeField({ disabled: true });

      expect(wrapper.attributes('data-disabled')).toBeDefined();

      const segments = wrapper.findAll('[data-segment]:not([data-segment="literal"])');

      segments.forEach(segment => {
        expect(segment.attributes('data-disabled')).toBeDefined();
        expect(segment.attributes('tabindex')).toBeUndefined();
      });

      wrapper.unmount();
    });

    it('prevents editing in readonly mode', async () => {
      const wrapper = mountRangeField({ readonly: true });

      const hour = partOf(wrapper, 'start').find('[data-segment="hour"]');

      await hour.trigger('focusin');
      await hour.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(hour.attributes('aria-readonly')).toBe('true');
      wrapper.unmount();
    });

    it('disables the hidden inputs when disabled', () => {
      const wrapper = mountRangeField({ disabled: true, required: true });

      const inputs = wrapper.findAll('input[type="time"]');

      expect(inputs[0].attributes('disabled')).toBeDefined();
      expect(inputs[0].attributes('required')).toBeDefined();
      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('applies ui.root override', () => {
      const wrapper = mountRangeField({ ui: { root: 'custom-root-class' } });

      expect(wrapper.classes()).toContain('custom-root-class');
      wrapper.unmount();
    });

    it('applies ui.input and ui.separator overrides', () => {
      const wrapper = mountRangeField({
        ui: {
          input: 'custom-input-class',
          separator: 'custom-separator-class'
        }
      });

      expect(wrapper.find('[data-vean-time-range-field-input]').classes()).toContain('custom-input-class');
      expect(wrapper.find('[data-time-range-field-part="start"]').classes()).not.toContain('custom-input-class');
      expect(wrapper.findAll('[data-vean-time-range-field-input]')[1].classes()).toContain('custom-input-class');
      expect(wrapper.text()).toContain('–');
      wrapper.unmount();
    });

    it('applies size variants', () => {
      const wrapper = mountRangeField({ size: 'sm' });
      const defaultWrapper = mountRangeField();

      expect(wrapper.classes()).toContain('h-7');
      expect(defaultWrapper.classes()).toContain('h-8');
      defaultWrapper.unmount();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('passes basic a11y checks', async () => {
      const wrapper = mountRangeField();

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toEqual([]);
      wrapper.unmount();
    });

    it('passes a11y checks in 12-hour mode', async () => {
      const wrapper = mountRangeField({ hourCycle: 'h12' });

      expect(wrapper.findAll('[data-segment="dayPeriod"]').length).toBeGreaterThanOrEqual(2);

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toEqual([]);
      wrapper.unmount();
    });

    it('has proper role for the root container', () => {
      const wrapper = mountRangeField();

      expect(wrapper.attributes('role')).toBe('group');
      wrapper.unmount();
    });
  });
});
