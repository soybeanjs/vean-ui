import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, shallowRef } from 'vue';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import { toISODateString } from '@vean/aria/date';
import { addMonths } from 'date-fns/addMonths';
import SCalendar from '@/components/calendar/calendar.vue';
import { getA11yViolations } from '../../shared/a11y';

function mountCalendar(props?: Record<string, unknown>) {
  return mount(SCalendar, {
    props: { defaultPlaceholder: new Date(2026, 4 - 1, 18), ...props },
    attachTo: document.body
  });
}

function focusableValue(wrapper: ReturnType<typeof mount>, value: string) {
  return wrapper.get(`[data-vean-calendar-cell-trigger][data-value="${value}"]`);
}

describe('SCalendar', () => {
  describe('rendering', () => {
    it('renders the current heading and weekday cells', () => {
      const wrapper = mountCalendar();

      expect(wrapper.text()).toContain('April 2026');
      expect(wrapper.text()).toContain('S');
      wrapper.unmount();
    });

    it('applies custom root classes', () => {
      const wrapper = mountCalendar({ class: 'calendar-root-test' });

      expect(wrapper.classes()).toContain('calendar-root-test');
      wrapper.unmount();
    });

    it('renders multiple month grids when numberOfMonths is set', () => {
      const wrapper = mountCalendar({ numberOfMonths: 2 });

      expect(wrapper.findAll('[data-vean-calendar-grid]').length).toBe(2);
      expect(wrapper.text()).toContain('May 2026');
      wrapper.unmount();
    });

    it('renders a fixed number of weeks when fixedWeeks is enabled', () => {
      const wrapper = mountCalendar({
        fixedWeeks: true,
        defaultPlaceholder: new Date(2026, 2 - 1, 1)
      });

      const bodyRows = wrapper.find('[data-vean-calendar-grid-body]').findAll('tr');

      expect(bodyRows.length).toBe(6);
      wrapper.unmount();
    });

    it('marks today with the data-today attribute', () => {
      const now = new Date();
      const wrapper = mountCalendar({
        defaultPlaceholder: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      });

      expect(wrapper.find('[data-today]').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('selected state', () => {
    it('switches the visible month and year from compact heading controls', async () => {
      const wrapper = mountCalendar();

      await wrapper.get('button[aria-label="Select year"]').trigger('pointerdown', {
        button: 0,
        ctrlKey: false,
        pageX: 0,
        pageY: 0,
        pointerId: 1,
        pointerType: 'mouse'
      });
      await nextTick();

      const yearOption = Array.from(document.body.querySelectorAll('[role="option"]')).find(node =>
        node.textContent?.includes('2027')
      );

      expect(yearOption).toBeTruthy();

      await new DOMWrapper(yearOption as Element).trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();

      expect(wrapper.text()).toContain('April');
      expect(wrapper.text()).toContain('2027');

      await wrapper.get('button[aria-label="Select month"]').trigger('pointerdown', {
        button: 0,
        ctrlKey: false,
        pageX: 0,
        pageY: 0,
        pointerId: 2,
        pointerType: 'mouse'
      });
      await nextTick();

      const monthOption = Array.from(document.body.querySelectorAll('[role="option"]')).find(node =>
        node.textContent?.includes('May')
      );

      expect(monthOption).toBeTruthy();

      await new DOMWrapper(monthOption as Element).trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();

      expect(wrapper.text()).toContain('May');
      expect(wrapper.text()).toContain('2027');
      wrapper.unmount();
    });

    it('marks the controlled date as selected', () => {
      const wrapper = mountCalendar({ modelValue: new Date(2026, 4 - 1, 18) });

      expect(focusableValue(wrapper, '2026-04-18').attributes('data-selected')).toBeDefined();
      wrapper.unmount();
    });

    it('uses defaultValue when uncontrolled', () => {
      const wrapper = mount(SCalendar, {
        props: {
          defaultValue: new Date(2026, 4 - 1, 21),
          defaultPlaceholder: new Date(2026, 4 - 1, 18)
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-value="2026-04-21"]').attributes('data-selected')).toBeDefined();
      wrapper.unmount();
    });

    it('emits update:modelValue when a date is clicked', async () => {
      const wrapper = mountCalendar();

      await wrapper.get('[data-value="2026-04-20"]').trigger('click');
      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(toISODateString((emitted as NonNullable<typeof emitted>)[0][0] as Date)).toBe('2026-04-20');
      wrapper.unmount();
    });

    it('updates multiple selection when a date is clicked', async () => {
      const wrapper = mountCalendar({
        multiple: true,
        modelValue: [new Date(2026, 4 - 1, 18), new Date(2026, 4 - 1, 21)]
      });

      await wrapper.get('[data-value="2026-04-20"]').trigger('click');

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(((emitted as NonNullable<typeof emitted>)[0][0] as Date[]).map(date => toISODateString(date))).toEqual([
        '2026-04-18',
        '2026-04-21',
        '2026-04-20'
      ]);

      wrapper.unmount();
    });

    it('supports boolean shorthand multiple in template usage', async () => {
      const Demo = defineComponent({
        components: {
          SCalendar
        },
        setup() {
          const value = shallowRef([new Date(2026, 4 - 1, 18), new Date(2026, 4 - 1, 21)]);

          return {
            value
          };
        },
        template: '<SCalendar v-model="value" multiple :default-placeholder="value[0]" />'
      });

      const wrapper = mount(Demo, {
        attachTo: document.body
      });

      await wrapper.get('[data-vean-calendar-cell-trigger][data-value="2026-04-20"]').trigger('click');
      await nextTick();

      const selected = wrapper
        .findAll('[data-vean-calendar-cell-trigger][data-selected]')
        .map(node => node.attributes('data-value'));

      expect(selected).toEqual(['2026-04-18', '2026-04-20', '2026-04-21']);
      wrapper.unmount();
    });

    it('syncs the controlled modelValue from outside', async () => {
      const wrapper = mountCalendar();

      await wrapper.setProps({ modelValue: new Date(2026, 4 - 1, 15) });
      await nextTick();

      expect(wrapper.get('[data-value="2026-04-15"]').attributes('data-selected')).toBeDefined();
      wrapper.unmount();
    });

    it('keeps the selected date when preventDeselect is enabled', async () => {
      const wrapper = mountCalendar({
        preventDeselect: true,
        modelValue: new Date(2026, 4 - 1, 18)
      });

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(toISODateString(emitted![0][0] as Date)).toBe('2026-04-18');
      wrapper.unmount();
    });

    it('does not select dates in readonly mode', async () => {
      const wrapper = mountCalendar({ readonly: true });

      await wrapper.get('[data-value="2026-04-20"]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('marks unavailable dates and prevents selection', async () => {
      const wrapper = mountCalendar({
        isDateUnavailable: (date: Date) => date.getDate() === 20
      });

      const unavailable = wrapper.get('[data-value="2026-04-20"]');

      expect(unavailable.attributes('data-unavailable')).toBeDefined();
      expect((unavailable.element as HTMLButtonElement).disabled).toBe(true);

      await unavailable.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus to the next day with ArrowRight', async () => {
      const wrapper = mountCalendar();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-19');
      wrapper.unmount();
    });

    it('moves focus to the previous day with ArrowLeft', async () => {
      const wrapper = mountCalendar();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-17');
      wrapper.unmount();
    });

    it('moves focus up and down a week with ArrowUp/ArrowDown', async () => {
      const wrapper = mountCalendar();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowUp' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-11');

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-25');
      wrapper.unmount();
    });

    it('reverses arrow direction in RTL', async () => {
      const wrapper = mountCalendar({ dir: 'rtl' });

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-19');
      wrapper.unmount();
    });

    it('pages to the next month when crossing the grid boundary', async () => {
      const wrapper = mountCalendar();

      await focusableValue(wrapper, '2026-04-30').trigger('focusin');
      await focusableValue(wrapper, '2026-04-30').trigger('keydown', { key: 'ArrowRight' });
      await flushPromises();
      await nextTick();

      expect(wrapper.text()).toContain('May 2026');
      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-05-01');
      wrapper.unmount();
    });

    it('selects the focused date with Enter and Space', async () => {
      const wrapper = mountCalendar();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('update:modelValue');

      expect(toISODateString(emitted![0][0] as Date)).toBe('2026-04-18');

      await focusableValue(wrapper, '2026-04-20').trigger('focusin');
      await focusableValue(wrapper, '2026-04-20').trigger('keydown', { key: ' ' });

      expect(toISODateString(wrapper.emitted('update:modelValue')!.at(-1)![0] as Date)).toBe('2026-04-20');
      wrapper.unmount();
    });

    it('skips disabled dates when navigating', async () => {
      const wrapper = mountCalendar({
        isDateDisabled: (date: Date) => date.getDate() === 19
      });

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-20');
      wrapper.unmount();
    });

    it('moves focus to the first focusable date when the selected date is disabled', async () => {
      const wrapper = mountCalendar({
        modelValue: new Date(2026, 4 - 1, 18),
        isDateDisabled: (date: Date) => date.getDate() === 18
      });

      const focused = wrapper.get('[data-vean-calendar-cell-trigger][tabindex="0"]');

      expect(focused.attributes('data-value')).not.toBe('2026-04-18');
      wrapper.unmount();
    });
  });

  describe('navigation buttons', () => {
    it('moves to the next month when the next button is clicked', async () => {
      const wrapper = mountCalendar();

      await wrapper.get('[data-vean-calendar-next]').trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('May 2026');
      wrapper.unmount();
    });

    it('moves to the previous month when the prev button is clicked', async () => {
      const wrapper = mountCalendar();

      await wrapper.get('[data-vean-calendar-prev]').trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('March 2026');
      wrapper.unmount();
    });

    it('disables navigation buttons when out of minValue/maxValue bounds', () => {
      const wrapper = mountCalendar({
        minValue: new Date(2026, 4 - 1, 1),
        maxValue: new Date(2026, 4 - 1, 30)
      });

      expect((wrapper.get('[data-vean-calendar-prev]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.get('[data-vean-calendar-next]').element as HTMLButtonElement).disabled).toBe(true);
      wrapper.unmount();
    });

    it('uses a custom page function and does not leak it to the DOM', async () => {
      const wrapper = mountCalendar({
        prevProps: { prevPage: (date: Date) => addMonths(date, -2) }
      });

      const prevButton = wrapper.get('[data-vean-calendar-prev]');

      await prevButton.trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('February 2026');
      expect(prevButton.attributes('prev-page')).toBeUndefined();
      wrapper.unmount();
    });

    it('uses the custom aria-label when provided', () => {
      const wrapper = mountCalendar({
        prevProps: { 'aria-label': 'Go back' },
        nextProps: { 'aria-label': 'Go forward' }
      });

      expect(wrapper.get('[data-vean-calendar-prev]').attributes('aria-label')).toBe('Go back');
      expect(wrapper.get('[data-vean-calendar-next]').attributes('aria-label')).toBe('Go forward');
      wrapper.unmount();
    });

    it('provides default localized aria-labels for navigation buttons', () => {
      const wrapper = mountCalendar();

      expect(wrapper.get('[data-vean-calendar-prev]').attributes('aria-label')).toBe('Previous page');
      expect(wrapper.get('[data-vean-calendar-next]').attributes('aria-label')).toBe('Next page');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('disables matching dates and prevents selection', async () => {
      const wrapper = mountCalendar({
        isDateDisabled: (date: Date) => date.getDate() === 18
      });

      const disabled = wrapper.get('[data-value="2026-04-18"]');

      expect(disabled.attributes('data-disabled')).toBeDefined();
      expect((disabled.element as HTMLButtonElement).disabled).toBe(true);

      await disabled.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('disables dates outside minValue/maxValue bounds', () => {
      const wrapper = mountCalendar({
        minValue: new Date(2026, 4 - 1, 10),
        maxValue: new Date(2026, 4 - 1, 20)
      });

      expect(wrapper.get('[data-value="2026-04-05"]').attributes('data-disabled')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-25"]').attributes('data-disabled')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-15"]').attributes('data-disabled')).toBeUndefined();
      wrapper.unmount();
    });

    it('marks the root as disabled in the disabled state', () => {
      const wrapper = mountCalendar({ disabled: true });

      expect(wrapper.attributes('data-disabled')).toBeDefined();
      expect(wrapper.get('[data-vean-calendar-grid]').attributes('aria-disabled')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mountCalendar();

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in multiple mode', async () => {
      const wrapper = mountCalendar({ multiple: true, modelValue: [new Date(2026, 4 - 1, 18)] });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in the disabled state', async () => {
      const wrapper = mountCalendar({ disabled: true });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
