---
head:
  title: 分段控件
  description: 由两个或更多互斥选项组成的线性控件，以统一的形态呈现，并带有跟随当前选中项的滑动指示器。适用于紧凑的分段选择场景——时间范围、视图切换或任何小型单选选项——且选择需要立即生效。若需要一组独立的双态按钮（单选或多选），使用 SToggleGroup；若只是普通的标签页内容面板，使用 STabs。
---

# 分段控件

## 概述

由两个或更多互斥选项组成的线性控件，以统一的形态呈现，并带有跟随当前选中项的滑动指示器。适用于紧凑的分段选择场景——时间范围、视图切换或任何小型单选选项——且选择需要立即生效。若需要一组独立的双态按钮（单选或多选），使用 `SToggleGroup`；若只是普通的标签页内容面板，使用 `STabs`。

## 用法

<UsageCode component="segment" />

## 特性

- 🎯 互斥单选——同一时刻只有一个分段处于选中态，由 `useControllableState` 支撑
- 🎚 受控 / 非受控——`v-model` 与 `defaultValue`（泛型值通过 `T extends SegmentOptionData` 获得类型安全）
- 🧩 数据驱动组合——传入 `items`，由 Aria `SegmentCompact` 负责遍历与指示器布局
- ✨ 可选滑动指示器——`enableIndicator`（默认 `true`），可通过 `indicator` 插槽完全自定义
- ⌨️ Roving focus 键盘导航——方向键在分段间移动焦点，`loop` 循环回绕，RTL 下方向自动反转
- 🎨 6 尺寸 × 2 方向 × 2 形状（square/rounded）× 2 填充（auto/full）——由 `segmentVariants` 提供
- 🧩 `ui` 各插槽类覆盖（`root` / `list` / `trigger` / `indicator` / `indicatorContent`），支持条目级 `disabled`
- ♿ `role="tab"` + `aria-selected` 并反射 `data-state`，axe 零违规

## 组件族系

- `SSegment`——样式包装层，透传 props 给 Aria compact 并注入 `segmentVariants` 类
- `SegmentRoot` / `SegmentList` / `SegmentTrigger` / `SegmentIndicator`（Aria）— 包装 Tabs 的领域基元；DOM 使用 `data-vean-segment-*`
- `SegmentCompact`（Aria）——由上述基元数据驱动组合；无样式使用时从 `@vean/aria/segment` 导入

## 演示

<PlaygroundGallery component="segment" />

## API

<ComponentApi component="segment" />

## 注意

### 架构与行业对标差异

`SegmentCompact` 组合了 Aria 的 `SegmentRoot`/`SegmentList`/`SegmentTrigger`/`SegmentIndicator` 基元（各自包装对应的 Tabs 部件）：负责遍历 `items`、转发 `listProps`/`triggerProps`/`indicatorProps`，并暴露 `item`/`indicator` 插槽。`SegmentTrigger` 沿用 Tabs 的 ARIA 模式（`role="tab"` + 焦点漫游），因此 `loop` 与 `dir`（RTL）行为与 Tabs 完全一致。`SSegment` 是薄包装层，仅计算 `segmentVariants`（`tabsVariants` 的别名）并调用 `provideSegmentUi`。指示器通过异步布局测量定位（resize observer + post-flush watch），因此在挂载后一帧出现。`segment` 对应分段控件模式；各对标库原生提供该模式，唯一例外是 shadcn，通常以 Tabs 替代。

| 能力                    | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :---------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 单选（互斥）            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 受控 / 非受控           |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 数据驱动 items          |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 滑动指示器              |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Roving focus 方向键     |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| Loop 循环导航           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL 方向感知            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 方向（竖排）            |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| 尺寸 × 形状 × 填充      |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| 条目级禁用              |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 自定义条目 / 指示器插槽 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### 使用注意

- `loop` 与 `unmountOnHide` 默认 `true`；`enableIndicator` 默认 `true`。设置 `:enable-indicator="false"` 可隐藏滑动指示器（此时选中态通过 `data-state` 样式规则体现）。
- 指示器经异步布局测量定位——选中项变化后一帧才渲染到位。
- 分段使用 Tabs ARIA 模式（`role="tab"` + `aria-selected`），应避免将分段嵌套在其它 Tabs 类控件内部。
- `defaultValue` 仅在挂载时读取，后续变化会被忽略（外部控制请使用 `v-model`）。
- 仅含图标的条目请补充 `aria-label`，确保分段有可访问名称。
- `unmountOnHide` 仅在挂载了内容面板时才有意义；单独的 `SSegment` 不渲染内容区。

## 常见问题

### `SSegment` 与 `SToggleGroup` 有什么区别？

`SSegment` 是带滑动指示器的互斥单选分段控件——同一时刻仅一项选中。`SToggleGroup` 协调一组相互独立的切换按钮，支持单选或多选，无指示器。

### 如何禁用滑动指示器？

传入 `:enable-indicator="false"`。此时选中项改由 `data-selected` 样式规则高亮。

### 如何让方向键循环回绕？

保持 `loop`（默认 `true`）即可——焦点从最后一个分段回绕到第一个，反之亦然。禁用分段会被自动跳过。

### 如何外部控制选中值？

双向控制绑定 `v-model`；仅传入 `defaultValue` 则为非受控用法。用 `items` 声明选项，每个条目支持 `value`、`label` 与 `disabled`。

### 可以自定义指示器与条目的样式吗？

可以——`indicator` 插槽替换默认指示器内容；`item` 插槽接收 `{ ...item, active }` 支持完全自定义；`ui.root` / `ui.list` / `ui.trigger` / `ui.indicator` 提供各插槽类覆盖。
