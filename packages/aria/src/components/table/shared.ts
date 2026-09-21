import type { CSSProperties } from 'vue';
import type { ColumnFilter, ColumnFiltersState, ExpandedState, HeaderGroup } from '@tanstack/table-core';
import { interpolate } from '../../shared';
import type { LocaleTableMessages } from '../../locale/types';
import type { CheckedState, Direction } from '../../types';
import {
  getTableColumnKey,
  getTableLeafColumns,
  getTableRowValueByPath,
  isTableDataColumn,
  normalizeTableFilterValue
} from './columns';

export { getTableRowValueByPath };
import type { SoybeanTableFeatures } from './features';
import type {
  TableBaseData,
  TableColumn,
  TableEngineHeader,
  TableFilterValue,
  TableFixedColumnOffsets,
  TableFixedState,
  TableHeaderCell,
  TableSortOrder,
  TableTreeRow,
  TableUnifiedKey,
  TableVirtualMeasurement,
  TableVirtualRange,
  TableVisibleRow
} from './types';

/**
 * Get a human-readable row label for built-in table a11y text.
 *
 * Falls back to common display fields (`name`, `title`, `label`) before using the row key.
 */
export function getTableRowLabel<T extends TableBaseData, R extends string | number>(row: T, rowKey: (row: T) => R) {
  const candidate = row.name ?? row.title ?? row.label;

  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate;
  }

  return String(rowKey(row));
}

export function getTableRowChildren<T extends TableBaseData>(row: T, getChildren?: (row: T) => T[] | undefined): T[] {
  if (getChildren) {
    return getChildren(row) ?? [];
  }

  return Array.isArray(row.children) ? (row.children as T[]) : [];
}

export function getTableTreeRows<T extends TableBaseData>(rows: T[], getChildren?: (row: T) => T[] | undefined): T[] {
  return rows.flatMap(row => [row, ...getTableTreeRows(getTableRowChildren(row, getChildren), getChildren)]);
}

//#region expanded state
export function collectTableExpandableKeys<T extends TableBaseData>(
  rows: T[],
  getKey: (row: T) => string,
  getChildren?: (row: T) => T[] | undefined,
  includeLeaves: boolean = false
): string[] {
  return rows.flatMap(row => {
    const children = getTableRowChildren(row, getChildren);
    const keys = includeLeaves || children.length > 0 ? [getKey(row)] : [];

    return [...keys, ...collectTableExpandableKeys(children, getKey, getChildren, includeLeaves)];
  });
}

export function toTableExpandedState(keys: string[]): ExpandedState {
  return keys.reduce<Record<string, boolean>>((state, key) => {
    state[key] = true;
    return state;
  }, {});
}

export function isTableRowExpanded(state: ExpandedState, id: string): boolean {
  if (state === true) {
    return true;
  }

  return Boolean(state[id]);
}

export function toggleTableExpandedState(state: ExpandedState, id: string): ExpandedState {
  if (isTableRowExpanded(state, id)) {
    if (state === true) {
      return state;
    }

    const nextState = { ...state };

    delete nextState[id];

    return nextState;
  }

  return { ...(state === true ? {} : state), [id]: true };
}
//#endregion

//#region filter values
export function getTableColumnFilterEntry(
  state: ColumnFiltersState | undefined,
  id: string
): TableFilterValue | undefined {
  const entry = state?.find(filter => filter.id === id);

  return entry?.value as TableFilterValue | undefined;
}

export function getTableColumnFilterValue(state: ColumnFiltersState | undefined, id: string): string {
  return normalizeTableFilterValue(getTableColumnFilterEntry(state, id)).keyword;
}

export function getTableColumnFilterValues(state: ColumnFiltersState | undefined, id: string): string[] {
  return normalizeTableFilterValue(getTableColumnFilterEntry(state, id)).values;
}

export function isTableColumnFiltered(state: ColumnFiltersState | undefined, id: string): boolean {
  const value = normalizeTableFilterValue(getTableColumnFilterEntry(state, id));

  return value.keyword.length > 0 || value.values.length > 0;
}

