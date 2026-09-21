import type { ClassValue } from '@vean/aria/types';
import type { ThemeColor, ThemeSize } from '@/theme';
import type { IconProps } from '../icon/types';

/**
 * Type information for SpinnerIcon.
 */
export type SpinnerIcon = `svg-spinners:${string}`;

/**
 * Properties for the Spinner component.
 */
export interface SpinnerProps extends Omit<IconProps, 'icon' | 'color'> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * The spinner icon name from the Iconify svg-spinners collection.
   *
   * @default 'svg-spinners:270-ring'
   */
  icon?: SpinnerIcon;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
}
