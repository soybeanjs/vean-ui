import type { ShallowRef, ComputedRef, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'vue';
import type {
  Column,
  ColumnDef,
  IdentifiedColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFn,
  Header,
  Row,
  SortDirection,
  SortingState,
  Table as TanStackTable,
  TableOptions
} from '@tanstack/table-core';
import type { BaseProps, CheckedState, Direction, Path, PathValue, ToContext, UiClass } from '../../types';
import type { VirtualizerOptions } from '../virtualizer/types';
import type { SoybeanTableFeatures } from './features';

export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFn,
  SortDirection,
  SortingState
} from '@tanstack/table-core';

/**
 * Engine options accepted by the `tableOptions` prop. Keys owned by the
 * component (data, columns, state wiring, owned change handlers, and the
 * behavior flags it tunes) are omitted; everything else passes through to
 * the TanStack `useTable` call, unlocking features the component does not
 * wire explicitly (pagination, row selection models, manual modes, meta...).
 */
export type TableEngineOptions = Omit<
  Partial<TableOptions<SoybeanTableFeatures, TableBaseData>>,
  | 'features'
  | 'data'
  | 'columns'
  | 'state'
  | 'atoms'
  | 'getRowId'
  | 'getSubRows'
  | 'onSortingChange'
  | 'onColumnFiltersChange'
  | 'onExpandedChange'
  | 'onColumnPinningChange'
  | 'onColumnSizingChange'
  | 'filterFromLeafRows'
  | 'sortDescFirst'
  | 'autoResetExpanded'
  | 'mergeOptions'
>;

/**
 * Engine column instance exposed by the TanStack table.
 */
export type TableEngineColumn<T extends TableBaseData = TableBaseData> = Column<SoybeanTableFeatures, T, any>;

/**
 * Engine row instance exposed by the TanStack table.
 */
export type TableEngineRow<T extends TableBaseData = TableBaseData> = Row<SoybeanTableFeatures, T>;

/**
 * Engine table instance exposed by the TanStack table.
 */
export type TableEngineTable<T extends TableBaseData = TableBaseData> = TanStackTable<SoybeanTableFeatures, T>;

/**
 * Engine header instance exposed by the TanStack table.
 */
export type TableEngineHeader<T extends TableBaseData = TableBaseData> = Header<SoybeanTableFeatures, T, any>;

/**
 * Properties for the TableRoot component.
 */
export interface TableRootProps extends BaseProps {
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
}

/**
 * Properties for the TableScroll component.
 */
export interface TableScrollProps extends BaseProps {}

/**
 * Properties for the TableContent component.
 */
export interface TableContentProps extends BaseProps<TableHTMLAttributes> {}

/**
 * Properties for the TableHeader component.
 */
export interface TableHeaderProps extends BaseProps {}

/**
 * Properties for the TableBody component.
 */
export interface TableBodyProps extends BaseProps {}

/**
 * Properties for the TableFooter component.
 */
export interface TableFooterProps extends BaseProps {}

/**
 * Properties for the TableRow component.
 */
export interface TableRowProps extends BaseProps {}

/**
 * Properties for the TableHead component.
 */
export interface TableHeadProps extends BaseProps<ThHTMLAttributes> {}

/**
 * Properties for the TableCell component.
 */
export interface TableCellProps extends BaseProps<TdHTMLAttributes> {}

/**
 * Available UI slots for the Table component.
 */
export type TableUiSlot =
  | 'root'
  | 'scroll'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'row'
  | 'head'
  | 'cell'
  | 'fixed'
  | 'sortTrigger'
  | 'filterInput'
  | 'resizeHandle'
  | 'treeCell'
  | 'treeToggle'
  | 'treeTogglePlaceholder';

/**
 * UI class overrides for the Table component.
 */
export type TableUi = UiClass<TableUiSlot>;

/**
 * Type information for TableBaseData.
 */
export type TableBaseData = Record<string, any>;

/**
 * Type information for TableRowValue.
 */
export type TableRowValue<T extends TableBaseData = TableBaseData> = Omit<T, 'children'>;

/**
 * Type information for TableAlign.
 */
export type TableAlign = 'start' | 'center' | 'end';

/**
 * Supported table column values.
 */
export type TableColumnType = 'index' | 'selection' | 'expand';

/**
 * Type information for TableSortOrder.
 */
