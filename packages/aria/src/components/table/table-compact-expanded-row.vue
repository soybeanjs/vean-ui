<script setup lang="ts">
import { toContext } from '../../shared';
import { useTableCompactExpandedRow } from './hooks';
import TableCell from './table-cell.vue';
import TableRow from './table-row.vue';
import type { TableCompactExpandedRowProps } from './types';

defineOptions({
  name: 'TableCompactExpandedRow'
});

const props = defineProps<TableCompactExpandedRowProps>();

const { visible, expandedRowSlotProps, rowProps, cellProps } = useTableCompactExpandedRow(
  toContext(props, ['row', 'index'])
);
</script>

<template>
  <TableRow v-if="visible" v-bind="rowProps" data-expanded-row :data-level="row.level">
    <TableCell v-bind="cellProps" :colspan="colspan">
      <slot name="expanded-row" v-bind="expandedRowSlotProps" />
    </TableCell>
  </TableRow>
</template>
