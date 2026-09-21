---
head:
  title: 颜色滑块
  description: 单通道颜色滑块，适合编辑色相、透明度以及 RGB/HSL/HSV/OKLCH 的独立通道。SColorSlider 组合 Aria ColorSliderRoot/ColorSliderTrack/ColorSliderThumb 基础组件与共享 sliderVariants 样式配方。
---

# 颜色滑块

## 概述

单通道颜色滑块，适合编辑色相、透明度以及 RGB/HSL/HSV/OKLCH 的独立通道。`SColorSlider` 组合 Aria `ColorSliderRoot`/`ColorSliderTrack`/`ColorSliderThumb` 基础组件与共享 `sliderVariants` 样式配方。

颜色滑块适合编辑单个颜色通道——通常是颜色选择器中的色相或透明度通道（与 `color-area` 配合）。

## 用法

<UsageCode component="color-slider" />

## 特性

- 🧩 Aria/样式分离 — `ColorSliderCompact` 组合轨道 + 滑块；`SColorSlider` 只注入样式并转发 prop/事件
- 🎚️ 单通道 — `channel` 可选 `hue`/`alpha`/`saturation`/`lightness`/`red`/`green`/`blue`/… 跨颜色空间
- 🎨 颜色空间 — `colorSpace`（如 `hsl`、`rgb`）配合 `format` 控制输出字符串
- ⌨️ 键盘 — ArrowLeft/Right、PageUp/Down、Home/End 调整通道；`role="slider"`
- ↔️ 方向 — 经共享 slider 基础组件支持水平/垂直
- 📝 表单字段 — 经 `name` 生成隐藏输入，支持原生表单提交
- 🔒 禁用 — `disabled` 禁用交互
- 📐 6 种尺寸 + 颜色 — xs–2xl `size`、`color` 强调色；逐槽 `ui` 覆盖

## 组件家族

- `SColorSlider`（样式层）— 入口包装组件；`sliderVariants` 配方配合动态插槽转发
- `ColorSliderRoot`（Aria）— 状态持有者；`modelValue`/`color`、`channel`/`colorSpace`/`format`、取值 + 提交
- `ColorSliderTrack`（Aria）— 通道渐变轨道
- `ColorSliderThumb`（Aria）— 可拖拽的位置指示器
- `ColorSliderCompact`（Aria）— 聚合组件；组合轨道 + 滑块

## 演示

<PlaygroundGallery component="color-slider" />

## API

<ComponentApi component="color-slider" />

## 注意事项

### 架构与对标差异

`ColorSliderCompact` 负责轨道/滑块组合，所有基础组件保持零样式，仅由 UI 包装组件注入共享 `sliderVariants` 类。这与 radix-ui-color/shadcn-ui 的 headless 分离一致。Ant Design、Element Plus、Mantine、Naive UI 将色相/透明度滑块内嵌于颜色选择器；VeanUI 暴露独立的单通道滑块，带颜色空间/通道控制、键盘交互、原生表单输入与 `size` 尺寸体系。

| 能力                   | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :--------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离          |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 任意通道（hue/alpha…） |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 多种颜色空间           |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 键盘交互               |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 原生表单输入           |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 尺寸（6）              |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `modelValue` 接受颜色字符串或 `ColorValue`；`channel` 选择滑块编辑的通道，`format` 控制输出字符串。
- `channel` 必须对所选 `colorSpace` 有效（如 `hsl` 下的 `hue`/`alpha`）。
- 组件发出 `update:modelValue`、`update:color`、`change` 与 `changeEnd`；`changeEnd` 在指针/键盘提交时触发。
- 提供 `name` 以将通道作为隐藏表单字段提交。
- 与 `color-area`（饱和度平面）配合构成完整编辑器。

### Roadmap

不适用——color-slider 对当前对标集已功能完备。

## FAQ

### 如何使用颜色滑块？

绑定 `model-value`，选择 `channel` 与 `format`：

```vue
<SColorSlider v-model:model-value="color" channel="hue" format="hsl" />
```

### 如何编辑透明度？

设置 `channel="alpha"`：

```vue
<SColorSlider v-model:model-value="color" channel="alpha" format="hsl" />
```

### 如何与颜色区域配合？

与 `SColorArea` 组合实现饱和度平面：

```vue
<SColorArea v-model:model-value="color" format="hsl" />
<SColorSlider v-model:model-value="color" channel="hue" format="hsl" />
```
