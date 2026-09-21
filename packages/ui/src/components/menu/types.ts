import type { MenuUi } from '@vean/aria/menu';
import type { ClassValue, AlignSide } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the MenuUiBase component.
 */
export interface MenuUiBaseProps {
  /**
   * class of menu popup
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<MenuUi>;
  /**
   * Indicator position.
   */
  indicatorPosition?: AlignSide;
}
