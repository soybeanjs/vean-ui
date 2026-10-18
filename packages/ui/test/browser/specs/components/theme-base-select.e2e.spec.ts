import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SThemeBaseSelect from '@/components/theme-base-select/theme-base-select.vue';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * ThemeBaseSelect e2e — the trigger is a real select, so this exercises the
 * real ResizeObserver / pointer capture / portal the happy-dom spec
 * (`packages/ui/test/specs/components/theme-base-select.spec.ts`) mocks, plus
 * the real color-contrast of the theme-dependent swatches.
 */
const trigger = () => page.getByRole('combobox', { name: 'Base' });

/** the theme CSS variable the component writes through the provider. */
const backgroundToken = () => {
  const css = document.getElementById('vean-theme')?.textContent ?? '';
  const match = css.match(/--background:\s*([^;]+);/);

  return match?.[1]?.trim();
};

describe('SThemeBaseSelect (e2e)', () => {
  it('opens, lists every neutral palette, and writes the choice into the theme', async () => {
    const { unmount } = await renderComponent(SThemeBaseSelect, { withTheme: {} });

    await expect.element(trigger()).toHaveTextContent('zinc');
    expect(backgroundToken()).toBe('var(--zinc-50)');

    await userEvent.click(trigger());
    await expect.element(page.getByRole('listbox')).toBeVisible();

    await userEvent.click(page.getByRole('option', { name: 'slate' }));

    await expect.element(trigger()).toHaveTextContent('slate');
    expect(backgroundToken()).toBe('var(--slate-50)');

    unmount();
  });

  it('renders one swatch in simple mode and five without it', async () => {
    const simple = await renderComponent(SThemeBaseSelect, { withTheme: {}, props: { simple: true } });

    expect(trigger().element().querySelectorAll('.rounded-full')).toHaveLength(1);

    simple.unmount();

    const full = await renderComponent(SThemeBaseSelect, { withTheme: {}, props: { simple: false } });

    expect(trigger().element().querySelectorAll('.rounded-full')).toHaveLength(5);

    full.unmount();
  });

  it('has no a11y violations with the theme applied', async () => {
    const { unmount } = await renderComponent(SThemeBaseSelect, { withTheme: {} });

    // `region` is a page-level best-practice rule: the bare test page has no
    // landmark elements, so it flags every component scanned from `body`.
    const violations = await getA11yViolations(undefined, {
      rules: { region: { enabled: false } }
    });

    expect(violations).toHaveLength(0);

    unmount();
  });
});
