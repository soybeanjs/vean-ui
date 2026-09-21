---
head:
  title: Color Slider
  description: 'A single-channel color slider for hue, alpha, and individual RGB/HSL/HSV/OKLCH channels. SColorSlider combines the Aria ColorSliderRoot/ColorSliderTrack/ColorSliderThumb primitives with the shared sliderVariants style recipe (via sliderVariants).'
---

# Color Slider

## Overview

A single-channel color slider for hue, alpha, and individual RGB/HSL/HSV/OKLCH channels. `SColorSlider` combines the Aria `ColorSliderRoot`/`ColorSliderTrack`/`ColorSliderThumb` primitives with the shared `sliderVariants` style recipe (via `sliderVariants`).

Use a color slider for a single color channel — typically the hue or alpha channel inside a color picker (paired with `color-area`).

## Usage

<UsageCode component="color-slider" />

## Features

- 🧩 Aria/styled split — `ColorSliderCompact` composes track + thumb; `SColorSlider` only injects styles and forwards props/events
- 🎚️ Single channel — `channel` picks `hue`/`alpha`/`saturation`/`lightness`/`red`/`green`/`blue`/… across color spaces
- 🎨 Color spaces — `colorSpace` (e.g. `hsl`, `rgb`) with `format` for the emitted string
- ⌨️ Keyboard — ArrowLeft/Right, PageUp/Down, Home/End adjust the channel; `role="slider"`
- ↔️ Orientation — horizontal/vertical via the shared slider primitives
- 📝 Form field — a hidden input via `name` for native form submission
- 🔒 Disabled — `disabled` disables interaction
- 📐 6 sizes + colors — xs–2xl `size`, `color` accent; per-slot `ui` overrides

## Component family

- `SColorSlider` (styled) — the entry wrapper; `sliderVariants` recipe with dynamic slot forwarding
- `ColorSliderRoot` (Aria) — the state owner; `modelValue`/`color`, `channel`/`colorSpace`/`format`, value + commit
- `ColorSliderTrack` (Aria) — the channel gradient track
- `ColorSliderThumb` (Aria) — the draggable position indicator
- `ColorSliderCompact` (Aria) — the aggregated composite; composes track + thumb

## Demo

<PlaygroundGallery component="color-slider" />

## API

<ComponentApi component="color-slider" />

## Notes

### Architecture and benchmark differences

`ColorSliderCompact` owns the track/thumb composition while every primitive stays style-free and only the UI wrapper injects the shared `sliderVariants` classes. This mirrors radix-ui-color/shadcn-ui headless split. Ant Design, Element Plus, Mantine and Naive UI embed the hue/alpha slider inside the color-picker; VeanUI exposes a standalone single-channel slider with color-space/channel control, keyboard interaction, native form input and a `size` scale.

| Capability               | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :----------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split        |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Any channel (hue/alpha…) |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Multiple color spaces    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Keyboard interaction     |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Native form input        |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)                |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `modelValue` accepts a color string or `ColorValue`; `channel` selects which channel the slider edits, and `format` controls the emitted string.
- `channel` must be valid for the chosen `colorSpace` (e.g. `hue`/`alpha` in `hsl`).
- The component emits `update:modelValue`, `update:color`, `change` and `changeEnd`; `changeEnd` fires on pointer/keyboard commit.
- Provide `name` to submit the channel as a hidden form field.
- Use with `color-area` (saturation plane) inside a `color-picker` for a complete editor.

### Roadmap

N/A — color-slider is feature-complete for the current parity set.

## FAQ

### How do I use a color slider?

Bind `model-value`, choose a `channel` and `format`:

```vue
<SColorSlider v-model:model-value="color" channel="hue" format="hsl" />
```

### How do I edit alpha?

Set `channel="alpha"`:

```vue
<SColorSlider v-model:model-value="color" channel="alpha" format="hsl" />
```

### How do I pair it with a color area?

Combine with `SColorArea` for the saturation plane:

```vue
<SColorArea v-model:model-value="color" format="hsl" />
<SColorSlider v-model:model-value="color" channel="hue" format="hsl" />
```
