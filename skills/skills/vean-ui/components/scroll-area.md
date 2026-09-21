# ScrollArea

Source URL: https://veanui.com/components/scroll-area
Markdown URL: https://veanui.com/components/scroll-area.md
Category: Data Display
Description: A custom scroll container that keeps native scrolling behavior while rendering styled scrollbars for vertical and horizontal overflow.

## Overview

A custom scroll container that keeps native scrolling behavior while rendering styled scrollbars for vertical and horizontal overflow.

## Features

- **Native scroll engine** — scrolls with the browser's native performance while the native scrollbar is hidden.
- **Five visibility modes** — `type="auto"` (visible while overflow), `"always"` (always visible), `"hover"` (visible on hover), `"scroll"` (transiently visible while scrolling), and `"glimpse"` (a brief glimpse on hover).
- **Customizable hide delay** — `scrollHideDelay` (default 600ms) controls how long transient scrollbars (`scroll` / `glimpse`) stay visible.
- **Horizontal and vertical scrollbars** — independent `ScrollAreaScrollbar` components per orientation with automatic overflow detection via `ResizeObserver` + scroll metrics.
- **Draggable thumbs** — pointer-drag the thumb to scroll; track clicks jump the viewport; dragging continues when the cursor leaves the thumb.
- **Keyboard accessible viewport** — the viewport is focusable (`tabindex="0"`) with a visible focus ring; arrow keys scroll natively.
- **RTL scroll normalization** — detects the three browser RTL `scrollLeft` modes (`default` / `negative` / `reverse`) once per document (cached in a `WeakMap`) and normalizes them to a consistent 0 → max coordinate space for thumb math and drag behavior.
- **Full ARIA semantics** — scrollbars and thumbs are `aria-hidden` (custom scrollbars are purely decorative for AT); the root exposes `dir` from `useDirection`.
- **Composable structure** — `ScrollAreaRoot` / `ScrollAreaViewport` / `ScrollAreaScrollbar` / `ScrollAreaThumb` / `ScrollAreaCorner` are all exported from `@vean/aria/scroll-area` for custom styled builds, plus the `ScrollAreaCompact` aggregation.
- **Per-slot props forwarding** — `viewportProps`, `verticalScrollbarProps`, `horizontalScrollbarProps`, `thumbProps`, `cornerProps` on the compact component forward attributes to each region.
- **Corner rendering** — the corner is rendered only when both scrollbars are visible, sized by the crossing scrollbar thicknesses.
- **Size scaling** — `size` (xs…2xl) scales scrollbar thickness via `scrollAreaVariants`.
- **Performance** — all state uses `shallowRef`; derived values are cached in `computed`; RTL mode detection is cached per document; scroll listeners use `{ passive: true }`; drag listeners are cleaned up on `pointerup` / `pointercancel` / unmount.

## Usage

Usage examples for scroll-area are rendered on the site.

## Demos

Interactive demos for scroll-area are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): ScrollArea, ScrollAreaCompact, ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport.

### ScrollArea

#### Props

