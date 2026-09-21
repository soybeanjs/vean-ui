---
head:
  title: Table
  description: 'A data table component for displaying row and column data. STable combines the Aria TableCompact aggregation component (9 zero-style base primitives in the TableRoot family) with the tableVariants style recipe (29 slots, 7 sizes × 2 visual variants). Supports a config-driven columns model (grouped headers, index/selection/expand type columns), sorting, filtering, multi/single selection, expandable and tree rows, fixed columns/headers, drag-and-keyboard column resizing, virtualization, and empty states; default/simple variants plus bordered/rounded/striped toggles. All interaction text and aria-labels (sorting, filtering, selection, expansion, column resize) are localized via useLocaleMessages.'
---

# Table

## Overview

A data table component for displaying row and column data. `STable` combines the Aria `TableCompact` aggregation component (9 zero-style base primitives in the `TableRoot` family) with the `tableVariants` style recipe (29 slots, 7 sizes × 2 visual variants). Supports a **config-driven `columns` model** (grouped headers, `index`/`selection`/`expand` type columns), sorting, filtering, multi/single selection, expandable and tree rows, fixed columns/headers, drag-and-keyboard column resizing, virtualization, and empty states; `default`/`simple` variants plus `bordered`/`rounded`/`striped` toggles. All interaction text and `aria-label`s (sorting, filtering, selection, expansion, column resize) are localized via `useLocaleMessages`.

## Usage

<UsageCode component="table" />

## Features

- 📋 Config-driven columns — TanStack-first `columns: TableColumn<T>[]` (`accessorKey`/`header`/`size`/`minSize` + VeanUI `align`/`type`/`fixed`/`hidden` extensions), grouped headers (`columns`), `index`/`selection`/`expand` type columns; `rowKey` keeps row identity stable
- 🔀 Sorting — `enableSorting: true` (or `sortFn` comparator) on a column; controlled `sorting` / `v-model:sorting` (TanStack `SortingState`); `aria-sort` + localized sort-button `aria-label`
- 🔍 Filtering — `enableColumnFilter: true` (+ `filterPlaceholder`/`filterOptions`); compound `{ keyword, values }` filter values, keyword search, option multi-select, summary count, and clear action are all localized; state is TanStack `ColumnFiltersState` (`v-model:columnFilters`)
- ✅ Selection — multi-select by default (`multiple` defaults to `true`, checkboxes + header select-all); `multiple={false}` switches to single-select (row radio); controlled `selected` / `v-model:selected`
- 🧩 Expandable & tree rows — `expand` type column or the `expanded-row` slot renders expanded rows; `children`/`getChildren` drive tree rows (engine `getSubRows`); `expanded` follows TanStack `ExpandedState`
- 📐 Fixed & resizable — `fixed: 'start' | 'end'` seeds TanStack column pinning with gradient shadow indicators; `resizable` columns support pointer drag and arrow-key resizing writing TanStack `columnSizing` (localized `aria-label`)
- ⚡ Performance — `virtual` + `height` enable virtualization (custom `estimateSize`/`virtualizerOptions`), rendering only visible rows
- 🎛️ Engine escape hatch — slot props carry `table`/`engineColumn` engine instances, `useTableEngine()` injects the engine anywhere inside the table subtree, the template ref exposes `table`, and the `tableOptions` prop passes raw TanStack options through (pagination, row selection, manual modes, meta, `initialState`...)
- 🌐 Localized by default — empty state, sort/filter/select/expand/resize `aria-label`s, and the filter popover copy all use `useLocaleMessages` (21 `table.*` messages across 14 language packs)

## Component family

