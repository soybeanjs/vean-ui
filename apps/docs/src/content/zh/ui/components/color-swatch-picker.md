---
head:
  title: 色块选择器
  description: 通过预设色板快速选择颜色，适合主题面板和颜色推荐场景。SColorSwatchPicker 组合 Aria ColorSwatchPickerRoot/Item/ItemSwatch/ItemIndicator 基础组件（构建于 listbox）与 colorSwatchPickerVariants 样式配方（6 个槽、6 种尺寸 × 2 种形状）。
---

# 色块选择器

## 概述

通过预设色板快速选择颜色，适合主题面板和颜色推荐场景。`SColorSwatchPicker` 组合 Aria `ColorSwatchPickerRoot`/`Item`/`ItemSwatch`/`ItemIndicator` 基础组件（构建于 listbox）与 `colorSwatchPickerVariants` 样式配方（6 个槽、6 种尺寸 × 2 种形状）。

色块选择器适合紧凑、可点击的预设色板（主题面板、品牌色、推荐颜色）。

## 用法

<UsageCode component="color-swatch-picker" />

## 特性

- 🧩 基于 Aria listbox — 构建于 listbox 基础组件，带 `role="listbox"`/`option`、roving focus 与选择
- 🎨 预设色板 — 传入 `colors` 数组；每项渲染一个带勾选指示器的 `ColorSwatch`
- 🔘 单选/多选 — `multiple`（经 listbox `M` 泛型）选择单个或多个值
- ✅ 指示器 — `indicator` 插槽（默认 `lucide:check`）标记当前选中色块
- 🔵 形状 — `shape="square"`（默认）或 `"circle"`
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- 🧩 自定义内容 — 无 `colors` 时的 `default` 插槽与 `swatch`/`indicator` 插槽提供完全控制

## 组件家族

- `SColorSwatchPicker`（样式层）— 入口包装组件；`colorSwatchPickerVariants` 配方配合动态插槽转发
- `ColorSwatchPickerCompact`（Aria）— 聚合组件；将 `colors` 迭代为带色块 + 指示器的条目
- `ColorSwatchPickerRoot`（Aria）— listbox 根（`modelValue`、`multiple`）
- `ColorSwatchPickerItem`（Aria）— 可选择的色块选项（`role="option"`）
- `ColorSwatchPickerItemSwatch`（Aria）— 色块（`ColorSwatchCompact` 基座）
- `ColorSwatchPickerItemIndicator`（Aria）— 选中勾选指示器

## 演示

<PlaygroundGallery component="color-swatch-picker" />

## API

<ComponentApi component="color-swatch-picker" />

## 注意事项

### 架构与对标差异

`ColorSwatchPickerCompact` 负责色板迭代（条目 + 色块 + 指示器），所有基础组件保持零样式，仅由 UI 包装组件注入 `colorSwatchPickerVariants` 类。这与 radix-ui-color/shadcn-ui 的 headless 分离一致，构建于共享 listbox 基础组件之上。Ant Design、Element Plus、Mantine、Naive UI 在单个颜色选择器中提供预设行；VeanUI 暴露独立的基于 listbox 的色块选择器，带单选/多选、勾选指示器、形状/尺寸控制与完整插槽覆盖。

| 能力              | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :---------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| 基于 Aria listbox |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 单选/多选         |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 勾选指示器        |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Roving focus      |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 形状（方/圆）     |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 尺寸（6）         |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `colors` 为颜色字符串数组；每项渲染一个 `ColorSwatch` 选项，当前值带勾选指示器。
- 选择发出 `update:modelValue`（单选：字符串；`multiple`：数组）与 `select`。
- 提供 `indicator`/`swatch` 插槽自定义勾选标记与色块内容；`colors` 为空时用 `default` 插槽渲染完全自定义内容。
- `shape` 在方形（`rounded-md`）与圆形（`rounded-full`）间切换。
- 构建于 listbox 基础组件，键盘/roving-focus 行为遵循 listbox 契约。

### Roadmap

不适用——color-swatch-picker 对当前对标集已功能完备。

## FAQ

### 如何构建色块选择器？

传入 `colors` 并绑定 `model-value`：

```vue
<SColorSwatchPicker v-model:model-value="color" :colors="['#7c3aed', '#06b6d4', '#10b981']" />
```

### 如何允许多选？

使用 `multiple`（值变为数组）：

```vue
<SColorSwatchPicker v-model:model-value="colors" multiple :colors="palette" />
```

### 如何设为圆形色块？

设置 `shape="circle"`：

```vue
<SColorSwatchPicker v-model:model-value="color" :colors="palette" shape="circle" />
```

### 如何自定义指示器？

使用 `indicator` 插槽：

```vue
<SColorSwatchPicker v-model:model-value="color" :colors="palette">
  <template #indicator>✓</template>
</SColorSwatchPicker>
```
