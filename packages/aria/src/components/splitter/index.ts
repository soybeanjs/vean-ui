export { default as SplitterGroup } from './splitter-group.vue';
export { default as SplitterPanel } from './splitter-panel.vue';
export { default as SplitterResizeHandle } from './splitter-resize-handle.vue';

export { provideSplitterUi } from './context';

export type {
  SplitterGroupContext,
  SplitterGroupEmits,
  SplitterGroupProps,
  SplitterPanelEmits,
  SplitterPanelProps,
  SplitterResizeHandleEmits,
  SplitterResizeHandleProps,
  SplitterUi,
  SplitterUiSlot
} from './types';
