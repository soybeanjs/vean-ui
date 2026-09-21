---
head:
  title: Command
  description: 'Fast, composable, command menu for Vue. SCommand is a searchable command palette built on the Aria listbox primitives with Fuse fuzzy matching. It delegates filtering, grouped item aggregation, and default item composition to the Aria CommandCompact; the UI wrapper only injects styles.'
---

# Command

## Overview

Fast, composable, command menu for Vue. `SCommand` is a searchable command palette built on the Aria listbox primitives with Fuse fuzzy matching. It delegates filtering, grouped item aggregation, and default item composition to the Aria `CommandCompact`; the UI wrapper only injects styles.

Use a command for a ⌘K-style palette, searchable menus, or inline typeahead. For a plain action menu use `dropdown-menu`; for a compact single-select list use `select`.

## Usage

<UsageCode component="command" />

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

<PlaygroundGallery component="command" />

## API

<ComponentApi component="command" />

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
<SCommand
  placeholder="Type a command..."
  :items="[
    { label: 'Search Emoji', value: 'emoji', icon: 'lucide:smile' },
    { label: 'Help', value: 'help', icon: 'lucide:help-circle', shortcut: ['command', 'h'] }
  ]"
  @select="onSelect"
/>
```

### How do I group items?

Nest `items` under a group object with a `separator`:

```vue
<SCommand
  :items="[
    {
      label: 'Suggestions',
      value: 'suggestions',
      separator: true,
      items: [{ label: 'Calendar', value: 'calendar' }]
    }
  ]"
/>
```

### How do I control the search term?

Bind `searchTerm` with `v-model:searchTerm` and tune `fuse-options`:

```vue
<SCommand v-model:searchTerm="query" :items="items" :fuse-options="{ threshold: 0.3 }" />
```

### How do I show an empty state?

Set `empty-label` (falls back to the localized `command.noResults`):

```vue
<SCommand :items="items" empty-label="No results found" />
```

### How do I handle selection?

Listen to `select` and `update:modelValue`:

```vue
<SCommand :items="items" @select="value => run(value)" />
```

### How do I show an item description?

Add a `description` to the item — it renders as a secondary line under the label and is included in the built-in fuzzy filter:

```vue
<SCommand :items="[{ label: 'Calendar', value: 'calendar', description: 'Schedule management view' }]" />
```

### How do I use an external search engine instead of the built-in filter?

Set `external-filter`: the built-in fuzzy filter is skipped and `items` render as-is (preserving your ranking). `searchTerm` still syncs via `v-model:searchTerm` / `update:searchTerm` so you can drive your own search — for example a full-text content search:

```vue
<SCommand v-model:searchTerm="query" external-filter :items="results" @select="open" />
```
