# Command

Source URL: https://veanui.com/components/command
Markdown URL: https://veanui.com/components/command.md
Category: Navigation
Description: Fast, composable, command menu for Vue. SCommand is a searchable command palette built on the Aria listbox primitives with Fuse fuzzy matching. It delegates filtering, grouped item aggregation, and default item composition to the Aria CommandCompact; the UI wrapper only injects styles.

## Overview

Fast, composable, command menu for Vue. `SCommand` is a searchable command palette built on the Aria listbox primitives with Fuse fuzzy matching. It delegates filtering, grouped item aggregation, and default item composition to the Aria `CommandCompact`; the UI wrapper only injects styles.

Use a command for a ⌘K-style palette, searchable menus, or inline typeahead. For a plain action menu use `dropdown-menu`; for a compact single-select list use `select`.

## Usage

Usage examples for command are rendered on the site.

> `SCommand` now delegates filtering, grouped item aggregation, and default item composition to Aria `CommandCompact`. For unstyled, data-driven usage, import `CommandCompact` from `@vean/aria/command`.

## Features

- 🔎 Fuzzy search — Fuse-powered matching over `label`/`groupLabel`/`description` with configurable `fuseOptions` (threshold, `resultLimit`, match-all-on-empty)
- 🧩 Aria/styled split — `CommandCompact` owns filtering, grouping and item composition; `SCommand` only injects styles
- 📊 Grouped data — `items` with nested group `items` (label/value/icon/description/disabled/separator) and flat items
- 🔍 Item descriptions — `description` renders as a secondary line under the label and is searchable by the built-in filter
- 🚀 External filtering — `external-filter` bypasses the built-in fuzzy filter so items can be filtered and ranked by an external engine (e.g. full-text content search)
- ⌨️ Keyboard nav — full listbox roving focus (arrow keys), selection and `highlight`/`select` events
- 🏷️ Icons + shortcuts — `icon` per item and `shortcut` rendered as a `Kbd`
- 🧹 Clearable — `clearable` shows a trailing clear control; `placeholder`/`emptyLabel` localize the empty state
- 🔒 Disabled — `disabled` disables the input and blocks selection
- ♿ Accessible — `role="listbox"`/`option`, `aria-label`d list, labelled input, `axe-core` clean

## Component family

- `SCommand` (styled) — the entry wrapper; `commandVariants` recipe with dynamic slot forwarding
- `CommandCompact` (Aria) — the aggregated composite; owns search, grouping, filtering and default item composition
- `ListboxRoot`/`ListboxFilter`/`ListboxContent`/`ListboxGroup`/`ListboxGroupLabel`/`ListboxItem` (Aria) — the underlying listbox primitives
- `Kbd` (Aria) — renders item `shortcut`s

## Demos

Interactive demos for command are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (8): Command, CommandCompact, CommandDescription, CommandEmpty, CommandItemContent, CommandItemLabel, CommandSeparator, CommandShortcut.

### Command

#### Props

Properties for the Command component.

