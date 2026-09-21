---
head:
  title: CalendarRange
  description: CalendarRange 会渲染一个或多个按月排列的日期网格，用户可直接在日历表面上选择起始日期和结束日期。选中第一个日期即开始选择范围，悬停时实时预览候选范围，第二次点击完成提交——反向选择也会自动排序。适用于预订、排程等需要键盘可导航网格而非两个文本输入框的范围选择场景。需要弹出式触发器时搭配 SDateRangePicker，也可独立用于表单与自定义布局。
---

# CalendarRange

## 概述

CalendarRange 会渲染一个或多个按月排列的日期网格，用户可直接在日历表面上选择起始日期和结束日期。选中第一个日期即开始选择范围，悬停时实时预览候选范围，第二次点击完成提交——反向选择也会自动排序。适用于预订、排程等需要键盘可导航网格而非两个文本输入框的范围选择场景。需要弹出式触发器时搭配 `SDateRangePicker`，也可独立用于表单与自定义布局。

## 用法

<UsageCode component="calendar-range" />

## 特性

- 📅 月网格 — 一个或多个网格（`numberOfMonths`），本地化星期表头、今日标记与视图外日期标记
- 🎯 范围选择 — 先点开始再点结束（顺序任意，自动排序）；提交前悬停预览候选范围
- 🎚 受控 / 非受控 — `v-model`/`defaultValue` 绑定 `DateRange`（`{ start, end }`），基于 `useControllableState`
- ⌨️ 完整键盘支持 — `ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown` 导航（RTL 反转、跨月翻页、跳过禁用日期）；`Enter`/`Space` 选择起点/终点
- ⛓ 范围约束 — `allowNonContiguousRanges` 控制是否允许区间内缺日，`maximumDays` 限制跨度，`isDateDisabled`/`isDateUnavailable`/`isDateHighlightable` 逐日控制，`minValue`/`maxValue` 限制翻页边界
- 📌 固定端点 — `fixedDate`（`'start'`/`'end'`）固定一端后只改另一端；`preventDeselect` 保持单个已选起点不被取消
- 🧩 可组合插槽 — `day`、`head-cell`、`heading`、`prev`、`next` 插槽带丰富插槽属性；每个子部件均支持 `*Props` 透传
- 🔤 本地化 UI — `locale`、`weekStartsOn`、`weekdayFormat`；月/年 Select 控件携带本地化 `aria-label`
- 🚫 禁用 / 只读 — `disabled` 阻断全部交互；`readonly` 允许浏览但禁止选择
- ↕️ 固定周数 — `fixedWeeks` 渲染一致的 6 行网格；`initialFocus` 挂载时将焦点移入网格
- 🖱 实时悬停预览 — `data-highlighted`/`data-highlighted-start`/`data-highlighted-end` 属性驱动选择终点时的范围预览样式

## 组件系列

- `SCalendarRange` — 样式包装层：向 Aria compact 转发 props、注入 `calendarRangeVariants` 样式（12 slots，prev/next 复用按钮图标配方），并在 heading 中渲染默认的月/年 Select 控件
- `CalendarRangeCompact`（Aria）— 数据驱动聚合：`CalendarRangeRoot` + 头部（prev/heading/next）+ 每月一个网格（grid head/body 行由 `CalendarRangeCellTrigger` 组成）；无样式用法从 `@vean/aria/calendar-range` 引入
- `CalendarRangeRoot`（Aria）— 状态所有者：`useControllableState` 管理 `DateRange`/placeholder，`useCalendar` 生成网格与翻页，`useCalendarRangeState` 派生选中/高亮/无效状态并提供候选范围校验
- `CalendarRangeCellTrigger` / `CalendarRangeCell` / `CalendarRangeGrid*`（Aria）— 可编辑日期按钮（键盘处理、焦点管理、范围 data 属性）及其语义化网格单元格包装

## 演示

<PlaygroundGallery component="calendar-range" />

## API

<ComponentApi component="calendar-range" />

## 注意事项

### 架构与对标差异

