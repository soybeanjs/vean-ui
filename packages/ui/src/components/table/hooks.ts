import { computed, ref, shallowRef, watch } from 'vue';
import type { Component, Ref, VNode } from 'vue';
import { getTableColumnKey, getTableLeafColumns, isTableGroupColumn } from '@vean/aria/table';
import type { TableBaseData, TableColumn, TableColumnType } from './types';

export type TableColumnCheckTitle = VNode | Component | string;

export interface TableColumnCheck {
  key: string;
  title: TableColumnCheckTitle;
  checked?: boolean;
  hidden?: boolean;
  fixed?: 'start' | 'end';
}

export interface PaginationResult<T> {
  /** Page number */
  page: number;
  /** Page size */
  pageSize: number;
  /** Total count */
  total: number;
  /** List data */
  list: T[];
}

type GetApiData<ApiData, Pagination extends boolean> = Pagination extends true ? PaginationResult<ApiData> : ApiData[];

export interface UseTableBaseOptions<ResponseData, ApiData, Column, Pagination extends boolean> {
  /** api function to get table data */
  api: () => Promise<ResponseData>;
  /** whether to enable pagination */
  pagination?: Pagination;
  /** transform api response to table data */
  transform: (response: ResponseData) => GetApiData<ApiData, Pagination>;
  /** columns factory */
  columns: () => Column[];
  /** get column checks */
  getColumnChecks: (columns: Column[]) => TableColumnCheck[];
  /** get columns */
  getColumns: (columns: Column[], checks: TableColumnCheck[]) => Column[];
  /** callback when response fetched */
  onFetched?: (data: GetApiData<ApiData, Pagination>) => void | Promise<void>;
  /**
   * whether to get data immediately
   *
   * @default true
   */
  immediate?: boolean;
}

function useTableState<
  ResponseData,
  ApiData extends TableBaseData,
  Column extends TableColumn<ApiData>,
  Pagination extends boolean
>(options: UseTableBaseOptions<ResponseData, ApiData, Column, Pagination>) {
  const loading = shallowRef(false);
  const empty = shallowRef(false);
  const { api, pagination, transform, columns, getColumnChecks, getColumns, onFetched, immediate = true } = options;

  // `Ref` annotations keep the inferred types nameable for declaration emit
  // (bare `ref()` would embed non-portable `UnwrapRefSimple`/`LooseRequired` references)
  const tableData: Ref<ApiData[]> = ref([]);
  const columnChecks: Ref<TableColumnCheck[]> = ref(getColumnChecks(columns()));
  const resolvedColumns = computed(() => getColumns(columns(), columnChecks.value));

  function reloadColumns() {
    const checksMap = new Map<string, { checked?: boolean; fixed?: 'start' | 'end' }>();

    columnChecks.value.forEach(({ key, checked, fixed }) => {
      checksMap.set(key, { checked, fixed });
    });

    columnChecks.value = getColumnChecks(columns()).map(check => {
      const stored = checksMap.get(check.key) || {};
      return {
        ...check,
        checked: stored.checked ?? check.checked,
        fixed: stored.fixed ?? check.fixed
      };
    });
  }

  async function fetchData() {
    try {
      loading.value = true;
      const data = transform(await api());
      tableData.value = (pagination ? (data as PaginationResult<ApiData>).list : data) as ApiData[];
      empty.value = tableData.value.length === 0;
      await onFetched?.(data);
    } finally {
      loading.value = false;
    }
  }

  if (immediate) {
    fetchData();
  }

  return {
    loading,
    empty,
    tableData,
    columns: resolvedColumns,
    columnChecks,
    reloadColumns,
    fetchData
  };
}

export type UseTableOptions<ResponseData, ApiData extends TableBaseData, Pagination extends boolean> = Omit<
  UseTableBaseOptions<ResponseData, ApiData, TableColumn<ApiData>, Pagination>,
  'pagination' | 'getColumnChecks' | 'getColumns'
>;

export function useTable<ResponseData, ApiData extends TableBaseData>(
  options: UseTableOptions<ResponseData, ApiData, false>
) {
  const result = useTableState<ResponseData, ApiData, TableColumn<ApiData>, false>({
    ...options,
    getColumnChecks: getDefaultColumnChecks as UseTableBaseOptions<
      ResponseData,
      ApiData,
      TableColumn<ApiData>,
      false
    >['getColumnChecks'],
    getColumns: getDefaultColumns as UseTableBaseOptions<
      ResponseData,
      ApiData,
      TableColumn<ApiData>,
      false
    >['getColumns']
  });

  return result;
}

