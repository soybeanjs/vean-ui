# table — 高级数据网格 / ProTable 技术方案（提案）

> **2026-09 前提变更：** 本文写于「外围包单包自治」时期，标题中的 `@soybeanjs/table` 是当时设想的包名；当前仓库无外围包，文中包结构、lockstep、跨包依赖等设定已不适用。**市场调研结论与能力设计仍然有效**；表格内核已于 v0.50.0 更换为 `@tanstack/vue-table`，立项时须先按 [README §立项时必须回答的问题](./README.md#立项时必须回答的问题) 确定落地形态（并入核心 aria/ui、独立包、或 vean 源码配方）。

> 定位（提案）：提供基于核心 `STable` 原语的**高级数据网格 / ProTable 级**组件——内置服务端数据源抽象、查询工具栏、分页一体化、可编辑单元格、列管理（显隐/固定/排序/偏好持久化）与导出等 Pro 级能力，对标 Ant Design `ProTable` / AG Grid Community，并保留「aria 逻辑层 + Styled UI 层」的招牌。
>
> 状态：**立项提案**（本文档），无任何代码。市场调研已完成（见 [research/table-ecosystem.md](../research/table-ecosystem.md)）。

## 1. 市场调研结论

> 完整调研见 [research/table-ecosystem.md](../research/table-ecosystem.md)；本节仅摘录对定位有决定性影响的结论。

### 1.1 核心分界线：数据源抽象

「ProTable 级」表格与普通表格的第一分界线是**服务端/客户端数据处理开关与请求适配层**：

- ProTable 的 `request: (params, sort, filter) => { data, total }` 接管 loading、查询表单联动与 `params` 优先级（[ProTable API](https://procomponents.ant.design/components/table/)）。
- AG Grid 用 Row Model 体系（Client / Server-Side / Viewport）（[Community vs Enterprise](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/)）。
- Vuetify 提供 `v-data-table` / `v-data-table-server` / `v-data-table-virtual` 三档变体，v0 的 `createDataTable` 用 Client/Server/Virtual adapter 统一数据管线（[createDataTable](https://0.vuetifyjs.com/composables/data/create-data-table)）。

**结论**：Vue 生态缺少「服务端数据源抽象」的开箱方案——Element/Naive/PrimeVue/TDesign 都需自行在事件里发请求；ProTable 的 `request`+`valueType` 已被市场验证但 React-only。这是 `@soybeanjs/table` 最直接的对标切入点。

### 1.2 Vue 生态空白：Headless 高级数据网格

- TanStack Table 是 Headless 引擎，但不渲染任何 DOM（虚拟化、固定列视觉、编辑 UI 全部自建），且无数据请求适配器（[TanStack Table Overview](https://tanstack.com/table/alpha/docs/overview.md)）。
- Element / Naive / PrimeVue / Vuetify / TDesign 的表格全部是「逻辑 + 样式耦合」的 Styled 实现。
- **没有任何库提供「Headless 表格逻辑 + 可选 Styled UI」双层的 Pro 级网格**——正是 Vean 的 `aria/ui` 分层可切入的位置。

### 1.3 商业化先例

AG Grid（社区 MIT / 企业版 $999/开发者）与 Handsontable（非商业免费 / 商业 $999+）均验证了「免费核心 + 付费高级层」模型，付费卖点为分组/透视/服务端行模型/Excel 导出/剪贴板/主从（[AG Grid 定价](https://www.ag-grid.com/license-pricing/)）。**注意**：AG Grid 许可禁止「包装再分发」，`@soybeanjs/table` 必须基于 `STable` 自建内核，不能套壳 AG Grid（详见 [research/commercialization-ecosystem.md](../research/commercialization-ecosystem.md) §2.1）。

### 1.4 工程警示

- Element Plus 官方明示 el-table-v2 仍为 beta，且网络/内存是大数据瓶颈（[table-v2](https://github.com/element-plus/element-plus/blob/dev/docs/en-US/component/table-v2.md)）。
- TDesign 用 `threshold`（默认 100）在数据量小时自动回退普通渲染（[虚拟滚动优化](https://blog.csdn.net/gitblog_00279/article/details/160179217)）。
- **虚拟滚动不等于万能**：需与分页/过滤协同并做阈值自适应。

## 2. 现状盘点：核心 STable 能力与局限

> 基于 `packages/aria/src/components/table/` 与 `packages/ui/src/components/table/`（含 `TableCompact` 聚合），文档见 [apps/docs/src/content/zh/ui/components/table.md](../../apps/docs/src/content/zh/ui/components/table.md)。

### 2.1 已具备（核心原语能力，全部保留在核心层）

| 能力             | 说明                                                                                                                                                                                          |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 配置式列模型     | `columns: TableColumn<T>[]`：分组表头（`children`）、`index`/`selection`/`expand` 类型列、`fixed`/`width`/`minWidth`/`align`/`hidden`；`dataIndex` 为类型安全路径（`Path<TableRowValue<T>>`） |
| 排序             | `sorter: true                                                                                                                                                                                 | 函数`；受控 `sortState`/`v-model:sortState`与非受控`defaultSortState`；`aria-sort` 本地化   |
| 筛选             | `filter: true                                                                                                                                                                                 | TableColumnFilter`（选项多选 + 关键字 + 自定义 `match`）；弹层 `STableFilterPopover` 本地化 |
| 选择             | `multiple` 默认多选（复选框 + 表头全选），`multiple={false}` 单选（radio）；受控 `selected`/`v-model:selected`                                                                                |
| 展开/树形        | `expand` 列 / `expanded-row` 插槽；`children`/`getChildren` 驱动树形行 + `tree-toggle`                                                                                                        |
| 固定与调整       | `fixed: 'start'                                                                                                                                                                               | 'end'` 固定列 + 阴影渐变；`resizable` 指针拖拽 + 方向键键盘调整                             |
| 性能             | `virtual` + `height` 虚拟滚动（内置 virtualizer，`estimateSize`/`virtualizerOptions`）                                                                                                        |
| 空状态/页脚/底部 | `empty` / `footer` / `bottom` 插槽                                                                                                                                                            |
| 事件面           | `rowClick`/`rowDblclick`/`rowContextmenu`/`rowMouseenter`/`rowMouseleave`                                                                                                                     |
| 本地化           | 21 条 `table.*` 消息、14 语言包（含排序/筛选/选择/展开/列宽调整 aria-label）                                                                                                                  |

### 2.2 局限（`@soybeanjs/table` 的补齐空间）

|  #  | 局限                   | 说明                                                                                |
| :-: | :--------------------- | :---------------------------------------------------------------------------------- |
| L1  | **无服务端数据源抽象** | 排序/筛选/分页变化只回传受控状态，不发请求；服务端数据需开发者自行 watch + 手动请求 |
| L2  | **无分页一体化**       | 分页是独立 `SPagination`，与数据源、排序/筛选状态没有开箱的联动闭环                 |
| L3  | **无查询工具栏**       | 筛选入口是列头弹层；缺少「查询表单 + 表格 + 重置」的页面级查询范式                  |
| L4  | **无列管理面板**       | 无「列显隐/固定/顺序」的 `column-settings` 面板与偏好持久化（localStorage）         |
| L5  | **无单元格/行编辑**    | 仅展示与选择；编辑需自行在 `cell` 插槽拼装输入控件并处理回写                        |
| L6  | **无批量操作栏**       | 选择状态与「批量删除/导出等」操作没有联动 UI                                        |
| L7  | **无导出**             | CSV/Excel 导出需自建                                                                |
| L8  | **无跨页选择保留**     | `selected` 以当前页 `rowKey` 为键，翻页后不保留（需数据 key 稳定 + 显式集合管理）   |

> 定位边界：核心 `STable` 保持「原语级 + 状态管线」不膨胀；上述 L1–L8 全部由 `@soybeanjs/table` 以 Pro 级复合/组合式形态承接。

## 3. 定位与命名

### 3.1 定位一句话

**在核心 `STable` 之上，提供「一个组件 ≈ 一个可查询数据页」的 Pro 级数据网格**：服务端/客户端数据源一键切换、查询表单联动、分页/排序/筛选/编辑/列管理的状态一体化，且保留全部 aria/样式分离能力。

### 3.2 与现有包边界

| 层         | 包                                                  | 角色                                                                                  |
| :--------- | :-------------------------------------------------- | :------------------------------------------------------------------------------------ |
| 原子原语   | 核心 `@vean/ui` `STable`                            | 配置式列模型、排序/筛选/选择/展开/树形/固定/缩放/虚拟滚动状态管线（**不新增**）       |
| 复合层     | 中后台「查询列表页」装配（历史 admin 方向，已取消） | 壳路线已明确 ProTable 不进壳，任何列表页装配都应**包装**本提案的 Pro 能力而非重复实现 |
| **本提案** | 高级数据网格内核                                    | 数据源抽象 + 查询/分页/编辑/列管理/导出等 Pro 能力                                    |

> 注：已取消的 admin 方向（见 [ui-shell-roadmap.md §4.7](../ui-shell-roadmap.md)）曾规划壳内 ProTable；现行边界是 ProTable 不在壳组件范围内，其落地形态（并入核心 ui 或随本提案独立）在立项时统一决策，避免两处重复实现。

### 3.3 命名与前缀

- 包名 `@soybeanjs/table`；registry 命名空间 `table/*`。
- 组件前缀：`S` + `Table*`（领域名词二级语义段，对齐 admin `S`+`App*`、editor `S`+`Editor*`）。
- 为避免与核心 `STable` 混淆，**旗舰组件命名 `STablePro`**（对齐 Ant Design `ProTable` 语义），其余 `STableQuery` / `STableToolbar` / `STableEditable` / `STableColumnSetting` / `STableExport`。
- 组合式（composable）命名：`useTableDataSource` / `useTableQuery` / `useTableEditable` / `useTableColumnState` / `useTableExport`。

## 4. 架构设计

### 4.1 分层与依赖

```
Layer 4  @soybeanjs/table ──► @soybeanjs/{ui, headless, theme}
                                │
                                └─(optional peerDep)──► @soybeanjs/form（查询表单，白名单新增边）
```

- **单包自治**（ADR-0001）：数据源/查询/编辑/列管理组合式与样式同居于包内，不建 `headless-table` 中间层。
- 运行时依赖：`@vean/aria`、`@vean/ui`、`@vean/theme`；peer 依赖 `vue`、unplugin-vue-components（可选 nuxt / vue-router）。
- 核心 `STable` 仍是唯一表格原语层；`@soybeanjs/table` 只做组合与领域胶水。

### 4.2 包结构（目标形态）

```
packages/table/
├── src/
│   ├── components/
│   │   ├── table-pro/            # STablePro：数据源 + 分页 + 查询工具栏 + 批量操作 + 列设置的一体化旗舰
│   │   ├── table-query/          # STableQuery：查询表单（schema 或 columns 派生），预留对接 @soybeanjs/form
│   │   ├── table-toolbar/        # STableToolbar：刷新/密度/全屏/列设置/导出 操作区
│   │   ├── table-editable/       # STableEditable + 单元格编辑器（复用 SInput/SSelect/SCheckbox…）
│   │   ├── table-column-setting/ # STableColumnSetting：列显隐/固定/顺序面板
│   │   ├── table-export/         # STableExport：CSV（免费）/ Excel（Pro）
│   │   └── table-batch-actions/  # STableBatchActions：跨页选择 + 批量操作条
│   ├── composables/              # use-table-data-source / use-table-query / use-table-editable
│   │                             # / use-table-column-state / use-table-selection(跨页) / use-table-export
│   ├── styles/                   # cv()/scv() recipe + @unocss-include
│   ├── constants/components.ts   # STable* 名称注册表
│   ├── resolver/ · nuxt/
│   └── types.ts                  # TableDataSource / TableQuerySchema / TableEditableCell
│                                 # / TableColumnSetting / TableExportOptions / TableProProps
└── test/                         # 单测（happy-dom）+ browser e2e（含 axe 键盘可达性）
```

### 4.3 跨包依赖：table → form（新增白名单边，需出 ADR）

查询工具栏需要「schema 驱动查询表单」。为避免外围包间默认耦合，遵循 ADR 白名单规则：

- **默认解耦**：`STableQuery` 通过插槽接收「查询表单区」内容，不强制依赖 `@soybeanjs/form`。
- **可选增强**：当消费者同时安装 `@soybeanjs/form` 时，`STableQuery` 可用 `SFormSchema`/`SFormQuery` 渲染查询表单（`@soybeanjs/form` 声明为 `peerDependencies` + `optional`）。
- 该有向边 `@soybeanjs/table → @soybeanjs/form` 需在 `CONTEXT.md`「跨包依赖方向白名单」追加并在立项 ADR 中记录（与 `admin → chart` 同一机制）。

### 4.4 数据源抽象（对标 ProTable `request`，headless 化）

```ts
// types.ts —— 核心抽象
interface TableRequestParams<T = any> {
  page: number;
  pageSize: number;
  sortState?: TableSortState; // 复用核心类型
  filterState?: TableFilterState; // 复用核心类型
  params?: Record<string, any>; // 查询表单 / 外部参数
}
interface TableRequestResult<T = any> {
  data: T[];
  total: number;
  success?: boolean;
}
type TableDataSource<T = any> =
  | { type: 'client'; data: T[] | (() => T[] | Promise<T[]>) } // 客户端处理
  | { type: 'server'; request: (p: TableRequestParams) => Promise<TableRequestResult<T>> }; // 服务端处理
```

- `useTableDataSource(source, options)`：统一 loading / 错误 / 分页 / 排序 / 筛选联动；`postData` 后处理；`manualRequest` 手动触发；`debounce`（参考 ProTable `debounceTime` 默认 10ms）。
- **与核心受控状态接线**：`sortState` / `filterState` 直接复用 `STable` 的 `v-model` 通道，数据源内部 watch 其变化并触发请求（客户端模式则本地走 `TableCompact` 既有管线）。

## 5. 核心功能

| 优先级 | 组件 / 能力                                   | 说明                                                                                                                                                                      |
| :----: | :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   P0   | `STablePro`                                   | 旗舰：`TableDataSource` + 分页（`SPagination`）+ 查询联动 + 批量操作 + 列设置一体化；`columns` 复用核心 `TableColumn<T>` 并扩展 `search`（查询表单字段配置）与 `editable` |
|   P0   | `useTableDataSource`                          | 数据源抽象（client/server 双模式，§4.4）；loading / 错误 / 重试 / manualRequest / postData                                                                                |
|   P0   | `STableQuery` + `useTableQuery`               | 查询表单（`columns[].search` 派生或 schema 传入）；查询/重置/展开收起；本地化；可选对接 `@soybeanjs/form`                                                                 |
|   P0   | 分页一体化                                    | 分页状态与数据源/排序/筛选闭环；`pageSize` 记忆；总数展示                                                                                                                 |
|   P1   | `useTableEditable` + `STableEditable`         | 单元格/行内编辑：编辑器注册表（复用 SInput/SSelect/SCheckbox…）、编辑态管理、回写数据源、校验（对接 `@soybeanjs/form` 校验管线）                                          |
|   P1   | `STableColumnSetting` + `useTableColumnState` | 列显隐/固定/顺序面板；列状态可序列化 + `localStorage` 持久化（差异化卖点，见调研 §4.2.3）                                                                                 |
|   P1   | `STableBatchActions` + `useTableSelection`    | 跨页选择保留（rowKey 集合）+ 批量操作条                                                                                                                                   |
|   P1   | `STableToolbar`                               | 刷新 / 密度 / 全屏 / 列设置 / 导出操作区（复用 SButtonIcon/SDropdownMenu）                                                                                                |
|   P2   | `STableExport` + `useTableExport`             | CSV（免费）；Excel（Pro，sheetjs 系 peer）                                                                                                                                |
|   P2   | 高级分组/聚合 · 主从 · 区域选择               | Pro 层（付费边界候选，见 [commercialization.md](./commercialization.md)）                                                                                                 |

## 6. 实现路径

|        阶段        | 内容                                                                                              | 前置                  |
| :----------------: | :------------------------------------------------------------------------------------------------ | :-------------------- |
|   TB-0 立项确认    | 本方案评审；跨包白名单加边 `table → form` 出 ADR；核对核心 `Upload`/`DropdownMenu` 等依赖交付状态 | 生态首发 M-EC5 后     |
|    TB-1 包骨架     | 复用 chart/admin 骨架模板 + registry `packages` 元数据 + docs/playground 命名空间接线             | TB-0、EC-M2/M4 已固化 |
|    TB-2 P0 组件    | `useTableDataSource` + `STablePro` + 分页一体化 + `STableQuery`（先插槽形态）                     | TB-1                  |
|    TB-3 P1 能力    | 可编辑、列管理 + 持久化、批量操作、工具栏                                                         | TB-2                  |
| TB-4 P2 与生态联动 | 导出、`@soybeanjs/form` 查询表单正式接线、admin `ProTable` 改依赖                                 | TB-3、form 包 M2      |

## 7. 技术选型

| 选型        | 决策                                                    | 理由                                                  |
| :---------- | :------------------------------------------------------ | :---------------------------------------------------- |
| 表格内核    | 复用核心 `STable`/`TableCompact`（不套壳第三方）        | AG Grid 禁止包装再分发；自建内核保留 aria/ui 分层招牌 |
| 数据源      | 自研 `useTableDataSource`（client/server 双模式）       | 对标 ProTable `request`，headless 化与 UI 解耦        |
| 分页        | 复用 `SPagination` + 状态接线                           | 不重复造原子                                          |
| 查询表单    | 插槽优先；`@soybeanjs/form` 可选 peer                   | 默认解耦，增强按需                                    |
| 导出        | CSV 自实现；Excel 用 sheetjs 系 peer                    | 免费边界清晰（Excel 入 Pro）                          |
| 样式        | `cv()`/`scv()` + theme token                            | 亮暗联动，禁原始 CSS                                  |
| 构建 / 测试 | `vp pack` + vitest + Playwright + axe（键盘可达性必测） | 对齐 packages/ui                                      |

## 8. 兼容性考虑

- **SSR / Nuxt**：数据源请求在服务端可预取首屏；客户端 hydrate 后接管；Nuxt module 与 resolver 对齐其他包。
- **体积**：核心逻辑都在 `@vean/aria`/`ui`；`@soybeanjs/table` 主要增加组合式与复合组件，按需 tree-shaking。
- **可访问性**：复用核心 `STable` 的 `aria-sort`/选择/展开/列宽本地化；新增的列设置面板、批量操作条、编辑单元格纳入 browser e2e 必测项。
- **版本**：lockstep 同版本；与核心 `STable` API 保持向后兼容（若核心 API 变更需同步）。

## 9. 风险

| 风险                                | 缓解                                                                                                |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------- |
| 与核心 `STable` 边界模糊            | 本文档 §2.2 明确 L1–L8 归属；新增能力先问「是否应上浮核心」                                         |
| 服务端数据源抽象过宽                | 先实现 client/server 双模式最小闭环，`params`/`postData`/`manualRequest` 对齐 ProTable 常用面       |
| 与 admin `ProTable` 重复            | 明确 admin ProTable 应包装 `@soybeanjs/table`（§3.2），立项 ADR 固化                                |
| 免费替代品（TanStack/el-table-v2）  | 差异化：Vue3 headless 双层 + 服务端抽象 + 列管理持久化 + 类型安全 + 中文生态                        |
| 企业级高级能力（分组/透视）工程量大 | Pro 边界先从较易的导出/树形/分组切入，逐步加码（见 [commercialization.md](./commercialization.md)） |
