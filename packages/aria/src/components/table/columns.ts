import type { CSSProperties } from 'vue';
import type { ColumnPinningState } from '@tanstack/table-core';
import type { TableEngineRow, TableFilterValue, TableBaseData, TableColumn, TableColumnFilterOption } from './types';

const tableColumnFallbackKeys = new WeakMap<object, string>();

let tableColumnFallbackKeyCount = 0;

/**
 * Raw (TanStack-union-unfriendly) view of a column definition used for
 * field probing, since `accessorKey` / `columns` only exist on some union
 * members of `ColumnDef`.
 */
interface TableColumnRaw<T extends TableBaseData = TableBaseData> {
  id?: string;
  accessorKey?: string;
  accessorFn?: unknown;
  columns?: TableColumn<T>[];
  enableSorting?: boolean;
  enableColumnFilter?: boolean;
  enableResizing?: boolean;
  resizable?: boolean;
  filterFn?: unknown;
  type?: TableColumn['type'];
}

export function normalizeTableFilterValue(value: TableFilterValue | undefined): {
  keyword: string;
  values: string[];
} {
  if (typeof value === 'string') {
    return {
      keyword: value,
      values: []
    };
  }

  return {
    keyword: value?.keyword ?? '',
    values: Array.isArray(value?.values) ? [...new Set(value.values.filter(Boolean))] : []
  };
}

/**
 * Default compound filter function matching `{ keyword, values }` filter values.
 */
export function defaultTableFilterFn<T extends TableBaseData>(
  row: TableEngineRow<T>,
  columnId: string,
  filterValue: unknown
): boolean {
  const value = row.getValue(columnId);
  const normalizedValue = normalizeTableFilterValue(filterValue as TableFilterValue | undefined);

  const normalizedRowValue = String(value ?? '');
  const matchesKeyword =
    normalizedValue.keyword.length === 0 ||
    normalizedRowValue.toLowerCase().includes(normalizedValue.keyword.toLowerCase());
  const matchesValues = normalizedValue.values.length === 0 || normalizedValue.values.includes(normalizedRowValue);

  return matchesKeyword && matchesValues;
}

function toRawColumn<T extends TableBaseData>(column: TableColumn<T>): TableColumnRaw<T> {
  return column as TableColumn<T> & TableColumnRaw<T>;
}

/**
 * Resolve the stable key of a raw (possibly not yet normalized) column definition.
 *
 * Priority: explicit `id`, then `accessorKey`, then a generated group fallback
 * cached on the column object.
 */
export function getTableColumnKey<T extends TableBaseData>(column: TableColumn<T>): string {
  const rawColumn = toRawColumn(column);

  if (rawColumn.id) {
    return rawColumn.id;
  }

  if (typeof rawColumn.accessorKey === 'string') {
    return rawColumn.accessorKey;
  }

  const cachedKey = tableColumnFallbackKeys.get(column);

  if (cachedKey) {
    return cachedKey;
  }

  tableColumnFallbackKeyCount += 1;

  const fallbackKey = `__group-${tableColumnFallbackKeyCount}`;

  tableColumnFallbackKeys.set(column, fallbackKey);

  return fallbackKey;
}

export function isTableGroupColumn<T extends TableBaseData>(column: TableColumn<T>): boolean {
  return Array.isArray(toRawColumn(column).columns) && toRawColumn(column).columns!.length > 0;
}

/**
 * Safe deep-path reader used for dotted `accessorKey` columns: returns
 * `undefined` on missing intermediate keys instead of triggering the engine's
 * deep-access dev warning.
 */
export function getTableRowValueByPath<T extends TableBaseData>(row: T, path: string): unknown {
  const keys = path.split('.');
  let value: unknown = row;

  for (const key of keys) {
    if (value == null) {
      return undefined;
    }

    value = (value as Record<string, unknown>)[key];
  }

  return value;
}

export function isTableDataColumn<T extends TableBaseData>(column: TableColumn<T>): boolean {
  const rawColumn = toRawColumn(column);

  return typeof rawColumn.accessorKey === 'string' || typeof rawColumn.accessorFn === 'function';
}

export function isTableColumnResizable<T extends TableBaseData>(column: TableColumn<T>): boolean {
  return !isTableGroupColumn(column) && Boolean(column.resizable);
}

export function isTableSortableColumn<T extends TableBaseData>(column: TableColumn<T>): boolean {
  return isTableDataColumn(column) && Boolean(toRawColumn(column).enableSorting);
}

export function isTableFilterableColumn<T extends TableBaseData>(column: TableColumn<T>): boolean {
  return isTableDataColumn(column) && Boolean(toRawColumn(column).enableColumnFilter);
}

