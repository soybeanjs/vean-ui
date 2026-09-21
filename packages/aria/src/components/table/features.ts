import {
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  coreFeatures,
  createCoreRowModel,
  createExpandedRowModel,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_weakEquals,
  rowExpandingFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures
} from '@tanstack/table-core';

/**
 * Fixed feature assembly for the Vean Aria table.
 *
 * Row-model factories and built-in sort/filter function registries are stitched
 * statically so unused table-core capabilities stay out of the bundle.
 */
export const soybeanTableFeatures = tableFeatures({
  ...coreFeatures,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowExpandingFeature,
  rowSortingFeature,
  coreRowModel: createCoreRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text
  },
  filterFns: {
    arrIncludesSome: filterFn_arrIncludesSome,
    equals: filterFn_equals,
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
    weakEquals: filterFn_weakEquals
  }
});

export type SoybeanTableFeatures = typeof soybeanTableFeatures;
