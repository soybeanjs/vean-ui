---
head:
  title: TimeRangeField
  description: TimeRangeField 是一个分段式时间范围输入组件，提供独立的开始和结束时间编辑分段（小时、分钟，以及可选的秒和上午/下午分段），同时保留两侧原生表单提交值。当用户需要快速、精确地输入开始和结束时间时使用——排期、预订、班次或时间窗口筛选。单个时间使用 STimeField；日期时间范围则使用带时间粒度的 SDateRangeField 或 SDateRangePicker。
---

# TimeRangeField

## 概述

TimeRangeField 是一个分段式时间范围输入组件，提供独立的开始和结束时间编辑分段（小时、分钟，以及可选的秒和上午/下午分段），同时保留两侧原生表单提交值。当用户需要快速、精确地输入开始和结束时间时使用——排期、预订、班次或时间窗口筛选。单个时间使用 `STimeField`；日期时间范围则使用带时间粒度的 `SDateRangeField` 或 `SDateRangePicker`。

## 用法

<UsageCode component="time-range-field" />

## 特性

- ⏱ 双组分段编辑 — 独立的开始/结束小时、分钟及可选秒和上午/下午分段，每段均为可编辑的 `role="spinbutton"`
- 🎚 受控 / 非受控 — 对整个 `{ start, end }` 范围支持 `v-model`/`defaultValue`，底层由 `useControllableState` 驱动
- 🕛 12/24 小时制 — `hourCycle` 按语言环境在 `AM/PM` 与 24 小时制之间切换，两侧均可编辑上午/下午分段
- ⌨️ 完整键盘支持 — 数字键入自动进位、`ArrowUp`/`ArrowDown` 增减、`ArrowLeft`/`ArrowRight` 跨组导航且在 RTL 下方向反转
- ⛓ 范围校验 — 自动强制 `start ≤ end`，配合 `minValue`/`maxValue`/`isTimeUnavailable` 在根节点标记 `data-invalid`
- 📝 两个原生表单值 — 视觉隐藏的 `input[type="time"]` 以 `startName`/`endName` 提交两侧值
- ⚙️ 粒度与步长 — `granularity`（hour/minute/second）与 `step` 控制渲染的分段与每次按键的增量
- 🧩 可组合插槽 — `leading`/`trailing` 在两组周围放置内容，`separator` 自定义中间分隔符
- 🚫 禁用 / 只读 — 两种状态均阻止所有分段编辑并渲染对应的 `data-*`/`aria-*` 属性

## 组件家族

- `STimeRangeField` — 样式包装层，将 props 转发给 Aria compact 并注入 `dateRangeFieldVariants`（与 `SDateRangeField` 共享）类
- `TimeRangeFieldCompact`（Aria）— `TimeRangeFieldRoot` + 两组各段一个 `TimeRangeFieldInput` 的数据驱动组合，含 `leading`/`separator`/`trailing` 插槽；无样式用法从 `@vean/aria/time-range-field` 导入
- `TimeRangeFieldRoot` / `TimeRangeFieldInput`（Aria）— 状态所有者（分段值、范围校验、两个隐藏输入、跨组焦点管理）与绑定共享 `useDateField` 组合式的单个可编辑分段

## 演示

<PlaygroundGallery component="time-range-field" />

## API

<ComponentApi component="time-range-field" />

## 注意事项

### 架构与对标差异

`TimeRangeFieldRoot` 通过 `useControllableState` 持有 `TimeRange`，以两个 shallowRef 维护 `startSegmentValues`/`endSegmentValues`，并通过 `isInvalid` 完成范围校验（end 早于 start、`minValue`/`maxValue`、`isTimeUnavailable`）。每个 `TimeRangeFieldInput` 绑定 `date-field` 家族共享的 `useDateField` 组合式；`TimeRangeFieldCompact` 遍历 `createContent` 生成的分段，在两个 `data-time-range-field-part` 分组内各渲染一个输入，分组之间以 `separator` 插槽分隔。跨组焦点移动由 root 的 `moveFocus` 处理——依据 `dir` 映射物理方向键，RTL 下 `ArrowLeft`/`ArrowRight` 互换，分组边界按物理方向（`delta`）而非按键语义跨越。对标库多为「两个独立文本框」（或纯选择面板）；双分段组 + 跨边界键盘导航与 Aria/styled 分离是差异点。

| 能力                    | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :---------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 双组分段可编辑组        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 跨组焦点移动            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL 方向反转            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 受控 / 非受控           |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 键盘增减 / 键入         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 范围校验（start ≤ end） |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isTimeUnavailable`     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 粒度（秒）              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 双原生表单值            |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| 分隔符 prop / 插槽      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 禁用 / 只读             |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### 运行时注意事项

- 值是 `TimeRange`——由 `TimeValue`（时间部分有意义的原生 `Date`）组成的 `{ start, end }` 对象，而非 `string`。请与其他日期家族组件搭配使用。
- `defaultValue` 仅在挂载时读取——外部控制请使用 `v-model`。
- 某一侧为空时，其分段显示占位时间（由 `defaultValue`/`defaultPlaceholder` 或当前时间派生）——提交的表单值在用户键入前仍为空。
- `granularity` 默认 `'minute'`；传入 `'second'` 可在两侧渲染秒分段。
- `hourCycle`（`12`/`24`）控制上午/下午分段与可访问的小时范围；不传则跟随语言环境。
- 范围校验会标记根节点 `data-invalid` 但不会钳制值——请在父级清空或纠正。
- 两个隐藏输入共用 `required`；如需按侧提交命名请传 `startName`/`endName`（未传时 start 侧回退使用 `name`）。

## 常见问题

### 如何用键盘编辑范围？

聚焦任一组后直接键入数字——分段填满后自动进位。`ArrowUp`/`ArrowDown` 增减当前分段，`ArrowLeft`/`ArrowRight` 在分段间移动——包括跨越开始/结束边界——RTL 下方向反转。12 小时制下 `a`/`p` 切换 `AM`/`PM`。

### 如何在两侧显示秒分段？

传入 `granularity: 'second'` 即可在开始和结束组渲染小时、分钟与秒分段。

### 如何自定义开始与结束之间的分隔符？

通过 `separator: '→'` prop 使用简单文本分隔符，或使用 `separator` 插槽渲染任意内容（例如图标）。

### 如何强制 end 晚于 start？

当 `end` 早于 `start` 时组件会自动标记根节点 `data-invalid`。可配合 `minValue`/`maxValue`/`isTimeUnavailable` 施加任意约束——校验不会钳制值，请在父级纠正。

### `STimeRangeField` 与 `SDateRangeField` 有何区别？

`STimeRangeField` 是纯时间范围输入——绝不渲染日期分段。`SDateRangeField` 渲染完整日期（可通过粒度带时间）并接受 `DateValue` 对。
