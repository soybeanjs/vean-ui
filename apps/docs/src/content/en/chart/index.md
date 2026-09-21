---
head:
  title: Chart Demos
  description: shadcn-styled chart demos built with TanStack Charts and VeanUI theme tokens.
---

# Charts

These charts render directly with [TanStack Charts](https://tanstack.com/charts), following the same usage as the [shadcn chart collection](https://tanstack.com/charts/catalog/collections/shadcn). VeanUI **no longer ships a dedicated chart wrapper package** — TanStack Charts is already a framework-agnostic chart grammar, and using it directly lets you follow the official upgrade path without being locked into an extra abstraction.

## How theming works

The demos bridge the theme with a lightweight `ChartContainer` + `chartConfig`:

- `chartConfig` maps each series field to `{ label, color }`;
- colors come from the theme tokens `hsl(var(--chart-1..5))`, and `ChartContainer` injects them as `--color-<key>` CSS custom properties on the wrapper;
- marks reference `var(--color-<key>)`, so colors follow light/dark theme changes automatically.

`ChartContainer` is only a config → CSS-variable styling bridge with **no chart logic**; treat it as a small component you can copy into your own project. TanStack Charts' built-in axes, grid, tooltip, and legend do the rest.

## Demos

Pick a chart type in the sidebar (or the cards below) to see live demos and copyable source.
