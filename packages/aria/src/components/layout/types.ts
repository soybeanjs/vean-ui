import type { ComputedRef, ShallowRef } from 'vue';
import type { BaseProps, DataOrientation, HorizontalSide, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';

/**
 * Type information for LayoutVariant.
 */
export type LayoutVariant = 'sidebar' | 'floating' | 'inset';

/**
 * Type information for LayoutSide.
 */
export type LayoutSide = HorizontalSide;

/**
 * Type information for LayoutCollapsible.
 */
export type LayoutCollapsible = 'offcanvas' | 'icon';

/**
 * State values for LayoutSidebarState.
 */
export type LayoutSidebarState = 'expanded' | 'collapsed';

/**
 * Where the resolved mobile view came from: an explicit host decision, or the
 * viewport itself.
 */
export type LayoutMobileSource = 'explicit' | 'viewport';

/**
 * Properties for the LayoutRoot component.
 */
export interface LayoutRootProps extends BaseProps {
  /** The controlled open state of the layout. Can be bound with `v-model`. */
  open?: boolean;
  /** The open state of the layout when it is initially rendered.
   *
   * Use when you do not need to control its open state.
   */
  defaultOpen?: boolean;
  /** The side of the layout. */
  side?: LayoutSide;
  /** The variant of the layout. */
  variant?: LayoutVariant;
  /** The collapsible state of the layout. */
  collapsible?: LayoutCollapsible;
  /**
   * whether to show the sidebar.
   *
   * @default true
   */
  sidebarVisible?: boolean;
  /**
   * The width of the sidebar. (px)
   *
   * @default 240
   */
  sidebarWidth?: number;
  /**
   * The width of the sidebar when it is collapsed. (px)
   *
   * @default 50
   */
  collapsedSidebarWidth?: number;
  /**
   * Whether the layout is in mobile view.
   *
   * Resolution order: this prop, then a host viewport decision provided through
   * `provideViewportContext` (a simulated viewport — a device frame, an embedded
   * shell), then `useMediaQuery(mobileViewportQuery)` — the same breakpoint the
   * styled desktop sidebar is hidden at. Pass an explicit boolean to force the
   * mode (e.g. a server-side detection); `false` re-enables the inline sidebar
   * even below the breakpoint.
   */
  isMobile?: boolean;
  /**
   * The controlled open state of the mobile drawer. Can be bound with
   * `v-model:mobileOpen`.
   *
   * Kept apart from `open`, which drives the desktop sidebar: on mobile the
   * inline sidebar is replaced by a drawer, so the two states never apply at the
   * same time.
   */
  mobileOpen?: boolean;
  /**
   * The open state of the mobile drawer when it is initially rendered.
   *
   * @default false
   */
  defaultMobileOpen?: boolean;
  /**
   * The width of the sidebar in the mobile view. (px)
   *
   * @default 240
   */
  mobileSidebarWidth?: number;
  /**
   * whether to show the header.
   *
   * @default true
   */
  headerVisible?: boolean;
  /**
   * The height of the header. (px)
   * @default 56
   */
  headerHeight?: number;
  /**
   * whether to show the tab.
   *
   * @default true
   */
  tabVisible?: boolean;
  /**
   * The height of the tab. (px)
   * @default 44
   */
  tabHeight?: number;
  /**
   * whether to show the footer.
   *
   * @default true
   */
  footerVisible?: boolean;
  /**
   * The height of the footer. (px)
   * @default 48
   */
  footerHeight?: number;
  /**
   * whether the content takes the full height of the layout (include).
   *
   * @default false
   */
  fullContent?: boolean;
  /**
   * The function to convert pixels to rem.
   *
   * @param px - The width in pixels
   * @default (px: number) => px / 16 (16 is the base font size)
   * @returns The width in rem
   */
  pxToRem?: (px: number) => number;
  /**
   * Orientation of the component.
   */
  orientation?: DataOrientation;
  /**
   * Scroll behavior.
   */
  scrollBehavior?: LayoutScrollBehavior;
  /**
   * Scroll id.
   */
  scrollId?: string;
  /**
   * The base z-index of the layout. The z-index of the sidebar, header, tab, footer, and their fixed versions will be calculated based on this value.
   *
   * @default 50
   */
  baseZIndex?: number;
  /**
   * Whether the header and tab are fixed to the top of the layout when the orientation is vertical. If true, the header and tab will be fixed to the top of the layout when the orientation is vertical, and will scroll with the content when the orientation is horizontal.
   *
   * @default true
   */
  fixedTop?: boolean;
  /**
   * Whether footer is fixed
   *
   * @default true
   */
  fixedFooter?: boolean;
  /**
   * Whether the footer should stretch to the full width of the layout or the content when layout orientation is vertical.
   *
   * @default true
   */
  stretchFooter?: boolean;
}

/**
 * Events for the LayoutRoot component.
 */
export type LayoutRootEmits = {
  /**
   * Emitted when the open state changes.
   */
  'update:open': [open: boolean];
  /**
   * Emitted when the mobile drawer open state changes.
   */
  'update:mobileOpen': [open: boolean];
};

/**
 * Properties for the LayoutSidebar component.
 */
export interface LayoutSidebarProps extends BaseProps {}

/**
 * Properties for the LayoutRail component.
 */
export interface LayoutRailProps extends BaseProps {}

/**
 * Properties for the LayoutMain component.
 */
export interface LayoutMainProps extends BaseProps {}

/**
 * Properties for the LayoutHeader component.
 */
export interface LayoutHeaderProps extends BaseProps {}

/**
 * Properties for the LayoutTab component.
 */
export interface LayoutTabProps extends BaseProps {}

/**
 * Properties for the LayoutContent component.
 */
export interface LayoutContentProps extends BaseProps {}

/**
 * Properties for the LayoutFooter component.
 */
export interface LayoutFooterProps extends BaseProps {}

/**
 * Properties for the LayoutTrigger component.
 */
export interface LayoutTriggerProps extends ButtonProps {}

/**
 * Properties for the LayoutMobile component.
 */
export interface LayoutMobileProps extends BaseProps {}

/**
 * Properties for the LayoutPlaceholder component.
 */
export interface LayoutPlaceholderProps {
  /**
   * Which region the placeholder reserves space for.
   */
  type: 'header' | 'tab' | 'footer';
}

/**
 * Properties for the Layout Others component.
 */
interface LayoutOthersProps {
  sidebarProps?: LayoutSidebarProps;
  railProps?: LayoutRailProps;
  mainProps?: LayoutMainProps;
  headerProps?: LayoutHeaderProps;
  tabProps?: LayoutTabProps;
  contentProps?: LayoutContentProps;
  footerProps?: LayoutFooterProps;
  mobileProps?: LayoutMobileProps;
}

/**
 * Properties for the LayoutCompact component.
 */
export interface LayoutCompactProps extends LayoutRootProps, LayoutOthersProps {}

/**
 * Events for the LayoutCompact component.
 */
export type LayoutCompactEmits = LayoutRootEmits;

/**
 * Slots for the LayoutCompact component.
 */
export type LayoutCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the sidebar slot.
   *
   * `collapsed` is the mode-aware state to render from: it is `false` on mobile,
   * where the sidebar is a drawer that always shows the expanded navigation, so a
   * collapse chosen on desktop does not follow the content into the drawer.
   * `open` still reports the desktop state.
   */
  sidebar?: (props: { open: boolean | undefined; collapsedSidebarWidth: number; collapsed: boolean }) => any;
  /**
   * Custom content for the header slot.
   */
  header?: () => any;
  /**
   * Custom content for the tab slot.
   */
  tab?: () => any;
  /**
   * Custom content for the content slot.
   */
  content?: () => any;
  /**
   * Custom content for the footer slot.
   */
  footer?: () => any;
};

