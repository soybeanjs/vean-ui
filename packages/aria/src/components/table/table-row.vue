<script setup lang="ts">
import { useTableUi } from './context';
import type { TableRowProps } from './types';

defineOptions({
  name: 'TableRow'
});

defineProps<TableRowProps>();

const cls = useTableUi('row');
</script>

<template>
  <tr data-vean-table-row :class="cls">
    <slot />
  </tr>
</template>
