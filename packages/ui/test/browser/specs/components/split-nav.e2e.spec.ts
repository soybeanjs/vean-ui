import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { page, userEvent } from 'vitest/browser';
import SSplitNav from '@/components/split-nav/split-nav.vue';
import { getA11yViolations } from '../../shared/a11y';
import { recordAnimationStarts, recordTransitionStarts, waitForMountWindow } from '../../shared/animation';
import { renderComponent } from '../../shared/render';

/**
 * SplitNav e2e — real RovingFocus keyboard + Teleport against a real browser.
 *
 * The happy-dom unit spec covers rendering, emit wiring, disabled items, and
 * Teleport structure. This spec covers first-level Arrow/Enter navigation and
 * theme-backed color-contrast a11y that happy-dom cannot faithfully reproduce.
 * ArrowRight (forward) on a vertical parent opens the nested pane without selecting
 * it; ArrowLeft (backward) on the pane's first item hands focus back to the rail.
 */
const items = [
  {
    value: 'overview',
    label: 'Overview'
  },
  {
    value: 'workspace',
    label: 'Workspace',
    children: [
      { value: 'projects', label: 'Projects' },
      { value: 'tasks', label: 'Tasks' }
    ]
  },
  {
    value: 'settings',
    label: 'Settings'
  }
];

/** Two levels under a rail item, so the pane has a branch to expand and collapse. */
const nestedItems = [
  {
    value: 'overview',
    label: 'Overview'
  },
  {
    value: 'workspace',
    label: 'Workspace',
    children: [
      {
        value: 'projects',
        label: 'Projects',
        children: [
          { value: 'soybean-ui', label: 'Soybean UI' },
          { value: 'soybean-admin', label: 'Soybean Admin' }
        ]
      },
      { value: 'tasks', label: 'Tasks' }
    ]
  }
];

/**
 * `SSplitNav` has no built-in collapse trigger — the consumer owns the state — so
 * the folding tests drive it through a ref the way an app shell would.
 */
function createCollapseHarness(collapsed: Ref<boolean>) {
  return defineComponent({
    name: 'SplitNavCollapseHarness',
    setup() {
      return () =>
        h(SSplitNav, {
          items: nestedItems,
          mode: 'horizontal-dual-vertical',
          modelValue: 'soybean-ui',
          collapsed: collapsed.value,
          'onUpdate:collapsed': (value: boolean) => {
            collapsed.value = value;
          }
        });
    }
  });
}

/**
 * Dual-vertical with the menu's own top cells filled: the slots are the host's
 * content, so the harness injects them the way an app shell does.
 */
function createTopSlotHarness(collapsed: Ref<boolean>) {
  return defineComponent({
    name: 'SplitNavTopSlotHarness',
    setup() {
      return () =>
        h(
          SSplitNav,
          {
            items,
            mode: 'dual-vertical',
            modelValue: 'workspace',
            collapsed: collapsed.value,
            'onUpdate:collapsed': (value: boolean) => {
              collapsed.value = value;
            }
          },
          {
            'top-left': () => h('span', { 'data-top-mark': '' }, 'Mark'),
            'top-right': () => h('span', { 'data-top-title': '' }, 'Title')
          }
        );
    }
  });
}

function element(selector: string): Element {
  const found = document.querySelector(selector);

  if (!found) {
    throw new Error(`expected "${selector}" to be rendered`);
  }

  return found;
}

