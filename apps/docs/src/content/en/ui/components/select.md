---
head:
  title: Select
  description: 'Displays a list of options for the user to pick from, triggered by a button. The trigger renders the selected value (or placeholder), and the popup supports keyboard navigation, typeahead, grouping, multiple selection, and clearable mode. Use it to pick one or more values from a bounded set; for free-text search over a list, use SCombobox; for cascading hierarchical data, use SCascader.'
---

# Select

## Overview

Displays a list of options for the user to pick from, triggered by a button. The trigger renders the selected value (or placeholder), and the popup supports keyboard navigation, typeahead, grouping, multiple selection, and clearable mode. Use it to pick one or more values from a bounded set; for free-text search over a list, use `SCombobox`; for cascading hierarchical data, use `SCascader`.

## Usage

<UsageCode component="select" />

## Features

- 📊 Data-driven `SelectCompact` API — pass `items` (options use `label` / `value` fields)
- ⌨️ Full combobox interaction — pointer/keyboard open, Arrow/Home/End navigation, typeahead search, Enter/Space select, Escape close
- 🗂 Grouping with group labels, separators, and item indicators
- ✅ `multiple` selection with accumulation and deduplication
- 🧹 Clearable mode — trigger hover-reveal clear, plus `selectionBehavior` for whether re-selecting toggles or resets
- 📍 Item-aligned positioning (`position="item-aligned"`)
- 📋 Native form submission via a hidden proxy `<select>` (`SelectBubbleSelect`)
- 📌 `top` / `bottom` slots for fixed header and footer content inside the popup
- ♿ Full accessibility support — `role="combobox"` / `listbox` / `option`, axe-clean

## Demos

<PlaygroundGallery component="select" />

## API

<ComponentApi component="select" />

## Notes

### Architecture and benchmark differences

VeanUI builds select on a full ComboBox base: `SelectRoot` → `SelectTrigger` (`role="combobox"`) → `SelectValue` (collection label lookup) → `SelectContentImpl` (DismissableLayer + FocusScope + typeahead + keyboard nav) → `SelectItem`, with `SelectBubbleSelect` proxying native form submission. The `scv()` recipe `selectVariants` declares 16 slots and 7 size variants. This mirrors reka-ui / shadcn select semantics with a data-driven `SelectCompact` aggregation as the VeanUI differentiator.

| Capability                           | VeanUI | reka-ui `Select` | shadcn `Select` | Element Plus `el-select` |
| :----------------------------------- | :----: | :--------------: | :-------------: | :----------------------: |
| Aria/styled split                    |   ✅   |        ✅        |        —        |            —             |
| combobox role + keyboard nav         |   ✅   |        ✅        |       ✅        |            ✅            |
| Typeahead search                     |   ✅   |        ✅        |        —        |            ✅            |
| Controlled / uncontrolled + multiple |   ✅   |        ✅        |        —        |            ✅            |
| Grouping + group labels              |   ✅   |        ✅        |       ✅        |            ✅            |
| Form proxying (BubbleSelect)         |   ✅   |        ✅        |        —        |            ✅            |
| Item-aligned positioning             |   ✅   |        ✅        |        —        |            —             |
| Data-driven Compact API              |   ✅   |        —         |        —        |            —             |
| Virtual scrolling                    |   —    |        —         |        —        |            ✅            |
| axe-clean (open state)               |   ✅   |        —         |       ✅        |            —             |

### Cautions

- Before the popup first opens, label lookup relies on the data-driven `fallbackLabel` computed from `items` — pass `items` (not just composition children) so the trigger text renders for `defaultValue` / controlled `modelValue`.
- `virtual` scrolling is not implemented; very large option lists may need custom virtualization.
- `multiple` with `clearable` uses `selectionBehavior` to decide whether clearing toggles off or resets the selection.

## FAQ

### How do I show the selected label before the popup is opened?

Pass `items` to `SSelect`. `SelectCompact` resolves the label from `items` via `fallbackLabel`, so `defaultValue` / controlled `modelValue` render on the trigger immediately.

### How do I enable multiple selection?

Pass `multiple`. Selections accumulate and deduplicate; `modelValue` becomes an array.

### How do I group options?

Pass grouped `items` — a group entry carries a `label` and a nested `items` array. Group headers render via the `group-label` slot, and separators via `separator`.

### How does the select submit in a native form?

The component renders a hidden native `<select>` (`SelectBubbleSelect`) mirroring the current value, so native form submission and browser autofill work.

### How do I make the trigger show an arrow or custom content?

Use the `trigger-icon` / `value` slots or the `showArrow`-equivalent slot surface; all 16 recipe slots are forwarded by `SSelect`.

### How do I clear the selected value from the trigger?

`clearable` defaults to `true`. With a value selected, hover or focus the trigger to reveal an ✕ button; clicking it resets `modelValue` to `undefined` (or `[]` when `multiple`). Pass `:clearable="false"` to hide it. Re-clicking the selected option still follows `selectionBehavior`.

### How do I add fixed header or footer content inside the popup?

Use the `top` and `bottom` slots. `top` renders above the scrollable list and `bottom` below it; both stay fixed while only the middle option list scrolls.