export type TableSortOrder = SortDirection;

/**
 * Type information for TableUnifiedKey.
 */
export type TableUnifiedKey = string | number;

/**
 * Compound filter value stored in `ColumnFiltersState` entries.
 */
export interface TableColumnFilterValue {
  /**
   * Keyword.
   */
  keyword?: string;
  /**
   * Values.
   */
  values?: string[];
}

/**
 * Filter value accepted by the built-in compound filter function.
 */
export type TableFilterValue = string | TableColumnFilterValue;

/**
 * Type information for TableFixedState.
 */
export interface TableFixedState {
  /**
   * Side placement of the component.
   */
  side: 'start' | 'end';
  /**
   * Offset.
   */
  offset: number;
  /**
   * Whether a last start.
   */
  isLastStart: boolean;
  /**
   * Whether a first end.
   */
  isFirstEnd: boolean;
}

/**
 * Type information for TableFixedColumnOffsets.
 */
export interface TableFixedColumnOffsets {
  /**
   * Start offsets.
   */
  startOffsets: Record<string, number>;
  /**
   * End offsets.
   */
  endOffsets: Record<string, number>;
  /**
   * Last start key.
   */
  lastStartKey?: string;
  /**
   * First end key.
   */
  firstEndKey?: string;
}

/**
 * Filter option items rendered by the filter popover.
 */
