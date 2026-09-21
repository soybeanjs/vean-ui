import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SPageTabs from '@/components/page-tabs/page-tabs.vue';
import { renderComponent } from '../../shared/render';

/**
 * Page tabs e2e — context menu dismissal against a real pointer.
 *
 * The tab strip registers its context menu against the hovered tab, so a press on any tab
 * lands inside the menu's trigger element. That must not stop the menu from dismissing: the
 * menu opens on a right press, and a left press anywhere in the strip is a plain outside
 * press. The happy-dom unit spec cannot exercise this — it needs real pointer events plus the
 * layer's outside-`pointerdown` listener, which only a browser provides.
 */
const ITEM = '[data-vean-page-tabs-item]';

const items = [
  { value: 'home', label: 'Home' },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' }
];

function renderTabs() {
  return renderComponent(SPageTabs, {
    props: {
      items: items.map(item => ({ ...item })),
      modelValue: 'home',
      menuFactory: (tab: (typeof items)[number]) => [{ value: 'close', label: `Close ${tab.label}` }]
    }
  });
}

// The tab strip is intentionally role-less (a roving focus container, not a tablist), so the
// documented `data-vean-page-tabs-item` hook is the only stable locator.
function tabAt(index: number) {
  const element = document.querySelectorAll<HTMLElement>(ITEM)[index];

  if (!element) throw new Error(`Missing page tab at index ${index}`);

  return page.elementLocator(element);
}

const menu = () => page.getByRole('menu');

// The popup anchors at the press point and grows away from it, so a tab's top-left corner
// stays pressable no matter how wide the open menu renders.
const tabCorner = { x: 6, y: 6 };

describe('SPageTabs context menu (e2e)', () => {
  it('opens the tab menu on a right press', async () => {
    const { unmount } = await renderTabs();

    await userEvent.click(tabAt(1), { button: 'right' });

    await expect.element(page.getByRole('menuitem', { name: 'Close Profile' })).toBeVisible();

    unmount();
  });

  it('dismisses on a left press of the tab the menu belongs to', async () => {
    const { unmount } = await renderTabs();

    await userEvent.click(tabAt(1), { button: 'right' });
    await expect.element(menu()).toBeVisible();

    await userEvent.click(tabAt(1), { position: tabCorner });

    await expect.element(menu()).not.toBeInTheDocument();

    unmount();
  });

  it('dismisses on a left press of another tab', async () => {
    const { unmount } = await renderTabs();

    await userEvent.click(tabAt(1), { button: 'right' });
    await expect.element(menu()).toBeVisible();

    await userEvent.click(tabAt(2), { position: tabCorner });

    await expect.element(menu()).not.toBeInTheDocument();

    unmount();
  });
});
