# Toggle

Source URL: https://veanui.com/components/toggle
Markdown URL: https://veanui.com/components/toggle.md
Category: Forms
Description: A two-state button that toggles between pressed (on) and unpressed (off) states, reflecting its state via aria-pressed and data-state. Use it for an immediate, exclusive on/off switch such as a formatting tool or a filter chip; when the choice belongs to a form that needs explicit submission, prefer SCheckbox instead.

## Overview

A two-state button that toggles between pressed (`on`) and unpressed (`off`) states, reflecting its state via `aria-pressed` and `data-state`. Use it for an immediate, exclusive on/off switch such as a formatting tool or a filter chip; when the choice belongs to a form that needs explicit submission, prefer `SCheckbox` instead.

## Usage

Usage examples for toggle are rendered on the site.

## Features

- 🎚 `modelValue` / `defaultValue` — controlled and uncontrolled modes backed by `useControllableState`
- ♿ `aria-pressed` + `data-state` (`on`/`off`) dual reflection, axe-clean
- ⌨️ Keyboard operable — Enter and Space toggle via native button behavior
- 🎨 3 variants (outline/soft/ghost) × 6 sizes × 8 colors × 4 shapes via `toggleVariants`
- 🧩 Full `SButton` prop surface (icon slots, `asChild`, loading via button props) through Aria `Toggle`
- 📦 Slot props expose `modelValue` / `pressed` / `state` / `disabled` for custom content
- 🚫 Disabled state with `disabled` + `aria-disabled` and guarded click handling

## Demos

Interactive demos for toggle are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): Toggle.

### Toggle

#### Props

Properties for the Toggle component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ToggleVariant`; optional)
- `shape`: Shape of the component. (type `ToggleShape`; optional)
- `defaultValue`: The pressed state of the toggle when it is initially rendered. (type `boolean`; optional)
- `modelValue`: The controlled pressed state of the toggle. Can be bound with v-model. (type `boolean`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Toggle component.

- `update:modelValue`: Event handler called when the pressed state changes. (type `[value: boolean]`; parameters `value: boolean`)

## Notes

### Architecture and benchmark differences

VeanUI builds the toggle from the Aria `Toggle` (`useControllableState` + `Button` base + `aria-pressed`/`data-state` reflection + disabled-guarded click) and a thin UI wrapper `SToggle` that only computes `toggleVariants` classes and forwards `update:modelValue`. The `data-state` attribute drives the pressed styling through UnoCSS `data-[state=on]:*` selectors, keeping state and visuals decoupled. `toggle` is a Radix/shadcn-native pattern; the other benchmark libraries express the same interaction through button-plus-state or segmented controls.

| Capability                    | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn `Toggle` |
| :---------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :-------------: |
| Aria/styled split             |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| Pressed/unpressed state       |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| Controlled/uncontrolled       |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| `aria-pressed` + `data-state` |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| Variants (outline/soft/ghost) |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| Sizes/shapes (6 sizes × 4)    |   ✅   |     —      |      —       |    —    |    —     |        —        |
| Keyboard (Enter/Space)        |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| Disabled                      |   ✅   |     —      |      —       |    —    |    —     |       ✅        |
| Axe-clean                     |   ✅   |     —      |      —       |    —    |    —     |        —        |
| Pressed-state icon animation  |   ➕   |     ✅     |      —       |    —    |    —     |        —        |

### Cautions

- An icon-only toggle has no accessible name — pass `aria-label` (or use a visible label) to stay axe-clean.
- The pressed state is reflected by `aria-pressed` and `data-state`; style the pressed look with `data-[state=on]:*` utilities or the built-in variants.
- Enter/Space toggling relies on the native button behavior of the `Button` base.
- For exclusive multi-choice, compose toggles with `SToggleGroup` instead of managing state by hand.

## FAQ

### Controlled or uncontrolled?

Pass `modelValue` with `v-model` for a controlled value, or `defaultValue` to let the toggle own its state internally. Both are supported via `useControllableState`.

### How do I build an icon-only toggle?

Put an icon in the default slot and add `aria-label` (e.g. `aria-label="Bold"`). The `toggleVariants` base already neutralizes `svg` pointer events and gives icons a default `size-4`.

### What is the difference between `SToggle` and `SButton`?

`SToggle` is a stateful button — it remembers whether it is pressed and reflects that via `aria-pressed`/`data-state` with pressed styling; `SButton` is stateless and only emits clicks.

### How do I build a group of toggles?

Use `SToggleGroup` — it manages single/multiple selection and the associated `aria-pressed` state for you.
