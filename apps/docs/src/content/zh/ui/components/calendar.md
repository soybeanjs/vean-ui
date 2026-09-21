---
head:
  title: Calendar
  description: 按月展示的日期网格组件，支持单选/多选、禁用与不可用日期、min/max 边界、自定义单元格渲染，以及 Compact 头部内置的月份/年份 Select 控件。适用于预订、排期或任何需要键盘可导航网格而非纯文本输入的日期选择场景。需要弹出触发器时搭配 SDatePicker；需要范围选择时使用范围型复合组件。
---

# Calendar

## 概述

按月展示的日期网格组件，支持单选/多选、禁用与不可用日期、min/max 边界、自定义单元格渲染，以及 Compact 头部内置的月份/年份 Select 控件。适用于预订、排期或任何需要键盘可导航网格而非纯文本输入的日期选择场景。需要弹出触发器时搭配 `SDatePicker`；需要范围选择时使用范围型复合组件。

## 用法

<UsageCode component="calendar" />

## 特性

- 📅 月网格 — 一个或多个月网格（`numberOfMonths`），语言环境感知的星期表头、今天与视图外标记
- 🎚 受控 / 非受控 — 支持 `v-model`/`defaultValue` 单选日期或日期数组（`multiple`），底层由 `useControllableState` 驱动
- ✅ 多选 — 点击或键盘切换日期；`preventDeselect` 保持选中粘性
- ⌨️ 完整键盘支持 — `ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown` 导航（RTL 反转、跨月翻页、跳过禁用日期）；`Enter`/`Space` 选择
- ⛓ 边界与匹配 — `minValue`/`maxValue` 限制翻页并禁用越界日期；`isDateDisabled`/`isDateUnavailable` 标记任意日期
- 🧩 可组合插槽 — `day`、`head-cell`、`heading`、`prev`、`next` 插槽携带丰富 slot props；每个子部件支持 `*Props` 透传
- 🔤 本地化 UI — `locale`、`weekStartsOn`、`weekdayFormat`；月份/年份 Select 控件携带本地化 `aria-label`
- 🗓 月份/年份控件 — Compact 头部渲染 Select 控件快速跳转月份/年份，按 `minValue`/`maxValue` 禁用
- ↕️ 固定周数 — `fixedWeeks` 渲染一致的 6 行网格；`initialFocus` 挂载时聚焦网格
- 🚫 禁用 / 只读 — `disabled` 阻止全部交互；`readonly` 保留浏览但阻止选择

## 组件家族

- `SCalendar` — 样式包装层，将 props 转发给 Aria compact 并注入 `calendarVariants` 类（12 个 slot，prev/next 复用按钮图标 recipe）
- `CalendarCompact`（Aria）— `CalendarRoot` + 头部（prev/heading/next）+ 每月一个网格（grid head/body 行内的 `CalendarCellTrigger`）的数据驱动组合；无样式用法从 `@vean/aria/calendar` 导入
- `CalendarRoot`（Aria）— 状态所有者：`useControllableState` 管理值与占位符，`useCalendar` 管理网格/月份翻页与校验，`useCalendarState` 派生选中/无效状态
- `CalendarCellTrigger` / `CalendarCell` / `CalendarGrid*`（Aria）— 可编辑的日期按钮（键盘处理、焦点管理、数据属性）及其语义化网格单元格包装

## 演示

<PlaygroundGallery component="calendar" />

## API

<ComponentApi component="calendar" />

## 注意事项

### 架构与对标差异

`CalendarRoot` 通过 `useControllableState` 持有值（`multiple` 时为数组），以占位符驱动网格翻页，并把网格创建委托给 `useCalendar`（在 locale/周首日/占位符变化时重建网格，并以 `minValue`/`maxValue` 限制翻页）。`useCalendarState` 派生选中/无效状态。`CalendarCellTrigger` 是唯一交互部件：读取共享上下文，计算 `data-focused`/`data-selected`/`data-today`/`data-unavailable`/`data-outside-view`，处理 Arrow/Enter/Space 键（`dir` 感知方向，RTL 下 ArrowLeft/ArrowRight 互换），并在导航跨网格边界时翻到相邻月份。Compact 负责迭代月份/周/日与头部接线（prev/heading/next + 月份/年份 Select）。对标库多为单体日历面板；Aria/styled 分离、逐部件 `*Props` 透传与插槽驱动单元格渲染是差异点。

| 能力                         | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :--------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离             |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 单选 / 多选                  |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 键盘网格导航                 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| RTL 方向反转                 |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `numberOfMonths` 网格        |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `minValue`/`maxValue`        |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateDisabled`/不可用      |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `fixedWeeks`/`weekStartsOn`  |   ✅   |     —      |      ✅      |   ✅    |    —     |   —    |
| 月份/年份 Select 控件        |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| 自定义 `prevPage`/`nextPage` |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 逐部件 `*Props` 透传         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 本地化 `aria-label`          |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |

### 运行时注意事项

- 值是本地零点的原生 `Date`（即 `DateValue` 模型：`Date` 或 `{ date, time? }`）。格式化/转换直接使用 `date-fns` 或 `Intl`。
- `multiple` 会把模型形状变为 `DateValue[]`；`M` 泛型由 prop 推断。
- `defaultValue`/`defaultPlaceholder` 仅在挂载时读取——外部控制请使用 `v-model`。
- `isDateDisabled` 与 `isDateUnavailable` 不同：禁用日期是策略性不可选，不可用日期还会被视觉标记（默认样式 `line-through`）。
- 默认渲染当前月之外的日期；传入 `disableDaysOutsideCurrentView` 可禁用它。
- prev/next 的 `aria-label` 默认为 locale 消息；可通过 `prevProps`/`nextProps` 逐按钮覆盖。
- 导航按钮在 `minValue`/`maxValue` 处自动禁用；自定义 `prevPage`/`nextPage` 函数参与该计算。

## 常见问题

### 如何多选日期？

传入 `multiple`（模板中布尔简写可用）并把 `v-model` 绑定到 `DateValue` 数组。点击切换日期；`preventDeselect` 阻止移除。

### 如何禁止今天之前的日期？

传入 `minValue={new Date(2026, 0, 1)}`（任意 `DateValue`）。越界日期被禁用，prev 按钮在边界处自动禁用。

### 如何同时展示多个月？

设置 `numberOfMonths={2}`——日历并排渲染两个月网格，跨边界时一并翻页。

### 为什么未处理 `PageUp`/`PageDown`？

网格导航目前覆盖方向键、`Enter`/`Space` 与跨月翻页。`PageUp`/`PageDown`/`Home`/`End`（Ant Design/Element Plus 面板具备）为已排期的增强项。

### 如何用此组件构建日期范围？

范围专用网格使用 `SRangeCalendar`；或将两个 `SCalendar` 以 `minValue`/`maxValue` 互相绑定另一侧的选择。