export type UsePaginatedTableOptions<ResponseData, ApiData extends TableBaseData> = UseTableOptions<
  ResponseData,
  ApiData,
  true
> & {
  page?: number;
  pageSize?: number;
  /**
   * Whether to fetch data when page or pageSize changes.
   *
   * Set this to `false` if you want to handle pagination change manually, such as fetching data in a parent component.
   *
   * In this case, you can listen to `update:page` and `update:pageSize` events to get the current page and page size.
   *
   * @default true
   */
  fetchOnPaginationChange?: boolean;
};

export function usePaginatedTable<ResponseData, ApiData extends TableBaseData>(
  options: UsePaginatedTableOptions<ResponseData, ApiData>
) {
  const { page: _page = 1, pageSize: _pageSize = 10, fetchOnPaginationChange = true, onFetched } = options;

  const page = shallowRef(_page);
  const pageSize = shallowRef(_pageSize);
  const total = shallowRef(0);

  const result = useTableState<ResponseData, ApiData, TableColumn<ApiData>, true>({
    ...options,
    pagination: true,
    getColumnChecks: getDefaultColumnChecks as UseTableBaseOptions<
      ResponseData,
      ApiData,
      TableColumn<ApiData>,
      true
    >['getColumnChecks'],
    getColumns: getDefaultColumns as UseTableBaseOptions<
      ResponseData,
      ApiData,
      TableColumn<ApiData>,
      true
    >['getColumns'],
    onFetched: data => {
      if (data.total && data.total !== total.value) {
        total.value = data.total;
      }
      if (data.page && data.page !== page.value) {
        page.value = data.page;
      }
      if (data.pageSize && data.pageSize !== pageSize.value) {
        pageSize.value = data.pageSize;
      }

      onFetched?.(data);
    }
  });

  watch(
    [page, pageSize],
    () => {
      if (fetchOnPaginationChange) {
        result.fetchData();
      }
    },
    { flush: 'post' }
  );

  return {
    page,
    pageSize,
    total,
    ...result
  };
}

function getDefaultColumnChecks(columns: TableColumn<any>[]) {
  const cols: TableColumnCheck[] = [];

  columns.forEach(col => {
    if (isTableGroupColumn(col)) {
      cols.push(...getDefaultColumnChecks(getTableLeafColumns([col])));
      return;
    }

    const { type, header } = col;
    const rawCol = col as TableColumn<any> & { accessorKey?: string };

    // Group columns are flattened above, so only leaf data columns participate in visibility checks.
    if (type || !rawCol.accessorKey) return;

    const key = getTableColumnKey(col);

    const column: TableColumnCheck = {
      key,
      title: (typeof header === 'string' && header) || key,
      checked: true
    };

    cols.push(column);
  });

  return cols;
}

function getDefaultColumns(columns: TableColumn<any>[], checks: TableColumnCheck[]): TableColumn<any>[] {
  const typeColumnsMap = new Map<TableColumnType, { column: TableColumn<any>; index: number }>();
  const checksMap = new Map(checks.map(check => [check.key, check]));
  const checksOrderMap = new Map(checks.map((check, i) => [check.key, i]));

  columns.forEach((column, index) => {
    if (column.type) {
      typeColumnsMap.set(column.type, { column, index });
    }
  });

  function getGroupColumns(column: TableColumn<any>): TableColumn<any>[] {
    return (column as TableColumn<any> & { columns?: TableColumn<any>[] }).columns ?? [];
  }

  function getMinCheckOrder(column: TableColumn<any>): number {
    if (isTableGroupColumn(column)) {
      const childOrders = getGroupColumns(column).map(child => getMinCheckOrder(child));
      return childOrders.length > 0 ? Math.min(...childOrders) : Infinity;
    }
    return checksOrderMap.get(getTableColumnKey(column)) ?? Infinity;
  }

  const nonTypeColumns = columns.filter(col => !col.type);
  const sortedNonType = [...nonTypeColumns].sort((a, b) => getMinCheckOrder(a) - getMinCheckOrder(b));

  const result = sortedNonType.reduce<TableColumn<any>[]>((acc, column) => {
    if (isTableGroupColumn(column)) {
      const nextChildren = getDefaultColumns(getGroupColumns(column), checks);

      if (nextChildren.length > 0) {
        acc.push({ ...column, columns: nextChildren });
      }

      return acc;
    }

    const check = checksMap.get(getTableColumnKey(column));

    if (check?.checked !== false) {
      acc.push(column);
    }

    return acc;
  }, []);

  typeColumnsMap.forEach(({ column, index }) => {
    if (index >= result.length) {
      result.push(column);
    } else {
      result.splice(index, 0, column);
    }
  });

  return result;
}
