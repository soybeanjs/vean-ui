---
head:
  title: 按钮
  description: 一个可用于触发动作的按钮组件。
---

# 按钮

## 概述

一个可用于触发动作的按钮组件。

## 用法

<UsageCode component="button" />

## 特性

- 🎨 8 种变体：solid、outline、dashed、soft、ghost、link、plain、pure
- 🌈 8 种颜色：primary、destructive、success、warning、info、carbon、secondary、accent
- 📏 6 种尺寸：xs、sm、md、lg、xl、2xl
- 🔲 4 种形状：auto、rounded、square、circle
- ⚡ 支持加载状态
- 🌐 支持链接功能 (SButtonLink)
- ♿ 完全支持无障碍访问
- 🎯 TypeScript 类型安全

## 按钮组件系列

- **SButton** - 基础按钮组件
- **SButtonLink** - 链接按钮，支持路由导航
- **SButtonIcon** - 图标按钮，紧凑设计
- **SButtonLoading** - 加载状态按钮
- **SButtonGroup** - 按钮组组件

## 演示

<PlaygroundGallery component="button" />

## API

<ComponentApi component="button" />

## 注意事项

### 架构与对标差异

VeanUI 将按钮拆分为负责状态、ARIA 与键盘行为的 Aria 层（`@vean/aria/button`），以及负责变体与 UnoCSS 样式的 styled 层（`@vean/ui`）。这与 `shadcn/ui` 的 headless/styled 分离一致，区别于 Ant Design、Element Plus、MUI、Mantine、Naive UI 等单包方案。

| 维度     | VeanUI                                        | Ant Design / Element Plus / MUI / Mantine / Naive UI |
| :------- | :-------------------------------------------- | :--------------------------------------------------- |
| 架构     | Aria + styled 分离                            | 单包                                                 |
| 样式     | 通过 `cv()` recipe 生成 UnoCSS 工具类         | CSS-in-JS / SCSS / CSS 变量                          |
| 定制     | `class` 属性、`as` / `asChild` 多态、插槽覆盖 | `className`、`style`、组件覆盖                       |
| 加载态   | 独立的 `SButtonLoading` 组件                  | 基础按钮上的 `loading` 属性                          |
| 图标按钮 | 独立的 `SButtonIcon` 组件                     | 基础按钮上的 `icon` 属性                             |

### 常见问题

**为什么禁用按钮同时保留 `aria-disabled` 和原生 `disabled`？**
原生 `disabled` 属性会将按钮移出 Tab 序列并阻止平台层面的点击。同时设置 `aria-disabled="true"` 是为了在通过 `as` 属性将按钮渲染为非 `<button>` 元素（例如 `as="a"` 或 `as="div"`，此时原生 `disabled` 不生效）时，辅助技术仍能播报禁用状态。

**如何让按钮占满宽度？**
传入 `class="w-full"`（反之可用 `fitContent`）。VeanUI 不提供 `block` 属性，因为 UnoCSS 工具类已能覆盖该需求，无需扩展 API。

**如何显示加载指示器？**
使用 `SButtonLoading`。它支持 `autoLoading`（在点击处理期间自动切换加载态）、受控的 `loading` 属性、`loadingPosition`（`start` / `center` / `end`）、`loadingText` 以及自定义 `loadingIcon`。基础 `SButton` 刻意不内置加载态以保持 API 精简。加载期间按钮会设置 `aria-busy="true"`，加载图标设置 `aria-hidden`，确保状态被播报而不引入冗余装饰。

**`SButtonGroup` 如何向子组件传递属性？**
`SButtonGroup` 通过 context 将 `color`、`size`、`variant`、`shape`、`shadow`、`disabled`、`fitContent` 转发给后代 `SButton`。子组件自身设置的属性优先于分组传入的值。

**能把按钮渲染为链接或其他元素吗？**
可以。使用 `as` 属性切换根标签（`as="a"`、`as="div"`……），或用 `asChild` 将属性合并到自定义子节点上。如需路由感知的链接按钮，推荐使用 `SButtonLink`——它将 `SButton` 与 `Link` 组件组合在一起。
