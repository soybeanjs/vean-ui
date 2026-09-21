import type { MenubarCompactProps, MenubarCompactEmits, MenubarCompactSlots, MenubarUi } from '@vean/aria/menubar';
import type { ClassValue, AlignSide, DefinedValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Menubar component.
 */
export interface MenubarProps<T extends DefinedValue = DefinedValue> extends MenubarCompactProps<T> {
  /**
   * class of menubar root
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<MenubarUi>;
  /**
   * Indicator position.
   */
  indicatorPosition?: AlignSide;
}

/**
 * Events for the Menubar component.
 */
export type MenubarEmits<T extends DefinedValue = DefinedValue> = MenubarCompactEmits<T>;

/**
 * Slots for the Menubar component.
 */
export type MenubarSlots<T extends DefinedValue = DefinedValue> = MenubarCompactSlots<T>;
