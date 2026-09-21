import type { BreadcrumbCompactProps, BreadcrumbOptionData, BreadcrumbUi } from '@vean/aria/breadcrumb';
import type { LayoutCompactProps, LayoutSide, LayoutUi } from '@vean/aria/layout';
import type {
  PageTabsCompactProps,
  PageTabsContextMenuOptionData,
  PageTabsDragEvent,
  PageTabsOptionData,
  PageTabsUi
} from '@vean/aria/page-tabs';
import type { SplitNavBaseOptionData, SplitNavMode, SplitNavRootProps, SplitNavUi } from '@vean/aria/split-nav';
import type { TreeMenuCompactProps, TreeMenuExpandStrategy, TreeMenuUi } from '@vean/aria/tree-menu';
import type { TreeNavCompactProps, TreeNavUi } from '@vean/aria/tree-nav';
import type { ClassValue, UiClass } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Shell skeleton of the `SAppShell` component.
 *
 * The four `SplitNavMode` literals are forwarded to `SSplitNav` unchanged — the
 * shell only decides where each pane is mounted. `sidebar` and `top` are the
 * single-pane shells (one nested `STreeMenu`, or one horizontal `STreeNav`).
 *
 * Mode names describe the **menu shape**, not the layout orientation. The
 * layout orientation is derived from the mode: a vertical first level makes the
 * sidebar span the full height (`orientation="horizontal"`), a horizontal first
 * level puts the header across the top (`orientation="vertical"`).
 *
 * The mode describes the **desktop** shape. In the mobile view the shell renders
 * the `sidebar` skeleton for every mode — the sidebar is the layout's drawer
 * there, and a drawer holds one nested tree — while this prop keeps reporting
 * what the host bound. See the AppShell docs, "Mobile view".
 */
export type AppShellMode = 'sidebar' | 'top' | SplitNavMode;

/**
 * Where the logo slot is rendered when `logoPlacement` is `'auto'`.
 */
export type AppShellLogoPlacementResolved = 'sidebar' | 'sidebar-bottom' | 'header';

/**
 * Logo slot placement.
 *
 * - `auto`: the mode's own default — the sidebar for the single-sidebar and
 *   dual-vertical shapes, the header for the rest.
 * - `sidebar`: the top of the sidebar.
 * - `sidebar-bottom`: the bottom of the sidebar, under the menu and
 *   `sidebar-end`. Only the modes whose sidebar is always a column of its own
 *   support it (`sidebar`, `dual-vertical`); every other mode keeps its default
 *   placement instead of pinning the brand where it can disappear.
 * - `header`: the header.
 */
export type AppShellLogoPlacement = 'auto' | AppShellLogoPlacementResolved;

/**
 * Option data for the `SAppShell` menu.
 *
 * A superset of the `TreeMenu` / `TreeNav` / `SplitNav` option data, so one tree
 * feeds the nested sidebar, the top bar, and the split panes alike.
 */
export interface AppShellMenuItem extends SplitNavBaseOptionData {
  /** Child options. */
  children?: AppShellMenuItem[];
}

/**
 * Per-renderer props forwarded by the shell to the menu it renders.
 */
export interface AppShellMenuProps {
  /** Forwarded to the nested `STreeMenu` (`sidebar` mode). */
  tree?: Omit<
    TreeMenuCompactProps,
    'items' | 'modelValue' | 'defaultValue' | 'collapsed' | 'defaultCollapsed' | 'collapsedWidth' | 'pxToRem'
  >;
  /** Forwarded to `SSplitNav` (the four split modes). */
  split?: Omit<
    SplitNavRootProps,
    | 'items'
    | 'modelValue'
    | 'defaultValue'
    | 'mode'
    | 'collapsed'
    | 'defaultCollapsed'
    | 'collapsedWidth'
    | 'horizontalMountedId'
    | 'verticalMountedId'
    | 'as'
    | 'class'
  >;
  /** Forwarded to `STreeNav` (`top` mode). */
  treeNav?: Omit<TreeNavCompactProps, 'items' | 'modelValue' | 'defaultValue' | 'class'>;
}

/**
 * Per-renderer UI class overrides forwarded by the shell to its menu.
 */
