---
head:
  title: 主题基础色选择
  description: SThemeBaseSelect 是一个绑定到当前 SConfigProvider 主题的上下文下拉选择。它列出中性调色板并把选中的一项写回主题基础色，并提供只显示单个 500 色块的简约模式。
---

# 主题基础色选择

## 概述

`SThemeBaseSelect` 是一个绑定到当前 `SConfigProvider` 主题的上下文下拉选择。它列出九个中性调色板（`NEUTRAL_PALETTES` —— slate、mist、gray、zinc、neutral、stone、taupe、olive、mauve），并把选中的一项写回主题 `base`，因此所有中性表面 token（背景、卡片、边框、muted）会一次性重新派生。

适用于需要「一键换中性表面色」的场景 —— 设置面板、顶栏主题菜单，或作为 `SThemeCustomizer` 的精简替代。当用户还需要主色、圆角、字号、间距或自定义预设时，请改用 `SThemeCustomizer`。

它与 `SThemePrimarySelect`、`SThemeModeSelect`、`SThemeModeSwitch` 共享同一主题上下文：四者读写同一份 provider 状态，无需额外 props 即可保持同步。

## 用法

<UsageCode component="theme-base-select" />

## 特性

- 🎨 九个中性调色板全部作为选项，直接取自主题引擎的 `NEUTRAL_PALETTES`
- 🧩 `simple` 模式把色板堆叠收敛成单个 `500` 色块，触发器与每个选项都生效
- 🎚 `size` 透传给底层 select 触发器，与主题尺寸刻度（`xs`…`2xl`）一致
- 🔗 通过共享主题上下文写入 —— 没有 `modelValue`，也没有本地镜像状态
- ♿ 触发器带 `aria-label`，没有可见文案时依然可被辅助技术识别
- 🎯 与 `SThemePrimarySelect` 复用同一 `ColorDecorator` 色块渲染器，两处渲染完全一致

## 演示

<PlaygroundGallery component="theme-base-select" />

## API

<ComponentApi component="theme-base-select" />

## 注意事项

### 架构与对标差异

| 维度     | Vean                                           | Ant Design / Element Plus                 |
| -------- | ---------------------------------------------- | ----------------------------------------- |
| 数据来源 | 主题引擎的 `NEUTRAL_PALETTES` / `paletteColor` | 组件自带的取色器或预设色板列表            |
| 状态     | 直接读写 `SConfigProvider` 主题上下文          | 通常是 `v-model` 的色值，由应用自行持久化 |
| 色块渲染 | `simple` 在单个 `500` 色块与 5 级堆叠之间切换  | 各库固定一种色块样式                      |
| 样式     | 继承 UnoCSS + 主题 token，无独立 style recipe  | 独立 SCSS / CSS 变量                      |

- 该组件是 **UI 层** 组件（`@vean/ui`）：它组合已有的 `SSelect` 与共享的 `ColorDecorator`，因此 `@vean/aria` 中没有对应实现。
- `simple` 默认为 `true`，因为精简形态正是本组件的目的。传 `simple="false"` 可获得与主题定制器相同的五级堆叠。

### 提醒

- 必须渲染在 `SConfigProvider` 内部，否则 `useTheme` 会抛出异常。
- 它不接受 `modelValue`。若要用自己的 store 驱动基础色，请使用主题上下文（`useTheme().base`），或给 provider 传 `theme` / `themeConfig`。
- `simple="false"` 使用共享的层级堆叠 `[100, 900, 300, 800, 600]`，它刻意不是由浅到深的色阶 —— 那是「表面识别」取样，而不是刻度。

## 常见问题

### 为什么没有 `modelValue`？

基础色属于主题 provider，而不是这个组件。在组件内部再绑一份会制造第二个真相来源，与生成的 CSS token 漂移。需要读取当前值时用 `useTheme().base`。

### 它和 `SThemePrimarySelect` 有什么不同？

形态一致、token 与选项集不同：`SThemeBaseSelect` 在中性色板上写 `base`，`SThemePrimarySelect` 在全部 26 个色板上写 `primary`。两者并排使用即可覆盖定制器的整个色板区块。

### 可以限制可选色板范围吗？

目前没有对应 props，列表来自主题引擎的 `NEUTRAL_PALETTES`。若需要子集，请直接用过滤后的 `items` 组合 `SSelect`。

### 为什么色块颜色和我设置的 CSS 变量不一致？

色块通过 `paletteColor(key, level, 'hsl')` 从调色板定义解析，而不是读取计算后的 CSS。主题上的 `overrides` 会改变渲染出的 token，但不会改变调色板取样。
