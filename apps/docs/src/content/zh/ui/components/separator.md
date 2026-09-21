---
head:
  title: 分隔线
  description: SSeparator 组件用于在视觉和语义上分隔内容区块。它渲染一条水平或垂直线，可选择在线上居中（或对齐）显示标签。适用于分隔相关内容块、分组菜单项或构建表单分区。
---

# 分隔线

## 概述

`SSeparator` 组件用于在视觉和语义上分隔内容区块。它渲染一条水平或垂直线，可选择在线上居中（或对齐）显示标签。适用于分隔相关内容块、分组菜单项或构建表单分区。

若仅需区块间距，优先使用 [`SCard`](/components/card) 或 UnoCSS 间距工具；当需要可见的分割线辅助理解时使用 `SSeparator`。

## 用法

<UsageCode component="separator" />

## 功能

- 📏 **方向** — 在 `horizontal`（水平）与 `vertical`（垂直）布局间切换。
- 🏷️ **标签支持** — 通过 `label` prop 或默认插槽在线上渲染文本或自定义内容。
- ↔️ **对齐方式** — 标签可位于 `start`（起始）、`center`（居中）或 `end`（末尾）。
- 〰️ **边框样式** — 支持 `solid`（实线）、`dashed`（虚线）、`dotted`（点线）三种线型。
- 📐 **尺寸缩放** — 六档尺寸（`xs`–`2xl`）控制标签字号与间距。
- ♿ **无障碍** — `role="separator"` 配合 `aria-orientation`；`decorative` prop 可将元素从无障碍树中移除，适用于纯视觉分隔。
- 🎨 **按插槽覆盖** — `ui` prop 与 `class` 支持 `root`、`label` 两个插槽的精细样式控制。
- 🌐 **RTL 适配** — 标签定位与位移自动适配从右到左布局。

## 演示

<PlaygroundGallery component="separator" />

## API

<ComponentApi component="separator" />

## 注意事项

### 架构与对标差异

VeanUI 将 `Separator` 拆分为 Aria 层（`@vean/aria/separator`，负责 `SeparatorRoot`（role/aria/方向）、`SeparatorLabel`、`SeparatorCompact`（组合 + 标签可见性逻辑））与 styled 层（`@vean/ui`，负责 `scv()` 变体配方（size/orientation/align/border）与类注入 `provideSeparatorUi`）。这与 shadcn/ui 的 headless/styled 分离一致。

| 维度     | VeanUI                                                            | Ant Design `Divider` | Element Plus `ElDivider` | MUI `Divider` | Mantine `Divider` | shadcn/ui `Separator` |
| :------- | :---------------------------------------------------------------- | :------------------- | :----------------------- | :------------ | :---------------- | :-------------------- |
| 架构     | Aria + styled 分离，`SeparatorUiSlot`（root/label）+ Compact 聚合 | 单组件               | 单组件                   | 单组件        | 单组件            | Aria + styled         |
| 标签     | `label` prop + 默认插槽；`align`（start/center/end）              | `orientation` prop   | `content-position`       | —             | `labelPosition`   | —                     |
| 边框样式 | `border`（solid/dashed/dotted）                                   | `dashed` prop        | `border-style` prop      | —             | `variant`         | —                     |
| 尺寸缩放 | `size`（xs–2xl）控制标签字号 + 间距                               | —                    | —                        | —             | `size`            | —                     |
| 装饰模式 | `decorative` → `role="none"`                                      | —                    | —                        | —             | —                 | `decorative`          |
| RTL      | `rtl:translate-x` + 逻辑 `start-*` 定位                           | —                    | —                        | —             | —                 | —                     |

### 运行时注意事项

- **垂直分隔线**：当 `orientation="vertical"` 时标签会被有意隐藏，因为标签无法在垂直线上有意义地定位。若需在垂直分隔线旁显示标签，请将标签置于组件外部。
- **装饰模式**：当 `decorative` 为 `true` 时，元素获得 `role="none"` 并省略 `aria-orientation`，从而从无障碍树中移除。适用于屏幕阅读器应跳过的纯视觉分隔。
- **满宽 / 满高**：水平分隔线默认 `w-full`，垂直分隔线默认 `h-full`。使用垂直分隔线时，请确保父容器有固定高度。

### 常见问题

**何时应使用 `decorative`？**
当分隔线纯属视觉装饰、不表示语义内容边界时设置 `decorative`。这会将 `role` 设为 `none`，对屏幕阅读器隐藏。对于传达内容分区含义的分隔线，请保持 `decorative` 未设置（默认 `role="separator"`）。

**为什么垂直分隔线的标签不显示？**
垂直方向有意抑制标签显示。如需带标签的分隔线，请使用水平方向，或将标签文本置于组件外部。

**如何自定义标签元素的属性？**
传入 `labelProps` — 它会直接转发到 `SeparatorLabel` 元素。如需覆盖类名，请使用 `ui.label` 插槽。

**如何让分隔线占满宽度？**
水平分隔线默认 `w-full`。垂直分隔线请确保父容器有定义的高度；分隔线使用 `h-full`。
