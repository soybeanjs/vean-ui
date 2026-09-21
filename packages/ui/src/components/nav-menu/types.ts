import type { NavMenuCompactEmits, NavMenuCompactProps, NavMenuCompactSlots, NavMenuUi } from '@vean/aria/nav-menu';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the NavMenu component.
 */
export interface NavMenuProps extends NavMenuCompactProps {
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
  ui?: Partial<NavMenuUi>;
}

/**
 * Events for the NavMenu component.
 */
export type NavMenuEmits = NavMenuCompactEmits;

/**
 * Slots for the NavMenu component.
 */
export type NavMenuSlots = NavMenuCompactSlots;
