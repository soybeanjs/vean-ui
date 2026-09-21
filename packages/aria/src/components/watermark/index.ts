export { default as WatermarkCompact } from './watermark-compact.vue';
export { default as WatermarkOverlay } from './watermark-overlay.vue';
export { default as WatermarkRoot } from './watermark-root.vue';

export { provideWatermarkUi } from './context';

export type {
  WatermarkCompactProps,
  WatermarkRootProps,
  WatermarkOverlayProps,
  WatermarkUiSlot,
  WatermarkUi
} from './types';
