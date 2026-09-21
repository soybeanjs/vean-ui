---
head:
  title: 表格
  description: 用于展示行列数据的数据表格组件。STable 将 Aria 层 TableCompact 聚合组件（TableRoot 一族的 9 个基础原语，零样式）与 tableVariants 样式配方（29 个槽位，7 种尺寸 × 2 种视觉变体）组合。支持配置式 columns（分组表头、index/selection/expand 类型列）、排序、筛选、多选/单选、展开行与树形行、固定列/表头、列宽拖拽调整与键盘调整、虚拟滚动与空状态展示；default/simple 两种变体配合 bordered/rounded/striped 开关。所有交互文案与 aria-label（排序、筛选、选择、展开、列宽调整）均经 useLocaleMessages 本地化。
---

# 表格

## 概述

用于展示行列数据的数据表格组件。`STable` 将 Aria 层 `TableCompact` 聚合组件（`TableRoot` 一族的 9 个基础原语，零样式）与 `tableVariants` 样式配方（29 个槽位，7 种尺寸 × 2 种视觉变体）组合。支持**配置式 `columns`**（分组表头、`index`/`selection`/`expand` 类型列）、排序、筛选、多选/单选、展开行与树形行、固定列/表头、列宽拖拽调整与键盘调整、虚拟滚动与空状态展示；`default`/`simple` 两种变体配合 `bordered`/`rounded`/`striped` 开关。所有交互文案与 `aria-label`（排序、筛选、选择、展开、列宽调整）均经 `useLocaleMessages` 本地化。

## 用法

<UsageCode component="table" />

## 特性

- 📋 配置式列模型 — TanStack 优先的 `columns: TableColumn<T>[]`（`accessorKey`/`header`/`size`/`minSize` + VeanUI 扩展 `align`/`type`/`fixed`/`hidden`），分组表头（`columns`）、`index`/`selection`/`expand` 类型列；`rowKey` 保证行身份稳定
- 🔀 排序 — 列上 `enableSorting: true`（或 `sortFn` 自定义比较）；受控 `sorting` / `v-model:sorting`（TanStack `SortingState`）；`aria-sort` + 排序按钮 `aria-label` 本地化
- 🔍 筛选 — 列上 `enableColumnFilter: true`（+ `filterPlaceholder`/`filterOptions`）；`{ keyword, values }` 复合筛选值，弹层内关键字搜索、选项多选、汇总计数与清除操作全部本地化；状态为 TanStack `ColumnFiltersState`（`v-model:columnFilters`）
- ✅ 选择 — 默认多选（`multiple` 默认 `true`，复选框 + 表头全选），`multiple={false}` 切换为单选（行内 radio）；受控 `selected` / `v-model:selected`
- 🧩 展开与树形 — `expand` 类型列或 `expanded-row` 插槽渲染展开行；`children`/`getChildren` 驱动树形行（引擎 `getSubRows`）；`expanded` 遵循 TanStack `ExpandedState`
- 📐 固定与调整 — `fixed: 'start' | 'end'` 播种 TanStack 列固定（pinning）+ 阴影渐变指示；`resizable` 列支持指针拖拽与方向键键盘调整，写入 TanStack `columnSizing`（`aria-label` 本地化）
- ⚡ 性能 — `virtual` + `height` 启用虚拟滚动（自定义 `estimateSize`/`virtualizerOptions`），仅渲染可视行
- 🎛️ 引擎逃生舱 — 插槽 props 携带 `table`/`engineColumn` 引擎实例；`useTableEngine()` 在表格子树任意位置注入引擎；模板 ref 暴露 `table`；`tableOptions` prop 透传原始 TanStack 选项（分页、行选择、manual 服务端模式、meta、`initialState`...）
- 🌐 默认本地化 — 空状态、排序/筛选/选择/展开/列宽调整的 `aria-label` 与筛选弹层文案全部经 `useLocaleMessages`（21 条 `table.*` 消息，14 语言包）

## 组件家族

