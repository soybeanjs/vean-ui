---
head:
  title: Progress
  description: 'A progress indicator for determinate or indeterminate task completion. SProgress combines the Aria ProgressRoot/ProgressIndicator primitives with the progressVariants style recipe, and SProgressCircle offers a circular variant via progressCircleVariants. Both share an imperative API (progress.start()/done()) surfaced through SProgressProvider.'
---

# Progress

## Overview

A progress indicator for determinate or indeterminate task completion. `SProgress` combines the Aria `ProgressRoot`/`ProgressIndicator` primitives with the `progressVariants` style recipe, and `SProgressCircle` offers a circular variant via `progressCircleVariants`. Both share an imperative API (`progress.start()`/`done()`) surfaced through `SProgressProvider`.

Use it for uploads, downloads, multi-step flows, or top-of-page loading bars. Prefer `spinner` for an indefinite wait, and `skeleton` for reserving content space before it loads.

## Usage

<UsageCode component="progress" />

## Features

- 🧩 Aria/styled split — `ProgressRoot`/`ProgressIndicator` own state, `role="progressbar"` ARIA and derived values; `SProgress` injects `progressVariants`
- 🔢 Determinate / indeterminate — `modelValue` shows a concrete value; omitting it shows an indeterminate bar
- 🎨 8 colors — `ThemeColor` values on the indicator
- 📐 6 sizes — xs–2xl `size`
- ⭕ Circle variant — `SProgressCircle` for a circular gauge with configurable `strokeWidth`
- 🏷️ Custom label — `getValueLabel`/`getValueText` shape the `aria-label`/`aria-valuetext`
- ⚡ Imperative API — `progress.start()`/`set()`/`inc()`/`done()` etc. via `SProgressProvider` for top-of-page loading
- ♿ Accessible — `role="progressbar"` with `aria-valuemin/max/now` and a localized `aria-label` fallback

## Component family

- `SProgress` (styled) — the linear wrapper; `progressVariants` recipe
- `SProgressCircle` (styled) — the circular wrapper; `progressCircleVariants` recipe
- `SProgressProvider` (styled) — mounts the imperative progress layer
- `ProgressRoot` (Aria) — the state owner; normalizes `modelValue`/`max`, derives state/value percent, renders `role="progressbar"`
- `ProgressIndicator` (Aria) — the fill; sizes via CSS vars/transform per `dir`
- `ProgressCircleCompact` / `ProgressCompact` (Aria) — the aggregated composites
- `progress` (imperative) — the shared `start`/`set`/`inc`/`done`/`configure` controller

## Demos

<PlaygroundGallery component="progress" />

## Circle Progress

```vue
<script setup lang="ts">
import { SProgressCircle } from '@vean/ui';
</script>

<template>
  <SProgressCircle :model-value="72" size="xl">
    <template #default="{ valuePercent }">{{ Math.round(valuePercent ?? 0) }}%</template>
  </SProgressCircle>
</template>
```

`SProgressCircle` supports the same props, emits, slot props, and `Ui` type as `SProgress`, and adds the following prop:

<DataTable preset="props" :data="[
  { name: 'strokeWidth', type: 'number', default: '8', description: 'Stroke width of the circular indicator.' },
]"/>

## Progress Provider

Mount `SProgressProvider` once near your app root before calling the imperative `progress(...)` API. `SConfigProvider` mounts it automatically, so most applications can call `progress` directly.

```vue
<script setup lang="ts">
import { SButton, SProgressProvider, progress } from '@vean/ui';

const handleClick = () => {
  progress.start();

  window.setTimeout(() => {
    progress.done();
  }, 1200);
};
</script>

<template>
  <SProgressProvider />
  <SButton @click="handleClick">Start loading</SButton>
</template>
```

### `progress` Methods