- `STable` (styled) — entry wrapper; `tableVariants` recipe (29 slots = 16 Aria slots + 11 filter/selection extra slots + 2 internal radio slots); `useOmitProps` forwarding + `useForwardListeners` event merging + full slot passthrough; injects default `header-selection`/`selection`/`header-sort`/`header-filter`/`header-resize`/`tree-toggle`/`expand`/`empty` slot content
- `TableCompact` (Aria) — aggregation state owner over the **`@tanstack/vue-table` engine**: `useTableCompactState` (`sorting`/`columnFilters`/`expanded`/`columnPinning`/`columnSizing` via `useControllableState`, `selected`/`multiple` via `useSelection`), `useTableCompactTable` (engine instance wiring), `useTableCompactData` (header groups/leaf columns/row model), `useTableCompactResize` (pointer + keyboard column widths), `useTableCompactVirtual`; `provideTableCompactContext` bridges the 9 primitives
- `TableRoot` (Aria) — root element, `dir` direction, renders `data-vean-table-root` and the table semantic container
- `TableScroll` / `TableContent` / `TableHeader` / `TableBody` / `TableFooter` / `TableRow` / `TableHead` / `TableCell` (Aria) — 9 base primitives, all zero-style, each rendering `data-vean-table-*` data attributes
- `TableCompactHead` / `TableCompactRow` / `TableCompactCell` / `TableCompactExpandedRow` / `TableVirtualSpacerRow` (Aria internal) — composition and rendering components inside the Compact aggregation (not publicly exported)
- `STableFilterPopover` (styled internal) — the filter popover (SPopover + SInput + SCheckbox + SButton) with localized search/options/summary/clear
- `STableRadio` (styled internal) — the row radio used in single-select mode (`aria-pressed` semantics), consuming the `radioRoot`/`radioIndicator` recipe slots directly
- `useTable` / `usePaginatedTable` (UI hooks) — client-side sort/filter/pagination composition hooks

## Demos

<PlaygroundGallery component="table" />

- 01 Basic — plain `columns` + `data` rendering
- 02 Variant — `default` / `simple` visual variants
- 03 Bordered — `bordered` toggle
- 04 Rounded — `rounded` toggle
- 05 Striped — `striped` zebra rows
- 06 Empty — empty state (default `SEmpty` and custom `empty` slot)
- 07 Grouped — grouped headers (`columns`)
- 08 Sorting — `enableSorting` + `sortFn` with controlled/uncontrolled sorting
- 09 Filtering — `enableColumnFilter` options and the keyword filter popover
- 10 Fixed — `fixed: 'start' | 'end'` fixed columns
- 11 Resizable — `resizable` drag/keyboard column resize
- 12 Tree — tree rows (`children` data + `tree-toggle`)
- 13 Virtualized — `virtual` + `height` virtualization
- 14 Expandable — `expand` column and `expanded-row` slot
- 15 Footer — `footer` summary slot
- 16 Bottom — `bottom` slot
- 17 Multiple Selection — multi-select (checkboxes + select-all)
- 18 Single Selection — `multiple={false}` single-select (radio)
- 19 Row Events — `rowClick`/`rowDblclick`/`rowContextmenu` row events
- 20 Sizes — 7 sizes (xs–2xl)

## API

<ComponentApi component="table" />

## Notes

### Architecture and benchmark differences

