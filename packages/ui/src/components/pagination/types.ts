import type {
  PaginationCompactProps,
  PaginationCompactEmits,
  PaginationCompactSlots,
  PaginationUi
} from '@vean/aria/pagination';
import type { ClassValue } from '@vean/aria/types';
import type { PaginationShape, PaginationVariant } from '@/styles/pagination';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Pagination component.
 */
export interface PaginationProps extends PaginationCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /** The custom ui class names */
  ui?: Partial<PaginationUi>;
  /** The size of the pagination */
  size?: ThemeSize;
  /** The variant of the pagination */
  variant?: PaginationVariant;
  /** The shape of the pagination */
  shape?: PaginationShape;
  /** Whether the first/prev/next/last action buttons also use the `variant` styling, which otherwise only paints the current page */
  actionVariant?: boolean;
}

/**
 * Events for the Pagination component.
 */
export type PaginationEmits = PaginationCompactEmits;

/**
 * Slots for the Pagination component.
 */
export type PaginationSlots = PaginationCompactSlots;