export function setTableColumnFilterEntry(
  state: ColumnFiltersState,
  id: string,
  value: TableFilterValue | undefined
): ColumnFiltersState {
  const normalizedValue = normalizeTableFilterValue(value);
  const isEmptied = normalizedValue.keyword.length === 0 && normalizedValue.values.length === 0;
  const nextEntry = isEmptied
    ? undefined
    : ({
        id,
        value: toTableFilterStateValue(normalizedValue)
      } satisfies ColumnFilter);
  const existingIndex = state.findIndex(filter => filter.id === id);

  if (existingIndex < 0) {
    return nextEntry ? [...state, nextEntry] : state;
  }

  if (!nextEntry) {
    return state.filter((_, index) => index !== existingIndex);
  }

  return state.map((filter, index) => (index === existingIndex ? nextEntry : filter));
}

function toTableFilterStateValue(value: { keyword: string; values: string[] }): TableFilterValue {
  if (value.values.length === 0) {
    return value.keyword;
  }

  return {
    keyword: value.keyword || undefined,
    values: value.values
  };
}

export function toggleTableFilterOption(state: ColumnFiltersState, id: string, value: string): ColumnFiltersState {
  const currentValues = getTableColumnFilterValues(state, id);
  const nextValues = currentValues.includes(value)
    ? currentValues.filter(currentValue => currentValue !== value)
    : [...currentValues, value];

  return setTableColumnFilterEntry(state, id, {
    ...normalizeTableFilterValue(getTableColumnFilterEntry(state, id)),
    values: nextValues
  });
}

export function isTableFilterOptionSelected(state: ColumnFiltersState | undefined, id: string, value: string): boolean {
  return getTableColumnFilterValues(state, id).includes(value);
}
//#endregion

//#region header rows
export function getTableHeaderRows<T extends TableBaseData>(
  headerGroups: HeaderGroup<SoybeanTableFeatures, T>[],
  getColumnDef: (engineColumn: { id?: string; columnDef: unknown }) => TableColumn<T>
): TableHeaderCell<T>[][] {
  return headerGroups.map(headerGroup =>
    headerGroup.headers
      .filter(header => (header.rowSpan ?? 1) > 0)
      .map(header => ({
        key: header.id,
        header: header as unknown as TableEngineHeader<T>,
        column: getColumnDef(header.column),
        colSpan: header.colSpan,
        rowSpan: header.rowSpan ?? 1
      }))
  );
}
//#endregion

//#region sticky fixed columns
export function getTableFixedColumnOffsets(
  leafColumns: TableColumn<any>[],
  getWidth: (column: TableColumn<any>) => number
): TableFixedColumnOffsets {
  const startFixedColumns = leafColumns.filter(column => column.fixed === 'start');
  const endFixedColumns = leafColumns.filter(column => column.fixed === 'end');
  const startOffsets: Record<string, number> = {};
  const endOffsets: Record<string, number> = {};
  let accumulatedStart = 0;
  let accumulatedEnd = 0;

  startFixedColumns.forEach(column => {
    const key = getTableColumnKey(column);
    startOffsets[key] = accumulatedStart;
    accumulatedStart += getWidth(column);
  });

  [...endFixedColumns].reverse().forEach(column => {
    const key = getTableColumnKey(column);
    endOffsets[key] = accumulatedEnd;
    accumulatedEnd += getWidth(column);
  });

  return {
    startOffsets,
    endOffsets,
    lastStartKey: startFixedColumns.at(-1) ? getTableColumnKey(startFixedColumns.at(-1)!) : undefined,
    firstEndKey: endFixedColumns[0] ? getTableColumnKey(endFixedColumns[0]) : undefined
  };
}

export function getTableLeafFixedState(
  column: TableColumn<any>,
  offsets: TableFixedColumnOffsets
): TableFixedState | undefined {
  const key = getTableColumnKey(column);

  if (column.fixed === 'start') {
    return {
      side: 'start',
      offset: offsets.startOffsets[key] ?? 0,
      isLastStart: offsets.lastStartKey === key,
      isFirstEnd: false
    };
  }

  if (column.fixed === 'end') {
    return {
      side: 'end',
      offset: offsets.endOffsets[key] ?? 0,
      isLastStart: false,
      isFirstEnd: offsets.firstEndKey === key
    };
  }

  return undefined;
}

