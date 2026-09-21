# ToggleGroup

Source URL: https://veanui.com/components/toggle-group
Markdown URL: https://veanui.com/components/toggle-group.md
Category: Forms
Description: A set of two-state buttons that can be toggled on or off as a group, supporting single and multiple selection. Use it for formatting toolbars, filter chips, or any exclusive (or multi-choice) segmented control where the selection changes immediately. For segmented _single_ options that must look like a unified control, SSegment may fit better; for a single independent on/off button, use SToggle.

## Overview

A set of two-state buttons that can be toggled on or off as a group, supporting single and multiple selection. Use it for formatting toolbars, filter chips, or any exclusive (or multi-choice) segmented control where the selection changes immediately. For segmented _single_ options that must look like a unified control, `SSegment` may fit better; for a single independent on/off button, use `SToggle`.

## Usage

Usage examples for toggle-group are rendered on the site.

## Features

- 🎯 Single / multiple selection — `multiple` switches between one and many selected items, with a type-safe generic value (`M extends boolean`, `T extends DefinedValue`)
- 🎚 Controlled / uncontrolled — `v-model` and `defaultValue` (scalar or array) backed by `useControllableState`
- ⌨️ Roving focus keyboard navigation — arrow keys move focus between items, `loop` wraps around, and arrow direction reverses in RTL
- ♿ `aria-pressed` + `data-state` (`on`/`off`) dual reflection, axe-clean
- 🎨 3 variants (outline/soft/ghost) × 6 sizes × 8 colors × 2 orientations via `toggleGroupVariants`
- 🧩 Per-item full `Button` prop surface (`as`/`asChild`, `type`, item-level `disabled`), and slot props exposing `pressed` / `disabled`
- 📝 Form integration — `name`/`required` render a hidden input so the selection submits with the owning form
- 🧩 `ui` per-slot class overrides (`root` / `item`)

## Component family

- `SToggleGroup` — the group root that manages selection state, orientation, and roving focus
- `SToggleGroupItem` — an individual toggleable button; pass a unique `value` that identifies it in the group

## Demos

Interactive demos for toggle-group are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (3): ToggleGroup, ToggleGroupItem, ToggleGroupRoot.

### ToggleGroup

#### Props

Properties for the ToggleGroup component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ToggleGroupVariant`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ToggleGroupUi>`; optional)
- `rovingFocus`: When `false`, navigating through items with arrow keys is disabled. (type `boolean`; optional)
- `disabled`: When `true`, prevents interaction with all items in the group. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation loops from last to first item, and vice versa. (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? T[] : T)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? T[] : T)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ToggleGroup component.

- `update:modelValue`: No description. (type `[value: M extends true ? T[] : T]`; parameters `value: M extends true ? T[] : T`)

### ToggleGroupItem

#### Props

Properties for the ToggleGroupItem component.

- `value`: A unique value that identifies the item inside the group. (type `T`; required)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ToggleGroupRoot

#### Props

Properties for the ToggleGroupRoot component.

- `rovingFocus`: When `false`, navigating through items with arrow keys is disabled. (type `boolean`; optional)
- `disabled`: When `true`, prevents interaction with all items in the group. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation loops from last to first item, and vice versa. (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? T[] : T)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? T[] : T)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ToggleGroupRoot component.

- `update:modelValue`: No description. (type `[value: M extends true ? T[] : T]`; parameters `value: M extends true ? T[] : T`)

## Notes

### Architecture and benchmark differences

VeanUI builds the group from Aria `ToggleGroupRoot` (`useSelection` + `useRovingFocusGroup` + hidden-input form proxy) and `ToggleGroupItem` (dynamically backed by `useRovingFocusGroupItem` or the `Button` base depending on `rovingFocus`). The UI wrapper `SToggleGroup` is a thin pass-through that only computes `toggleGroupVariants` classes; `data-state` drives the pressed look through UnoCSS `data-[state=on]:*` selectors. `toggle-group` is a Radix/shadcn-native pattern; the other benchmark libraries express the same interaction with radio/button groups or segmented controls.

| Capability                        | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn `ToggleGroup` |
| :-------------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :------------------: |
| Aria/styled split                 |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| Single / multiple selection       |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          ✅          |
| Controlled / uncontrolled         |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          ✅          |
| Roving focus arrow keys           |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| Loop navigation                   |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| RTL-aware arrow direction         |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| `aria-pressed` + `data-state`     |   ✅   |     —      |      —       |    —    |    —     |          ✅          |
| Orientation (horizontal/vertical) |   ✅   |     —      |      ✅      |   ✅    |    —     |          ✅          |
| Variants × sizes × colors         |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          —           |
| Hidden-input form submission      |   ✅   |     —      |      —       |    —    |    —     |          —           |
| Clearable single deselect         |   ✅   |     ✅     |      —       |    —    |    —     |          —           |
| Disabled (group + item)           |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |          ✅          |

### Cautions

- `rovingFocus`, `loop`, and `clearable` default to `true`. Disabling `rovingFocus` falls back to a plain `role="group"` with no arrow-key navigation.
- Group-level `disabled` disables every item; item-level `disabled` only affects that item, and the two are combined (`group || item`).
- In single mode, clicking the selected item again emits `update:modelValue` with `undefined` (unless `:clearable="false"`) — handle the `undefined` value in the parent.
- Form submission requires `name`; `required` only marks the hidden input, it does not validate.
- For icon-only items, add `aria-label` so the button has an accessible name.
- In a `form`, the hidden input is only rendered when the group is a form control and `name` is set.

## FAQ

### Single or multiple selection?

Single is the default. Pass `multiple` to allow several items at once — `modelValue`/`defaultValue` then become arrays and the generic `M` is inferred from them.

### How do I allow deselecting the selected item in single mode?

`clearable` defaults to `true`, so clicking the active item clears it and emits `undefined`. Set `:clearable="false"` to keep a selection always present.

### How do I make arrow keys wrap around?

Keep `loop` (default `true`) and the focus wraps from the last to the first item and vice versa. Disabled items are skipped.

### What is the difference between `SToggleGroup` and `SToggle`?

`SToggleGroup` coordinates a set of items: it owns single/multiple selection, roving-focus keyboard navigation, and shared `aria-pressed` state. `SToggle` is a single standalone toggle with no group coordination.

### How do I render the group vertically?

Set `orientation="vertical"` — the layout switches to a stacked column and arrow navigation follows the vertical axis.
