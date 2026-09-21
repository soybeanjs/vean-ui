import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import STimeField from '@/components/time-field/time-field.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('STimeField', () => {
  const mountTimeField = (props?: Record<string, unknown>, slots?: Record<string, string>) =>
    mount(STimeField, {
      attachTo: document.body,
      props: {
        'aria-label': 'Meeting time',
        ...props
      },
      slots
    });

  describe('rendering', () => {
    it('renders the default hour/minute segments and custom class', () => {
      const wrapper = mountTimeField({
        class: 'test-time-field',
        modelValue: new Date(2000, 0, 1, 9, 30)
      });

      expect(wrapper.classes()).toContain('test-time-field');
      expect(wrapper.find('[data-segment="hour"]').exists()).toBe(true);
      expect(wrapper.find('[data-segment="minute"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders second and day-period segments when needed', () => {
      const wrapper = mountTimeField({
        modelValue: new Date(2000, 0, 1, 9, 30, 15),
        granularity: 'second'
      });

      expect(wrapper.find('[data-segment="second"]').exists()).toBe(true);
      expect(wrapper.find('[data-segment="dayPeriod"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders the day-period segment in a 12-hour cycle', () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 14, 30), hourCycle: 12 });

      expect(wrapper.find('[data-segment="dayPeriod"]').exists()).toBe(true);
      expect(wrapper.find('[data-segment="dayPeriod"]').text()).toMatch(/PM/i);

      wrapper.unmount();
    });

    it('renders the leading slot before the time segments', () => {
      const wrapper = mountTimeField(undefined, { leading: '<span data-test="leading">L</span>' });

      const leading = wrapper.find('[data-test="leading"]');

      expect(leading.exists()).toBe(true);
      expect(wrapper.find('[data-vean-time-field-root]').find('[data-test="leading"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders the trailing slot after the time segments', () => {
      const wrapper = mountTimeField(undefined, {
        trailing: '<span data-test="trailing">T</span>'
      });

      expect(wrapper.find('[data-test="trailing"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders a hidden native time input with the value and name', () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30), name: 'meeting' });

      const input = wrapper.find('input[type="time"]');

      expect(input.exists()).toBe(true);
      expect(input.attributes('value')).toBe('09:30');
      expect(input.attributes('name')).toBe('meeting');
      expect(input.attributes('tabindex')).toBe('-1');

      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('emits update:modelValue after keyboard editing a segment', async () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30) });

      const minute = wrapper.find('[data-segment="minute"]');

      await minute.trigger('focusin');
      await minute.trigger('keydown', { key: '4', preventDefault() {} });
      await minute.trigger('keydown', { key: '5', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();

      wrapper.unmount();
    });

    it('syncs the displayed segments with a controlled modelValue', async () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30) });

      await wrapper.setProps({ modelValue: new Date(2000, 0, 1, 10, 45) });
      await nextTick();

      expect(wrapper.find('[data-segment="hour"]').text()).toBe('10');
      expect(wrapper.find('[data-segment="minute"]').text()).toBe('45');

      wrapper.unmount();
    });

    it('uses defaultValue when uncontrolled', async () => {
      const wrapper = mountTimeField({ defaultValue: new Date(2000, 0, 1, 8, 15) });

      await nextTick();

      expect(wrapper.find('[data-segment="hour"]').text()).toBe('8');
      expect(wrapper.find('[data-segment="minute"]').text()).toBe('15');

      wrapper.unmount();
    });

    it('marks the root invalid when the value is below minValue', () => {
      const wrapper = mountTimeField({
        modelValue: new Date(2000, 0, 1, 9, 30),
        minValue: new Date(2000, 0, 1, 10, 0)
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();

      wrapper.unmount();
    });

    it('marks the root invalid when the value is unavailable', () => {
      const wrapper = mountTimeField({
        modelValue: new Date(2000, 0, 1, 9, 30),
        isTimeUnavailable: (time: Date) => time.getHours() === 9
      });

      expect(wrapper.attributes('data-invalid')).toBeDefined();

      wrapper.unmount();
    });
  });

  describe('keyboard', () => {
    it('increments a segment with ArrowUp', async () => {
      const wrapper = mountTimeField({ defaultValue: new Date(2000, 0, 1, 9, 30) });

      const hour = wrapper.find('[data-segment="hour"]');

      await hour.trigger('focusin');
      await hour.trigger('keydown', { key: 'ArrowUp', preventDefault() {} });
      await nextTick();

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect((emitted?.at(-1)?.[0] as Date)?.getHours()).toBe(10);

      wrapper.unmount();
    });

    it('moves focus to the next segment with ArrowRight', async () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30) });

      const hour = wrapper.find('[data-segment="hour"]');

      await hour.trigger('focusin');
      await hour.trigger('keydown', { key: 'ArrowRight', preventDefault() {} });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).not.toBe('hour');

      wrapper.unmount();
    });

    it('reverses the arrow direction in RTL', async () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30), dir: 'rtl' });

      const hour = wrapper.find('[data-segment="hour"]');

      await hour.trigger('focusin');
      await hour.trigger('keydown', { key: 'ArrowLeft', preventDefault() {} });
      await nextTick();

      // RTL swaps the physical arrow keys: ArrowLeft moves forward, like ArrowRight in LTR.
      expect(document.activeElement?.getAttribute('data-vean-date-field-segment')).not.toBe('hour');

      wrapper.unmount();
    });

    it('clears the value with Backspace and emits undefined', async () => {
      const wrapper = mountTimeField({ defaultValue: new Date(2000, 0, 1, 9, 30) });

      const minute = wrapper.find('[data-segment="minute"]');

      await minute.trigger('focusin');
      await minute.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await minute.trigger('keydown', { key: 'Backspace', preventDefault() {} });
      await nextTick();

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(emitted?.at(-1)?.[0]).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('disabled and readonly', () => {
    it('disables segments and blocks tab focus when disabled', () => {
      const wrapper = mountTimeField({ disabled: true, modelValue: new Date(2000, 0, 1, 9, 30) });

      const hour = wrapper.find('[data-segment="hour"]');

      expect(wrapper.attributes('data-disabled')).toBeDefined();
      expect(hour.attributes('data-disabled')).toBeDefined();
      expect(hour.attributes('tabindex')).toBeUndefined();

      wrapper.unmount();
    });

    it('prevents editing when readonly', async () => {
      const wrapper = mountTimeField({ readonly: true, defaultValue: new Date(2000, 0, 1, 9, 30) });

      const minute = wrapper.find('[data-segment="minute"]');

      expect(minute.attributes('aria-readonly')).toBe('true');

      await minute.trigger('focusin');
      await minute.trigger('keydown', { key: '4', preventDefault() {} });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('disables the hidden input and reflects required', () => {
      const wrapper = mountTimeField({
        disabled: true,
        required: true,
        modelValue: new Date(2000, 0, 1, 9, 30)
      });

      const input = wrapper.find('input[type="time"]');

      expect(input.attributes('disabled')).toBeDefined();
      expect(input.attributes('required')).toBeDefined();

      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('applies ui.root class overrides', () => {
      const wrapper = mountTimeField({ ui: { root: 'my-root-cls' } });

      expect(wrapper.classes()).toContain('my-root-cls');

      wrapper.unmount();
    });

    it('applies ui.input class overrides to the segments', () => {
      const wrapper = mountTimeField({ ui: { input: 'my-input-cls' } });

      expect(wrapper.find('[data-segment="hour"]').classes()).toContain('my-input-cls');

      wrapper.unmount();
    });

    it('applies size variants to the root', () => {
      const wrapper = mountTimeField({ size: 'sm' });

      expect(wrapper.find('[data-vean-time-field-root]').classes()).toContain('h-7');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30) });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations in the 12-hour cycle state', async () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 14, 30), hourCycle: 12 });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('gives the time segments accessible names from the locale', () => {
      const wrapper = mountTimeField({ modelValue: new Date(2000, 0, 1, 9, 30) });

      expect(wrapper.find('[data-segment="hour"]').attributes('aria-label')).toMatch(/^hour/);
      expect(wrapper.find('[data-segment="minute"]').attributes('aria-label')).toMatch(/^minute/);

      wrapper.unmount();
    });
  });
});
