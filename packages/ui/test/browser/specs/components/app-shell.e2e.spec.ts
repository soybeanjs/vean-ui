import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';
import type { ShallowRef, VNodeChild } from 'vue';
import { page, userEvent } from 'vitest/browser';
import SAppShell from '@/components/app-shell/app-shell.vue';
import { splitNavCollapsedPaneWidth } from '@/components/app-shell/shared';
import type { AppShellMode, AppShellProps } from '@/components/app-shell/types';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * AppShell e2e — real layout geometry, real Teleport, and real color-contrast.
 *
 * The happy-dom unit spec covers the mode skeletons, emit wiring, and the
 * derived width values. This spec covers what happy-dom cannot: that the layout
 * sidebar actually measures up to the split-nav panes it wraps, that teleported
 * panes land inside the layout regions, that the mobile drawer is a real
 * portal, and that the themed shell has no color-contrast violations.
 *
 * The shell fills its container (`h-full`), so every scene mounts it inside a
 * fixed-size harness; the viewport is widened because the layout hides the
 * sidebar below `md`.
 */
const items = [
  {
    value: 'overview',
    label: 'Overview',
    icon: 'lucide:layout-dashboard'
  },
  {
    value: 'workbench',
    label: 'Workbench',
    icon: 'lucide:layout-grid',
    children: [
      {
        value: 'projects',
        label: 'Projects',
        icon: 'lucide:folder-kanban',
        children: [
          {
            value: 'vean-ui',
            label: 'Vean UI',
            icon: 'lucide:book-open'
          },
          {
            value: 'soybean-admin',
            label: 'Soybean Admin',
            icon: 'lucide:shield-check'
          }
        ]
      },
      {
        value: 'tasks',
        label: 'Tasks',
        icon: 'lucide:list-todo'
      }
    ]
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: 'lucide:settings'
  }
];

/**
 * A trail long enough to need more room than a narrow header has: the geometry
 * assertions are only meaningful while the crumb is under that pressure.
 */
const longTrail = [
  { value: 'home', label: 'Home' },
  { value: 'admin', label: 'Soybean Admin Platform' },
  { value: 'system', label: 'System Management' },
  { value: 'iam', label: 'Identity And Access Management' },
  { value: 'user', label: 'User Management' },
  { value: 'role', label: 'Role And Permission' },
  { value: 'detail', label: 'Role And Permission Detail' },
  { value: 'edit', label: 'Edit Role And Permission Detail' }
];

/** Three fixed-width trailing actions: what a real header keeps beside the trail. */
function trailingActions() {
  return h('div', { 'data-header-actions': '', class: 'flex items-center gap-2' }, [
    h('span', { class: 'size-8' }),
    h('span', { class: 'size-8' }),
    h('span', { class: 'size-8' })
  ]);
}

const breadcrumbs = [
  {
    value: 'home',
    label: 'Home'
  },
  {
    value: 'overview',
    label: 'Overview'
  }
];

function createHarness(
  props: AppShellProps,
  slots?: Record<string, () => VNodeChild>,
  handlers: Record<string, (value: string) => void> = {}
) {
  return defineComponent({
    name: 'AppShellHarness',
    setup() {
      return () => h('div', { style: 'height: 700px' }, h(SAppShell, { ...props, ...handlers }, slots));
    }
  });
}

/**
 * Harness that holds the active menu itself, i.e. what `v-model` does in a real
 * app: the shell reports a selection and the value is written back — including
 * when the write changes nothing.
 */
function createVModelHarness(initial: string) {
  return defineComponent({
    name: 'AppShellVModelHarness',
    setup() {
      const active = shallowRef(initial);

      return () =>
        h(
          'div',
          { style: 'height: 700px' },
          h(SAppShell, {
            mode: 'dual-vertical',
            items,
            modelValue: active.value,
            'onUpdate:modelValue': (value: string) => {
              active.value = value;
            }
          })
        );
    }
  });
}

/**
 * Harness whose active menu is owned by the test, so the menu can be driven the
 * way a router drives it: no clicking, only new values.
 */