`CalendarRangeRoot` 经 `useControllableState` 持有值（`DateRange` = `{ start, end }`），placeholder 驱动网格翻页，网格生成委托给与 `calendar` 共享的 `useCalendar`。`useCalendarRangeState` 派生选中/高亮状态，并暴露 `isRangeInvalid(start, end)`——候选范围校验器，同时供派生 `data-invalid` 状态与 `onDateChange` 提交新范围时使用（因此「非连续范围拒绝」基于**候选范围**判定，而非此前已提交的状态）。`CalendarRangeCellTrigger` 是唯一交互部件：读取共享 context，计算 `data-selection-start`/`data-selection-end`/`data-highlighted`/`data-selected`/`data-today`/`data-unavailable`/`data-outside-view`，处理方向键（`dir` 感知方向，RTL 反转 ArrowLeft/ArrowRight）与 Enter/Space，并在导航跨越网格边界时翻页到相邻月份。`CalendarRangeCell` 为已完成范围内的日期带上 `data-in-range`，样式条带正是以它为锚点——仅选中起点时只有 `data-selected`、不绘制条带，因此条带只会在两端都选定后出现。多数对标库提供的是整体式范围面板；Aria/styled 分离、逐部件 `*Props` 透传、悬停预览与候选范围校验是本组件差异点。

| 能力                       | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 范围选择（起 + 止）        |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 悬停范围预览               |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| 键盘网格导航               |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| RTL 方向反转               |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `numberOfMonths` 多网格    |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `allowNonContiguousRanges` |   ✅   |     —      |      ✅      |   ✅    |    —     |   —    |
| `maximumDays` 跨度上限     |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `fixedDate` 固定端点       |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `minValue`/`maxValue` 边界 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateDisabled` / 不可用  |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 月/年 Select 控件          |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| 候选范围校验               |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- 值为 `DateRange`——由 `DateValue`（本地零点的原生 `Date`）组成的 `{ start, end }` 对象，而非字符串。
- 默认拒绝存在缺口的范围（第二次点击会使选择在点击日重新开始）；需要允许缺口时传 `allowNonContiguousRanges`。
- `defaultValue`/`defaultPlaceholder` 仅在挂载时读取——外部控制请使用 `v-model`。
- `isDateDisabled` 与 `isDateUnavailable` 不同：禁用日期按策略不可选，不可用日期额外以视觉标记（默认样式中 `line-through`）。
- `fixedDate` 固定一端：`fixedDate="start"` 时重新选择总是更新结束端；`fixedDate="end"` 时总是更新开始端。
- prev/next 的 `aria-label` 默认为 locale 消息；可通过 `prevProps`/`nextProps` 逐按钮覆盖。
- 每个日期按钮的 `aria-label` 默认为完整本地化日期；可通过 `cellTriggerProps` 逐格覆盖。
- 范围条带由单元格承载：已完成范围内的日期带 `data-in-range`（仅选中起点时只有 `data-selected`，不绘制条带）。自定义条带样式请作用于 `ui.cell` + `data-in-range`，不要用 `data-selected`。

## 常见问题

### 如何选择范围？

点击开始日期，再点击结束日期——顺序任意。选择结束端期间，悬停区间会以高亮状态预览。范围经 `v-model` 以 `{ start, end }` 形式输出。

### 如何禁止跨越不可用日期的范围？

保持 `allowNonContiguousRanges` 关闭（默认）：当第二次点击会跨越禁用或不可用日期时，选择被拒绝并在点击日重新开始。设置 `allowNonContiguousRanges` 可允许缺口。

### 如何限制范围长度？

传入 `maximumDays`（含首尾）。点击超出上限的结束日期时，选择会在点击日重新开始。

### 如何固定一端重新选择？

传入 `fixedDate="start"`（或 `"end"`）。点击任意日期更新另一端，点击固定端前后会自动排序。

### 如何构建弹出式范围选择器？

使用 `SDateRangePicker`——它在弹出触发器内组合 `CalendarRangeCompact`。日历表面始终可见时使用独立的 `SCalendarRange`。
