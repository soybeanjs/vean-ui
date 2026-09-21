---
head:
  title: Slider
  description: 'A slider for picking one or more numeric values within a continuous range, supporting horizontal and vertical orientations, multi-thumb range mode, RTL and inverted directions, and complete keyboard navigation. Use it when the value belongs to a bounded numeric range and the user should adjust it with mouse or keyboard precision; when the value is free-form text or numbers, prefer SInputNumber instead.'
---

# Slider

## Overview

A slider for picking one or more numeric values within a continuous range, supporting horizontal and vertical orientations, multi-thumb range mode, RTL and inverted directions, and complete keyboard navigation. Use it when the value belongs to a bounded numeric range and the user should adjust it with mouse or keyboard precision; when the value is free-form text or numbers, prefer `SInputNumber` instead.

## Usage

<UsageCode component="slider" />

## Features

- 🎚 `modelValue` / `defaultValue` — controlled and uncontrolled modes backed by `useControllableState`
- 🔢 Single or multi-thumb range — pass an array with two values for a range slider
- ⌨️ Full keyboard support — Arrow keys step by `step`, PageUp/PageDown and Shift+Arrow jump 10 steps, Home/End go to min/max
- ↔ RTL-aware direction with `dir`, plus `inverted` to flip the value direction
- 📐 Horizontal and vertical orientations with `aria-orientation` reflection
- 📋 Native form proxy — a visually hidden input (or `name[0]`/`name[1]` pair for ranges) carries the value with `name` / `required`
- 🎨 6 sizes and 8 colors via `sliderVariants`
- 🧩 `trackProps` / `rangeProps` / `thumbProps` forwarding plus a default slot to customize thumb content
- 📏 `minStepsBetweenThumbs` and `thumbAlignment` (`contain` / `overflow`) for precise range control

## Demos

<PlaygroundGallery component="slider" />

## API

<ComponentApi component="slider" />

## Notes

### Architecture and benchmark differences

VeanUI builds the slider from Aria `SliderRoot` (`useControllableState` + value normalization + `VisuallyHiddenInput` form proxy) → `SliderTrack` (pointer drag, pointer-move/up/cancel on the document) → `SliderRange` (percentage span between thumbs) → `SliderThumb` (`role="slider"` + `aria-valuemin/max/now` + `aria-orientation`, focus-derived step navigation). `SliderCompact` composes root + track + range + thumbs and owns thumb iteration; the UI wrapper `SSlider` only computes variant classes via `sliderVariants` and injects the `ui` map through `provideSliderUi`.

| Capability                          | VeanUI | Ant Design `Slider` | Element Plus `Slider` | Mantine `Slider` | Naive UI `Slider` | shadcn `Slider` |
| :---------------------------------- | :----: | :-----------------: | :-------------------: | :--------------: | :---------------: | :-------------: |
| Aria/styled split                   |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| Controlled/uncontrolled             |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Range (multi-thumb)                 |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Vertical orientation                |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Inverted / RTL                      |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Keyboard nav (Arrows/Home/End/Page) |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| `minStepsBetweenThumbs`             |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| Form proxy / `name` submit          |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Axe-clean                           |   ✅   |          —          |           —           |        —         |         —         |        —        |
| Marks (scale ticks)                 |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| Value tooltip while dragging        |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| Linked number input                 |   ➕   |         ✅          |           —           |        —         |         —         |        —        |

### Cautions

- A single thumb has no default accessible name — pass `aria-label` through `thumbProps` (range mode falls back to localized "Minimum"/"Maximum" labels automatically).
- Thumbs default to `contain` inside the track; `thumbAlignment="overflow"` lets them extend beyond the track bounds.
- The form proxy renders only when `name` is present on a `form`-classed root; pair it with a native `<form>` or the `SForm` integration.
- PageUp/PageDown and Shift+Arrow keys step 10× the `step` value; `minStepsBetweenThumbs` blocks thumbs from crossing each other.

## FAQ

### How do I create a range slider?

Pass an array with two values to `modelValue` (or `defaultValue`), e.g. `[20, 80]`. Two thumbs are rendered and `valueCommit` emits both values. Each thumb is labeled "Minimum"/"Maximum" (localized) unless you override `thumbProps['aria-label']`.

### How do I keep the two thumbs apart?

Set `minStepsBetweenThumbs` to the minimum number of steps between thumbs — stepping or dragging is rejected when the gap would fall below that threshold.

### How do I show the current value above the thumb?

Use the default slot, which receives `{ index, value, modelValue }` for each thumb, to render custom content. A built-in tooltip is a planned enhancement.

### What keyboard shortcuts are supported?

Arrow keys step by `step`, PageUp/PageDown and Shift+Arrow jump 10 steps, and Home/End jump to min/max. Direction keys follow `dir` and `inverted` (RTL flips horizontal arrows; `inverted` flips the value direction).
