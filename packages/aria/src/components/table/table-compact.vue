<script
  setup
  lang="ts"
  generic="
    T extends TableBaseData = TableBaseData,
    R extends string | number = string | number,
    M extends boolean = boolean
  "
>
import { computed, useSlots } from 'vue';
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { provideTableCompactContext } from './context';
import {
  useTableCompactData,
  useTableCompactResize,
  useTableCompactState,
  useTableCompactTable,
  useTableCompactVirtual
} from './hooks';
import TableBody from './table-body.vue';
import TableCell from './table-cell.vue';
import TableCompactHead from './table-compact-head.vue';
import TableCompactRow from './table-compact-row.vue';
import TableContent from './table-content.vue';
import TableFooter from './table-footer.vue';
import TableHeader from './table-header.vue';
import TableRoot from './table-root.vue';
import TableRow from './table-row.vue';
import TableScroll from './table-scroll.vue';
import TableVirtualSpacerRow from './table-virtual-spacer-row.vue';
import type {
  TableCompactProps,
  TableBaseData,
  TableCompactEmits,
  TableCompactSlots,
  TableRowEventPayload,
  TableUnifiedKey
} from './types';

defineOptions({
  name: 'TableCompact'
});

const props = withDefaults(defineProps<TableCompactProps<T, R, M>>(), {
  expanded: undefined,
  sorting: undefined,
  sortState: undefined,
  columnFilters: undefined,
  columnPinning: undefined,
  columnSizing: undefined,
  selected: undefined,
  // `ExpandedState` includes the literal `true`, which triggers Vue's Boolean
  // casting for absent props; explicit undefined defaults keep them optional.
  defaultExpanded: undefined,
  defaultSorting: undefined,
  defaultSortState: undefined,
  defaultColumnFilters: undefined,
  defaultColumnPinning: undefined,
  defaultColumnSizing: undefined,
  multiple: () => true as M,
  indent: 16
});

const emit = defineEmits<TableCompactEmits<T, R, M>>();

defineSlots<TableCompactSlots<T>>();

const slots = useSlots();

const slotNames = computed(() => Object.keys(slots) as Array<keyof TableCompactSlots<T>>);

const hasExpandedRowSlot = computed(() => Boolean(slots['expanded-row']));

const contextProps = props as TableCompactProps;

const dir = useDirection(() => props.dir);

const {
  sorting,
  columnFilters,
  expanded,
  columnPinning,
  columnSizing,
  selected,
  multiple,
  onSelectedChange,
  setSelected,
  resetSelected,
  isValueSelected
} = useTableCompactState({
  props: contextProps,
  emit,
  hasExpandedRowSlot
});

const isFiltering = computed(() => columnFilters.value.length > 0);

const visibleExpanded = computed(() => (isFiltering.value ? true : expanded.value));

const { table, columnDefs } = useTableCompactTable({
  props: contextProps,
  sorting,
  columnFilters,
  expanded,
  visibleExpanded,
  columnPinning,
  columnSizing
});

const {
  headerRows,
  leafColumns,
  sourceRows,
  hasTreeRows,
  displayRows,
  visibleRowKeys,
  treeColumnKey,
  hasExpandColumn,
  isHeaderSelectionDisabled,
  headerSelection
} = useTableCompactData({
  props: contextProps,
  table,
  columnDefs,
  visibleExpanded,
  selected
});

const {
  setTableContentRef,
  headCellElements,
  measuredColumnWidths,
  syncMeasuredColumnWidths,
  resizingColumnKey,
  fixedColumnStates
} = useTableCompactResize({
  leafColumns,
  columnSizing
});

const { isVirtual, setTableScrollRef, tableScrollStyle, virtualPaddingStart, virtualPaddingEnd, visibleRows } =
  useTableCompactVirtual({
    ...toContext(contextProps, ['height', 'virtual', 'virtualizerOptions', 'estimateSize']),
    displayRows,
    syncMeasuredColumnWidths
  });

