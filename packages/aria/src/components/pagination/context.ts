import { computed } from 'vue';
import { useContext, useUiContext } from '../../composables';
import type { PaginationRootContextParams, PaginationUiSlot } from './types';

export const [providePaginationRootContext, usePaginationRootContext] = useContext(
  'PaginationRoot',
  (params: PaginationRootContextParams) => {
    const { page, total, pageSize } = params;

    const pageCount = computed(() => Math.max(1, Math.ceil(total.value / (pageSize.value || 1))));

    const onPageChange = (value: number) => {
      page.value = value;
    };

    return {
      ...params,
      onPageChange,
      pageCount
    };
  }
);

export const [providePaginationUi, usePaginationUi] = useUiContext<PaginationUiSlot>('PaginationUi');
