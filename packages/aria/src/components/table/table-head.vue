<script setup lang="ts">
import { useTableUi } from './context';
import type { TableHeadProps } from './types';

defineOptions({
  name: 'TableHead'
});

defineProps<TableHeadProps>();

const cls = useTableUi('head');
</script>

<template>
  <th data-vean-table-head :class="cls">
    <slot />
  </th>
</template>
