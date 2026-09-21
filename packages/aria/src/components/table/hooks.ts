import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, toValue, watch, mergeProps } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue';
import { useEventListener, useResizeObserver } from '@vueuse/core';
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  SortingState,
  Updater
} from '@tanstack/table-core';
import { useTable } from '@tanstack/vue-table';
import { getElFromTemplateRef, getMergedRefsValue, pick } from '../../shared';
import { useControllableState, useForwardElement, useSelection } from '../../composables';
import { useLocaleMessages } from '../../locale';
import type { CheckedState, VNodeRef, ToContext } from '../../types';
import {
  collectTableExpandableKeys,
  getTableAriaSort,
  getTableCellStyle,
  getTableColumnFilterEntry,
  getTableColumnFilterValue,
  getTableColumnFilterValues,
  getTableColumnResizeMinWidth,
  getTableFixedColumnOffsets,
  getTableHeaderFixedState,
  getTableHeaderRows,
  getTableHeaderSelectionState,
  getTableLeafFixedState,
  getTableMeasuredColumnWidth,
  getTableMeasuredColumnWidths,
  getNextTableColumnSizing,
  getNextTableKeyboardResizeWidth,
  getNextTablePointerResizeWidth,
  getTableResizeHandleLabel,
  getTableResolvedHeight,
  getTableRowChildren,
  getTableRowExpandLabel,
  getTableRowLabel,
  getTableRowValueByPath,
  getTableScrollStyle,
  getTableSelectRowLabel,
  getTableSortButtonLabel,
  getTableTreeCellStyle,
  getTableTreeColumnKey,
  getTableVirtualMeasurements,
  getTableVirtualPaddingEnd,
  getTableVirtualPaddingStart,
  getTableVirtualRange,
  getTableVisibleRows,
  isTableColumnFiltered,
  isTableRowExpanded,
  isTableTreeColumn,
  setTableColumnFilterEntry,
  shouldRenderTableExpandedRow,
  shouldShowTableInlineTreeToggle,
  toTableExpandedState,
  toggleTableExpandedState,
  toggleTableFilterOption,
  isTableFilterOptionSelected
} from './shared';
import { useTableCompactContext, useTableUi } from './context';
import {
  getTableAlign,
  getTableColumnFilterOptions,
  getTableColumnKey,
  getTableColumnLabel,
  getTablePinningFromColumns,
  isTableDataColumn,
  normalizeTableColumns,
  normalizeTableFilterValue
} from './columns';
import { soybeanTableFeatures } from './features';
import type { SoybeanTableFeatures } from './features';
import type {
  TableBaseData,
  TableCellSlotProps,
  TableColumn,
  TableEngineColumn,
  TableCompactEmits,
  TableCompactHeadProps,
  TableCompactProps,
  TableDataCellSlotProps,
  TableEngineTable,
  TableExpandSlotProps,
  TableEngineOptions,
  TableFilterValue,
  TableHeaderFilterSlotProps,
  TableHeaderResizeSlotProps,
  TableHeaderSelectionSlotProps,
  TableHeaderSlotProps,
  TableHeaderSortSlotProps,
  TableIndexSlotProps,
  TableSelectionSlotProps,
  TableTreeRow,
  TableTreeToggleSlotProps,
  TableVisibleRow,
  TableUnifiedKey
} from './types';

type TableCompactEmitFn<
  T extends TableBaseData = TableBaseData,
  R extends string | number = string | number,
  M extends boolean = boolean
> = <K extends keyof TableCompactEmits<T, R, M>>(event: K, ...args: TableCompactEmits<T, R, M>[K]) => void;

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(previous) : updater;
}

/**
 * Convert user `tableOptions` into per-key computed entries so the engine
 * adapter tracks each field reactively. Keys owned by the component are
 * overridden later by the component's own option entries.
 */
function toReactiveTableOptions(options: TableEngineOptions | undefined): Record<string, unknown> {
  if (!options) {
    return {};
  }

  return Object.fromEntries(
    (Object.keys(options) as Array<keyof TableEngineOptions>).map(key => [key, computed(() => options[key])])
  );
}

function getColumnWidthValue(column: TableColumn, columnSizing: ColumnSizingState): number | undefined {
  const key = getTableColumnKey(column);

  return columnSizing[key] ?? (typeof column.size === 'number' ? column.size : undefined);
}

