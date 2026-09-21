import type { SeparatorCompactProps, SeparatorUi } from '@vean/aria/separator';
import type { Align, ClassValue } from '@vean/aria/types';
import type { SeparatorBorder } from '@/styles/separator';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Separator component.
 */
export interface SeparatorProps extends SeparatorCompactProps {
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
  ui?: Partial<SeparatorUi>;
  /**
   * Align.
   */
  align?: Align;
  /**
   * Border.
   */
  border?: SeparatorBorder;
}
