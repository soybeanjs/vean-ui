---
head:
  title: Textarea
  description: 'A multi-line text input for longer free-form content, supporting auto-resizing, character counting, and clearable functionality. Use it for descriptions, comments, messages, or any content that spans multiple lines. For single-line input use SInput.'
---

# Textarea

## Overview

A multi-line text input for longer free-form content, supporting auto-resizing, character counting, and clearable functionality. Use it for descriptions, comments, messages, or any content that spans multiple lines. For single-line input use `SInput`.

## Usage

<UsageCode component="textarea" />

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

<PlaygroundGallery component="textarea" />

## API

<ComponentApi component="textarea" />

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
