---
head:
  title: Password
  description: 'A password input field with a toggle button to show/hide the entered value. Use it for login forms, sign-up forms, or any sensitive credential entry. It composes the input family base with a visibility switch, and supports clearable mode. For non-sensitive text use SInput.'
---

# Password

## Overview

A password input field with a toggle button to show/hide the entered value. Use it for login forms, sign-up forms, or any sensitive credential entry. It composes the input family base with a visibility switch, and supports clearable mode. For non-sensitive text use `SInput`.

## Usage

<UsageCode component="password" />

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

<PlaygroundGallery component="password" />

## API

<ComponentApi component="password" />

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
