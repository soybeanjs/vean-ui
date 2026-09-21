import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SCalendarRange from '@/components/calendar-range/calendar-range.vue';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * CalendarRange e2e — the range band is theme-dependent styling, so only a real
 * browser can verify it. The happy-dom unit spec covers the `data-in-range`
 * contract; this spec proves the painted background follows it (the band must
 * not appear while only the start date is picked).
 */
const PLACEHOLDER = new Date(2026, 4 - 1, 18);

function dayButton(label: string) {
  return page.getByRole('button', { name: label });
}

function rangeCell(label: string) {
  const cell = dayButton(label).element().closest('[data-vean-calendar-range-cell]');

  if (!(cell instanceof HTMLElement)) {
    throw new Error(`No range cell found for ${label}`);
  }

  return cell;
}

describe('SCalendarRange (e2e)', () => {
  describe('range band', () => {
    it('paints no band while only the start date is picked', async () => {
      const { unmount } = await renderComponent(SCalendarRange, {
        props: { defaultPlaceholder: PLACEHOLDER },
        withTheme: true
      });

      await userEvent.click(dayButton('Saturday, April 18, 2026'));

      await expect.element(dayButton('Saturday, April 18, 2026')).toHaveAttribute('data-selection-start');
      expect(getComputedStyle(rangeCell('Saturday, April 18, 2026')).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(rangeCell('Monday, April 20, 2026')).backgroundColor).toBe('rgba(0, 0, 0, 0)');

      unmount();
    });

    it('paints the band across the committed range only', async () => {
      const { unmount } = await renderComponent(SCalendarRange, {
        props: { defaultPlaceholder: PLACEHOLDER },
        withTheme: true
      });

      await userEvent.click(dayButton('Saturday, April 18, 2026'));
      await userEvent.click(dayButton('Monday, April 20, 2026'));

      await expect.element(dayButton('Monday, April 20, 2026')).toHaveAttribute('data-selection-end');

      const band = getComputedStyle(rangeCell('Sunday, April 19, 2026')).backgroundColor;

      expect(band).not.toBe('rgba(0, 0, 0, 0)');
      expect(getComputedStyle(rangeCell('Saturday, April 18, 2026')).backgroundColor).toBe(band);
      expect(getComputedStyle(rangeCell('Monday, April 20, 2026')).backgroundColor).toBe(band);
      expect(getComputedStyle(rangeCell('Tuesday, April 21, 2026')).backgroundColor).toBe('rgba(0, 0, 0, 0)');

      unmount();
    });

    it('starts the range from the keyboard', async () => {
      const { unmount } = await renderComponent(SCalendarRange, {
        props: { defaultPlaceholder: PLACEHOLDER },
        withTheme: true
      });

      dayButton('Wednesday, April 15, 2026').element().focus();
      await userEvent.keyboard('{Enter}');

      await expect.element(dayButton('Wednesday, April 15, 2026')).toHaveAttribute('data-selection-start');
      expect(getComputedStyle(rangeCell('Wednesday, April 15, 2026')).backgroundColor).toBe('rgba(0, 0, 0, 0)');

      unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      // The default chromatic primary (indigo.500 + near-white foreground) sits just
      // under WCAG AA at ~4.28:1 — a known theme-baseline limitation the button spec
      // documents too. Run on a neutral primary so this contract verifies the
      // component (the selected chips and the range band), not the theme baseline.
      const { container, unmount } = await renderComponent(SCalendarRange, {
        props: {
          defaultPlaceholder: PLACEHOLDER,
          modelValue: { start: new Date(2026, 4 - 1, 18), end: new Date(2026, 4 - 1, 20) }
        },
        withTheme: { primary: 'zinc' }
      });

      expect(await getA11yViolations(container as HTMLElement)).toHaveLength(0);

      unmount();
    });
  });
});
