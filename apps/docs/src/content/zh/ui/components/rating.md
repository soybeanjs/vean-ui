---
head:
  title: 评分
  description: 基于多插槽 Aria 内核构建的星级评分组件：RatingRoot 提供 slider 上下文、状态与键盘处理，每个 RatingItem 渲染单个星星。支持受控与非受控模式、半星精度、重复点击清除、只读与禁用状态、水平/垂直方向、RTL 文本方向，以及通过视觉隐藏输入框实现的原生表单集成。适用于用户表达分级偏好的场景——商品评价、反馈调研或技能自评。
---

# 评分

## 概述

基于多插槽 Aria 内核构建的星级评分组件：`RatingRoot` 提供 slider 上下文、状态与键盘处理，每个 `RatingItem` 渲染单个星星。支持受控与非受控模式、半星精度、重复点击清除、只读与禁用状态、水平/垂直方向、RTL 文本方向，以及通过视觉隐藏输入框实现的原生表单集成。适用于用户表达分级偏好的场景——商品评价、反馈调研或技能自评。

## 用法

<UsageCode component="rating" />

## 特性

- 🎚 `modelValue` / `defaultValue` — 基于 `useControllableState` 的受控与非受控双模式
- ⭐ `max`（默认 5）驱动星星数量；每个 `RatingItem` 由上下文生成
- ½ `allowHalf` 启用半星精度；指针位置与方向键步进解析为 0.5 增量
- ♻️ `allowClear` 在再次点击当前项时将值重置为 0
- ⌨️ 键盘可操作 — ArrowUp/Right 递增、ArrowDown/Left 递减、Home 重置为 0、End 设为最大值
- ♿ `role="slider"` 完整反射 `aria-valuenow/min/max/valuetext/orientation/readonly/disabled/label`
- 🧭 `orientation`（水平/垂直）与 `dir`（ltr/rtl）驱动布局与 ARIA 方向
- 🎨 `ratingVariants`（6 尺寸）+ `ratingItemVariants`（8 颜色 × 2 变体 × 6 尺寸）；默认颜色 `warning`，默认变体 `filled`
- 🧩 `icon` 插槽暴露 `{ index, value, state }`（`state` 为 `'full' | 'half' | 'empty'`），用于自定义星星渲染
- 📝 传入 `name` 时通过 `VisuallyHiddenInput` 实现表单集成
- 🌐 本地化 ARIA — `rating.ariaLabel`、`rating.starN`（`{count}/{max} 星`）、`rating.empty`
- 🚫 `readonly` + `disabled` 状态，带有守卫的指针与键盘处理

## 演示

<PlaygroundGallery component="rating" />

## API

<ComponentApi component="rating" />

## 注意事项

### 架构与行业对标

VeanUI 将评分拆分为 Aria `RatingRoot`（slider 上下文、`useControllableState`、键盘导航、ARIA 反射、半步指针解析、`VisuallyHiddenInput` 表单绑定）与 Aria `RatingItem`（从上下文渲染每颗星星，暴露 `state` 供插槽驱动图标）。UI 包装 `SRating` 通过标准多插槽 `provide*Ui` / `useUiContext` 模式注入 `ratingVariants` 与 `ratingItemVariants` 类；状态与视觉通过 `data-[state=...]` 选择器解耦。与 AntD `Rate`、Element Plus `el-rate`、Mantine `Rating`、Naive UI `n-rate` 相比，VeanUI 是唯一同时具备 Aria/styled 分离、RTL 支持、垂直方向与原生表单集成的对标库；shadcn 未提供评分组件。

| 能力               | VeanUI |   Ant Design    |  Element Plus   |     Mantine     |  Naive UI  | shadcn |
| :----------------- | :----: | :-------------: | :-------------: | :-------------: | :--------: | :----: |
| Aria/styled 分离   |   ✅   |        —        |        —        |        —        |     —      |   —    |
| 受控/非受控        |   ✅   |       ✅        |       ✅        |       ✅        |     ✅     |   —    |
| 半星精度           |   ✅   |       ✅        |       ✅        | ✅（fractions） |     ✅     |   —    |
| 允许清除           |   ✅   |       ✅        |       ✅        |       ✅        |     ✅     |   —    |
| 只读模式           |   ✅   |       ✅        |       ✅        |       ✅        |     ✅     |   —    |
| 自定义图标（插槽） |   ✅   | ✅（character） | ✅（iconClass） |       ✅        |     ✅     |   —    |
| 键盘导航           |   ✅   |        —        |        —        |       ✅        |     —      |   —    |
| RTL 支持           |   ✅   |        —        |        —        |        —        |     —      |   —    |
| 垂直方向           |   ✅   |        —        |        —        |       ✅        |     —      |   —    |
| 表单集成           |   ✅   |        —        |        —        |       ✅        |     —      |   —    |
| 颜色/尺寸变体      |   ✅   |      size       |      size       |      size       | size/color |   —    |

### 使用注意

- 根元素带有 `role="slider"`；不要给子项添加 `role="img"` 或其他冲突的 role。
- 半星精度依赖单项内的指针位置；触控设备上可考虑扩大命中区域，以便用户稳定命中半星区域。
- `allowClear` 仅在点击项与当前值匹配时触发——点击其他项会正常改变值。
- `icon` 插槽接收 `state`（`'full'` / `'half'` / `'empty'`）；自定义图标可通过 `data-[state=...]` 选择器或条件渲染实现。

## 常见问题

### 受控还是非受控？

传入 `modelValue` 配合 `v-model` 使用受控模式，或传入 `defaultValue` 让组件内部自持状态。两种模式均由 `useControllableState` 支撑。

### 如何使用半星精度？

将 `allowHalf` 设为 `true`。此时方向键以 0.5 为步进，单项内的指针位置决定该步解析为半星还是整星。

### 如何自定义图标？

使用 `icon` 插槽并读取 `state` 参数：`<template #icon="{ state }">...</template>`。如需位置感知渲染，插槽还会传入 `index` 与 `value`。

### 如何清除评分？

将 `allowClear` 设为 `true`。点击与当前值匹配的项将把评分重置为 0；点击其他项行为不变。
