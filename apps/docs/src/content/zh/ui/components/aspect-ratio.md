---
head:
  title: 宽高比
  description: SAspectRatio 使用 CSS padding-bottom 技术保持内容的固定宽高比。它将内容包裹在一个相对定位的容器中，通过动态 paddingBottom 百分比控制高度，内部绝对定位元素填满容器。适用于加载图片、视频或嵌入内容时防止布局偏移。
---

# 宽高比

## 概述

`SAspectRatio` 使用 CSS padding-bottom 技术保持内容的固定宽高比。它将内容包裹在一个相对定位的容器中，通过动态 `paddingBottom` 百分比控制高度，内部绝对定位元素填满容器。适用于加载图片、视频或嵌入内容时防止布局偏移。

## 用法

<UsageCode component="aspect-ratio" />

## 功能

- 📐 **宽高比控制** — 传入任意数值 `ratio`（如 `16/9`、`4/3`、`1`），组件自动计算正确的 padding 百分比。
- 🔧 **多态渲染** — `as` prop 可将内部内容元素渲染为任意 HTML 标签或组件（默认 `div`）。
- 📊 **作用域插槽** — 默认插槽接收 `aspect`（计算的 padding 百分比），用于高级场景。
- 🎨 **类名转发** — `class` 和其他属性转发到内部内容元素，而非外层 wrapper。
- ♿ **无障碍** — wrapper 为普通 `<div>`；无障碍取决于插槽内容（如 `<img alt="...">`）。
- 🌐 **SSR 安全** — 纯计算值，无浏览器 API。

## 演示

<PlaygroundGallery component="aspect-ratio" />

## API

<ComponentApi component="aspect-ratio" />

## 注意事项

### 架构

`SAspectRatio` 是 Aria 原语——UI 层直接重新导出 Aria 组件。使用 padding-bottom 宽高比技术：wrapper `<div>` 设置 `position: relative; width: 100%` 和 `paddingBottom: (1/ratio) * 100%`，内部元素（通过 `Primitive`）设置 `position: absolute; inset: 0` 填满 wrapper。`paddingBottom` 是响应式的——修改 `ratio` 即时更新布局。

内联定位样式（`position: relative`、`position: absolute; inset: 0`）是结构性的——它们是 padding-bottom 技术的必需部分，非装饰性。这与 Radix UI / shadcn-ui 的 AspectRatio 实现一致。

### 对标差异

| 维度       | VeanUI                     | shadcn/ui `AspectRatio`   | MUI `AspectRatio`         | Ant Design |
| :--------- | :------------------------- | :------------------------ | :------------------------ | :--------- |
| 架构       | Aria + UI 重新导出         | Aria + styled             | 仅 styled                 | —          |
| 技术       | padding-bottom + absolute  | padding-bottom + absolute | padding-bottom + absolute | —          |
| 多态渲染   | `as` prop 通过 `Primitive` | —                         | —                         | —          |
| 作用域插槽 | `aspect` 百分比            | —                         | —                         | —          |
| ratio 输入 | `number`（如 `16/9`）      | `number`（如 `16/9`）     | `ratio`（如 `16/9`）      | —          |

### 常见问题

**如何使用 16:9 宽高比？**
传入 `:ratio="16/9"`（注意 `:` 表示 Vue 表达式绑定）：`<SAspectRatio :ratio="16/9">...</SAspectRatio>`。

**可以将内部元素渲染为非 div 吗？**
可以。使用 `as` prop：`<SAspectRatio as="section">...</SAspectRatio>` 将内部元素渲染为 `<section>`。

**为什么 Aria 层有内联样式？**
wrapper 的 `position: relative` 和内部元素的 `position: absolute; inset: 0` 是结构性的——padding-bottom 技术必需它们才能工作。没有这些样式无法维持宽高比。这是对「Aria 无样式」规则的已接受偏离，与 Radix UI 和 shadcn/ui 一致。

**`aspect` 插槽 prop 是什么？**
默认插槽接收 `aspect`——计算的 padding 百分比（如 16:9 为 `56.25`）。可用于调试或自定义布局逻辑：`<SAspectRatio v-slot="{ aspect }">...</SAspectRatio>`。
