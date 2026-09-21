import type {
  TableBaseData,
  TableColumn,
  TableColumnFilterOption,
  TableColumnFilterValue,
  TableColumnType,
  TableCompactProps,
  TableCompactEmits,
  TableCompactSlots,
  TableHeaderFilterSlotProps,
  TableUnifiedKey,
  TableSortOrder,
  TableUiSlot
} from '@vean/aria/table';
import type { ClassValue, UiClass } from '@vean/aria/types';
import type { TableVariant } from '@/styles/table';
import type { ThemeSize } from '@/theme';

/**
 * Additional UI slots for the table component.
 */
export type TableExtraUiSlot =
  | 'selection'
  | 'filterTrigger'
  | 'filterPopup'
  | 'filterSearch'
  | 'filterOptions'
  | 'filterOption'
  | 'filterOptionLabel'
  | 'filterFooter'
  | 'filterCount'
  | 'filterAction'
  | 'filterEmpty';

/**
 * Extended UI class overrides for the Table component.
 */
export type TableExtendedUi = UiClass<TableUiSlot | TableExtraUiSlot>;

/**
 * Properties for the Table component.
 */
export interface TableProps<
  T extends TableBaseData = TableBaseData,
  R extends string | number = string | number,
  M extends boolean = false
> extends TableCompactProps<T, R, M> {
  /**
   * Additional class names to apply to the table.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<TableExtendedUi>;
  /**
   * Visual variant of the component.
   */
  variant?: TableVariant;
  /**
   * Whether bordered.
   */
  bordered?: boolean;
  /**
   * Whether rounded.
   */
  rounded?: boolean;
  /**
   * Whether striped.
   */
  striped?: boolean;
}

/**
 * Events for the Table component.
 */
export type TableEmits<
  T extends TableBaseData = TableBaseData,
  R extends TableUnifiedKey = TableUnifiedKey,
  M extends boolean = false
> = TableCompactEmits<T, R, M>;

/**
 * Slots for the Table component.
 */
export type TableSlots<T extends TableBaseData = TableBaseData> = TableCompactSlots<T>;

/**
 * Properties for the TableRadio component.
 */
export interface TableRadioProps {
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Whether the item is checked.
   */
  checked?: boolean;
}

/**
 * Type information for TableFilterPopoverOption.
 */
export interface TableFilterPopoverOption {
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
 * Properties for the TableFilterPopover component.
 */
export interface TableFilterPopoverProps<
  T extends TableBaseData = TableBaseData
> extends TableHeaderFilterSlotProps<T> {
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui: TableExtendedUi;
}

export type {
  TableBaseData,
  TableColumn,
  TableColumnFilterOption,
  TableColumnFilterValue,
  TableColumnType,
  TableSortOrder
};