function readRowValueByColumn<T extends TableBaseData>(row: T, column: TableColumn<T>): unknown {
  const rawColumn = column as TableColumn<T> & { accessorKey?: string };

  return typeof rawColumn.accessorKey === 'string' ? getTableRowValueByPath(row, rawColumn.accessorKey) : undefined;
}

function readCellValue(row: TableTreeRow, column: TableColumn): unknown {
  return row.sourceRow.getValue(getTableColumnKey(column));
}

interface UseTableCompactStateOptions<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = boolean
> {
  props: TableCompactProps<T, R, M>;
  emit: TableCompactEmitFn<T, R, M>;
  hasExpandedRowSlot: MaybeRefOrGetter<boolean>;
}

export function useTableCompactState<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = boolean
>(options: UseTableCompactStateOptions<T, R, M>) {
  const { props, emit, hasExpandedRowSlot } = options;

  const sorting = useControllableState<SortingState | undefined, true>(
    () => props.sorting,
    value => {
      emit('update:sorting', value ?? []);
    },
    props.defaultSorting ?? [],
    true
  ) as ShallowRef<SortingState>;

  const columnFilters = useControllableState<ColumnFiltersState | undefined, true>(
    () => props.columnFilters,
    value => {
      emit('update:columnFilters', value ?? []);
    },
    props.defaultColumnFilters ?? [],
    true
  ) as ShallowRef<ColumnFiltersState>;

  const defaultExpanded = computed<ExpandedState>(() => {
    if (!props.defaultExpandAll) {
      return props.defaultExpanded ?? {};
    }

    const keys = collectTableExpandableKeys(
      props.data,
      row => String(props.rowKey(row)),
      props.getChildren,
      Boolean(toValue(hasExpandedRowSlot))
    );

    return toTableExpandedState(keys);
  });

  const expanded = useControllableState<ExpandedState | undefined, true>(
    () => props.expanded,
    value => {
      emit('update:expanded', value ?? {});
    },
    defaultExpanded.value,
    true
  ) as ShallowRef<ExpandedState>;

  watch(defaultExpanded, value => {
    if (props.expanded === undefined && props.defaultExpandAll) {
      expanded.value = value;
    }
  });

  const defaultColumnPinning = computed<ColumnPinningState | undefined>(
    () => props.defaultColumnPinning ?? getTablePinningFromColumns(props.columns)
  );

  const columnPinning = useControllableState<ColumnPinningState | undefined, true>(
    () => props.columnPinning,
    value => {
      emit('update:columnPinning', value ?? { start: [], end: [] });
    },
    defaultColumnPinning.value ?? { start: [], end: [] },
    true
  ) as ShallowRef<ColumnPinningState>;

  const columnSizing = useControllableState<ColumnSizingState | undefined, true>(
    () => props.columnSizing,
    value => {
      emit('update:columnSizing', value ?? {});
    },
    props.defaultColumnSizing ?? {},
    true
  ) as ShallowRef<ColumnSizingState>;

  const {
    modelValue: selected,
    onModelValueChange: onSelectedChange,
    setModelValue: setSelected,
    resetModelValue: resetSelected,
    isMultiple: multiple,
    isValueSelected
  } = useSelection(
    computed(() => ({
      modelValue: props.selected,
      defaultValue: props.defaultSelected,
      multiple: props.multiple
    })),
    value => {
      emit('update:selected', value);
    }
  );

  return {
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
  };
}

interface UseTableCompactTableOptions<T extends TableBaseData = TableBaseData> {
  props: TableCompactProps<T, string | number, boolean>;
  sorting: ShallowRef<SortingState>;
  columnFilters: ShallowRef<ColumnFiltersState>;
  expanded: ShallowRef<ExpandedState>;
  visibleExpanded: ComputedRef<ExpandedState>;
  columnPinning: ShallowRef<ColumnPinningState>;
  columnSizing: ShallowRef<ColumnSizingState>;
}

export interface UseTableCompactTableResult<T extends TableBaseData = TableBaseData> {
  table: TableEngineTable<T>;
  /**
   * Normalized (engine-ready) column definitions keyed by column id. The
   * engine's `column.columnDef` is a defaults-merged resolution, so the
   * original definitions are kept here for rendering and slot scopes.
   */
  columnDefs: ComputedRef<Map<string, TableColumn<T>>>;
}

