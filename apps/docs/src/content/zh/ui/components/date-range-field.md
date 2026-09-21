---
head:
  title: 日期范围字段
  description: 分段式日期范围输入组件。渲染两组可独立键盘编辑的日期分段——一组对应开始日期、一组对应结束日期——同时为两个日期提交原生表单值。适用于需要快速录入有界时间区间的场景，例如预订入住日期、报表窗口、筛选范围等以键入为主的场景。需要从日历弹层选择范围时，优先使用 SDateRangePicker；只需单个日期时，使用 SDateField。
---

# 日期范围字段

## 概述

分段式日期范围输入组件。渲染两组可独立键盘编辑的日期分段——一组对应开始日期、一组对应结束日期——同时为两个日期提交原生表单值。适用于需要快速录入有界时间区间的场景，例如预订入住日期、报表窗口、筛选范围等以键入为主的场景。需要从日历弹层选择范围时，优先使用 `SDateRangePicker`；只需单个日期时，使用 `SDateField`。

## 用法

<UsageCode component="date-range-field" />

## 特性

- 🧩 双组分段输入——独立的开始/结束分段组（日/月/年，可选时间），每个部分都是可编辑的 `role="spinbutton"` 分段
- ⌨️ 跨组焦点移动——方向键在组内导航，在组边界上 `ArrowLeft`/`ArrowRight` 将焦点移入另一组，RTL 下方向反转
- 🎚 受控 / 非受控——`v-model`/`defaultValue` 接受 `DateRange` `{ start, end }`，由 `useControllableState` 支撑
- ⛓ 范围校验——每个日期支持 `minValue`/`maxValue`/`isDateUnavailable`，且开始晚于结束时 root 自动标记 `data-invalid`
- 📝 双原生表单值——两个视觉隐藏输入（`startName`/`endName`，开始侧回退用共享的 `name`）提交 ISO 值
- 🕐 粒度与时间——`granularity`（day/hour/minute/second）、12/24 小时制 `hourCycle`、`dayPeriod` 分段同时作用于两组
- 🧩 可定制分隔——`separator` prop（默认 `–`）与 `leading`/`trailing` 插槽，或用 `separator` 插槽渲染完全自定义内容
- 🚫 禁用 / 只读——两种状态都渲染正确的 `data-*`/`aria-*` 属性并阻止两组编辑

## 组件族系

- `SDateRangeField`——样式包装层，透传 props 给 Aria compact 并注入 `dateRangeFieldVariants`（扩展 `dateFieldVariants`）类
- `DateRangeFieldCompact`（Aria）——由 `DateRangeFieldRoot` + 两组逐分段 `DateRangeFieldInput` 数据驱动组合，并带 `leading`/`trailing`/`separator` 插槽；无样式使用时从 `@vean/aria/date-range-field` 导入
- `DateRangeFieldRoot` / `DateRangeFieldInput`（Aria）——状态所有者（双组分段值、校验、隐藏输入、跨组焦点）与绑定共享 `useDateField` 组合式的单个可编辑分段

## 演示

<PlaygroundGallery component="date-range-field" />

## API

<ComponentApi component="date-range-field" />

## 注意

### 架构与行业对标差异

`DateRangeFieldRoot` 通过 `useControllableState` 持有 `{ start, end }` 值，为两组维护独立的 `startSegmentValues`/`endSegmentValues` shallowRef，并经 `isInvalid` 完成校验（含开始晚于结束的检查）。每个 `DateRangeFieldInput` 绑定与 `time-field` 族共享的 `useDateField` 组合式实现 per-part 键盘逻辑。跨组移动由 root 的 `moveFocus` 处理：在 start 组物理末尾按前进方向移入 end 组，在 end 组开头按后退方向返回 start 组，物理按键依据 `dir` 映射，因此 RTL 下 `ArrowLeft`/`ArrowRight` 互换。大多数对标库把范围实现为两个独立文本框或一个带分隔符的文本框；双组分段加跨组键盘焦点的模式源自 reka-ui（Radix）的 date-field 一脉。

| 能力                    | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :---------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 双组分段可编辑组        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 跨组焦点移动            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL 方向反转            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 受控 / 非受控           |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 键盘增减 / 键入         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 范围校验（start ≤ end） |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 粒度（分/秒）           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 双原生表单值            |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| 禁用 / 只读             |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 分隔符 prop / 插槽      |   ✅   |     —      |      —       |    —    |    —     |   —    |

### 使用注意

- 值是 `DateRange`——`DateValue` 组成的 `{ start, end }` 对象，而非 `string`。请与日期族系其他组件搭配使用。
- `defaultValue` 仅在挂载时读取——外部控制请使用 `v-model`。
- 开始晚于结束会被标记无效，但两个值**不会**被自动交换——请在父组件中清空或纠正。
- 表单提交使用两个隐藏输入：开始侧取 `startName`（或共享的 `name`），结束侧取 `endName`。为提交不同字段请同时设置两者；`required`/`min`/`max` 会反射但不执行自定义校验。
- 删除某一组最后一个数字会以该侧 `undefined` 触发 `update:modelValue`；分段随后回退到占位符样式。
- 每组渲染 `role="group"` 且分段为 `role="spinbutton"`；请为整个控件补充 `aria-label`，让读屏软件能播报两组。

## 常见问题

### 如何用键盘在两组之间移动焦点？

使用 `ArrowLeft`/`ArrowRight`——在 end 组第一段按 `ArrowLeft` 跳到 start 组最后一段，在 start 组最后一段按 `ArrowRight` 跳到 end 组第一段。RTL 下物理按键反转。

### 如何提交两个表单值？

传入 `name`（开始侧回退）以及 `startName`/`endName` 以区分字段名——每组渲染一个承载 ISO 值的视觉隐藏原生输入。

### 如何限制可选范围？

传入 `minValue`/`maxValue`——范围外的日期被标记 `data-invalid` 并拒绝。`isDateUnavailable` 接受谓词函数用于任意排除规则；开始晚于结束本身即视为无效。

### `SDateRangeField` 与 `SDateRangePicker` 有什么区别？

`SDateRangeField` 是纯双组分段输入、无弹层——适合快速键入与表单提交。`SDateRangePicker` 在同一字段之上叠加日历 Popover，用于可视化选择。

### 如何自定义分隔符？

传入 `separator`（如 `"→"`）改变文本，或使用 `separator` 插槽渲染任意内容（图标、带样式的标签）。`leading`/`trailing` 插槽可在两组周围放置内容。
