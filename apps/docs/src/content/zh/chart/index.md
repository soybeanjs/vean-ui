---
head:
  title: 图表示例
  description: 基于 TanStack Charts、贴合 VeanUI 主题 token 的 shadcn 风格图表示例。
---

# 图表

这里的图表直接基于 [TanStack Charts](https://tanstack.com/charts) 渲染，并采用与 [shadcn 图表](https://tanstack.com/charts/catalog/collections/shadcn) 一致的用法。VeanUI **不**再提供独立的图表封装包——TanStack Charts 本身就是与框架解耦的图表语法层，直接使用可以让你跟随官方升级路径，而不会被额外抽象锁定。

## 主题色如何接入

示例通过一个轻量的 `ChartContainer` + `chartConfig` 桥接主题：

- `chartConfig` 把每个系列字段映射为 `{ label, color }`；
- 颜色取主题 token `hsl(var(--chart-1..5))`，由 `ChartContainer` 注入为容器上的 `--color-<key>` CSS 变量；
- 图元通过 `var(--color-<key>)` 引用颜色，因此明/暗主题切换时自动跟随。

`ChartContainer` 只是 config → CSS 变量的样式桥，**不含任何图表逻辑**，你可以把它当作一个可复制到自己项目里的小组件。TanStack Charts 自带的坐标轴、网格、Tooltip 与图例负责其余一切。

## 示例

左侧（或下方卡片）选择图表类型，查看在线演示与可复制的源码。