describe('SSplitNav (e2e)', () => {
  describe('keyboard', () => {
    it('moves first-level focus with ArrowDown and opens a parent with Enter', async () => {
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items, mode: 'dual-vertical' }
      });

      const overview = page.getByRole('menuitem', { name: 'Overview' });
      await expect.element(overview).toBeVisible();

      overview.element().focus();
      await userEvent.keyboard('{ArrowDown}');

      const workspace = page.getByRole('menuitem', { name: 'Workspace' });
      await expect.element(workspace).toHaveFocus();

      await userEvent.keyboard('{Enter}');

      await expect.element(workspace).toHaveAttribute('data-state', 'open');
      await expect.element(page.getByText('Projects')).toBeVisible();
      await expect.element(page.getByText('Tasks')).toBeVisible();

      unmount();
    });

    it('opens a vertical first-level parent with ArrowRight without selecting it', async () => {
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items, mode: 'dual-vertical' }
      });

      const workspace = page.getByRole('menuitem', { name: 'Workspace' });
      workspace.element().focus();
      await userEvent.keyboard('{ArrowRight}');

      await expect.element(workspace).toHaveAttribute('data-state', 'open');
      await expect.element(page.getByText('Projects')).toBeVisible();

      unmount();
    });

    it('returns focus to the owning rail item with ArrowLeft on the nested pane', async () => {
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items, mode: 'dual-vertical', modelValue: 'workspace' }
      });

      const projects = page.getByRole('button', { name: 'Projects' });
      await expect.element(projects).toBeVisible();

      projects.element().focus();
      await userEvent.keyboard('{ArrowLeft}');

      const workspace = page.getByRole('menuitem', { name: 'Workspace' });
      await expect.element(workspace).toBeVisible();
      expect(document.activeElement).toBe(workspace.element());

      unmount();
    });
  });

  describe('teleport', () => {
    it('renders the dual-vertical pane inside the vertical mount target', async () => {
      const sider = document.createElement('div');
      sider.id = 'split-nav-e2e-sider';
      document.body.append(sider);

      const { unmount } = await renderComponent(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'workspace',
          verticalMountedId: 'split-nav-e2e-sider'
        }
      });

      await expect.element(page.getByRole('menuitem', { name: 'Workspace' })).toBeVisible();
      expect(sider.querySelector('[data-vean-split-nav-dual-vertical]')).toBeTruthy();
      expect(sider.querySelector('[data-vean-split-nav-vertical-first-level]')).toBeTruthy();
      expect(sider.querySelector('[data-vean-split-nav-sub-vertical]')).toBeTruthy();

      unmount();
      sider.remove();
    });
  });

  describe('nested tree motion', () => {
    it('animates collapsing the branch the pane expanded on mount', async () => {
      // The pane renders the active level-1 item's children, and `keep` expands the
      // selected chain before first paint — so `projects` is already open when its
      // collapsible content mounts. That is the path that used to freeze
      // `animation-name` and collapse with no motion.
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items: nestedItems, mode: 'dual-vertical', modelValue: 'soybean-ui' }
      });

      const branch = page.getByRole('button', { name: 'Projects' });
      await expect.element(branch).toBeVisible();
      await waitForMountWindow();

      const content = document.querySelector<HTMLElement>('[data-vean-tree-menu-collapsible-content]');

      if (!content) {
        throw new Error('expected the nested tree branch content to be rendered');
      }

      const starts = recordAnimationStarts(content);

      await userEvent.click(branch);
      await expect.poll(() => starts).toContain('collapsible-up');

      unmount();
    });

    it('transitions the tree row width when the rail folds', async () => {
      // The folded row is a fixed icon square (`w-8`) instead of `w-full`. Without a
      // width transition of its own it reached that size in a single frame while the
      // pane around it eased — and only in `horizontal-dual-vertical` was there no
      // branch closing alongside to hide the snap.
      const collapsed = ref(false);
      const { unmount } = await renderComponent(createCollapseHarness(collapsed));

      const row = page.getByRole('button', { name: 'Soybean UI' });
      await expect.element(row).toBeVisible();
      await waitForMountWindow();

      const transitions = recordTransitionStarts(row.element());

      collapsed.value = true;
      await nextTick();

      await expect.poll(() => transitions).toContain('width');

      unmount();
    });
  });

  /**
   * The `top-left` / `top-right` cells are geometry, not just markup: each has to
   * take the width of the column it heads, the rail cell has to stack above the
   * rail, and the pane cell has to follow the pane column into its folded width.
   * happy-dom can only see that the nodes are there.
   */
  describe('top slots', () => {
    it('sizes the dual-vertical top cells to the columns they head', async () => {
      const collapsed = ref(false);
      const { unmount } = await renderComponent(createTopSlotHarness(collapsed));

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();

      const box = (selector: string) => element(selector).getBoundingClientRect();
      const offBy = (left: number, right: number) => Math.abs(left - right);

      await expect
        .poll(() =>
          offBy(box('[data-vean-split-nav-top-left]').width, box('[data-vean-split-nav-vertical-first-level]').width)
        )
        .toBeLessThanOrEqual(1);
      await expect
        .poll(() =>
          offBy(box('[data-vean-split-nav-top-right]').width, box('[data-vean-split-nav-sub-vertical]').width)
        )
        .toBeLessThanOrEqual(1);

      // The rail cell closes the strip above the rail; the pane cell opens the
      // pane column it belongs to.
      expect(box('[data-vean-split-nav-top-left]').bottom).toBeLessThanOrEqual(
        box('[data-vean-split-nav-vertical-first-level]').top + 1
      );
      expect(
        offBy(box('[data-vean-split-nav-top-right]').top, box('[data-vean-split-nav-sub-vertical]').top)
      ).toBeLessThanOrEqual(1);

      collapsed.value = true;
      await nextTick();

      await expect
        .poll(() =>
          offBy(box('[data-vean-split-nav-top-right]').width, box('[data-vean-split-nav-sub-vertical]').width)
        )
        .toBeLessThanOrEqual(1);

      unmount();
    });
  });

  /**
   * The divider between the two columns is the pane's own leading edge, so it
   * belongs to the second column: it reaches the region's edges and follows the
   * column as it folds, and a lone pane — which has no column before it — stays
   * without one.
   */
  describe('divider', () => {
    it('leads the second column of a dual-vertical menu with the divider', async () => {
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items, mode: 'dual-vertical', modelValue: 'workspace' }
      });

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();

      const railElement = element('[data-vean-split-nav-vertical-first-level]');
      const paneElement = element('[data-vean-split-nav-sub-vertical]');
      const rail = railElement.getBoundingClientRect();
      const pane = paneElement.getBoundingClientRect();

      // One border, at the boundary: the pane leads with it, the rail carries
      // none of its own.
      expect(Math.abs(pane.left - rail.right)).toBeLessThanOrEqual(1);
      expect(getComputedStyle(paneElement).borderLeftWidth).not.toBe('0px');
      expect(getComputedStyle(railElement).borderRightWidth).toBe('0px');

      unmount();
    });

    it('leaves a lone pane without the divider', async () => {
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items, mode: 'horizontal-vertical', modelValue: 'workspace' }
      });

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();

      // Nothing precedes it: its edge stays the host's to draw.
      expect(getComputedStyle(element('[data-vean-split-nav-sub-vertical]')).borderLeftWidth).toBe('0px');

      unmount();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations including color-contrast', async () => {
      const { unmount } = await renderComponent(SSplitNav, {
        props: { items, modelValue: 'workspace' },
        withTheme: true
      });

      const violations = await getA11yViolations();

      expect(violations).toHaveLength(0);

      unmount();
    });
  });
});
