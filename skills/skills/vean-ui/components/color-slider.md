# Color Slider

Source URL: https://veanui.com/components/color-slider
Markdown URL: https://veanui.com/components/color-slider.md
Category: Forms
Description: A single-channel color slider for hue, alpha, and individual RGB/HSL/HSV/OKLCH channels. SColorSlider combines the Aria ColorSliderRoot/ColorSliderTrack/ColorSliderThumb primitives with the shared sliderVariants style recipe (via sliderVariants).

## Overview

A single-channel color slider for hue, alpha, and individual RGB/HSL/HSV/OKLCH channels. `SColorSlider` combines the Aria `ColorSliderRoot`/`ColorSliderTrack`/`ColorSliderThumb` primitives with the shared `sliderVariants` style recipe (via `sliderVariants`).

Use a color slider for a single color channel — typically the hue or alpha channel inside a color picker (paired with `color-area`).

## Usage

Usage examples for color-slider are rendered on the site.

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

Interactive demos for color-slider are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): ColorSlider, ColorSliderCompact, ColorSliderRoot, ColorSliderThumb, ColorSliderTrack.

### ColorSlider

#### Props

Properties for the ColorSlider component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ColorSliderUi>`; optional)
- `trackProps`: Properties forwarded to the track element. (type `ColorSliderTrackProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `ColorSliderThumbProps`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `channel`: Channel. (type `'alpha' | 'hue' | 'saturation' | 'lightness' | 'brightness' | 'red' | 'green' | 'blue' | 'chroma'`; required)
- `format`: Format. (type `ColorFormat`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `inverted`: Whether inverted. (type `boolean`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `step`: Step. (type `number`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorSlider component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `changeEnd`: Emitted when change end occurs. (type `[value: string]`; parameters `value: string`)

### ColorSliderCompact

#### Props

Properties for the ColorSliderCompact component.

- `trackProps`: Properties forwarded to the track element. (type `ColorSliderTrackProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `ColorSliderThumbProps`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `channel`: Channel. (type `'alpha' | 'hue' | 'saturation' | 'lightness' | 'brightness' | 'red' | 'green' | 'blue' | 'chroma'`; required)
- `format`: Format. (type `ColorFormat`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `inverted`: Whether inverted. (type `boolean`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `step`: Step. (type `number`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorSliderCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `changeEnd`: Emitted when change end occurs. (type `[value: string]`; parameters `value: string`)

### ColorSliderRoot

#### Props

Properties for the ColorSliderRoot component.

- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `channel`: Channel. (type `'alpha' | 'hue' | 'saturation' | 'lightness' | 'brightness' | 'red' | 'green' | 'blue' | 'chroma'`; required)
- `format`: Format. (type `ColorFormat`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `inverted`: Whether inverted. (type `boolean`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `step`: Step. (type `number`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorSliderRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `changeEnd`: Emitted when change end occurs. (type `[value: string]`; parameters `value: string`)

### ColorSliderThumb

#### Props

Properties for the ColorSliderThumb component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ColorSliderTrack

#### Props

Properties for the ColorSliderTrack component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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

```

### How do I edit alpha?

Set `channel="alpha"`:

```vue

```

### How do I pair it with a color area?

Combine with `SColorArea` for the saturation plane:

```vue

```
