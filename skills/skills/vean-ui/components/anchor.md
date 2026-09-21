# Anchor

Source URL: https://veanui.com/components/anchor
Markdown URL: https://veanui.com/components/anchor.md
Category: Navigation
Description: Anchor provides in-page navigation for long content sections and keeps the current section highlighted while scrolling.

## Overview

Anchor provides in-page navigation for long content sections and keeps the current section highlighted while scrolling.

When the active item changes while scrolling, the hash in the address bar is also synchronized. Scroll-driven updates always use `history.replaceState` to avoid creating excessive history entries.

If the current URL already contains a hash on initial render, Anchor will scroll to the matching section after mount. When a custom scroll container becomes available later, Anchor will re-sync once that container is ready.

> `SAnchor` now delegates recursive item rendering to Aria `AnchorCompact`. The same six `ui` slots are available from both `SAnchor` and `@vean/aria/anchor`.

## Features

- **Scroll-spy highlighting** — the root observes its scroll container (`window` by default or a custom element via `getContainer`) and marks the last section that crossed the `offsetTop + bounds` threshold as active, with `aria-current="location"` on the matching link.
- **Hash synchronization** — clicking a link writes the hash with `history.pushState` (or `history.replaceState` when `replace` is set); scroll-driven updates always `replaceState`; on mount the component scrolls to the hash that is already in the URL.
- **Smooth in-page scrolling** — clicking a hash link scrolls the container with `behavior: 'smooth'` and suspends scroll-spy re-sync until the animation settles (300 ms guard).
- **Custom scroll container** — `getContainer` returns any scrollable `HTMLElement`; anchor positions are measured relative to that container and re-synced when it replaces the initial `window` fallback.
- **Offset control** — `offsetTop` (default `0`) and `targetOffset` (takes precedence) shift the scroll destination so headings land below sticky headers; the value is also exposed as `--vean-anchor-offset-top` for the sticky root.
- **Active detection tuning** — `bounds` (default `5`) is the pixel tolerance used to decide whether a section has been passed; `getCurrentAnchor` can remap the resolved href before it is emitted.
- **Recursive data-driven composition** — `SAnchor` renders nested `items` (arbitrary depth) through the generic Aria `AnchorCompact`; each level wraps its own `AnchorLink`, indicator, title, and nested `sub` list.
- **Sticky rail** — `sticky` (default `true`) pins the anchor list to the top of the container with `top: var(--vean-anchor-offset-top)` and caps its height to the viewport.
- **Per-item and global link props** — `disabled` and `target` can be set per item or globally via `linkProps`; an explicit item value always wins, and `linkProps.href` is intentionally excluded because the item's `href` owns the target.
- **Eight theme colors + six sizes** — `color` (primary…accent) and `size` (xs…2xl) variants from the `anchorVariants` `scv()` recipe, plus vertical / horizontal `orientation`.
- **Accessible by default** — the root renders a `<nav>` landmark with a localized `aria-label` (overridable), disabled links carry `aria-disabled` and leave the tab order, and the indicator is `aria-hidden`.
- **Aria composition** — `AnchorRoot` / `AnchorLink` / `AnchorCompact` / `AnchorItemCompact` are exported from `@vean/aria/anchor` for fully custom styled builds.

## Usage

Usage examples for anchor are rendered on the site.

> `SAnchor` now delegates recursive item rendering to Aria `AnchorCompact`. For unstyled, data-driven usage, import `AnchorCompact` from `@vean/aria/anchor`.

## Demos

Interactive demos for anchor are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): Anchor, AnchorCompact, AnchorItemCompact, AnchorLink, AnchorRoot.

### Anchor

#### Props

Properties for the Anchor component.

- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<AnchorExtendedUi>`; optional)
- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `sticky`: Whether sticky. (type `boolean`; optional)
- `items`: Items rendered by the component. (type `AnchorOptionData[]`; required)
- `linkProps`: Properties forwarded to the link element. (type `Omit<AnchorLinkProps, 'href'>`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `HTMLAttributes`; optional)
- `titleProps`: Properties forwarded to the title element. (type `HTMLAttributes`; optional)
- `subProps`: Properties forwarded to the sub element. (type `HTMLAttributes`; optional)
- `bounds`: Bounds. (type `number`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `getContainer`: Get container. (type `(() => AnchorContainer | null)`; optional)
- `getCurrentAnchor`: Get current anchor. (type `((activeHref: string) => string)`; optional)
- `modelValue`: Current model value. (type `string`; optional)
- `offsetTop`: Offset top. (type `number`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `replace`: Whether replace. (type `boolean`; optional)
- `targetOffset`: Target offset. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Anchor component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `activeChange`: Emitted when active change occurs. (type `[value: string]`; parameters `value: string`)
- `itemSelect`: Emitted when item select occurs. (type `[event: MouseEvent, payload: { href: string; }]`; parameters `event: MouseEvent, payload: { href: string; }`)

### AnchorCompact

#### Props

Properties for the AnchorCompact component.

- `items`: Items rendered by the component. (type `AnchorOptionData[]`; required)
- `linkProps`: Properties forwarded to the link element. (type `Omit<AnchorLinkProps, 'href'>`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `HTMLAttributes`; optional)
- `titleProps`: Properties forwarded to the title element. (type `HTMLAttributes`; optional)
- `subProps`: Properties forwarded to the sub element. (type `HTMLAttributes`; optional)
- `bounds`: Bounds. (type `number`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `getContainer`: Get container. (type `(() => AnchorContainer | null)`; optional)
- `getCurrentAnchor`: Get current anchor. (type `((activeHref: string) => string)`; optional)
- `modelValue`: Current model value. (type `string`; optional)
- `offsetTop`: Offset top. (type `number`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `replace`: Whether replace. (type `boolean`; optional)
- `targetOffset`: Target offset. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the AnchorCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `activeChange`: Emitted when active change occurs. (type `[value: string]`; parameters `value: string`)
- `itemSelect`: Emitted when item select occurs. (type `[event: MouseEvent, payload: { href: string; }]`; parameters `event: MouseEvent, payload: { href: string; }`)

### AnchorItemCompact

#### Props

Properties for the AnchorItemCompact component.

- `modelValue`: Current model value. (type `string`; optional)
- `item`: Current item data. (type `AnchorOptionData`; required)
- `linkProps`: Properties forwarded to the link element. (type `Omit<AnchorLinkProps, 'href'>`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `HTMLAttributes`; optional)
- `titleProps`: Properties forwarded to the title element. (type `HTMLAttributes`; optional)
- `subProps`: Properties forwarded to the sub element. (type `HTMLAttributes`; optional)

### AnchorLink

#### Props

Properties for the AnchorLink component.

- `href`: The link of anchor (type `string`; required)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `to`: Route Location the link should navigate to when clicked on. (type `string | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric`; optional)
- `external`: Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases (type `boolean`; optional)
- `target`: Where to display the linked URL, as the name for a browsing context. (type `(string & {}) | '_blank' | '_parent' | '_self' | '_top' | null`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### AnchorRoot

#### Props

Properties for the AnchorRoot component.

- `bounds`: Bounds. (type `number`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `getContainer`: Get container. (type `(() => AnchorContainer | null)`; optional)
- `getCurrentAnchor`: Get current anchor. (type `((activeHref: string) => string)`; optional)
- `modelValue`: Current model value. (type `string`; optional)
- `offsetTop`: Offset top. (type `number`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `replace`: Whether replace. (type `boolean`; optional)
- `targetOffset`: Target offset. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the AnchorRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `activeChange`: Emitted when active change occurs. (type `[value: string]`; parameters `value: string`)
- `itemSelect`: Emitted when item select occurs. (type `[event: MouseEvent, payload: { href: string; }]`; parameters `event: MouseEvent, payload: { href: string; }`)

## Notes

### Architecture and benchmark comparison

| Concern                  | VeanUI                                                        | Ant Design `Anchor`             | Element Plus `Anchor` |
| :----------------------- | :------------------------------------------------------------ | :------------------------------ | :-------------------- |
| Aria / styled separation | ✅ `@vean/aria/anchor` + `scv()`                              | ❌ single package               | ❌ single package     |
| Data-driven compact API  | ✅ generic `AnchorCompact` + recursive `items`                | ✅ `items`                      | ✅ `items`            |
| Scroll container         | ✅ `getContainer` (HTMLElement or window)                     | ✅ `getContainer`               | ✅ `container`        |
| Scroll offset            | ✅ `offsetTop` + `targetOffset`                               | ✅ `offsetTop` + `targetOffset` | ✅ `offset`           |
| Active bounds tolerance  | ✅ `bounds`                                                   | ✅ `bounds`                     | ✅ `bound`            |
| Active href transform    | ✅ `getCurrentAnchor`                                         | ✅ `getCurrentAnchor`           | —                     |
| Hash sync                | ✅ pushState on click / replaceState on scroll                | ✅                              | ✅                    |
| Initial hash scroll      | ✅                                                            | ✅                              | —                     |
| Sticky rail              | ✅ CSS `sticky` + offset var                                  | ✅ `affix` wrapper              | ✅ CSS sticky         |
| Nested items             | ✅ recursive (arbitrary depth)                                | ❌ flat                         | ✅ 2 levels           |
| Disabled items           | ✅ per-item + `linkProps` fallback                            | ❌                              | ❌                    |
| Custom link props        | ✅ `linkProps` / `indicatorProps` / `titleProps` / `subProps` | —                               | —                     |
| Orientation              | ✅ vertical / horizontal                                      | ❌ vertical only                | ✅ `direction`        |
| Theme colors / sizes     | ✅ 8 colors × 6 sizes                                         | ❌                              | ❌                    |
| Events                   | ✅ `activeChange` / `itemSelect`                              | ✅ `onChange` / `onClick`       | ✅ `change`           |

### Runtime considerations

1. **Measurement timing** — anchor positions are re-measured on every scroll event against the current scroll container. Sections that do not exist yet (or links not yet registered) are skipped, so the active item is only derived from registered links.
2. **Controlled vs. uncontrolled** — when `modelValue` is provided, internal writes only emit `update:modelValue`; the highlighted link follows the prop and no scrolling is triggered by external value changes.
3. **`getContainer` instability** — the component re-syncs whenever the container reference changes; returning a new element from every call causes repeated re-syncs, so memoize it when the element is created asynchronously.
4. **Hash-only links** — only links starting with `#` participate in scrolling and hash updates; plain/external hrefs are left to the browser's default navigation (and the `itemSelect` event still fires).
5. **Scroll-animation guard** — during the 300 ms after a programmatic scroll the scroll-spy is suspended so the intermediate positions do not flip the active item or rewrite the hash.
6. **Sticky rail** — `sticky` requires a scrollable ancestor for the rail to actually pin; the offset var keeps the rail below sticky headers. Set `sticky: false` for non-pinned usage.
7. **Disabled links** — a disabled item is inert: `aria-disabled="true"`, `tabindex="-1"`, and click/keyboard activation are blocked (no `itemSelect`). It stays registered so nested children can still be highlighted.

