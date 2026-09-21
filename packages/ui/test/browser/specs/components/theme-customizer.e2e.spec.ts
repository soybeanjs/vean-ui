import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SThemeCustomizer from '@/components/theme-customizer/theme-customizer.vue';
import { renderComponent } from '../../shared/render';

/**
 * The theme customizer shell (e2e).
 *
 * The shell must keep one box while switching between the Theme and Custom tabs:
 * a scrollbar appearing on the longer Custom panel used to resize the host popover.
 */
const ROOT = '[data-vean-theme-customizer]';
const SELECTED_CONTENT = '[data-vean-tabs-content][data-selected="true"]';

const boxOf = (selector: string): DOMRect => {
  const node = document.querySelector<HTMLElement>(selector);

  if (!node) {
    throw new Error(`missing element: ${selector}`);
  }

  return node.getBoundingClientRect();
};

const tabNamed = (name: string) => page.getByRole('tab', { name });

describe('SThemeCustomizer shell (e2e)', () => {
  it('keeps one box while switching Theme / Custom', async () => {
    const { unmount } = await renderComponent(SThemeCustomizer, { withTheme: {} });

    const theme = { root: boxOf(ROOT), content: boxOf(SELECTED_CONTENT) };

    await userEvent.click(tabNamed('Custom'));

    const custom = { root: boxOf(ROOT), content: boxOf(SELECTED_CONTENT) };

    // the outer box and the scrolling panel stay put in both axes
    expect(custom.root.width).toBeCloseTo(theme.root.width, 1);
    expect(custom.root.height).toBeCloseTo(theme.root.height, 1);
    expect(custom.content.width).toBeCloseTo(theme.content.width, 1);
    expect(custom.content.height).toBeCloseTo(theme.content.height, 1);

    unmount();
  });
});
