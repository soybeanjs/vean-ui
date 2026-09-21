# InputNumber

Source URL: https://veanui.com/components/input-number
Markdown URL: https://veanui.com/components/input-number.md
Category: Forms
Description: A numeric input field that only accepts numeric values, with increment/decrement controls, keyboard interaction, and min/max boundary handling. Use it for quantities, prices, ages, or any value that must stay numeric and within a range. For general text use SInput.

## Overview

A numeric input field that only accepts numeric values, with increment/decrement controls, keyboard interaction, and min/max boundary handling. Use it for quantities, prices, ages, or any value that must stay numeric and within a range. For general text use `SInput`.

## Usage

Usage examples for input-number are rendered on the site.

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

Interactive demos for input-number are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): InputNumber, InputNumberClear, InputNumberCompact, InputNumberControl, InputNumberDecrement, InputNumberIncrement, InputNumberRoot.

### InputNumber

#### Props

Properties for the InputNumber component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<InputNumberUi>`; optional)
- `center`: Whether to center the input. (type `boolean`; default `false`; optional)
- `clearable`: Whether to show the clear trigger. (type `boolean`; default `false`; optional)
- `inputRef`: The function to set the input element. (type `((el: HTMLInputElement) => void)`; optional)
- `controlProps`: Properties forwarded to the control element. (type `InputNumberControlProps`; optional)
- `incrementProps`: Properties forwarded to the increment element. (type `InputNumberIncrementProps`; optional)
- `decrementProps`: Properties forwarded to the decrement element. (type `InputNumberDecrementProps`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `ButtonProps`; optional)
- `defaultValue`: The default value of the input (type `number`; optional)
- `modelValue`: The controlled value of the input (type `number | null`; optional)
- `min`: The smallest value allowed for the input. (type `number`; optional)
- `max`: The largest value allowed for the input. (type `number`; optional)
- `step`: The amount that the input value changes with each increment or decrement "tick". (type `number`; optional)
- `stepSnapping`: When `false`, prevents the value from snapping to the nearest increment of the step value (type `boolean`; optional)
- `focusOnChange`: When `true`, the input will be focused when the value changes. (type `boolean`; optional)
- `formatOptions`: Formatting options for the value displayed in the number field. This also affects what characters are allowed to be typed by the user. (type `Intl.NumberFormatOptions`; optional)
- `locale`: The locale to use for formatting dates (type `string`; optional)
- `disableWheelChange`: When `true`, prevents the value from changing on wheel scroll. (type `boolean`; optional)
- `invertWheelChange`: When `true`, inverts the direction of the wheel change. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element. (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the InputNumber component.

- `update:modelValue`: Emitted when the model value changes. (type `[val: number | null]`; parameters `val: number | null`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the InputNumber component.

- `leading`: Custom content for the leading slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `clear`: Custom content for the clear slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `decrement`: Custom content for the decrement slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `increment`: Custom content for the increment slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)

### InputNumberClear

#### Props

Properties for the InputNumberClear component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the InputNumberClear component.

- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### InputNumberCompact

#### Props

Properties for the InputNumberCompact component.

- `clearable`: Whether to show the clear trigger. (type `boolean`; default `false`; optional)
- `inputRef`: The function to set the input element. (type `((el: HTMLInputElement) => void)`; optional)
- `controlProps`: Properties forwarded to the control element. (type `InputNumberControlProps`; optional)
- `incrementProps`: Properties forwarded to the increment element. (type `InputNumberIncrementProps`; optional)
- `decrementProps`: Properties forwarded to the decrement element. (type `InputNumberDecrementProps`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `ButtonProps`; optional)
- `defaultValue`: The default value of the input (type `number`; optional)
- `modelValue`: The controlled value of the input (type `number | null`; optional)
- `min`: The smallest value allowed for the input. (type `number`; optional)
- `max`: The largest value allowed for the input. (type `number`; optional)
- `step`: The amount that the input value changes with each increment or decrement "tick". (type `number`; optional)
- `stepSnapping`: When `false`, prevents the value from snapping to the nearest increment of the step value (type `boolean`; optional)
- `focusOnChange`: When `true`, the input will be focused when the value changes. (type `boolean`; optional)
- `formatOptions`: Formatting options for the value displayed in the number field. This also affects what characters are allowed to be typed by the user. (type `Intl.NumberFormatOptions`; optional)
- `locale`: The locale to use for formatting dates (type `string`; optional)
- `disableWheelChange`: When `true`, prevents the value from changing on wheel scroll. (type `boolean`; optional)
- `invertWheelChange`: When `true`, inverts the direction of the wheel change. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element. (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the InputNumberCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[val: number | null]`; parameters `val: number | null`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the InputNumberCompact component.

- `leading`: Custom content for the leading slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `clear`: Custom content for the clear slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `decrement`: Custom content for the decrement slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)
- `increment`: Custom content for the increment slot. (type `((props: InputNumberCompactSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the InputNumberCompact component.

- `modelValue`: Current model value. (type `number | null`; optional)
- `clear`: Clear handler. (type `() => void`; required)

### InputNumberControl

- No documented props, emits, slots, or slot props were available.

### InputNumberDecrement

#### Props

Properties for the InputNumberDecrement component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### InputNumberIncrement

#### Props

Properties for the InputNumberIncrement component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### InputNumberRoot

#### Props

Properties for the InputNumberRoot component.

- `defaultValue`: The default value of the input (type `number`; optional)
- `modelValue`: The controlled value of the input (type `number | null`; optional)
- `min`: The smallest value allowed for the input. (type `number`; optional)
- `max`: The largest value allowed for the input. (type `number`; optional)
- `step`: The amount that the input value changes with each increment or decrement "tick". (type `number`; optional)
- `stepSnapping`: When `false`, prevents the value from snapping to the nearest increment of the step value (type `boolean`; optional)
- `focusOnChange`: When `true`, the input will be focused when the value changes. (type `boolean`; optional)
- `formatOptions`: Formatting options for the value displayed in the number field. This also affects what characters are allowed to be typed by the user. (type `Intl.NumberFormatOptions`; optional)
- `locale`: The locale to use for formatting dates (type `string`; optional)
- `disableWheelChange`: When `true`, prevents the value from changing on wheel scroll. (type `boolean`; optional)
- `invertWheelChange`: When `true`, inverts the direction of the wheel change. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element. (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the InputNumberRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[val: number | null]`; parameters `val: number | null`)

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
