---
head:
  title: 切换按钮
  description: 一个可在按下（on）与未按下（off）状态之间切换的双态按钮，通过 aria-pressed 与 data-state 反射当前状态。适用于即时生效的互斥开关场景，如格式化工具或筛选标签；若选择项需要随表单显式提交，优先使用 SCheckbox。
---

# 切换按钮

## 概述

一个可在按下（`on`）与未按下（`off`）状态之间切换的双态按钮，通过 `aria-pressed` 与 `data-state` 反射当前状态。适用于即时生效的互斥开关场景，如格式化工具或筛选标签；若选择项需要随表单显式提交，优先使用 `SCheckbox`。

## 用法

<UsageCode component="toggle" />

## 特性

- 🎚 `modelValue` / `defaultValue` — 基于 `useControllableState` 的受控与非受控双模式
- ♿ `aria-pressed` + `data-state`（`on`/`off`）双通道反射，axe 零违规
- ⌨️ 键盘可操作 — Enter 与 Space 通过 button 原生行为切换
- 🎨 通过 `toggleVariants` 提供 3 种变体（outline/soft/ghost）× 6 尺寸 × 8 颜色 × 4 形状
- 🧩 经 Aria `Toggle` 完整复用 `SButton` prop 面（图标插槽、`asChild`、按钮 loading 等）
- 📦 插槽暴露 `modelValue` / `pressed` / `state` / `disabled` 参数用于自定义内容
- 🚫 禁用态提供 `disabled` + `aria-disabled` 与守卫点击处理

## 演示

<PlaygroundGallery component="toggle" />

## API

<ComponentApi component="toggle" />

## 注意事项

### 架构与行业对标

VeanUI 由 Aria 层 `Toggle`（`useControllableState` + `Button` 基座 + `aria-pressed`/`data-state` 反射 + 禁用守卫点击）与薄包装 `SToggle`（仅计算 `toggleVariants` 类并转发 `update:modelValue`）组成。`data-state` 属性通过 UnoCSS `data-[state=on]:*` 选择器驱动按下态样式，状态与视觉解耦。`toggle` 是 Radix/shadcn 原生模式；其余对标库多以「按钮 + 状态」或分段控件表达相同交互。

| 能力                          | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn `Toggle` |
| :---------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :-------------: |
| Aria/styled 分离              |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| 按下/未按下状态               |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| 受控/非受控                   |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| `aria-pressed` + `data-state` |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| 变体（outline/soft/ghost）    |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| 尺寸/形状（6 尺寸 × 4）       |   ✅   |     —      |      —       |    —    |    —     |        —        |
| 键盘（Enter/Space）           |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| 禁用态                        |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| axe 零违规                    |   ✅   |     —      |      —       |    —    |    —     |        —        |
| 按下态图标动画                |   ➕   |     ✅     |      —       |    —    |    —     |        —        |

### 使用注意

- 纯图标切换按钮没有可访问名称——请传入 `aria-label`（或使用可见文本）以保持 axe 零违规。
- 按下态由 `aria-pressed` 与 `data-state` 反射；按下样式可通过 `data-[state=on]:*` 工具类或内置变体实现。
- Enter/Space 切换依赖 `Button` 基座的原生按钮行为。
- 互斥多选场景请用 `SToggleGroup` 组合，而非手动管理状态。

## 常见问题

### 受控还是非受控？

传入 `modelValue` 配合 `v-model` 使用受控模式，或传入 `defaultValue` 让组件内部自持状态。两种模式均由 `useControllableState` 支撑。

### 如何构建纯图标切换按钮？

将图标放入默认插槽并添加 `aria-label`（如 `aria-label="加粗"`）。`toggleVariants` 基类已屏蔽 `svg` 指针事件并为图标提供默认 `size-4`。

### `SToggle` 与 `SButton` 有什么区别？

`SToggle` 是有状态按钮——记录自身是否按下，并通过 `aria-pressed`/`data-state` 反射且带有按下样式；`SButton` 无状态，仅发出点击事件。

### 如何构建一组切换按钮？

使用 `SToggleGroup`——它统一管理单选/多选与对应的 `aria-pressed` 状态。
