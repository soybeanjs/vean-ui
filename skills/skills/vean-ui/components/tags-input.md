# Tags Input

Source URL: https://veanui.com/components/tags-input
Markdown URL: https://veanui.com/components/tags-input.md
Category: Forms
Description: A composable multi-value input for adding, displaying, and removing tags. Supports controlled/uncontrolled string[] values, tag creation via Enter/Tab/blur/delimiter typing/paste, full keyboard selection and removal (with RTL reversal), max/duplicate constraints, and hidden form-input serialization. Use it for keyword lists, email recipients, or any small-token collection that needs fast keyboard workflows instead of a plain text input.

## Overview

A composable multi-value input for adding, displaying, and removing tags. Supports controlled/uncontrolled `string[]` values, tag creation via `Enter`/`Tab`/blur/delimiter typing/paste, full keyboard selection and removal (with RTL reversal), `max`/`duplicate` constraints, and hidden form-input serialization. Use it for keyword lists, email recipients, or any small-token collection that needs fast keyboard workflows instead of a plain text input.

## Usage

Usage examples for tags-input are rendered on the site.

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

Interactive demos for tags-input are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (8): TagsInput, TagsInputClear, TagsInputCompact, TagsInputControl, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot.

### TagsInput

#### Props

Properties for the TagsInput component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<TagsInputUi>`; optional)
- `clearable`: Whether to render the clear trigger. (type `boolean`; optional)
- `controlProps`: Props forwarded to the input element. (type `TagsInputControlProps`; optional)
- `clearProps`: Props forwarded to the clear element. (type `TagsInputClearProps`; optional)
- `itemProps`: Props forwarded to the item element. (type `TagsInputItemProps`; optional)
- `itemTextProps`: Props forwarded to the item text element. (type `TagsInputItemTextProps`; optional)
- `itemDeleteProps`: Props forwarded to the item delete element. (type `TagsInputItemDeleteProps`; optional)
- `dir`: The reading direction of the tags input. (type `Direction`; optional)
- `modelValue`: The controlled value of the tags input. (type `string[]`; optional)
- `defaultValue`: The uncontrolled default value of the tags input. (type `string[]`; optional)
- `addOnPaste`: Whether to add tags on paste. (type `boolean`; optional)
- `addOnTab`: Whether to add tags on tab. (type `boolean`; optional)
- `addOnBlur`: Whether to add tags on blur. (type `boolean`; optional)
- `duplicate`: Whether to allow duplicated tags. (type `boolean`; optional)
- `delimiter`: The delimiter used to add tags. (type `string | RegExp`; optional)
- `max`: Maximum number of tags. Set to 0 for unlimited. (type `number`; optional)
- `displayValue`: Display the value of the tag. Useful when you want to apply modifications to the value like adding a suffix (type `((value: string) => string)`; default `"(value: string) => value"`; optional)
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
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the TagsInput component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string[]]`; parameters `value: string[]`)
- `invalid`: Emitted when invalid occurs. (type `[value: string]`; parameters `value: string`)
- `addTag`: Emitted when add tag occurs. (type `[value: string]`; parameters `value: string`)
- `removeTag`: Emitted when remove tag occurs. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the TagsInput component.

- `item`: Custom item content or full item replacement. (type `((props: TagsInputCompactSlotProps) => any) | undefined`)

### TagsInputClear

#### Props

Properties for the TagsInputClear component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TagsInputCompact

#### Props

Properties for the TagsInputCompact component.

- `clearable`: Whether to render the clear trigger. (type `boolean`; optional)
- `controlProps`: Props forwarded to the input element. (type `TagsInputControlProps`; optional)
- `clearProps`: Props forwarded to the clear element. (type `TagsInputClearProps`; optional)
- `itemProps`: Props forwarded to the item element. (type `TagsInputItemProps`; optional)
- `itemTextProps`: Props forwarded to the item text element. (type `TagsInputItemTextProps`; optional)
- `itemDeleteProps`: Props forwarded to the item delete element. (type `TagsInputItemDeleteProps`; optional)
- `dir`: The reading direction of the tags input. (type `Direction`; optional)
- `modelValue`: The controlled value of the tags input. (type `string[]`; optional)
- `defaultValue`: The uncontrolled default value of the tags input. (type `string[]`; optional)
- `addOnPaste`: Whether to add tags on paste. (type `boolean`; optional)
- `addOnTab`: Whether to add tags on tab. (type `boolean`; optional)
- `addOnBlur`: Whether to add tags on blur. (type `boolean`; optional)
- `duplicate`: Whether to allow duplicated tags. (type `boolean`; optional)
- `delimiter`: The delimiter used to add tags. (type `string | RegExp`; optional)
- `max`: Maximum number of tags. Set to 0 for unlimited. (type `number`; optional)
- `displayValue`: Display the value of the tag. Useful when you want to apply modifications to the value like adding a suffix (type `((value: string) => string)`; default `"(value: string) => value"`; optional)
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
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the TagsInputCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string[]]`; parameters `value: string[]`)
- `invalid`: Emitted when invalid occurs. (type `[value: string]`; parameters `value: string`)
- `addTag`: Emitted when add tag occurs. (type `[value: string]`; parameters `value: string`)
- `removeTag`: Emitted when remove tag occurs. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the TagsInputCompact component.

- `item`: Custom item content or full item replacement. (type `((props: TagsInputCompactSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for item-related compact slots.

- `value`: Value associated with the current item. (type `string`; required)
- `index`: Current item index. (type `number`; required)
- `displayedValue`: Current item display value. (type `string`; required)
- `onDelete`: Delete handler for the current item. (type `() => void`; required)
- `onClear`: Clear handler for the current item. (type `() => void`; required)

### TagsInputControl

- No documented props, emits, slots, or slot props were available.

### TagsInputItem

#### Props

Properties for the TagsInputItem component.

- `value`: Value associated with the tag. (type `string`; required)
- `disabled`: Whether to disable the tag item. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TagsInputItemDelete

#### Props

Properties for the TagsInputItemDelete component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TagsInputItemText

#### Props

Properties for the TagsInputItemText component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TagsInputRoot

#### Props

Properties for the TagsInputRoot component.

- `dir`: The reading direction of the tags input. (type `Direction`; optional)
- `modelValue`: The controlled value of the tags input. (type `string[]`; optional)
- `defaultValue`: The uncontrolled default value of the tags input. (type `string[]`; optional)
- `addOnPaste`: Whether to add tags on paste. (type `boolean`; optional)
- `addOnTab`: Whether to add tags on tab. (type `boolean`; optional)
- `addOnBlur`: Whether to add tags on blur. (type `boolean`; optional)
- `duplicate`: Whether to allow duplicated tags. (type `boolean`; optional)
- `delimiter`: The delimiter used to add tags. (type `string | RegExp`; optional)
- `max`: Maximum number of tags. Set to 0 for unlimited. (type `number`; optional)
- `displayValue`: Display the value of the tag. Useful when you want to apply modifications to the value like adding a suffix (type `((value: string) => string)`; default `"(value: string) => value"`; optional)
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
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the TagsInputRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string[]]`; parameters `value: string[]`)
- `invalid`: Emitted when invalid occurs. (type `[value: string]`; parameters `value: string`)
- `addTag`: Emitted when add tag occurs. (type `[value: string]`; parameters `value: string`)
- `removeTag`: Emitted when remove tag occurs. (type `[value: string]`; parameters `value: string`)

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
