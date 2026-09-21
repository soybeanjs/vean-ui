export { default as TabsRoot } from './tabs-root.vue';
export { default as TabsList } from './tabs-list.vue';
export { default as TabsTrigger } from './tabs-trigger.vue';
export { default as TabsContent } from './tabs-content.vue';
export { default as TabsIndicator } from './tabs-indicator.vue';
export { default as TabsCompact } from './tabs-compact.vue';

export { provideTabsUi } from './context';

export type {
  TabsRootProps,
  TabsRootEmits,
  TabsCompactProps,
  TabsCompactEmits,
  TabsListProps,
  TabsContentProps,
  TabsIndicatorProps,
  TabsTriggerProps,
  TabsOptionData,
  TabsCompactSlots,
  TabsUiSlot,
  TabsUi
} from './types';