export function useTableCompactTable<T extends TableBaseData = TableBaseData>(
  options: UseTableCompactTableOptions<T>
): UseTableCompactTableResult<T> {
  const { props, sorting, columnFilters, expanded, visibleExpanded, columnPinning, columnSizing } = options;

  const columns = computed(() => normalizeTableColumns(props.columns));

  const columnDefs = computed(() => new Map(columns.value.map(column => [getTableColumnKey(column), column])));

  const table = useTable<SoybeanTableFeatures, T>({
    ...toReactiveTableOptions(props.tableOptions),
    features: soybeanTableFeatures,
    data: computed(() => props.data),
    columns: columns as unknown as ComputedRef<ColumnDef<SoybeanTableFeatures, T, unknown>[]>,
    getRowId: row => String(props.rowKey(row)),
    getSubRows: row => getTableRowChildren(row, props.getChildren),
    filterFromLeafRows: true,
    sortDescFirst: false,
    autoResetExpanded: false,
    state: computed(() => ({
      sorting: sorting.value,
      columnFilters: columnFilters.value,
      expanded: visibleExpanded.value,
      columnPinning: columnPinning.value,
      columnSizing: columnSizing.value
    })),
    onSortingChange: updater => {
      sorting.value = resolveUpdater(updater, sorting.value);
    },
    onColumnFiltersChange: updater => {
      columnFilters.value = resolveUpdater(updater, columnFilters.value);
    },
    onExpandedChange: updater => {
      expanded.value = resolveUpdater(updater, expanded.value);
    },
    onColumnPinningChange: updater => {
      columnPinning.value = resolveUpdater(updater, columnPinning.value);
    },
    onColumnSizingChange: updater => {
      columnSizing.value = resolveUpdater(updater, columnSizing.value);
    }
  });

  return { table, columnDefs };
}

interface UseTableCompactDataOptions<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = boolean
> {
  props: TableCompactProps<T, R, M>;
  table: TableEngineTable<T>;
  columnDefs: ComputedRef<Map<string, TableColumn<T>>>;
  visibleExpanded: ComputedRef<ExpandedState>;
  selected: ShallowRef<TableUnifiedKey[] | TableUnifiedKey | undefined>;
}

export function useTableCompactData<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = boolean
>(options: UseTableCompactDataOptions<T, R, M>) {
  const { props, table, columnDefs, visibleExpanded, selected } = options;

  const headerRows = computed(() =>
    getTableHeaderRows<T>(table.getHeaderGroups(), engineColumn => {
      const originalDef = columnDefs.value.get(engineColumn.id ?? '');

      return (originalDef ?? engineColumn.columnDef) as TableColumn<T>;
    })
  );

  const leafColumns = computed(() =>
    table
      .getVisibleLeafColumns()
      .map(engineColumn => columnDefs.value.get(engineColumn.id) ?? (engineColumn.columnDef as TableColumn<T>))
  );

  const sourceRows = computed(() => table.getCoreRowModel().flatRows.map(row => row.original));

  const hasTreeRows = computed(() => table.getCoreRowModel().flatRows.some(row => row.depth > 0));

  const displayRows = computed<TableTreeRow<T, R>[]>(() =>
    table.getRowModel().rows.map(engineRow => ({
      key: props.rowKey(engineRow.original),
      id: engineRow.id,
      row: engineRow.original,
      sourceRow: engineRow,
      level: engineRow.depth + 1,
      parentKey: engineRow.parentId ? props.rowKey(table.getRow(engineRow.parentId).original) : undefined,
      hasChildren: engineRow.subRows.length > 0
    }))
  );

  const visibleRowKeys = computed(() => displayRows.value.map(row => row.key));

  const treeColumnKey = computed(() => getTableTreeColumnKey(leafColumns.value));

  const hasExpandColumn = computed(() => leafColumns.value.some(column => column.type === 'expand'));

  const isHeaderSelectionDisabled = computed(() => displayRows.value.length === 0);

  const headerSelection = computed<CheckedState>(() =>
    getTableHeaderSelectionState(selected.value, visibleRowKeys.value)
  );

  return {
    visibleExpanded,
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
  };
}

interface UseTableCompactResizeOptions {
  leafColumns: ComputedRef<TableColumn[]>;
  columnSizing: ShallowRef<ColumnSizingState>;
}

