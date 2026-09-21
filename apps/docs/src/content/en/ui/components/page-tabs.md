---
head:
  title: PageTabs
  description: 'A tabbed interface designed for navigating between different pages or views. It supports features like closable tabs, context menus, and customizable styling.'
---

# PageTabs

## Overview

A tabbed interface designed for navigating between different pages or views. It supports features like closable tabs, context menus, and customizable styling.

## Features

- **Data-driven compact composition** — `SPageTabs` delegates the whole structure to the Aria generic `PageTabsCompact<T>`, which owns tab iteration, pin sorting, close semantics, context-menu wiring, and the default item body (icon + label + pin + close + indicator).
- **Controlled or uncontrolled state** — `modelValue` / `items` support `v-model` / `v-model:items` (controlled); omitting them falls back to internal state via `useControllableState`.
- **Closable tabs with async guard** — every non-pinned tab renders a close button; `beforeClose` may return `false` or a promise resolving to `false` to block closing. Closing the active tab activates the next (or previous) sibling; closing via keyboard `Backspace` and middle-click (`middleClickClose`) work out of the box.
- **Pin / unpin with auto-sorting** — pinned tabs sort to the front on any change (pinned group first, then normal tabs; `hidePinnedIcon` is display-only and never affects ordering); the inline pin button toggles pinned state and the context menu provides `Pin` / `Unpin`.
- **Drag-to-reorder** — with `draggable` enabled, tabs can be dragged horizontally to change their position. Reordering is zone-restricted, matching browser tab bars (Chrome / VS Code): tabs only reorder within their own zone — the pinned group first, then unpinned — so an unpinned tab halts at the pinned boundary in real time and never lands before pinned tabs. A tab item with an explicit `draggable: false` is locked in place: it cannot be dragged and it acts as a barrier, so no other tab can be inserted at its position (e.g. a home tab pinned to the very first slot). Dragging is driven by the Aria `useSortableList` hook: the dragged tab keeps its own slot as the placeholder and follows the cursor with `transform` only, while the sibling tabs slide out of the way with FLIP; on drop the new order is applied (emitting `update:items`) and the dragged tab slides into its final slot. Keyboard sorting works too — focus a tab, press `Space` to pick it up, move it with the arrow keys, drop with `Space` / `Enter`, abort with `Escape`. `tabDragStart` / `tabDragMove` / `tabDragEnd` emit the live drag state `{ item, index }`.
- **Context-menu factory** — `menuFactory(tab, state)` receives the hovered tab plus a `PageTabsState` (close, closeLeft, closeRight, closeOther, closeAll, pin, unpin and their per-action `*Closable` booleans) to build custom menus; `selectContextMenu` emits the chosen action and tab.
- **Full keyboard support** — the `useRovingFocusGroup` hook provides arrow-key movement; `Enter` activates a tab, `Backspace` closes it, and `Space` picks a tab up for keyboard reordering.
- **Auto-scroll active tab** — `usePageTabsScroll` keeps the active tab horizontally centered (`scrollTo` smooth) and converts the vertical wheel into horizontal scrolling.
- **Three visual variants** — `variant` (`chrome` / `card` / `slider`) with per-variant indicators (chrome corner SVGs / slider underline) and `size` (xs…2xl) via the `pageTabsVariants` `scv()` recipe.
- **Six customization slots** — `item` (scoped `{ item, index, active, closable }`), `icon`, `label`, `indicator`, `pin-icon`, `close-icon`.
- **Localized accessibility text** — the close / pin buttons fall back to localized `aria-label`s (`closeTab` / `pinTab` / `unpinTab`) across 13 built-in languages, overridable per button via `aria-label`.
- **Aria composition** — `PageTabsRoot` / `PageTabsItem` / `PageTabsClose` / `PageTabsPin` / `PageTabsCompact` are exported from `@vean/aria/page-tabs` for fully custom styled builds.

## Usage

<UsageCode component="page-tabs" />

> `SPageTabs` delegates its tab management to Aria `PageTabsCompact`. For unstyled, data-driven composition, import `PageTabsCompact` from `@vean/aria/page-tabs`.

## Demos

<PlaygroundGallery component="page-tabs" />

## API

<ComponentApi component="page-tabs" />

## Notes

### Architecture and benchmark comparison

| Concern                                   | VeanUI                                           | Ant Design `Tabs`                   | Element Plus `Tabs`            | tags-view (vue-element-admin style) |
| :---------------------------------------- | :----------------------------------------------- | :---------------------------------- | :----------------------------- | :---------------------------------- |
| Aria / styled separation                  | ✅ `@vean/aria/page-tabs` + `scv()`              | ❌ single package                   | ❌ single package              | ❌ custom per app                   |
| Data-driven compact API                   | ✅ generic `PageTabsCompact<T>` + `items`        | ✅ config-driven (items)            | ✅ config-driven               | ✅ per app                          |
| Controlled / uncontrolled                 | ✅ `modelValue`/`items` + `useControllableState` | ✅ `activeKey` / `defaultActiveKey` | ✅ `v-model`                   | —                                   |
| Closable + async guard                    | ✅ `beforeClose` (false / Promise\<false>)       | ✅ `onEdit` + `beforeChange`        | ✅ `closable` / `before-leave` | ✅ `before-close`                   |
| Pin / unpin + auto-sort                   | ✅ pinned tabs sort to front                     | ❌ (custom tabLabel)                | ❌                             | ✅ (per app, e.g. affix-tab)        |
| Drag-to-reorder                           | ✅ `draggable` + `tabDragStart/Move/End`         | ❌                                  | ❌                             | ✅ (per app)                        |
| Context menu (left/right/other/all close) | ✅ `menuFactory` + `PageTabsState`               | ❌ (`dropdownMenu` on `more` only)  | ❌                             | ✅ (per app)                        |
| Middle-click close                        | ✅ `middleClickClose`                            | ❌                                  | ❌                             | ✅ (per app)                        |
| Keyboard (roving focus + Enter/Backspace) | ✅ `useRovingFocusGroup`                         | ✅ arrows / Home / End              | ✅ arrows                      | ❌                                  |
| Auto-scroll active tab                    | ✅ centered `scrollTo` + wheel-to-horizontal     | ✅ `auto` on tabBar                 | ❌                             | ✅ (per app)                        |
| Variants                                  | ✅ `chrome`/`card`/`slider` × xs…2xl             | ✅ `line`/`card`/`editable-card`    | ✅ `card`/`border-card`        | —                                   |
| Localized `aria-label`                    | ✅ locale registry (13 langs)                    | partial                             | —                              | —                                   |
| Slots                                     | ✅ 6 typed slots                                 | ✅ `label`/`closeIcon`/…            | ✅ `label`/`icon`/…            | —                                   |

