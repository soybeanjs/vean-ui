# Switch

Source URL: https://veanui.com/components/switch
Markdown URL: https://veanui.com/components/switch.md
Category: Forms
Description: A control that toggles between checked and unchecked states with a sliding thumb and native form integration. Use it for a single binary setting that takes effect immediately (e.g. dark mode, notifications); when the option belongs to a form that needs explicit submission, prefer SCheckbox; when more than one value can be selected, use a checkbox group instead.

## Overview

A control that toggles between checked and unchecked states with a sliding thumb and native form integration. Use it for a single binary setting that takes effect immediately (e.g. dark mode, notifications); when the option belongs to a form that needs explicit submission, prefer `SCheckbox`; when more than one value can be selected, use a checkbox group instead.

## Usage

Usage examples for switch are rendered on the site.

## Features

- 🎚 `modelValue` / `defaultValue` — controlled and uncontrolled modes backed by `useControllableState`
- 🅰 Custom values — `trueValue` / `falseValue` accept booleans, strings, or numbers
- ⌨️ Keyboard operable — Enter and Space toggle the switch (native button behavior)
- ♿ `role="switch"` + `aria-checked` / `data-state` dual reflection, axe-clean
- 📋 Native form proxy — a visually hidden checkbox input carries `name` / `required` / `value`
- 🎨 6 sizes, 8 colors, and rounded/square shapes via `switchVariants`
- 🧩 `leading` / `trailing` / default (thumb) slots for labels and icons
- ↔ RTL-aware thumb animation driven by `dir`

## Demos

Interactive demos for switch are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): Switch, SwitchCompact, SwitchControl, SwitchRoot, SwitchThumb.

### Switch

#### Props

Properties for the Switch component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<SwitchUi>`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `shape`: Shape of the component. (type `SwitchShape`; optional)
- `controlProps`: Properties forwarded to the control element. (type `SwitchControlProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `SwitchThumbProps`; optional)
- `defaultValue`: The state of the switch when it is initially rendered. Use when you do not need to control its state. (type `NonNullable<T>`; optional)
- `modelValue`: The controlled state of the switch. Can be bind as `v-model`. (type `T`; optional)
- `disabled`: When `true`, prevents the user from interacting with the switch. (type `boolean`; optional)
- `value`: The value given as data when submitted with a `name`. (type `string`; optional)
- `dir`: The direction the switch should animate towards when changing state. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `trueValue`: The value given as data when submitted with a `name`. (type `NonNullable<T>`; default `true`; optional)
- `falseValue`: The value given as data when submitted with a `name`. (type `NonNullable<T>`; default `false`; optional)

#### Emits

Events for the Switch component.

- `update:modelValue`: Event handler called when the value of the switch changes. (type `[payload: NonNullable<T>]`; parameters `payload: NonNullable<T>`)

#### Slots

Slots for the Switch component.

- `default`: Custom content for the default slot. (type `((props: SwitchCompactSlotProps<T>) => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `((props: SwitchCompactSlotProps<T>) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: SwitchCompactSlotProps<T>) => any) | undefined`)

### SwitchCompact

#### Props

Properties for the SwitchCompact component.

- `controlProps`: Properties forwarded to the control element. (type `SwitchControlProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `SwitchThumbProps`; optional)
- `defaultValue`: The state of the switch when it is initially rendered. Use when you do not need to control its state. (type `NonNullable<T>`; optional)
- `modelValue`: The controlled state of the switch. Can be bind as `v-model`. (type `T`; optional)
- `disabled`: When `true`, prevents the user from interacting with the switch. (type `boolean`; optional)
- `value`: The value given as data when submitted with a `name`. (type `string`; optional)
- `dir`: The direction the switch should animate towards when changing state. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `trueValue`: The value given as data when submitted with a `name`. (type `NonNullable<T>`; default `true`; optional)
- `falseValue`: The value given as data when submitted with a `name`. (type `NonNullable<T>`; default `false`; optional)

#### Emits

Events for the SwitchCompact component.

- `update:modelValue`: Event handler called when the value of the switch changes. (type `[payload: NonNullable<T>]`; parameters `payload: NonNullable<T>`)

#### Slots

