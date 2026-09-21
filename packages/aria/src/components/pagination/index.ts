export { default as PaginationRoot } from './pagination-root.vue';
export { default as PaginationList } from './pagination-list.vue';
export { default as PaginationListItem } from './pagination-list-item.vue';
export { default as PaginationFirst } from './pagination-first.vue';
export { default as PaginationPrev } from './pagination-prev.vue';
export { default as PaginationNext } from './pagination-next.vue';
export { default as PaginationLast } from './pagination-last.vue';
export { default as PaginationEllipsis } from './pagination-ellipsis.vue';
export { default as PaginationCompact } from './pagination-compact.vue';

export { providePaginationUi } from './context';

export type {
  PaginationRootProps,
  PaginationRootEmits,
  PaginationListProps,
  PaginationListItemProps,
  PaginationEllipsisProps,
  PaginationButtonProps,
  PaginationUiSlot,
  PaginationUi,
  PaginationCompactProps,
  PaginationCompactEmits,
  PaginationCompactSlots
} from './types';