export interface TableColumnFilterOption {
  /**
   * Label text rendered by the component.
   */
  label: string;
  /**
   * Value associated with the current item.
   */
  value: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

/**
 * Vean-specific column extensions layered on top of the TanStack column definition.
 */
export interface TableColumnExtension<T extends TableBaseData = TableBaseData> {
  /**
   * Nested child columns of a group column, carrying Vean extensions.
   */
  columns?: TableColumn<T>[];
  /**
   * Deep data path of the column value, derived from the row data shape
   * (tree `children` excluded). Overrides the engine's top-level-only
   * `keyof TData` constraint.
   */
  accessorKey?: Path<TableRowValue<T>>;
  /**
   * Text alignment of the column.
   */
  align?: TableAlign;
  /**
   * Built-in column type.
   */
  type?: TableColumnType;
  /**
   * Logical pinned side of the column. Maps to TanStack column pinning state.
   */
  fixed?: 'start' | 'end';
  /**
   * Whether the column is hidden from the table.
   */
  hidden?: boolean;
  /**
   * Whether the column can be resized.
   */
  resizable?: boolean;
  /**
   * Placeholder text of the filter popover.
   */
  filterPlaceholder?: string;
  /**
   * Filter options rendered by the filter popover. When omitted, options are
   * derived from the source rows.
   */
  filterOptions?:
    | TableColumnFilterOption[]
    | ((params: { rows: T[]; column: TableColumn<T> }) => TableColumnFilterOption[]);
}

/**
 * Column definition of the table. TanStack `ColumnDef` is the first citizen;
 * Vean-specific presentation fields ride along as extensions. Built-in
 * type columns (`index` / `selection` / `expand`) and id-less group columns are
 * accepted without an explicit id — the engine layer generates stable ids.
 */
export type TableColumn<T extends TableBaseData = TableBaseData> =
  | (ColumnDef<SoybeanTableFeatures, T, any> & TableColumnExtension<T>)
  | (IdentifiedColumnDef<SoybeanTableFeatures, T, any> & TableColumnExtension<T>);

/**
 * Default compound filter function for `{ keyword, values }` filter values.
 */
export type TableColumnFilterFn<T extends TableBaseData = TableBaseData> = FilterFn<SoybeanTableFeatures, T>;

/**
 * Renderable header cell derived from the TanStack header groups.
 */
export interface TableHeaderCell<T extends TableBaseData = TableBaseData> {
  /**
   * Header id.
   */
  key: string;
  /**
   * Engine header instance.
   */
  header: TableEngineHeader<T>;
  /**
   * Column definition exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Col span.
   */
  colSpan: number;
  /**
   * Row span.
   */
  rowSpan: number;
}

/**
 * Flattened visible row model shared by the compact assembly.
 */
export interface TableTreeRow<T extends TableBaseData = TableBaseData, R extends TableUnifiedKey = TableUnifiedKey> {
  /**
   * Row key resolved by `rowKey`.
   */
  key: R;
  /**
   * Row id used by the engine (string form of the row key).
   */
  id: string;
  /**
   * Original row data.
   */
  row: T;
  /**
   * Engine row instance.
   */
  sourceRow: TableEngineRow<T>;
  /**
   * Nesting level starting from 1.
   */
  level: number;
  /**
   * Parent row key.
   */
  parentKey?: R;
  /**
   * Whether the row has nested children.
   */
  hasChildren: boolean;
}

/**
 * Virtual measurement of a flattened row.
 */
export interface TableVirtualMeasurement {
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Start.
   */
  start: number;
  /**
   * End.
   */
  end: number;
}

/**
 * Virtual window of rendered rows.
 */
export interface TableVirtualRange {
  /**
   * Start index.
   */
  startIndex: number;
  /**
   * End index.
   */
  endIndex: number;
}

/**
 * Type information for TableVisibleRow.
 */
export interface TableVisibleRow<T extends TableBaseData = TableBaseData, R extends TableUnifiedKey = TableUnifiedKey> {
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Current item data.
   */
  item: TableTreeRow<T, R>;
}

/**
 * Properties for the TableSelection component.
 */
export interface TableSelectionProps<R extends TableUnifiedKey = TableUnifiedKey, M extends boolean = false> {
  /**
   * Default selected.
   */
  defaultSelected?: M extends true ? R[] : R;
  /**
   * Whether the item is selected.
   */
  selected?: M extends true ? R[] : R;
  /**
   * Whether multiple values are supported.
   */
  multiple?: M;
}

/**
 * Properties for the TableCompactCell component.
 */
export interface TableCompactCellProps {
  /**
   * Column definition.
   */
  column: TableColumn;
  /**
   * Row.
   */
  row: TableTreeRow;
  /**
   * Index of the current item.
   */
  index: number;
}

/**
 * Properties for the TableCompactExpandedRow component.
 */
export interface TableCompactExpandedRowProps {
  /**
   * Row.
   */
  row: TableTreeRow;
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Colspan.
   */
  colspan: number;
}

/**
 * Properties for the TableCompactHead component.
 */
export interface TableCompactHeadProps {
  /**
   * Engine header instance.
   */
  header: TableEngineHeader;
}

/**
 * Properties for the TableCompactRow component.
 */
export interface TableCompactRowProps {
  /**
   * Row.
   */
  row: TableTreeRow;
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Leaf columns.
   */
  leafColumns: TableColumn[];
}

/**
 * Properties for the TableVirtualSpacerRow component.
 */
export interface TableVirtualSpacerRowProps {
  /**
   * Whether virtual scrolling is enabled.
   */
  isVirtual: boolean;
  /**
   * Number of columns the spacer spans.
   */
  colspan: number;
  /**
   * Padding applied before the start of the row.
   */
  paddingStart: number;
  /**
   * Padding applied after the end of the row.
   */
  paddingEnd: number;
}

/**
 * Slots for the TableCompactCell component.
 */
export type TableCompactCellSlots<T extends TableBaseData> = {
  [K in Path<TableRowValue<T>>]?: (props: TableDataCellSlotProps<T, K>) => any;
} & {
  /**
   * Custom content for the index slot.
   */
  index?: (props: TableIndexSlotProps<T>) => any;
  /**
   * Custom content for the selection slot.
   */
  selection?: (props: TableSelectionSlotProps<T>) => any;
  /**
   * Custom content for the expand slot.
   */
  expand?: (props: TableExpandSlotProps<T>) => any;
  /**
   * Custom content for the tree toggle slot.
   */
  'tree-toggle'?: (props: TableTreeToggleSlotProps<T>) => any;
};

/**
 * Slot properties for the TableHeader component.
 */
export interface TableHeaderSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Column definition exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Engine column instance exposed in the slot scope.
   */
  engineColumn: TableEngineColumn<T>;
  /**
   * Engine table instance exposed in the slot scope (full TanStack API).
   */
  table?: TableEngineTable<T>;
  /**
   * Col span exposed in the slot scope.
   */
  colSpan: number;
  /**
   * Row span exposed in the slot scope.
   */
  rowSpan: number;
  /**
   * Whether sortable.
   */
  sortable: boolean;
  /**
   * Whether filterable.
   */
  filterable: boolean;
  /**
   * Whether filtered.
   */
  filtered: boolean;
  /**
   * Whether resizable.
   */
  resizable: boolean;
  /**
   * Sort order exposed in the slot scope.
   */
  sortOrder?: TableSortOrder;
  /**
   * Whether multiple values are supported.
   */
  multiple?: boolean;
  /**
   * Whether the item is checked.
   */
  checked?: CheckedState;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Update checked exposed in the slot scope.
   */
  updateChecked?: (value: CheckedState | null) => void;
  /**
   * Toggle sort exposed in the slot scope.
   */
  toggleSort: () => void;
  /**
   * Filter value exposed in the slot scope.
   */
  filterValue: string;
  /**
   * Filter values exposed in the slot scope.
   */
  filterValues: string[];
  /**
   * Filter state exposed in the slot scope.
   */
  filterState?: TableFilterValue;
  /**
   * Filter options exposed in the slot scope.
   */
  filterOptions: TableColumnFilterOption[];
  /**
   * Set filter value exposed in the slot scope.
   */
  setFilterValue: (value: string) => void;
  /**
   * Set filter values exposed in the slot scope.
   */
  setFilterValues: (values: string[]) => void;
  /**
   * Set filter state exposed in the slot scope.
   */
  setFilterState: (value: TableFilterValue | undefined) => void;
  /**
   * Toggle filter option exposed in the slot scope.
   */
  toggleFilterOption: (value: string) => void;
  /**
   * Whether the filter option is selected.
   */
  isFilterOptionSelected: (value: string) => boolean;
  /**
   * Clear filter exposed in the slot scope.
   */
  clearFilter: () => void;
}

