<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { toContext } from '../../shared';
import { useTableCompactExpandedRow } from './hooks';
import { getTableColumnKey } from './columns';
import TableCell from './table-cell.vue';
import TableCompactCell from './table-compact-cell.vue';
import TableRow from './table-row.vue';
import type { TableCompactRowProps, TableCompactEmits, TableRowEventPayload } from './types';

defineOptions({
  name: 'TableCompactRow',
  inheritAttrs: false
});

const props = defineProps<TableCompactRowProps>();

type TableCompactRowEmits = Pick<
  TableCompactEmits,
  'rowClick' | 'rowDblclick' | 'rowContextmenu' | 'rowMouseenter' | 'rowMouseleave'
>;

const emit = defineEmits<TableCompactRowEmits>();

const slots = useSlots();

const { visible, expandedRowSlotProps, rowProps, cellProps } = useTableCompactExpandedRow(
  toContext(props, ['row', 'index'])
);

const slotNames = computed(() => Object.keys(slots));

const rowEventPayload = computed<TableRowEventPayload>(() => ({
  rowData: props.row.row,
  rowKey: props.row.key,
  index: props.index,
  level: props.row.level,
  hasChildren: props.row.hasChildren
}));

const handleRowClick = (event: MouseEvent) => {
  emit('rowClick', event, rowEventPayload.value);
};

const handleRowDblclick = (event: MouseEvent) => {
  emit('rowDblclick', event, rowEventPayload.value);
};

const handleRowContextmenu = (event: MouseEvent) => {
  emit('rowContextmenu', event, rowEventPayload.value);
};

const handleRowMouseenter = (event: MouseEvent) => {
  emit('rowMouseenter', event, rowEventPayload.value);
};

const handleRowMouseleave = (event: MouseEvent) => {
  emit('rowMouseleave', event, rowEventPayload.value);
};
</script>

<template>
  <TableRow
    v-bind="rowProps"
    data-row
    :data-level="row.level"
    @click="handleRowClick"
    @dblclick="handleRowDblclick"
    @contextmenu="handleRowContextmenu"
    @mouseenter="handleRowMouseenter"
    @mouseleave="handleRowMouseleave"
  >
    <template v-for="column in leafColumns" :key="getTableColumnKey(column)">
      <TableCompactCell :column="column" :row="row" :index="index">
        <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </TableCompactCell>
    </template>
  </TableRow>
  <TableRow v-if="visible" v-bind="rowProps" data-expanded-row :data-level="row.level">
    <TableCell v-bind="cellProps" :colspan="leafColumns.length">
      <slot name="expanded-row" v-bind="expandedRowSlotProps" />
    </TableCell>
  </TableRow>
</template>
