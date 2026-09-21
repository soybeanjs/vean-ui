export { default as SliderCompact } from './slider-compact.vue';
export { default as SliderRoot } from './slider-root.vue';
export { default as SliderTrack } from './slider-track.vue';
export { default as SliderRange } from './slider-range.vue';
export { default as SliderThumb } from './slider-thumb.vue';

export { provideSliderUi } from './context';

export type {
  SliderCompactProps,
  SliderCompactEmits,
  SliderCompactSlots,
  SliderCompactSlotProps,
  SliderRootProps,
  SliderRootEmits,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderRootContext,
  SliderSlideDirection,
  SliderThumbAlignment,
  SliderUiSlot,
  SliderUi
} from './types';
