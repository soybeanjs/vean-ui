# Color Picker

Source URL: https://veanui.com/components/color-picker
Markdown URL: https://veanui.com/components/color-picker.md
Category: Forms
Description: A composite color picker that combines a color area, hue/alpha sliders, formatted inputs, and preset swatches, with full oklch editing and output support. SColorPicker composes the Aria color primitives (ColorArea/ColorSlider/ColorField/ColorSwatch/ColorSwatchPicker) inside a popover, with a SegmentCompact for format switching. Nested part styles are unified in colorPickerVariants and forwarded through provideColorPickerUi.

## Overview

A composite color picker that combines a color area, hue/alpha sliders, formatted inputs, and preset swatches, with full `oklch` editing and output support. `SColorPicker` composes the Aria color primitives (`ColorArea`/`ColorSlider`/`ColorField`/`ColorSwatch`/`ColorSwatchPicker`) inside a popover, with a `SegmentCompact` for format switching. Nested part styles are unified in `colorPickerVariants` and forwarded through `provideColorPickerUi`.

Use a color picker for a full-featured color selection UI (format tabs, saturation plane, hue/alpha sliders, swatch presets and formatted input).

## Usage

Usage examples for color-picker are rendered on the site.

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

Interactive demos for color-picker are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): ColorPicker, ColorPickerCompact, ColorPickerRoot, ColorPickerTrigger.

### ColorPicker

#### Props

Properties for the ColorPicker component.

- `class`: Additional class names applied to the trigger element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ColorPickerUi>`; optional)
- `showAlpha`: Whether to show an alpha. (type `boolean`; optional)
- `showFields`: Whether to show a fields. (type `boolean`; optional)
- `showSwatches`: Whether to show a swatches. (type `boolean`; optional)
- `swatches`: Swatches. (type `string[]`; optional)
- `swatchProps`: Properties forwarded to the swatch element. (type `ColorSwatchCompactProps`; optional)
- `segmentProps`: Properties forwarded to the segment element. (type `SegmentCompactProps<ColorPickerFormatOptionData>`; optional)
- `areaProps`: Properties forwarded to the area element. (type `ColorAreaCompactProps`; optional)
- `hueSliderProps`: Properties forwarded to the hue slider element. (type `ColorSliderCompactProps`; optional)
- `alphaSliderProps`: Properties forwarded to the alpha slider element. (type `ColorSliderCompactProps`; optional)
- `alphaFieldProps`: Properties forwarded to the alpha field element. (type `ColorFieldCompactProps`; optional)
- `fieldProps`: Properties forwarded to the field element. (type `ColorFieldCompactProps`; optional)
- `swatchPickerProps`: Properties forwarded to the swatch picker element. (type `ColorSwatchPickerCompactProps<false>`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `defaultFormat`: Default format. (type `ColorFormat`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopoverTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopperPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopoverPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopoverPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopperArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopoverCloseProps`; optional)
- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)

#### Emits

Events for the ColorPicker component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `update:format`: Emitted when the format value changes. (type `[value: ColorFormat]`; parameters `value: ColorFormat`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)

### ColorPickerCompact

#### Props

Properties for the ColorPickerCompact component.

- `showAlpha`: Whether to show an alpha. (type `boolean`; optional)
- `showFields`: Whether to show a fields. (type `boolean`; optional)
- `showSwatches`: Whether to show a swatches. (type `boolean`; optional)
- `swatches`: Swatches. (type `string[]`; optional)
- `swatchProps`: Properties forwarded to the swatch element. (type `ColorSwatchCompactProps`; optional)
- `segmentProps`: Properties forwarded to the segment element. (type `SegmentCompactProps<ColorPickerFormatOptionData>`; optional)
- `areaProps`: Properties forwarded to the area element. (type `ColorAreaCompactProps`; optional)
- `hueSliderProps`: Properties forwarded to the hue slider element. (type `ColorSliderCompactProps`; optional)
- `alphaSliderProps`: Properties forwarded to the alpha slider element. (type `ColorSliderCompactProps`; optional)
- `alphaFieldProps`: Properties forwarded to the alpha field element. (type `ColorFieldCompactProps`; optional)
- `fieldProps`: Properties forwarded to the field element. (type `ColorFieldCompactProps`; optional)
- `swatchPickerProps`: Properties forwarded to the swatch picker element. (type `ColorSwatchPickerCompactProps<false>`; optional)
- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `defaultFormat`: Default format. (type `ColorFormat`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopoverTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopperPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopoverPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopoverPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopperArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopoverCloseProps`; optional)
- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)

#### Emits

Events for the ColorPickerCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `update:format`: Emitted when the format value changes. (type `[value: ColorFormat]`; parameters `value: ColorFormat`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)
- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)

### ColorPickerRoot

#### Props

Properties for the ColorPickerRoot component.

- `modelValue`: Current model value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `defaultValue`: Default value. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `format`: Format. (type `ColorFormat`; optional)
- `defaultFormat`: Default format. (type `ColorFormat`; optional)
- `colorSpace`: Color space. (type `ColorSpace`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the ColorPickerRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:color`: Emitted when the color value changes. (type `[value: NormalizedColor]`; parameters `value: NormalizedColor`)
- `update:format`: Emitted when the format value changes. (type `[value: ColorFormat]`; parameters `value: ColorFormat`)
- `change`: Emitted when change occurs. (type `[value: string]`; parameters `value: string`)

#### Slot Props

Slot properties for the ColorPickerRoot component.

- `color`: Theme color of the component. (type `ComputedRef<import("@soybeanjs/colord").AnyColor>`; required)
- `formattedValue`: Formatted value exposed in the slot scope. (type `ComputedRef<string>`; required)
- `hexValue`: Hex value exposed in the slot scope. (type `ComputedRef<string>`; required)
- `displayFormat`: Display format exposed in the slot scope. (type `ComputedRef<ColorFormat>`; required)
- `displayFormatLabel`: Display format label exposed in the slot scope. (type `ComputedRef<string>`; required)
- `areaXChannel`: X channel exposed in the slot scope. (type `ComputedRef<'saturation' | 'chroma'>`; required)
- `areaYChannel`: Y channel exposed in the slot scope. (type `ComputedRef<'lightness' | 'brightness'>`; required)
- `setColor`: Set color exposed in the slot scope. (type `(color: ColorValue) => void`; required)
- `setFormat`: Set format exposed in the slot scope. (type `(format: ColorFormat) => void`; required)

### ColorPickerTrigger

#### Props

Properties for the ColorPickerTrigger component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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

```

### How do I enable OKLCH editing?

Set `color-space` and `default-format`:

```vue

```

### How do I toggle sections?

Use `show-alpha`/`show-fields`/`show-swatches`:

```vue

```

### How do I control the popover?

Bind `open` with `v-model:open`:

```vue

```
