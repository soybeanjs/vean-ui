export { default as SplitNavRoot } from './split-nav-root.vue';

export { provideSplitNavUi } from './context';

export { resolveSplitNavSidebarColumns } from './shared';

export type { SplitNavSidebarColumns } from './shared';

export type {
  SplitNavRootProps,
  SplitNavRootEmits,
  SplitNavRootSlots,
  SplitNavMode,
  SplitNavBaseOptionData,
  SplitNavOptionData,
  SplitNavUiSlot,
  SplitNavUi
} from './types';