export function getTableHeaderFixedState(
  column: TableColumn<any>,
  offsets: TableFixedColumnOffsets
): TableFixedState | undefined {
  const groupColumns = (column as TableColumn<any> & { columns?: TableColumn<any>[] }).columns;

  if (!Array.isArray(groupColumns)) {
    return getTableLeafFixedState(column, offsets);
  }

  const leaves = getTableLeafColumns([column]);
  const fixedSides = [
    ...new Set(leaves.map(leaf => leaf.fixed).filter((side): side is 'start' | 'end' => Boolean(side)))
  ];

  if (fixedSides.length !== 1) {
    return undefined;
  }

  const boundaryColumn = fixedSides[0] === 'start' ? leaves[0] : leaves.at(-1);

  if (!boundaryColumn) {
    return undefined;
  }

  const boundaryState = getTableLeafFixedState(boundaryColumn, offsets);

  if (!boundaryState) {
    return undefined;
  }

  return {
    ...boundaryState,
    isLastStart: leaves.some(leaf => getTableColumnKey(leaf) === offsets.lastStartKey),
    isFirstEnd: leaves.some(leaf => getTableColumnKey(leaf) === offsets.firstEndKey)
  };
}

export function getTableCellStyle(params: {
  width?: number;
  minWidth?: number;
  textAlign?: CSSProperties['textAlign'];
  fixedState?: TableFixedState;
  zIndex?: number;
}): CSSProperties {
  return {
    width: params.width === undefined ? undefined : `${params.width}px`,
    minWidth: params.minWidth === undefined ? undefined : `${params.minWidth}px`,
    textAlign: params.textAlign,
    position: params.fixedState ? 'sticky' : undefined,
    insetInlineStart: params.fixedState?.side === 'start' ? `${params.fixedState.offset}px` : undefined,
    insetInlineEnd: params.fixedState?.side === 'end' ? `${params.fixedState.offset}px` : undefined,
    zIndex: params.fixedState ? params.zIndex : undefined
  };
}

export function getTableSpacerCellStyle(height: number): CSSProperties {
  return {
    height: `${height}px`,
    padding: 0,
    border: 0
  };
}
//#endregion

//#region column sizing
export function getNextTableColumnSizing(
  state: Record<string, number>,
  key: string,
  width: number
): Record<string, number> {
  return {
    ...state,
    [key]: Math.round(width)
  };
}

export function getTableColumnResizeMinWidth(minSize?: number): number {
  return minSize ?? 80;
}

export function getTableMeasuredColumnWidth<T extends TableBaseData>(
  column: TableColumn<T>,
  columnSizing: Record<string, number>,
  measuredColumnWidths: Record<string, number>,
  fallbackWidth: number = 160
): number {
  const key = getTableColumnKey(column);
  const sizingWidth = columnSizing[key] ?? (typeof column.size === 'number' ? column.size : undefined);
  const measuredWidth = measuredColumnWidths[key];
  const resolvedMeasuredWidth = measuredWidth && measuredWidth > 0 ? measuredWidth : undefined;

  return resolvedMeasuredWidth ?? sizingWidth ?? fallbackWidth;
}

export function getTableMeasuredColumnWidths<T extends TableBaseData>(
  leafColumns: TableColumn<T>[],
  params: {
    columnSizing: Record<string, number>;
    headCellElements: Record<string, HTMLElement | null>;
    measuredColumnWidths: Record<string, number>;
  }
): Record<string, number> {
  return leafColumns.reduce<Record<string, number>>((acc, column) => {
    const key = getTableColumnKey(column);
    const sizingWidth = params.columnSizing[key] ?? (typeof column.size === 'number' ? column.size : undefined);
    const measuredWidth = params.headCellElements[key]?.getBoundingClientRect().width;
    const resolvedMeasuredWidth = measuredWidth && measuredWidth > 0 ? measuredWidth : undefined;

    acc[key] =
      resolvedMeasuredWidth ??
      sizingWidth ??
      getTableMeasuredColumnWidth(column, params.columnSizing, params.measuredColumnWidths);

    return acc;
  }, {});
}

export function getNextTablePointerResizeWidth(
  startWidth: number,
  startX: number,
  currentX: number,
  minWidth: number,
  dir: Direction = 'ltr'
): number {
  const delta = currentX - startX;
  const resolvedDelta = dir === 'rtl' ? -delta : delta;

  return Math.max(minWidth, startWidth + resolvedDelta);
}

export function getNextTableKeyboardResizeWidth(
  currentWidth: number,
  direction: 'decrease' | 'increase',
  minWidth: number,
  dir: Direction = 'ltr',
  step: number = 16
): number {
  const resolvedDirection = dir === 'rtl' ? (direction === 'increase' ? 'decrease' : 'increase') : direction;
  const delta = resolvedDirection === 'increase' ? step : -step;

  return Math.max(minWidth, currentWidth + delta);
}
//#endregion