export interface AppShellMenuUi {
  /** Slot classes for the nested `STreeMenu` (`sidebar` mode). */
  tree?: Partial<TreeMenuUi>;
  /** Slot classes for `SSplitNav` (the four split modes). */
  split?: Partial<SplitNavUi>;
  /** Slot classes for `STreeNav` (`top` mode). */
  treeNav?: Partial<TreeNavUi>;
}

/**
 * Available UI slots for the AppShell component.
 *
 * `layout*` slots are merged into the `SLayout` `ui` map instead of being
 * rendered directly: they theme layout regions the shell does not own the
 * markup of. `layoutUi` takes precedence over them.
 */
export type AppShellUiSlot =
  | 'root'
  | 'sidebar'
  | 'logo'
  | 'logoMark'
  | 'logoTitle'
  | 'menuSidebar'
  | 'menuMount'
  | 'trigger'
  | 'triggerRow'
  | 'triggerRail'
  | 'triggerCell'
  | 'header'
  | 'headerStart'
  | 'headerCenter'
  | 'headerEnd'
  | 'breadcrumb'
  | 'breadcrumbTrigger'
  | 'breadcrumbTriggerIcon'
  | 'tab'
  | 'content'
  | 'footer'
  | 'layoutHeader'
  | 'layoutTab'
  | 'layoutContent'
  | 'layoutFooter';

/**
 * UI class overrides for the AppShell component.
 */
export type AppShellUi = Partial<UiClass<AppShellUiSlot>>;

/**
 * Properties for the AppShell component.
 */
