---
head:
  title: 颜色输入框
  description: 用于编辑完整颜色字符串或单个颜色通道，支持 hex、rgb、hsl 和 oklch 输出格式。SColorField 组合 Aria ColorFieldRoot/ColorFieldInput 基础组件与 colorFieldVariants 样式配方（2 个槽、6 种尺寸）。
---

# 颜色输入框

## 概述

用于编辑完整颜色字符串或单个颜色通道，支持 `hex`、`rgb`、`hsl` 和 `oklch` 输出格式。`SColorField` 组合 Aria `ColorFieldRoot`/`ColorFieldInput` 基础组件与 `colorFieldVariants` 样式配方（2 个槽、6 种尺寸）。

颜色输入框适合输入型颜色编辑，或在颜色选择器内以数值方式编辑单个通道（与 `color-area`/`color-slider` 配合）。

## 用法

<UsageCode component="color-field" />

## 特性

- 🧩 Aria/样式分离 — `ColorFieldCompact` 组合根 + 输入；`SColorField` 只注入样式并转发 prop/事件
- 🎨 格式 — 经 `format` 输出 `hex`/`rgb`/`hsl`/`oklch`；`colorSpace` + `channel` 用于单通道编辑
- ⌨️ 键盘 — ArrowUp/Down、PageUp/Down、Home/End 按 `step` 增减聚焦通道
- 🖱️ 滚轮 — 滚动调整通道，除非 `disableWheelChange`
- 🏷️ 占位/禁用/只读 — `placeholder`、`disabled`、`readonly`
- 📝 表单字段 — 经 `name` 生成隐藏输入，支持原生表单提交
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖

## 组件家族

- `SColorField`（样式层）— 入口包装组件；`colorFieldVariants` 配方配合动态插槽转发
- `ColorFieldRoot`（Aria）— 状态持有者；`modelValue`/`color`、`format`/`colorSpace`/`channel`、键盘/滚轮增减辅助
- `ColorFieldInput`（Aria）— 绑定颜色/通道的文本输入
- `ColorFieldCompact`（Aria）— 聚合组件；组合根 + 输入

## 演示

<PlaygroundGallery component="color-field" />

## API

<ComponentApi component="color-field" />

## 注意事项

### 架构与对标差异

`ColorFieldCompact` 负责根/输入组合，所有基础组件保持零样式，仅由 UI 包装组件注入 `colorFieldVariants` 类。这与 radix-ui-color/shadcn-ui 的 headless 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供带 hex 输入的单一样式化颜色选择器；VeanUI 暴露独立的颜色输入框，带完整格式/通道控制、键盘/滚轮编辑与原生表单输入。

| 能力          | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------ | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离 |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 多种格式      |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| 单通道编辑    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 键盘 + 滚轮   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 原生表单输入  |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 尺寸（6）     |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `modelValue` 接受颜色字符串或 `ColorValue`；`format` 控制输出字符串格式。
- 编辑单通道时设置 `channel` 并匹配 `colorSpace`（如 `hsl` 下的 `lightness`）；否则编辑完整字符串。
- 键盘（Arrow/Page/Home/End）与滚轮按 `step`（默认）改变聚焦通道；设 `disableWheelChange` 以抑制滚轮编辑。
- 提供 `name` 以将颜色作为隐藏表单字段提交。
- 与 `color-area`/`color-slider` 配合构成完整编辑器。

### Roadmap

不适用——color-field 对当前对标集已功能完备。

## FAQ

### 如何使用颜色输入框？

绑定 `model-value` 并选择 `format`：

```vue
<SColorField v-model:model-value="color" format="hex" />
```

### 如何编辑单个通道？

设置 `channel` 并匹配 `color-space`：

```vue
<SColorField v-model:model-value="color" channel="lightness" color-space="hsl" format="hsl" />
```

### 如何禁用滚轮编辑？

设置 `disable-wheel-change`：

```vue
<SColorField v-model:model-value="color" format="hex" disable-wheel-change />
```
