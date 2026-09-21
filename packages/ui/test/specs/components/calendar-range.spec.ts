import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { toISODateString } from '@vean/aria/date';
import { addMonths } from 'date-fns/addMonths';
import SCalendarRange from '@/components/calendar-range/calendar-range.vue';
import { getA11yViolations } from '../../shared/a11y';

function mountRange(props?: Record<string, unknown>) {
  return mount(SCalendarRange, {
    props: { defaultPlaceholder: new Date(2026, 4 - 1, 18), ...props },
    attachTo: document.body
  });
}

function focusableValue(wrapper: ReturnType<typeof mountRange>, value: string) {
  return wrapper.get(`[data-vean-calendar-range-cell-trigger][data-value="${value}"]`);
}

function rangeCell(wrapper: ReturnType<typeof mountRange>, value: string) {
  const cell = focusableValue(wrapper, value).element.closest('[data-vean-calendar-range-cell]');

  if (!cell) {
    throw new Error(`No range cell found for ${value}`);
  }

  return cell;
}

function lastEmitRange(wrapper: ReturnType<typeof mountRange>) {
  return wrapper.emitted('update:modelValue')?.at(-1)?.[0] as { start?: Date | null; end?: Date | null } | undefined;
}

describe('SCalendarRange', () => {
  describe('rendering', () => {
    it('renders the heading controls and weekday cells', () => {
      const wrapper = mountRange();

      expect(wrapper.find('[aria-label="Select month"]').exists()).toBe(true);
      expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('S');
      wrapper.unmount();
    });

    it('applies custom root classes', () => {
      const wrapper = mountRange({ class: 'calendar-range-root-test' });

      expect(wrapper.classes()).toContain('calendar-range-root-test');
      wrapper.unmount();
    });

    it('renders multiple month grids when numberOfMonths is set', () => {
      const wrapper = mountRange({ numberOfMonths: 2 });

      expect(wrapper.findAll('[data-vean-calendar-range-grid]').length).toBe(2);
      expect(wrapper.text()).toContain('April');
      wrapper.unmount();
    });

    it('renders a fixed number of weeks when fixedWeeks is enabled', () => {
      const wrapper = mountRange({
        fixedWeeks: true,
        defaultPlaceholder: new Date(2026, 2 - 1, 1)
      });

      const bodyRows = wrapper.find('[data-vean-calendar-range-grid-body]').findAll('tr');

      expect(bodyRows.length).toBe(6);
      wrapper.unmount();
    });

    it('marks today with the data-today attribute', () => {
      const now = new Date();
      const wrapper = mountRange({
        defaultPlaceholder: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      });

      expect(wrapper.find('[data-today]').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('selected state', () => {
    it('marks the controlled range with selection start/end and selected days', () => {
      const wrapper = mountRange({
        modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 20) }
      });

      expect(wrapper.get('[data-value="2026-04-18"]').attributes('data-selection-start')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-20"]').attributes('data-selection-end')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-19"]').attributes('data-selected')).toBeDefined();
      wrapper.unmount();
    });

    it('marks the cells of a committed range with data-in-range', () => {
      const wrapper = mountRange({
        modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 20) }
      });

      expect(rangeCell(wrapper, '2026-04-18').hasAttribute('data-in-range')).toBe(true);
      expect(rangeCell(wrapper, '2026-04-19').hasAttribute('data-in-range')).toBe(true);
      expect(rangeCell(wrapper, '2026-04-20').hasAttribute('data-in-range')).toBe(true);
      expect(rangeCell(wrapper, '2026-04-21').hasAttribute('data-in-range')).toBe(false);
      wrapper.unmount();
    });

    it('withholds data-in-range until both ends are picked', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await nextTick();

      // The lone start is `selected` (its chip is filled) but draws no range band.
      const startCell = rangeCell(wrapper, '2026-04-18');

      expect(startCell.hasAttribute('data-selected')).toBe(true);
      expect(startCell.hasAttribute('data-in-range')).toBe(false);
      expect(wrapper.findAll('[data-in-range]').length).toBe(0);

      await wrapper.get('[data-value="2026-04-21"]').trigger('click');

      expect(wrapper.findAll('[data-in-range]').length).toBe(4);
      wrapper.unmount();
    });

    it('draws no range band for a same-day range', () => {
      const wrapper = mountRange({
        preventDeselect: true,
        modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 18) }
      });

      expect(wrapper.findAll('[data-in-range]').length).toBe(0);
      wrapper.unmount();
    });

    it('emits a complete range after clicking start then end', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await wrapper.get('[data-value="2026-04-21"]').trigger('click');

      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 18),
        end: new Date(2026, 4 - 1, 21)
      });
      wrapper.unmount();
    });

    it('sorts a reversed selection so start precedes end', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-value="2026-04-21"]').trigger('click');
      await wrapper.get('[data-value="2026-04-18"]').trigger('click');

      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 18),
        end: new Date(2026, 4 - 1, 21)
      });
      wrapper.unmount();
    });

    it('clears the selection when the start date is clicked again without preventDeselect', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await wrapper.get('[data-value="2026-04-18"]').trigger('click');

      expect(lastEmitRange(wrapper)).toEqual({ start: null, end: null });
      wrapper.unmount();
    });

    it('keeps a single selected date when clicked again with preventDeselect', async () => {
      const wrapper = mountRange({
        preventDeselect: true,
        modelValue: { start: new Date(2026, 4 - 1, 18), end: null }
      });

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');

      const last = lastEmitRange(wrapper);

      expect(toISODateString((last?.start as Date | null) ?? new Date(NaN))).toBe('2026-04-18');
      expect(toISODateString((last?.end as Date | null) ?? new Date(NaN))).toBe('2026-04-18');
      wrapper.unmount();
    });

    it('syncs the controlled modelValue from outside', async () => {
      const wrapper = mountRange();

      await wrapper.setProps({
        modelValue: { start: new Date(2026, 4 - 1, 15), end: new Date(2026, 4 - 1, 16) }
      });
      await nextTick();

      expect(wrapper.get('[data-value="2026-04-15"]').attributes('data-selection-start')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-16"]').attributes('data-selection-end')).toBeDefined();
      wrapper.unmount();
    });

    it('highlights the hovered range while picking the end date', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await wrapper.get('[data-value="2026-04-20"]').trigger('mouseenter');

      expect(wrapper.get('[data-value="2026-04-18"]').attributes('data-highlighted-start')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-19"]').attributes('data-highlighted')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-20"]').attributes('data-highlighted-end')).toBeDefined();
      wrapper.unmount();
    });

    it('restarts the range when it exceeds maximumDays', async () => {
      const wrapper = mountRange({ maximumDays: 5 });

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await wrapper.get('[data-value="2026-04-25"]').trigger('click');

      const last = lastEmitRange(wrapper);

      expect(toISODateString((last?.start as Date | null) ?? new Date(NaN))).toBe('2026-04-25');
      expect(last?.end).toBeNull();
      wrapper.unmount();
    });

    it('completes a non-contiguous range when allowNonContiguousRanges is enabled', async () => {
      const wrapper = mountRange({
        allowNonContiguousRanges: true,
        isDateUnavailable: (date: Date) => date.getDate() === 19
      });

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await wrapper.get('[data-value="2026-04-21"]').trigger('click');

      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 18),
        end: new Date(2026, 4 - 1, 21)
      });
      wrapper.unmount();
    });

    it('rejects a non-contiguous range by default', async () => {
      const wrapper = mountRange({
        isDateUnavailable: (date: Date) => date.getDate() === 19
      });

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await wrapper.get('[data-value="2026-04-21"]').trigger('click');

      const last = lastEmitRange(wrapper);

      expect(toISODateString((last?.start as Date | null) ?? new Date(NaN))).toBe('2026-04-21');
      expect(last?.end).toBeNull();
      wrapper.unmount();
    });

    it('keeps the start fixed when fixedDate is start', async () => {
      const wrapper = mountRange({
        fixedDate: 'start',
        modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 21) }
      });

      await wrapper.get('[data-value="2026-04-25"]').trigger('click');
      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 18),
        end: new Date(2026, 4 - 1, 25)
      });

      await wrapper.get('[data-value="2026-04-10"]').trigger('click');
      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 10),
        end: new Date(2026, 4 - 1, 18)
      });
      wrapper.unmount();
    });

    it('keeps the end fixed when fixedDate is end', async () => {
      const wrapper = mountRange({
        fixedDate: 'end',
        modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 21) }
      });

      await wrapper.get('[data-value="2026-04-25"]').trigger('click');
      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 21),
        end: new Date(2026, 4 - 1, 25)
      });

      await wrapper.get('[data-value="2026-04-10"]').trigger('click');
      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 10),
        end: new Date(2026, 4 - 1, 21)
      });
      wrapper.unmount();
    });

    it('does not select dates in readonly mode', async () => {
      const wrapper = mountRange({ readonly: true });

      await wrapper.get('[data-value="2026-04-20"]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('marks unavailable dates and prevents selection', async () => {
      const wrapper = mountRange({
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
      const wrapper = mountRange();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-19');
      wrapper.unmount();
    });

    it('moves focus to the previous day with ArrowLeft', async () => {
      const wrapper = mountRange();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-17');
      wrapper.unmount();
    });

    it('moves focus up and down a week with ArrowUp/ArrowDown', async () => {
      const wrapper = mountRange();

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
      const wrapper = mountRange({ dir: 'rtl' });

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-19');
      wrapper.unmount();
    });

    it('pages to the next month when crossing the grid boundary', async () => {
      const wrapper = mountRange();

      await focusableValue(wrapper, '2026-04-30').trigger('focusin');
      await focusableValue(wrapper, '2026-04-30').trigger('keydown', { key: 'ArrowRight' });
      await flushPromises();
      await nextTick();

      expect(wrapper.text()).toContain('May');
      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-05-01');
      wrapper.unmount();
    });

    it('selects start and end with Enter and Space', async () => {
      const wrapper = mountRange();

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'Enter' });

      const emitted = wrapper.emitted('update:modelValue');

      expect(toISODateString((emitted![0][0] as { start?: Date | null }).start!)).toBe('2026-04-18');

      await focusableValue(wrapper, '2026-04-21').trigger('focusin');
      await focusableValue(wrapper, '2026-04-21').trigger('keydown', { key: ' ' });

      expect(lastEmitRange(wrapper)).toEqual({
        start: new Date(2026, 4 - 1, 18),
        end: new Date(2026, 4 - 1, 21)
      });
      wrapper.unmount();
    });

    it('skips disabled dates when navigating', async () => {
      const wrapper = mountRange({
        isDateDisabled: (date: Date) => date.getDate() === 19
      });

      await focusableValue(wrapper, '2026-04-18').trigger('focusin');
      await focusableValue(wrapper, '2026-04-18').trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement?.getAttribute('data-value')).toBe('2026-04-20');
      wrapper.unmount();
    });

    it('moves focus to the first focusable date when the selected date is disabled', async () => {
      const wrapper = mountRange({
        modelValue: { start: new Date(2026, 4 - 1, 18), end: null },
        isDateDisabled: (date: Date) => date.getDate() === 18
      });

      const focused = wrapper.get('[data-vean-calendar-range-cell-trigger][tabindex="0"]');

      expect(focused.attributes('data-value')).not.toBe('2026-04-18');
      wrapper.unmount();
    });
  });

  describe('navigation buttons', () => {
    it('moves to the next month when the next button is clicked', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-vean-calendar-range-next]').trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('May');
      wrapper.unmount();
    });

    it('moves to the previous month when the prev button is clicked', async () => {
      const wrapper = mountRange();

      await wrapper.get('[data-vean-calendar-range-prev]').trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('March');
      wrapper.unmount();
    });

    it('disables navigation buttons when out of minValue/maxValue bounds', () => {
      const wrapper = mountRange({
        minValue: new Date(2026, 4 - 1, 1),
        maxValue: new Date(2026, 4 - 1, 30)
      });

      expect((wrapper.get('[data-vean-calendar-range-prev]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.get('[data-vean-calendar-range-next]').element as HTMLButtonElement).disabled).toBe(true);
      wrapper.unmount();
    });

    it('uses a custom page function and does not leak it to the DOM', async () => {
      const wrapper = mountRange({
        prevProps: { prevPage: (date: Date) => addMonths(date, -2) }
      });

      const prevButton = wrapper.get('[data-vean-calendar-range-prev]');

      await prevButton.trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('February');
      expect(prevButton.attributes('prev-page')).toBeUndefined();
      wrapper.unmount();
    });

    it('uses the custom aria-label when provided', () => {
      const wrapper = mountRange({
        prevProps: { 'aria-label': 'Go back' },
        nextProps: { 'aria-label': 'Go forward' }
      });

      expect(wrapper.get('[data-vean-calendar-range-prev]').attributes('aria-label')).toBe('Go back');
      expect(wrapper.get('[data-vean-calendar-range-next]').attributes('aria-label')).toBe('Go forward');
      wrapper.unmount();
    });

    it('provides default localized aria-labels for navigation buttons', () => {
      const wrapper = mountRange();

      expect(wrapper.get('[data-vean-calendar-range-prev]').attributes('aria-label')).toBe('Previous page');
      expect(wrapper.get('[data-vean-calendar-range-next]').attributes('aria-label')).toBe('Next page');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('disables matching dates and prevents range completion', async () => {
      const wrapper = mountRange({
        isDateDisabled: (date: Date) => date.getDate() === 19
      });

      const disabled = wrapper.get('[data-value="2026-04-19"]');

      expect(disabled.attributes('data-disabled')).toBeDefined();
      expect((disabled.element as HTMLButtonElement).disabled).toBe(true);

      await wrapper.get('[data-value="2026-04-18"]').trigger('click');
      await disabled.trigger('click');

      const last = lastEmitRange(wrapper);

      expect(last?.end).toBeNull();
      wrapper.unmount();
    });

    it('disables dates outside minValue/maxValue bounds', () => {
      const wrapper = mountRange({
        minValue: new Date(2026, 4 - 1, 10),
        maxValue: new Date(2026, 4 - 1, 20)
      });

      expect(wrapper.get('[data-value="2026-04-05"]').attributes('data-disabled')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-25"]').attributes('data-disabled')).toBeDefined();
      expect(wrapper.get('[data-value="2026-04-15"]').attributes('data-disabled')).toBeUndefined();
      wrapper.unmount();
    });

    it('marks the root as disabled in the disabled state', () => {
      const wrapper = mountRange({ disabled: true });

      expect(wrapper.attributes('data-disabled')).toBeDefined();
      expect(wrapper.get('[data-vean-calendar-range-grid]').attributes('aria-disabled')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mountRange();

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations with a selected range', async () => {
      const wrapper = mountRange({
        modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 21) }
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in the disabled state', async () => {
      const wrapper = mountRange({ disabled: true });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
