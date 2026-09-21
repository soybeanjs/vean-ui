# Textarea

Source URL: https://veanui.com/components/textarea
Markdown URL: https://veanui.com/components/textarea.md
Category: Forms
Description: A multi-line text input for longer free-form content, supporting auto-resizing, character counting, and clearable functionality. Use it for descriptions, comments, messages, or any content that spans multiple lines. For single-line input use SInput.

## Overview

A multi-line text input for longer free-form content, supporting auto-resizing, character counting, and clearable functionality. Use it for descriptions, comments, messages, or any content that spans multiple lines. For single-line input use `SInput`.

## Usage

Usage examples for textarea are rendered on the site.

## Features

- 📏 6 sizes: xs, sm, md, lg, xl, 2xl
- 📐 Autosize with `minRows` / `maxRows` bounds and overflow switching
- 🧹 Clearable mode with an i18n `aria-label` clear button
- 🔢 Character counter (`count / maxlength`) with and without `maxlength`
- 🔄 `resize` control: none / vertical / horizontal (ignored while autosize is active)
- 📋 Native form submission via a proxied hidden input when `name` is set
- 🧩 `clear` / `counter` / `footer` slots for per-part customization
- ♿ Full accessibility support — `aria-roledescription`, clear button naming, axe-clean

## Textarea component family

- **STextarea** - Base multi-line text area component
- **STextareaClear** - Clear button, shown on hover/focus when `clearable`

## Demos

Interactive demos for textarea are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (6): Textarea, TextareaClear, TextareaCompact, TextareaControl, TextareaCounter, TextareaRoot.

### Textarea

#### Props

