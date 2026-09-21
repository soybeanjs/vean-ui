---
head:
  title: 颜色区域
  description: 二维颜色编辑区域，可在饱和度/明度、饱和度/亮度或 OKLCH 的色度/明度之间拖拽选择。SColorArea 组合 Aria ColorAreaRoot/ColorAreaArea/ColorAreaThumb 基础组件与 colorAreaVariants 样式配方（3 个槽、6 种尺寸）。
---

# 颜色区域

## 概述

二维颜色编辑区域，可在饱和度/明度、饱和度/亮度或 OKLCH 的色度/明度之间拖拽选择。`SColorArea` 组合 Aria `ColorAreaRoot`/`ColorAreaArea`/`ColorAreaThumb` 基础组件与 `colorAreaVariants` 样式配方（3 个槽、6 种尺寸）。

颜色区域适合颜色选择器内部的饱和度/明度平面（通常与 `color-slider` 的色相通道配合使用）。

## 用法

<UsageCode component="color-area" />

## 特性

- 🧩 Aria/样式分离 — `ColorAreaCompact` 组合区域 + 滑块；`SColorArea` 只注入样式并转发 prop/事件
- 🎛️ 轴通道 — `xChannel`/`yChannel` 可选 `hue`/`saturation`/`lightness`/`brightness`/`chroma`
- 🎨 颜色空间 — `colorSpace`（如 `hsl`、`oklch`）配合 `format` 控制输出字符串
- ⌨️ 键盘 — 方向键以微调/步进调整滑块；`role="application"` + `role="slider"`
- 📝 表单字段 — 经 `xName`/`yName` 生成隐藏 `x`/`y` 输入，支持原生表单提交
- 🔒 禁用 — `disabled` 禁用交互
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖

## 组件家族

- `SColorArea`（样式层）— 入口包装组件；`colorAreaVariants` 配方配合动态插槽转发
- `ColorAreaRoot`（Aria）— 状态持有者；`modelValue`/`color`、轴通道、`colorSpace`/`format`、`updateValues`/`commitValues`
- `ColorAreaArea`（Aria）— 2D 平面表面
- `ColorAreaThumb`（Aria）— 可拖拽的位置指示器
- `ColorAreaCompact`（Aria）— 聚合组件；组合区域 + 滑块

## 演示

<PlaygroundGallery component="color-area" />

## API

<ComponentApi component="color-area" />

## 注意事项

### 架构与对标差异

`ColorAreaCompact` 负责区域/滑块组合，所有基础组件保持零样式，仅由 UI 包装组件注入 `colorAreaVariants` 类。这与 radix-ui-color/shadcn-ui 的 headless 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供内嵌饱和度平面的完整颜色选择器；VeanUI 将区域作为独立可配置基础组件暴露，带轴通道、颜色空间与格式控制、原生表单输入与 `size` 尺寸体系。

| 能力          | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------ | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离 |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 可配置轴      |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 多种颜色空间  |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| 键盘交互      |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 原生表单输入  |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 尺寸（6）     |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型（多数仅提供合并的颜色选择器）。

### 运行时注意

- `modelValue` 接受颜色字符串或 `ColorValue`；`format` 控制输出字符串格式。
- `xChannel`/`yChannel` 必须不同且对所选 `colorSpace` 有效（如 OKLCH 下的 `chroma`+`lightness`）。
- 组件发出 `update:modelValue`、`update:color`、`change` 与 `changeEnd`；`changeEnd` 在指针/键盘提交时触发。
- 提供 `xName`/`yName` 以将底层通道作为隐藏表单字段提交。
- 与 `color-slider`（色相）和 `color-field` 配合可构成完整选择器。

### Roadmap

不适用——color-area 对当前对标集已功能完备。

## FAQ

### 如何使用颜色区域？

设置 `model-value`、`format` 与轴通道：

```vue
<SColorArea model-value="hsl(0 50% 50%)" format="hsl" @update:model-value="onChange" />
```

### 如何配置轴？

使用 `x-channel`/`y-channel`：

```vue
<SColorArea
  model-value="oklch(62% 0.22 312)"
  color-space="oklch"
  format="oklch"
  x-channel="chroma"
  y-channel="lightness"
/>
```

### 如何与色相滑块配合？

与 `SColorSlider` 组合实现色相通道：

```vue
<SColorArea v-model:model-value="color" format="hsl" />
<SColorSlider v-model:model-value="color" channel="hue" format="hsl" />
```
