---
head:
  title: Splitter
  description: A composable layout component that divides an area into resizable panels.
---

# Splitter

## Overview

A composable layout component that divides an area into resizable panels.

## Features

- **Three-part composition** — `SSplitterGroup` (root), `SSplitterPanel` (content region), `SSplitterResizeHandle` (drag handle between panels).
- **Horizontal and vertical directions** — `direction="horizontal" | "vertical"` flips the layout axis; cursor and ARIA orientation adapt automatically.
- **Panel size constraints** — each panel supports `defaultSize`, `minSize`, `maxSize`, and `collapsedSize` for fine-grained control over resize bounds.
- **Collapsible panels** — `collapsible` panels can collapse to `collapsedSize` via the Enter key or the imperative API, with `collapse` / `expand` / `resize` events.
- **`order` prop** — panels declare `order` to control the logical sequence for `defaultLayout` mapping and pair resizing, independent of DOM order.
- **`defaultLayout`** — provide an explicit initial layout array (maps to sorted panels by `order`).
- **Pointer dragging** — pointer-event-based dragging with `pointerId` tracking, `pointermove` / `pointerup` / `pointercancel` listeners on the owner document, and automatic cleanup on unmount.
- **Keyboard resizing** — Arrow keys resize by `keyboardResizeBy` (default 10%); Home / End jump to min / max; Enter toggles collapse.
- **RTL support** — `dir="rtl"` inverts both pointer delta and arrow-key direction for horizontal splitters; the root `dir` attribute is set from `useDirection` (falls back to `ConfigProvider`).
- **Imperative panel API** — `SSplitterPanel` exposes `collapse()`, `expand()`, `resize(size)`, `getSize()`, `isCollapsed`, and `isExpanded` via `defineExpose` for programmatic control.
- **Full ARIA separator semantics** — the handle uses `role="separator"` with `aria-controls`, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-disabled`.
- **Size scaling** — `size` (xs…2xl) scales the resize handle's visual grip width via `splitterVariants`.
- **Custom handle content** — pass a default slot to `SSplitterResizeHandle` for a fully custom grip, or use `withHandle` for the built-in dotted grip.
- **State reflection** — panels expose `data-state="collapsed|expanded"` (when collapsible), `data-panel-size`, `data-panel-collapsible`; handles expose `data-state="drag|hover|inactive"`, `data-disabled`, `data-orientation`.
- **Aria composition** — `SplitterGroup`, `SplitterPanel`, `SplitterResizeHandle` are exported from `@vean/aria/splitter` for custom styled builds.

## Usage

<UsageCode component="splitter" />

## Demo

<PlaygroundGallery component="splitter" />

## API

<ComponentApi component="splitter" />

## Notes

### Architecture and benchmark comparison

| Concern                     | VeanUI                                                                                     | react-resizable-panels                                  | Ant Design `ResizeBox` / `Splitter` |
| :-------------------------- | :----------------------------------------------------------------------------------------- | :------------------------------------------------------ | :---------------------------------- |
| Aria / styled separation    | ✅ `@vean/aria/splitter` ships logic; `@vean/ui` ships `scv()` recipe                      | ❌ React-only, no headless layer                        | ❌ single styled package            |
| Panel size constraints      | `defaultSize` / `minSize` / `maxSize` / `collapsedSize`                                    | `defaultSize` / `minSize` / `maxSize` / `collapsedSize` | `min` / `max`                       |
| Collapsible panels          | `collapsible` + Enter key + imperative API                                                 | `collapsible` + `onCollapse` / `onExpand`               | —                                   |
| Panel `order`               | `order` prop controls logical sequence for layout mapping                                  | `order` prop                                            | —                                   |
| Keyboard resizing           | Arrow keys + Home / End + Enter (collapse toggle)                                          | Arrow keys + Home / End + Enter                         | —                                   |
| RTL support                 | `dir` prop + `useDirection` fallback; inverts pointer delta and arrow keys                 | `direction` prop with RTL awareness                     | —                                   |
| Imperative panel API        | `defineExpose` (`collapse` / `expand` / `resize` / `isCollapsed`)                          | `ImperativePanelHandle`                                 | —                                   |
| ARIA separator semantics    | `role="separator"` + `aria-controls` / `aria-valuenow` / `aria-valuemin` / `aria-valuemax` | same                                                    | partial                             |
| Layout persistence          | `layout` event (consumer persists)                                                         | `autoSaveId` built-in persistence                       | —                                   |
| Dynamic panel mount/unmount | `registerPanel` / `unregisterPanel` + `refreshLayout`                                      | supported                                               | —                                   |
| Dragging event              | `dragging` event on handle                                                                 | `onDragging`                                            | —                                   |

### Runtime considerations

1. **Layout is percentage-based** — all sizes are percentages of the group's main-axis size. `getGroupSize()` reads `getBoundingClientRect()` on the group element to convert pixel delta to percentage delta during drag.
2. **`order` affects layout mapping, not DOM position** — panels are sorted by `order` for `defaultLayout` assignment and pair resizing, but their visual position is determined by template order. Use `order` when you need the layout array to map to panels in a specific logical sequence.
3. **`defaultLayout` maps to sorted panels** — when provided, `defaultLayout[i]` is assigned to the panel at sorted position `i` (by `order`, then registration index). Without `defaultLayout`, each panel uses its own `defaultSize`.
4. **Collapsible threshold** — when dragging a collapsible panel below the midpoint between `collapsedSize` and `minSize`, the panel snaps to `collapsedSize`; above the midpoint, it snaps to `minSize`.
5. **`distributeDelta` guard** — the delta distribution loop is capped at 20 iterations to prevent infinite loops when panels are tightly constrained. A fallback pass assigns any remainder to the first eligible panel.
6. **Pointer listeners are on the owner document** — `pointermove` / `pointerup` / `pointercancel` are attached to `handleElement.ownerDocument` (not the handle) so dragging continues even when the cursor leaves the handle. Listeners are cleaned up on `pointerup` / `pointercancel` and on component unmount.
7. **`useDirection` fallback** — if `dir` prop is unset, the direction falls back to `ConfigProvider`'s `dir`, then to `'ltr'`. The resolved `dir` is set on the group root element.

## FAQ

### How do I make a panel collapsible?

Set `collapsible` on `SSplitterPanel` and provide a `collapsedSize` (default `0`). Users can press Enter on the adjacent resize handle to toggle collapse. You can also call `panelRef.value.collapse()` / `expand()` programmatically.

### How does `order` work?

`order` controls the logical sequence of panels for layout calculation. `defaultLayout` array indices map to panels sorted by `order` (then by registration index for ties). This is useful when the DOM order doesn't match the desired logical order — for example, when a sidebar panel is visually first but should be logically second.

### How do I persist the layout?

Listen to the `layout` event on `SSplitterGroup` and save the array (e.g., to `localStorage`). On next mount, pass the saved array as `defaultLayout`. Unlike react-resizable-panels' `autoSaveId`, VeanUI leaves persistence to the consumer for flexibility.

### Can I disable a resize handle?

Yes — set `disabled` on `SSplitterResizeHandle`. The handle gets `aria-disabled="true"`, `data-disabled`, `tabindex` is removed, and pointer / keyboard interactions are blocked.

### How does RTL work?

Set `dir="rtl"` on `SSplitterGroup` (or rely on `ConfigProvider`). In RTL mode, dragging right shrinks the first panel (opposite of LTR), and ArrowLeft / ArrowRight are inverted. The root element gets `dir="rtl"`.

### How do I customize the resize handle?

Pass a default slot to `SSplitterResizeHandle` for fully custom content. Alternatively, set `withHandle` to render the built-in dotted grip. Without either, the handle is a plain line.

### Can I dynamically add or remove panels?

Yes — panels register on mount and unregister on unmount. The layout is recalculated automatically via `refreshLayout`. When a panel unmounts, its size is redistributed to the remaining panels.