/**
 * Slot properties for the TableHeaderSelection component.
 */
export interface TableHeaderSelectionSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Column exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Whether multiple values are supported.
   */
  multiple: boolean;
  /**
   * Whether the item is checked.
   */
  checked: CheckedState;
  /**
   * Whether the component is disabled.
   */
  disabled: boolean;
  /**
   * Accessible label for the "select all" control.
   */
  ariaLabel: string;
  /**
   * Update checked exposed in the slot scope.
   */
  updateChecked: (value: CheckedState | null) => void;
}

/**
 * Slot properties for the TableHeaderFilter component.
 */
export interface TableHeaderFilterSlotProps<T extends TableBaseData = TableBaseData> extends Pick<
  TableHeaderSlotProps<T>,
  | 'column'
  | 'filterValue'
  | 'filterValues'
  | 'filterState'
  | 'filtered'
  | 'filterOptions'
  | 'setFilterValue'
  | 'setFilterValues'
  | 'setFilterState'
  | 'toggleFilterOption'
  | 'isFilterOptionSelected'
  | 'clearFilter'
> {}

/**
 * Slot properties for the TableHeaderSort component.
 */
export interface TableHeaderSortSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Aria label exposed in the slot scope.
   */
  ariaLabel: string;
  /**
   * Column exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Sort order exposed in the slot scope.
   */
  sortOrder?: TableSortOrder;
  /**
   * Toggle sort exposed in the slot scope.
   */
  toggleSort: () => void;
}

/**
 * Slot properties for the TableHeaderResize component.
 */
export interface TableHeaderResizeSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Column exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Whether resizing.
   */
  resizing: boolean;
  /**
   * Aria label exposed in the slot scope.
   */
  ariaLabel: string;
  /**
   * Callback invoked when the pointerdown event fires.
   */
  onPointerdown: (event: PointerEvent) => void;
  /**
   * Callback invoked when the keydown event fires.
   */
  onKeydown: (event: KeyboardEvent) => void;
}

/**
 * Slot properties for the TableIndex component.
 */
export interface TableIndexSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Column exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Row exposed in the slot scope.
   */
  row: T;
  /**
   * Level exposed in the slot scope.
   */
  level: number;
  /**
   * Whether the component has children.
   */
  hasChildren: boolean;
}

/**
 * Slot properties for the TableCell component.
 */
export interface TableCellSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Column definition exposed in the slot scope.
   */
  column: TableColumn<T>;
  /**
   * Engine column instance exposed in the slot scope.
   */
  engineColumn?: TableEngineColumn<T>;
  /**
   * Engine table instance exposed in the slot scope (full TanStack API).
   */
  table?: TableEngineTable<T>;
  /**
   * Row exposed in the slot scope.
   */
  row: T;
  /**
   * Level exposed in the slot scope.
   */
  level: number;
  /**
   * Whether the component has children.
   */
  hasChildren: boolean;
  /**
   * Whether expanded.
   */
  expanded: boolean;
  /**
   * Toggle expand exposed in the slot scope.
   */
  toggleExpand: () => void;
}

