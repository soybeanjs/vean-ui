---
head:
  title: 日期选择器
  description: 日期选择器组件：将可键盘编辑的分段式日期字段与日历弹层组合，既可直接在分段中键入日期，也可点击日历开关从月历网格中选择。适用于任何需要用户选择单个日期的场景——预订、日程、筛选，或需要范围校验的表单。只需要纯键入、无需弹层时，优先使用 SDateField；需要独立浏览日历网格时，使用 SCalendar。
---

# 日期选择器

## 概述

日期选择器组件：将可键盘编辑的分段式日期字段与日历弹层组合，既可直接在分段中键入日期，也可点击日历开关从月历网格中选择。适用于任何需要用户选择单个日期的场景——预订、日程、筛选，或需要范围校验的表单。只需要纯键入、无需弹层时，优先使用 `SDateField`；需要独立浏览日历网格时，使用 `SCalendar`。

## 用法

<UsageCode component="date-picker" />

## 特性

- 📅 字段 + 弹层组合——分段 `DateField` 保持可编辑，日历 Popover 提供可视化选择
- 🎚 受控 / 非受控——值为 `v-model`/`defaultValue`，弹层为 `open`/`defaultOpen`，均由 `useControllableState` 支撑
- ⌨️ 完整键盘编辑——字段内分段增减/键入，日历网格方向键导航，`Escape` 关闭
- ⛓ 范围校验——`minValue`/`maxValue`/`isDateUnavailable` 在字段与日历中同时禁用越界与不可用日期
- 🌍 本地化可访问性——日历开关与弹层对话框的默认 `aria-label` 来自当前 locale 消息，并可通过 `triggerProps`/`popupProps` 覆盖
- 🧩 可组合插槽——`leading` 放置分段前内容；`default` 插槽 props 暴露 `open`/`close`/`calendarProps`，支持完全自定义弹层
- 🎨 细粒度样式——`ui` 覆盖字段及 `trigger`/`positioner`/`popup` 槽，`calendarUi` 独立作用于内嵌日历
- 🚫 禁用状态——`disabled` 同时阻止字段编辑与弹层打开

## 组件族系

- `SDatePicker`——样式包装层：透传 props 给 Aria compact，注入 `datePickerVariants`（扩展 `dateFieldVariants`），并在弹层内渲染 `SCalendar`
- `DatePickerCompact`（Aria）——由 `DateFieldCompact` + `PopoverCompact`（日历图标触发器）数据驱动组合，通过 default 插槽暴露弹层状态与 `calendarProps`；无样式使用时从 `@vean/aria/date-picker` 导入
- `DateFieldCompact` / `PopoverCompact` / `CalendarCompact`（Aria）——支撑选择器的分段字段、Popover 机制与日历网格

## 演示

<PlaygroundGallery component="date-picker" />

## API

<ComponentApi component="date-picker" />

## 注意

### 架构与行业对标差异

`SDatePicker` 将 props 透传给 `DatePickerCompact`，后者组合 `DateFieldCompact`（分段 + 校验）与 `PopoverCompact`（`lucide:calendar` 图标触发器，带 `aria-haspopup="dialog"`）。样式层通过 `provideDatePickerUi` 注入 `datePickerVariants` 类，使嵌套的 Popover 部分获得 `trigger`/`positioner`/`popup` 样式，再在 default 插槽中用透传的 `calendarProps` 渲染 `SCalendar`。选中某天后触发 `update:modelValue` 并关闭弹层。弹层为 `role="dialog"`，默认可访问名称来自 locale `popupLabel` 消息；开关按钮的默认名称来自 `toggle`。多数对标库是「纯文本框 + 选择面板」形态；「分段字段 + Popover 组合」与 Aria/styled 分离是差异点。

| 能力                    | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :---------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 分段字段 + 日历弹层     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 值受控 / 非受控         |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 弹层受控 / 非受控       |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 键盘分段编辑            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 日历键盘导航            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| 范围校验                |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 禁用状态                |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| locale 驱动的可访问名称 |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `leading` 插槽          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 独立的 `calendarUi`     |   ✅   |     —      |      —       |    —    |    —     |   —    |

### 使用注意

- 值是 `DateValue`（`Date` 或 `{ date, time? }`），不是 `string`——请与 `SDateField`、`SCalendar` 及日期族系其他组件搭配使用。
- `defaultValue`/`defaultOpen` 仅在挂载时读取——外部控制请使用 `v-model`/`open`。
- 开关按钮就是日历图标；其默认 `aria-label`（locale `toggle`）可通过 `triggerProps['aria-label']` 覆盖。图标本身固定——需要自定义触发器时，请用 `@vean/aria/date-picker` 组合 `DatePickerCompact` 并自行渲染 Popover 内容。
- 弹层 `role="dialog"` 的可访问名称来自 locale `popupLabel` 消息；可通过 `popupProps['aria-label']` 覆盖。
- 通过 `dateFieldProps`（如 `placeholder`、`locale`、`granularity`）配置内嵌分段字段；字段与日历共享 `minValue`/`maxValue`/`isDateUnavailable`。
- `calendarUi` 被内嵌日历消费、不会到达 DOM——`dateFieldProps` 同理。

## 常见问题

### 如何用键盘选择日期？

Tab 进入分段字段并键入数字或用方向键，或按下日历开关后用方向键、`Home`/`End`、`PageUp`/`PageDown` 在月历网格中导航；`Enter` 选中并关闭，`Escape` 关闭且不选中。

### 如何限制可选范围？

传入 `minValue`/`maxValue`——越界日期在日历中被禁用，字段也会标记自身 `data-invalid`。`isDateUnavailable` 接受谓词函数做任意排除，且同时作用于字段与日历。

### 如何配置内嵌日期字段？

使用 `dateFieldProps`——例如 `{ placeholder }`、`{ locale }`、`{ granularity: 'minute' }` 或 `{ hourCycle: 12 }`。字段接受的 props 与 `SDateField` 本身一致。

### 如何自定义日历外观？

`calendarUi` 独立于 `ui` 覆盖日历各槽位类。需要更深层定制时，default 插槽会收到 `calendarProps`（外加 `open`/`close`），可以用 `@vean/aria/calendar` 的 `CalendarCompact` 渲染自己的弹层内容。

### `SDatePicker` 与 `SDateField` 有什么区别？

`SDateField` 是纯分段输入、无弹层——适合快速键入与表单提交。`SDatePicker` 在相同字段之上叠加日历 Popover，以少量体积换取可视化选择能力。
