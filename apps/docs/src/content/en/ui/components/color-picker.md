---
head:
  title: Color Picker
  description: 'A composite color picker that combines a color area, hue/alpha sliders, formatted inputs, and preset swatches, with full oklch editing and output support. SColorPicker composes the Aria color primitives (ColorArea/ColorSlider/ColorField/ColorSwatch/ColorSwatchPicker) inside a popover, with a SegmentCompact for format switching. Nested part styles are unified in colorPickerVariants and forwarded through provideColorPickerUi.'
---

# Color Picker

## Overview

A composite color picker that combines a color area, hue/alpha sliders, formatted inputs, and preset swatches, with full `oklch` editing and output support. `SColorPicker` composes the Aria color primitives (`ColorArea`/`ColorSlider`/`ColorField`/`ColorSwatch`/`ColorSwatchPicker`) inside a popover, with a `SegmentCompact` for format switching. Nested part styles are unified in `colorPickerVariants` and forwarded through `provideColorPickerUi`.

Use a color picker for a full-featured color selection UI (format tabs, saturation plane, hue/alpha sliders, swatch presets and formatted input).

## Usage

<UsageCode component="color-picker" />

## Features

- 🧩 Composite Aria — composes `ColorArea`/`ColorSlider`/`ColorField`/`ColorSwatchPicker` inside a `Popover`, each style-free
- 🎛️ Format tabs — `SegmentCompact` switches `hex`/`rgb`/`hsl`/`oklch`; `update:format` reflects the active format
- 🎨 Full `oklch` support — `colorSpace="oklch"` with chroma/lightness area and formatted OKLCH output
- 🎚️ Hue + alpha sliders — `showAlpha` toggles the alpha channel slider and field
- 📝 Formatted field — `showFields` renders a hex/format input plus an alpha field
- 🖼️ Preset swatches — `showSwatches` + `swatches` render clickable presets (`ColorSwatchPicker`)
- 🪟 Popover trigger — `open`/`modal`/`placement`, with a trigger showing the current value
- 🔒 Disabled — `disabled` disables all controls
- 📐 6 sizes — xs–2xl `size`; per-part `ui` overrides

## Component family

- `SColorPicker` (styled) — the entry wrapper; computes `colorPickerVariants` and calls `provideColorPickerUi`
- `ColorPickerCompact` (Aria) — the aggregated composite; wires root, popover, area, sliders, fields and swatches
- `ColorPickerRoot` (Aria) — the shared color state (`color`/`hexValue`/`displayFormat`/`areaChannel`/`setColor`/`setFormat`)
- `ColorPickerTrigger` (Aria) — the button showing the current value
- Underlying primitives — `ColorAreaCompact`, `ColorSliderCompact`, `ColorFieldCompact`, `ColorSwatchCompact`, `ColorSwatchPickerCompact`, `PopoverCompact`, `SegmentCompact`

## Demo

<PlaygroundGallery component="color-picker" />

## API

<ComponentApi component="color-picker" />

## Notes

### Architecture and benchmark differences

`ColorPickerCompact` owns the cross-primitive composition (root state + popover + area + sliders + fields + swatches + segment) while every underlying primitive stays style-free. The UI wrapper injects a single `colorPickerVariants` map through `provideColorPickerUi`, which remaps aliased slots onto the nested `provide*Ui` contexts. This mirrors radix-ui-color/shadcn-ui's headless split. Ant Design, Element Plus, Mantine and Naive UI ship a single styled color-picker with `showAlpha`/`presets` props; VeanUI exposes a composite with explicit format tabs, full `oklch` editing and a `size` scale.

| Capability           | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Composite primitives |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Format tabs          |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Full oklch editing   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Hue + alpha sliders  |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Preset swatches      |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Sizes (6)            |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `colorSpace` (default `hsl`) drives the area channels and output; `defaultFormat`/`format` select the initial/controlled format tab.
- `showAlpha` (default `true`) adds the alpha slider and alpha field; `showFields`/`showSwatches` toggle the input/preset sections.
- `swatches` is an array of preset colors; selecting one emits `update:modelValue` and `change`.
- The picker opens in a `Popover`; bind `open` with `v-model:open` for controlled usage.
- This is the highest-level color component; prefer the individual `color-area`/`color-slider`/`color-field` for embedded, lighter-weight editors.

### Roadmap

N/A — color-picker is feature-complete for the current parity set.

## FAQ

### How do I use a color picker?

Bind `model-value` and optionally `swatches`:

```vue
<SColorPicker v-model:model-value="color" :swatches="['#7c3aed', '#06b6d4']" />
```

### How do I enable OKLCH editing?

Set `color-space` and `default-format`:

```vue
<SColorPicker v-model:model-value="color" color-space="oklch" default-format="oklch" />
```

### How do I toggle sections?

Use `show-alpha`/`show-fields`/`show-swatches`:

```vue
<SColorPicker v-model:model-value="color" :show-alpha="false" :show-swatches="false" />
```

### How do I control the popover?

Bind `open` with `v-model:open`:

```vue
<SColorPicker v-model:open="open" v-model:model-value="color" />
```
