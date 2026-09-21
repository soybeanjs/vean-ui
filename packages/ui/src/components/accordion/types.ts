import type {
  AccordionCompactProps,
  AccordionCompactEmits,
  AccordionCompactSlots,
  AccordionOptionData,
  AccordionUi
} from '@vean/aria/accordion';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Accordion component.
 */
export interface AccordionProps<
  T extends AccordionOptionData = AccordionOptionData,
  M extends boolean = false
> extends AccordionCompactProps<T, M> {
  /**
   * root class
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<AccordionUi>;
}

/**
 * Events for the Accordion component.
 */
export type AccordionEmits<M extends boolean = false> = AccordionCompactEmits<M>;

/**
 * Slots for the Accordion component.
 */
export type AccordionSlots<
  T extends AccordionOptionData = AccordionOptionData,
  M extends boolean = false
> = AccordionCompactSlots<T, M>;
