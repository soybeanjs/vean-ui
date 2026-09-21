import type { TreeNavCompactProps, TreeNavCompactEmits, TreeNavCompactSlots, TreeNavUi } from '@vean/aria/tree-nav';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the TreeNav component.
 */
export interface TreeNavProps extends TreeNavCompactProps {
  /**
   * class of tree-nav root.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<TreeNavUi>;
}

/**
 * Events for the TreeNav component.
 */
export type TreeNavEmits = TreeNavCompactEmits;

/**
 * Slots for the TreeNav component.
 */
export type TreeNavSlots = TreeNavCompactSlots;
