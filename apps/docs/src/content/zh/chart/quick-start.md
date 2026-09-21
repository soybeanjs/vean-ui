---
head:
  title: 快速开始
  description: 用 defineChart 描述图表，再用 Vue 的 Chart 组件渲染，并接入 VeanUI 主题色。
---

# 快速开始

TanStack Charts 使用「声明式语法」：用 `defineChart` 描述图元（marks）、比例尺（scales）、颜色与 tooltip，再交给 Vue 的 `<Chart>` 组件渲染。

## 1. 定义系列配置

```ts
const chartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' }
} satisfies ChartConfig;
```

## 2. 描述图表

```ts
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';

const chart = defineChart({
  marks: [
    barY(chartData, {
      x: 'month',
      y: 'desktop',
      fill: 'var(--color-desktop)'
    })
  ],
  scales: {
    x: { scale: () => scaleBand<string>().padding(0.16) },
    y: { scale: scaleLinear, nice: true, grid: true }
  },
  tooltip
});
```

## 3. 渲染

```vue
<ChartContainer :config="chartConfig" class="h-[250px]">
  <Chart :definition="chart" :height="250" aria-label="Desktop signups by month" />
</ChartContainer>
```

`ChartContainer` 把 `chartConfig.desktop.color` 注入为 `--color-desktop`，图元里的 `var(--color-desktop)` 因此生效，并随主题切换。多系列时把颜色域交给 `color.range`（见「柱状图 - 分组」示例）。