Slots for the SwitchCompact component.

- `default`: Custom content for the default slot. (type `((props: SwitchCompactSlotProps<T>) => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `((props: SwitchCompactSlotProps<T>) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: SwitchCompactSlotProps<T>) => any) | undefined`)

#### Slot Props

Slot properties for the SwitchCompact component.

- `modelValue`: Current model value. (type `T | undefined`; required)

### SwitchControl

#### Props

Properties for the SwitchControl component.

- `id`: Id of the element (type `string`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SwitchRoot

#### Props

Properties for the SwitchRoot component.

- `defaultValue`: The state of the switch when it is initially rendered. Use when you do not need to control its state. (type `NonNullable<T>`; optional)
- `modelValue`: The controlled state of the switch. Can be bind as `v-model`. (type `T`; optional)
- `disabled`: When `true`, prevents the user from interacting with the switch. (type `boolean`; optional)
- `value`: The value given as data when submitted with a `name`. (type `string`; optional)
- `dir`: The direction the switch should animate towards when changing state. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `trueValue`: The value given as data when submitted with a `name`. (type `NonNullable<T>`; default `true`; optional)
- `falseValue`: The value given as data when submitted with a `name`. (type `NonNullable<T>`; default `false`; optional)

#### Emits

Events for the SwitchRoot component.

- `update:modelValue`: Event handler called when the value of the switch changes. (type `[payload: NonNullable<T>]`; parameters `payload: NonNullable<T>`)

### SwitchThumb

#### Props

Properties for the SwitchThumb component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark differences

VeanUI builds the switch from Aria `SwitchRoot` (`useControllableState` + `VisuallyHiddenInput` form proxy) → `SwitchControl` (`Button` base + `role="switch"` + `aria-checked`/`data-state`, disabled-guarded) → `SwitchThumb` (`Primitive` + `data-state`/`data-disabled`). `SwitchCompact` composes root + control + thumb, owns the `leading`/`trailing` slots, and generates the control id; the UI wrapper `SSwitch` only computes variant classes via `switchVariants` and injects the `ui` map through `provideSwitchUi`.

| Capability                          | VeanUI | Ant Design `Switch` | Element Plus `Switch` | Mantine `Switch` | Naive UI `Switch` | shadcn `Switch` |
| :---------------------------------- | :----: | :-----------------: | :-------------------: | :--------------: | :---------------: | :-------------: |
| Aria/styled split                   |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| Controlled/uncontrolled             |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Custom on/off values                |   ✅   |         ✅          |          ✅           |        —         |        ✅         |       ✅        |
| Leading/trailing slots              |   ✅   |          —          |          ✅           |        ✅        |         —         |        —        |
| `loading` state                     |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| Inline label (`onLabel`/`offLabel`) |   ➕   |          —          |          ✅           |        ✅        |         —         |        —        |
| `beforeChange` hook                 |   ➕   |          —          |          ✅           |        —         |         —         |        —        |
| Form proxy / `name` submit          |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Axe-clean                           |   ✅   |          —          |           —           |        —         |         —         |        —        |

### Cautions

- The control is a `<button role="switch">` — provide an accessible name via `controlProps` (`aria-label`) or a visible label when used standalone.
- `trueValue` / `falseValue` must not be nullish; a runtime guard throws otherwise.
- The visually hidden input submits `value` (default `'on'`) when checked — it is independent of `trueValue`.
- The form proxy renders only when `name` is present on a `form`-classed root; pair it with a native `<form>` or the `SForm` integration.

## FAQ

### Controlled or uncontrolled?

Pass `modelValue` with `v-model` for a controlled value, or `defaultValue` to let the switch own its state internally. Both are supported via `useControllableState`.

### Can I use non-boolean values?

Yes — set `trueValue` / `falseValue` to any string or number (e.g. `'on'` / `'off'`); `aria-checked` and `data-state` reflect the comparison against `trueValue`.

### How do I add a label next to the switch?

Use the `leading` / `trailing` slots, or pair a native `<label>` with the control `id`.

### How does the switch submit its value in a form?

Give the switch a `name`; inside a `form`-classed root a visually hidden checkbox input is rendered and carries the submitted `value` when the switch is checked.
