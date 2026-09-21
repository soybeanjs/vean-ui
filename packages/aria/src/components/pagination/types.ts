import type { ShallowRef } from 'vue';
import type { BaseProps, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';

/**
 * Properties for the PaginationRoot component.
 */
export interface PaginationRootProps extends BaseProps {
  /** The controlled value of the current page. Can be bound as `v-model:page`. */
  page?: number;
  /**
   * The value of the page that should be active when initially rendered. Use when you do not need to control the value
   * state.
   */
  defaultPage?: number;
  /** Number of items per page */
  pageSize?: number;
  /**
   * The default value of `pageSize` when initially rendered. Use when you do not need to control the value state.
   *
   * @default 10
   */
  defaultPageSize?: number;
  /** Number of items in your list */
  total?: number;
  /** Number of sibling should be shown around the current page */
  siblingCount?: number;
  /** When `true`, prevents the user from interacting with item */
  disabled?: boolean;
  /** When `true`, always show first page, last page, and ellipsis */
  showEdges?: boolean;
}

/**
 * Events for the PaginationRoot component.
 */
export type PaginationRootEmits = {
  /** Event handler called when the page value changes */
  'update:page': [value: number];
  /** Event handler called when the page size value changes */
  'update:pageSize': [value: number];
};

/**
 * Properties for the PaginationList component.
 */
export interface PaginationListProps extends BaseProps {}

/**
 * Properties for the PaginationListItem component.
 */
export interface PaginationListItemProps extends ButtonProps {
  /** Value for the page */
  value: number;
}

/**
 * Properties for the PaginationEllipsis component.
 */
export interface PaginationEllipsisProps extends BaseProps {}

/**
 * Properties for the PaginationButton component.
 */
export interface PaginationButtonProps extends ButtonProps {}

/**
 * Parameters used to create the PaginationRoot context.
 */
export interface PaginationRootContextParams extends ToContext<
  Required<PaginationRootProps>,
  'total' | 'siblingCount' | 'disabled' | 'showEdges'
> {
  /**
   * Page used by the component context.
   */
  page: ShallowRef<number>;
  /**
   * Page size used by the component context.
   */
  pageSize: ShallowRef<number>;
}

/**
 * Type information for PageEllipsis.
 */
export interface PageEllipsis {
  /**
   * Type.
   */
  type: 'ellipsis';
}

/**
 * Type information for PageItem.
 */
export interface PageItem {
  /**
   * Type.
   */
  type: 'page';
  /**
   * Value associated with the current item.
   */
  value: number;
}

/**
 * Type information for Pages.
 */
export type Pages = Array<PageEllipsis | PageItem>;

/**
 * Properties for the PaginationCompact component.
 */
export interface PaginationCompactProps extends PaginationRootProps {
  /**
   * Whether to show a first or last.
   */
  showFirstOrLast?: boolean;
  /**
   * Properties forwarded to the list element.
   */
  listProps?: PaginationListProps;
  /**
   * Properties forwarded to the list item element.
   */
  listItemProps?: PaginationListItemProps;
  /**
   * Properties forwarded to the ellipsis element.
   */
  ellipsisProps?: PaginationEllipsisProps;
  /**
   * Properties forwarded to the first element.
   */
  firstProps?: PaginationButtonProps;
  /**
   * Properties forwarded to the prev element.
   */
  prevProps?: PaginationButtonProps;
  /**
   * Properties forwarded to the next element.
   */
  nextProps?: PaginationButtonProps;
  /**
   * Properties forwarded to the last element.
   */
  lastProps?: PaginationButtonProps;
}

/**
 * Events for the PaginationCompact component.
 */
export type PaginationCompactEmits = PaginationRootEmits;

/**
 * Slots for the PaginationCompact component.
 */
export type PaginationCompactSlots = {
  /**
   * Custom content for the leading slot.
   */
  leading?: () => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: () => any;
  /**
   * Custom content for the first slot.
   */
  first?: () => any;
  /**
   * Custom content for the prev slot.
   */
  prev?: () => any;
  /**
   * Custom content for the next slot.
   */
  next?: () => any;
  /**
   * Custom content for the last slot.
   */
  last?: () => any;
  /**
   * Custom content for the ellipsis slot.
   */
  ellipsis?: () => any;
};

/**
 * Available UI slots for the Pagination component.
 */
export type PaginationUiSlot = 'root' | 'list' | 'listItem' | 'ellipsis' | 'first' | 'prev' | 'next' | 'last';

/**
 * UI class overrides for the Pagination component.
 */
export type PaginationUi = UiClass<PaginationUiSlot>;
