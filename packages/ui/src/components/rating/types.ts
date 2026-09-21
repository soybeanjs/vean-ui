import type { RatingRootEmits, RatingRootProps as _RatingRootProps } from '@vean/aria/rating';
import type { ClassValue } from '@vean/aria/types';
import type { RatingVariant } from '@/styles/rating';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Rating component.
 */
export interface RatingProps extends _RatingRootProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Visual variant of the component.
   */
  variant?: RatingVariant;
}

/**
 * Events for the Rating component.
 */
export type RatingEmits = RatingRootEmits;

export type { RatingVariant };