export function useTableCompactResize(options: UseTableCompactResizeOptions) {
  const { leafColumns, columnSizing } = options;

  const [tableContentTarget, setTableContentRef] = useForwardElement<HTMLElement>();
  const measuredColumnWidths = shallowRef<Record<string, number>>({});
  const resizingColumnKey = shallowRef<string | null>(null);
  const headCellElements: Record<string, HTMLElement | null> = {};

  function syncMeasuredColumnWidths() {
    measuredColumnWidths.value = getTableMeasuredColumnWidths(leafColumns.value, {
      columnSizing: columnSizing.value,
      headCellElements,
      measuredColumnWidths: measuredColumnWidths.value
    });
  }

  const fixedColumnStates = computed(() =>
    getTableFixedColumnOffsets(leafColumns.value, column =>
      getTableMeasuredColumnWidth(column, columnSizing.value, measuredColumnWidths.value)
    )
  );

  watch(
    [leafColumns, columnSizing],
    () => {
      nextTick(syncMeasuredColumnWidths);
    },
    { deep: true, flush: 'post' }
  );

  useResizeObserver(tableContentTarget, () => {
    syncMeasuredColumnWidths();
  });

  onBeforeUnmount(() => {
    resizingColumnKey.value = null;
  });

  return {
    setTableContentRef,
    tableContentTarget,
    headCellElements,
    measuredColumnWidths,
    syncMeasuredColumnWidths,
    resizingColumnKey,
    fixedColumnStates
  };
}

interface UseTableCompactVirtualOptions extends ToContext<
  TableCompactProps,
  'height' | 'virtual' | 'virtualizerOptions' | 'estimateSize'
> {
  displayRows: ComputedRef<TableTreeRow[]>;
  syncMeasuredColumnWidths: () => void;
}

export function useTableCompactVirtual(options: UseTableCompactVirtualOptions) {
  const { virtual, height, virtualizerOptions, estimateSize, displayRows, syncMeasuredColumnWidths } = options;

  const virtualViewportHeight = shallowRef(0);
  const virtualScrollTop = shallowRef(0);
  const isVirtual = computed(() => Boolean(virtual.value && height.value !== undefined));

  function resetVirtualState() {
    virtualViewportHeight.value = 0;
    virtualScrollTop.value = 0;
  }

  const [tableScrollTarget, setTableScrollRef] = useForwardElement<HTMLElement>(element => {
    if (!isVirtual.value) {
      return;
    }

    virtualViewportHeight.value = element.clientHeight ?? 0;
    virtualScrollTop.value = element.scrollTop ?? 0;
  });

  const tableScrollStyle = computed(() => getTableScrollStyle(isVirtual.value, height.value));
  const virtualTableScrollTarget = computed(() => (isVirtual.value ? tableScrollTarget.value : undefined));
  const virtualOverscan = computed(() => (isVirtual.value ? (virtualizerOptions.value?.overscan ?? 8) : 0));

  const resolvedVirtualHeight = computed(() => {
    if (!isVirtual.value) {
      return 0;
    }

    return getTableResolvedHeight(virtualViewportHeight.value, height.value);
  });

  function syncVirtualStateFromRoot() {
    if (!isVirtual.value) {
      resetVirtualState();
      return;
    }

    virtualViewportHeight.value = tableScrollTarget.value?.clientHeight ?? resolvedVirtualHeight.value;
    virtualScrollTop.value = tableScrollTarget.value?.scrollTop ?? 0;
  }

  const virtualMeasurements = computed(() => {
    if (!isVirtual.value) {
      return [];
    }

    return getTableVirtualMeasurements(displayRows.value, estimateSize.value);
  });

  const virtualRange = computed(() => {
    return getTableVirtualRange({
      isVirtual: isVirtual.value,
      rowCount: displayRows.value.length,
      viewportHeight: resolvedVirtualHeight.value,
      scrollTop: virtualScrollTop.value,
      measurements: virtualMeasurements.value,
      overscan: virtualOverscan.value
    });
  });

  const virtualPaddingStart = computed(() => {
    return getTableVirtualPaddingStart(isVirtual.value, virtualRange.value, virtualMeasurements.value);
  });

  const virtualPaddingEnd = computed(() => {
    return getTableVirtualPaddingEnd(isVirtual.value, virtualRange.value, virtualMeasurements.value);
  });

  const visibleRows = computed<TableVisibleRow[]>(() =>
    getTableVisibleRows(displayRows.value, isVirtual.value, virtualRange.value)
  );

  watch(
    displayRows,
    () => {
      if (!isVirtual.value) {
        return;
      }

      nextTick(() => {
        virtualScrollTop.value = tableScrollTarget.value?.scrollTop ?? 0;
      });
    },
    { deep: true, flush: 'post' }
  );

  watch(
    isVirtual,
    value => {
      if (!value) {
        resetVirtualState();
        return;
      }

      nextTick(syncVirtualStateFromRoot);
    },
    { flush: 'post' }
  );

  useResizeObserver(virtualTableScrollTarget, entries => {
    virtualViewportHeight.value = entries[0]?.contentRect.height ?? tableScrollTarget.value?.clientHeight ?? 0;
  });

  useEventListener(virtualTableScrollTarget, 'scroll', event => {
    const target = event.target;

    if (target instanceof HTMLElement) {
      virtualScrollTop.value = target.scrollTop;
    }
  });

  onMounted(() => {
    nextTick(() => {
      syncMeasuredColumnWidths();
      syncVirtualStateFromRoot();
    });
  });

  return {
    isVirtual,
    setTableScrollRef,
    tableScrollStyle,
    virtualPaddingStart,
    virtualPaddingEnd,
    visibleRows
  };
}

