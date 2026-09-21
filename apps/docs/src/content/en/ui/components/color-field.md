---
head:
  title: Color Field
  description: 'An input for editing either a full color string or a single channel, with support for hex, rgb, hsl, and oklch output. SColorField combines the Aria ColorFieldRoot/ColorFieldInput primitives with the colorFieldVariants style recipe (2 slots, 6 sizes).'
---

# Color Field

## Overview

An input for editing either a full color string or a single channel, with support for `hex`, `rgb`, `hsl`, and `oklch` output. `SColorField` combines the Aria `ColorFieldRoot`/`ColorFieldInput` primitives with the `colorFieldVariants` style recipe (2 slots, 6 sizes).

Use a color field for typed color entry or for editing a single channel numerically inside a color picker (paired with `color-area`/`color-slider`).

## Usage

<UsageCode component="color-field" />

## Features

- 🧩 Aria/styled split — `ColorFieldCompact` composes the root + input; `SColorField` only injects styles and forwards props/events
- 🎨 Formats — `hex`/`rgb`/`hsl`/`oklch` output via `format`; `colorSpace` + `channel` for single-channel editing
- ⌨️ Keyboard — ArrowUp/Down, PageUp/Down, Home/End increment/decrement the focused channel (with `step`)
- 🖱️ Wheel — scroll adjusts the channel unless `disableWheelChange`
- 🏷️ Placeholder/disabled/readonly — `placeholder`, `disabled`, `readonly`
- 📝 Form field — a hidden input via `name` for native form submission
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides

## Component family

- `SColorField` (styled) — the entry wrapper; `colorFieldVariants` recipe with dynamic slot forwarding
- `ColorFieldRoot` (Aria) — the state owner; `modelValue`/`color`, `format`/`colorSpace`/`channel`, keyboard/wheel increment helpers
- `ColorFieldInput` (Aria) — the text input bound to the color/channel
- `ColorFieldCompact` (Aria) — the aggregated composite; composes root + input

## Demo

<PlaygroundGallery component="color-field" />

## API

<ComponentApi component="color-field" />

## Notes

### Architecture and benchmark differences

`ColorFieldCompact` owns the root/input composition while every primitive stays style-free and only the UI wrapper injects the `colorFieldVariants` classes. This mirrors radix-ui-color/shadcn-ui headless split. Ant Design, Element Plus, Mantine and Naive UI ship a single color-picker with a hex input; VeanUI exposes a standalone color field with full format/channel control, keyboard/wheel editing and a native form input.

| Capability          | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------ | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Multiple formats    |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Single-channel edit |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Keyboard + wheel    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Native form input   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)           |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `modelValue` accepts a color string or `ColorValue`; `format` controls the emitted string format.
- To edit a single channel, set `channel` with a matching `colorSpace` (e.g. `lightness` in `hsl`); otherwise the full string is edited.
- Keyboard (Arrow/Page/Home/End) and wheel change the focused channel by `step` (default); set `disableWheelChange` to suppress wheel edits.
- Provide `name` to submit the color as a hidden form field.
- Use with `color-area`/`color-slider` inside a `color-picker` for a complete editor.

### Roadmap

N/A — color-field is feature-complete for the current parity set.

## FAQ

### How do I use a color field?

Bind `model-value` and choose a `format`:

```vue
<SColorField v-model:model-value="color" format="hex" />
```

### How do I edit a single channel?

Set `channel` with a matching `color-space`:

```vue
<SColorField v-model:model-value="color" channel="lightness" color-space="hsl" format="hsl" />
```

### How do I disable wheel editing?

Set `disable-wheel-change`:

```vue
<SColorField v-model:model-value="color" format="hex" disable-wheel-change />
```
