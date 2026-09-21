<script setup lang="ts">
import { usePaginationUi } from './context';
import type { PaginationEllipsisProps } from './types';

defineOptions({
  name: 'PaginationEllipsis'
});

defineProps<PaginationEllipsisProps>();

const cls = usePaginationUi('ellipsis');
</script>

<template>
  <div data-vean-pagination-ellipsis :class="cls" data-type="ellipsis">
    <slot>...</slot>
  </div>
</template>