The table engine is [`@tanstack/vue-table`](https://tanstack.com/table) (v9): column defs, sorting, filtering, expanding, pinning, and sizing follow TanStack state contracts (`SortingState`, `ColumnFiltersState`, `ExpandedState`, `ColumnPinningState`, `ColumnSizingState`), and all of them are controlled/uncontrolled dual channels via `useControllableState` + `useSelection`; all base primitives stay zero-style and only the UI wrapper injects `tableVariants` classes. The filter popover and single-select radio are UI-internal components consumed by default slots, but consumers can replace them entirely via same-name slots (`header-filter`/`selection`, etc.). Sort buttons and filter triggers are absolutely-positioned icon buttons with localized `aria-label`s; column resizing supports both pointer (`PointerEvent`) and keyboard (arrow-key) channels. Virtualization uses the built-in `@vean/aria` virtualizer, rendering only visible rows while syncing measured column widths. Ant Design / Element Plus tables are declarative component instances (`el-table-column`) whose fixed columns rely on config classes; Vean's controlled state, `aria-sort` semantics, and full-chain localization (including the filter popover) exceed most mainstream libraries.

| Capability                            | VeanUI | Ant Design | Element Plus | Naive UI | Mantine Table |
| :------------------------------------ | :----: | :--------: | :----------: | :------: | :-----------: |
| Aria/styled split                     |   ✅   |     —      |      —       |    —     |       —       |
| Config columns + grouped headers      |   ✅   |     ✅     |      ✅      |    ✅    |      ✅       |
| Sorting (aria-sort + controlled)      |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| Filtering (keyword + multi-select)    |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| Selection (multi/single + select-all) |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| Expandable + tree rows                |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| Fixed columns / fixed header          |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| Drag + keyboard column resize         |   ✅   |     ✅     |      ⚠️      |    ✅    |       —       |
| Virtualization                        |   ✅   |     ✅     |      ⚠️      |    ✅    |      ⚠️       |

`⚠️` = partial support (Mantine Table's sorting/filtering/selection are manual; Element Plus virtualization only exists in the separate `el-table-v2`; Element Plus drag-resize requires `border` mode).

### Cautions

- Columns are TanStack `ColumnDef`s first: data columns use `accessorKey` (or `accessorFn`), `header` for the label, `size`/`minSize` for pixel widths. The legacy `dataIndex`/`title` fields have been removed — rename them to `accessorKey`/`header`.
- Sorting, filtering, and resizing are opt-in per column: `enableSorting`, `enableColumnFilter`, `resizable` (all default `false`).
- Group columns nest via `columns` (TanStack shape); tree rows nest via the row `children` field or `getChildren` — these are different concepts and different fields.
- `multiple` defaults to `true` (multi-select); setting it to `false` renders row radios, makes `selected` a single value (`R | undefined`), and hides the header select-all checkbox.
- Sorting/filtering/expansion/pinning/sizing are all **controlled/uncontrolled dual channels**: when passing `sorting` (etc.) you must also listen for the matching `update:sorting` (or use `v-model:sorting`) to write back, otherwise state does not update.
- The controlled `expanded` state is a TanStack `ExpandedState` keyed by `String(rowKey(row))` (`{ '1': true }`, or `true` for all); `defaultExpandAll` only applies when expansion is uncontrolled.
- While a column filter is active, tree rows are force-expanded so filtered ancestors stay visible.
- Virtualization requires `height`; without it `virtual` is ignored (falls back to normal rendering).
- Fixed columns inject a background on `data-fixed` cells; fixed-column shadows are drawn via the `data-fixed-last-start`/`data-fixed-first-end` data attributes — keep these attributes when customizing `cell`/`row` slots to preserve the visuals.
- Filter popover copy (summary, keyword, options, clear) and the empty state follow the `ConfigProvider` locale; the column label falls back through `header` → `id`/`accessorKey`.

## FAQ

### How do I select rows and read the selected data?

Use `multiple` (multi-select by default) with `v-model:selected` and `rowKey`:

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id" v-model:selected="selected" />
```

`selected` is an array of the selected rows' `rowKey`s; map them back to `data` when you need the full row objects.

### How do I make a single-select table?

Set `multiple={false}` — row radios render and `selected` becomes a single value:

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id" :multiple="false" v-model:selected="selected" />
```

### How do I customize the filter popover?

Replace the default `STableFilterPopover` entirely with the `header-filter` slot, or configure `filter` options and keyword matching on the column:

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id">
  <template #header-filter="{ column, filtered, filterValues, setFilterValues, clearFilter }">
    <!-- custom filter control -->
  </template>
</STable>
```

### How do I set the initial sort/filter state?

Seed the uncontrolled `defaultSorting`/`defaultColumnFilters`, then let the component maintain state internally; switch to the controlled channels and listen for `update:sorting`/`update:columnFilters` when you need external sync:

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id" :default-sorting="[{ id: 'age', desc: false }]" />
```

### How do I handle large datasets?

Enable virtualization (`virtual` + `height`) and tune `estimateSize` as needed; the engine row models are memoized, so 1000-row workloads need no extra handling.

### How do I render a summary/footer row?

Use the `footer` slot — it receives `columnSize`, letting you render summary cells per column:

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id">
  <template #footer="{ columnSize }">
    <STableRow>
      <STableCell :colspan="columnSize">Total: {{ data.length }} items</STableCell>
    </STableRow>
  </template>
</STable>
```

### How do I localize table copy?

The empty state and all interaction `aria-label`s (sort/filter/select/expand/resize) follow the `ConfigProvider` `locale` (`table.*` messages, 14 language packs); override per instance via `ConfigProvider` `messages`, or use the same-name slots for fully custom content.

## Engine escape hatch

`STable` is a component-driven wrapper, but the TanStack engine is never locked away — four graded escape hatches:

1. **Slot props** — every header/data-cell slot receives `table` (the engine table instance) and `engineColumn` (the engine column instance) alongside `column`/`row`/`value`:

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id">
  <template #age="{ value, table }">
    {{ value }} ({{ table.getPreFilteredRowModel().flatRows.length }} rows total)
  </template>
</STable>
```

2. **`useTableEngine()`** — inject the engine from any component rendered inside the table subtree (deep custom cells, toolbar widgets):

```ts
import { useTableEngine } from '@vean/aria/table';

const table = useTableEngine();

table.value.setGrouping([{ id: 'city' }]);
```

3. **Template ref** — the engine instance is the exposed root, so control the table directly from outside:

```ts
const tableRef = useTemplateRef<TableEngineTable>('tableRef');

tableRef.value.previousPage();
```

4. **`tableOptions` prop** — pass raw TanStack table options through for everything the component does not wire explicitly (pagination, row selection models, manual server modes, `meta`, `initialState`, faceted values...). Keys the component owns (state wiring, change handlers) take precedence:

```vue
<STable
  :columns="columns"
  :data="data"
  :row-key="row => row.id"
  :table-options="{
    enableRowSelection: true,
    getFilteredSelectedRowModel: createFilteredSelectedRowModel()
  }"
/>
```

Cell customization priority: named slot > `columnDef.cell` render function (TanStack-native, rendered via `FlexRender`) > plain value text. Headers follow the same chain with `columnDef.header`.

## Migration from v0.4x

v0.50.0 replaces the hand-rolled column model with [`@tanstack/vue-table`](https://tanstack.com/table). TanStack naming is the first citizen and legacy fields get no aliases (`dataIndex` / `sortState` and friends must be renamed by hand); the most frequent legacy fields map as follows:

| v0.4x (legacy)                            | v0.50.0 (TanStack-first)                                           |
| :---------------------------------------- | :----------------------------------------------------------------- |
| `{ title, dataIndex }`                    | `{ header, accessorKey }` (`dataIndex` alias removed)              |
| `sorter: true` / `sorter(a, b)`           | `enableSorting: true` / `sortFn: (rowA, rowB) => number`           |
| `filter: true` / `filter: { ... }`        | `enableColumnFilter: true` / `filterPlaceholder` / `filterOptions` |
| `width: '140px'` / `minWidth`             | `size: 140` / `minSize` (px numbers)                               |
| group column `{ key, children }`          | `{ id, columns }` (TanStack group shape)                           |
| `sortState` / `defaultSortState`          | `sorting` / `defaultSorting` (`SortingState`) — alias removed      |
| `filterState` / `defaultFilterState`      | `columnFilters` / `defaultColumnFilters` (`ColumnFiltersState`)    |
| `columnWidths` / `defaultColumnWidths`    | `columnSizing` / `defaultColumnSizing` (`Record<string, number>`)  |
| `expanded: R[]`                           | `expanded: ExpandedState` (`{ '1': true }` or `true`)              |
| `update:sortState` / `update:filterState` | `update:sorting` / `update:columnFilters`                          |

### Before / after

```vue
<!-- v0.4x -->
<script setup>
const columns = [
  { title: 'Name', dataIndex: 'name', sorter: true, width: '180px' },
  { title: 'Age', dataIndex: 'age', align: 'center', filter: true }
];
const expanded = ref([1]);
</script>

<!-- v0.50.0 -->
<script setup>
const columns = [
  { header: 'Name', accessorKey: 'name', enableSorting: true, size: 180 },
  { header: 'Age', accessorKey: 'age', align: 'center', enableColumnFilter: true }
];
const expanded = ref({ 1: true });
</script>
```
