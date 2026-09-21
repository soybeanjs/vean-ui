---
head:
  title: Quick Start
  description: Describe a chart with defineChart, render it with the Vue Chart component, and wire in VeanUI theme colors.
---

# Quick Start

TanStack Charts uses a declarative grammar: describe marks, scales, color, and tooltip with `defineChart`, then render it with the Vue `<Chart>` component.

## 1. Define the series config

```ts
const chartConfig = {
  desktop: { label: 'Desktop', color: 'hsl(var(--chart-1))' }
} satisfies ChartConfig;
```

## 2. Describe the chart

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

## 3. Render

```vue
<ChartContainer :config="chartConfig" class="h-[250px]">
  <Chart :definition="chart" :height="250" aria-label="Desktop signups by month" />
</ChartContainer>
```

`ChartContainer` exposes `chartConfig.desktop.color` as `--color-desktop`, so `var(--color-desktop)` resolves in the marks and follows the theme. For multiple series, hand the color domain to `color.range` (see the grouped bar demo).
