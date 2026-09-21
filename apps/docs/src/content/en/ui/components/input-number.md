---
head:
  title: InputNumber
  description: 'A numeric input field that only accepts numeric values, with increment/decrement controls, keyboard interaction, and min/max boundary handling. Use it for quantities, prices, ages, or any value that must stay numeric and within a range. For general text use SInput.'
---

# InputNumber

## Overview

A numeric input field that only accepts numeric values, with increment/decrement controls, keyboard interaction, and min/max boundary handling. Use it for quantities, prices, ages, or any value that must stay numeric and within a range. For general text use `SInput`.

## Usage

<UsageCode component="input-number" />

## Features

- 📏 6 sizes: xs, sm, md, lg, xl, 2xl
- 🎚 Step buttons with press-and-hold acceleration (400ms → 60ms loop)
- ⌨️ Full keyboard support — Arrow keys, Page Up/Down, Home/End, Enter, wheel
- ⚖️ `min` / `max` clamping with disabled buttons at boundaries, `step`, `formatOptions` precision
- 🌐 Locale-aware formatting via `Intl.NumberFormat`
- 🧹 Clearable mode with an i18n `aria-label` clear button
- 📋 Native form submission via a proxied hidden input when `name` is set
- ♿ Full accessibility support — `aria-valuemin/max/now`, clear naming, axe-clean

## Demos

<PlaygroundGallery component="input-number" />

## API

<ComponentApi component="input-number" />

## Notes

### Architecture and benchmark differences

VeanUI splits the input-number into an Aria layer (`@vean/aria/input-number`) that owns state, number parsing/formatting, boundary logic, and form proxying, and a styled layer (`@vean/ui`) that owns variants and UnoCSS classes. The Aria `InputNumberCompact` composes `InputNumberRoot` / `InputNumberControl` / `InputNumberIncrement` / `InputNumberDecrement` / `InputNumberClear` and exposes `increment` / `decrement` / `clear` slots. This mirrors the Aria/styled split and differs from single-package libraries such as Ant Design, Element Plus, and Mantine.

| Capability                       | VeanUI | Ant Design `InputNumber` | Element Plus `input-number` | Mantine `NumberInput` |
| :------------------------------- | :----: | :----------------------: | :-------------------------: | :-------------------: |
| Aria/styled split                |   ✅   |            —             |              —              |           —           |
| Controlled / uncontrolled        |   ✅   |            ✅            |             ✅              |          ✅           |
| step / min / max / precision     |   ✅   |            ✅            |             ✅              |          ✅           |
| Keyboard Arrow/Page/Home/End     |   ✅   |            ✅            |             ✅              |          ✅           |
| Press-and-hold acceleration      |   ✅   |            ✅            |              —              |           —           |
| Boundary button disabling        |   ✅   |            —             |             ✅              |           —           |
| Clear button (i18n `aria-label`) |   ✅   |            —             |             ✅              |           —           |
| Locale-aware format (Intl)       |   ✅   |            —             |              —              |           —           |
| Size variants (xs…2xl)           |   ✅   |            —             |              —              |          ✅           |
| `center` layout                  |   ✅   |            ✅            |             ✅              |           —           |

### Cautions

- `formatter` / `parser` hooks, `controls` visibility toggle, and `compact` mode are not implemented; they are tracked as enhancement backlog.
- While a value is actively typed, the component accepts intermediate states and snaps back to a valid number on blur / Enter.
- The clear button only appears on hover or focus (desktop convention).

## FAQ

### How do I restrict the input to a numeric range?

Pass `min` and `max`. Values are clamped on change, and the increment/decrement buttons are disabled at the boundaries.

### How do I control the number of decimal places?

Control the number of decimal places via `formatOptions.maximumFractionDigits` (for example `{ maximumFractionDigits: 2 }`). Formatting and step calculation respect the configured precision.

### How does keyboard entry work?

Arrow Up/Down step by `step`; Page Up/Down step by `step * 10`; Home/End jump to `min`/`max`; Enter commits; the mouse wheel adjusts the value when hovered.

### How do I localize the displayed number?

The component uses `Intl.NumberFormat` with the active locale (and any `formatOptions`). Thousands separators and decimal marks follow the locale automatically.
