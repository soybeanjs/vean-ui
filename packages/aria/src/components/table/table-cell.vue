<script setup lang="ts">
import { useTableUi } from './context';
import type { TableCellProps } from './types';

defineOptions({
  name: 'TableCell'
});

defineProps<TableCellProps>();

const cls = useTableUi('cell');
</script>

<template>
  <td data-vean-table-cell :class="cls">
    <slot />
  </td>
</template>
