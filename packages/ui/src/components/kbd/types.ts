import type { KbdProps as _KbdProps } from '@vean/aria/kbd';
import type { ClassValue } from '@vean/aria/types';
import type { KbdVariant } from '@/styles/kbd';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Kbd component.
 */
export interface KbdProps extends _KbdProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Visual variant of the component.
   */
  variant?: KbdVariant;
  /**
   * Whether raised.
   */
  raised?: boolean;
}

export type { KbdVariant };
