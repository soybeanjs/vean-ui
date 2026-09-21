import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { toISODateString } from '@vean/aria/date';
import { DateFieldRoot } from '@vean/aria/date-field';
import SDateField from '@/components/date-field/date-field.vue';
import { getA11yViolations } from '../../shared/a11y';

const date = new Date(2026, 4 - 1, 19);
const dateTime = { date: new Date(2026, 4 - 1, 19), time: new Date(2000, 0, 1, 14, 30, 0) };

function mountDateField(props?: Record<string, unknown>) {
  return mount(SDateField, {
    props: { modelValue: date, 'aria-label': 'Event date', ...props },
    attachTo: document.body
  });
}

describe('SDateField', () => {
  describe('rendering', () => {
    it('renders the default date segments and custom class', () => {
      const wrapper = mountDateField({ class: 'test-date-field' });

      expect(wrapper.classes()).toContain('test-date-field');
      expect(wrapper.findAll('[data-vean-date-field-segment]').length).toBeGreaterThanOrEqual(5);
      expect(wrapper.find('[data-segment="month"]').text()).toContain('4');
      wrapper.unmount();
    });

    it('renders time segments when using date-time values', () => {
      const wrapper = mountDateField({
        modelValue: dateTime,
        granularity: 'second',
        'aria-label': 'Meeting time'
      });

      expect(wrapper.find('[data-segment="hour"]').exists()).toBe(true);
      expect(wrapper.find('[data-segment="minute"]').exists()).toBe(true);
      expect(wrapper.find('[data-segment="second"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('applies the size variant class to the root', () => {
      const wrapper = mountDateField({ size: 'lg' });

      expect(wrapper.find('[data-vean-date-field-root]').classes()).toContain('h-9');
      wrapper.unmount();
    });

    it('exposes modelValue, segments and isInvalid through the root slot', () => {
      const wrapper = mount(
        {
          components: { DateFieldRoot },
          data() {
            return {
              value: date,
              unavailable: (item: Date) => item.getDate() === 19,
              iso: (v: Date | { date: Date }) => toISODateString(v instanceof Date ? v : v.date)
            };
          },
          template: `
            <DateFieldRoot v-slot="{ modelValue, segments, isInvalid }" :model-value="value" :is-date-unavailable="unavailable">
              <span data-test="slot-count">{{ segments.length }}</span>
              <span data-test="slot-model">{{ modelValue ? iso(modelValue) : '' }}</span>
              <span data-test="slot-invalid">{{ isInvalid ? 'invalid' : 'valid' }}</span>
            </DateFieldRoot>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-test="slot-count"]').text()).toBe('5');
      expect(wrapper.find('[data-test="slot-model"]').text()).toBe('2026-04-19');
      expect(wrapper.find('[data-test="slot-invalid"]').text()).toBe('invalid');
      wrapper.unmount();
    });

    it('renders leading and trailing slots around the segments', () => {
      const wrapper = mount(SDateField, {
        props: { modelValue: date, 'aria-label': 'Event date' },
        slots: {
          leading: '<span data-test="leading">L</span>',
          trailing: '<span data-test="trailing">T</span>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-test="leading"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="trailing"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('marks segments with data-placeholder when there is no value', () => {
      const wrapper = mount(SDateField, {
        props: { 'aria-label': 'Empty date' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-segment="day"]').attributes('data-placeholder')).toBeDefined();
      expect(wrapper.find('[data-segment="year"]').attributes('data-placeholder')).toBeDefined();
      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('emits update:modelValue after keyboard editing a segment', async () => {
      const wrapper = mountDateField();
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: '2', preventDefault() {} });
      await day.trigger('keydown', { key: '0', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      wrapper.unmount();
    });

    it('increments the focused segment on ArrowUp', async () => {
      const wrapper = mountDateField();
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });

      const emitted = wrapper.emitted('update:modelValue');
      expect(toISODateString(emitted?.at(-1)?.[0] as Date)).toBe('2026-04-20');
      wrapper.unmount();
    });

    it('decrements the focused segment on ArrowDown', async () => {
      const wrapper = mountDateField();
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowDown', preventDefault() {} });

      expect(toISODateString((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as Date) ?? new Date(NaN))).toBe(
        '2026-04-18'
      );
      wrapper.unmount();
    });

    it('syncs segments when the controlled modelValue changes externally', async () => {
      const wrapper = mountDateField();

      await wrapper.setProps({ modelValue: new Date(2026, 12 - 1, 25) });
      await nextTick();

      expect(wrapper.find('[data-segment="day"]').text()).toContain('25');
      expect(wrapper.find('[data-segment="month"]').text()).toContain('12');
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', async () => {
      const wrapper = mount(SDateField, {
        props: { defaultValue: date, 'aria-label': 'Event date' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-segment="day"]').text()).toContain('19');

      const day = wrapper.find('[data-segment="day"]');
      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });

      expect(toISODateString((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as Date) ?? new Date(NaN))).toBe(
        '2026-04-20'
      );
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('moves focus between segments with ArrowLeft and ArrowRight', async () => {
      const wrapper = mountDateField();
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowRight', preventDefault() {} });
      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).toBe('year');

      await document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).toBe('day');
      wrapper.unmount();
    });

    it('reverses arrow direction in RTL', async () => {
      const wrapper = mountDateField({ dir: 'rtl' });
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowLeft', preventDefault() {} });

      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).toBe('year');
      wrapper.unmount();
    });

    it('auto-advances to the next segment after typing a complete day', async () => {
      const wrapper = mountDateField();
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: '1', preventDefault() {} });
      await day.trigger('keydown', { key: '9', preventDefault() {} });

      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).toBe('year');
      expect(toISODateString((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as Date) ?? new Date(NaN))).toBe(
        '2026-04-19'
      );
      wrapper.unmount();
    });

    it('deletes digits with Backspace and clears the value', async () => {
      const wrapper = mount(SDateField, {
        props: { defaultValue: date, 'aria-label': 'Event date' },
        attachTo: document.body
      });
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBeUndefined();
      await nextTick();
      expect(wrapper.find('[data-segment="day"]').attributes('data-placeholder')).toBeDefined();
      wrapper.unmount();
    });

    it('re-commits a new value after a segment was cleared', async () => {
      const wrapper = mountDateField();
      const day = wrapper.find('[data-segment="day"]');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await day.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await day.trigger('keydown', { key: '2', preventDefault() {} });
      await day.trigger('keydown', { key: '0', preventDefault() {} });

      expect(toISODateString((wrapper.emitted('update:modelValue')?.at(-1)?.[0] as Date) ?? new Date(NaN))).toBe(
        '2026-04-20'
      );
      wrapper.unmount();
    });
  });

  describe('invalid state', () => {
    it('marks the root and segments as invalid when the value exceeds maxValue', () => {
      const wrapper = mountDateField({ maxValue: new Date(2026, 4 - 1, 18) });

      expect(wrapper.find('[data-vean-date-field-root]').attributes('data-invalid')).toBeDefined();
      expect(wrapper.find('[data-segment="day"]').attributes('aria-invalid')).toBe('true');
      wrapper.unmount();
    });

    it('marks the root as invalid when isDateUnavailable matches', () => {
      const wrapper = mountDateField({ isDateUnavailable: (item: Date) => item.getDate() === 19 });

      expect(wrapper.find('[data-vean-date-field-root]').attributes('data-invalid')).toBeDefined();
      wrapper.unmount();
    });
  });

  describe('disabled and readonly state', () => {
    it('marks segments as disabled and prevents tab focus', () => {
      const wrapper = mountDateField({ disabled: true });
      const day = wrapper.find('[data-segment="day"]');

      expect(wrapper.attributes('data-disabled')).toBeDefined();
      expect(day.attributes('data-disabled')).toBeDefined();
      expect(day.attributes('tabindex')).toBeUndefined();
      wrapper.unmount();
    });

    it('marks segments as readonly and blocks keyboard editing', async () => {
      const wrapper = mountDateField({ readonly: true });
      const day = wrapper.find('[data-segment="day"]');

      expect(day.attributes('aria-readonly')).toBe('true');
      expect(day.attributes('contenteditable')).toBe('false');

      await day.trigger('focusin');
      await day.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('renders a hidden native input that submits the form value', () => {
      const wrapper = mountDateField({
        name: 'birthday',
        required: true,
        minValue: new Date(2026, 1 - 1, 1),
        maxValue: new Date(2026, 12 - 1, 31)
      });
      const input = wrapper.find('input[data-vean-visually-hidden]');

      expect(input.attributes('type')).toBe('date');
      expect(input.attributes('value')).toBe('2026-04-19');
      expect(input.attributes('name')).toBe('birthday');
      expect(input.attributes('required')).toBeDefined();
      expect(input.attributes('min')).toBe('2026-01-01');
      expect(input.attributes('max')).toBe('2026-12-31');
      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('applies ui.root class overrides', () => {
      const wrapper = mountDateField({ ui: { root: 'my-root-cls' } });

      expect(wrapper.find('[data-vean-date-field-root]').classes()).toContain('my-root-cls');
      wrapper.unmount();
    });

    it('applies ui.input class overrides to every segment', () => {
      const wrapper = mountDateField({ ui: { input: 'my-input-cls' } });

      wrapper.findAll('[data-vean-date-field-segment]').forEach(segment => {
        expect(segment.classes()).toContain('my-input-cls');
      });
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mountDateField({ 'aria-label': 'Accessible event date' });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations with a date-time value', async () => {
      const wrapper = mountDateField({
        modelValue: dateTime,
        granularity: 'second',
        'aria-label': 'Accessible meeting time'
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
