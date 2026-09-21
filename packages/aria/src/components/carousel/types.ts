import type { ShallowRef } from 'vue';
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import type { BaseProps, DefinedValue, DataOrientation, Direction, VNodeRef, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';

/**
 * Properties for the CarouselRoot component.
 */
export interface CarouselRootProps extends BaseProps {
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
  /**
   * Orientation of the component.
   */
  orientation?: DataOrientation;
  /**
   * Options.
   */
  options?: EmblaOptionsType;
  /**
   * Plugins.
   */
  plugins?: EmblaPluginType[];
}

/**
 * Events for the CarouselRoot component.
 */
export type CarouselRootEmits = {
  /**
   * Emitted when init occurs.
   */
  init: [carousel: EmblaCarouselType];
};

/**
 * Slot properties for the CarouselRoot component.
 */
export interface CarouselRootSlotProps {
  carousel: EmblaCarouselType | undefined;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  progress: number;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number, jump?: boolean) => void;
}

/**
 * Slots for the CarouselRoot component.
 */
export type CarouselRootSlots = {
  default?: (props: CarouselRootSlotProps) => any;
};

/**
 * Properties for the CarouselContent component.
 */
export interface CarouselContentProps extends BaseProps {}

/**
 * Properties for the CarouselContainer component.
 */
export interface CarouselContainerProps extends BaseProps {}

/**
 * Properties for the CarouselItem component.
 */
export interface CarouselItemProps extends BaseProps {}

/**
 * Properties for the CarouselControl component.
 */
export interface CarouselControlProps extends BaseProps {}

/**
 * Properties for the CarouselNavigation component.
 */
export interface CarouselNavigationProps extends BaseProps {}

/**
 * Properties for the CarouselPrevious component.
 */
export interface CarouselPreviousProps extends ButtonProps {}

/**
 * Properties for the CarouselNext component.
 */
export interface CarouselNextProps extends ButtonProps {}

/**
 * Context for the CarouselRoot component.
 */
export interface CarouselRootContext {
  /**
   * Carousel instance used by the component context.
   */
  carousel: ShallowRef<EmblaCarouselType | undefined>;
  /**
   * Whether the component can scroll next.
   */
  canScrollNext: ShallowRef<boolean>;
  /**
   * Whether the component can scroll prev.
   */
  canScrollPrev: ShallowRef<boolean>;
  /**
   * Selected index used by the component context.
   */
  selectedIndex: ShallowRef<number>;
  /**
   * Scroll snaps used by the component context.
   */
  scrollSnaps: ShallowRef<number[]>;
  /**
   * Scroll progress used by the component context.
   *
   * Value is between 0 and 100, representing the percentage of the scroll progress.
   */
  progress: ShallowRef<number>;
  /**
   * Set carousel ref used by the component context.
   */
  setCarouselRef: (node: VNodeRef) => void;
  /**
   * Scroll next used by the component context.
   */
  scrollNext: () => void;
  /**
   * Scroll prev used by the component context.
   */
  scrollPrev: () => void;
  /**
   * Scroll to used by the component context.
   */
  scrollTo: (index: number, jump?: boolean) => void;
}

/**
 * Properties for the CarouselCompact component.
 */
export interface CarouselCompactProps<T extends DefinedValue = DefinedValue> extends CarouselRootProps {
  /**
   * Slides to be rendered in the carousel.
   */
  slides: T[];
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  contentProps?: CarouselContentProps;
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  containerProps?: CarouselContainerProps;
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  itemProps?: CarouselItemProps;
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  controlProps?: CarouselControlProps;
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  navigationProps?: CarouselNavigationProps;
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  previousProps?: CarouselPreviousProps;
  /**
   * Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots.
   */
  nextProps?: CarouselNextProps;
}

/**
 * Events for the CarouselCompact component.
 */
export type CarouselCompactEmits = CarouselRootEmits;

/**
 * Slots for the CarouselCompact component.
 */
export type CarouselCompactSlots<T extends DefinedValue = DefinedValue> = {
  /**
   * Default slot for the carousel component, which can be used to render custom content in the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index.
   */
  item?: (props: CarouselRootSlotProps & { slide: T; index: number; selected: boolean }) => any;
  /**
   * Control slot for the carousel component, which can be used to render custom controls for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index.
   */
  control?: (props: CarouselRootSlotProps) => any;
  /**
   * Navigation slot for the carousel component, which can be used to render custom navigation for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index.
   */
  previous?: (props: CarouselRootSlotProps) => any;
  /**
   * Next slot for the carousel component, which can be used to render custom next controls for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index.
   */
  next?: (props: CarouselRootSlotProps) => any;
};

/**
 * Available UI slots for the Carousel component.
 */
export type CarouselUiSlot = 'root' | 'content' | 'container' | 'item' | 'control' | 'navigation' | 'previous' | 'next';

/**
 * UI class overrides for the Carousel component.
 */
export type CarouselUi = UiClass<CarouselUiSlot>;

export type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType };
