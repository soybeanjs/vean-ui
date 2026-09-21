import type { TooltipCompactEmits, TooltipCompactProps, TooltipCompactSlots, TooltipUi } from '@vean/aria/tooltip';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Tooltip component.
 */
export interface TooltipProps extends TooltipCompactProps {
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
  ui?: Partial<TooltipUi>;
}

/**
 * Events for the Tooltip component.
 */
export type TooltipEmits = TooltipCompactEmits;

/**
 * Slots for the Tooltip component.
 */
export type TooltipSlots = TooltipCompactSlots;