export function useTableCompactHead(options: ToContext<TableCompactHeadProps>) {
  const {
    dir,
    headProps,
    headCellElements,
    table,
    columnSizing,
    measuredColumnWidths,
    fixedColumnStates,
    columnFilters,
    sourceRows,
    selected,
    multiple,
    visibleRowKeys,
    resizingColumnKey,
    headerSelection: checked,
    isHeaderSelectionDisabled: disabled
  } = useTableCompactContext('TableCompactHead');
  const ui = useTableUi();
  const { header } = options;
  const messages = useLocaleMessages();

  const engineColumn = computed(() => header.value.column);
  const column = computed(() => engineColumn.value.columnDef as TableColumn);
  const columnKey = computed(() => engineColumn.value.id);
  const sortOrder = computed(() => engineColumn.value.getIsSorted() || undefined);
  const sortable = computed(() => engineColumn.value.getCanSort());
  const filterable = computed(() => engineColumn.value.getCanFilter());
  const resizable = computed(() => engineColumn.value.getCanResize());
  const columnLabel = computed(() => {
    const def = column.value;
    const headerText = def.header;

    if (typeof headerText === 'string' && headerText.length > 0) {
      return headerText;
    }

    // type columns have generated ids (`__index`/`__expand`); never show them
    if (def.type === 'index') {
      return '#';
    }

    return def.type ? '' : getTableColumnLabel(def);
  });
  const hasHeaderRenderer = computed(() => typeof header.value.column.columnDef.header === 'function');
  const sortAriaLabel = computed(() =>
    getTableSortButtonLabel(columnLabel.value, sortOrder.value, messages.value.table)
  );
  const headerAriaSort = computed(() => getTableAriaSort(sortOrder.value));
  const filterValue = computed(() => {
    if (!filterable.value) {
      return '';
    }

    return getTableColumnFilterValue(columnFilters.value, columnKey.value);
  });
  const filterValues = computed(() => {
    if (!filterable.value) {
      return [];
    }

    return getTableColumnFilterValues(columnFilters.value, columnKey.value);
  });
  const filterState = computed(() => {
    if (!filterable.value) {
      return undefined;
    }
    return getTableColumnFilterEntry(columnFilters.value, columnKey.value);
  });

  const filterOptions = computed(() => {
    if (!filterable.value) {
      return [];
    }

    return getTableColumnFilterOptions(sourceRows.value, column.value, readRowValueByColumn);
  });

  const filtered = computed(() => {
    if (!filterable.value) {
      return false;
    }

    return isTableColumnFiltered(columnFilters.value, columnKey.value);
  });

  const toggleSort = () => {
    if (!sortable.value) {
      return;
    }

    engineColumn.value.toggleSorting();
  };

  const writeFilterState = (value: TableFilterValue | undefined) => {
    columnFilters.value = setTableColumnFilterEntry(columnFilters.value, columnKey.value, value);
  };

  const setFilterValue = (value: string) => {
    if (!filterable.value) {
      return;
    }

    const current = normalizeTableFilterValue(getTableColumnFilterEntry(columnFilters.value, columnKey.value));

    writeFilterState({ ...current, keyword: value });
  };

  const setFilterValues = (values: string[]) => {
    if (!filterable.value) {
      return;
    }

    const current = normalizeTableFilterValue(getTableColumnFilterEntry(columnFilters.value, columnKey.value));

    writeFilterState({ ...current, values });
  };

  const setFilterState = (value: TableFilterValue | undefined) => {
    if (!filterable.value) {
      return;
    }

    writeFilterState(value);
  };

  const toggleFilterOption = (value: string) => {
    if (!filterable.value) {
      return;
    }

    columnFilters.value = toggleTableFilterOption(columnFilters.value, columnKey.value, value);
  };

  const isFilterOptionSelected = (value: string) => {
    if (!filterable.value) {
      return false;
    }

    return isTableFilterOptionSelected(columnFilters.value, columnKey.value, value);
  };

  const clearFilter = () => {
    setFilterState(undefined);
  };

  const updateChecked = (state: CheckedState | null) => {
    if (!Array.isArray(selected.value)) {
      return;
    }

    if (state === true) {
      selected.value = [...visibleRowKeys.value] as typeof selected.value;
      return;
    }

    selected.value = [] as typeof selected.value;
  };

  const bindProps = computed(() => {
    const fixedState = getTableHeaderFixedState(column.value, fixedColumnStates.value);
    const headCellStyle = getTableCellStyle({
      width: getColumnWidthValue(column.value, columnSizing.value),
      minWidth: column.value.minSize,
      textAlign: getTableAlign(column.value),
      fixedState,
      zIndex: 3
    });

    return mergeProps(
      { ...headProps.value },
      {
        class: fixedState ? ui.value.fixed : undefined,
        style: headCellStyle,
        colspan: header.value.colSpan,
        rowspan: header.value.rowSpan ?? 1,
        'aria-sort': headerAriaSort.value,
        'data-fixed': fixedState ? '' : undefined,
        'data-fixed-side': fixedState?.side,
        'data-fixed-last-start': fixedState?.isLastStart ? '' : undefined,
        'data-fixed-first-end': fixedState?.isFirstEnd ? '' : undefined
      }
    );
  });

  const headerSlotProps = computed<TableHeaderSlotProps>(() => {
    return {
      ...getMergedRefsValue({
        column,
        engineColumn,
        table,
        colSpan: computed(() => header.value.colSpan),
        rowSpan: computed(() => header.value.rowSpan ?? 1),
        sortable,
        filterable,
        filtered,
        resizable,
        sortOrder,
        multiple,
        checked,
        disabled,
        filterValue,
        filterValues,
        filterState,
        filterOptions
      }),
      updateChecked,
      toggleSort,
      setFilterValue,
      setFilterValues,
      setFilterState,
      toggleFilterOption,
      isFilterOptionSelected,
      clearFilter
    };
  });
  const headerSelectionSlotProps = computed<TableHeaderSelectionSlotProps>(() => ({
    column: column.value,
    multiple: multiple.value,
    checked: checked.value,
    disabled: disabled.value,
    ariaLabel: messages.value.table.selectAllRows,
    updateChecked
  }));
  const headerFilterSlotProps = computed<TableHeaderFilterSlotProps>(() =>
    pick(headerSlotProps.value, [
      'column',
      'filterValue',
      'filterValues',
      'filterState',
      'filtered',
      'filterOptions',
      'toggleFilterOption',
      'isFilterOptionSelected',
      'setFilterValue',
      'setFilterValues',
      'setFilterState',
      'clearFilter'
    ])
  );
  const sortSlotProps = computed<TableHeaderSortSlotProps>(() => ({
    column: column.value,
    sortOrder: sortOrder.value,
    ariaLabel: sortAriaLabel.value,
    toggleSort
  }));
  const resizeSlotProps = computed<TableHeaderResizeSlotProps>(() => ({
    column: column.value,
    resizing: resizingColumnKey.value === columnKey.value,
    ariaLabel: getTableResizeHandleLabel(columnLabel.value, messages.value.table),
    onPointerdown: event => startColumnResize(event),
    onKeydown: event => onResizeHandleKeydown(event)
  }));

  let resizeListenersCleanup: (() => void) | null = null;

  const stopColumnResize = () => {
    resizeListenersCleanup?.();
    resizeListenersCleanup = null;
    resizingColumnKey.value = null;
  };

  const startColumnResize = (event: PointerEvent) => {
    if (!resizable.value) return;

    event.preventDefault();
    event.stopPropagation();

    const key = columnKey.value;
    const startX = event.clientX;
    const startWidth =
      headCellElements[key]?.getBoundingClientRect().width ??
      getTableMeasuredColumnWidth(column.value, columnSizing.value, measuredColumnWidths.value);
    const minWidth = getTableColumnResizeMinWidth(column.value.minSize);
    const ownerDocument = headCellElements[key]?.ownerDocument;

    if (!ownerDocument) {
      return;
    }

    resizingColumnKey.value = key;

    const handlePointerMove = (pointerEvent: PointerEvent) => {
      const nextWidth = getNextTablePointerResizeWidth(startWidth, startX, pointerEvent.clientX, minWidth, dir.value);

      columnSizing.value = getNextTableColumnSizing(columnSizing.value, key, nextWidth);
    };

    const handlePointerUp = () => {
      stopColumnResize();
    };

    ownerDocument.addEventListener('pointermove', handlePointerMove);
    ownerDocument.addEventListener('pointerup', handlePointerUp);
    ownerDocument.addEventListener('pointercancel', handlePointerUp);

    resizeListenersCleanup = () => {
      ownerDocument.removeEventListener('pointermove', handlePointerMove);
      ownerDocument.removeEventListener('pointerup', handlePointerUp);
      ownerDocument.removeEventListener('pointercancel', handlePointerUp);
    };
  };

  const onResizeHandleKeydown = (event: KeyboardEvent) => {
    if (!resizable.value) {
      return;
    }

    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const key = columnKey.value;
    const currentWidth = getTableMeasuredColumnWidth(column.value, columnSizing.value, measuredColumnWidths.value);
    const nextWidth = getNextTableKeyboardResizeWidth(
      currentWidth,
      event.key === 'ArrowRight' ? 'increase' : 'decrease',
      getTableColumnResizeMinWidth(column.value.minSize),
      dir.value
    );

    columnSizing.value = getNextTableColumnSizing(columnSizing.value, key, nextWidth);
  };

  const setElementRef = (nodeRef: VNodeRef) => {
    const element = getElFromTemplateRef(nodeRef) ?? null;
    headCellElements[columnKey.value] = element;
  };

  onBeforeUnmount(() => {
    stopColumnResize();
  });

  return {
    bindProps,
    setElementRef,
    headerSlotProps,
    headerSelectionSlotProps,
    headerFilterSlotProps,
    sortSlotProps,
    resizeSlotProps,
    header,
    column,
    columnLabel,
    hasHeaderRenderer,
    columnSlotName: columnKey,
    sortable,
    filterable,
    resizable
  };
}

