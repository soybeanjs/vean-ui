---
head:
  title: 时间字段
  description: "分段式时间输入组件：将小时、分钟以及可选的秒数与上午/下午时段渲染为独立可编辑的分段，同时提交原生表单值。适用于任何需要用户快速、精确输入时间的场景——日程安排、预订、时间窗口筛选，或需要时间校验的表单。需要日期 + 时间时，使用 granularity: 'minute' 的 SDateField；需要时间范围时，优先使用 STimeRangeField。"
---

# 时间字段

## 概述

分段式时间输入组件：将小时、分钟以及可选的秒数与上午/下午时段渲染为独立可编辑的分段，同时提交原生表单值。适用于任何需要用户快速、精确输入时间的场景——日程安排、预订、时间窗口筛选，或需要时间校验的表单。需要日期 + 时间时，使用 `granularity: 'minute'` 的 `SDateField`；需要时间范围时，优先使用 `STimeRangeField`。

## 用法

<UsageCode component="time-field" />

## 特性

- 🕐 分段编辑——小时、分钟以及可选的秒数与上午/下午分段，每段为可编辑的 `role="spinbutton"`
- 🎚 受控 / 非受控——值为 `v-model`/`defaultValue`，由 `useControllableState` 支撑
- 🕛 12/24 小时制——`hourCycle` 按 locale 在 `AM/PM` 与 24 小时制间切换，支持时段分段编辑
- ⌨️ 完整键盘支持——数字键入自动进位，`ArrowUp`/`ArrowDown` 增减，`ArrowLeft`/`ArrowRight` 段间导航（RTL 反转）
- ⛓ 时间校验——`minValue`/`maxValue`/`isTimeUnavailable` 标记根元素 `data-invalid`
- 📝 原生表单值——视觉隐藏的 `input[type="time"]` 向所属表单提交 ISO 值
- ⚙️ 粒度与步长——`granularity`（hour/minute/second）与 `step` 控制渲染的分段与每次方向键增量
- 🧩 可组合插槽——`leading`/`trailing` 在分段两侧放置内容
- 🚫 禁用 / 只读——两种状态均阻止编辑并渲染正确的 `data-*`/`aria-*` 属性

## 组件族系

- `STimeField`——样式包装层：透传 props 给 Aria compact，注入 `dateFieldVariants`（与 `SDateField` 共享）类
- `TimeFieldCompact`（Aria）——由 `TimeFieldRoot` + 每段一个 `TimeFieldInput` 数据驱动组合，并承载 `leading`/`trailing` 插槽；无样式使用时从 `@vean/aria/time-field` 导入
- `TimeFieldRoot` / `TimeFieldInput`（Aria）——状态所有者（分段值、校验、隐藏输入、焦点管理）与绑定共享 `useDateField` 组合式的单个可编辑分段

## 演示

<PlaygroundGallery component="time-field" />

## API

<ComponentApi component="time-field" />

## 注意

### 架构与行业对标差异

`TimeFieldRoot` 经 `useControllableState` 持有 `TimeValue`，以 shallowRef 维护 `segmentValues`，并通过 `isInvalid` 完成校验。每个 `TimeFieldInput` 绑定 `date-field` 族共享的 `useDateField` 组合式做逐段键盘逻辑；`TimeFieldCompact` 遍历 `createContent` 生成的分段并逐个渲染输入，两侧承载 `leading`/`trailing` 插槽。焦点移动由 Root 的 `moveFocus` 处理，按键按 `dir` 映射物理方向，RTL 下 `ArrowLeft`/`ArrowRight` 互换。多数对标库是「纯文本框 + 选择面板」形态；「分段 spinbutton + 键盘增减/键入」模式与 Aria/styled 分离是差异点。

| 能力                        | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :-------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 分段可编辑                  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 受控 / 非受控               |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 12/24 小时制                |   ✅   |     ✅     |      ✅      |    —    |    ✅    |   —    |
| 键盘增减 / 键入             |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 段导航 + RTL                |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 范围校验                    |   ✅   |     ✅     |      —       |    —    |    —     |   —    |
| `isTimeUnavailable`         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 粒度（秒）                  |   ✅   |     ✅     |      ✅      |    —    |    ✅    |   —    |
| 可配置步长                  |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| 原生表单值                  |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `leading` / `trailing` 插槽 |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 禁用 / 只读                 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### 使用注意

- 值是 `TimeValue`——一个原生 `Date`，仅小时/分钟/秒部分有意义（日期部分被归一化），不是 `string`。请与日期族系其他组件搭配使用。
- `defaultValue` 仅在挂载时读取——外部控制请使用 `v-model`。
- 值为空时分段显示占位时间（由 `defaultValue`/`defaultPlaceholder` 或当前时间推导）——提交的表单值在键入前仍为空。
- `granularity` 默认为 `'minute'`；传 `'second'` 渲染秒分段，传 `'hour'` 隐藏分钟分段。
- `hourCycle`（`12`/`24`）控制时段分段与可访问小时范围；不传则跟随 locale。
- 时间校验只标记 `data-invalid`，从不自动修正值——请在父级清空或纠正。

## 常见问题

### 如何用键盘编辑时间？

Tab 进入字段并键入数字——分段填满后自动进位。`ArrowUp`/`ArrowDown` 增减当前分段，`ArrowLeft`/`ArrowRight` 在段间移动（RTL 反转），`Backspace` 清除数字。12 小时制下按 `a`/`p` 切换 `AM`/`PM`。

### 如何显示秒或隐藏分钟分段？

传 `granularity: 'second'` 渲染小时、分钟、秒分段；传 `granularity: 'hour'` 仅渲染小时分段。

### 如何在 12 小时与 24 小时制之间切换？

传 `hourCycle: 12` 或 `hourCycle: 24`；不传则跟随当前 locale。

### 如何限制可选时间？

传 `minValue`/`maxValue`——范围外的时间被标记 `data-invalid` 并拒绝。`isTimeUnavailable` 接受谓词函数做任意排除。

### `STimeField` 与 `granularity: 'minute'` 的 `SDateField` 有什么区别？

`STimeField` 是纯时间输入——从不渲染日期分段。`SDateField` 在时间粒度下会整体渲染日期与时间（如 `2026/04/19 14:30`），并接受 `{ date, time }` 值。
