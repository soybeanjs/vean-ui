<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { toContext } from '../../shared';
import { useControllableState, useIsMobile } from '../../composables';
import { layoutCssVars } from './shared';
import { provideLayoutRootContext, useLayoutUi } from './context';
import type { LayoutMobileSource, LayoutRootProps, LayoutRootEmits, LayoutSidebarState } from './types';

defineOptions({
  name: 'LayoutRoot'
});

const props = withDefaults(defineProps<LayoutRootProps>(), {
  open: undefined,
  defaultOpen: true,
  orientation: 'horizontal',
  baseZIndex: 50,
  scrollBehavior: 'content',
  side: 'left',
  variant: 'sidebar',
  collapsible: 'icon',
  sidebarVisible: true,
  sidebarWidth: 240,
  collapsedSidebarWidth: 50,
  isMobile: undefined,
  mobileOpen: undefined,
  defaultMobileOpen: false,
  mobileSidebarWidth: 240,
  headerVisible: true,
  headerHeight: 56,
  tabVisible: true,
  tabHeight: 44,
  footerVisible: true,
  footerHeight: 48,
  fixedTop: true,
  pxToRem: (px: number) => px / 16
});

const emit = defineEmits<LayoutRootEmits>();

const cls = useLayoutUi('root');

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const mobileOpen = useControllableState(
  () => props.mobileOpen,
  value => {
    emit('update:mobileOpen', value);
  },
  props.defaultMobileOpen
);

const sidebarState = computed<LayoutSidebarState>(() => (open.value ? 'expanded' : 'collapsed'));

const dataCollapsible = computed(() => (sidebarState.value === 'collapsed' ? props.collapsible : ''));

const isHorizontal = computed(() => props.orientation === 'horizontal');
const isVertical = computed(() => props.orientation === 'vertical');

const fixedTop = computed(() => isVertical.value || props.scrollBehavior === 'content' || Boolean(props.fixedTop));
const fixedFooter = computed(() => props.scrollBehavior === 'content' || Boolean(props.fixedFooter));
const stretchFooter = computed(() => fixedFooter.value && props.stretchFooter);
const isOffcanvas = computed(() => props.collapsible === 'offcanvas');

/**
 * Whether the component is in its mobile view, and where that decision came from.
 *
 * Resolution order: the explicit `isMobile` prop, then a viewport a host
 * simulated through `provideViewportContext` (a device frame, an embedded
 * shell), then the real viewport. `undefined` at every level means "no opinion",
 * which is what keeps the styled `lt-md` fallback in charge. The chain is shared
 * with everything that has to agree on the view — see `useIsMobile`.
 */
const { isMobile, hostIsMobile } = useIsMobile(() => props.isMobile);

/**
 * Where the resolved mode came from.
 *
 * The styled layer hides the inline sidebar below the breakpoint through `lt-md`
 * so a phone never paints the desktop sidebar before hydration. That fallback
 * must not override a host that explicitly asked for the desktop mode, so the
 * source is published for the recipe to read.
 */
const isMobileSource = computed<LayoutMobileSource>(() => (hostIsMobile.value === undefined ? 'viewport' : 'explicit'));

/**
 * Whether the sidebar occupies layout flow.
 *
 * On mobile the sidebar is rendered as a `Dialog`-based drawer that is teleported
 * out of the layout, so it reserves no space: every sidebar-derived offset
 * collapses to zero and the sidebar region spans the full layout height.
 */
const hasInlineSidebar = computed(() => props.sidebarVisible && !isMobile.value);

/**
 * Whether the sidebar content renders collapsed in the current mode.
 *
 * Collapsing is a desktop affordance: on mobile the sidebar becomes a drawer that
 * always shows the expanded navigation, so a collapse picked on desktop must not
 * follow the content into it. `open` keeps holding the desktop state, so the
 * collapse is back the moment the mode returns to desktop.
 */
const collapsed = computed(() => !isMobile.value && !open.value);

/**
 * Height of the header band, in rem.
 *
 * Published as a context value on top of the inline style: the mobile drawer is
 * teleported out of this element, so it has to re-declare the geometry its
 * content reads instead of inheriting it.
 */
const headerHeightRem = computed(() => props.pxToRem(props.headerHeight));

/**
 * Width the sidebar column declares for itself, in rem.
 *
 * The styled wrapper is sized from it — `floating`/`inset` widen it by a spacing
 * of their own padding — so a host that resolves the sidebar to no column at all
 * declares `sidebarWidth: 0` here: the `SAppShell` split modes ask the split-nav
 * family which panes exist and get none for a first-level leaf.
 */
const sidebarWidthRem = computed(() => props.pxToRem(props.sidebarWidth));

/**
 * Whether the sidebar column takes part in the layout.
 *
 * The styled layer paints that wrapper and adds its padding to the start gaps, so
 * both have to stand down for a column with no width of its own: rendering it
 * anyway left a padded strip carrying the card's border and shadow, and indented
 * the content by a spacing no column occupied. Published as `data-sidebar-flow`,
 * apart from `data-sidebar-visible`, because the region still renders — its mount
 * targets have to stay in the tree — while the column itself has nothing to show.
 */