//#region virtual rows
export function getTableScrollStyle(isVirtual: boolean, height?: number | string): CSSProperties {
  if (!isVirtual) {
    return {};
  }

  return {
    height: typeof height === 'number' ? `${height}px` : height
  };
}

export function getTableResolvedHeight(viewportHeight: number, height?: number | string): number {
  if (viewportHeight > 0) {
    return viewportHeight;
  }

  if (typeof height === 'number') {
    return height;
  }

  const parsedHeight = Number.parseFloat(height ?? '');

  return Number.isFinite(parsedHeight) ? parsedHeight : 0;
}

export function getTableEstimatedRowSize<T extends TableBaseData>(
  estimateSize: number | ((index: number, row: T) => number) | undefined,
  index: number,
  row: T
): number {
  if (typeof estimateSize === 'function') {
    return estimateSize(index, row);
  }

  return estimateSize ?? 40;
}

export function findTableVirtualStartIndex(measurements: TableVirtualMeasurement[], scrollTop: number): number {
  let low = 0;
  let high = measurements.length - 1;
  let result = measurements.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const measurement = measurements[middle];

    if (measurement.end > scrollTop) {
      result = middle;
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  return result;
}

export function getTableVirtualMeasurements<T extends TableBaseData, R extends TableUnifiedKey>(
  rows: TableTreeRow<T, R>[],
  estimateSize: number | ((index: number, row: T) => number) | undefined
): TableVirtualMeasurement[] {
  let start = 0;

  return rows.map((item, index) => {
    const size = getTableEstimatedRowSize(estimateSize, index, item.row);
    const measurement = {
      index,
      start,
      end: start + size
    };

    start += size;

    return measurement;
  });
}

export function getTableVirtualRange(params: {
  isVirtual: boolean;
  rowCount: number;
  viewportHeight: number;
  scrollTop: number;
  measurements: TableVirtualMeasurement[];
  overscan: number;
}): TableVirtualRange {
  if (!params.isVirtual) {
    return {
      startIndex: 0,
      endIndex: params.rowCount - 1
    };
  }

  if (params.measurements.length === 0) {
    return {
      startIndex: 0,
      endIndex: -1
    };
  }

  let startIndex = findTableVirtualStartIndex(params.measurements, params.scrollTop);
  let endIndex = startIndex;

  while (
    endIndex < params.measurements.length &&
    params.measurements[endIndex].start < params.scrollTop + params.viewportHeight
  ) {
    endIndex += 1;
  }

  startIndex = Math.max(0, startIndex - params.overscan);
  endIndex = Math.min(params.measurements.length - 1, endIndex + params.overscan);

  return {
    startIndex,
    endIndex
  };
}

export function getTableVirtualPaddingStart(
  isVirtual: boolean,
  range: TableVirtualRange,
  measurements: TableVirtualMeasurement[]
): number {
  if (!isVirtual || range.startIndex < 0) {
    return 0;
  }

  return measurements[range.startIndex]?.start ?? 0;
}

export function getTableVirtualPaddingEnd(
  isVirtual: boolean,
  range: TableVirtualRange,
  measurements: TableVirtualMeasurement[]
): number {
  if (!isVirtual || range.endIndex < 0) {
    return 0;
  }

  const totalSize = measurements.at(-1)?.end ?? 0;
  const end = measurements[range.endIndex]?.end ?? 0;

  return Math.max(totalSize - end, 0);
}

export function getTableVisibleRows<T extends TableBaseData, R extends TableUnifiedKey>(
  rows: TableTreeRow<T, R>[],
  isVirtual: boolean,
  range: TableVirtualRange
): TableVisibleRow<T, R>[] {
  if (!isVirtual) {
    return rows.map((item, index) => ({
      index,
      item
    }));
  }

  if (range.endIndex < range.startIndex) {
    return [];
  }

  return rows.slice(range.startIndex, range.endIndex + 1).map((item, offset) => ({
    index: range.startIndex + offset,
    item
  }));
}
//#endregion

//#region tree rendering helpers
export function getTableTreeColumnKey<T extends TableBaseData>(leafColumns: TableColumn<T>[]) {
  const column = leafColumns.find(isTableDataColumnColumn);

  return column ? getTableColumnKey(column) : undefined;
}

function isTableDataColumnColumn<T extends TableBaseData>(column: TableColumn<T>): boolean {
  const groupColumns = (column as TableColumn<any> & { columns?: TableColumn<any>[] }).columns;

  return !column.type && !Array.isArray(groupColumns) && isTableDataColumn(column);
}

export function getTableTreeCellStyle(hasTreeRows: boolean, level: number, indent: number): CSSProperties | undefined {
  if (!hasTreeRows) {
    return undefined;
  }

  return {
    paddingInlineStart: `${Math.max(level - 1, 0) * indent}px`
  };
}

export function isTableTreeColumn<T extends TableBaseData>(
  column: TableColumn<T>,
  hasTreeRows: boolean,
  treeColumnKey: string | undefined
): boolean {
  return isTableDataColumn(column) && hasTreeRows && getTableColumnKey(column) === treeColumnKey;
}

export function shouldShowTableInlineTreeToggle<T extends TableBaseData>(
  column: TableColumn<T>,
  hasTreeRows: boolean,
  treeColumnKey: string | undefined,
  hasExpandColumn: boolean
): boolean {
  return isTableTreeColumn(column, hasTreeRows, treeColumnKey) && !hasExpandColumn;
}

export function canTableExpandRow<T extends TableBaseData, R extends TableUnifiedKey>(
  row: TableTreeRow<T, R>,
  hasExpandedRowSlot: boolean
): boolean {
  return row.hasChildren || hasExpandedRowSlot;
}

export function shouldRenderTableExpandedRow<T extends TableBaseData, R extends TableUnifiedKey>(
  row: TableTreeRow<T, R>,
  options: {
    hasExpandColumn: boolean;
    hasExpandedRowSlot: boolean;
    expanded: ExpandedState;
  }
): boolean {
  return (
    options.hasExpandColumn &&
    options.hasExpandedRowSlot &&
    !row.hasChildren &&
    isTableRowExpanded(options.expanded, row.id)
  );
}
//#endregion

//#region selection
export function getTableHeaderSelectionState<R extends TableUnifiedKey>(
  selectedValues: R | R[] | undefined,
  visibleRowKeys: R[]
): CheckedState {
  if (!Array.isArray(selectedValues) || visibleRowKeys.length === 0) {
    return false;
  }

  const selectedValuesSet = new Set(selectedValues);
  const selectedCount = visibleRowKeys.filter(value => selectedValuesSet.has(value)).length;

  if (selectedCount === 0) {
    return false;
  }

  if (selectedCount === visibleRowKeys.length) {
    return true;
  }

  return 'indeterminate';
}
//#endregion

//#region a11y labels
export function getTableAriaSort(order?: TableSortOrder) {
  if (order === 'asc') return 'ascending';
  if (order === 'desc') return 'descending';

  return 'none';
}

export function getTableSortIndicator(order: TableSortOrder | undefined): string {
  if (order === 'asc') return '↑';
  if (order === 'desc') return '↓';

  return '↕';
}

export function getTableSortButtonLabel(
  columnLabel: string,
  order: TableSortOrder | undefined,
  messages: Pick<LocaleTableMessages, 'sortByColumn' | 'sortByColumnAsc' | 'sortByColumnDesc'>
): string {
  if (order === 'asc') {
    return interpolate(messages.sortByColumnAsc, { column: columnLabel });
  }

  if (order === 'desc') {
    return interpolate(messages.sortByColumnDesc, { column: columnLabel });
  }

  return interpolate(messages.sortByColumn, { column: columnLabel });
}

export function getTableResizeHandleLabel(
  columnLabel: string,
  messages: Pick<LocaleTableMessages, 'resizeColumn'>
): string {
  return interpolate(messages.resizeColumn, { column: columnLabel });
}

export function getTableRowExpandLabel(
  rowLabel: string,
  expanded: boolean,
  messages: Pick<LocaleTableMessages, 'expandRow' | 'collapseRow'>
): string {
  return interpolate(expanded ? messages.collapseRow : messages.expandRow, { row: rowLabel });
}

export function getTableSelectRowLabel(rowLabel: string, messages: Pick<LocaleTableMessages, 'selectRow'>): string {
  return interpolate(messages.selectRow, { row: rowLabel });
}
//#endregion