| Method         | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `start()`      | Show the progress bar with the default start position and delay, then start trickling. |
| `set(value)`   | Set the raw progress value between `minimum` and `maximum`.                            |
| `inc()`        | Increment the current progress value.                                                  |
| `dec()`        | Decrement the current progress value.                                                  |
| `trickle()`    | Apply one automatic increment step.                                                    |
| `done()`       | Complete the progress bar and hide it after the configured delay.                      |
| `configure()`  | Update the shared progress options.                                                    |
| `pause()`      | Pause automatic trickling.                                                             |
| `resume()`     | Resume automatic trickling.                                                            |
| `remove()`     | Hide the progress bar immediately.                                                     |
| `reset()`      | Reset the shared progress state and options.                                           |
| `isStarted()`  | Check whether the progress flow is active.                                             |
| `isRendered()` | Check whether a progress provider is currently mounted.                                |
| `promise()`    | Bind the progress lifecycle to a promise or promise factory.                           |

## API

<ComponentApi component="progress" />

## Notes

### Architecture and benchmark differences

`ProgressRoot` owns the value normalization (`getValidMax`/`getValidModelValue`), state derivation (`indeterminate`/`loading`/`complete`) and the `role="progressbar"` ARIA contract, while the primitives stay style-free and only the UI wrapper injects the recipe classes. This mirrors shadcn/ui's headless/styled split, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single config-driven progress. Vean's distinguishing feature is the `nprogress`-style imperative controller (`progress.start()`/`done()`) and the `SProgressCircle` gauge, both of which the single-package libraries handle as separate components or omit.

| Capability                      | VeanUI | shadcn/ui | Ant Design Progress | Element Plus Progress | Mantine Progress | Naive UI Progress |
| :------------------------------ | :----: | :-------: | :-----------------: | :-------------------: | :--------------: | :---------------: |
| Linear progress                 |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| Circle progress                 |   ✅   |     —     |         ✅          |          ✅           |        ✅        |        ✅         |
| Indeterminate                   |   ✅   |     —     |         ✅          |          ✅           |        ✅        |        ✅         |
| Imperative API (`start`/`done`) |   ✅   |     —     |          —          |           —           |        —         |         —         |
| Color variants (8)              |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| Size variants (6)               |   ✅   |     —     |          —          |           —           |        —         |         —         |
| `role="progressbar"` ARIA       |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| Custom value label              |   ✅   |     —     |          —          |          ✅           |        ✅        |        ✅         |

`—` = unsupported or a different interaction model.

### Cautions

- For a determinate value the `aria-label` falls back to the localized percentage label (`45%`); the localized `progress.ariaLabel` only applies to indeterminate progress. Set an explicit `aria-label` to override either.
- Indeterminate progress (no `modelValue`) has no `aria-valuenow`; its `data-state` is `indeterminate`.
- The imperative `progress` API requires a mounted `SProgressProvider` — `SConfigProvider` mounts one automatically.
- `SProgressCircle` stroke width is clamped between 1 and `viewbox/4`; pass `strokeWidth` for a thinner/thicker gauge.
- The indicator uses `transform` + CSS vars and swaps direction under RTL via `dir`.

### Roadmap

No blocking gaps identified for the core progress API.

## FAQ

### How do I show a determinate value?

Pass `model-value`:

```vue
<SProgress :model-value="45" />
```

### How do I show an indeterminate bar?

Omit `model-value`:

```vue
<SProgress />
```

### How do I use the top-of-page loading bar?

Mount `SProgressProvider` (or rely on `SConfigProvider`) and call the imperative API:

```vue
<script setup>
const load = () => {
  progress.start();
  setTimeout(() => progress.done(), 1200);
};
</script>
<template><SButton @click="load">Load</SButton></template>
```

### How do I customize the announced label?

Pass `get-value-label`/`get-value-text` or an explicit `aria-label`:

```vue
<SProgress :model-value="45" aria-label="Upload progress" />
```

### Circle or linear?

Use `SProgressCircle` for a compact gauge in a dashboard/stat, and `SProgress` for a full-width linear indicator or the top-of-page bar.
