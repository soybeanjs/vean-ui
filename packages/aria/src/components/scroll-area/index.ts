export { default as ScrollAreaRoot } from './scroll-area-root.vue';
export { default as ScrollAreaViewport } from './scroll-area-viewport.vue';
export { default as ScrollAreaScrollbar } from './scroll-area-scrollbar.vue';
export { default as ScrollAreaThumb } from './scroll-area-thumb.vue';
export { default as ScrollAreaCorner } from './scroll-area-corner.vue';
export { default as ScrollAreaCompact } from './scroll-area-compact.vue';

export { provideScrollAreaUi } from './context';

export type {
  ScrollAreaRootProps,
  ScrollAreaCompactProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollAreaRootEmits,
  ScrollAreaCompactEmits,
  ScrollAreaCompactSlots,
  ScrollAreaUiSlot,
  ScrollAreaUi,
  ScrollAreaType,
  ScrollAreaOrientation,
  ScrollAreaState
} from './types';
