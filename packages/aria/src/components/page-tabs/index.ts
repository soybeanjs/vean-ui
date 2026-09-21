export { default as PageTabsRoot } from './page-tabs-root.vue';
export { default as PageTabsItem } from './page-tabs-item.vue';
export { default as PageTabsClose } from './page-tabs-close.vue';
export { default as PageTabsPin } from './page-tabs-pin.vue';
export { default as PageTabsCompact } from './page-tabs-compact.vue';

export { providePageTabsUi } from './context';

export type {
  PageTabsRootProps,
  PageTabsRootEmits,
  PageTabsItemProps,
  PageTabsItemEmits,
  PageTabsCloseProps,
  PageTabsPinProps,
  PageTabsOptionData,
  PageTabsState,
  PageTabsDragEvent,
  PageTabsContextMenuOptionData,
  PageTabsCompactProps,
  PageTabsCompactEmits,
  PageTabsCompactItemSlotProps,
  PageTabsCompactSlots,
  PageTabsUiSlot,
  PageTabsUi
} from './types';
