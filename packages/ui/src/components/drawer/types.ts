import type { DrawerCompactProps, DrawerCompactEmits, DrawerCompactSlots, DrawerUi } from '@vean/aria/drawer';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Drawer component.
 */
export type DrawerProps = DrawerCompactProps & {
  /**
   * the popup class of the drawer
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<DrawerUi>;
};

/**
 * Events for the Drawer component.
 */
export type DrawerEmits = DrawerCompactEmits;

/**
 * Slots for the Drawer component.
 */
export type DrawerSlots = DrawerCompactSlots;
