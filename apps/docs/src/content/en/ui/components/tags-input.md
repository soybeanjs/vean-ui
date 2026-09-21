---
head:
  title: Tags Input
  description: 'A composable multi-value input for adding, displaying, and removing tags. Supports controlled/uncontrolled string[] values, tag creation via Enter/Tab/blur/delimiter typing/paste, full keyboard selection and removal (with RTL reversal), max/duplicate constraints, and hidden form-input serialization. Use it for keyword lists, email recipients, or any small-token collection that needs fast keyboard workflows instead of a plain text input.'
---

# Tags Input

## Overview

A composable multi-value input for adding, displaying, and removing tags. Supports controlled/uncontrolled `string[]` values, tag creation via `Enter`/`Tab`/blur/delimiter typing/paste, full keyboard selection and removal (with RTL reversal), `max`/`duplicate` constraints, and hidden form-input serialization. Use it for keyword lists, email recipients, or any small-token collection that needs fast keyboard workflows instead of a plain text input.

## Usage

<UsageCode component="tags-input" />

## Features

- 🏷 Tag model — controlled/uncontrolled `string[]` via `useControllableState`; add/remove/clear events plus per-action `addTag`/`removeTag` emits
- ⌨️ Full keyboard support — `ArrowLeft`/`ArrowRight` select the adjacent tag (logical direction, reversed in RTL), `Backspace`/`Delete` remove the selected tag, `Home`/`End` jump to the first/last tag, typing deselects
- ✂️ Delimiter & paste — commit the typed value when a delimiter (string or `RegExp`) is entered, or split pasted text (`addOnPaste`)
- ⏎ Commit triggers — `Enter` always commits; `Tab` and blur commit only with `addOnTab`/`addOnBlur`
- 🚦 Constraints — `max` caps the total count, `duplicate` allows repeated values, `displayValue` rewrites the label; rejected values emit `invalid`
- 🧩 Composable parts — `Root`/`Control`/`Item`/`ItemText`/`ItemDelete`/`Clear` with `*Props` passthrough on the compact and a fully replaceable `item` slot
- 📋 Form integration — `name`/`required`/`disabled` serialize through a visually hidden input; `aria-controls` links the input to the tag list container
- 🔤 Localized UI — default `aria-label`s come from locale messages and can be overridden per part
- 🚫 Disabled / readonly — `disabled` blocks all interaction; `readonly` blocks typing but keeps tag removal and clearing available

## Component family

- `STagsInput` — the styled wrapper that forwards props to the Aria compact and injects `tagsInputVariants` classes (6 slots: root/item/itemText/itemDelete/control/clear)
- `TagsInputCompact` (Aria) — data-driven composition of `TagsInputRoot` + one `TagsInputItem` per value (default item text/delete) + `Control` + `Clear` (gated by `clearable`); import from `@vean/aria/tags-input` for unstyled usage
- `TagsInputRoot` (Aria) — state owner: `useControllableState` for the value array, collection registration, keydown/removal/clear logic, and the visually hidden form input
- `TagsInputControl` (Aria) — the committed input: delimiter typing, paste splitting, `Enter`/`Tab`/blur commit, composition guard
- `TagsInputItem` / `TagsInputItemText` / `TagsInputItemDelete` (Aria) — a registered collection item with its label span and keyboard-reachable delete button
- `TagsInputClear` (Aria) — the clear-all button, hidden until the root has a value (styling) and gated by `clearable` (rendering)

## Demos

<PlaygroundGallery component="tags-input" />

## API

<ComponentApi component="tags-input" />

## Notes

### Architecture and benchmark differences

`TagsInputRoot` owns the value via `useControllableState` and the collection registry (each `Item` registers through `useCollectionItem`). `TagsInputControl` only commits values: it watches delimiter/paste/Enter/Tab/blur, trims and validates through the root's `onAddValue`, and reports rejections via the `invalid` event. Keyboard selection state (`selectedElement`) lives on the root so the control's keydown handler can move selection with arrow keys (logical direction, RTL-aware) and remove tags with `Backspace`/`Delete`/`Home`/`End`. The compact iterates the value array with an `index-value` key so duplicated values stay stable without in-place value patching. Most benchmark libraries expose tags as a mode of a single select; the Aria/styled split, per-part `*Props` passthrough, slot-driven item rendering, and the `invalid`/`addTag`/`removeTag` event surface are the differentiators.

| Capability                       | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :------------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split                |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled        |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| Enter / delimiter / paste add    |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| Keyboard tag selection + removal |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| RTL direction reversal           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `max` / `duplicate` constraints  |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `RegExp` delimiter               |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Per-part `*Props` passthrough    |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Custom item slot                 |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   ✅   |
| Form hidden-input serialization  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Localized `aria-label`s          |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### Cautions

- The value is always a `string[]`; duplicates are rejected unless `duplicate` is set. `displayValue` changes the label only — the stored value stays the raw string.
- `max={0}` means unlimited; any positive number caps the count and rejected additions emit `invalid` with the attempted value.
- `addOnBlur` commits pending text on blur, but a blur that lands on a tag's delete/clear button inside the tag list is skipped (guarded via `aria-controls`).
- `addOnTab` prevents the default tab-out and commits instead; if you need to leave the field, disable it or commit on blur.
- The compact renders the clear trigger whenever `clearable` is not `false`; the default styles hide it until the root has a value.
- In controlled mode (`modelValue` bound), the parent must update the bound array — the component only emits `update:modelValue`.
- `readonly` keeps the input read-only but still allows tag removal and clearing; use `disabled` to block all interaction.
- The input's `aria-controls` points at the derived tag-list container id (`{id}-tags-list`); pass an `id` to enable the blur guard and form-label association.

## FAQ

### How do I add tags on Enter only?

That's the default — type a value and press `Enter`. `Tab`/blur commit only when `addOnTab`/`addOnBlur` are enabled.

### How do I let users paste multiple tags at once?

Set `addOnPaste` and keep the default `delimiter=","` — pasting `"a,b,c"` creates three tags. Use a `RegExp` delimiter for flexible splits, e.g. `:delimiter="/[,，]/"`.

### How do I prevent duplicate tags?

Duplicates are rejected by default and emit `invalid` with the rejected value. Pass `duplicate` to allow repeats (the compact keys each item by its position so repeats stay stable).

### How does the value reach a form submission?

With `name` set, the values serialize into a visually hidden input (one per tag). Combined with `required`, an empty tag list marks the control invalid.

### Why did my controlled value not update?

In controlled mode the component only emits `update:modelValue`; you must rebind it (e.g. `v-model`) so the prop changes, otherwise the UI stays on the previous array.
