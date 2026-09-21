# Password

Source URL: https://veanui.com/components/password
Markdown URL: https://veanui.com/components/password.md
Category: Forms
Description: A password input field with a toggle button to show/hide the entered value. Use it for login forms, sign-up forms, or any sensitive credential entry. It composes the input family base with a visibility switch, and supports clearable mode. For non-sensitive text use SInput.

## Overview

A password input field with a toggle button to show/hide the entered value. Use it for login forms, sign-up forms, or any sensitive credential entry. It composes the input family base with a visibility switch, and supports clearable mode. For non-sensitive text use `SInput`.

## Usage

Usage examples for password are rendered on the site.

## Features

- 📏 6 sizes: xs, sm, md, lg, xl, 2xl (inherited from the input base)
- 👁 Show/hide toggle with i18n `aria-label` and `aria-pressed` semantics
- 🎛 Controlled / uncontrolled `visible` state (`v-model:visible` + `defaultVisible`)
- 🧹 Clearable mode with an i18n `aria-label` clear button
- 🔒 `disabled` / `readonly` guards across input, toggle, and clear elements
- 📋 Native form submission via a proxied hidden input when `name` is set
- 🧩 Custom `visible` slot for a bespoke toggle button
- ♿ Full accessibility support — toggle naming, pressed state, axe-clean

## Demos

Interactive demos for password are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (2): Password, PasswordCompact.

### Password

#### Props

Properties for the Password component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<PasswordUi>`; optional)
- `visible`: Controlled password visibility. (type `boolean`; optional)
- `defaultVisible`: The initial visibility state when it is not controlled. (type `boolean`; default `false`; optional)
- `visibleProps`: Properties forwarded to the visible element. (type `ButtonProps`; optional)
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

Events for the Password component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `update:visible`: Emitted when the visible state changes. (type `[visible: boolean]`; parameters `visible: boolean`)

#### Slots

Slots for the Password component.

- `leading`: Custom content for the leading slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)
- `clear`: Custom content for the clear slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)
- `visible`: Custom content for the visible slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)

### PasswordCompact

#### Props

Properties for the PasswordCompact component.

- `visible`: Controlled password visibility. (type `boolean`; optional)
- `defaultVisible`: The initial visibility state when it is not controlled. (type `boolean`; default `false`; optional)
- `visibleProps`: Properties forwarded to the visible element. (type `ButtonProps`; optional)
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

Events for the PasswordCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `update:visible`: Emitted when the visible state changes. (type `[visible: boolean]`; parameters `visible: boolean`)

#### Slots

Slots for the PasswordCompact component.

- `leading`: Custom content for the leading slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)
- `clear`: Custom content for the clear slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)
- `visible`: Custom content for the visible slot. (type `((props: PasswordCompactSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the PasswordCompact component.

- `modelValue`: Current model value. (type `string`; optional)
- `clear`: Clear handler. (type `() => void`; required)
- `visible`: Whether the password is visible. (type `boolean`; required)
- `toggle`: Toggle password visibility. (type `() => void`; required)

## Notes

### Architecture and benchmark differences

VeanUI builds the password input by reusing the input family base: `PasswordCompact` composes `InputRoot` / `InputControl` / `InputClear` and adds a default `visible` slot backed by `useControllableState`. The styled layer extends `inputVariants` with a `visible` slot override styled as a mini icon button. This mirrors the headless/styled split of reka-ui and shadcn, differing from single-package libraries such as Element Plus.

| Capability                          | VeanUI | reka-ui `PasswordInput` | shadcn | Element Plus `el-input` |
| :---------------------------------- | :----: | :---------------------: | :----: | :---------------------: |
| Aria/styled split                   |   ✅   |            —            |   —    |            —            |
| Controlled / uncontrolled `visible` |   ✅   |           ✅            |   —    |            —            |
| Show/hide toggle (icon)             |   ✅   |           ✅            |   ✅   |           ✅            |
| i18n toggle label                   |   ✅   |            —            |   —    |           ✅            |
| `aria-pressed` semantics            |   ✅   |            —            |   —    |            —            |
| Clearable mode                      |   ✅   |            —            |   ✅   |           ✅            |
| `disabled` / `readonly` guards      |   ✅   |           ✅            |   ✅   |           ✅            |
| Size variants (xs…2xl)              |   ✅   |            —            |   —    |            —            |
| Custom `visible` slot               |   ✅   |            —            |   —    |            —            |
| Form proxying (hidden input)        |   ✅   |            —            |   —    |            —            |

### Cautions

- The `type` prop is intentionally overridden by the visibility state (`text` when visible, `password` otherwise); a user-provided `type` is not honored.
- The `visible` toggle button renders with `type="button"` to prevent accidental native form submission.
- Cursor position and password-manager compatibility are guaranteed by the native input contract.

## FAQ

### How do I default the password to visible?

Pass `defaultVisible` (uncontrolled) or bind `visible` with `v-model:visible` (controlled).

### How do I customize the toggle button?

Use the `visible` slot. It receives `modelValue`, `visible`, `clear`, and `toggle` props for full control.

### How do I make the field clearable?

Pass `clearable`. The clear button clears the value and emits `clear`; it is disabled together with `disabled` / `readonly`.

### Why does my `type` prop get ignored?

Password fields must switch between `text` and `password` to toggle visibility. The component owns this switch, so a user-provided `type` is overridden by design.
