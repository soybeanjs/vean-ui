---
head:
  title: Color Area
  description: 'A two-dimensional color editor for saturation/lightness, saturation/brightness, or OKLCH chroma/lightness selection. SColorArea combines the Aria ColorAreaRoot/ColorAreaArea/ColorAreaThumb primitives with the colorAreaVariants style recipe (3 slots, 6 sizes).'
---

# Color Area

## Overview

A two-dimensional color editor for saturation/lightness, saturation/brightness, or OKLCH chroma/lightness selection. `SColorArea` combines the Aria `ColorAreaRoot`/`ColorAreaArea`/`ColorAreaThumb` primitives with the `colorAreaVariants` style recipe (3 slots, 6 sizes).

Use a color area for a saturation/lightness plane inside a color picker (typically paired with `color-slider` for the hue channel).

## Usage

<UsageCode component="color-area" />

## Features

- 🧩 Aria/styled split — `ColorAreaCompact` composes the area + thumb; `SColorArea` only injects styles and forwards props/events
- 🎛️ Axis channels — `xChannel`/`yChannel` pick `hue`/`saturation`/`lightness`/`brightness`/`chroma`
- 🎨 Color spaces — `colorSpace` (e.g. `hsl`, `oklch`) with `format` for the emitted string
- ⌨️ Keyboard — arrow keys adjust the thumb in fine/step increments; `role="application"` + `role="slider"`
- 📝 Form fields — hidden `x`/`y` inputs via `xName`/`yName` for native form submission
- 🔒 Disabled — `disabled` disables interaction
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides

## Component family

- `SColorArea` (styled) — the entry wrapper; `colorAreaVariants` recipe with dynamic slot forwarding
- `ColorAreaRoot` (Aria) — the state owner; `modelValue`/`color`, axis channels, `colorSpace`/`format`, `updateValues`/`commitValues`
- `ColorAreaArea` (Aria) — the 2D plane surface
- `ColorAreaThumb` (Aria) — the draggable position indicator
- `ColorAreaCompact` (Aria) — the aggregated composite; composes area + thumb

## Demo

<PlaygroundGallery component="color-area" />

## API

<ComponentApi component="color-area" />

## Notes

### Architecture and benchmark differences

`ColorAreaCompact` owns the area/thumb composition while every primitive stays style-free and only the UI wrapper injects the `colorAreaVariants` classes. This mirrors radix-ui-color/shadcn-ui headless split. Ant Design, Element Plus, Mantine and Naive UI ship a full color-picker with an embedded saturation plane; VeanUI exposes the area as a standalone configurable primitive with axis-channel, color-space and format control, plus native form inputs and a `size` scale.

| Capability            | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :-------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split     |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Configurable axes     |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Multiple color spaces |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| Keyboard interaction  |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Native form inputs    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)             |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model (most ship a single combined color-picker).

### Cautions

- `modelValue` accepts a color string or `ColorValue`; `format` controls the emitted string format.
- `xChannel`/`yChannel` must be distinct and valid for the chosen `colorSpace` (e.g. `chroma`+`lightness` in OKLCH).
- The component emits `update:modelValue`, `update:color`, `change` and `changeEnd`; `changeEnd` fires on pointer/keyboard commit.
- Provide `xName`/`yName` to submit the underlying channels as hidden form fields.
- Use with `color-slider` (hue) and a `color-field` for a complete picker.

### Roadmap

N/A — color-area is feature-complete for the current parity set.

## FAQ

### How do I use a color area?

Set `model-value`, `format` and the axis channels:

```vue
<SColorArea model-value="hsl(0 50% 50%)" format="hsl" @update:model-value="onChange" />
```

### How do I configure the axes?

Use `x-channel`/`y-channel`:

```vue
<SColorArea
  model-value="oklch(62% 0.22 312)"
  color-space="oklch"
  format="oklch"
  x-channel="chroma"
  y-channel="lightness"
/>
```

### How do I pair it with a hue slider?

Combine with `SColorSlider` for the hue channel:

```vue
<SColorArea v-model:model-value="color" format="hsl" />
<SColorSlider v-model:model-value="color" channel="hue" format="hsl" />
```
