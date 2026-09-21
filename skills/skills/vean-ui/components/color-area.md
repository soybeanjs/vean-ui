# Color Area

Source URL: https://veanui.com/components/color-area
Markdown URL: https://veanui.com/components/color-area.md
Category: Forms
Description: A two-dimensional color editor for saturation/lightness, saturation/brightness, or OKLCH chroma/lightness selection. SColorArea combines the Aria ColorAreaRoot/ColorAreaArea/ColorAreaThumb primitives with the colorAreaVariants style recipe (3 slots, 6 sizes).

## Overview

A two-dimensional color editor for saturation/lightness, saturation/brightness, or OKLCH chroma/lightness selection. `SColorArea` combines the Aria `ColorAreaRoot`/`ColorAreaArea`/`ColorAreaThumb` primitives with the `colorAreaVariants` style recipe (3 slots, 6 sizes).

Use a color area for a saturation/lightness plane inside a color picker (typically paired with `color-slider` for the hue channel).

## Usage

Usage examples for color-area are rendered on the site.

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

Interactive demos for color-area are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): ColorArea, ColorAreaArea, ColorAreaCompact, ColorAreaRoot, ColorAreaThumb.

### ColorArea

#### Props

Properties for the ColorArea component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ColorAreaUi>`; optional)
- `areaProps`: Properties forwarded to the area element. (type `ColorAreaAreaProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `ColorAreaThumbProps`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `xChannel`: X channel. (type `ColorAreaAxisChannel`; optional)
- `yChannel`: Y channel. (type `ColorAreaAxisChannel`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `xName`: X name. (type `string`; optional)
- `yName`: Y name. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorArea component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `changeEnd`: Emitted when change end occurs. (type `[value: string]`; parameters `value: string`)

### ColorAreaArea

#### Props

Properties for the ColorAreaArea component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ColorAreaCompact

#### Props

Properties for the ColorAreaCompact component.

- `areaProps`: Properties forwarded to the area element. (type `ColorAreaAreaProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `ColorAreaThumbProps`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `xChannel`: X channel. (type `ColorAreaAxisChannel`; optional)
- `yChannel`: Y channel. (type `ColorAreaAxisChannel`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `xName`: X name. (type `string`; optional)
- `yName`: Y name. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorAreaCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `changeEnd`: Emitted when change end occurs. (type `[value: string]`; parameters `value: string`)

### ColorAreaRoot

#### Props

Properties for the ColorAreaRoot component.

- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `xChannel`: X channel. (type `ColorAreaAxisChannel`; optional)
- `yChannel`: Y channel. (type `ColorAreaAxisChannel`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `xName`: X name. (type `string`; optional)
- `yName`: Y name. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorAreaRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `changeEnd`: Emitted when change end occurs. (type `[value: string]`; parameters `value: string`)

### ColorAreaThumb

#### Props

Properties for the ColorAreaThumb component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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

```

### How do I configure the axes?

Use `x-channel`/`y-channel`:

```vue

```

### How do I pair it with a hue slider?

Combine with `SColorSlider` for the hue channel:

```vue

```
