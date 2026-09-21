---
head:
  title: ToggleGroup
  description: 'A set of two-state buttons that can be toggled on or off as a group, supporting single and multiple selection. Use it for formatting toolbars, filter chips, or any exclusive (or multi-choice) segmented control where the selection changes immediately. For segmented _single_ options that must look like a unified control, SSegment may fit better; for a single independent on/off button, use SToggle.'
---

# ToggleGroup

## Overview

A set of two-state buttons that can be toggled on or off as a group, supporting single and multiple selection. Use it for formatting toolbars, filter chips, or any exclusive (or multi-choice) segmented control where the selection changes immediately. For segmented _single_ options that must look like a unified control, `SSegment` may fit better; for a single independent on/off button, use `SToggle`.

## Usage

<UsageCode component="toggle-group" />

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

<PlaygroundGallery component="toggle-group" />

## API

<ComponentApi component="toggle-group" />

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
