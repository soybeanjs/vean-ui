import type { LayoutCollapsible } from '@vean/aria/layout';
import type { MenuOptionData } from '@vean/aria/menu';
import type { PageTabsOptionData } from '@vean/aria/page-tabs';
import type { SplitNavMode, SplitNavSidebarColumns } from '@vean/aria/split-nav';
import type { DataOrientation } from '@vean/aria/types';
import { splitNavPaneMetrics } from '@/styles/split-nav';
import { themeSizeMap, themeSizeRatio } from '@/theme';
import type { ThemeSize } from '@/theme';
import type { AppShellLogoPlacement, AppShellLogoPlacementResolved, AppShellMenuItem, AppShellMode } from './types';

/** `md` is the 1x reference of the theme size scale. */
const baseFontSize = themeSizeMap.md;

/**
 * Collapsed width of the nested vertical pane inside `SSplitNav`, in pixels.
 *
 * The shell hands this to the menu as `collapsedWidth`; `SSplitNav` divides it
 * by 16 with no size scaling (`useSplitNavTreePane`), so the folded column keeps
 * the same width at every `size`.
 */
export const splitNavCollapsedPaneWidth = 50;

/**
 * Width of the folded nested pane, in rem, matching `splitNavCollapsedPaneWidth`.
 *
 * The shell has to reserve exactly the column the folded pane renders in, so
 * the two constants are derived from one value instead of drifting apart.
 */
const collapsedPaneRem = splitNavCollapsedPaneWidth / 16;

/** Sidebar width the layout falls back to when the mode does not derive one. */
export const defaultSidebarWidth = 240;

/** Collapsed sidebar width the layout falls back to when the mode does not derive one. */
export const defaultCollapsedSidebarWidth = 50;

/**
 * Menu renderer a mode uses.
 *
 * `tree` is a nested `STreeMenu`, `tree-nav` a `STreeNav` bar, `split` an
 * `SSplitNav` whose panes are mounted per the mode skeleton.
 */
export type AppShellMenuRenderer = 'tree' | 'tree-nav' | 'split';

/** Where the shell renders the menu instance. */
export type AppShellMenuPlacement = 'sidebar' | 'header';

/** Region the collapse trigger renders in. */
export type AppShellTriggerPlacement = 'header' | 'sidebar';

/** Mount target the shell has to render for a mode. */
export type AppShellMountTarget = 'header' | 'sidebar';

/**
 * Skeleton of a shell mode: the layout regions plus where the menu goes.
 */
export interface AppShellSkeleton {
  /**
   * Layout orientation. `horizontal` keeps the sidebar full height beside the
   * header, `vertical` puts the header across the top with the sidebar under it.
   */
  orientation: DataOrientation;
  sidebarVisible: boolean;
  collapsible: LayoutCollapsible;
  logoPlacement: AppShellLogoPlacementResolved;
  /**
   * Whether the sidebar is a column of its own on every state: it renders at
   * least one column expanded, and keeps a visible rail while collapsed.
   *
   * True for `sidebar` (one nested tree) and `dual-vertical` (a rail that always
   * holds the first level). False for `top` (no sidebar), `vertical-horizontal`
   * (an offcanvas sidebar that slides away when collapsed) and the menu-driven
   * sidebars of `horizontal-vertical` / `horizontal-dual-vertical`, which render
   * no column until a first-level menu opens. A brand pinned to the bottom needs
   * this: anywhere else it would disappear with the column it sits in.
   */
  stableSidebar: boolean;
  /**
   * Where the collapse trigger renders.
   *
   * `header` keeps it beside the brand; `sidebar` pins it to the bottom corner of
   * the sidebar, next to the column it collapses — where a top-bar-first layout
   * keeps it.
   */
  triggerPlacement: AppShellTriggerPlacement;
  renderer: AppShellMenuRenderer;
  /**
   * Split shape, only set when `renderer` is `split`.
   *
   * It is also what tells the shell to derive the sidebar width: the split modes
   * size it to the columns `SSplitNav` renders, every other mode keeps the
   * `SLayout` default.
   */
  splitNavMode: SplitNavMode | undefined;
  menuPlacement: AppShellMenuPlacement;
  mounts: readonly AppShellMountTarget[];
}

/**
 * Derived sidebar widths of the current shell state.
 */
export interface AppShellWidths {
  /** Sidebar width in pixels; `undefined` keeps the `SLayout` default. */
  sidebarWidth: number | undefined;
  /** Collapsed sidebar width in pixels; `undefined` keeps the `SLayout` default. */
  collapsedSidebarWidth: number | undefined;
}

