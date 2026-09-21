import type { ScrollAreaCompactEmits, ScrollAreaCompactProps, ScrollAreaUi } from '@vean/aria/scroll-area';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the ScrollArea component.
 */
export interface ScrollAreaProps extends ScrollAreaCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ScrollAreaUi>;
  /**
   * Size of the ScrollArea component.
   */
  size?: ThemeSize;
}

/**
 * Events for the ScrollArea component.
 */
export type ScrollAreaEmits = ScrollAreaCompactEmits;
