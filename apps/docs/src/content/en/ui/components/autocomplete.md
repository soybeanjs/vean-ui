---
head:
  title: Autocomplete
  description: 'An autocomplete that filters suggestion items from text input and quickly fills the input with a selected result. It opens as you type, fuzzy-matches options with Fuse, and supports grouping, a clearable input, and a data-driven compact API. Use it when users should type keywords to get suggestions over free text; when options come from a fixed list, prefer SSelect; when options come from a known set that benefits from type-to-filter, SCombobox is the closer sibling.'
---

# Autocomplete

## Overview

An autocomplete that filters suggestion items from text input and quickly fills the input with a selected result. It opens as you type, fuzzy-matches options with Fuse, and supports grouping, a clearable input, and a data-driven compact API. Use it when users should type keywords to get suggestions over free text; when options come from a fixed list, prefer `SSelect`; when options come from a known set that benefits from type-to-filter, `SCombobox` is the closer sibling.

## Usage

<UsageCode component="autocomplete" />

## Features

- 🔍 Type-to-open filtering backed by Fuse fuzzy search (`threshold: 0.3`, matching `label` / `value` / `keywords` / `groupLabel`)
- ⌨️ Full keyboard navigation — ArrowDown/Up/Home/End open and move, Enter/Space select, typeahead, Escape close
- 🗂 Grouping with group labels, separators, and empty states (no-match / no-data)
- 🧹 Clearable input (`clearable` → `clearLabel` / `resetModelValueOnClear`)
- 🎛 `openOnFocus` / `openOnClick` dual open strategy with controlled `v-model:open`
- 📊 Data-driven `AutocompleteCompact` API — `items` (options use `label` / `value` fields) + grouping
- ♿ WAI-ARIA combobox pattern — `role="combobox"` / `listbox` / `option`, `aria-activedescendant`, axe-clean when open
- 🎨 17 recipe slots and 7 size variants via `autocompleteVariants`

## Demos

<PlaygroundGallery component="autocomplete" />

## API

<ComponentApi component="autocomplete" />

## Notes

### Architecture and benchmark differences

VeanUI builds autocomplete by reusing the combobox component family (Anchor/Content/Item/Viewport/Trigger/Empty/Cancel) over the listbox base plus Popper positioning. `AutocompleteRoot` disables combobox's built-in filtering (`ignoreFilter`) and delegates matching to the compact layer's `useFuse`, so autocomplete and combobox share the same interaction kernel and differ only in filter and display strategy. The `scv()` recipe `autocompleteVariants` declares 17 slots and 7 size variants.

| Capability                    | VeanUI | reka-ui `Combobox` | Algolia Autocomplete | Ant Design `AutoComplete` |
| :---------------------------- | :----: | :----------------: | :------------------: | :-----------------------: |
| Aria/styled split             |   ✅   |         ✅         |          —           |             —             |
| Type-to-filter + fuzzy match  |   ✅   |         —          |          ✅          |            ✅             |
| combobox/listbox roles        |   ✅   |         ✅         |          ✅          |            ✅             |
| Keyboard nav + typeahead      |   ✅   |         ✅         |          ✅          |            ✅             |
| Grouping + group labels       |   ✅   |         ✅         |          —           |             —             |
| `openOnFocus` / `openOnClick` |   ✅   |         —          |          ✅          |            ✅             |
| Clear button + empty state    |   ✅   |         ✅         |          —           |            ✅             |
| Data-driven Compact API       |   ✅   |         —          |          —           |             —             |
| axe-clean (open state)        |   ✅   |         —          |          —           |             —             |

### Cautions

- Filtering happens client-side with Fuse; for remote suggestions, pass pre-filtered `items` or debounce the input yourself.
- The popup stays open when focus moves to the clear button (the blur-enclosure check covers the whole anchor area) and closes only when focus leaves the component — this was a fixed regression, so do not restore trigger-only containment.
- When the root is `disabled`, every item is unselectable, including items that declare their own `disabled` (unified `rootDisabled || item.disabled` guard).
- The viewport (`role="listbox"`) exposes a localized `aria-label` by default; override it via `viewportProps['aria-label']`.

## FAQ

### How do I show suggestions without typing?

Use `openOnFocus` to open the popup when the input receives focus, and `openOnClick` to open when the input is clicked.

### How do I tune how fuzzy the matching is?

Pass `fuseOptions` to tune the Fuse search — for example, raise `threshold` for looser matches or use `keys` to restrict which fields participate.

### What is the difference between `SAutocomplete`, `SCombobox`, and `SSelect`?

`SAutocomplete` fuzzy-matches suggestions over free text (Fuse); `SCombobox` type-to-filters a known option list; `SSelect` is trigger-driven with typeahead only and no text input.

### How do I clear the input and reset the model value?

Pass `clearable`. `resetModelValueOnClear` decides whether clearing also emits an empty `modelValue` or only resets the search term.
