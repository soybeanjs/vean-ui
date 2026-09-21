---
head:
  title: Installation
  description: Install TanStack Charts and wire it into a VeanUI project.
---

# Installation

Charts are powered by [TanStack Charts](https://tanstack.com/charts). Install it directly (the Vue adapter ships in the same package):

```bash
pnpm add @tanstack/charts
```

## Import what you need

- Cartesian charts (bar/line/area/scatter): `defineChart`, `barY`, `lineY`, `areaY`, `dot`, and more from `@tanstack/charts`;
- scales: `@tanstack/charts/scales/band`, `@tanstack/charts/scales/linear`, `@tanstack/charts/scales/point`;
- the Vue component: `Chart` from `@tanstack/charts/vue`;
- tooltip: `tooltip` from `@tanstack/charts/tooltip`;
- polar (donut): `pie`, `polar`, `radialArc` from `@tanstack/charts/polar`.

The polar entry is an opt-in subpath — when not imported, the package keeps a Cartesian-sized footprint.

## Theme colors

Make sure the VeanUI theme is available (`@vean/ui/styles.css` or the UnoCSS preset) so tokens like `--chart-1..5` exist and the demo colors follow light/dark mode.