/**
 * Convert a rem target into the pixel input `LayoutRoot` re-scales by size,
 * so `pxToRem(toLayoutPx(rem, size), size)` returns the original rem.
 */
function toLayoutPx(rem: number, size: ThemeSize): number {
  return (rem * baseFontSize) / themeSizeRatio[size];
}

interface SplitPaneWidth {
  /** First-level rail width, in pixels. */
  rail: number;
  /** Nested tree pane width while the sidebar is expanded, in pixels. */
  tree: number;
  /** Nested tree pane width while the sidebar is collapsed, in pixels. */
  collapsed: number;
}

function resolveSplitPaneWidth(size: ThemeSize): SplitPaneWidth {
  const { rail, tree } = splitNavPaneMetrics[size];

  return {
    rail: toLayoutPx(rail, size),
    tree: toLayoutPx(tree, size),
    collapsed: toLayoutPx(collapsedPaneRem, size)
  };
}

/**
 * Skeleton of every shell mode.
 *
 * The three teleporting split modes place their menu inside the sidebar region:
 * `SSplitNav` renders only teleported panes there, and the sidebar slot is the
 * one place that exposes the live collapsed state the menu has to follow.
 *
 * Widths are not stored here: the split modes derive them from the columns
 * `SSplitNav` actually renders, so a per-mode constant would reserve an empty
 * column whenever a level has nothing to show.
 */
export const appShellSkeletons: Readonly<Record<AppShellMode, AppShellSkeleton>> = {
  sidebar: {
    orientation: 'horizontal',
    sidebarVisible: true,
    collapsible: 'icon',
    logoPlacement: 'sidebar',
    stableSidebar: true,
    triggerPlacement: 'header',
    renderer: 'tree',
    splitNavMode: undefined,
    menuPlacement: 'sidebar',
    mounts: []
  },
  top: {
    orientation: 'vertical',
    sidebarVisible: false,
    collapsible: 'icon',
    logoPlacement: 'header',
    stableSidebar: false,
    triggerPlacement: 'header',
    renderer: 'tree-nav',
    splitNavMode: undefined,
    menuPlacement: 'header',
    mounts: []
  },
  'dual-vertical': {
    orientation: 'horizontal',
    sidebarVisible: true,
    collapsible: 'icon',
    logoPlacement: 'sidebar',
    stableSidebar: true,
    triggerPlacement: 'header',
    renderer: 'split',
    splitNavMode: 'dual-vertical',
    menuPlacement: 'sidebar',
    mounts: []
  },
  'vertical-horizontal': {
    orientation: 'horizontal',
    sidebarVisible: true,
    collapsible: 'offcanvas',
    logoPlacement: 'header',
    stableSidebar: false,
    triggerPlacement: 'header',
    renderer: 'split',
    splitNavMode: 'vertical-horizontal',
    menuPlacement: 'sidebar',
    mounts: ['header', 'sidebar']
  },
  'horizontal-vertical': {
    orientation: 'vertical',
    sidebarVisible: true,
    collapsible: 'icon',
    logoPlacement: 'header',
    stableSidebar: false,
    triggerPlacement: 'sidebar',
    renderer: 'split',
    splitNavMode: 'horizontal-vertical',
    menuPlacement: 'sidebar',
    mounts: ['header', 'sidebar']
  },
  'horizontal-dual-vertical': {
    orientation: 'vertical',
    sidebarVisible: true,
    collapsible: 'icon',
    logoPlacement: 'header',
    stableSidebar: false,
    triggerPlacement: 'sidebar',
    renderer: 'split',
    splitNavMode: 'horizontal-dual-vertical',
    menuPlacement: 'sidebar',
    mounts: ['header', 'sidebar']
  }
};

/**
 * Resolve the sidebar widths of the columns a split mode renders, letting
 * explicit overrides win.
 *
 * `columns` is `undefined` for the modes whose sidebar the layout sizes on its
 * own. A rail-less mode is simply a pane, so both cases are `rail + pane` with
 * the width of whichever of the two columns exist.
 *
 * Each width describes its own sidebar state, because `SLayout` picks one by
 * `data-state`; the shell never has to mirror the collapse into the numbers. The
 * nested pane follows the sidebar in both: expanded the sidebar takes the tree
 * width, collapsed the pane folds into its own icon rail and that folded column
 * is reserved as well.
 */
