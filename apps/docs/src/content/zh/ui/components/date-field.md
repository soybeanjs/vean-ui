---
head:
  title: 日期字段
  description: 分段式日期输入组件。将日、月、年以及可选的时间段拆成可独立键盘编辑的分段，同时仍能以原生表单值提交。适用于追求快速输入的紧凑日期录入场景——出生日期、有效期，或任何需要按范围校验的单个日期。需要从日历弹层选择日期时，优先使用 SDatePicker；需要浏览日历网格时，使用 SCalendar。
---

# 日期字段

## 概述

分段式日期输入组件。将日、月、年以及可选的时间段拆成可独立键盘编辑的分段，同时仍能以原生表单值提交。适用于追求快速输入的紧凑日期录入场景——出生日期、有效期，或任何需要按范围校验的单个日期。需要从日历弹层选择日期时，优先使用 `SDatePicker`；需要浏览日历网格时，使用 `SCalendar`。

## 用法

<UsageCode component="date-field" />

## 特性

- 🧩 分段输入——每个日期部分（日/月/年，可选的时/分/秒/上午下午）都是可独立编辑的分段
- ⌨️ 完整键盘编辑——方向键增减、键入填充数字、自动前进到下一分段、Backspace 删除、`Enter`/失焦提交
- 🎚 受控 / 非受控——`v-model` 与 `defaultValue` 由 `useControllableState` 支撑，另支持 `update:placeholder`
- ⛓ 范围校验——`minValue`/`maxValue`/`isDateUnavailable` 驱动 `data-invalid` + `aria-invalid` 状态
- 🕐 粒度与时间——`granularity`（day/hour/minute/second）、12/24 小时制 `hourCycle`、`dayPeriod` 分段
- 📝 原生表单——视觉隐藏输入（`name`/`required`/`min`/`max`）随所属表单提交 ISO 值
- 🚫 禁用 / 只读——两者都渲染正确的 `data-*`/`aria-*` 状态并阻止编辑
- 🧩 可扩展——`leading`/`trailing` 插槽以及 `ui.root`/`ui.input` 类覆盖，构建于 Aria `DateFieldRoot`/`DateFieldInput` 之上

## 组件族系

- `SDateField`——样式包装层，透传 props 给 Aria compact 并注入 `dateFieldVariants` 类
- `DateFieldCompact`（Aria）——由 `DateFieldRoot` + 逐分段 `DateFieldInput` 数据驱动组合；无样式使用时从 `@vean/aria/date-field` 导入
- `DateFieldRoot` / `DateFieldInput`（Aria）——状态所有者（分段、校验、隐藏输入）与单个可编辑分段

## 演示

<PlaygroundGallery component="date-field" />

## API

<ComponentApi component="date-field" />

## 注意

### 架构与行业对标差异

`DateFieldRoot` 通过 `useControllableState` 持有值，用 `Intl.DateTimeFormat` formatter 推导分段布局，并经 `isInvalid` 完成校验。每个 `DateFieldInput` 绑定 `useDateField` 组合式——它实现 per-part 键盘逻辑（增减/输入/自动前进/删除），由 `time-field` 族共享。编辑时原地变更 `segmentValues` shallowRef；root 在全部段填满后提交组装出的 `DateValue`。分段式日期输入模式源自 reka-ui（Radix）；各对标库的日期输入通常是纯文本框加选择弹层，而非分段形式。

| 能力                      | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :------------------------ | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 可编辑分段                |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 受控 / 非受控             |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 键盘增减 / 键入           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 分段间自动前进            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 范围校验                  |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`       |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 粒度（分/秒）             |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 12/24 小时制 `dayPeriod`  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 禁用 / 只读               |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 原生表单提交              |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `leading`/`trailing` 插槽 |   ✅   |     —      |      —       |    —    |    —     |   —    |

### 使用注意

- 每个分段一旦填满即被提交；删除最后一个数字会以 `undefined` 触发 `update:modelValue`。
- `defaultValue` 仅在挂载时读取——外部控制请使用 `v-model`。
- root 使用 `role="group"`，每个可编辑分段 `role="spinbutton"` 并带 `aria-valuemin`/`aria-valuemax`/`aria-valuenow`；请为字段补充 `aria-label`，让读屏软件能播报整个控件。
- 表单提交依赖 `name`；`required`/`min`/`max` 会反射到隐藏输入，但不执行自定义校验。
- `granularity="day"` 渲染 `type="date"`；时间粒度在隐藏输入上渲染 `type="datetime-local"`。
- `readonly` 与 `disabled` 不同：字段仍可聚焦可见，但阻止编辑。

## 常见问题

### 如何清空值？

在单数字分段上按 Backspace（双数字分段需按两次）会清空该段并以 `undefined` 触发 `update:modelValue`——请在父组件处理 `undefined`。随后分段回退到占位符样式。

### 如何限制可选范围？

传入 `minValue`/`maxValue`——值超出范围时字段标记自身 `data-invalid`（分段上还有 `aria-invalid`）。`isDateUnavailable` 接受谓词函数，用于任意排除规则。

### 如何使用 12 小时制？

传入 `hourCycle={12}`（或让 locale 决定）——小时段变为 1–12，并出现 `dayPeriod`（AM/PM）分段。方向键与 `a`/`p` 键可切换时段。

### `SDateField` 与 `SDatePicker` 有什么区别？

`SDateField` 是纯分段输入、无弹层——适合快速键入与表单提交。`SDatePicker` 在 `DateField` 之外嵌入日历 Popover，用于可视化选择。

### 如何自定义外观？

用 `ui.root`/`ui.input` 做类覆盖，或用 `leading`/`trailing` 插槽在分段周围放置图标/单位。需要完全无样式控制时，从 `@vean/aria/date-field` 组合 `DateFieldRoot`/`DateFieldInput`。
