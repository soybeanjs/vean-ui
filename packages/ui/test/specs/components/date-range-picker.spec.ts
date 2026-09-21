import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { toISODateString } from '@vean/aria/date';
import SDateRangePicker from '@/components/date-range-picker/date-range-picker.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SDateRangePicker', () => {
  const findPopup = () => document.body.querySelector('[data-dismissable-layer][role="dialog"]');
  const findTrigger = (wrapper: ReturnType<typeof mount>) => wrapper.find('button[aria-haspopup="dialog"]');
  const findCalendar = () => document.body.querySelector('[data-vean-calendar-range-root]');
  const waitForDismissableLayer = async () => new Promise(resolve => window.setTimeout(resolve, 0));

  const mountRangePicker = (props?: Record<string, unknown>, slots?: Record<string, string>) =>
    mount(SDateRangePicker, {
      attachTo: document.body,
      props: {
        defaultPlaceholder: new Date(2024, 1 - 1, 1),
        ...props
      },
      slots
    });

  describe('rendering', () => {
    it('renders the range field and the calendar trigger', () => {
      const wrapper = mountRangePicker();

      expect(wrapper.find('[data-vean-date-range-field-root]').exists()).toBe(true);
      expect(findTrigger(wrapper).exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders with custom class', () => {
      const wrapper = mountRangePicker({ class: 'custom-class' });

      expect(wrapper.find('[data-vean-date-range-field-root]').classes()).toContain('custom-class');

      wrapper.unmount();
    });

    it('does not show popup by default', () => {
      const wrapper = mountRangePicker();

      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });

    it('renders the leading slot before the range segments', () => {
      const wrapper = mountRangePicker(undefined, {
        leading: '<span data-test="leading">L</span>'
      });

      expect(wrapper.find('[data-test="leading"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders the separator slot between the segment groups', () => {
      const wrapper = mountRangePicker(undefined, {
        separator: '<span data-test="separator">TO</span>'
      });

      expect(wrapper.find('[data-test="separator"]').text()).toBe('TO');

      wrapper.unmount();
    });

    it('gives the calendar toggle trigger an accessible name from the locale', () => {
      const wrapper = mountRangePicker();

      expect(findTrigger(wrapper).attributes('aria-label')).toBe('Open calendar');

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('shows popup when open is true', async () => {
      const wrapper = mountRangePicker({ defaultOpen: true });

      await wrapper.vm.$nextTick();

      expect(findPopup()).not.toBeNull();

      wrapper.unmount();
    });

    it('toggles popup on trigger click', async () => {
      const wrapper = mountRangePicker();

      await findTrigger(wrapper).trigger('click');
      await wrapper.vm.$nextTick();

      expect(findPopup()).not.toBeNull();

      wrapper.unmount();
    });

    it('emits update:open when trigger is clicked', async () => {
      const wrapper = mountRangePicker();

      await findTrigger(wrapper).trigger('click');

      expect(wrapper.emitted('update:open')).toBeTruthy();
      expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);

      wrapper.unmount();
    });

    it('closes popup when clicking outside', async () => {
      const wrapper = mountRangePicker({ defaultOpen: true });

      await nextTick();
      await waitForDismissableLayer();

      expect(findPopup()).not.toBeNull();

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await nextTick();

      expect(findPopup()).toBeNull();
      expect(wrapper.emitted('update:open')).toBeTruthy();

      wrapper.unmount();
    });

    it('closes popup on Escape', async () => {
      const wrapper = mountRangePicker({ defaultOpen: true });

      await nextTick();
      await waitForDismissableLayer();

      expect(findPopup()).not.toBeNull();

      findPopup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await nextTick();
      await waitForDismissableLayer();

      expect(findPopup()).toBeNull();
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);

      wrapper.unmount();
    });

    it('syncs the popup with a controlled open prop', async () => {
      const wrapper = mountRangePicker({ open: true });

      await nextTick();
      expect(findPopup()).not.toBeNull();

      await wrapper.setProps({ open: false });
      await nextTick();

      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });
  });

  describe('calendar integration', () => {
    it('does not leak dateFieldProps onto the calendar root', async () => {
      const wrapper = mountRangePicker({
        defaultOpen: true,
        dateFieldProps: { 'data-test-extra': 'leaked' }
      });

      await nextTick();
      await waitForDismissableLayer();

      const calendar = findCalendar();

      expect(calendar).not.toBeNull();
      expect(calendar?.attributes).not.toHaveProperty('dateFieldProps');
      expect(calendar?.attributes).not.toHaveProperty('date-field-props');
      expect(calendar?.attributes).not.toHaveProperty('data-test-extra');

      wrapper.unmount();
    });

    it('applies calendarRangeUi overrides without leaking onto the calendar root', async () => {
      const wrapper = mountRangePicker({
        defaultOpen: true,
        calendarRangeUi: { root: 'custom-calendar-root' }
      });

      await nextTick();
      await waitForDismissableLayer();

      const calendar = findCalendar();

      expect(calendar).not.toBeNull();
      expect(calendar?.classList.contains('custom-calendar-root')).toBe(true);
      expect(calendar?.attributes).not.toHaveProperty('calendarRangeUi');
      expect(calendar?.attributes).not.toHaveProperty('calendar-range-ui');

      wrapper.unmount();
    });

    it('forwards minValue and maxValue to the calendar', async () => {
      const wrapper = mountRangePicker({
        defaultOpen: true,
        minValue: new Date(2024, 1 - 1, 2)
      });

      await nextTick();
      await waitForDismissableLayer();

      const outOfRangeDay = document.body.querySelector('[data-value="2024-01-01"]');

      expect(outOfRangeDay).not.toBeNull();
      expect(outOfRangeDay?.getAttribute('data-disabled')).not.toBeNull();

      wrapper.unmount();
    });

    it('forwards isDateUnavailable to the calendar', async () => {
      const wrapper = mountRangePicker({
        defaultOpen: true,
        isDateUnavailable: (item: Date) => item.getDate() === 3
      });

      await nextTick();
      await waitForDismissableLayer();

      const unavailableDay = document.body.querySelector('[data-value="2024-01-03"]');

      expect(unavailableDay).not.toBeNull();
      expect(unavailableDay?.getAttribute('data-unavailable')).not.toBeNull();

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('marks the range field root and trigger as disabled', () => {
      const wrapper = mountRangePicker({ disabled: true });

      const root = wrapper.find('[data-vean-date-range-field-root]');
      const trigger = findTrigger(wrapper);

      expect(root.attributes('data-disabled')).toBe('');
      expect(trigger.attributes('data-disabled')).toBe('');
      expect(trigger.attributes('aria-disabled')).toBe('true');

      wrapper.unmount();
    });

    it('does not open popup when disabled', async () => {
      const wrapper = mountRangePicker({ disabled: true });

      await findTrigger(wrapper).trigger('click');
      await wrapper.vm.$nextTick();

      expect(findPopup()).toBeNull();
      expect(wrapper.emitted('update:open')).toBeFalsy();

      wrapper.unmount();
    });
  });

  describe('modelValue', () => {
    it('emits update:modelValue and closes popup when a range is selected', async () => {
      const wrapper = mountRangePicker({ defaultOpen: true });

      await nextTick();
      await waitForDismissableLayer();

      const startCell = document.body.querySelector('[data-value="2024-01-02"]');
      const endCell = document.body.querySelector('[data-value="2024-01-05"]');

      expect(startCell).not.toBeNull();
      expect(endCell).not.toBeNull();

      startCell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await nextTick();
      endCell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await nextTick();

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(
        toISODateString(
          (((emitted as NonNullable<typeof emitted>)[0][0] as { start?: Date | null }).start as Date | null) ??
            new Date(NaN)
        )
      ).toBe('2024-01-02');
      expect(
        toISODateString(
          (((emitted as NonNullable<typeof emitted>)[1][0] as { end?: Date | null }).end as Date | null) ??
            new Date(NaN)
        )
      ).toBe('2024-01-05');
      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });

    it('displays the formatted date range', () => {
      const start = new Date(2024, 1 - 1, 1);
      const end = new Date(2024, 1 - 1, 31);

      const wrapper = mountRangePicker({ modelValue: { start, end } });

      const root = wrapper.find('[data-vean-date-range-field-root]');

      expect(root.text()).toContain('2024');
      expect(root.text()).toContain('31');
      expect(root.text()).not.toContain('yyyy');

      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('applies ui.root class overrides', () => {
      const wrapper = mountRangePicker({ ui: { root: 'my-root-cls' } });

      expect(wrapper.find('[data-vean-date-range-field-root]').classes()).toContain('my-root-cls');

      wrapper.unmount();
    });

    it('applies ui.trigger class overrides', () => {
      const wrapper = mountRangePicker({ ui: { trigger: 'my-trigger-cls' } });

      expect(findTrigger(wrapper).classes()).toContain('my-trigger-cls');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when closed', async () => {
      const wrapper = mountRangePicker({ 'aria-label': 'Event date range' });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations when open', async () => {
      const wrapper = mountRangePicker({
        defaultOpen: true,
        'aria-label': 'Event date range'
      });

      await nextTick();
      await waitForDismissableLayer();

      const popup = findPopup();

      expect(popup).not.toBeNull();

      const violations = await getA11yViolations(popup as HTMLElement);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('gives the popup dialog an accessible name from the locale', async () => {
      const wrapper = mountRangePicker({ defaultOpen: true });

      await nextTick();
      await waitForDismissableLayer();

      const popup = findPopup();

      expect(popup?.getAttribute('role')).toBe('dialog');
      expect(popup?.getAttribute('aria-label')).toBe('Choose date range');

      wrapper.unmount();
    });

    it('allows overriding the popup accessible name via popupProps', async () => {
      const wrapper = mountRangePicker({
        defaultOpen: true,
        popupProps: { 'aria-label': 'Custom range dialog' }
      });

      await nextTick();
      await waitForDismissableLayer();

      expect(findPopup()?.getAttribute('aria-label')).toBe('Custom range dialog');

      wrapper.unmount();
    });
  });
});