function createRouteHarness(mode: AppShellMode, active: ShallowRef<string>) {
  return defineComponent({
    name: 'AppShellRouteHarness',
    setup() {
      return () =>
        h(
          'div',
          { style: 'height: 700px' },
          h(SAppShell, {
            mode,
            items,
            modelValue: active.value,
            'onUpdate:modelValue': (value: string) => {
              active.value = value;
            }
          })
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

function query(selector: string): Element | null {
  return document.querySelector(selector);
}

/**
 * The menu trigger of a breadcrumb entry.
 *
 * The sidebar renders a menu entry with the same label, so the role locator
 * alone is ambiguous; the documented `data-vean-breadcrumb-item` hook is the
 * stable scope for the header crumb.
 */
function crumbTrigger(index: number) {
  const item = document.querySelectorAll<HTMLElement>('[data-vean-breadcrumb-item]')[index];
  const trigger = item?.querySelector<HTMLElement>('[aria-haspopup="menu"]');

  if (!trigger) {
    throw new Error(`expected the crumb at index ${index} to render a menu trigger`);
  }

  return page.elementLocator(trigger);
}

/**
 * Wait for running CSS transitions to finish.
 *
 * The sidebar animates its width, so measuring right after mount can read a
 * half-applied layout. Infinite animations are skipped and a 500ms timeout
 * bounds the wait, mirroring the a11y helper.
 */
interface PaneGeometry {
  width: number;
  left: number;
  position: string;
  state: string | null;
}

interface ShellGeometry {
  /** `null` in the rail-less modes (`horizontal-vertical`). */
  railWidth: number | null;
  sidebarWidth: number;
  sidebarRight: number;
  pane: PaneGeometry | null;
}

function requireGeometry(value: number | null, what: string): number {
  if (value === null) {
    throw new Error(`expected ${what} to be rendered`);
  }

  return value;
}

/**
 * Read every box the geometry assertions need in one synchronous pass.
 *
 * Measuring piecemeal lets an async icon load shift the layout between two
 * reads, which shows up as an off-by-a-few-pixels flake under parallel load;
 * one pass keeps the numbers internally consistent.
 */
function geometry(): ShellGeometry {
  const railElement = query('[data-vean-split-nav-vertical-first-level]');
  const rail = railElement?.getBoundingClientRect();
  const sidebar = element('[data-vean-app-shell-sidebar]').getBoundingClientRect();
  const paneElement = query('[data-vean-split-nav-sub-vertical]');
  const paneRect = paneElement?.getBoundingClientRect();

  return {
    railWidth: rail?.width ?? null,
    sidebarWidth: sidebar.width,
    sidebarRight: sidebar.right,
    pane:
      paneElement && paneRect
        ? {
            width: paneRect.width,
            left: paneRect.left,
            position: getComputedStyle(paneElement).position,
            state: paneElement.getAttribute('data-state')
          }
        : null
  };
}

/** Integer-pixel key of the current geometry, so sub-pixel jitter cannot defeat the wait. */
function geometryKey(): string {
  const snapshot = geometry();

  return [
    snapshot.railWidth === null ? 'no-rail' : Math.round(snapshot.railWidth),
    Math.round(snapshot.sidebarWidth),
    Math.round(snapshot.sidebarRight),
    snapshot.pane
      ? [
          Math.round(snapshot.pane.width),
          Math.round(snapshot.pane.left),
          snapshot.pane.position,
          snapshot.pane.state
        ].join(',')
      : 'no-pane'
  ].join('|');
}

/**
 * Wait until the shell's geometry stops moving.
 *
 * The layout animates its width on first paint (the theme default gives way to
 * the derived width), so a measurement taken too early reads a half-applied
 * layout — invisible on an idle machine, reproducible under parallel load.
 * Polling for stable consecutive samples is robust to a transition that has not
 * started yet, unlike waiting on `document.getAnimations()`.
 */
async function waitForStableGeometry(): Promise<void> {
  let previous = geometryKey();
  let stableSamples = 0;

  await expect
    .poll(
      () => {
        const current = geometryKey();

        stableSamples = current === previous ? stableSamples + 1 : 0;
        previous = current;

        return stableSamples >= 2;
      },
      { timeout: 3000, interval: 60 }
    )
    .toBe(true);
}

describe('SAppShell (e2e)', () => {
  beforeEach(async () => {
    await page.viewport(1280, 900);
  });

  describe('sidebar geometry', () => {
    it('sizes the expanded sidebar to the split-nav panes', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'dual-vertical', modelValue: 'projects' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const { railWidth, sidebarWidth, pane } = geometry();

      if (!pane) {
        throw new Error('expected the nested pane to be rendered');
      }

      expect(pane.width).toBeGreaterThan(0);
      expect(
        Math.abs(requireGeometry(railWidth, 'the first-level rail') + pane.width - sidebarWidth)
      ).toBeLessThanOrEqual(1);

      unmount();
    });

    it('keeps only the rail while the active menu has no children', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'dual-vertical', modelValue: 'overview' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const { railWidth, sidebarWidth, pane } = geometry();

      // The nested pane has nothing to show, so it must not reserve a column.
      expect(pane).toBeNull();
      expect(Math.abs(sidebarWidth - requireGeometry(railWidth, 'the first-level rail'))).toBeLessThanOrEqual(1);

      unmount();
    });

    it('folds the pane into the rail while the sidebar is collapsed', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'dual-vertical', modelValue: 'projects', defaultOpen: false })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const { railWidth, sidebarWidth, sidebarRight, pane } = geometry();

      if (!pane) {
        throw new Error('expected the nested pane to be rendered');
      }

      const rail = requireGeometry(railWidth, 'the first-level rail');

      // The pane collapses in place: in flow, folded to its icon rail, and the
      // sidebar reserves the rail plus that folded column.
      expect(pane.position).toBe('static');
      expect(pane.state).toBe('collapsed');
      expect(Math.abs(pane.width - splitNavCollapsedPaneWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(rail + pane.width - sidebarWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(pane.left + pane.width - sidebarRight)).toBeLessThanOrEqual(1);

      unmount();
    });

    /**
     * The sidebar reserves exactly the columns the menu renders, and that has to
     * hold however the menu is activated: here the host moves the value on its own,
     * the way a router does, without any clicking.
     */
    it('keeps the sidebar aligned while a route drives the menu', async () => {
      const splitModes: AppShellMode[] = [
        'dual-vertical',
        'vertical-horizontal',
        'horizontal-vertical',
        'horizontal-dual-vertical'
      ];

      for (const mode of splitModes) {
        const active = shallowRef('overview');
        const { unmount } = await renderComponent(createRouteHarness(mode, active));

        for (const value of ['overview', 'workbench', 'tasks', 'vean-ui', 'settings', 'projects']) {
          active.value = value;
          await waitForStableGeometry();

          const { railWidth, sidebarWidth, pane } = geometry();
          const columns = (railWidth ?? 0) + (pane?.width ?? 0);

          // Sub-pixel rounding: the sidebar and the columns inside it may differ
          // by a fraction of a pixel, never by a whole column.
          expect({ mode, value, aligned: Math.abs(sidebarWidth - columns) <= 1 }).toEqual({
            mode,
            value,
            aligned: true
          });
        }

        unmount();
      }
    });

    /**
     * Regression: activating the leaf that is already active resets the open
     * path without changing the model value, so the sidebar has to fold on the
     * activation itself rather than on the value.
     */
    it('folds and unfolds the pane across a browse sequence', async () => {
      const { unmount } = await renderComponent(createVModelHarness('projects'));

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();

      async function railState() {
        await waitForStableGeometry();

        const { railWidth, sidebarWidth, pane } = geometry();
        const rail = requireGeometry(railWidth, 'the first-level rail');

        return { hasPane: pane !== null, railOnly: Math.abs(sidebarWidth - rail) <= 1, rail };
      }

      // The active route lives in the pane, so it is rendered.
      expect(await railState()).toMatchObject({ hasPane: true, railOnly: false });

      // A childless leaf closes it.
      await userEvent.click(page.getByRole('menuitem', { name: 'Overview' }));

      expect(await railState()).toMatchObject({ hasPane: false, railOnly: true });

      // A parent opens it again.
      await userEvent.click(page.getByRole('menuitem', { name: 'Workbench' }));

      expect(await railState()).toMatchObject({ hasPane: true, railOnly: false });

      // The same leaf once more: the value does not move, the pane closes anyway.
      await userEvent.click(page.getByRole('menuitem', { name: 'Overview' }));

      expect(await railState()).toMatchObject({ hasPane: false, railOnly: true });

      unmount();
    });

    /**
     * Folding the pane only hides its labels: the levels below its own top level
     * have to stay reachable, which is what the collapsed menu's flyout does.
     */
    it('keeps the levels below the folded pane reachable', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'dual-vertical', modelValue: 'projects', defaultOpen: false })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();

      // The folded item keeps its label in the accessibility tree, so it is
      // matched by role rather than by its exact name.
      const branch = page.getByRole('treeitem', { name: /Projects/ });

      await expect.element(branch).toBeVisible();
      await userEvent.hover(branch);

      await expect.element(page.getByRole('menuitem', { name: 'Vean UI' })).toBeVisible();

      unmount();
    });

    it('shrinks the rail-less sidebar to the folded pane for horizontal-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({
          items,
          mode: 'horizontal-vertical',
          modelValue: 'projects',
          defaultOpen: false
        })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Workbench' })).toBeVisible();
      await waitForStableGeometry();

      const { railWidth, sidebarWidth, pane } = geometry();

      if (!pane) {
        throw new Error('expected the nested pane to be rendered');
      }

      // No rail to fall back on: the collapsed sidebar is the folded pane, not a
      // zero-width strip with the tree floating over the content.
      expect(railWidth).toBeNull();
      expect(pane.position).toBe('static');
      expect(pane.state).toBe('collapsed');
      expect(Math.abs(pane.width - splitNavCollapsedPaneWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(pane.width - sidebarWidth)).toBeLessThanOrEqual(1);

      unmount();
    });

    /**
     * The sidebar of `horizontal-dual-vertical` hosts the dual-vertical pane of
     * the active first-level menu: its rail is the second level and its pane the
     * third, so a state that fills neither of them has to take no column at all.
     */
    it('reserves no column for a first-level leaf of horizontal-dual-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'overview' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const { railWidth, sidebarWidth, pane } = geometry();

      expect(railWidth).toBeNull();
      expect(pane).toBeNull();
      expect(Math.abs(sidebarWidth)).toBeLessThanOrEqual(1);

      unmount();
    });

    /**
     * The empty sidebar of a rail-less split mode, measured where the user sees it.
     *
     * The columns resolve to nothing, and the layout used to render the column
     * anyway: the `floating` wrapper painted its card's border and shadow on a
     * padding-wide strip, and the sidebar-adjacent spacing those variants add
     * beside the sidebar width indented the content by a spacing no column
     * occupied. The region itself stays mounted — it hosts the mount targets the
     * split panes teleport into, and the menu root that owns the header's top bar
     * lives inside it — so the column has to paint nothing rather than disappear
     * from the tree.
     */
    it('keeps the content on its variant edge while the split sidebar has no column', async () => {
      for (const [mode, variant, gapPx] of [
        ['horizontal-vertical', 'floating', 0],
        ['horizontal-vertical', 'inset', 8],
        ['horizontal-dual-vertical', 'floating', 0],
        ['horizontal-dual-vertical', 'inset', 8]
      ] as const) {
        const { unmount } = await renderComponent(
          createHarness({ items, mode, modelValue: 'overview', layoutProps: { variant } })
        );

        await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();

        await vi.waitFor(() => {
          const main = element('[data-vean-layout-main]');
          const root = element('[data-vean-layout-root]');

          expect(getComputedStyle(main).marginInlineStart).toBe(`${gapPx}px`);
          expect(Math.abs(main.getBoundingClientRect().left - root.getBoundingClientRect().left)).toBeLessThanOrEqual(
            gapPx + 1
          );
        });

        // A column with no width paints nothing: no client rects at all, unlike the
        // zero-width strip that still drew its card's border and shadow.
        expect(element('[data-vean-app-shell-sidebar]').getClientRects()).toHaveLength(0);

        unmount();
      }
    });

    it('takes only the rail column when a first-level menu of horizontal-dual-vertical opens', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'overview' })
      );

      const entry = page.getByRole('menuitem', { name: 'Workbench' });

      await expect.element(entry).toBeVisible();
      await userEvent.click(entry);
      await expect.element(page.getByRole('menuitem', { name: 'Projects' })).toBeVisible();
      await waitForStableGeometry();

      const { railWidth, sidebarWidth, pane } = geometry();

      // The rail holds the children of the opened menu; the pane below it stays
      // closed until one of them is opened, so no second column is reserved.
      expect(pane).toBeNull();

      const rail = requireGeometry(railWidth, 'the nested rail');

      expect(rail).toBeGreaterThan(0);
      expect(Math.abs(sidebarWidth - rail)).toBeLessThanOrEqual(1);

      unmount();
    });

    it('sizes the sidebar to the nested tree pane for horizontal-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-vertical', modelValue: 'projects' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Workbench' })).toBeVisible();
      await waitForStableGeometry();

      const { sidebarWidth, pane } = geometry();

      if (!pane) {
        throw new Error('expected the nested pane to be rendered');
      }

      expect(Math.abs(pane.width - sidebarWidth)).toBeLessThanOrEqual(1);

      unmount();
    });
  });

  describe('brand placement', () => {
    /** Horizontal center of a box. */
    function center(box: DOMRect): number {
      return (box.left + box.right) / 2;
    }

    const brandSlots = {
      logo: () => h('span', { 'data-shell-mark': '' }, 'Mark'),
      title: () => h('span', { 'data-shell-title': '' }, 'Vean UI')
    };

    /**
     * The rail and the pane are the columns the brand has to line up with, and
     * the injected mark and title are what a misaligned cell actually displaces:
     * measuring the content catches a padding or gap the cells do not have.
     *
     * The cells belong to the menu — `top-left` / `top-right` — so this also
     * covers the shell no longer reserving the columns in a region beside it.
     */
    it('centers the mark over the rail and the title over the pane in dual-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'dual-vertical', modelValue: 'projects' }, brandSlots)
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const rail = element('[data-vean-split-nav-vertical-first-level]').getBoundingClientRect();
      const pane = element('[data-vean-split-nav-sub-vertical]').getBoundingClientRect();
      const mark = element('[data-shell-mark]').getBoundingClientRect();
      const title = element('[data-shell-title]').getBoundingClientRect();

      expect(query('[data-vean-app-shell-logo]')).toBeNull();
      expect(Math.abs(center(mark) - center(rail))).toBeLessThanOrEqual(1);
      expect(Math.abs(center(title) - center(pane))).toBeLessThanOrEqual(1);

      unmount();
    });

    /**
     * A single-column sidebar brand mirrors the menu: its row is a tree-menu item
     * row, so the box — and with it the mark's column — matches the item right
     * below, expanded and once the sidebar folds to the item's icon width.
     */
    it('aligns the single-column brand row with the menu items', async () => {
      const expanded = await renderComponent(createHarness({ items }, brandSlots));

      await expect.element(page.getByText('Mark')).toBeVisible();
      await waitForStableGeometry();

      const expandedRow = element(
        '[data-vean-app-shell-logo-mark] [data-vean-tree-menu-styled-item-button]'
      ).getBoundingClientRect();
      const expandedItem = element('[data-vean-tree-menu-button]').getBoundingClientRect();

      expect(Math.abs(expandedRow.left - expandedItem.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(expandedRow.width - expandedItem.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(expandedRow.height - expandedItem.height)).toBeLessThanOrEqual(1);

      expanded.unmount();

      const collapsed = await renderComponent(createHarness({ items, defaultOpen: false }, brandSlots));

      await expect.element(page.getByText('Mark')).toBeVisible();
      await waitForStableGeometry();

      const collapsedRow = element(
        '[data-vean-app-shell-logo-mark] [data-vean-tree-menu-styled-item-button]'
      ).getBoundingClientRect();
      const collapsedItem = element('[data-vean-tree-menu-button]').getBoundingClientRect();
      const collapsedMark = element('[data-shell-mark]').getBoundingClientRect();

      // The folded state is the one that used to center the mark in the narrow
      // sidebar: the row now keeps the menu's inset and icon width instead.
      expect(Math.abs(collapsedRow.left - collapsedItem.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(collapsedRow.width - collapsedItem.width)).toBeLessThanOrEqual(1);

      // The folded row is icon-width and keeps its own padding, so a mark wider
      // than that content box runs to the row's trailing edge when start-aligned
      // and reads as shifted right. The row centers it on the menu icons' axis.
      expect(Math.abs(center(collapsedMark) - center(collapsedRow))).toBeLessThanOrEqual(1);
      expect(Math.abs(center(collapsedMark) - center(collapsedItem))).toBeLessThanOrEqual(1);
      expect(query('[data-shell-title]')).toBeNull();

      collapsed.unmount();
    });

    /**
     * The row inset is a per-size ladder that has to stay in step with the tree
     * menu root's own padding, or the mark drifts out of the icon column. `xs` and
     * `lg` are the two ends where the layout spacing scale and the menu's padding
     * steps diverge.
     */
    it('keeps the brand row inset in step with the menu across sizes', async () => {
      for (const size of ['xs', 'lg'] as const) {
        const { unmount } = await renderComponent(createHarness({ items, size }, brandSlots));

        await expect.element(page.getByText('Mark')).toBeVisible();
        await waitForStableGeometry();

        const brandRow = element(
          '[data-vean-app-shell-logo-mark] [data-vean-tree-menu-styled-item-button]'
        ).getBoundingClientRect();
        const menuRow = element('[data-vean-tree-menu-button]').getBoundingClientRect();

        expect(Math.abs(brandRow.left - menuRow.left)).toBeLessThanOrEqual(1);
        expect(Math.abs(brandRow.width - menuRow.width)).toBeLessThanOrEqual(1);

        unmount();
      }
    });

    it('pins the bottom brand to the sidebar bottom and the top one to its top', async () => {
      const bottom = await renderComponent(createHarness({ items, logoPlacement: 'sidebar-bottom' }, brandSlots));

      await expect.element(page.getByText('Mark')).toBeVisible();
      await waitForStableGeometry();

      const sidebar = element('[data-vean-app-shell-sidebar]').getBoundingClientRect();
      const menu = element('[data-vean-app-shell-menu-sidebar]').getBoundingClientRect();
      const brand = element('[data-vean-app-shell-logo]').getBoundingClientRect();

      expect(Math.abs(brand.bottom - sidebar.bottom)).toBeLessThanOrEqual(1);
      expect(brand.top).toBeGreaterThanOrEqual(menu.bottom - 1);

      bottom.unmount();

      const top = await renderComponent(createHarness({ items }, brandSlots));

      await expect.element(page.getByText('Mark')).toBeVisible();
      await waitForStableGeometry();

      expect(
        Math.abs(
          element('[data-vean-app-shell-logo]').getBoundingClientRect().top -
            element('[data-vean-app-shell-sidebar]').getBoundingClientRect().top
        )
      ).toBeLessThanOrEqual(1);

      top.unmount();
    });

    /**
     * The divider between the two columns is the pane's own leading edge: it runs
     * that column's whole height — the brand band included — instead of being
     * picked up by the rail and its top cell, which is what keeps the shell from
     * drawing a second line of its own.
     */
    it('leads the pane column with the divider, through the brand band', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'dual-vertical', modelValue: 'projects' }, brandSlots)
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const railElement = element('[data-vean-split-nav-vertical-first-level]');
      const cellElement = element('[data-vean-split-nav-top-left]');
      const paneElement = element('[data-vean-split-nav-sub-vertical]');
      const menu = element('[data-vean-app-shell-menu-sidebar]').getBoundingClientRect();
      const rail = railElement.getBoundingClientRect();
      const cell = cellElement.getBoundingClientRect();
      const pane = paneElement.getBoundingClientRect();

      // One border, on the pane's leading edge, at the rail's trailing edge.
      expect(Math.abs(pane.left - rail.right)).toBeLessThanOrEqual(1);
      expect(getComputedStyle(paneElement).borderLeftWidth).not.toBe('0px');
      expect(getComputedStyle(railElement).borderRightWidth).toBe('0px');
      expect(getComputedStyle(cellElement).borderRightWidth).toBe('0px');

      // The brand cell is the rail's own top cell, with the mark in it.
      expect(Math.abs(cell.width - rail.width)).toBeLessThanOrEqual(1);
      expect(cellElement.contains(element('[data-vean-app-shell-logo-mark]'))).toBe(true);

      // With no region above the menu, both columns open at the sidebar's own top
      // and the divider spans that whole band.
      expect(Math.abs(cell.top - menu.top)).toBeLessThanOrEqual(1);
      expect(Math.abs(pane.top - menu.top)).toBeLessThanOrEqual(1);
      expect(Math.abs(pane.bottom - menu.bottom)).toBeLessThanOrEqual(1);

      // The cell takes its height out of the column instead of pushing the rail
      // past the bottom edge the sidebar gives it.
      expect(Math.abs(rail.top - cell.bottom)).toBeLessThanOrEqual(1);
      expect(Math.abs(rail.bottom - menu.bottom)).toBeLessThanOrEqual(1);

      unmount();
    });
  });

  describe('collapse trigger', () => {
    /** Horizontal center of a box. */
    function center(box: DOMRect): number {
      return (box.left + box.right) / 2;
    }

    it('pins the trigger to the sidebar bottom corner for horizontal-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-vertical', modelValue: 'vean-ui' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const sidebar = element('[data-vean-app-shell-sidebar]').getBoundingClientRect();
      const trigger = element('[data-vean-layout-trigger]').getBoundingClientRect();

      expect(query('[data-vean-app-shell-header] [data-vean-layout-trigger]')).toBeNull();
      expect(sidebar.bottom - trigger.bottom).toBeLessThanOrEqual(24);
      expect(sidebar.right - trigger.right).toBeLessThanOrEqual(24);
      expect(sidebar.bottom - trigger.bottom).toBeGreaterThanOrEqual(0);

      unmount();
    });

    it('centers the collapsed trigger over the folded column of horizontal-dual-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({
          items,
          mode: 'horizontal-dual-vertical',
          modelValue: 'vean-ui',
          defaultOpen: false
        })
      );

      await waitForStableGeometry();

      const sidebar = element('[data-vean-app-shell-sidebar]').getBoundingClientRect();
      const foldedPane = element('[data-vean-split-nav-sub-vertical]').getBoundingClientRect();
      const trigger = element('[data-vean-layout-trigger]').getBoundingClientRect();

      // The sidebar is the rail plus the folded pane: the trigger centers over
      // the folded column, not over both.
      expect(Math.abs(center(trigger) - center(foldedPane))).toBeLessThanOrEqual(1);
      expect(center(trigger)).toBeGreaterThan(center(sidebar));

      unmount();
    });

    it('continues the rail divider into the trigger row', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'vean-ui' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const railElement = element('[data-vean-split-nav-vertical-first-level]');
      const paneElement = element('[data-vean-split-nav-sub-vertical]');
      const railCell = element('[data-vean-app-shell-trigger-rail]');
      const sidebar = element('[data-vean-app-shell-sidebar]').getBoundingClientRect();
      const railBox = railElement.getBoundingClientRect();
      const cellBox = railCell.getBoundingClientRect();
      const paneBox = paneElement.getBoundingClientRect();

      // Same column width, and the same divider the pane above leads with — which
      // sits at the rail's trailing edge — carried on to the sidebar's bottom.
      expect(Math.abs(cellBox.width - railBox.width)).toBeLessThanOrEqual(1);
      expect(getComputedStyle(railCell).borderRightWidth).toBe(getComputedStyle(paneElement).borderLeftWidth);
      expect(getComputedStyle(railCell).borderRightWidth).not.toBe('0px');
      expect(Math.abs(cellBox.right - paneBox.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(cellBox.bottom - sidebar.bottom)).toBeLessThanOrEqual(1);

      unmount();
    });

    it('renders the trigger only while the second panel is shown', async () => {
      const closed = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'overview' })
      );

      await waitForStableGeometry();

      expect(query('[data-vean-app-shell-trigger-row]')).toBeNull();

      closed.unmount();

      const open = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'vean-ui' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      expect(query('[data-vean-app-shell-trigger-row]')).not.toBeNull();

      open.unmount();
    });

    it('stretches the sidebar columns to the menu region in horizontal-dual-vertical', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'vean-ui' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Overview' })).toBeVisible();
      await waitForStableGeometry();

      const menu = element('[data-vean-app-shell-menu-sidebar]').getBoundingClientRect();
      const railElement = element('[data-vean-split-nav-vertical-first-level]');
      const paneElement = element('[data-vean-split-nav-sub-vertical]');
      const rail = railElement.getBoundingClientRect();
      const pane = paneElement.getBoundingClientRect();

      // The columns own the region's height, so the divider between them reaches
      // its bottom instead of stopping where the items do.
      expect(Math.abs(rail.bottom - menu.bottom)).toBeLessThanOrEqual(1);
      expect(Math.abs(pane.bottom - menu.bottom)).toBeLessThanOrEqual(1);
      expect(getComputedStyle(paneElement).borderLeftWidth).not.toBe('0px');

      unmount();

      const railLess = await renderComponent(
        createHarness({ items, mode: 'horizontal-vertical', modelValue: 'vean-ui' })
      );

      await waitForStableGeometry();

      const railLessMenu = element('[data-vean-app-shell-menu-sidebar]').getBoundingClientRect();
      const railLessPaneElement = element('[data-vean-split-nav-sub-vertical]');
      const railLessPane = railLessPaneElement.getBoundingClientRect();

      // The rail-less mode has the same single pane to stretch — and no column
      // before it, so its leading edge carries no divider to double the sidebar's.
      expect(Math.abs(railLessPane.bottom - railLessMenu.bottom)).toBeLessThanOrEqual(1);
      expect(getComputedStyle(railLessPaneElement).borderLeftWidth).toBe('0px');

      railLess.unmount();
    });
  });

  describe('teleport', () => {
    it('mounts the horizontal pane in the header and the vertical pane in the sidebar', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-vertical', modelValue: 'projects' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Workbench' })).toBeVisible();

      expect(query('[data-vean-layout-header] [data-vean-split-nav-horizontal-first-level]')).not.toBeNull();
      expect(query('[data-vean-app-shell-sidebar] [data-vean-split-nav-sub-vertical]')).not.toBeNull();

      unmount();
    });

    it('mounts both vertical panes of horizontal-dual-vertical in the sidebar', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'horizontal-dual-vertical', modelValue: 'projects' })
      );

      await expect.element(page.getByRole('menuitem', { name: 'Workbench' })).toBeVisible();

      const sidebar = query('[data-vean-app-shell-sidebar]');

      expect(query('[data-vean-layout-header] [data-vean-split-nav-horizontal-first-level]')).not.toBeNull();
      expect(sidebar?.querySelector('[data-vean-split-nav-dual-vertical]')).not.toBeNull();
      expect(sidebar?.querySelector('[data-vean-split-nav-vertical-first-level]')).not.toBeNull();

      unmount();
    });
  });

  describe('top menu', () => {
    /**
     * Regression guard: the layout root carries `data-orientation` too, so a
     * bare `group` on it used to flip this list to a column in `top` mode.
     */
    it('lays the menu bar out as a row inside the header', async () => {
      const { unmount } = await renderComponent(createHarness({ items, mode: 'top' }));

      const bar = element('[data-vean-tree-nav]');

      await expect.element(page.getByText('Overview')).toBeVisible();

      // No sidebar in this mode, so the geometry wait does not apply here.
      expect(getComputedStyle(bar).flexDirection).toBe('row');
      expect(bar.getBoundingClientRect().height).toBeLessThanOrEqual(
        element('[data-vean-layout-header]').getBoundingClientRect().height + 1
      );

      unmount();
    });

    /**
     * An entry that has children is a trigger with a visible label, and activating a
     * leaf reports its value so the shell tracks the active menu — the same contract
     * the tree and split renderers follow.
     */
    it('activates a leaf of the top bar', async () => {
      const onUpdate = vi.fn();
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'top', modelValue: 'overview' }, undefined, {
          'onUpdate:modelValue': onUpdate
        })
      );

      const branch = page.getByRole('button', { name: 'Workbench' });

      await expect.element(branch).toBeVisible();

      // A branch only opens its popup: that is not an activation.
      await userEvent.hover(branch);

      const leaf = page.getByRole('menuitem', { name: 'Tasks' });

      await expect.element(leaf).toBeVisible();
      expect(onUpdate).not.toHaveBeenCalled();

      await userEvent.click(leaf);

      expect(onUpdate).toHaveBeenCalledWith('tasks');

      unmount();
    });

    it('marks the active top bar entry', async () => {
      const { unmount } = await renderComponent(createHarness({ items, mode: 'top', modelValue: 'overview' }));

      const active = '[data-vean-tree-nav] [data-selected="true"]';

      await expect.poll(() => document.querySelector(active)?.textContent).toBe('Overview');

      unmount();
    });
  });

  describe('breadcrumb', () => {
    /**
     * The breadcrumb is mode-scoped: it renders only in the two modes whose
     * header carries neither the menu nor the brand. `top` mounts the menu tree
     * there instead, so a crumb scene has to use one of those two modes.
     */
    it('opens the sibling menu from an ancestor crumb and activates it', async () => {
      const onUpdate = vi.fn();
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'sidebar', modelValue: 'projects' }, undefined, {
          'onUpdate:modelValue': onUpdate
        })
      );

      const trigger = crumbTrigger(0);

      await expect.element(trigger).toBeVisible();
      await userEvent.click(trigger);

      const sibling = page.getByRole('menuitem', { name: 'Tasks' });

      await expect.element(sibling).toBeVisible();
      await userEvent.click(sibling);

      expect(onUpdate).toHaveBeenCalledWith('tasks');

      unmount();
    });

    /**
     * The crumb dropdown mirrors the menu tree, so an entry that has children
     * opens a real submenu instead of acting as a leaf that does nothing.
     */
    it('opens the submenu of a parent entry in an ancestor crumb', async () => {
      const onUpdate = vi.fn();
      const { unmount } = await renderComponent(
        createHarness({ items, mode: 'sidebar', modelValue: 'vean-ui' }, undefined, {
          'onUpdate:modelValue': onUpdate
        })
      );

      const trigger = crumbTrigger(0);

      await expect.element(trigger).toBeVisible();
      await userEvent.hover(trigger);

      const parent = page.getByRole('menuitem', { name: 'Projects' });

      await expect.element(parent).toBeVisible();
      await userEvent.hover(parent);

      const leaf = page.getByRole('menuitem', { name: 'Soybean Admin' });

      await expect.element(leaf).toBeVisible();
      await userEvent.click(leaf);

      expect(onUpdate).toHaveBeenCalledWith('soybean-admin');

      unmount();
    });
  });

  /**
   * A phone header has no room for a trail beside the trigger and the actions,
   * and the crumb would outrank both: below the breakpoint it is hidden, so the
   * header — and the page — never end up wider than the viewport.
   */
  it('hides the trail on a phone instead of pushing the header out', async () => {
    await page.viewport(390, 800);

    const { unmount } = await renderComponent(
      createHarness({ items, modelValue: 'vean-ui', breadcrumbs: longTrail }, { 'header-end': trailingActions })
    );

    await expect.element(page.getByRole('button', { name: 'Toggle Sidebar' })).toBeVisible();

    const crumb = element('[data-vean-breadcrumb-root]');
    const actions = element('[data-header-actions]');
    const header = element('[data-vean-app-shell-header]');

    expect(getComputedStyle(crumb).display).toBe('none');
    expect(actions.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
    expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);

    unmount();
  });

  /**
   * The same trail on a header that does have room for it: it truncates inside
   * its own region instead of taking the trailing actions' share, and the crumb
   * label is what gets ellipsized — never the actions that get pushed out.
   */
  it('truncates a deep trail on a narrow header', async () => {
    await page.viewport(768, 900);

    const { unmount } = await renderComponent(
      createHarness({ items, modelValue: 'vean-ui', breadcrumbs: longTrail }, { 'header-end': trailingActions })
    );

    // The rail carries the same label as the trigger on this width, so the crumb
    // itself is the thing to wait for.
    await expect.element(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();
    // The label is text, so measure with the font the assertion was written against.
    await document.fonts.ready;

    const crumb = element('[data-vean-breadcrumb-root]');
    const actions = element('[data-header-actions]');
    const header = element('[data-vean-app-shell-header]');
    const pages = document.querySelectorAll<HTMLElement>('[data-vean-breadcrumb-page]');
    const current = pages[pages.length - 1];

    // Rendered here, unlike on a phone.
    expect(getComputedStyle(crumb).display).not.toBe('none');
    expect(actions.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
    expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth + 1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    // Last on purpose: it proves the scene really was under pressure, i.e. that the
    // assertions above passed because the trail gave way — not because it fit. The
    // trail is several times the header's width, so no font can absorb it.
    expect(current.scrollWidth).toBeGreaterThan(current.clientWidth * 1.5);

    unmount();
  });

  describe('mobile drawer', () => {
    it('opens the sidebar in a real dialog', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, isMobile: true }, { logo: () => h('span', { 'data-shell-logo': '' }, 'Logo') })
      );

      const trigger = page.getByRole('button', { name: 'Toggle Sidebar' });

      await expect.element(trigger).toBeVisible();
      await userEvent.click(trigger);

      await expect.element(page.getByRole('dialog')).toBeVisible();
      await expect.element(page.getByRole('treeitem', { name: 'Overview' })).toBeVisible();
      expect(query('[data-vean-layout-mobile] [data-shell-logo]')).not.toBeNull();
      await expect.element(page.getByText('Logo')).toBeVisible();

      unmount();
    });

    /**
     * `isMobile` is optional: at a phone viewport the shell follows the viewport
     * on its own, so the host needs no media-query wiring to get the drawer.
     */
    it('follows the viewport when isMobile is unset', async () => {
      await page.viewport(390, 800);

      const { unmount } = await renderComponent(createHarness({ items }));

      const trigger = page.getByRole('button', { name: 'Toggle Sidebar' });

      await expect.element(trigger).toBeVisible();
      await userEvent.click(trigger);

      await expect.element(page.getByRole('dialog')).toBeVisible();
      expect(query('[data-vean-layout-mobile]')).not.toBeNull();

      unmount();
    });

    /**
     * The mobile view is the shell's own: it is entered with the viewport and left
     * with it, and the sidebar skeleton stands in for whatever mode is bound — so
     * the split panes give way to the drawer's single tree, and come back.
     */
    it('switches to the drawer skeleton with the viewport and back', async () => {
      const { unmount } = await renderComponent(createHarness({ items, mode: 'dual-vertical' }));

      const mobile = () => document.querySelector('[data-vean-app-shell]')?.getAttribute('data-mobile');

      expect(mobile()).toBe('false');
      expect(query('[data-vean-split-nav-root]')).not.toBeNull();

      await page.viewport(390, 800);
      await expect.poll(mobile).toBe('true');
      await expect.poll(() => query('[data-vean-split-nav-root]')).toBeNull();

      await page.viewport(1280, 900);
      await expect.poll(mobile).toBe('false');
      await expect.poll(() => query('[data-vean-split-nav-root]')).not.toBeNull();

      unmount();
    });

    /**
     * At a phone viewport every mode is the drawer shape: a header-first mode has
     * to give up its top bar, or the drawer would carry no navigation at all.
     */
    it('renders the full menu tree in the drawer for a header-first mode', async () => {
      await page.viewport(390, 800);

      const { unmount } = await renderComponent(createHarness({ items, mode: 'top' }));

      const trigger = page.getByRole('button', { name: 'Toggle Sidebar' });

      await expect.element(trigger).toBeVisible();
      await userEvent.click(trigger);

      await expect.element(page.getByRole('dialog')).toBeVisible();

      // The shape is the shell's business; the mode stays the host's.
      expect(document.querySelector('[data-vean-app-shell]')?.getAttribute('data-mode')).toBe('top');
      expect(query('[data-vean-tree-nav]')).toBeNull();
      expect(query('[data-vean-layout-mobile] [data-vean-tree-menu-root]')).not.toBeNull();
      expect(query('[data-vean-layout-mobile] [data-vean-split-nav-root]')).toBeNull();
      await expect.element(page.getByRole('treeitem', { name: 'Overview' })).toBeVisible();
      await expect.element(page.getByRole('treeitem', { name: 'Workbench' })).toBeVisible();
      await expect.element(page.getByRole('treeitem', { name: 'Settings' })).toBeVisible();

      unmount();
    });

    /**
     * A collapse is a desktop affordance: the drawer always shows the expanded
     * navigation, so a collapse picked on desktop must not ride along when the
     * mode switches.
     */
    it('keeps the drawer expanded after a collapse picked on desktop', async () => {
      const { unmount } = await renderComponent(
        createHarness(
          { items, isMobile: true, open: false, mobileOpen: true },
          { logo: () => h('span', { 'data-shell-logo': '' }, 'Logo'), title: () => h('span', 'Vean UI') }
        )
      );

      await expect.element(page.getByRole('dialog')).toBeVisible();
      expect(query('[data-vean-layout-mobile] [data-vean-app-shell-logo][data-collapsed]')).toBeNull();
      await expect.element(page.getByText('Vean UI')).toBeVisible();
      await expect.element(page.getByRole('treeitem', { name: 'Overview' })).toBeVisible();

      unmount();
    });

    /**
     * The drawer is teleported out of the layout root, and custom properties do
     * not survive a portal: the brand row has to re-declare the header band it
     * mirrors, or it sizes to its content instead.
     */
    it('keeps the brand row on the header band inside the portal', async () => {
      const { unmount } = await renderComponent(
        createHarness(
          { items, isMobile: true, mobileOpen: true },
          { logo: () => h('span', 'Logo'), title: () => h('span', 'Vean UI') }
        )
      );

      await expect.element(page.getByRole('dialog')).toBeVisible();

      const brand = element('[data-vean-layout-mobile] [data-vean-app-shell-logo]');

      // 3.5rem: the default header band (`--vean-layout-header-height`) the brand mirrors.
      expect(getComputedStyle(brand).height).toBe('56px');

      unmount();
    });

    /**
     * Sidebar content is the host's in the slots the shell exposes — the docs'
     * custom sidebar header is written against both aliases — so the layout's
     * spacing step has to reach it inside the portal too.
     */
    it('publishes the layout spacing to sidebar content inside the portal', async () => {
      const { unmount } = await renderComponent(
        createHarness(
          { items, isMobile: true, mobileOpen: true },
          {
            'sidebar-start': () =>
              h('div', {
                'data-spacing-probe': '',
                class: 'px-[--sl-spacing] pt-[--sl-half-spacing]'
              })
          }
        )
      );

      await expect.element(page.getByRole('dialog')).toBeVisible();

      const probe = element('[data-vean-layout-mobile] [data-spacing-probe]');
      const probeStyle = getComputedStyle(probe);

      // `md`: the 1rem spacing step and its 0.5rem half.
      expect(probeStyle.paddingInlineStart).toBe('16px');
      expect(probeStyle.paddingTop).toBe('8px');

      unmount();
    });
  });

  describe('accessibility', () => {
    /**
     * Two known upstream gaps keep this scene to the shell's own chrome:
     *
     * - `SPageTabs` paints the selected tab as `text-primary` on `bg-primary-50`
     *   (3.99:1 with the default indigo palette) — a page-tabs color issue.
     * - The layout sidebar is a plain `div` with no landmark, so anything the
     *   shell injects around the menu (the logo slot, `sidebar-start` /
     *   `sidebar-end`) sits outside a landmark and trips axe's `region` rule.
     *   Landmarks belong to the Aria layout family, not to this UI wrapper.
     */
    it('has no axe violations including color-contrast', async () => {
      const { unmount } = await renderComponent(
        createHarness({ items, breadcrumbs }, { footer: () => h('span', 'Footer') }),
        { withTheme: true }
      );

      const violations = await getA11yViolations();

      expect(violations.map(violation => `${violation.id}: ${violation.nodes[0]?.html ?? ''}`)).toEqual([]);

      unmount();
    });
  });
});