export interface AppShellProps {
  /**
   * Additional class names applied to the shell root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: AppShellUi;
  /**
   * Visual size of the component.
   *
   * @default 'md'
   */
  size?: ThemeSize;
  /**
   * Shell skeleton, driving both the layout regions and the menu shape.
   *
   * The **desktop** skeleton: in the mobile view the shell renders the `sidebar`
   * one instead, so the drawer holds one nested tree holding the full menu.
   *
   * @default 'sidebar'
   */
  mode?: AppShellMode;
  /**
   * Side the sidebar is placed on.
   *
   * @default 'left'
   */
  side?: LayoutSide;
  /**
   * The controlled expanded state of the sidebar. Can be bound with `v-model:open`.
   */
  open?: boolean;
  /**
   * The expanded state of the sidebar when initially rendered.
   *
   * @default true
   */
  defaultOpen?: boolean;
  /**
   * The controlled open state of the mobile drawer. Can be bound with `v-model:mobileOpen`.
   *
   * The shell renders the drawer through `SLayout`, where the drawer is the
   * mobile counterpart of the desktop sidebar and carries its own state.
   */
  mobileOpen?: boolean;
  /**
   * The open state of the mobile drawer when it is initially rendered.
   *
   * @default false
   */
  defaultMobileOpen?: boolean;
  /**
   * Whether the shell is in mobile view.
   *
   * When omitted, it is forwarded unset and `SLayout` resolves the mode: a
   * viewport published by a host through `provideViewportContext`, then
   * `useMediaQuery('(max-width: 767.9px)')`. Pass an explicit boolean to force
   * it, e.g. for a server-side detection.
   */
  isMobile?: boolean;
  /**
   * Properties forwarded to `SLayout`.
   *
   * Shell-owned options (`open`, `orientation`, `sidebarVisible`, `isMobile`,
   * `pxToRem`) are derived from `mode`; `sidebarWidth` and
   * `collapsedSidebarWidth` default to the widths the mode requires — override
   * them only when the menu panes do not need to line up.
   */
  layoutProps?: Omit<
    LayoutCompactProps,
    | 'open'
    | 'defaultOpen'
    | 'mobileOpen'
    | 'defaultMobileOpen'
    | 'orientation'
    | 'sidebarVisible'
    | 'isMobile'
    | 'pxToRem'
    | 'class'
  >;
  /**
   * Per-slot class overrides for the internal `SLayout`. Takes precedence over
   * the shell's `layout*` UI slots.
   */
  layoutUi?: Partial<LayoutUi>;
  /**
   * Placement of the brand region.
   *
   * `auto` follows the skeleton the shell renders; `sidebar` and `sidebar-bottom`
   * need a skeleton whose sidebar is always a column of its own — see
   * `AppShellLogoPlacement` for the modes that support the bottom placement. In
   * the mobile view that skeleton is the `sidebar` one, so `auto` puts the brand
   * in the drawer whatever mode is bound.
   *
   * @default 'auto'
   */
  logoPlacement?: AppShellLogoPlacement;
  /**
   * The expand strategy of the rendered menu.
   *
   * - `keep`: keep the current expanded state; manually expanded or collapsed menus are not affected by activating other menus. The collapsible ancestors of the selected menu are expanded on mount and whenever the selected menu changes from outside (e.g. driven by an external route), so it stays visible.
   * - `selected`: only expand the currently selected menu and all its ancestor menus; non-selected menus are collapsed when the selected menu changes.
   *
   * The shell defaults to `selected`: the navigation mirrors the current route,
   * so one path stays expanded and the active entry keeps its place instead of
   * competing with the branches opened earlier in the session.
   *
   * Applies to the single `STreeMenu` (`sidebar` mode) and to the nested vertical
   * panes of `SSplitNav` (the split modes). `top` mode renders `STreeNav`, which
   * has no expand strategy. `menuProps.tree` / `menuProps.split` take precedence
   * over this prop.
   *
   * @default 'selected'
   */
  expandStrategy?: TreeMenuExpandStrategy;
  /**
   * Menu tree rendered by the shell.
   */
  items: AppShellMenuItem[];
  /**
   * The controlled active menu value. Can be bound with `v-model`.
   *
   * The active menu is controlled only: the shell derives the sidebar geometry
   * and the breadcrumb from it before rendering, so it reads the value it is
   * given rather than keeping one of its own.
   */
  modelValue?: string;
  /**
   * Properties forwarded to the rendered menu.
   */
  menuProps?: AppShellMenuProps;
  /**
   * Per-slot class overrides forwarded to the rendered menu.
   */
  menuUi?: AppShellMenuUi;
  /**
   * Breadcrumb items rendered in the header.
   *
   * Omit it to derive the breadcrumb from `items` and the active value: the
   * trail from the root menu down to the active item, where every ancestor
   * whose menu has children opens a dropdown of those children — nested like
   * the menu itself, so an entry that has children keeps its own submenu.
   * Provide it to render a plain breadcrumb from your own data instead.
   */
  breadcrumbs?: BreadcrumbOptionData[];
  /**
   * Whether the breadcrumb region renders when the trail is not empty.
   *
   * The region is hidden below the `md` breakpoint either way: a phone header
   * keeps its trigger and its trailing actions. Bind `ui.breadcrumb` (e.g.
   * `lt-md:flex`) to bring it back there.
   *
   * @default true
   */
  breadcrumbVisible?: boolean;
  /**
   * Properties forwarded to `SBreadcrumb`.
   */
  breadcrumbProps?: Omit<BreadcrumbCompactProps, 'items'>;
  /**
   * Per-slot class overrides for `SBreadcrumb`.
   */
  breadcrumbUi?: Partial<BreadcrumbUi>;
  /**
   * Page tabs rendered in the tab region.
   */
  tabs?: PageTabsOptionData[];
  /**
   * The controlled active tab value. Can be bound with `v-model:tabValue`.
   */
  tabValue?: string;
  /**
   * Properties forwarded to `SPageTabs`.
   */
  tabProps?: Omit<PageTabsCompactProps, 'items' | 'modelValue' | 'defaultValue'>;
  /**
   * Per-slot class overrides for `SPageTabs`.
   */
  tabUi?: Partial<PageTabsUi>;
  /**
   * Whether the sidebar trigger renders in the header.
   *
   * @default true
   */
  triggerVisible?: boolean;
}

/**
 * Events for the AppShell component.
 */
