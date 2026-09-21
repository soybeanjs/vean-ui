# Color Swatch Picker

Source URL: https://veanui.com/components/color-swatch-picker
Markdown URL: https://veanui.com/components/color-swatch-picker.md
Category: Forms
Description: Choose a color quickly from a preset palette, useful for theme panels and suggested color selections. SColorSwatchPicker combines the Aria ColorSwatchPickerRoot/Item/ItemSwatch/ItemIndicator primitives (built on the listbox) with the colorSwatchPickerVariants style recipe (6 slots, 6 sizes × 2 shapes).

## Overview

Choose a color quickly from a preset palette, useful for theme panels and suggested color selections. `SColorSwatchPicker` combines the Aria `ColorSwatchPickerRoot`/`Item`/`ItemSwatch`/`ItemIndicator` primitives (built on the listbox) with the `colorSwatchPickerVariants` style recipe (6 slots, 6 sizes × 2 shapes).

Use a swatch picker for a compact, clickable preset palette (theme panels, brand colors, suggested colors).

## Usage

Usage examples for color-swatch-picker are rendered on the site.

## Features

- 🧩 Aria/listbox based — built on the listbox primitives with `role="listbox"`/`option`, roving focus and selection
- 🎨 Preset palette — pass `colors` as an array; each renders a `ColorSwatch` with a check indicator
- 🔘 Single/multiple — `multiple` (via the listbox `M` generic) selects one or many values
- ✅ Indicator — an `indicator` slot (default `lucide:check`) marks the active swatch
- 🔵 Shape — `shape="square"` (default) or `"circle"`
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- 🧩 Custom content — the `default` slot (when no `colors`) and `swatch`/`indicator` slots for full control

## Component family

- `SColorSwatchPicker` (styled) — the entry wrapper; `colorSwatchPickerVariants` recipe with dynamic slot forwarding
- `ColorSwatchPickerCompact` (Aria) — the aggregated composite; iterates `colors` into items with swatch + indicator
- `ColorSwatchPickerRoot` (Aria) — the listbox root (`modelValue`, `multiple`)
- `ColorSwatchPickerItem` (Aria) — a selectable swatch option (`role="option"`)
- `ColorSwatchPickerItemSwatch` (Aria) — the swatch (`ColorSwatchCompact` base)
- `ColorSwatchPickerItemIndicator` (Aria) — the selection check indicator

## Demo

Interactive demos for color-swatch-picker are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): ColorSwatchPicker, ColorSwatchPickerCompact, ColorSwatchPickerCompactColor, ColorSwatchPickerItem, ColorSwatchPickerItemIndicator, ColorSwatchPickerItemSwatch, ColorSwatchPickerRoot.

### ColorSwatchPicker

#### Props