const isSidebarInFlow = computed(() => hasInlineSidebar.value && sidebarWidthRem.value > 0);

const style = computed<CSSProperties>(() => {
  const sidebarWidth = sidebarWidthRem.value;
  const collapsedSidebarWidth = isOffcanvas.value ? '0' : props.pxToRem(props.collapsedSidebarWidth);
  const currentSidebarWidth = open.value ? sidebarWidth : collapsedSidebarWidth;

  const headerHeight = headerHeightRem.value;
  const tabHeight = props.pxToRem(props.tabHeight);
  const footerHeight = props.pxToRem(props.footerHeight);

  const startGap = hasInlineSidebar.value ? `${currentSidebarWidth}rem` : '0px';
  const headerStartGap = isHorizontal.value ? startGap : '0px';
  const footerStartGap = hasFooterStartGap() ? startGap : '0px';
  const sidebarTopGap =
    hasInlineSidebar.value && props.headerVisible && !isHorizontal.value ? `${headerHeight}rem` : '0px';
  const sidebarBottomGap =
    hasInlineSidebar.value && props.footerVisible && footerStartGap === '0px' ? `${footerHeight}rem` : '0px';
  const sidebarHeight =
    sidebarTopGap === '0px' && sidebarBottomGap === '0px'
      ? '100%'
      : `calc(100% - ${sidebarTopGap} - ${sidebarBottomGap})`;

  const siderZIndex = isHorizontal.value ? props.baseZIndex - 2 : props.baseZIndex - 5;
  const headerZIndex = props.baseZIndex - 4;
  const tabZIndex = props.baseZIndex - 6;
  const footerZIndex = sidebarBottomGap ? siderZIndex + 1 : siderZIndex - 6;

  return {
    [layoutCssVars.sidebarWidth]: `${sidebarWidth}rem`,
    [layoutCssVars.collapsedSidebarWidth]: `${collapsedSidebarWidth}rem`,
    [layoutCssVars.currentSidebarWidth]: `${currentSidebarWidth}rem`,
    [layoutCssVars.baseZIndex]: props.baseZIndex,
    [layoutCssVars.headerHeight]: `${headerHeight}rem`,
    [layoutCssVars.tabHeight]: `${tabHeight}rem`,
    [layoutCssVars.footerHeight]: `${footerHeight}rem`,
    [layoutCssVars.sidebarTopGap]: sidebarTopGap,
    [layoutCssVars.sidebarBottomGap]: sidebarBottomGap,
    [layoutCssVars.sidebarHeight]: sidebarHeight,
    [layoutCssVars.startGap]: startGap,
    [layoutCssVars.headerStartGap]: headerStartGap,
    [layoutCssVars.footerStartGap]: footerStartGap,
    [layoutCssVars.sidebarZIndex]: siderZIndex,
    [layoutCssVars.headerZIndex]: headerZIndex,
    [layoutCssVars.tabZIndex]: tabZIndex,
    [layoutCssVars.footerZIndex]: footerZIndex
  };
});

function hasFooterStartGap() {
  if (isHorizontal.value) {
    return true;
  }
  if (props.scrollBehavior === 'wrapper' && !fixedFooter.value) {
    return true;
  }

  return !stretchFooter.value;
}

const mobileSidebarWidth = computed(() => props.pxToRem(props.mobileSidebarWidth));

provideLayoutRootContext({
  ...toContext(props, [
    'sidebarWidth',
    'collapsedSidebarWidth',
    'sidebarVisible',
    'headerVisible',
    'tabVisible',
    'footerVisible'
  ]),
  isMobile,
  isMobileSource,
  open,
  mobileOpen,
  mobileSidebarWidth,
  headerHeightRem,
  fixedTop,
  fixedFooter
});
</script>

<template>
  <div
    data-vean-layout-root
    :class="cls"
    :data-collapsible="dataCollapsible"
    :data-orientation="orientation"
    :data-side="side"
    :data-state="sidebarState"
    :data-variant="variant"
    :data-mobile="Boolean(isMobile)"
    :data-mobile-source="isMobileSource"
    :data-scroll-behavior="scrollBehavior"
    :data-full-content="Boolean(fullContent)"
    :data-sidebar-visible="Boolean(sidebarVisible)"
    :data-sidebar-flow="Boolean(isSidebarInFlow)"
    :data-header-visible="Boolean(headerVisible)"
    :data-tab-visible="Boolean(tabVisible)"
    :data-footer-visible="Boolean(footerVisible)"
    :data-fixed-top="Boolean(fixedTop)"
    :data-fixed-footer="Boolean(fixedFooter)"
    :data-stretch-footer="Boolean(stretchFooter)"
    :style="style"
  >
    <slot :open="open" :collapsed-sidebar-width="collapsedSidebarWidth" :collapsed="collapsed" />
  </div>
</template>
