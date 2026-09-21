import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { render } from 'vitest-browser-vue';
import { page } from 'vitest/browser';
import type { TreeNavOptionData } from '@/components/tree-nav';
import STreeNav from '@/components/tree-nav/tree-nav.vue';

/**
 * TreeNav e2e — real `ResizeObserver` reflow for the collapsible overflow bar.
 *
 * The happy-dom unit spec (`packages/ui/test/specs/components/tree-nav.spec.ts`)
 * has to fake `clientWidth` / `scrollWidth` because happy-dom performs no
 * layout. This spec keeps the real measurement path: a genuinely too-narrow
 * container drives the reflow loop that moves trailing entries into the "more"
 * branch, and the same real layout decides what happens when `collapsible` is
 * turned back off.
 */
const manyItems: TreeNavOptionData[] = [
  'docs',
  'blog',
  'pricing',
  'github',
  'discord',
  'releases',
  'faq',
  'support'
].map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
  children: [{ value: `${value}-child`, label: `${value} page` }]
}));

function renderNarrowTreeNav(width: number, collapsible: ReturnType<typeof ref<boolean>>) {
  return render(
    defineComponent({
      name: 'NarrowTreeNavHost',
      setup() {
        return () =>
          h(
            'div',
            { style: { width: `${width}px`, overflow: 'hidden' } },
            h(STreeNav, { items: manyItems, collapsible: collapsible.value, moreLabel: 'More' })
          );
      }
    })
  );
}

describe('STreeNav (e2e)', () => {
  it('collapses overflowing entries into a trailing "more" branch so the bar fits', async () => {
    const { unmount } = await renderNarrowTreeNav(260, ref(true));

    await expect.element(page.getByText('More')).toBeVisible();

    // The bar content always fits inside the measurement wrapper.
    const rootEl = document.querySelector('[data-vean-tree-nav]');
    const wrapperEl = rootEl?.closest('[data-vean-tree-nav-overflow]');
    expect(rootEl).not.toBeNull();
    expect(wrapperEl).not.toBeNull();
    if (rootEl && wrapperEl) {
      expect(rootEl.getBoundingClientRect().width).toBeLessThanOrEqual(wrapperEl.getBoundingClientRect().width);
    }

    unmount();
  });

  it('restores every entry and drops the "more" branch when collapsible is turned off', async () => {
    const collapsible = ref(true);
    const { unmount } = await renderNarrowTreeNav(260, collapsible);

    await expect.element(page.getByText('More')).toBeVisible();

    collapsible.value = false;

    // Regression guard: the measured overflow count used to leak out of
    // collapsible mode, so the "more" branch survived while the full list was
    // rendered right next to it.
    await expect.element(page.getByText('More')).not.toBeInTheDocument();
    expect(document.querySelector('[data-vean-tree-nav-overflow]')).toBeNull();
    await expect.element(page.getByText('Support')).toBeInTheDocument();

    unmount();
  });
});
