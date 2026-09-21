import type { CarouselCompactProps, CarouselCompactEmits, CarouselCompactSlots, CarouselUi } from '@vean/aria/carousel';
import type { ClassValue, DefinedValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Carousel component.
 */
export interface CarouselProps<T extends DefinedValue = DefinedValue> extends CarouselCompactProps<T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CarouselUi>;
  /**
   * The size of the carousel, which determines the spacing and sizing of its elements.
   */
  size?: ThemeSize;
  /**
   * Whether to use floating navigation, which positions the navigation controls outside of the carousel content and allows them to float over the content.
   *
   * This is useful for carousels with a lot of content or when you want to maximize the space available for the slides.
   */
  floatNav?: boolean;
}

/**
 * Events for the Carousel component.
 */
export type CarouselEmits = CarouselCompactEmits;

/**
 * Slots for the Carousel component.
 */
export type CarouselSlots<T extends DefinedValue = DefinedValue> = CarouselCompactSlots<T>;