export interface AppShellEmits {
  /**
   * Emitted when the sidebar expanded state changes.
   */
  'update:open': [open: boolean];
  /**
   * Emitted when the mobile drawer open state changes.
   */
  'update:mobileOpen': [open: boolean];
  /**
   * Emitted when the active menu value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when a menu leaf is selected.
   */
  select: [key: string, event?: Event];
  /**
   * Emitted when a menu parent opens its nested pane.
   */
  open: [item: AppShellMenuItem, event?: Event];
  /**
   * Emitted when the active tab changes.
   */
  'update:tabValue': [value: string];
  /**
   * Emitted when the tab collection changes (close, pin, drag reorder).
   */
  'update:tabs': [tabs: PageTabsOptionData[]];
  /**
   * Emitted when a tab is clicked.
   */
  tabClick: [tab: PageTabsOptionData];
  /**
   * Emitted when a tab is closed.
   */
  tabClose: [tab: PageTabsOptionData];
  /**
   * Emitted when a tab is pinned or unpinned.
   */
  tabPin: [tab: PageTabsOptionData];
  /**
   * Emitted when the tab context menu target changes.
   */
  tabContextmenu: [tab: PageTabsOptionData];
  /**
   * Emitted when a tab context menu item is selected.
   */
  tabSelectContextMenu: [menu: PageTabsContextMenuOptionData, tab: PageTabsOptionData];
  /**
   * Emitted when dragging a tab starts.
   */
  tabDragStart: [tab: PageTabsDragEvent];
  /**
   * Emitted while a tab is being dragged.
   */
  tabDragMove: [tab: PageTabsDragEvent];
  /**
   * Emitted when the dragged tab is reordered in place.
   */
  tabDragReorder: [tab: PageTabsDragEvent];
  /**
   * Emitted when dragging a tab ends.
   */
  tabDragEnd: [tab: PageTabsDragEvent];
  /**
   * Emitted when a breadcrumb item is clicked.
   */
  breadcrumbClick: [item: BreadcrumbOptionData];
}

/**
 * Slot properties of the brand slots.
 */
export interface AppShellBrandSlotProps {
  /**
   * Whether the sidebar is collapsed.
   */
  collapsed: boolean;
  /**
   * Region the brand is rendered in.
   */
  placement: AppShellLogoPlacementResolved;
}

/**
 * Slot properties of the menu slot.
 */
export interface AppShellMenuSlotProps {
  /**
   * Shell mode the menu renders for.
   *
   * The mode the host bound, reported as-is: the shell renders the `sidebar`
   * skeleton in the mobile view whatever this says.
   */
  mode: AppShellMode;
  /**
   * Whether the sidebar is collapsed.
   */
  collapsed: boolean;
  /**
   * Collapsed width of the sidebar, in pixels.
   */
  collapsedWidth: number;
  /**
   * Side the sidebar is placed on.
   */
  side: LayoutSide;
  /**
   * Id of the header element the horizontal pane mounts into, when the mode teleports it.
   */
  headerMountId: string | undefined;
  /**
   * Id of the sidebar element the vertical pane mounts into, when the mode teleports it.
   */
  sidebarMountId: string | undefined;
}

/**
 * Slots for the AppShell component.
 */
export interface AppShellSlots {
  /**
   * Custom content for the default slot — the page content.
   */
  default?: () => any;
  /**
   * Custom content for the brand mark.
   *
   * The shell renders it in a cell of its own so the brand lines up with the
   * menu: over the first-level rail of the rail modes, and centered while the
   * sidebar is collapsed. In the sidebar placement of the dual-vertical shapes
   * that cell is the menu's own `top-left` one, so the rail's divider runs
   * through the mark instead of the shell drawing a second one; every other
   * placement renders the region beside the menu. The region renders as soon as
   * this slot is provided; `title` is optional.
   */
  logo?: (props: AppShellBrandSlotProps) => any;
  /**
   * Custom content for the brand title.
   *
   * Rendered next to the mark, and aligned to the sidebar's second (nested pane)
   * column in the rail modes — through the menu's own `top-right` cell in the
   * dual-vertical shapes. It is hidden while the sidebar is collapsed — the
   * column it aligns to is folded away — and in placements that have no pane
   * column to align to.
   */
  title?: (props: AppShellBrandSlotProps) => any;
  /**
   * Custom content rendered at the top of the sidebar.
   */
  'sidebar-start'?: () => any;
  /**
   * Custom content rendered at the bottom of the sidebar.
   */
  'sidebar-end'?: () => any;
  /**
   * Custom content for the menu. Replaces the menu instance, not the mount targets.
   */
  menu?: (props: AppShellMenuSlotProps) => any;
  /**
   * Custom content for the header leading region.
   */
  'header-start'?: () => any;
  /**
   * Custom content for the header center region.
   */
  header?: () => any;
  /**
   * Custom content for the header trailing region.
   */
  'header-end'?: () => any;
  /**
   * Custom content for the breadcrumb region.
   */
  breadcrumb?: (props: { items: BreadcrumbOptionData[] }) => any;
  /**
   * Custom content for the tab region.
   */
  tabs?: () => any;
  /**
   * Custom content for the footer region.
   */
  footer?: () => any;
}
