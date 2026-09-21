# Input

Source URL: https://veanui.com/components/input
Markdown URL: https://veanui.com/components/input.md
Category: Forms
Description: A single-line text input that collects user input, supporting standard input attributes, prefix/suffix slots, and clearable functionality. Use it for any short free-text entry — form fields, search boxes, filters. For multi-line text use STextarea; for sensitive values use SPassword; for numeric values use SInputNumber.

## Overview

A single-line text input that collects user input, supporting standard input attributes, prefix/suffix slots, and clearable functionality. Use it for any short free-text entry — form fields, search boxes, filters. For multi-line text use `STextarea`; for sensitive values use `SPassword`; for numeric values use `SInputNumber`.

## Usage

Usage examples for input are rendered on the site.

## Features

- 📏 6 sizes: xs, sm, md, lg, xl, 2xl
- 🧹 Clearable mode with a hover/focus-revealed clear button (i18n `aria-label`)
- 🔤 `leading` / `trailing` slots for prefix and suffix content
- 🔒 `disabled` / `readonly` states with full interaction guards
- 📋 Native form submission via a proxied hidden input when `name` is set
- ♿ Full accessibility support — `aria-roledescription`, clear button naming, axe-clean
- 🎯 TypeScript type safety with strict `type` attribute typing

## Input component family

- **SInput** - Base text input component
- **SInputClear** - Clear button, shown on hover/focus when `clearable`

## Demos

Interactive demos for input are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): Input, InputClear, InputCompact, InputControl, InputRoot.

### Input

#### Props

Properties for the Input component.

- `class`: root class (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<InputUi>`; optional)
- `inputRef`: The function to set the input element. (type `((el: HTMLInputElement) => void)`; optional)
- `clearable`: Whether to show the clear trigger. (type `boolean`; default `false`; optional)
- `controlProps`: Properties forwarded to the control element. (type `InputControlProps`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `InputClearProps`; optional)
- `defaultValue`: The default value of the input (type `string`; optional)
- `modelValue`: The controlled value of the input (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the Input component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the Input component.

- `leading`: Custom content for the leading slot. (type `((props: InputCompactSlotProps) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: InputCompactSlotProps) => any) | undefined`)
- `clear`: Custom content for the clear slot. (type `((props: InputCompactSlotProps) => any) | undefined`)

### InputClear

#### Props

Properties for the InputClear component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the InputClear component.

- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### InputCompact

#### Props

Properties for the InputCompact component.

- `inputRef`: The function to set the input element. (type `((el: HTMLInputElement) => void)`; optional)
- `clearable`: Whether to show the clear trigger. (type `boolean`; default `false`; optional)
- `controlProps`: Properties forwarded to the control element. (type `InputControlProps`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `InputClearProps`; optional)
- `defaultValue`: The default value of the input (type `string`; optional)
- `modelValue`: The controlled value of the input (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the InputCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the InputCompact component.

- `leading`: Custom content for the leading slot. (type `((props: InputCompactSlotProps) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: InputCompactSlotProps) => any) | undefined`)
- `clear`: Custom content for the clear slot. (type `((props: InputCompactSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the InputCompact component.

- `modelValue`: Current model value. (type `string`; optional)
- `clear`: Clear handler. (type `() => void`; required)

### InputControl

- No documented props, emits, slots, or slot props were available.

### InputRoot

#### Props

Properties for the InputRoot component.

- `defaultValue`: The default value of the input (type `string`; optional)
- `modelValue`: The controlled value of the input (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the InputRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)

## Notes

### Architecture and benchmark differences

VeanUI splits the input into an Aria layer (`@vean/aria/input`) that owns state, form proxying, and clear-button semantics, and a styled layer (`@vean/ui`) that owns variants and UnoCSS classes. The Aria `InputCompact` composes `InputRoot` / `InputControl` / `InputClear` and exposes `leading` / `clear` / `trailing` slots, mirroring the headless/styled split of Radix and differing from single-package libraries such as Ant Design and Element Plus.

| Capability                     | VeanUI | Ant Design `Input` | Element Plus `Input` | Radix `TextField` |
| :----------------------------- | :----: | :----------------: | :------------------: | :---------------: |
| Aria/styled split              |   ✅   |         —          |          —           |        ✅         |
| Controlled / uncontrolled      |   ✅   |         ✅         |          ✅          |        ✅         |
| Clear button (hover reveal)    |   ✅   |         ✅         |          ✅          |         —         |
| Clear button i18n `aria-label` |   ✅   |         ✅         |          —           |         —         |
| Prefix / suffix slots          |   ✅   |         ✅         |          ✅          |        ✅         |
| Native form proxying           |   ✅   |         —          |          —           |         —         |
| Size variants                  |   ✅   |         ✅         |          ✅          |         —         |
| `showCount` counter            |   —    |         ✅         |          ✅          |         —         |
| `error` / `loading` state      |   —    |         ✅         |          ✅          |         —         |

### Cautions

- `showCount`, `error`, and `loading` states are not implemented; they are tracked as enhancement backlog.
- The clear button only appears on hover or focus (desktop convention); on touch devices ensure a `leading`/`trailing` affordance if needed.
- The root renders `role="group"` with `aria-roledescription="Input"` and `spellcheck="false"` by design.

## FAQ

### How do I add a prefix icon or suffix text?

Use the `leading` and `trailing` slots. They receive the root context and render inside the input field frame.

### Why does the clear button only show on hover?

Clear visibility follows the desktop hover/focus convention (`group-hover` / `group-focus-within`). It is intentionally not always visible to keep the input compact and avoid accidental clearing.

### How does the input submit its value in a native form?

Pass `name` — the component renders a visually hidden proxy input carrying the current value, so native form submission and validation work without extra wiring.

### How do I limit the input length?

Pass `maxlength` / `minlength`; they are forwarded to the native input. A visible counter is not yet provided (tracked as enhancement backlog).