/**
 * Slot properties for the TableSelection component.
 */
export interface TableSelectionSlotProps<T extends TableBaseData = TableBaseData> extends TableCellSlotProps<T> {
  /**
   * Whether multiple values are supported.
   */
  multiple: boolean;
  /**
   * Whether the item is checked.
   */
  checked: boolean;
  /**
   * Aria label exposed in the slot scope.
   */
  ariaLabel: string;
  /**
   * Toggle select exposed in the slot scope.
   */
  toggleSelect: () => void;
}

/**
 * Slot properties for the TableExpand component.
 */
export interface TableExpandSlotProps<T extends TableBaseData = TableBaseData> extends TableCellSlotProps<T> {
  /**
   * Aria label exposed in the slot scope.
   */
  ariaLabel: string;
}

/**
 * Slot properties for the TableTreeToggle component.
 */
export type TableTreeToggleSlotProps<T extends TableBaseData = TableBaseData> = TableExpandSlotProps<T>;

/**
 * Slot properties for the TableExpandedRow component.
 */
export interface TableExpandedRowSlotProps<T extends TableBaseData = TableBaseData> {
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Row exposed in the slot scope.
   */
  row: T;
  /**
   * Level exposed in the slot scope.
   */
  level: number;
  /**
   * Whether the component has children.
   */
  hasChildren: boolean;
}

/**
 * Payload emitted for table row interaction events.
 */
export interface TableRowEventPayload<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey
> {
  /**
   * Current row data.
   */
  rowData: T;
  /**
   * Current row key.
   */
  rowKey: R;
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Nesting level of the current row.
   */
  level: number;
  /**
   * Whether the current row has children.
   */
  hasChildren: boolean;
}

/**
 * Slot properties for the TableEmpty component.
 */
export interface TableEmptySlotProps {
  /**
   * Column size exposed in the slot scope.
   */
  columnSize: number;
}

/**
 * Slot properties for the TableDataCell component.
 */
export interface TableDataCellSlotProps<
  T extends TableBaseData = TableBaseData,
  K extends Path<TableRowValue<T>> = Path<TableRowValue<T>>
> extends TableCellSlotProps<T> {
  /**
   * Value associated with the current item.
   */
  value: PathValue<TableRowValue<T>, K>;
}

/**
 * Properties for the TableCompact component.
 */
export interface TableCompactProps<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = false
>
  extends TableRootProps, TableSelectionProps<R, M> {
  /**
   * Column definitions. TanStack column defs are the first citizens.
   */
  columns: TableColumn<T>[];
  /**
   * Data.
   */
  data: T[];
  /**
   * Row key.
   */
  rowKey: (row: T) => R;
  /**
   * Nested children resolver used as the engine `getSubRows`.
   */
  getChildren?: (row: T) => T[] | undefined;
  /**
   * Sorting state (TanStack `SortingState`).
   */
  sorting?: SortingState;
  /**
   * Default sorting state.
   */
  defaultSorting?: SortingState;
  /**
   * Engine options passed through to the TanStack `useTable` call. Keys the
   * component owns (data, columns, state wiring, owned change handlers) are
   * overridden by the component; everything else unlocks the full engine
   * surface (pagination, row selection, manual modes, meta, initialState...).
   */
  tableOptions?: TableEngineOptions;
  /**
   * Column filters state (TanStack `ColumnFiltersState`). Filter values accept
   * the compound `{ keyword, values }` shape handled by the built-in filter.
   */
  columnFilters?: ColumnFiltersState;
  /**
   * Default column filters state.
   */
  defaultColumnFilters?: ColumnFiltersState;
  /**
   * Expanded state (TanStack `ExpandedState`).
   */
  expanded?: ExpandedState;
  /**
   * Default expanded state.
   */
  defaultExpanded?: ExpandedState;
  /**
   * Whether to expand all rows by default.
   */
  defaultExpandAll?: boolean;
  /**
   * Column pinning state (TanStack `ColumnPinningState`). Column `fixed`
   * fields seed the default state when this prop is absent.
   */
  columnPinning?: ColumnPinningState;
  /**
   * Default column pinning state.
   */
  defaultColumnPinning?: ColumnPinningState;
  /**
   * Column sizing state (TanStack `ColumnSizingState`, px keyed by column id).
   */
  columnSizing?: ColumnSizingState;
  /**
   * Default column sizing state.
   */
  defaultColumnSizing?: ColumnSizingState;
  /**
   * Indent width applied to nested items.
   */
  indent?: number;
  /**
   * Whether virtual.
   */
  virtual?: boolean;
  /**
   * Height.
   */
  height?: number | string;
  /**
   * Estimate size.
   */
  estimateSize?: number | ((index: number, row: T) => number);
  /**
   * Virtualizer options.
   */
  virtualizerOptions?: VirtualizerOptions;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: TableContentProps;
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: TableHeaderProps;
  /**
   * Properties forwarded to the body element.
   */
  bodyProps?: TableBodyProps;
  /**
   * Properties forwarded to the footer element.
   */
  footerProps?: TableFooterProps;
  /**
   * Properties forwarded to the head element.
   */
  headProps?: TableHeadProps;
  /**
   * Properties forwarded to the row element.
   */
  rowProps?: TableRowProps;
  /**
   * Properties forwarded to the cell element.
   */
  cellProps?: TableCellProps;
}

