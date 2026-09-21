export { default as LayoutCompact } from './layout-compact.vue';
export { default as LayoutRoot } from './layout-root.vue';
export { default as LayoutSidebar } from './layout-sidebar.vue';
export { default as LayoutRail } from './layout-rail.vue';
export { default as LayoutMain } from './layout-main.vue';
export { default as LayoutHeader } from './layout-header.vue';
export { default as LayoutTab } from './layout-tab.vue';
export { default as LayoutContent } from './layout-content.vue';
export { default as LayoutFooter } from './layout-footer.vue';
export { default as LayoutMobile } from './layout-mobile.vue';
export { default as LayoutPlaceholder } from './layout-placeholder.vue';
export { default as LayoutTrigger } from './layout-trigger.vue';

export { provideLayoutUi } from './context';

export type {
  LayoutCompactProps,
  LayoutCompactEmits,
  LayoutCompactSlots,
  LayoutRootProps,
  LayoutRootEmits,
  LayoutSidebarProps,
  LayoutRailProps,
  LayoutMainProps,
  LayoutHeaderProps,
  LayoutTabProps,
  LayoutContentProps,
  LayoutFooterProps,
  LayoutTriggerProps,
  LayoutMobileProps,
  LayoutPlaceholderProps,
  LayoutVariant,
  LayoutSide,
  LayoutCollapsible,
  LayoutSidebarState,
  LayoutMobileSource,
  LayoutScrollBehavior,
  LayoutUiSlot,
  LayoutUi
} from './types';