Properties for the ScrollArea component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ScrollAreaUi>`; optional)
- `size`: Size of the ScrollArea component. (type `ThemeSize`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `ScrollAreaViewportProps`; optional)
- `verticalScrollbarProps`: Properties forwarded to the vertical scrollbar element. (type `ScrollAreaScrollbarProps`; optional)
- `horizontalScrollbarProps`: Properties forwarded to the horizontal scrollbar element. (type `ScrollAreaScrollbarProps`; optional)
- `thumbProps`: Properties forwarded to the thumb elements. (type `ScrollAreaThumbProps`; optional)
- `cornerProps`: Properties forwarded to the corner element. (type `ScrollAreaCornerProps`; optional)
- `type`: Controls scrollbar visibility behavior. (type `ScrollAreaType`; optional)
- `dir`: The reading direction of the scroll area. (type `Direction`; optional)
- `scrollHideDelay`: Delay before transient scrollbars are hidden. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ScrollAreaCompact

#### Props

Properties for the ScrollAreaCompact component.

- `viewportProps`: Properties forwarded to the viewport element. (type `ScrollAreaViewportProps`; optional)
- `verticalScrollbarProps`: Properties forwarded to the vertical scrollbar element. (type `ScrollAreaScrollbarProps`; optional)
- `horizontalScrollbarProps`: Properties forwarded to the horizontal scrollbar element. (type `ScrollAreaScrollbarProps`; optional)
- `thumbProps`: Properties forwarded to the thumb elements. (type `ScrollAreaThumbProps`; optional)
- `cornerProps`: Properties forwarded to the corner element. (type `ScrollAreaCornerProps`; optional)
- `type`: Controls scrollbar visibility behavior. (type `ScrollAreaType`; optional)
- `dir`: The reading direction of the scroll area. (type `Direction`; optional)
- `scrollHideDelay`: Delay before transient scrollbars are hidden. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the ScrollAreaCompact component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)

### ScrollAreaCorner

#### Props

Properties for the ScrollAreaCorner component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ScrollAreaRoot

#### Props

Properties for the ScrollAreaRoot component.

- `type`: Controls scrollbar visibility behavior. (type `ScrollAreaType`; optional)
- `dir`: The reading direction of the scroll area. (type `Direction`; optional)
- `scrollHideDelay`: Delay before transient scrollbars are hidden. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ScrollAreaScrollbar

#### Props

Properties for the ScrollAreaScrollbar component.

- `orientation`: The scrollbar orientation. (type `ScrollAreaOrientation`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ScrollAreaThumb

#### Props

Properties for the ScrollAreaThumb component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ScrollAreaViewport

#### Props

Properties for the ScrollAreaViewport component.

- `nonce`: Adds a nonce to the injected style tag. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark comparison

| Concern                        | VeanUI                                                                                                    | Radix UI ScrollArea                          | Ant Design `ScrollBar`      |
| :----------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :-------------------------- |
| Aria / styled separation       | ✅ `@vean/aria/scroll-area` ships logic; `@vean/ui` ships `scv()` recipe                                  | ❌ single package (headless-style core only) | ❌ single styled package    |
| Visibility modes               | `auto` / `always` / `hover` / `scroll` / `glimpse`                                                        | `auto` / `always` / `hover` / `scroll`       | `auto` / `always` / `hover` |
| Hide delay control             | `scrollHideDelay` prop (default 600ms)                                                                    | `scrollHideDelay` prop (default 600ms)       | —                           |
| RTL `scrollLeft` normalization | ✅ 3-mode detection (`default` / `negative` / `reverse`) + `WeakMap` cache                                | ✅ same approach                             | —                           |
| Thumb drag + track click       | ✅ pointer drag + track jump                                                                              | ✅ pointer drag + track jump                 | ✅                          |
| Keyboard focusable viewport    | ✅ `tabindex="0"` + focus ring                                                                            | ✅                                           | —                           |
| Corner auto-render             | ✅ rendered only when both scrollbars visible, sized by thickness                                         | ✅                                           | —                           |
| `dir` from ConfigProvider      | ✅ `useDirection` fallback                                                                                | ✅ `dir` prop                                | —                           |
| Region-level props forwarding  | ✅ `viewportProps` / `verticalScrollbarProps` / `horizontalScrollbarProps` / `thumbProps` / `cornerProps` | ✅ `asChild` on each part                    | —                           |
| SSR safety                     | ✅ no `window`/`document` in setup                                                                        | ✅                                           | —                           |

### Runtime considerations

1. **Thumb math is proportion-based** — `getThumbSize` maps `viewportSize / contentSize` onto the track size, clamped to a `MIN_THUMB_SIZE` of 18px. `getThumbOffset` clamps the scroll ratio to `[0, 1]` and inverts it for horizontal RTL.
2. **Metrics update triggers** — thumb size and offset are recalculated on viewport/content/scrollbar `ResizeObserver` callbacks and on every viewport `scroll` event (passive). `onScrollbarSizeChange` keeps the root's scrollbar size refs in sync for the corner sizing.
3. **Drag continues off-thumb** — `pointermove` / `pointerup` / `pointercancel` listeners are attached to `window` (not the thumb) so dragging works even when the cursor leaves the thumb. Listeners are removed on `pointerup` / `pointercancel` and on unmount.
4. **RTL mode detection is one-time** — `detectRtlScrollType` probes a temporary scroll container once per `Document` and caches the result in a `WeakMap`. The three modes (`default` / `negative` / `reverse`) are normalized so internal math always uses a 0 → max coordinate space.
5. **`type` affects visibility only, not behavior** — overflow detection, drag, and scroll events work identically for all modes; `type` only decides when the scrollbars are painted (`data-state="visible|hidden"`).
6. **SSR safety** — no `window` / `document` access in setup. The RTL probe and `ResizeObserver` only run client-side once elements exist.

## FAQ

### Which `type` should I use?

- `auto` — scrollbars appear only while the content overflows.
- `always` — scrollbars are always painted when there is overflow.
- `hover` — scrollbars fade in on pointer hover (desktop-friendly).
- `scroll` — scrollbars appear transiently while scrolling, then hide after `scrollHideDelay`.
- `glimpse` — a brief scrollbar glimpse on hover, useful for very clean minimal UIs.

### Why are the scrollbars `aria-hidden`?

The custom scrollbars are purely visual; the viewport remains a native scroll container, so assistive technologies can rely on native scrolling semantics and the focusable viewport. Marking the decorations `aria-hidden` prevents redundant announcements.

### How does RTL work?

Set `dir="rtl"` on the root (or rely on `ConfigProvider`). The component detects the browser's RTL `scrollLeft` mode once per document and normalizes thumb position, drag delta, and track clicks so they behave identically in LTR and RTL.

### Can I customize the scrollbar appearance?

Yes — pass `ui` (per-slot classes) to `SScrollArea`, or forward attributes via `verticalScrollbarProps` / `horizontalScrollbarProps` / `thumbProps`. For full control, build your own `ScrollAreaRoot` / `ScrollAreaViewport` / `ScrollAreaScrollbar` / `ScrollAreaThumb` composition from `@vean/aria/scroll-area`.

### How do I make the viewport keyboard focusable?

It already is — the viewport sets `tabindex="0"` by default (override via `viewportProps.tabindex`) and shows a focus ring via `focus-visible` styles.

### Why does the corner only appear sometimes?

The corner is rendered only when both horizontal and vertical scrollbars are visible simultaneously. Its size matches the crossing scrollbar thicknesses.

### Does it work with SSR?

Yes — setup never touches `window` / `document`. The RTL probe and `ResizeObserver` only activate client-side once the viewport mounts.
