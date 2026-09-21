<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table';
import { toContext } from '../../shared';
import { useTableUi } from './context';
import { useTableCompactCell } from './hooks';
import TableCell from './table-cell.vue';
import type { TableCompactCellProps } from './types';

defineOptions({
  name: 'TableCompactCell'
});

const props = defineProps<TableCompactCellProps>();

const ui = useTableUi();

const {
  bindProps,
  isDataColumn,
  dataCellSlotProps,
  isTreeColumn,
  showInlineTreeToggle,
  treeCellStyle,
  treeToggleSlotProps,
  engineCell,
  hasCellRenderer,
  indexSlotProps,
  selectionSlotProps,
  expandSlotProps
} = useTableCompactCell(toContext(props));
</script>

<template>
  <TableCell v-bind="bindProps">
    <template v-if="isDataColumn && dataCellSlotProps">
      <slot :name="column.id" v-bind="dataCellSlotProps">
        <div v-if="isTreeColumn" :class="ui.treeCell" :style="treeCellStyle">
          <slot v-if="showInlineTreeToggle && row.hasChildren" name="tree-toggle" v-bind="treeToggleSlotProps" />
          <span v-else-if="showInlineTreeToggle" :class="ui.treeTogglePlaceholder" aria-hidden="true" />
          <span>{{ dataCellSlotProps.value }}</span>
        </div>
        <FlexRender v-else-if="hasCellRenderer && engineCell" :cell="engineCell" />
        <template v-else>
          {{ dataCellSlotProps.value }}
        </template>
      </slot>
    </template>
    <slot v-else-if="column.type === 'index'" name="index" v-bind="indexSlotProps">
      {{ indexSlotProps.index + 1 }}
    </slot>
    <slot v-else-if="column.type === 'selection'" name="selection" v-bind="selectionSlotProps" />
    <slot v-else-if="column.type === 'expand'" name="expand" v-bind="expandSlotProps" />
  </TableCell>
</template>
