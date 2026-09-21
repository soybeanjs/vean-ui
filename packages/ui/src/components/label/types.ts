import type { LabelProps as _LabelProps } from '@vean/aria/label';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Label component.
 */
export interface LabelProps extends _LabelProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
}