/**
 * Events for the TableCompact component.
 */
export type TableCompactEmits<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = false
> = {
  /**
   * Emitted when the sorting state value changes.
   */
  'update:sorting': [state: SortingState];
  /**
   * Emitted when the column filters state value changes.
   */
  'update:columnFilters': [state: ColumnFiltersState];
  /**
   * Emitted when the expanded state value changes.
   */
  'update:expanded': [state: ExpandedState];
  /**
   * Emitted when the column pinning state value changes.
   */
  'update:columnPinning': [state: ColumnPinningState];
  /**
   * Emitted when the column sizing state value changes.
   */
  'update:columnSizing': [state: ColumnSizingState];
  /**
   * Emitted when the selected state changes.
   */
  'update:selected': [selected: M extends true ? R[] : R | undefined];
  /**
   * Emitted when a row is clicked.
   */
  rowClick: [event: MouseEvent, payload: TableRowEventPayload<T, R>];
  /**
   * Emitted when a row is double clicked.
   */
  rowDblclick: [event: MouseEvent, payload: TableRowEventPayload<T, R>];
  /**
   * Emitted when a row context menu is triggered.
   */
  rowContextmenu: [event: MouseEvent, payload: TableRowEventPayload<T, R>];
  /**
   * Emitted when the pointer enters a row.
   */
  rowMouseenter: [event: MouseEvent, payload: TableRowEventPayload<T, R>];
  /**
   * Emitted when the pointer leaves a row.
   */
  rowMouseleave: [event: MouseEvent, payload: TableRowEventPayload<T, R>];
};

/**
 * Slots for the TableCompact component.
 */
export type TableCompactSlots<T extends TableBaseData> = {
  [K in `header-${Path<TableRowValue<T>>}`]?: (props: TableHeaderSlotProps<T>) => any;
} & {
  [K in Path<TableRowValue<T>>]?: (props: TableDataCellSlotProps<T, K>) => any;
} & {
  /**
   * Custom content for the bottom slot.
   */
  bottom?: () => any;
  /**
   * Custom content for the header slot.
   */
  header?: (props: TableHeaderSlotProps<T>) => any;
  /**
   * Custom content for the header index slot.
   */
  'header-index'?: (props: { column: TableColumn<T> }) => any;
  /**
   * Custom content for the header selection slot.
   */
  'header-selection'?: (props: TableHeaderSelectionSlotProps<T>) => any;
  /**
   * Custom content for the header expand slot.
   */
  'header-expand'?: (props: { column: TableColumn<T> }) => any;
  /**
   * Custom content for the header filter slot.
   */
  'header-filter'?: (props: TableHeaderFilterSlotProps<T>) => any;
  /**
   * Custom content for the header sort slot.
   */
  'header-sort'?: (props: TableHeaderSortSlotProps<T>) => any;
  /**
   * Custom content for the header resize slot.
   */
  'header-resize'?: (props: TableHeaderResizeSlotProps<T>) => any;
  /**
   * Custom content for the index slot.
   */
  index?: (props: TableIndexSlotProps<T>) => any;
  /**
   * Custom content for the selection slot.
   */
  selection?: (props: TableSelectionSlotProps<T>) => any;
  /**
   * Custom content for the expand slot.
   */
  expand?: (props: TableExpandSlotProps<T>) => any;
  /**
   * Custom content for the expanded row slot.
   */
  'expanded-row'?: (props: TableExpandedRowSlotProps<T>) => any;
  /**
   * Custom content for the tree toggle slot.
   */
  'tree-toggle'?: (props: TableTreeToggleSlotProps<T>) => any;
  /**
   * Custom content for the empty slot.
   */
  empty?: (props: TableEmptySlotProps) => any;
  /**
   * Custom content for the footer slot.
   */
  footer?: (props: { columnSize: number }) => any;
};