- `STable`（styled）— 入口包装；`tableVariants` 配方（29 槽位 = 16 个 Aria 槽 + 11 个筛选/选择扩展槽 + 2 个内部 radio 槽）；`useOmitProps` 转发 + `useForwardListeners` 事件合并 + 全插槽透传；注入默认 `header-selection`/`selection`/`header-sort`/`header-filter`/`header-resize`/`tree-toggle`/`expand`/`empty` 插槽内容
- `TableCompact`（Aria）— 聚合状态所有者，构建在 **`@tanstack/vue-table` 引擎**之上：`useTableCompactState`（`sorting`/`columnFilters`/`expanded`/`columnPinning`/`columnSizing` 经 `useControllableState`，`selected`/`multiple` 经 `useSelection`）、`useTableCompactTable`（引擎实例接线）、`useTableCompactData`（表头分组/叶子列/行模型）、`useTableCompactResize`（指针 + 键盘列宽）、`useTableCompactVirtual`；`provideTableCompactContext` 桥接 9 个原语
- `TableRoot`（Aria）— 根元素，`dir` 方向，渲染 `data-vean-table-root` 与表语义容器
- `TableScroll` / `TableContent` / `TableHeader` / `TableBody` / `TableFooter` / `TableRow` / `TableHead` / `TableCell`（Aria）— 9 个基础原语，全部零样式，渲染 `data-vean-table-*` 数据属性
- `TableCompactHead` / `TableCompactRow` / `TableCompactCell` / `TableCompactExpandedRow` / `TableVirtualSpacerRow`（Aria 内部）— Compact 聚合内部的组合与渲染组件（不对外导出）
- `STableFilterPopover`（styled 内部）— 筛选弹层（SPopover + SInput + SCheckbox + SButton），本地化搜索/选项/汇总/清除
- `STableRadio`（styled 内部）— 单选模式的行内 radio 按钮（`aria-pressed` 语义），直接消费 `tableVariants` 的 `radioRoot`/`radioIndicator` 槽
- `useTable` / `usePaginatedTable`（UI hooks）— 客户端排序/筛选/分页组合钩子

## 演示

<PlaygroundGallery component="table" />

- 01 Basic — 基础 `columns` + `data` 渲染
- 02 Variant — `default` / `simple` 视觉变体
- 03 Bordered — `bordered` 边框开关
- 04 Rounded — `rounded` 圆角开关
- 05 Striped — `striped` 斑马纹
- 06 Empty — 空状态（默认 SEmpty 与自定义 `empty` 插槽）
- 07 Grouped — 分组表头（`columns`）
- 08 Sorting — `enableSorting` + `sortFn` + 受控/非受控排序
- 09 Filtering — `enableColumnFilter` 选项与关键字筛选弹层
- 10 Fixed — `fixed: 'start' | 'end'` 固定列
- 11 Resizable — `resizable` 列宽拖拽/键盘调整
- 12 Tree — 树形行（数据 `children` + `tree-toggle`）
- 13 Virtualized — `virtual` + `height` 虚拟滚动
- 14 Expandable — `expand` 列与 `expanded-row` 插槽
- 15 Footer — `footer` 汇总插槽
- 16 Bottom — `bottom` 底部插槽
- 17 Multiple Selection — 多选（复选框 + 全选）
- 18 Single Selection — `multiple={false}` 单选（radio）
- 19 Row Events — `rowClick`/`rowDblclick`/`rowContextmenu` 等行事件
- 20 Sizes — 7 种尺寸（xs–2xl）

## API

<ComponentApi component="table" />

## 说明

### 架构与对标差异