Properties for the ColorSwatchPicker component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ColorSwatchPickerExtendedUi>`; optional)
- `shape`: Shape of the component. (type `ColorSwatchPickerShape`; optional)
- `colors`: Colors. (type `string[]`; optional)
- `itemProps`: Properties forwarded to the item element. (type `Omit<ColorSwatchPickerItemProps, 'value'>`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `ColorSwatchPickerItemIndicatorProps`; optional)
- `swatchProps`: Properties forwarded to the swatch element. (type `ColorSwatchPickerItemSwatchProps`; optional)
- `orientation`: The orientation of the listbox. <br>Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `string | string[]`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `string | string[]`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `boolean`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the ColorSwatchPicker component.

- `update:modelValue`: No description. (type `[value: string | string[]]`; parameters `value: string | string[]`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `entryFocus`: Event handler called when container is being focused. Can be prevented. (type `[event: CustomEvent<any>]`; parameters `event: CustomEvent<any>`)
- `leave`: Event handler called when the mouse leave the container (type `[event: Event]`; parameters `event: Event`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)

### ColorSwatchPickerCompact

#### Props

Properties for the ColorSwatchPickerCompact component.

- `colors`: Colors. (type `string[]`; optional)
- `itemProps`: Properties forwarded to the item element. (type `Omit<ColorSwatchPickerItemProps, 'value'>`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `ColorSwatchPickerItemIndicatorProps`; optional)
- `swatchProps`: Properties forwarded to the swatch element. (type `ColorSwatchPickerItemSwatchProps`; optional)
- `orientation`: The orientation of the listbox. <br>Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the ColorSwatchPickerCompact component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `entryFocus`: Event handler called when container is being focused. Can be prevented. (type `[event: CustomEvent<any>]`; parameters `event: CustomEvent<any>`)
- `leave`: Event handler called when the mouse leave the container (type `[event: Event]`; parameters `event: Event`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)

#### Slots

Slots for the ColorSwatchPickerCompact component.

- `default`: Custom content rendered when colors are not provided. (type `((props: ColorSwatchPickerCompactSlotProps<M>) => any) | undefined`)
- `swatch`: Custom content rendered inside each swatch. (type `((props: ColorSwatchPickerCompactColorSlotProps) => any) | undefined`)
- `indicator`: Custom content rendered inside each indicator. (type `((props: ColorSwatchPickerCompactColorSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the ColorSwatchPickerCompact component.

- `modelValue`: Current model value. (type `M extends true ? string[] : string`; required)

### ColorSwatchPickerCompactColor

#### Slot Props

Slot properties for color-specific ColorSwatchPickerCompact slots.

- `color`: Current swatch color. (type `string`; required)

### ColorSwatchPickerItem

#### Props

Properties for the ColorSwatchPickerItem component.

- `value`: The value given as data when submitted with a `name`. (type `string`; required)
- `disabled`: When `true`, prevents the user from interacting with the item. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ColorSwatchPickerItem component.

- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)

### ColorSwatchPickerItemIndicator

#### Props

Properties for the ColorSwatchPickerItemIndicator component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ColorSwatchPickerItemSwatch

#### Props

Properties for the ColorSwatchPickerItemSwatch component.

- `checkerProps`: Props for the checker element of the ColorSwatch component. (type `ColorSwatchCheckerProps`; optional)
- `fillProps`: Props for the fill element of the ColorSwatch component. (type `ColorSwatchFillProps`; optional)
- `color`: Theme color of the component. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ColorSwatchPickerRoot

#### Props

Properties for the ColorSwatchPickerRoot component.

- `orientation`: The orientation of the listbox. <br>Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the ColorSwatchPickerRoot component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `entryFocus`: Event handler called when container is being focused. Can be prevented. (type `[event: CustomEvent<any>]`; parameters `event: CustomEvent<any>`)
- `leave`: Event handler called when the mouse leave the container (type `[event: Event]`; parameters `event: Event`)

## Notes

### Architecture and benchmark differences

`ColorSwatchPickerCompact` owns the palette iteration (item + swatch + indicator) while every primitive stays style-free and only the UI wrapper injects the `colorSwatchPickerVariants` classes. This mirrors radix-ui-color/shadcn-ui headless split, built on the shared listbox primitives. Ant Design, Element Plus, Mantine and Naive UI ship a single color-picker with a preset row; VeanUI exposes a standalone listbox-based swatch picker with single/multiple selection, a check indicator, shape/size control and full slot overrides.

| Capability            | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :-------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/listbox based    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Single/multiple       |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Check indicator       |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Roving focus          |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Shape (square/circle) |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Sizes (6)             |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `colors` is an array of color strings; each renders an `ColorSwatch` option with a check indicator on the active value.
- Selection emits `update:modelValue` (single: a string; `multiple`: an array) and `select`.
- Provide `indicator`/`swatch` slots to customize the check mark and swatch content; use the `default` slot to render fully custom content when `colors` is empty.
- `shape` switches between square (`rounded-md`) and circle (`rounded-full`).
- Built on the listbox primitives, so keyboard/roving-focus behavior follows the listbox contract.

### Roadmap

N/A — color-swatch-picker is feature-complete for the current parity set.

## FAQ

### How do I build a swatch picker?

Pass `colors` and bind `model-value`:

```vue

```

### How do I allow multiple selection?

Use `multiple` (the value becomes an array):

```vue

```

### How do I make the swatches circular?

Set `shape="circle"`:

```vue

```

### How do I customize the indicator?

Use the `indicator` slot:

```vue
<template #indicator>✓</template>
```