## FAQ

### How do I scroll an inner container instead of the window?

Pass `getContainer={() => myScrollableEl}`. Anchor positions are then measured relative to that element and scrolling is applied to it. When the element becomes available after mount, Anchor re-syncs automatically.

### How do I keep headings below a sticky header?

Set `offsetTop` to the header height. `SAnchor` scrolls to `elementTop - offsetTop` and exposes the same value as `--vean-anchor-offset-top` so the sticky anchor rail also clears the header. Use `targetOffset` if the anchor offset must differ from the scroll offset.

### Why does the address bar update on scroll?

This is intentional — scroll-driven changes use `history.replaceState` so the URL hash always matches the section in view without flooding the history. Click-driven jumps use `pushState` unless you set `replace`.

### How is the active section chosen?

A section becomes active once its measured top is at or above `offsetTop + bounds`. Among the passed sections the one closest to the threshold (the most recently crossed) is highlighted. `bounds` increases the tolerance; `getCurrentAnchor` lets you remap the resolved value before it is emitted.

### Can I disable or customize individual links?

Yes — each item supports `disabled` and `target`; global defaults go through `linkProps`. Because the item's `href` always owns the destination, `linkProps.href` is not part of the type. `indicatorProps` / `titleProps` / `subProps` forward HTML attributes to the per-item elements.

### What does the nested composition look like?

Each item renders an `AnchorLink` (indicator + title) and, when it has `children`, a `sub` container that recursively renders `AnchorItemCompact` levels. The wrapper carries `data-vean-anchor-item` with a `data-state` reflecting whether the item or any of its descendants is active.
