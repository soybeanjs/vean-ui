# Progress

Source URL: https://veanui.com/components/progress
Markdown URL: https://veanui.com/components/progress.md
Category: Data Display
Description: A progress indicator for determinate or indeterminate task completion. SProgress combines the Aria ProgressRoot/ProgressIndicator primitives with the progressVariants style recipe, and SProgressCircle offers a circular variant via progressCircleVariants. Both share an imperative API (progress.start()/done()) surfaced through SProgressProvider.

## Overview

A progress indicator for determinate or indeterminate task completion. `SProgress` combines the Aria `ProgressRoot`/`ProgressIndicator` primitives with the `progressVariants` style recipe, and `SProgressCircle` offers a circular variant via `progressCircleVariants`. Both share an imperative API (`progress.start()`/`done()`) surfaced through `SProgressProvider`.

Use it for uploads, downloads, multi-step flows, or top-of-page loading bars. Prefer `spinner` for an indefinite wait, and `skeleton` for reserving content space before it loads.

## Usage

Usage examples for progress are rendered on the site.

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

Interactive demos for progress are rendered on the site.

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

Structured API summary generated from build-time component metadata.

- Exported symbols (8): Progress, ProgressCircle, ProgressCircleCompact, ProgressCircleSvg, ProgressCompact, ProgressIndicator, ProgressProvider, ProgressRoot.

### Progress

#### Props

Properties for the Progress component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ProgressUi>`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `ProgressIndicatorProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `modelValue`: The controlled progress value. Can be bind as `v-model`. (type `number | null`; optional)
- `max`: The maximum progress value. (type `number`; optional)
- `getValueLabel`: The accessible label of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `getValueText`: The accessible text of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Progress component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: number | null | undefined]`; parameters `value: number | null | undefined`)
- `update:max`: Emitted when the max value changes. (type `[value: number]`; parameters `value: number`)

#### Slots

Slots for the Progress component.

- `default`: Custom content for the default slot. (type `((props: ProgressSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the Progress component family.

- `modelValue`: Current model value. (type `number | null | undefined`; required)
- `max`: Max used by the component. (type `number`; required)
- `progressState`: Progress state used by the component. (type `'loading' | 'indeterminate' | 'complete'`; required)
- `valuePercent`: Current progress percentage. (type `number | null`; required)

### ProgressCircle

#### Props

Properties for the ProgressCircle component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ProgressUi>`; optional)
- `strokeWidth`: Stroke width. (type `number`; optional)
- `circleSvgProps`: Properties forwarded to the ProgressCircleSvg component. (type `ProgressCircleSvgProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `modelValue`: The controlled progress value. Can be bind as `v-model`. (type `number | null`; optional)
- `max`: The maximum progress value. (type `number`; optional)
- `getValueLabel`: The accessible label of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `getValueText`: The accessible text of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ProgressCircle component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: number | null | undefined]`; parameters `value: number | null | undefined`)
- `update:max`: Emitted when the max value changes. (type `[value: number]`; parameters `value: number`)

#### Slots

Slots for the ProgressCircle component.

- `default`: Custom content for the default slot. (type `((props: ProgressSlotProps) => any) | undefined`)

### ProgressCircleCompact

#### Props

Properties for the ProgressCircleCompact component.

- `strokeWidth`: Stroke width. (type `number`; optional)
- `circleSvgProps`: Properties forwarded to the ProgressCircleSvg component. (type `ProgressCircleSvgProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `modelValue`: The controlled progress value. Can be bind as `v-model`. (type `number | null`; optional)
- `max`: The maximum progress value. (type `number`; optional)
- `getValueLabel`: The accessible label of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `getValueText`: The accessible text of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ProgressCircleCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: number | null | undefined]`; parameters `value: number | null | undefined`)
- `update:max`: Emitted when the max value changes. (type `[value: number]`; parameters `value: number`)

#### Slots

Slots for the ProgressCircleCompact component.

- `default`: Custom content for the default slot. (type `((props: ProgressSlotProps) => any) | undefined`)

### ProgressCircleSvg

#### Props

Properties for the ProgressCircleSvg component.

- `strokeWidth`: Stroke width. (type `number`; optional)

### ProgressCompact

#### Props

Properties for the ProgressCompact component.

- `indicatorProps`: Properties forwarded to the indicator element. (type `ProgressIndicatorProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `modelValue`: The controlled progress value. Can be bind as `v-model`. (type `number | null`; optional)
- `max`: The maximum progress value. (type `number`; optional)
- `getValueLabel`: The accessible label of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `getValueText`: The accessible text of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ProgressCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: number | null | undefined]`; parameters `value: number | null | undefined`)
- `update:max`: Emitted when the max value changes. (type `[value: number]`; parameters `value: number`)

#### Slots

Slots for the ProgressCompact component.

- `default`: Custom content for the default slot. (type `((props: ProgressSlotProps) => any) | undefined`)

### ProgressIndicator

#### Props

Properties for the ProgressIndicator component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ProgressProvider

#### Props

Properties for the ProgressProvider component.

- `direction`: Direction. (type `Direction`; optional)
- `minimum`: Minimum. (type `number`; optional)
- `maximum`: Maximum. (type `number`; optional)
- `easing`: Easing. (type `string`; optional)
- `speed`: Speed. (type `number`; optional)
- `trickle`: Whether trickle. (type `boolean`; optional)
- `trickleSpeed`: Trickle speed. (type `number`; optional)

### ProgressRoot

#### Props

Properties for the ProgressRoot component.

- `dir`: Reading direction of the component. (type `Direction`; optional)
- `modelValue`: The controlled progress value. Can be bind as `v-model`. (type `number | null`; optional)
- `max`: The maximum progress value. (type `number`; optional)
- `getValueLabel`: The accessible label of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `getValueText`: The accessible text of the current progress value. (type `((value: number | null, max: number) => string)`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ProgressRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: number | null | undefined]`; parameters `value: number | null | undefined`)
- `update:max`: Emitted when the max value changes. (type `[value: number]`; parameters `value: number`)

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

```

### How do I show an indeterminate bar?

Omit `model-value`:

```vue

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

```

### Circle or linear?

Use `SProgressCircle` for a compact gauge in a dashboard/stat, and `SProgress` for a full-width linear indicator or the top-of-page bar.