export function resolveShellWidths(
  size: ThemeSize,
  columns: SplitNavSidebarColumns | undefined,
  override: Partial<AppShellWidths> = {}
): AppShellWidths {
  if (!columns) {
    return {
      sidebarWidth: override.sidebarWidth,
      collapsedSidebarWidth: override.collapsedSidebarWidth
    };
  }

  const { rail, tree, collapsed } = resolveSplitPaneWidth(size);
  const columnsWidth = (paneWidth: number) => (columns.rail ? rail : 0) + (columns.pane ? paneWidth : 0);

  return {
    sidebarWidth: override.sidebarWidth ?? columnsWidth(tree),
    collapsedSidebarWidth: override.collapsedSidebarWidth ?? columnsWidth(collapsed)
  };
}

/**
 * Whether a resolved placement renders inside the sidebar column rather than the header.
 */
export function isSidebarLogoPlacement(placement: AppShellLogoPlacementResolved): boolean {
  return placement === 'sidebar' || placement === 'sidebar-bottom';
}

/**
 * Resolve the placement of the brand region.
 *
 * `auto` takes the skeleton's own default. Both sidebar placements need a
 * sidebar region, and the bottom one additionally needs a sidebar that is always
 * a column of its own (`stableSidebar`): every other skeleton keeps its default
 * placement, so the brand never ends up pinned where it would disappear.
 *
 * The skeleton rather than the mode: the shell renders the sidebar skeleton in
 * the mobile view, whatever mode is bound, and the brand follows what is
 * actually rendered.
 */
export function resolveLogoPlacement(
  skeleton: AppShellSkeleton,
  placement: AppShellLogoPlacement
): AppShellLogoPlacementResolved {
  if (placement === 'auto' || !skeleton.sidebarVisible) {
    return skeleton.logoPlacement;
  }

  if (placement === 'sidebar-bottom' && !skeleton.stableSidebar) {
    return skeleton.logoPlacement;
  }

  return placement;
}

/**
 * Split shapes whose sidebar top is a `DualVerticalMenu` column pair.
 */
const menuBrandModes: readonly SplitNavMode[] = ['dual-vertical', 'horizontal-dual-vertical'];

/**
 * Whether the brand of a resolved placement is rendered by the menu itself.
 *
 * The dual-vertical shapes open their sidebar with the menu's own first-level
 * rail and pane columns, and that menu owns the cells above them: `top-left`
 * carries the rail's divider on down through the items, and `top-right` exists
 * exactly while the pane column does. A brand region beside them could only
 * repeat that geometry — and its mark cell had to fake the divider to do it — so
 * a sidebar placement hands the mark and the title to those cells instead.
 *
 * Every other placement keeps the region: the single-column sidebars render it
 * as a menu row, and the header and bottom placements sit outside the menu.
 */
export function rendersBrandInMenu(skeleton: AppShellSkeleton, placement: AppShellLogoPlacementResolved): boolean {
  if (placement !== 'sidebar' || skeleton.splitNavMode === undefined) {
    return false;
  }

  return menuBrandModes.includes(skeleton.splitNavMode);
}

/**
 * Cell geometry of the brand region, in rem.
 *
 * The sidebar placements mirror the columns `SSplitNav` renders — the mark cell
 * takes the first-level rail, the title cell the pane below it — so the brand
 * lines up with the menu it sits above instead of guessing at the widths. A
 * column that does not exist, or is folded into its icon rail, drops its cell
 * rather than reserving width the sidebar does not take.
 */
export interface AppShellBrandLayout {
  /** Width of the mark cell in rem; `undefined` lets the injected mark size it. */
  markWidth: number | undefined;
  /** Width of the title cell in rem; `undefined` lets the injected title size it. */
  titleWidth: number | undefined;
  /** Whether the title renders at all. */
  titleVisible: boolean;
}

/**
 * Resolve the brand cells of the current placement and sidebar state.
 */
export function resolveBrandLayout(options: {
  size: ThemeSize;
  /** Sidebar columns the brand aligns to; `undefined` for the header placement. */
  columns: SplitNavSidebarColumns | undefined;
  /** Whether the sidebar is collapsed. */
  collapsed: boolean;
}): AppShellBrandLayout {
  const { size, columns, collapsed } = options;

  // Without a first-level rail — a header, or a sidebar that is a single pane —
  // there is no column to align to: the mark and the title share one row, and
  // collapsing is what takes the title away.
  if (!columns?.rail) {
    return { markWidth: undefined, titleWidth: undefined, titleVisible: !collapsed };
  }

  const { rail, tree } = splitNavPaneMetrics[size];
  const pane = columns.pane && !collapsed;

  return {
    markWidth: rail,
    titleWidth: pane ? tree : undefined,
    titleVisible: pane
  };
}

