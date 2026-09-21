export { default as CarouselCompact } from './carousel-compact.vue';
export { default as CarouselRoot } from './carousel-root.vue';
export { default as CarouselContent } from './carousel-content.vue';
export { default as CarouselContainer } from './carousel-container.vue';
export { default as CarouselItem } from './carousel-item.vue';
export { default as CarouselControl } from './carousel-control.vue';
export { default as CarouselNavigation } from './carousel-navigation.vue';
export { default as CarouselNext } from './carousel-next.vue';
export { default as CarouselPrevious } from './carousel-previous.vue';

export { provideCarouselUi } from './context';

export type {
  CarouselCompactProps,
  CarouselCompactEmits,
  CarouselCompactSlots,
  CarouselRootProps,
  CarouselRootEmits,
  CarouselRootSlots,
  CarouselRootSlotProps,
  CarouselContentProps,
  CarouselContainerProps,
  CarouselItemProps,
  CarouselControlProps,
  CarouselNavigationProps,
  CarouselNextProps,
  CarouselPreviousProps,
  CarouselUi,
  CarouselUiSlot,
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType
} from './types';