/**
 * Type information for LayoutScrollBehavior.
 */
export type LayoutScrollBehavior = 'wrapper' | 'content';

/**
 * Parameters used to create the LayoutRoot context.
 */
export interface LayoutRootContextParams extends ToContext<
  LayoutRootProps,
  | 'sidebarWidth'
  | 'collapsedSidebarWidth'
  | 'sidebarVisible'
  | 'headerVisible'
  | 'tabVisible'
  | 'footerVisible'
  | 'fixedFooter'
> {
  /**
   * Whether the layout is in its mobile view — the `isMobile` prop, a provided
   * host viewport, or the viewport when neither is available.
   */
  isMobile: ComputedRef<boolean>;
  /**
   * Where the resolved mobile view came from. `viewport` keeps the styled layer's
   * `lt-md` fallback in charge; `explicit` means a host asked for that mode, so an
   * explicit desktop mode below the breakpoint keeps its inline sidebar.
   */
  isMobileSource: ComputedRef<LayoutMobileSource>;
  /**
   * Whether the component is open.
   */
  open: ShallowRef<boolean | undefined>;
  /**
   * Whether mobile open.
   */
  mobileOpen: ShallowRef<boolean | undefined>;
  /**
   * The width of the sidebar in the mobile view. (rem)
   */
  mobileSidebarWidth: ComputedRef<number>;
  /**
   * The height of the header band, in rem.
   *
   * The mobile drawer is teleported out of the root, where custom properties stop
   * inheriting, so it re-publishes this to keep the header height readable by the
   * sidebar content it portals.
   */
  headerHeightRem: ComputedRef<number>;
  /**
   * Whether fixed top.
   */
  fixedTop: ComputedRef<boolean>;
}

/**
 * Available UI slots for the Layout component.
 */
export type LayoutUiSlot =
  | 'root'
  | 'sidebar'
  | 'sidebarRoot'
  | 'sidebarWrapper'
  | 'sidebarGapHandler'
  | 'main'
  | 'header'
  | 'tab'
  | 'content'
  | 'footer'
  | 'rail'
  | 'trigger'
  | 'mobile'
  | 'mobileDrawer'
  | 'mobileOverlay'
  | 'headerPlaceholder'
  | 'tabPlaceholder'
  | 'footerPlaceholder';

/**
 * UI class overrides for the Layout component.
 */
export type LayoutUi = UiClass<LayoutUiSlot>;
