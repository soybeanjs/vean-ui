import type { ToolbarRootProps as AriaToolbarRootProps, ToolbarUi } from '@vean/aria/toolbar';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Toolbar component.
 */
export interface ToolbarProps extends AriaToolbarRootProps {
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
  ui?: Partial<ToolbarUi>;
}
