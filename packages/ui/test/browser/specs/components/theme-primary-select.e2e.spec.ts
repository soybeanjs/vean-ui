import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SThemePrimarySelect from '@/components/theme-primary-select/theme-primary-select.vue';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * ThemePrimarySelect e2e — the trigger is a real select, so this exercises the
 * real ResizeObserver / pointer capture / portal the happy-dom spec
 * (`packages/ui/test/specs/components/theme-primary-select.spec.ts`) mocks, plus
 * the real color-contrast of the theme-dependent swatches.
 */
const trigger = () => page.getByRole('combobox', { name: 'Primary' });

/** the theme CSS variable the component writes through the provider. */
const primaryToken = () => {
  const css = document.getElementById('vean-theme')?.textContent ?? '';
  const match = css.match(/--primary:\s*([^;]+);/);

  return match?.[1]?.trim();
};

describe('SThemePrimarySelect (e2e)', () => {
  it('opens, lists every palette, and writes the choice into the theme', async () => {
    const { unmount } = await renderComponent(SThemePrimarySelect, { withTheme: {} });

    await expect.element(trigger()).toHaveTextContent('indigo');
    expect(primaryToken()).toBe('var(--indigo-500)');

    await userEvent.click(trigger());
    await expect.element(page.getByRole('listbox')).toBeVisible();

    await userEvent.click(page.getByRole('option', { name: 'rose' }));

    await expect.element(trigger()).toHaveTextContent('rose');
    expect(primaryToken()).toBe('var(--rose-500)');

    unmount();
  });

  it('renders one swatch in simple mode and five without it', async () => {
    const simple = await renderComponent(SThemePrimarySelect, { withTheme: {}, props: { simple: true } });

    expect(trigger().element().querySelectorAll('.rounded-full')).toHaveLength(1);

    simple.unmount();

    const full = await renderComponent(SThemePrimarySelect, { withTheme: {}, props: { simple: false } });

    expect(trigger().element().querySelectorAll('.rounded-full')).toHaveLength(5);

    full.unmount();
  });

  it('has no a11y violations with the theme applied', async () => {
    const { unmount } = await renderComponent(SThemePrimarySelect, { withTheme: {} });

    // `region` is a page-level best-practice rule: the bare test page has no
    // landmark elements, so it flags every component scanned from `body`.
    const violations = await getA11yViolations(undefined, {
      rules: { region: { enabled: false } }
    });

    expect(violations).toHaveLength(0);

    unmount();
  });
});