Properties for the Textarea component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<TextareaUi>`; optional)
- `resize`: The resize of the textarea if autosize is true, the resize will be ignored (type `TextareaResize`; optional)
- `textareaRef`: The function to set the textarea element. (type `((el: HTMLTextAreaElement) => void)`; optional)
- `clearable`: Whether to show the clear trigger. (type `boolean`; default `false`; optional)
- `showCounter`: Whether to show the counter. (type `boolean`; default `false`; optional)
- `controlProps`: Properties forwarded to the control element. (type `TextareaControlProps`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `TextareaClearProps`; optional)
- `counterProps`: Properties forwarded to the counter element. (type `TextareaCounterProps`; optional)
- `defaultValue`: The default value of the textarea (type `string`; optional)
- `modelValue`: The controlled value of the textarea (type `string`; optional)
- `autosize`: When `true` or an options object, enables auto-resizing based on content (type `boolean | TextareaAutosizeOptions`; optional)
- `id`: Id of the textarea element (type `string`; optional)
- `autofocus`: When `true`, the textarea is auto-focused. (type `boolean`; optional)
- `disabled`: When `true`, prevents the user from interacting with the textarea. (type `boolean`; optional)
- `maxlength`: The maximum number of characters allowed in the textarea (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the textarea (type `number`; optional)
- `placeholder`: The placeholder of the textarea (type `string`; optional)
- `readonly`: When `true`, the textarea is read-only. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the Textarea component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the Textarea component.

- `clear`: Custom content for the clear slot. (type `((props: TextareaCompactSlotProps) => any) | undefined`)
- `counter`: Custom content for the counter slot. (type `((props: TextareaCompactSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: TextareaCompactSlotProps) => any) | undefined`)

### TextareaClear

#### Props

Properties for the TextareaClear component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the TextareaClear component.

- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### TextareaCompact

#### Props

Properties for the TextareaCompact component.

- `textareaRef`: The function to set the textarea element. (type `((el: HTMLTextAreaElement) => void)`; optional)
- `clearable`: Whether to show the clear trigger. (type `boolean`; default `false`; optional)
- `showCounter`: Whether to show the counter. (type `boolean`; default `false`; optional)
- `controlProps`: Properties forwarded to the control element. (type `TextareaControlProps`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `TextareaClearProps`; optional)
- `counterProps`: Properties forwarded to the counter element. (type `TextareaCounterProps`; optional)
- `defaultValue`: The default value of the textarea (type `string`; optional)
- `modelValue`: The controlled value of the textarea (type `string`; optional)
- `autosize`: When `true` or an options object, enables auto-resizing based on content (type `boolean | TextareaAutosizeOptions`; optional)
- `id`: Id of the textarea element (type `string`; optional)
- `autofocus`: When `true`, the textarea is auto-focused. (type `boolean`; optional)
- `disabled`: When `true`, prevents the user from interacting with the textarea. (type `boolean`; optional)
- `maxlength`: The maximum number of characters allowed in the textarea (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the textarea (type `number`; optional)
- `placeholder`: The placeholder of the textarea (type `string`; optional)
- `readonly`: When `true`, the textarea is read-only. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the TextareaCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `clear`: Emitted when the clear button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the TextareaCompact component.

- `clear`: Custom content for the clear slot. (type `((props: TextareaCompactSlotProps) => any) | undefined`)
- `counter`: Custom content for the counter slot. (type `((props: TextareaCompactSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: TextareaCompactSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the TextareaCompact component.

- `modelValue`: Current model value. (type `string`; optional)
- `clear`: Clear handler. (type `() => void`; required)
- `count`: Current character count. (type `number`; required)
- `maxlength`: Current maxlength. (type `number`; optional)

### TextareaControl

- No documented props, emits, slots, or slot props were available.

### TextareaCounter

- No documented props, emits, slots, or slot props were available.

### TextareaRoot

#### Props

Properties for the TextareaRoot component.

- `defaultValue`: The default value of the textarea (type `string`; optional)
- `modelValue`: The controlled value of the textarea (type `string`; optional)
- `autosize`: When `true` or an options object, enables auto-resizing based on content (type `boolean | TextareaAutosizeOptions`; optional)
- `id`: Id of the textarea element (type `string`; optional)
- `autofocus`: When `true`, the textarea is auto-focused. (type `boolean`; optional)
- `disabled`: When `true`, prevents the user from interacting with the textarea. (type `boolean`; optional)
- `maxlength`: The maximum number of characters allowed in the textarea (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the textarea (type `number`; optional)
- `placeholder`: The placeholder of the textarea (type `string`; optional)
- `readonly`: When `true`, the textarea is read-only. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the TextareaRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)

## Notes

### Architecture and benchmark differences

VeanUI splits the textarea into an Aria layer (`@vean/aria/textarea`) that owns state, autosize measurement, and form proxying, and a styled layer (`@vean/ui`) that owns variants and UnoCSS classes. The Aria `TextareaCompact` composes `TextareaRoot` / `TextareaControl` / `TextareaClear` / `TextareaCounter` and exposes `clear` / `counter` / `footer` slots. This mirrors the headless/styled split of Radix and differs from single-package libraries such as Ant Design, Element Plus, and Mantine.

| Capability                    | VeanUI | Ant Design `Input.TextArea` | Element Plus `Input` | Mantine `Textarea` |
| :---------------------------- | :----: | :-------------------------: | :------------------: | :----------------: |
| Aria/styled split             |   ✅   |              —              |          —           |         —          |
| Controlled / uncontrolled     |   ✅   |             ✅              |          ✅          |         ✅         |
| Autosize (min/max rows)       |   ✅   |             ✅              |          ✅          |         ✅         |
| Clear button (hover reveal)   |   ✅   |              —              |          ✅          |         —          |
| Character counter `count/max` |   ✅   |             ✅              |          ✅          |         —          |
| `resize` control              |   ✅   |              —              |          ✅          |         ✅         |
| Native form proxying          |   ✅   |              —              |          —           |         —          |
| `footer` slot                 |   ✅   |              —              |          —           |         —          |
| `error` state                 |   —    |              —              |          ✅          |         ✅         |

### Cautions

- Autosize relies on real layout (`scrollHeight` / `getComputedStyle`); behavior is verified through browser e2e tests, not happy-dom unit tests.
- `error`, `loading`, `showCount`, IME composition events, and `change` events are not implemented; they are tracked as enhancement backlog.
- The counter does not announce itself with `aria-live`; add an `aria-live` region via the `counter` slot if live announcements are required.

## FAQ

### How do I make the textarea grow with its content?

Pass `autosize` (boolean) or `autosizeOptions` with `minRows` / `maxRows`. The height adjusts on input and switches to `overflow-y: auto` at `maxRows`.

### How do I show a character counter?

Pass `showCounter` with `maxlength` to show `count / maxlength`, or without `maxlength` to show the raw count. Customize the presentation via the `counter` slot.

### How do I control resizing?

Use the `resize` prop (`none` / `vertical` / `horizontal`). When `autosize` is active, `resize` is ignored because height is managed automatically.

### How does the textarea submit its value in a native form?

Pass `name` — the component renders a visually hidden proxy input carrying the current value, so native form submission works without extra wiring.
