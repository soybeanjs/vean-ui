import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { toISODateString } from '@vean/aria/date';
import type { DateRange } from '@vean/aria/date';
import SDateRangeField from '@/components/date-range-field/date-range-field.vue';
import { getA11yViolations } from '../../shared/a11y';

const start = new Date(2026, 4 - 1, 19);
const end = new Date(2026, 4 - 1, 26);
const range = { start, end };

function mountRangeField(props?: Record<string, unknown>, slots?: Record<string, string>) {
  return mount(SDateRangeField, {
    props: { modelValue: range, 'aria-label': 'Event date range', ...props },
    attachTo: document.body,
    slots
  });
}

function partOf(wrapper: ReturnType<typeof mount>, part: 'start' | 'end') {
  return wrapper.find(`[data-date-range-field-part="${part}"]`);
}

describe('SDateRangeField', () => {
  describe('rendering', () => {
    it('renders start and end segments with custom class', () => {
      const wrapper = mountRangeField({ class: 'test-date-range-field' });

      expect(wrapper.classes()).toContain('test-date-range-field');
      expect(wrapper.findAll('[data-vean-date-field-segment]').length).toBeGreaterThanOrEqual(10);
      expect(partOf(wrapper, 'start').exists()).toBe(true);
      expect(partOf(wrapper, 'end').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders time segments when using date-time values', () => {
      const wrapper = mountRangeField({
        modelValue: {
          start: { date: new Date(2026, 4 - 1, 19), time: new Date(2000, 0, 1, 9, 0) },
          end: { date: new Date(2026, 4 - 1, 19), time: new Date(2000, 0, 1, 17, 30) }
        },
        granularity: 'minute'
      });

      expect(wrapper.findAll('[data-segment="hour"]').length).toBeGreaterThanOrEqual(2);
      expect(wrapper.findAll('[data-segment="minute"]').length).toBeGreaterThanOrEqual(2);
      wrapper.unmount();
    });

    it('renders a custom separator prop', () => {
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

    it('marks segments with data-placeholder when there is no value', () => {
      const wrapper = mount(SDateRangeField, {
        props: { 'aria-label': 'Empty range' },
        attachTo: document.body
      });

      const startPart = partOf(wrapper, 'start');

      expect(startPart.find('[data-segment="day"]').attributes('data-placeholder')).toBeDefined();
      expect(startPart.find('[data-segment="year"]').attributes('data-placeholder')).toBeDefined();
      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('emits update:modelValue after editing the start day', async () => {
      const wrapper = mountRangeField();
      const day = partOf(wrapper, 'start').find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: '2', preventDefault() {} });
      await day.trigger('keydown', { key: '0', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      wrapper.unmount();
    });

    it('increments the end day on ArrowUp', async () => {
      const wrapper = mountRangeField();
      const day = partOf(wrapper, 'end').find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });

      const emitted = wrapper.emitted('update:modelValue');
      expect(toISODateString(((emitted?.at(-1)?.[0] as DateRange)?.end as Date | null) ?? new Date(NaN))).toBe(
        '2026-04-27'
      );
      wrapper.unmount();
    });

    it('marks the root invalid when end is before start', () => {
      const wrapper = mountRangeField({
        modelValue: { start: end, end: start }
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();
      wrapper.unmount();
    });

    it('marks the root invalid when a value exceeds maxValue', () => {
      const wrapper = mountRangeField({ maxValue: new Date(2026, 4 - 1, 18) });

      expect(wrapper.attributes('data-invalid')).toBeDefined();
      wrapper.unmount();
    });

    it('marks the root invalid when isDateUnavailable matches', () => {
      const wrapper = mountRangeField({
        isDateUnavailable: (item: Date) => item.getDate() === 19
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();
      wrapper.unmount();
    });

    it('syncs segments when the controlled modelValue changes externally', async () => {
      const wrapper = mountRangeField();

      await wrapper.setProps({
        modelValue: { start: new Date(2026, 12 - 1, 1), end: new Date(2026, 12 - 1, 8) }
      });
      await nextTick();

      expect(partOf(wrapper, 'start').find('[data-segment="day"]').text()).toContain('1');
      expect(partOf(wrapper, 'end').find('[data-segment="month"]').text()).toContain('12');
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', async () => {
      const wrapper = mount(SDateRangeField, {
        props: { defaultValue: range, 'aria-label': 'Uncontrolled range' },
        attachTo: document.body
      });

      expect(partOf(wrapper, 'start').find('[data-segment="day"]').text()).toContain('19');

      const day = partOf(wrapper, 'start').find('[data-segment="day"]');
      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });

      expect(
        toISODateString(
          ((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange)?.start as Date | null) ?? new Date(NaN)
        )
      ).toBe('2026-04-20');
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('moves focus from the start group into the end group on ArrowRight', async () => {
      const wrapper = mountRangeField();
      const year = partOf(wrapper, 'start').find('[data-segment="year"]');

      await year.trigger('focusin');
      await year.trigger('keydown', { key: 'ArrowRight', preventDefault() {} });

      expect(document.activeElement?.closest('[data-date-range-field-part="end"]')).not.toBeNull();
      wrapper.unmount();
    });

    it('moves focus from the end group back to the start group on ArrowLeft', async () => {
      const wrapper = mountRangeField();
      // en-US orders segments as month/day/year, so month is the first segment of the end group.
      const month = partOf(wrapper, 'end').find('[data-segment="month"]');

      await month.trigger('focusin');
      await month.trigger('keydown', { key: 'ArrowLeft', preventDefault() {} });

      const startPart = document.activeElement?.closest('[data-date-range-field-part="start"]');

      expect(startPart).not.toBeNull();
      wrapper.unmount();
    });

    it('reverses arrow direction in RTL', async () => {
      const wrapper = mountRangeField({ dir: 'rtl' });
      // In RTL, ArrowLeft moves forward, so the last segment (year) crosses into the end group.
      const year = partOf(wrapper, 'start').find('[data-segment="year"]');

      await year.trigger('focusin');
      await year.trigger('keydown', { key: 'ArrowLeft', preventDefault() {} });

      expect(document.activeElement?.closest('[data-date-range-field-part="end"]')).not.toBeNull();
      wrapper.unmount();
    });

    it('deletes digits with Backspace and clears the start value', async () => {
      const wrapper = mount(SDateRangeField, {
        props: { defaultValue: range, 'aria-label': 'Clearing range' },
        attachTo: document.body
      });
      const day = partOf(wrapper, 'start').find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });

      expect((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange)?.start).toBeNull();
      await nextTick();
      expect(partOf(wrapper, 'start').find('[data-segment="day"]').attributes('data-placeholder')).toBeDefined();
      wrapper.unmount();
    });

    it('re-commits a new value after a segment was cleared', async () => {
      const wrapper = mountRangeField();
      const day = partOf(wrapper, 'start').find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await day.trigger('keydown', { key: '2', preventDefault() {} });
      await day.trigger('keydown', { key: '0', preventDefault() {} });

      expect(
        toISODateString(
          ((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange)?.start as Date | null) ?? new Date(NaN)
        )
      ).toBe('2026-04-20');
      wrapper.unmount();
    });
  });

  describe('disabled and readonly state', () => {
    it('marks segments as disabled and prevents tab focus', () => {
      const wrapper = mountRangeField({ disabled: true });

      expect(wrapper.attributes('data-disabled')).toBeDefined();

      wrapper.findAll('[data-segment]:not([data-segment="literal"])').forEach(segment => {
        expect(segment.attributes('data-disabled')).toBeDefined();
        expect(segment.attributes('tabindex')).toBeUndefined();
      });
      wrapper.unmount();
    });

    it('marks segments as readonly and blocks keyboard editing', async () => {
      const wrapper = mountRangeField({ readonly: true });
      const day = partOf(wrapper, 'start').find('[data-segment="day"]');

      expect(day.attributes('aria-readonly')).toBe('true');
      expect(day.attributes('contenteditable')).toBe('false');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('renders two hidden native inputs that submit the form values', () => {
      const wrapper = mountRangeField({
        name: 'event',
        startName: 'event-start',
        endName: 'event-end',
        required: true,
        minValue: new Date(2026, 1 - 1, 1),
        maxValue: new Date(2026, 12 - 1, 31)
      });
      const inputs = wrapper.findAll('input[data-vean-visually-hidden]');

      expect(inputs).toHaveLength(2);
      expect(inputs[0].attributes('type')).toBe('date');
      expect(inputs[0].attributes('value')).toBe('2026-04-19');
      expect(inputs[0].attributes('name')).toBe('event-start');
      expect(inputs[1].attributes('value')).toBe('2026-04-26');
      expect(inputs[1].attributes('name')).toBe('event-end');
      expect(inputs[0].attributes('required')).toBeDefined();
      expect(inputs[0].attributes('min')).toBe('2026-01-01');
      expect(inputs[0].attributes('max')).toBe('2026-12-31');
      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('applies ui.root class overrides', () => {
      const wrapper = mountRangeField({ ui: { root: 'my-root-cls' } });

      expect(wrapper.find('[data-vean-date-range-field-root]').classes()).toContain('my-root-cls');
      wrapper.unmount();
    });

    it('applies ui.input class overrides to every segment', () => {
      const wrapper = mountRangeField({ ui: { input: 'my-input-cls' } });

      wrapper.findAll('[data-vean-date-field-segment]').forEach(segment => {
        expect(segment.classes()).toContain('my-input-cls');
      });
      wrapper.unmount();
    });

    it('applies ui.separator class overrides', () => {
      const wrapper = mountRangeField({ ui: { separator: 'my-sep-cls' } });

      const separator = wrapper
        .findAll('[data-vean-date-range-field-root] > div')
        .find(el => el.classes().includes('my-sep-cls'));

      expect(separator).toBeDefined();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mountRangeField({ 'aria-label': 'Accessible date range' });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations with date-time values', async () => {
      const wrapper = mountRangeField({
        modelValue: {
          start: { date: new Date(2026, 4 - 1, 19), time: new Date(2000, 0, 1, 9, 0) },
          end: { date: new Date(2026, 4 - 1, 19), time: new Date(2000, 0, 1, 17, 30) }
        },
        granularity: 'minute',
        'aria-label': 'Accessible time range'
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