表格引擎为 [`@tanstack/vue-table`](https://tanstack.com/table)（v9）：列定义、排序、筛选、展开、固定、列宽均遵循 TanStack 状态契约（`SortingState`、`ColumnFiltersState`、`ExpandedState`、`ColumnPinningState`、`ColumnSizingState`），且全部经 `useControllableState` + `useSelection` 提供受控/非受控双通道；所有基础原语保持零样式，仅 UI 包装注入 `tableVariants` 类名。筛选弹层与单选 radio 作为 UI 内部组件被默认插槽消费，但消费者可用同名插槽（`header-filter`/`selection` 等）整体替换。排序按钮与筛选触发器为绝对定位图标按钮，配合本地化 `aria-label` 保持可访问；列宽调整同时支持指针（`PointerEvent`）与键盘（方向键）两种通道。虚拟滚动基于 `@vean/aria` 内置 virtualizer，仅渲染可视行并同步测量列宽。而 Ant Design / Element Plus 的表格为声明式组件实例（`el-table-column`），固定列依赖配置类名；VeanUI 的受控状态与 `aria-sort` 语义、以及全链路本地化（含筛选弹层）超出多数主流库。

| 能力                            | VeanUI | Ant Design | Element Plus | Naive UI | Mantine Table |
| :------------------------------ | :----: | :--------: | :----------: | :------: | :-----------: |
| Aria/样式分离                   |   ✅   |     —      |      —       |    —     |       —       |
| 配置式 columns + 分组表头       |   ✅   |     ✅     |      ✅      |    ✅    |      ✅       |
| 排序（aria-sort + 受控/非受控） |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| 筛选（关键字 + 选项多选）       |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| 选择（多选/单选 + 全选）        |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| 展开行 + 树形行                 |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| 固定列 / 固定表头               |   ✅   |     ✅     |      ✅      |    ✅    |      ⚠️       |
| 列宽拖拽 + 键盘调整             |   ✅   |     ✅     |      ⚠️      |    ✅    |       —       |
| 虚拟滚动                        |   ✅   |     ✅     |      ⚠️      |    ✅    |      ⚠️       |

`⚠️` = 部分支持（Mantine Table 的排序/筛选/选择为手动实现；Element Plus 虚拟滚动仅存在于独立的 `el-table-v2`；Element Plus 列宽拖拽仅限 `border` 模式）。

### 注意事项

- 列定义为 TanStack `ColumnDef` 优先：数据列用 `accessorKey`（或 `accessorFn`），`header` 为标题，`size`/`minSize` 为像素列宽。旧 `dataIndex`/`title` 字段已移除，需重命名为 `accessorKey`/`header`。
- 排序、筛选、调整列宽均为列级 opt-in：`enableSorting`、`enableColumnFilter`、`resizable`（默认全为 `false`）。
- 分组列经 `columns` 嵌套（TanStack 形状）；树形行经行数据 `children` 字段或 `getChildren` 嵌套——二者是不同概念、不同字段。
- `multiple` 默认 `true`（多选）；设置为 `false` 后行内渲染 radio，此时 `selected` 为单值（`R | undefined`），表头全选复选框不渲染。
- 排序/筛选/展开/固定/列宽均为**受控/非受控双通道**：传入 `sorting` 等值时必须同时监听对应的 `update:sorting`（或使用 `v-model:sorting`）完成回写，否则状态不会更新。
- `expanded` 受控状态为 TanStack `ExpandedState`，以 `String(rowKey(row))` 为键（`{ '1': true }`，或 `true` 表示全部）；`defaultExpandAll` 仅在非受控展开（无 `expanded`）时生效。
- 列筛选生效期间树形行强制展开，保证被筛中的祖先行可见。
- 虚拟滚动需要设置 `height`；未设置高度时 `virtual` 不生效（回退为普通渲染）。
- 固定列在 `data-fixed` 单元格上注入背景色，`fixed` 列阴影通过 `data-fixed-last-start`/`data-fixed-first-end` 数据属性绘制渐变；自定义 `cell`/`row` 插槽时请保留这些数据属性以维持视觉一致性。
- 筛选弹层文案（汇总、关键字、选项、清除）与空状态跟随 ConfigProvider 语言环境；列名取自 `header` → `id`/`accessorKey` 回退链。

## 常见问题

### 如何实现行选择并获取选中行数据？

使用 `multiple`（默认多选）配合 `v-model:selected` 与 `rowKey`：

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id" v-model:selected="selected" />
```

`selected` 为选中行的 `rowKey` 数组；需要完整行数据时用 `rowKey` 反查 `data`。

### 如何做单选表格？

设置 `multiple={false}`——行内渲染 radio 按钮，`selected` 变为单值：

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id" :multiple="false" v-model:selected="selected" />
```

### 如何自定义筛选弹层？

使用 `header-filter` 插槽整体替换默认的 `STableFilterPopover`，或在列上配置 `enableColumnFilter`（`filterOptions`/`filterPlaceholder`）：

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id">
  <template #header-filter="{ column, filtered, filterValues, setFilterValues, clearFilter }">
    <!-- 自定义筛选控件 -->
  </template>
</STable>
```

### 如何控制排序/筛选的初始值？

用非受控 `defaultSorting`/`defaultColumnFilters` 初始化，之后由组件内部维护；需要外部同步时改用受控通道并监听 `update:sorting`/`update:columnFilters`：

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id" :default-sorting="[{ id: 'age', desc: false }]" />
```

### 大数据量如何优化？

启用虚拟滚动（`virtual` + `height`）并按需自定义 `estimateSize`；引擎行模型自带 memoization，1000 行规模下无需额外处理。

### 如何实现表格汇总行？

使用 `footer` 插槽——它接收 `columnSize`，配合 `columns` 逐列渲染汇总单元格：

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id">
  <template #footer="{ columnSize }">
    <STableRow>
      <STableCell>合计</STableCell>
      <!-- 按需渲染汇总值 -->
    </STableRow>
  </template>
</STable>
```

### 如何本地化表格文案？

空状态与所有交互 `aria-label`（排序/筛选/选择/展开/列宽）跟随 ConfigProvider 的 `locale`（`table.*` 消息，14 语言包）；需要按实例覆盖时通过 `ConfigProvider` 的 `messages` 覆盖对应键，或使用同名插槽自定义内容。

## 引擎逃生舱

`STable` 是组件驱动的封装，但 TanStack 引擎从不锁死——提供四级逃生舱：

1. **插槽 props** — 每个表头/数据单元格插槽都接收 `table`（引擎表实例）与 `engineColumn`（引擎列实例），连同 `column`/`row`/`value`：

```vue
<STable :columns="columns" :data="data" :row-key="row => row.id">
  <template #age="{ value, table }">
    {{ value }}（共 {{ table.getPreFilteredRowModel().flatRows.length }} 行）
  </template>
</STable>
```

2. **`useTableEngine()`** — 在表格子树内渲染的任意组件中注入引擎（深层自定义单元格、工具栏组件）：

```ts
import { useTableEngine } from '@vean/aria/table';

const table = useTableEngine();

table.value.setGrouping([{ id: 'city' }]);
```

3. **模板 ref** — 引擎实例即暴露根对象，从组件外部直接控制：

```ts
const tableRef = useTemplateRef<TableEngineTable>('tableRef');

tableRef.value.previousPage();
```

4. **`tableOptions` prop** — 透传原始 TanStack 表选项，解锁组件未显式接线的能力（分页、行选择模型、manual 服务端模式、`meta`、`initialState`、faceted 值...）。组件自有的键（状态接线、变更处理器）优先：

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

单元格定制优先级：具名插槽 > `columnDef.cell` 渲染函数（TanStack 原生方式，经 `FlexRender` 渲染）> 纯文本值。表头遵循同样的链（`columnDef.header`）。

## 从 v0.4x 迁移

v0.50.0 将自研列模型更换为 [`@tanstack/vue-table`](https://tanstack.com/table)。TanStack 命名为第一公民，旧字段不保留别名（`dataIndex` / `sortState` 等需按下表手动重命名），最高频的旧字段映射如下：

| v0.4x（旧）                               | v0.50.0（TanStack 优先）                                           |
| :---------------------------------------- | :----------------------------------------------------------------- |
| `{ title, dataIndex }`                    | `{ header, accessorKey }`（`dataIndex` 别名已移除）                |
| `sorter: true` / `sorter(a, b)`           | `enableSorting: true` / `sortFn: (rowA, rowB) => number`           |
| `filter: true` / `filter: { ... }`        | `enableColumnFilter: true` / `filterPlaceholder` / `filterOptions` |
| `width: '140px'` / `minWidth`             | `size: 140` / `minSize`（px 数值）                                 |
| 分组列 `{ key, children }`                | `{ id, columns }`（TanStack 分组形状）                             |
| `sortState` / `defaultSortState`          | `sorting` / `defaultSorting`（`SortingState`）—— 别名已移除        |
| `filterState` / `defaultFilterState`      | `columnFilters` / `defaultColumnFilters`（`ColumnFiltersState`）   |
| `columnWidths` / `defaultColumnWidths`    | `columnSizing` / `defaultColumnSizing`（`Record<string, number>`） |
| `expanded: R[]`                           | `expanded: ExpandedState`（`{ '1': true }` 或 `true`）             |
| `update:sortState` / `update:filterState` | `update:sorting` / `update:columnFilters`                          |

### 迁移前后对照

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