export function getTableLeafColumns<T extends TableBaseData>(columns: TableColumn<T>[]): TableColumn<T>[] {
  return columns.flatMap(column => {
    const groupColumns = toRawColumn(column).columns;

    if (Array.isArray(groupColumns) && groupColumns.length > 0) {
      return getTableLeafColumns(groupColumns);
    }

    return [column];
  });
}

/**
 * Normalize user column definitions into engine-ready definitions.
 *
 * Display/group/type columns without an explicit `id` get a stable generated
 * id. Sorting, filtering, and resizing default to opt-in so presentational
 * columns stay inert unless explicitly enabled.
 */
export function normalizeTableColumns<T extends TableBaseData>(columns: TableColumn<T>[]): TableColumn<T>[] {
  return columns
    .filter(column => !column.hidden)
    .flatMap(column => {
      const nextRawColumn = toRawColumn(column);
      const normalizedColumn = column;
      const groupColumns = nextRawColumn.columns;

      if (Array.isArray(groupColumns)) {
        const nextChildren = normalizeTableColumns(groupColumns);

        if (nextChildren.length === 0) {
          return [];
        }

        return [
          {
            ...normalizedColumn,
            columns: nextChildren
          } as TableColumn<T>
        ];
      }

      const enableColumnFilter = nextRawColumn.enableColumnFilter ?? false;
      // Dotted accessor keys get a silent deep-path accessorFn: the engine's
      // own derived accessor warns in dev whenever an intermediate key is
      // undefined, and docs examples commonly hit that path.
      const dottedKey =
        typeof nextRawColumn.accessorKey === 'string' && nextRawColumn.accessorKey.includes('.')
          ? nextRawColumn.accessorKey
          : undefined;
      const resolvedColumn = {
        ...normalizedColumn,
        enableSorting: nextRawColumn.enableSorting ?? false,
        enableColumnFilter,
        enableResizing: nextRawColumn.enableResizing ?? Boolean(nextRawColumn.resizable),
        accessorFn:
          dottedKey === undefined ? nextRawColumn.accessorFn : (row: T) => getTableRowValueByPath(row, dottedKey),
        filterFn: nextRawColumn.filterFn ?? (enableColumnFilter ? defaultTableFilterFn : undefined)
      } as TableColumn<T>;

      if (nextRawColumn.id) {
        return resolvedColumn;
      }

      // Data columns adopt the accessor key as id (mirroring the engine's own
      // id derivation); type and group columns get stable generated ids.
      return [
        {
          ...resolvedColumn,
          id: isTableDataColumn(resolvedColumn)
            ? getTableColumnKey(resolvedColumn)
            : nextRawColumn.type
              ? `__${nextRawColumn.type}`
              : getTableColumnKey(normalizedColumn)
        }
      ];
    });
}

/**
 * Derive the default column pinning state from column `fixed` fields.
 */
export function getTablePinningFromColumns<T extends TableBaseData>(
  columns: TableColumn<T>[]
): ColumnPinningState | undefined {
  const leafColumns = getTableLeafColumns(columns);
  const start = leafColumns.filter(column => column.fixed === 'start').map(getTableColumnKey);
  const end = leafColumns.filter(column => column.fixed === 'end').map(getTableColumnKey);

  if (start.length === 0 && end.length === 0) {
    return undefined;
  }

  return { start, end };
}

/**
 * Human-readable label of a column: string header first, then key.
 */
export function getTableColumnLabel<T extends TableBaseData>(column: TableColumn<T>): string {
  if (typeof column.header === 'string' && column.header.length > 0) {
    return column.header;
  }

  return getTableColumnKey(column);
}

export function getTableAlign<T extends TableBaseData>(column: TableColumn<T>): CSSProperties['textAlign'] {
  if (!column.align) {
    return column.type ? 'center' : 'start';
  }

  return column.align;
}

export function getTableFilterPlaceholder<T extends TableBaseData>(column: TableColumn<T>) {
  return column.filterPlaceholder;
}

export function getTableColumnFilterOptions<T extends TableBaseData>(
  rows: T[],
  column: TableColumn<T>,
  getValue: (row: T, column: TableColumn<T>) => unknown
): TableColumnFilterOption[] {
  if (column.filterOptions) {
    return typeof column.filterOptions === 'function' ? column.filterOptions({ rows, column }) : column.filterOptions;
  }

  const seenValues = new Set<string>();

  return rows.reduce<TableColumnFilterOption[]>((acc, row) => {
    const optionValue = String(getValue(row, column) ?? '');

    if (!optionValue || seenValues.has(optionValue)) {
      return acc;
    }

    seenValues.add(optionValue);
    acc.push({
      label: optionValue,
      value: optionValue
    });

    return acc;
  }, []);
}