### Runtime considerations

1. **Pinned tabs are not closable** — `closable` derives from `!pinned`; pinned tabs render no close button, and middle-click / `Backspace` / context-menu close actions are disabled for them.
2. **Active-tab close fallback** — closing the active tab activates the next sibling, falling back to the previous one; closing the last tab clears `modelValue` to `''` (no tab active).
3. **Async `beforeClose`** — it may be synchronous or return a promise; only a resolved `false` blocks the close. The `close` event fires after the guard passes and the tab is removed.
4. **Pin sorting** — `sortTabs` reorders items as pinned → normal (stable, keeping the relative order within each group) and emits `update:items` when the order changes; in controlled mode the parent must accept the new order to see the reorder.
5. **Controlled vs. uncontrolled** — when `modelValue` / `items` props are provided, internal writes only emit `update:modelValue` / `update:items`; the DOM follows the props, so external changes re-render automatically.
6. **Context menu target** — hovering a tab (pointerenter) sets it as the context target and emits `contextmenu`; the menu itself renders from `menuFactory` only when it returns non-empty options.
7. **Drag-to-reorder scope** — drag reordering is a `PageTabsCompact`-level feature (`draggable`). Sorting is zone-restricted: tabs reorder within their own zone only (pinned → unpinned; all pinned tabs — including `hidePinnedIcon` ones — share one zone), so unpinned tabs can never be dragged in front of pinned ones — the real-time reorder is blocked at the boundary and `sortTabs` keeps the zone invariant. A tab item with an explicit `draggable: false` is fully locked: it cannot be dragged and is excluded from collision candidates, so no other tab can be dropped onto its position. In controlled mode (`v-model:items`) the parent must accept the reordered `update:items` to see the new order. Standalone `PageTabsRoot` / `PageTabsItem` composition has no drag support.
8. **Locale fallback** — close/pin `aria-label`s come from `useLocaleMessages`; missing keys fall back to the default English bundle; an explicit `aria-label` on the close/pin button wins.

## FAQ

### How do I prevent closing a tab?

Return `false` (or a promise that resolves to `false`) from `beforeClose`. The guard applies to the close button, middle-click, `Backspace`, and the context-menu close actions. For a pinned tab, just mark `pinned: true` — pinned tabs are never closable.

### Why are pinned tabs shown first?

Pinning is meant to keep important pages accessible; `sortTabs` moves pinned tabs (as one group, `hidePinnedIcon` included) in front of normal ones while keeping the relative order inside each group. If you pass `pinned` items in arbitrary order, the component reorders them on mount and emits `update:items` with the sorted array.

### Can I customize the context menu?

Yes — implement `menuFactory(tab, state)`. `state` exposes `close`, `closeLeft`, `closeRight`, `closeOther`, `closeAll`, `pin`, `unpin`, and the matching `*Closable` flags so you can disable irrelevant actions (e.g. "Close Left" on the first tab). Selecting an item runs its `action` and emits `selectContextMenu(menu, tab)`.

### How do I close the active tab gracefully?

Closing the active tab automatically activates the next sibling (or the previous one when the closed tab was last). If the last remaining tab is closed, `modelValue` becomes `''` and no tab is active.

### What keyboard shortcuts are supported?

Arrow keys move focus through tabs (roving focus), `Enter` activates the focused tab, and `Backspace` closes it (unless pinned or blocked by `beforeClose`). Middle-click also closes when `middleClickClose` is enabled.

### Can I build a fully custom page tabs?

Yes — compose `PageTabsRoot` / `PageTabsItem` / `PageTabsClose` / `PageTabsPin` / `PageTabsCompact` from `@vean/aria/page-tabs` and inject styles via `providePageTabsUi` (or `SPageTabs`'s `ui` prop). The `item` slot receives `{ item, index, active, closable }` scoped props for per-tab rendering.

### How do I enable drag-to-reorder?

Set `draggable` on `SPageTabs` (or `PageTabsCompact`). Tabs become horizontally draggable with a floating preview and smooth slide animation; the new order is written back through `v-model:items`. Like browser tab bars, reordering is zone-restricted: pinned tabs (including `hidePinnedIcon` ones) reorder among themselves at the front, and unpinned tabs cannot be dragged past the pinned group — they halt at the boundary in real time. To lock an individual tab (e.g. a home tab kept at the very first slot), set `draggable: false` on that item: it cannot be dragged and no other tab can be dropped onto its position.
