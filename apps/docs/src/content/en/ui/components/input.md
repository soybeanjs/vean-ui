---
head:
  title: Input
  description: 'A single-line text input that collects user input, supporting standard input attributes, prefix/suffix slots, and clearable functionality. Use it for any short free-text entry — form fields, search boxes, filters. For multi-line text use STextarea; for sensitive values use SPassword; for numeric values use SInputNumber.'
---

# Input

## Overview

A single-line text input that collects user input, supporting standard input attributes, prefix/suffix slots, and clearable functionality. Use it for any short free-text entry — form fields, search boxes, filters. For multi-line text use `STextarea`; for sensitive values use `SPassword`; for numeric values use `SInputNumber`.

## Usage

<UsageCode component="input" />

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

<PlaygroundGallery component="input" />

## API

<ComponentApi component="input" />

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
