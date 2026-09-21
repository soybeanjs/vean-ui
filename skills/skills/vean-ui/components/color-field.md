# Color Field

Source URL: https://veanui.com/components/color-field
Markdown URL: https://veanui.com/components/color-field.md
Category: Forms
Description: An input for editing either a full color string or a single channel, with support for hex, rgb, hsl, and oklch output. SColorField combines the Aria ColorFieldRoot/ColorFieldInput primitives with the colorFieldVariants style recipe (2 slots, 6 sizes).

## Overview

An input for editing either a full color string or a single channel, with support for `hex`, `rgb`, `hsl`, and `oklch` output. `SColorField` combines the Aria `ColorFieldRoot`/`ColorFieldInput` primitives with the `colorFieldVariants` style recipe (2 slots, 6 sizes).

Use a color field for typed color entry or for editing a single channel numerically inside a color picker (paired with `color-area`/`color-slider`).

## Usage

Usage examples for color-field are rendered on the site.

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

Interactive demos for color-field are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): ColorField, ColorFieldCompact, ColorFieldInput, ColorFieldRoot.

### ColorField

#### Props

Properties for the ColorField component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ColorFieldUi>`; optional)
- `inputProps`: Properties forwarded to the input element. (type `ColorFieldInputProps`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `channel`: Channel. (type `ColorChannel`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `placeholder`: Placeholder. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `disableWheelChange`: Whether to disable wheel change. (type `boolean`; optional)
- `step`: Step. (type `number`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorField component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)

### ColorFieldCompact

#### Props

Properties for the ColorFieldCompact component.

- `inputProps`: Properties forwarded to the input element. (type `ColorFieldInputProps`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `channel`: Channel. (type `ColorChannel`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `placeholder`: Placeholder. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `disableWheelChange`: Whether to disable wheel change. (type `boolean`; optional)
- `step`: Step. (type `number`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorFieldCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)

### ColorFieldInput

- No documented props, emits, slots, or slot props were available.

### ColorFieldRoot

#### Props

Properties for the ColorFieldRoot component.

- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `channel`: Channel. (type `ColorChannel`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `placeholder`: Placeholder. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `disableWheelChange`: Whether to disable wheel change. (type `boolean`; optional)
- `step`: Step. (type `number`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorFieldRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)

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

```

### How do I edit a single channel?

Set `channel` with a matching `color-space`:

```vue

```

### How do I disable wheel editing?

Set `disable-wheel-change`:

```vue

```