interface TableCompactCellOptions {
  column: TableColumn;
  row: TableTreeRow;
  index: number;
}

export function useTableCompactCell(options: ToContext<TableCompactCellOptions>) {
  const {
    indent,
    rowKey,
    table,
    columnSizing,
    fixedColumnStates,
    expanded,
    visibleExpanded,
    hasTreeRows,
    treeColumnKey,
    hasExpandColumn,
    isValueSelected,
    onSelectedChange,
    multiple,
    cellProps
  } = useTableCompactContext('TableCompactCell');

  const ui = useTableUi();
  const { column, row, index } = options;
  const messages = useLocaleMessages();

  const toggleExpand = (id: string) => {
    expanded.value = toggleTableExpandedState(expanded.value, id);
  };

  const getCellSlotProps = ($column: TableColumn, $row: TableTreeRow, $index: number) => {
    const engineColumn = table.getColumn(getTableColumnKey($column)) as TableEngineColumn;

    return {
      index: $index,
      column: $column,
      engineColumn,
      table,
      row: $row.row,
      level: $row.level,
      hasChildren: $row.hasChildren,
      expanded: isTableRowExpanded(visibleExpanded.value, $row.id),
      toggleExpand: () => toggleExpand($row.id)
    } satisfies TableCellSlotProps;
  };

  const engineColumn = computed(() => table.getColumn(getTableColumnKey(column.value)) as TableEngineColumn);

  const engineCell = computed(() =>
    column.value.id ? row.value.sourceRow.getAllCellsByColumnId()[column.value.id] : undefined
  );

  const hasCellRenderer = computed(() => typeof engineColumn.value.columnDef.cell === 'function');

  const bindProps = computed(() => {
    const fixedState = getTableLeafFixedState(column.value, fixedColumnStates.value);
    const bodyCellStyle = getTableCellStyle({
      width: getColumnWidthValue(column.value, columnSizing.value),
      minWidth: column.value.minSize,
      textAlign: getTableAlign(column.value),
      fixedState,
      zIndex: 2
    });

    return mergeProps(
      { ...cellProps.value },
      {
        class: fixedState ? ui.value.fixed : undefined,
        style: bodyCellStyle,
        'data-fixed': fixedState ? '' : undefined,
        'data-fixed-side': fixedState?.side,
        'data-fixed-last-start': fixedState?.isLastStart ? '' : undefined,
        'data-fixed-first-end': fixedState?.isFirstEnd ? '' : undefined
      }
    );
  });

  const isDataColumn = computed(() => isTableDataColumn(column.value));

  const dataCellSlotProps = computed(() => {
    if (!isDataColumn.value) {
      return undefined;
    }

    return {
      ...getCellSlotProps(column.value, row.value, index.value),
      value: readCellValue(row.value, column.value)
    } satisfies TableDataCellSlotProps;
  });

  const isTreeColumn = computed(() => isTableTreeColumn(column.value, hasTreeRows.value, treeColumnKey.value));

  const showInlineTreeToggle = computed(() =>
    shouldShowTableInlineTreeToggle(column.value, hasTreeRows.value, treeColumnKey.value, hasExpandColumn.value)
  );

  const treeCellStyle = computed(() => getTableTreeCellStyle(hasTreeRows.value, row.value.level, indent.value ?? 16));

  const treeToggleSlotProps = computed<TableTreeToggleSlotProps>(() => ({
    ...getCellSlotProps(column.value, row.value, index.value),
    ariaLabel: getTableRowExpandLabel(
      getTableRowLabel(row.value.row, rowKey),
      isTableRowExpanded(visibleExpanded.value, row.value.id),
      messages.value.table
    )
  }));

  const indexSlotProps = computed<TableIndexSlotProps>(() => ({
    index: index.value,
    column: column.value,
    row: row.value.row,
    level: row.value.level,
    hasChildren: row.value.hasChildren
  }));

  const selectionSlotProps = computed<TableSelectionSlotProps>(() => ({
    ...getCellSlotProps(column.value, row.value, index.value),
    multiple: multiple.value,
    checked: isValueSelected(row.value.key),
    ariaLabel: getTableSelectRowLabel(getTableRowLabel(row.value.row, rowKey), messages.value.table),
    toggleSelect: () => onSelectedChange(row.value.key)
  }));

  const expandSlotProps = computed<TableExpandSlotProps>(() => ({
    ...getCellSlotProps(column.value, row.value, index.value),
    ariaLabel: getTableRowExpandLabel(
      getTableRowLabel(row.value.row, rowKey),
      isTableRowExpanded(visibleExpanded.value, row.value.id),
      messages.value.table
    )
  }));

  return {
    bindProps,
    isDataColumn,
    isTreeColumn,
    showInlineTreeToggle,
    treeCellStyle,
    dataCellSlotProps,
    engineCell,
    hasCellRenderer,
    indexSlotProps,
    selectionSlotProps,
    expandSlotProps,
    treeToggleSlotProps
  };
}

interface TableCompactExpandedRowOptions {
  row: TableTreeRow;
  index: number;
}

export function useTableCompactExpandedRow(options: ToContext<TableCompactExpandedRowOptions>) {
  const { hasExpandColumn, hasExpandedRowSlot, visibleExpanded, rowProps, cellProps } =
    useTableCompactContext('TableCompactExpandedRow');

  const { row: treeRow, index } = options;

  const visible = computed(() =>
    shouldRenderTableExpandedRow(
      treeRow.value,
      getMergedRefsValue({
        hasExpandColumn,
        hasExpandedRowSlot,
        expanded: visibleExpanded
      })
    )
  );

  const expandedRowSlotProps = computed(() => {
    const { row, level, hasChildren } = treeRow.value;

    return {
      index: index.value,
      row,
      level,
      hasChildren
    };
  });

  return {
    visible,
    expandedRowSlotProps,
    rowProps,
    cellProps
  };
}
