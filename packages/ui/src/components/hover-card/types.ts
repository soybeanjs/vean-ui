import type {
  HoverCardCompactProps,
  HoverCardCompactEmits,
  HoverCardCompactSlots,
  HoverCardUi
} from '@vean/aria/hover-card';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the HoverCard component.
 */
export interface HoverCardProps extends HoverCardCompactProps {
  /**
   * class of popup
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<HoverCardUi>;
}

/**
 * Events for the HoverCard component.
 */
export type HoverCardEmits = HoverCardCompactEmits;

/**
 * Slots for the HoverCard component.
 */
export type HoverCardSlots = HoverCardCompactSlots;