/**
 * Cells of the sidebar trigger row, in rem.
 *
 * The row mirrors the columns above it: the first cell is the first-level rail
 * and carries its divider, so the rail reads as one strip down to the sidebar's
 * bottom edge, and the trigger sits in the last column — at its end edge while
 * that column is the expanded pane, centered once it has folded into its icon
 * rail.
 */
export interface AppShellTriggerLayout {
  /** Width of the rail cell carrying the divider, in rem; `undefined` without a rail. */
  railWidth: number | undefined;
  /** Width of the trigger's cell, in rem; `undefined` lets it take the rest of the row. */
  width: number | undefined;
  /**
   * Whether the trigger centers in its cell.
   *
   * A folded column is only as wide as its icons, so the trigger centers there
   * instead of hugging an edge it would run past.
   */
  centered: boolean;
}

/**
 * Resolve the trigger row cells of the current sidebar state.
 *
 * The row only renders while the pane column exists — collapsing is what the
 * trigger is for, and without that column there is nothing to collapse — so the
 * caller checks that first.
 */
export function resolveTriggerLayout(
  size: ThemeSize,
  columns: SplitNavSidebarColumns | undefined,
  collapsed: boolean
): AppShellTriggerLayout {
  return {
    railWidth: columns?.rail ? splitNavPaneMetrics[size].rail : undefined,
    width: collapsed ? collapsedPaneRem : undefined,
    centered: collapsed
  };
}

/**
 * Build the pixel-to-rem converter the shell shares with every region it sizes.
 *
 * Mirrors the `SLayout` default (`themeSizeRatio[size] / themeSizeMap.md`) so
 * the layout, the tree menu, and the derived split widths all agree.
 */
export function createPxToRem(size: ThemeSize): (px: number) => number {
  return (px: number) => (px * themeSizeRatio[size]) / baseFontSize;
}

/**
 * Drop `hidden` items from a menu tree.
 *
 * The menu renderers filter hidden options themselves; this is for the options the
 * shell derives on its own — today the crumb dropdown — where `hidden` has to mean
 * the same thing.
 */
export function filterVisibleMenuItems(items: readonly AppShellMenuItem[]): AppShellMenuItem[] {
  return items
    .filter(item => !item.hidden)
    .map(item => (item.children ? { ...item, children: filterVisibleMenuItems(item.children) } : item));
}

/**
 * Menu options for a dropdown of `items`: hidden nodes dropped at every level.
 *
 * A node that has children keeps them, so it renders as a nested submenu
 * (`MenuSubTrigger`) and only the leaves below it activate, mirroring how the
 * menu renderers treat the same tree.
 */
export function toMenuOptions(items: readonly AppShellMenuItem[] = []): MenuOptionData<string>[] {
  return filterVisibleMenuItems(items).map(toMenuOption);
}

function toMenuOption(item: AppShellMenuItem): MenuOptionData<string> {
  const { value, label, icon, disabled, children } = item;

  return {
    value,
    label,
    icon,
    disabled,
    ...(children ? { children: toMenuOptions(children) } : {})
  };
}

/**
 * Menu nodes from the root down to `value`, or an empty trail when not found.
 *
 * Hidden nodes are kept: a hidden menu can still be the active route, and the
 * breadcrumb has to show where it sits.
 */
export function findMenuTrail(items: readonly AppShellMenuItem[], value: string | undefined): AppShellMenuItem[] {
  if (!value) {
    return [];
  }

  for (const item of items) {
    if (item.value === value) {
      return [item];
    }

    const childTrail = findMenuTrail(item.children ?? [], value);

    if (childTrail.length) {
      return [item, ...childTrail];
    }
  }

  return [];
}

/**
 * Find a menu node by value.
 */
export function findMenuItem(
  items: readonly AppShellMenuItem[],
  value: string | undefined
): AppShellMenuItem | undefined {
  return findMenuTrail(items, value).at(-1);
}

/**
 * Narrow a `SPageTabs` `click` / `contextmenu` payload to the tab data.
 *
 * Vue types the listener of a single-root component as the intersection of the
 * declared emit and the native DOM handler, so the shell has to accept both
 * shapes. The runtime payload is always the tab — the emit name is declared, so
 * it never doubles as a native attr — and the guard keeps that assumption from
 * being an unchecked cast.
 */
export function isPageTabsPayload(payload: PageTabsOptionData | Event): payload is PageTabsOptionData {
  return !(payload instanceof Event);
}