- `class`: Root class. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CommandUi>`; optional)
- `items`: Items rendered by the component. (type `CommandOptionData<T>[]`; required)
- `placeholder`: Placeholder. (type `string`; optional)
- `searchTerm`: Search term. (type `string`; optional)
- `externalFilter`: Whether the items are already filtered and ranked by an external engine (e.g. full-text content search). When true, the built-in fuzzy filter is skipped and all `items` render as-is; `searchTerm` still syncs via `update:searchTerm` so the caller can drive its own search. (type `boolean`; optional)
- `clearable`: Whether clearable. (type `boolean`; optional)
- `fuseOptions`: Fuse options. (type `UseFuseOptions<CommandSearchOptionData<T>>`; optional)
- `listProps`: Properties forwarded to the list element. (type `CommandListProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `CommandItemProps`; optional)
- `itemLabelProps`: Properties forwarded to the item label element. (type `CommandItemLabelProps`; optional)
- `itemContentProps`: Properties forwarded to the item content element (wraps label + description). (type `CommandItemContentProps`; optional)
- `itemDescriptionProps`: Properties forwarded to the item description element. (type `CommandDescriptionProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `CommandGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `CommandGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element. (type `CommandShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `CommandSeparatorProps`; optional)
- `inputProps`: Properties forwarded to the input element. (type `CommandInputProps`; optional)
- `emptyProps`: Properties forwarded to the empty element. (type `CommandEmptyProps`; optional)
- `emptyLabel`: Empty label. (type `string`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `string`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `string`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `false`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `orientation`: The orientation of the listbox. <br>Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the Command component.

- `update:modelValue`: No description. (type `[value: string]`; parameters `value: string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `entryFocus`: Event handler called when container is being focused. Can be prevented. (type `[event: CustomEvent<any>]`; parameters `event: CustomEvent<any>`)
- `leave`: Event handler called when the mouse leave the container (type `[event: Event]`; parameters `event: Event`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)
- `update:searchTerm`: Emitted when the search term value changes. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the Command component.

- `input-leading`: Custom content for the input leading slot. (type `((props: CommandCompactInputSlotProps) => any) | undefined`)
- `input-trailing`: Custom content for the input trailing slot. (type `((props: CommandCompactInputSlotProps) => any) | undefined`)
- `empty`: Custom content for the empty slot. (type `(() => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `item-label`: Custom content for the item label slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `item-description`: Custom content for the item description slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `bottom`: Custom content for the bottom slot. (type `(() => any) | undefined`)

### CommandCompact

#### Props

Properties for the CommandCompact component.

- `items`: Items rendered by the component. (type `CommandOptionData<T>[]`; required)
- `placeholder`: Placeholder. (type `string`; optional)
- `searchTerm`: Search term. (type `string`; optional)
- `externalFilter`: Whether the items are already filtered and ranked by an external engine (e.g. full-text content search). When true, the built-in fuzzy filter is skipped and all `items` render as-is; `searchTerm` still syncs via `update:searchTerm` so the caller can drive its own search. (type `boolean`; optional)
- `clearable`: Whether clearable. (type `boolean`; optional)
- `fuseOptions`: Fuse options. (type `UseFuseOptions<CommandSearchOptionData<T>>`; optional)
- `listProps`: Properties forwarded to the list element. (type `CommandListProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `CommandItemProps`; optional)
- `itemLabelProps`: Properties forwarded to the item label element. (type `CommandItemLabelProps`; optional)
- `itemContentProps`: Properties forwarded to the item content element (wraps label + description). (type `CommandItemContentProps`; optional)
- `itemDescriptionProps`: Properties forwarded to the item description element. (type `CommandDescriptionProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `CommandGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `CommandGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element. (type `CommandShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `CommandSeparatorProps`; optional)
- `inputProps`: Properties forwarded to the input element. (type `CommandInputProps`; optional)
- `emptyProps`: Properties forwarded to the empty element. (type `CommandEmptyProps`; optional)
- `emptyLabel`: Empty label. (type `string`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `string`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `string`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `false`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `orientation`: The orientation of the listbox. <br>Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CommandCompact component.

- `update:modelValue`: No description. (type `[value: string]`; parameters `value: string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `entryFocus`: Event handler called when container is being focused. Can be prevented. (type `[event: CustomEvent<any>]`; parameters `event: CustomEvent<any>`)
- `leave`: Event handler called when the mouse leave the container (type `[event: Event]`; parameters `event: Event`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)
- `update:searchTerm`: Emitted when the search term value changes. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the CommandCompact component.

- `input-leading`: Custom content for the input leading slot. (type `((props: CommandCompactInputSlotProps) => any) | undefined`)
- `input-trailing`: Custom content for the input trailing slot. (type `((props: CommandCompactInputSlotProps) => any) | undefined`)
- `empty`: Custom content for the empty slot. (type `(() => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `item-label`: Custom content for the item label slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `item-description`: Custom content for the item description slot. (type `((props: CommandCompactItemSlotProps<T>) => any) | undefined`)
- `bottom`: Custom content for the bottom slot. (type `(() => any) | undefined`)

### CommandDescription

- No documented props, emits, slots, or slot props were available.

### CommandEmpty

- No documented props, emits, slots, or slot props were available.

### CommandItemContent

- No documented props, emits, slots, or slot props were available.

### CommandItemLabel

- No documented props, emits, slots, or slot props were available.

### CommandSeparator

#### Props

Properties for the CommandSeparator component.

- `orientation`: Orientation of the component. Either `vertical` or `horizontal`. Defaults to `horizontal`. (type `DataOrientation`; optional)
- `decorative`: Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes are updated so that that the rendered element is removed from the accessibility tree. (type `boolean`; optional)

### CommandShortcut

#### Props

Properties for the CommandShortcut component.

- `symbolize`: Whether to convert the command value to symbol representation. (type `boolean`; default `true`; optional)

## Notes

### Architecture and benchmark differences

`CommandCompact` owns the Fuse search, grouped-item aggregation and default item composition while the underlying listbox primitives stay style-free and only the UI wrapper injects the `commandVariants` classes. This mirrors the cmdk/shadcn-ui headless command split. Ant Design, Element Plus, Mantine and Naive UI ship a select/autocomplete rather than a dedicated command palette; VeanUI provides a true `⌘K`-style command with Fuse fuzzy search, grouped data, icons/shortcuts, and full listbox keyboard behavior.

| Capability          | VeanUI | shadcn/ui (cmdk) | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------ | :----: | :--------------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split   |   ✅   |        ✅        |     —      |      —       |    —    |    —     |
| Fuzzy search (Fuse) |   ✅   |        ✅        |     —      |      —       |    —    |    —     |
| Grouped data        |   ✅   |        ✅        |     ✅     |      ✅      |   ✅    |    ✅    |
| Icons + shortcuts   |   ✅   |        ✅        |     —      |      —       |   ✅    |    —     |
| Keyboard nav        |   ✅   |        ✅        |     ✅     |      ✅      |   ✅    |    ✅    |
| Empty state         |   ✅   |        ✅        |     ✅     |      ✅      |   ✅    |    ✅    |

`—` = unsupported or a different interaction model.

### Cautions

- `searchTerm` is controllable via `v-model:searchTerm`; filtering is performed by Fuse (default `threshold: 0.1`, `resultLimit: 12`, match-all on empty).
- `items` accepts grouped objects (`items` nested) and flat items; `separator: true` renders a divider after a group/item.
- `shortcut` renders as a `Kbd` (e.g. `['command', 'h']`); `icon` renders a leading icon.
- `clearable` shows a trailing clear control that resets `searchTerm`; the empty state uses the localized `command.noResults` message.
- The underlying listbox handles keyboard/roving focus; selection emits `select` and `update:modelValue`.

### Roadmap

N/A — command is feature-complete for the current parity set.

## FAQ

### How do I build a command palette?

Pass `items` and a `placeholder`:

```vue

```

### How do I group items?

Nest `items` under a group object with a `separator`:

```vue

```

### How do I control the search term?

Bind `searchTerm` with `v-model:searchTerm` and tune `fuse-options`:

```vue

```

### How do I show an empty state?

Set `empty-label` (falls back to the localized `command.noResults`):

```vue

```

### How do I handle selection?

Listen to `select` and `update:modelValue`:

```vue
<SCommand :items="items" @select="value => run(value)" />
```

### How do I show an item description?

Add a `description` to the item — it renders as a secondary line under the label and is included in the built-in fuzzy filter:

```vue

```

### How do I use an external search engine instead of the built-in filter?

Set `external-filter`: the built-in fuzzy filter is skipped and `items` render as-is (preserving your ranking). `searchTerm` still syncs via `v-model:searchTerm` / `update:searchTerm` so you can drive your own search — for example a full-text content search:

```vue

```
