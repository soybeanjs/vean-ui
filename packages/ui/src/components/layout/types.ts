import type {
  LayoutCompactProps,
  LayoutCompactEmits,
  LayoutCompactSlots,
  LayoutUi,
  LayoutVariant,
  LayoutCollapsible,
  LayoutSide,
  LayoutScrollBehavior
} from '@vean/aria/layout';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Layout component.
 */
export interface LayoutProps extends LayoutCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<LayoutUi>;
}

/**
 * Events for the Layout component.
 */
export type LayoutEmits = LayoutCompactEmits;

/**
 * Slots for the Layout component.
 */
export type LayoutSlots = LayoutCompactSlots;

export type { LayoutVariant, LayoutCollapsible, LayoutSide, LayoutScrollBehavior };
