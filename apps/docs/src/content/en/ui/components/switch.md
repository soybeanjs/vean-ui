---
head:
  title: Switch
  description: 'A control that toggles between checked and unchecked states with a sliding thumb and native form integration. Use it for a single binary setting that takes effect immediately (e.g. dark mode, notifications); when the option belongs to a form that needs explicit submission, prefer SCheckbox; when more than one value can be selected, use a checkbox group instead.'
---

# Switch

## Overview

A control that toggles between checked and unchecked states with a sliding thumb and native form integration. Use it for a single binary setting that takes effect immediately (e.g. dark mode, notifications); when the option belongs to a form that needs explicit submission, prefer `SCheckbox`; when more than one value can be selected, use a checkbox group instead.

## Usage

<UsageCode component="switch" />

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

<PlaygroundGallery component="switch" />

## API

<ComponentApi component="switch" />

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
