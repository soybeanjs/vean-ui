---
head:
  title: Cascader
  description: 'A cascader for selecting values from hierarchical tree data. It renders a linked multi-column panel and supports single/multiple selection, full-path value mode, parent-child check-state propagation, local filtering and remote search, lazy loading of children, and virtual scrolling for large datasets. Use it when options are organized as a tree and selection must happen level by level; for flat option lists, prefer SSelect or SCombobox.'
---

# Cascader

## Overview

A cascader for selecting values from hierarchical tree data. It renders a linked multi-column panel and supports single/multiple selection, full-path value mode, parent-child check-state propagation, local filtering and remote search, lazy loading of children, and virtual scrolling for large datasets. Use it when options are organized as a tree and selection must happen level by level; for flat option lists, prefer `SSelect` or `SCombobox`.

## Usage

<UsageCode component="cascader" />

## Features

- 🗂 Linked multi-column panel — the path unfolds one level per column
- ☑️ Single or multiple selection with cascading parent-child check states (`showCheckedStrategy`: child / parent)
- 🛤 Full-path value mode (`pathMode`) — the model value carries the complete value/label path
- ⏳ Data loading — lazy children (`loadChildren`), debounced remote search (`searchDelay`), local filtering (`filter`) with a localized empty state
- 📜 Built-in per-column virtual scrolling (`virtualScroll`, configurable `itemSize` / `height`)
- ⌨️ Full keyboard navigation — Arrow keys move across columns, Enter selects, plus click/hover expand
- ♿ WAI-ARIA tree semantics — trigger `role="combobox"` + `aria-haspopup="tree"`, option `role="treeitem"`, axe-clean when open
- 🎨 16 recipe slots and 7 size variants via `cascaderVariants`

## Demos

<PlaygroundGallery component="cascader" />

## API

<ComponentApi component="cascader" />

## Notes

### Architecture and benchmark differences

VeanUI implements cascader with a self-developed data engine (`useCascaderData`) rather than reusing the listbox selection/collection bases, whose flat single-value model does not fit tree cascading: `shallowReactive` node trees cache `pathValues` / `pathLabels` / `level` for O(1) lookups, the `menus` computed derives the visible columns, and cascading checks run `setCheckedDeep` / `recomputeAncestors` / `collectCheckedNodes`. `CascaderOption` dispatches cancellable `select` / `expand` custom events (reka-ui style). The `scv()` recipe `cascaderVariants` declares 16 slots and 7 size variants.

| Capability                        | VeanUI | Ant Design `Cascader` | reka-ui `Cascader` | Element Plus `Cascader` |
| :-------------------------------- | :----: | :-------------------: | :----------------: | :---------------------: |
| Aria/styled split                 |   ✅   |           —           |         ✅         |            —            |
| Multi-column panel                |   ✅   |          ✅           |         ✅         |           ✅            |
| Cascading checks + half-check     |   ✅   |          ✅           |         —          |           ✅            |
| Lazy loading / remote search      |   ✅   |          ✅           |         ✅         |           ✅            |
| `showCheckedStrategy`             |   ✅   |          ✅           |         —          |            —            |
| `pathMode` (path values)          |   ✅   |          ✅           |         —          |            —            |
| Virtual scrolling                 |   ✅   |           —           |         —          |            —            |
| Cancellable custom events         |   ✅   |           —           |         ✅         |            —            |
| Localized strings (not hardcoded) |   ✅   |           —           |         —          |           ✅            |
| axe-clean (open state)            |   ✅   |           —           |         —          |            —            |

### Cautions

- All built-in strings are localized (`LocaleCascaderMessages`); override per instance with `emptyLabel` / `clearLabel` or the matching `aria-label` attrs.
- In filterable mode the trigger becomes `tabindex=-1` and focus lives in the search input — keyboard navigation starts there.
- Clicking a non-leaf node in search mode only highlights it; the multi-column path does not expand (differs from AntD) — expand on demand if you need that behavior.
- `select` / `expand` events still fire on disabled items (emitted before the guard) without changing the model value; guard in the consumer if needed.

## FAQ

### How do I get the full path instead of the last value?

Enable `pathMode`; the model value then carries the complete value/label path rather than the deepest node only.

### How do I load children lazily from an API?

Pass `loadChildren` returning the children for a node; the engine tracks the loading state and emits `loaded` when it finishes.

### How do I filter remotely?

Use `searchDelay` for debouncing and provide your own `filter` implementation (or feed filtered `items`); the built-in filtering matches path labels client-side.

### How do I emit only checked leaves?

Configure `showCheckedStrategy: 'child'` to collect only leaf nodes when a parent is checked, or `'parent'` to emit the checked parents.
