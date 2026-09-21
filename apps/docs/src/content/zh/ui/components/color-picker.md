---
head:
  title: 颜色选择器
  description: 组合式颜色选择器，内置颜色区域、色相/透明度滑块、格式化输入框和预设色板，并支持 oklch 输出与编辑。SColorPicker 在 popover 内组合 Aria 颜色基础组件（ColorArea/ColorSlider/ColorField/ColorSwatch/ColorSwatchPicker），以 SegmentCompact 切换格式。子部件样式统一写在 colorPickerVariants 中，经 provideColorPickerUi 转发。
---

# 颜色选择器

## 概述

组合式颜色选择器，内置颜色区域、色相/透明度滑块、格式化输入框和预设色板，并支持 `oklch` 输出与编辑。`SColorPicker` 在 popover 内组合 Aria 颜色基础组件（`ColorArea`/`ColorSlider`/`ColorField`/`ColorSwatch`/`ColorSwatchPicker`），以 `SegmentCompact` 切换格式。子部件样式统一写在 `colorPickerVariants` 中，经 `provideColorPickerUi` 转发。

颜色选择器适合完整的颜色选择 UI（格式页签、饱和度平面、色相/透明度滑块、预设色板与格式化输入）。

## 用法

<UsageCode component="color-picker" />

## 特性

- 🧩 组合式 Aria — 在 `Popover` 内组合 `ColorArea`/`ColorSlider`/`ColorField`/`ColorSwatchPicker`，各自零样式
- 🎛️ 格式页签 — `SegmentCompact` 切换 `hex`/`rgb`/`hsl`/`oklch`；`update:format` 反映当前格式
- 🎨 完整 `oklch` 支持 — `colorSpace="oklch"` 带色度/明度区域与 OKLCH 格式化输出
- 🎚️ 色相 + 透明度滑块 — `showAlpha` 切换 alpha 通道滑块与输入框
- 📝 格式化输入框 — `showFields` 渲染 hex/格式输入加 alpha 输入
- 🖼️ 预设色板 — `showSwatches` + `swatches` 渲染可点击预设（`ColorSwatchPicker`）
- 🪟 Popover 触发器 — `open`/`modal`/`placement`，触发器显示当前值
- 🔒 禁用 — `disabled` 禁用所有控件
- 📐 6 种尺寸 — xs–2xl `size`；逐部分 `ui` 覆盖

## 组件家族

- `SColorPicker`（样式层）— 入口包装组件；计算 `colorPickerVariants` 并调用 `provideColorPickerUi`
- `ColorPickerCompact`（Aria）— 聚合组件；连接根、popover、区域、滑块、输入框与色板
- `ColorPickerRoot`（Aria）— 共享颜色状态（`color`/`hexValue`/`displayFormat`/`areaChannel`/`setColor`/`setFormat`）
- `ColorPickerTrigger`（Aria）— 显示当前值的按钮
- 底层基础组件 — `ColorAreaCompact`、`ColorSliderCompact`、`ColorFieldCompact`、`ColorSwatchCompact`、`ColorSwatchPickerCompact`、`PopoverCompact`、`SegmentCompact`

## 演示

<PlaygroundGallery component="color-picker" />

## API

<ComponentApi component="color-picker" />

## 注意事项

### 架构与对标差异

`ColorPickerCompact` 负责跨基础组件组合（根状态 + popover + 区域 + 滑块 + 输入框 + 色板 + 页签），所有底层基础组件保持零样式。UI 包装组件通过 `provideColorPickerUi` 注入一份 `colorPickerVariants` map，再把别名 slot 映射到各子树的 `provide*Ui`。这与 radix-ui-color/shadcn-ui 的 headless 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供带 `showAlpha`/`presets` prop 的单一样式化颜色选择器；VeanUI 暴露带显式格式页签、完整 `oklch` 编辑与 `size` 尺寸体系的组合式选择器。

| 能力              | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :---------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| 组合式基础组件    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 格式页签          |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 完整 oklch 编辑   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 色相 + 透明度滑块 |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 预设色板          |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 尺寸（6）         |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `colorSpace`（默认 `hsl`）驱动区域通道与输出；`defaultFormat`/`format` 选择初始/受控格式页签。
- `showAlpha`（默认 `true`）添加 alpha 滑块与 alpha 输入；`showFields`/`showSwatches` 切换输入/预设区。
- `swatches` 为预设颜色数组；选择其一发出 `update:modelValue` 与 `change`。
- 选择器在 `Popover` 中打开；受控场景用 `v-model:open` 绑定 `open`。
- 这是最高层颜色组件；嵌入式轻量编辑器请优先使用单个 `color-area`/`color-slider`/`color-field`。

### Roadmap

不适用——color-picker 对当前对标集已功能完备。

## FAQ

### 如何使用颜色选择器？

绑定 `model-value`，可选 `swatches`：

```vue
<SColorPicker v-model:model-value="color" :swatches="['#7c3aed', '#06b6d4']" />
```

### 如何启用 OKLCH 编辑？

设置 `color-space` 与 `default-format`：

```vue
<SColorPicker v-model:model-value="color" color-space="oklch" default-format="oklch" />
```

### 如何切换分区？

使用 `show-alpha`/`show-fields`/`show-swatches`：

```vue
<SColorPicker v-model:model-value="color" :show-alpha="false" :show-swatches="false" />
```

### 如何控制 popover？

用 `v-model:open` 绑定 `open`：

```vue
<SColorPicker v-model:open="open" v-model:model-value="color" />
```
