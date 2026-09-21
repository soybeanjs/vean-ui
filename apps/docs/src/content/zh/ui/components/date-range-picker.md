---
head:
  title: 日期范围选择器
  description: 日期范围选择器组件：将可键盘编辑的双段式日期范围字段与日历范围弹层组合，既可直接在分段中键入开始与结束日期，也可点击日历开关在单一月历范围网格中一次选择两端。适用于任何需要用户选择有界区间的场景——预订住宿日期、报表窗口或筛选范围。只需要纯键入、无需弹层时，优先使用 SDateRangeField；需要带弹层的单个日期时，使用 SDatePicker。
---

# 日期范围选择器

## 概述

日期范围选择器组件：将可键盘编辑的双段式日期范围字段与日历范围弹层组合，既可直接在分段中键入开始与结束日期，也可点击日历开关在单一月历范围网格中一次选择两端。适用于任何需要用户选择有界区间的场景——预订住宿日期、报表窗口或筛选范围。只需要纯键入、无需弹层时，优先使用 `SDateRangeField`；需要带弹层的单个日期时，使用 `SDatePicker`。

## 用法

<UsageCode component="date-range-picker" />

## 特性

- 📅 双字段 + 弹层组合——分段 `DateRangeField` 保持可编辑，`CalendarRange` Popover 提供两端日期的可视化选择
- 🎚 受控 / 非受控——值为 `v-model`/`defaultValue`，弹层为 `open`/`defaultOpen`，均由 `useControllableState` 支撑
- ⌨️ 完整键盘编辑——两组内分段增减/键入、跨组方向键移动，日历网格方向键导航，`Escape` 关闭
- ⛓ 范围校验——`minValue`/`maxValue`/`isDateUnavailable` 在字段与日历中同时禁用越界与不可用日期
- 🌍 本地化可访问性——日历开关与弹层对话框的默认 `aria-label` 来自当前 locale 消息，并可通过 `triggerProps`/`popupProps` 覆盖
- 🧩 可组合插槽——`leading` 放置分段前内容、`separator` 自定义分隔符；default 插槽 props 暴露 `open`/`close`/`calendarRangeProps`，支持完全自定义弹层
- 🎨 细粒度样式——`ui` 覆盖字段及 `trigger`/`positioner`/`popup` 槽，`calendarRangeUi` 独立作用于内嵌日历
- 🚫 禁用状态——`disabled` 同时阻止字段编辑与弹层打开

## 组件族系

- `SDateRangePicker`——样式包装层：透传 props 给 Aria compact，注入 `dateRangePickerVariants`（扩展 `dateFieldVariants`），并在弹层内渲染 `SCalendarRange`
- `DateRangePickerCompact`（Aria）——由 `DateRangeFieldCompact` + `PopoverCompact`（日历图标触发器）数据驱动组合，通过 default 插槽暴露弹层状态与 `calendarRangeProps`；无样式使用时从 `@vean/aria/date-range-picker` 导入
- `DateRangeFieldCompact` / `PopoverCompact` / `CalendarRangeCompact`（Aria）——支撑选择器的双段字段、Popover 机制与范围日历网格

## 演示

<PlaygroundGallery component="date-range-picker" />

## API

<ComponentApi component="date-range-picker" />

## 注意

### 架构与行业对标差异

`SDateRangePicker` 将 props 透传给 `DateRangePickerCompact`，后者组合 `DateRangeFieldCompact`（双段 + 校验）与 `PopoverCompact`（`lucide:calendar` 图标触发器，带 `aria-haspopup="dialog"`）。样式层通过 `provideDateRangePickerUi` 注入 `dateRangePickerVariants` 类，使嵌套的 Popover 部分获得 `trigger`/`positioner`/`popup` 样式，再在 default 插槽中用透传的 `calendarRangeProps` 渲染 `SCalendarRange`。选中开始与结束两天后触发 `update:modelValue`，两端齐备即关闭弹层。弹层为 `role="dialog"`，默认可访问名称来自 locale `popupLabel` 消息；开关按钮的默认名称来自 `toggle`。多数对标库是「两个纯文本框 + 范围面板」形态；「双段字段 + Popover 组合」、跨组键盘焦点与 Aria/styled 分离是差异点。

| 能力                         | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :--------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离             |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 双段字段 + 范围弹层          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 值受控 / 非受控              |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 弹层受控 / 非受控            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 键盘分段编辑                 |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 跨组焦点移动                 |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 日历键盘导航                 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| 范围校验                     |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 禁用状态                     |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| locale 驱动的可访问名称      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `leading` / `separator` 插槽 |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 独立的 `calendarRangeUi`     |   ✅   |     —      |      —       |    —    |    —     |   —    |

### 使用注意

- 值是 `DateRange`——由 `DateValue` 构成的 `{ start, end }` 对象，不是 `string`——请与 `SDateRangeField`、`SCalendarRange` 及日期族系其他组件搭配使用。
- `defaultValue`/`defaultOpen` 仅在挂载时读取——外部控制请使用 `v-model`/`open`。
- 开关按钮就是日历图标；其默认 `aria-label`（locale `toggle`）可通过 `triggerProps['aria-label']` 覆盖。图标本身固定——需要自定义触发器时，请用 `@vean/aria/date-range-picker` 组合 `DateRangePickerCompact` 并自行渲染 Popover 内容。
- 弹层 `role="dialog"` 的可访问名称来自 locale `popupLabel` 消息；可通过 `popupProps['aria-label']` 覆盖。
- 通过 `dateFieldProps`（如 `placeholder`、`locale`、`granularity`）配置内嵌双段字段；字段与日历共享 `minValue`/`maxValue`/`isDateUnavailable`。
- `calendarRangeUi` 被内嵌日历消费、不会到达 DOM——`dateFieldProps` 同理。
- 开始日期晚于结束日期会被标记无效，但值不会被自动交换——请在父级清空或纠正。

## 常见问题

### 如何用键盘选择日期范围？

Tab 进入任一分段组并键入数字或用方向键，或按下日历开关后用方向键、`Home`/`End`、`PageUp`/`PageDown` 在月历网格中导航；`Enter` 提交选择，`Escape` 关闭且不选中。两端都选定后值才会发出。

### 如何限制可选范围？

传入 `minValue`/`maxValue`——越界日期在日历中被禁用，字段也会标记自身 `data-invalid`。`isDateUnavailable` 接受谓词函数做任意排除，且同时作用于字段与日历。

### 如何配置内嵌日期范围字段？

使用 `dateFieldProps`——例如 `{ placeholder }`、`{ locale }`、`{ granularity: 'minute' }` 或 `{ hourCycle: 12 }`。字段接受的 props 与 `SDateRangeField` 本身一致。

### 如何自定义日历外观？

`calendarRangeUi` 独立于 `ui` 覆盖范围日历各槽位类。需要更深层定制时，default 插槽会收到 `calendarRangeProps`（外加 `open`/`close`），可以用 `@vean/aria/calendar-range` 的 `CalendarRangeCompact` 渲染自己的弹层内容。

### `SDateRangePicker` 与 `SDateRangeField` 有什么区别？

`SDateRangeField` 是纯双段输入、无弹层——适合快速键入与表单提交。`SDateRangePicker` 在相同字段之上叠加日历范围 Popover，以少量体积换取可视化选择能力。
