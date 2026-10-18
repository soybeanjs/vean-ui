import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SLocaleSelect from '@/components/locale-select/locale-select.vue';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * LocaleSelect e2e — the interesting behavior lives in the portal'd listbox,
 * real pointer events, and real keyboard navigation, all of which the
 * happy-dom spec (`packages/ui/test/specs/components/locale-select.spec.ts`)
 * has to mock or drive synthetically.
 *
 * The option list is registry-driven (`en` + `zh-CN` are pre-registered), so
 * no fixture props are needed to get two real options.
 */
describe('SLocaleSelect (e2e)', () => {
  it('lists the registered locales and commits a pick from the real listbox', async () => {
    const { unmount } = await renderComponent(SLocaleSelect, { withTheme: true });

    const trigger = page.getByRole('combobox');
    await expect.element(trigger).toHaveTextContent('English');

    await userEvent.click(trigger);
    await expect.element(page.getByRole('listbox')).toBeVisible();
    await expect.element(page.getByRole('option', { name: '简体中文' })).toBeVisible();

    await userEvent.click(page.getByRole('option', { name: '简体中文' }));

    await expect.element(trigger).toHaveTextContent('简体中文');

    unmount();
  });

  it('selects a locale with the keyboard', async () => {
    const { unmount } = await renderComponent(SLocaleSelect, { withTheme: true });

    const trigger = page.getByRole('combobox');
    await userEvent.click(trigger);
    await expect.element(page.getByRole('listbox')).toBeVisible();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    // The default locale is `en`, so the trigger starts on `English`; asserting the
    // committed label (not "not the placeholder") is what actually proves the
    // keyboard pick ran through to the model.
    await expect.element(trigger).toHaveTextContent('简体中文');

    unmount();
  });

  it('keeps the locale list within the registry', async () => {
    const { unmount } = await renderComponent(SLocaleSelect, {
      props: { locales: ['zh-CN'] },
      withTheme: true
    });

    await userEvent.click(page.getByRole('combobox'));

    await expect.element(page.getByRole('listbox')).toBeVisible();
    await expect.element(page.getByRole('option', { name: '简体中文' })).toBeVisible();
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);

    unmount();
  });

  it('has no a11y violations with the listbox open', async () => {
    const { unmount } = await renderComponent(SLocaleSelect, { withTheme: true });

    await userEvent.click(page.getByRole('combobox'));
    await expect.element(page.getByRole('listbox')).toBeVisible();

    // `region` is a page-level best-practice rule: the bare test page has no
    // landmark elements, so it flags every component scanned from `body`.
    const violations = await getA11yViolations(undefined, {
      rules: { region: { enabled: false } }
    });

    expect(violations).toEqual([]);

    unmount();
  });
});
