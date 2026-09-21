# Separator

Source URL: https://veanui.com/components/separator
Markdown URL: https://veanui.com/components/separator.md
Category: Layout
Description: The SSeparator component visually and semantically separates content sections. It renders a horizontal or vertical line, optionally with a label centered (or aligned) along it. Use it to divide related content blocks, group menu items, or structure form sections.

## Overview

The `SSeparator` component visually and semantically separates content sections. It renders a horizontal or vertical line, optionally with a label centered (or aligned) along it. Use it to divide related content blocks, group menu items, or structure form sections.

For layout-level spacing between sections, prefer the [`SCard`](/components/card) or UnoCSS spacing utilities; use `SSeparator` when a visible dividing line aids comprehension.

## Usage

Usage examples for separator are rendered on the site.

## Features

- 📏 **Orientation** — Switch between `horizontal` and `vertical` layouts.
- 🏷️ **Label support** — Render text or custom content inside the separator via the `label` prop or default slot.
- ↔️ **Alignment** — Position the label at `start`, `center`, or `end`.
- 〰️ **Border styles** — Choose `solid`, `dashed`, or `dotted` line styles.
- 📐 **Size scaling** — Six sizes (`xs`–`2xl`) control label typography and spacing.
- ♿ **Accessibility** — `role="separator"` with `aria-orientation`; `decorative` prop removes the element from the accessibility tree for purely visual dividers.
- 🎨 **Per-slot overrides** — `ui` prop and `class` allow fine-grained styling of `root` and `label` slots.
- 🌐 **RTL aware** — Label positioning and translation automatically adjust for right-to-left layouts.

## Demos

Interactive demos for separator are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): Separator, SeparatorCompact, SeparatorLabel, SeparatorRoot.

### Separator

#### Props

Properties for the Separator component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<SeparatorUi>`; optional)
- `align`: Align. (type `Align`; optional)
- `border`: Border. (type `SeparatorBorder`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `labelProps`: Properties forwarded to the label element. (type `SeparatorLabelProps`; optional)
- `orientation`: Orientation of the component. Either `vertical` or `horizontal`. Defaults to `horizontal`. (type `DataOrientation`; optional)
- `decorative`: Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes are updated so that that the rendered element is removed from the accessibility tree. (type `boolean`; optional)

### SeparatorCompact

#### Props

Properties for the SeparatorCompact component.

- `label`: Label text rendered by the component. (type `string`; optional)
- `labelProps`: Properties forwarded to the label element. (type `SeparatorLabelProps`; optional)
- `orientation`: Orientation of the component. Either `vertical` or `horizontal`. Defaults to `horizontal`. (type `DataOrientation`; optional)
- `decorative`: Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes are updated so that that the rendered element is removed from the accessibility tree. (type `boolean`; optional)

#### Slots

Slots for the SeparatorCompact component.

- `label`: Custom content for the label slot. (type `(() => any) | undefined`)

### SeparatorLabel

- No documented props, emits, slots, or slot props were available.

### SeparatorRoot

#### Props

Properties for the SeparatorRoot component.

- `orientation`: Orientation of the component. Either `vertical` or `horizontal`. Defaults to `horizontal`. (type `DataOrientation`; optional)
- `decorative`: Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes are updated so that that the rendered element is removed from the accessibility tree. (type `boolean`; optional)

## Notes

### Architecture and benchmark differences

VeanUI splits `Separator` into an Aria layer (`@vean/aria/separator`) that owns `SeparatorRoot` (role/aria/orientation), `SeparatorLabel`, and `SeparatorCompact` (composition + label visibility logic), and a styled layer (`@vean/ui`) that owns the `scv()` variant recipe (size/orientation/align/border) and class injection via `provideSeparatorUi`. This follows the shadcn/ui headless/styled separation.

| Aspect       | VeanUI                                                                    | Ant Design `Divider` | Element Plus `ElDivider` | MUI `Divider`    | Mantine `Divider` | shadcn/ui `Separator` |
| :----------- | :------------------------------------------------------------------------ | :------------------- | :----------------------- | :--------------- | :---------------- | :-------------------- |
| Architecture | Aria + styled split, `SeparatorUiSlot` (root/label) + Compact aggregation | single component     | single component         | single component | single component  | Aria + styled         |
| Label        | `label` prop + default slot; `align` (start/center/end)                   | `orientation` prop   | `content-position`       | —                | `labelPosition`   | —                     |
| Border style | `border` (solid/dashed/dotted)                                            | `dashed` prop        | `border-style` prop      | —                | `variant`         | —                     |
| Size scaling | `size` (xs–2xl) controls label typography + spacing                       | —                    | —                        | —                | `size`            | —                     |
| Decorative   | `decorative` → `role="none"`                                              | —                    | —                        | —                | —                 | `decorative`          |
| RTL          | `rtl:translate-x` + logical `start-*` positioning                         | —                    | —                        | —                | —                 | —                     |

### Runtime cautions

- **Vertical separators**: labels are intentionally hidden when `orientation="vertical"` because the label cannot be meaningfully positioned along a vertical line. If you need a label next to a vertical separator, place it outside the component.
- **Decorative mode**: when `decorative` is `true`, the element receives `role="none"` and `aria-orientation` is omitted so it is removed from the accessibility tree. Use this for purely visual dividers that screen readers should skip.
- **Full width / height**: horizontal separators default to `w-full` and vertical separators to `h-full`. Wrap vertical separators in a flex container with a fixed height for correct rendering.

### FAQ

**When should I use `decorative`?**
Set `decorative` when the separator is purely visual and does not represent a semantic content boundary. This sets `role="none"`, hiding it from screen readers. For content section dividers that convey meaning, leave `decorative` unset (defaults to `role="separator"`).

**Why is my label not showing on a vertical separator?**
Labels are intentionally suppressed for vertical orientations. Use a horizontal separator for labeled dividers, or place the label text outside the component.

**How do I customize the label element's attributes?**
Pass `labelProps` — it is forwarded directly to the `SeparatorLabel` element. For class overrides, use the `ui.label` slot instead.

**How do I make the separator full-width?**
Horizontal separators are `w-full` by default. For vertical separators, ensure the parent container has a defined height; the separator uses `h-full`.