/**
 * Context for the TableCompact component.
 */
export interface TableCompactContext extends ToContext<
  TableCompactProps,
  'indent' | 'headProps' | 'rowProps' | 'cellProps'
> {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Row key used by the component context.
   */
  rowKey: (row: TableBaseData) => TableUnifiedKey;
  /**
   * Engine table instance.
   */
  table: TableEngineTable;
  /**
   * Sorting state used by the component context.
   */
  sorting: ShallowRef<SortingState>;
  /**
   * Column filters state used by the component context.
   */
  columnFilters: ShallowRef<ColumnFiltersState>;
  /**
   * Expanded state used by the component context.
   */
  expanded: ShallowRef<ExpandedState>;
  /**
   * Expanded state visible to the renderer (forces expansion while filtering).
   */
  visibleExpanded: ComputedRef<ExpandedState>;
  /**
   * Column pinning state used by the component context.
   */
  columnPinning: ShallowRef<ColumnPinningState>;
  /**
   * Column sizing state used by the component context.
   */
  columnSizing: ShallowRef<ColumnSizingState>;
  /**
   * Whether the component is filtering.
   */
  isFiltering: ComputedRef<boolean>;
  /**
   * Selected used by the component context.
   */
  selected: ShallowRef<TableUnifiedKey[] | TableUnifiedKey | undefined>;
  /**
   * Callback invoked when the selected changes.
   */
  onSelectedChange: (value: TableUnifiedKey) => void;
  /**
   * Set selected used by the component context.
   */
  setSelected: (value: TableUnifiedKey[] | TableUnifiedKey | undefined) => void;
  /**
   * Reset selected used by the component context.
   */
  resetSelected: () => void;
  /**
   * Whether the value is selected.
   */
  isValueSelected: (value: TableUnifiedKey) => boolean;
  /**
   * Whether multiple values are supported.
   */
  multiple: ComputedRef<boolean>;
  /**
   * Leaf columns used by the component context.
   */
  leafColumns: ComputedRef<TableColumn[]>;
  /**
   * Source rows used by the component context.
   */
  sourceRows: ComputedRef<TableBaseData[]>;
  /**
   * Whether the component has tree rows.
   */
  hasTreeRows: ComputedRef<boolean>;
  /**
   * Tree column key used by the component context.
   */
  treeColumnKey: ComputedRef<string | undefined>;
  /**
   * Whether the component has expand column.
   */
  hasExpandColumn: ComputedRef<boolean>;
  /**
   * Whether the component has expanded row slot.
   */
  hasExpandedRowSlot: ComputedRef<boolean>;
  /**
   * Visible row keys used by the component context.
   */
  visibleRowKeys: ComputedRef<TableUnifiedKey[]>;
  /**
   * Whether the header selection is disabled.
   */
  isHeaderSelectionDisabled: ComputedRef<boolean>;
  /**
   * Header selection used by the component context.
   */
  headerSelection: ComputedRef<CheckedState>;
  /**
   * Fixed column states used by the component context.
   */
  fixedColumnStates: ComputedRef<TableFixedColumnOffsets>;
  /**
   * Resizing column key used by the component context.
   */
  resizingColumnKey: ShallowRef<string | null>;
  /**
   * Measured column widths used by the component context.
   */
  measuredColumnWidths: ShallowRef<Record<string, number>>;
  /**
   * Head cell elements used by the component context.
   */
  headCellElements: Record<string, HTMLElement | null>;
}
