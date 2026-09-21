---
head:
  title: Label
  description: 'The SLabel component renders a native <label> element that provides an accessible caption for form controls. Use the for prop to associate the label with an input by its id — clicking the label then focuses the associated control. The component prevents text selection on double-click for a cleaner UX and supports size scaling via the design system.'
---

# Label

## Overview

The `SLabel` component renders a native `<label>` element that provides an accessible caption for form controls. Use the `for` prop to associate the label with an input by its `id` — clicking the label then focuses the associated control. The component prevents text selection on double-click for a cleaner UX and supports size scaling via the design system.

## Usage

<UsageCode component="label" />

## Features

- 🏷️ **Native `<label>`** — Uses the semantically correct HTML element for form labels.
- 🔗 **`for` association** — Pass `for="input-id"` to link the label to a form control; clicking the label focuses it.
- 📐 **Size scaling** — Six sizes (`xs`–`2xl`) control label typography.
- 🖱️ **Selection prevention** — Double-clicking the label won't select its text, avoiding accidental text selection when interacting with the associated input.
- ♿ **Accessible** — Native `<label>` is inherently accessible; `peer-disabled` styles dim the label when the associated control is disabled.
- 🎨 **Class override** — `class` prop for custom styling on top of variant defaults.

## Demos

<PlaygroundGallery component="label" />

## API

<ComponentApi component="label" />

## Notes

### Architecture and benchmark differences

VeanUI splits `Label` into an Aria layer (`@vean/aria/label`) that owns the `<label>` element, `for` association, and double-click text-selection prevention, and a styled layer (`@vean/ui`) that owns the `cv()` variant recipe (size). This follows the shadcn/ui headless/styled separation, which itself derives from Radix UI's Label primitive.

| Aspect               | VeanUI                        | shadcn/ui `Label` | Ant Design `Form.Label` | Element Plus `FormLabel` | MUI `InputLabel` |
| :------------------- | :---------------------------- | :---------------- | :---------------------- | :----------------------- | :--------------- |
| Architecture         | Aria + styled split           | Aria + styled     | form-coupled            | form-coupled             | styled only      |
| Native `<label>`     | ✅                            | ✅                | ✅ (within Form)        | ✅ (within Form)         | ✅               |
| `for` association    | ✅ standalone                 | ✅ standalone     | auto via Form           | auto via Form            | auto via Form    |
| Size scaling         | `xs`–`2xl`                    | —                 | —                       | —                        | `size`           |
| Selection prevention | ✅ `mousedown` + `detail > 1` | ✅                | —                       | —                        | —                |
| Disabled peer style  | `peer-disabled:opacity-50`    | ✅                | —                       | —                        | —                |

### Runtime cautions

- **Standalone usage**: Unlike Ant Design and Element Plus where labels are coupled to `<Form>`, `SLabel` works standalone — pass `for="input-id"` to associate it with any input. This matches the shadcn/ui pattern.
- **Disabled state**: The label uses `peer-disabled:opacity-50` to visually dim when the sibling input is disabled. For this to work, the input must be a sibling element with the `peer` class and a `disabled` attribute.
- **Double-click**: The `mousedown` handler calls `event.preventDefault()` when `event.detail > 1` (double-click). This prevents text selection but does not interfere with single clicks or label-to-input focus behavior.

### FAQ

**How do I associate a label with an input?**
Pass the input's `id` to the label's `for` prop: `<SLabel for="email">Email</SLabel>` then `<SInput id="email" />`. Clicking the label will focus the input.

**Can I use `SLabel` inside a form without `for`?**
Yes. If you wrap the input inside the label (`<SLabel>Email <SInput /></SLabel>`), the browser auto-associates them. The `for` prop is only needed when the label and input are siblings.

**Why does the label dim when the input is disabled?**
The base class includes `peer-disabled:opacity-50`. When the sibling input (with `peer` class) is disabled, the label opacity drops to 50%. This is a UX convention from shadcn/ui.

**How do I prevent the double-click selection prevention?**
The selection prevention is built into the Aria layer. If you need standard text selection behavior, use the Aria `Label` directly and omit the `@mousedown` handler, or override it in your own wrapper.