const columnSize = computed(() => Math.max(leafColumns.value.length, 1));
const showEmpty = computed(() => displayRows.value.length === 0);

type TableCompactRowEventHandler = (
  event: MouseEvent,
  payload: TableRowEventPayload<TableBaseData, TableUnifiedKey>
) => void;

const handleRowClick: TableCompactRowEventHandler = (event, payload) => {
  emit('rowClick', event, payload as TableRowEventPayload<T, R>);
};

const handleRowDblclick: TableCompactRowEventHandler = (event, payload) => {
  emit('rowDblclick', event, payload as TableRowEventPayload<T, R>);
};

const handleRowContextmenu: TableCompactRowEventHandler = (event, payload) => {
  emit('rowContextmenu', event, payload as TableRowEventPayload<T, R>);
};

const handleRowMouseenter: TableCompactRowEventHandler = (event, payload) => {
  emit('rowMouseenter', event, payload as TableRowEventPayload<T, R>);
};

const handleRowMouseleave: TableCompactRowEventHandler = (event, payload) => {
  emit('rowMouseleave', event, payload as TableRowEventPayload<T, R>);
};

provideTableCompactContext({
  ...toContext(props, ['indent', 'headProps', 'cellProps', 'rowProps']),
  dir,
  rowKey: props.rowKey as (row: TableBaseData) => TableUnifiedKey,
  table,
  sorting,
  columnFilters,
  expanded,
  visibleExpanded,
  columnPinning,
  columnSizing,
  isFiltering,
  selected,
  multiple,
  onSelectedChange,
  setSelected,
  resetSelected,
  isValueSelected,
  leafColumns,
  sourceRows,
  hasTreeRows,
  treeColumnKey,
  hasExpandColumn,
  hasExpandedRowSlot,
  visibleRowKeys,
  isHeaderSelectionDisabled,
  headerSelection,
  fixedColumnStates,
  resizingColumnKey,
  measuredColumnWidths,
  headCellElements
});

defineExpose({
  /**
   * The TanStack table engine instance (full API: row models, grouping,
   * pagination, selection models, faceted values...).
   */
  table
});
</script>

<template>
  <TableRoot :dir="dir">
    <TableScroll :ref="setTableScrollRef" :style="tableScrollStyle">
      <TableContent :ref="setTableContentRef" v-bind="contentProps">
        <TableHeader v-bind="headerProps">
          <TableRow v-for="(headerRow, headerRowIndex) in headerRows" :key="headerRowIndex" v-bind="rowProps">
            <TableCompactHead v-for="headerCell in headerRow" :key="headerCell.key" :header="headerCell.header">
              <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
              </template>
            </TableCompactHead>
          </TableRow>
        </TableHeader>
        <TableBody v-bind="bodyProps">
          <TableRow v-if="showEmpty" v-bind="rowProps" data-empty-row>
            <TableCell :colspan="columnSize" v-bind="cellProps">
              <slot name="empty" :column-size="columnSize" />
            </TableCell>
          </TableRow>
          <TableVirtualSpacerRow
            v-else
            :is-virtual="isVirtual"
            :colspan="columnSize"
            :padding-start="virtualPaddingStart"
            :padding-end="virtualPaddingEnd"
          >
            <TableCompactRow
              v-for="{ item, index } in visibleRows"
              :key="item.key"
              :row="item"
              :index="index"
              :leaf-columns="leafColumns"
              @row-click="handleRowClick"
              @row-dblclick="handleRowDblclick"
              @row-contextmenu="handleRowContextmenu"
              @row-mouseenter="handleRowMouseenter"
              @row-mouseleave="handleRowMouseleave"
            >
              <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
              </template>
            </TableCompactRow>
          </TableVirtualSpacerRow>
        </TableBody>
        <TableFooter v-if="$slots.footer" v-bind="footerProps">
          <slot name="footer" :column-size="columnSize" />
        </TableFooter>
      </TableContent>
    </TableScroll>
    <slot name="bottom" />
  </TableRoot>
</template>
