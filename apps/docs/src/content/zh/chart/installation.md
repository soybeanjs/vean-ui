---
head:
  title: 安装
  description: 安装 TanStack Charts 并在 VeanUI 项目中接入。
---

# 安装

图表由 [TanStack Charts](https://tanstack.com/charts) 驱动，直接安装它即可（Vue 适配器内置在同一个包中）：

```bash
pnpm add @tanstack/charts
```

## 按需引入

- 笛卡尔图表（柱/线/面积/散点）：`defineChart`、`barY`、`lineY`、`areaY`、`dot` 等来自 `@tanstack/charts`；
- 比例尺：`@tanstack/charts/scales/band`、`@tanstack/charts/scales/linear`、`@tanstack/charts/scales/point`；
- Vue 组件：`Chart` 来自 `@tanstack/charts/vue`；
- Tooltip：`tooltip` 来自 `@tanstack/charts/tooltip`；
- 极坐标（环形图）：`pie`、`polar`、`radialArc` 来自 `@tanstack/charts/polar`。

极坐标入口是可选的子路径——不引入时，包体积只保留笛卡尔部分。

## 主题色

确保应用已引入 VeanUI 主题（`@vean/ui/styles.css` 或 UnoCSS preset），这样 `--chart-1..5` 等 token 才可用，示例颜色才能跟随明/暗主题。
