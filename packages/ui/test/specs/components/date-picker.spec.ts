import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { toISODateString } from '@vean/aria/date';
import { SDatePicker } from '@/components/date-picker';
import { getA11yViolations } from '../../shared/a11y';

describe('sDatePicker', () => {
  const findPopup = () => document.body.querySelector('[data-dismissable-layer][role="dialog"]');
  const findTrigger = (wrapper: ReturnType<typeof mount>) => wrapper.find('button[aria-haspopup="dialog"]');
  const findCalendar = () => document.body.querySelector('[data-vean-calendar-root]');
  const waitForDismissableLayer = async () => new Promise(resolve => window.setTimeout(resolve, 0));

  const mountDatePicker = (props?: Record<string, unknown>, slots?: Record<string, string>) =>
    mount(SDatePicker, {
      attachTo: document.body,
      props: {
        defaultPlaceholder: new Date(2024, 1 - 1, 1),
        ...props
      },
      slots
    });

  describe('rendering', () => {
    it('should render with default slot', () => {
      const wrapper = mountDatePicker();

      expect(wrapper.find('[data-vean-date-field-root]').exists()).toBe(true);
      expect(findTrigger(wrapper).exists()).toBe(true);

      wrapper.unmount();
    });

    it('should render with custom class', () => {
      const wrapper = mountDatePicker({ class: 'custom-class' });

      const root = wrapper.find('[data-vean-date-field-root]');

      expect(root.classes()).toContain('custom-class');

      wrapper.unmount();
    });

    it('should not show popup by default', () => {
      const wrapper = mountDatePicker();

      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });

    it('should render the leading slot before the date segments', () => {
      const wrapper = mountDatePicker(undefined, { leading: '<span data-test="leading">L</span>' });

      expect(wrapper.find('[data-test="leading"]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-date-field-root]').find('[data-test="leading"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('should give the calendar toggle trigger an accessible name', () => {
      const wrapper = mountDatePicker();

      expect(findTrigger(wrapper).attributes('aria-label')).toBe('Open calendar');

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('should show popup when open is true', async () => {
      const wrapper = mountDatePicker({ defaultOpen: true });

      await wrapper.vm.$nextTick();

      expect(findPopup()).not.toBeNull();

      wrapper.unmount();
    });

    it('should toggle popup on trigger click', async () => {
      const wrapper = mountDatePicker();

      const trigger = findTrigger(wrapper);

      await trigger.trigger('click');
      await wrapper.vm.$nextTick();

      expect(findPopup()).not.toBeNull();

      wrapper.unmount();
    });

    it('should emit update:open when trigger is clicked', async () => {
      const wrapper = mountDatePicker();

      const trigger = findTrigger(wrapper);

      await trigger.trigger('click');

      expect(wrapper.emitted('update:open')).toBeTruthy();
      expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);

      wrapper.unmount();
    });

    it('should close popup when clicking outside', async () => {
      const wrapper = mountDatePicker({ defaultOpen: true });

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

    it('should close popup on Escape', async () => {
      const wrapper = mountDatePicker({ defaultOpen: true });

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

    it('should sync the popup with a controlled open prop', async () => {
      const wrapper = mountDatePicker({ open: true });

      await nextTick();
      expect(findPopup()).not.toBeNull();

      await wrapper.setProps({ open: false });
      await nextTick();

      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });
  });

  describe('calendar integration', () => {
    it('should not leak dateFieldProps onto the calendar root', async () => {
      const wrapper = mountDatePicker({
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

    it('should apply calendarUi overrides without leaking onto the calendar root', async () => {
      const wrapper = mountDatePicker({
        defaultOpen: true,
        calendarUi: { root: 'custom-calendar-root' }
      });

      await nextTick();
      await waitForDismissableLayer();

      const calendar = findCalendar();

      expect(calendar).not.toBeNull();
      expect(calendar?.classList.contains('custom-calendar-root')).toBe(true);
      expect(calendar?.attributes).not.toHaveProperty('calendarUi');
      expect(calendar?.attributes).not.toHaveProperty('calendar-ui');

      wrapper.unmount();
    });

    it('should forward minValue and maxValue to the calendar', async () => {
      const wrapper = mountDatePicker({
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

    it('should forward isDateUnavailable to the calendar', async () => {
      const wrapper = mountDatePicker({
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
    it('should have data-disabled attribute when disabled', () => {
      const wrapper = mountDatePicker({ disabled: true });

      const root = wrapper.find('[data-vean-date-field-root]');

      expect(root.attributes('data-disabled')).toBe('');

      wrapper.unmount();
    });

    it('should have aria-disabled on trigger when disabled', () => {
      const wrapper = mountDatePicker({ disabled: true });

      const trigger = findTrigger(wrapper);

      expect(trigger.attributes('aria-disabled')).toBe('true');

      wrapper.unmount();
    });

    it('should not open popup when disabled', async () => {
      const wrapper = mountDatePicker({ disabled: true });

      const trigger = findTrigger(wrapper);

      await trigger.trigger('click');
      await wrapper.vm.$nextTick();

      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });
  });

  describe('modelValue', () => {
    it('should emit update:modelValue and close popup when date is selected', async () => {
      const wrapper = mountDatePicker({ defaultOpen: true });

      await nextTick();

      const calendarAction = document.body.querySelector('[data-value="2024-01-02"]');

      expect(calendarAction).not.toBeNull();

      calendarAction?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await nextTick();

      const emitted = wrapper.emitted('update:modelValue');

      expect(emitted).toBeTruthy();
      expect(toISODateString(emitted?.at(-1)?.[0] as Date)).toBe('2024-01-02');
      expect(findPopup()).toBeNull();

      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('should apply ui.root class overrides', () => {
      const wrapper = mountDatePicker({ ui: { root: 'my-root-cls' } });

      expect(wrapper.find('[data-vean-date-field-root]').classes()).toContain('my-root-cls');

      wrapper.unmount();
    });

    it('should apply ui.trigger class overrides', () => {
      const wrapper = mountDatePicker({ ui: { trigger: 'my-trigger-cls' } });

      expect(findTrigger(wrapper).classes()).toContain('my-trigger-cls');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('should have no a11y violations when closed', async () => {
      const wrapper = mountDatePicker({ 'aria-label': 'Event date' });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('should have no a11y violations when open', async () => {
      const wrapper = mountDatePicker({
        defaultOpen: true,
        'aria-label': 'Event date',
        calendarUi: { root: 'rounded-md' }
      });

      await nextTick();
      await waitForDismissableLayer();

      const popup = findPopup();

      expect(popup).not.toBeNull();

      const violations = await getA11yViolations(popup as HTMLElement);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
