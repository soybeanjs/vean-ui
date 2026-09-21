# Affix

Source URL: https://veanui.com/components/affix
Markdown URL: https://veanui.com/components/affix.md
Category: Data Display
Description: Affix keeps content pinned to the top or bottom edge of the viewport or a custom scroll container while the target area is scrolling.

## Overview

Affix keeps content pinned to the top or bottom edge of the viewport or a custom scroll container while the target area is scrolling.

> Note: In addition to SAffix, the Aria layer also exports AffixCompact for the default placeholder/content structure, plus AffixRoot, AffixPlaceholder, AffixContent, and provideAffixUi for fully custom composition and style injection.

## Features

- **Pin to top or bottom** — `offsetTop` pins the content to the target's top edge once the placeholder scrolls past the threshold; `offsetBottom` pins it to the bottom edge. With neither set, the content affixes to the target's top at offset `0`.
- **Custom scroll target** — `target` accepts an `HTMLElement`, a CSS selector string, or `window` (default). Scroll, touch, resize, `load`, and `pageshow` events on the target trigger repositioning.
- **Placeholder preservation** — while affixed, a hidden placeholder (`role="presentation"`, `aria-hidden`) keeps the layout space so content below does not jump.
- **Reactive state** — `data-state="fixed|static"` on both root and content elements, plus a `change` event that fires only on state transitions (`true` when affixed, `false` when released).
- **Zero-size guard** — when the placeholder rect is all zeros (e.g. `display: none` or not yet rendered), positioning is skipped to avoid incorrectly fixing content.
- **Width & left preservation** — the fixed element keeps the placeholder's `width` and `left`, so layout and alignment are preserved across the transition.
- **rAF-throttled updates** — scroll/touch/resize handlers are coalesced through `useRafFn` (one measurement per frame), avoiding layout thrash during fast scrolling.
- **Dynamic target switching** — when the `target` prop changes, listeners are detached from the old target and attached to the new one via `onWatcherCleanup`.
- **Imperative API** — `AffixRoot` exposes `affixed` and `updatePosition()` via `defineExpose` for programmatic repositioning.
- **SSR safe** — `window` / `document` access is guarded (`getDefaultTarget` / `queryTargetSelector` / `measurePosition`); listeners activate client-side only.
- **Aria composition** — `AffixRoot` / `AffixPlaceholder` / `AffixContent` / `AffixCompact` are exported from `@vean/aria/affix` for fully custom styled builds.

## Usage

Usage examples for affix are rendered on the site.

## Demos

Interactive demos for affix are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): Affix, AffixCompact, AffixContent, AffixPlaceholder, AffixRoot.

### Affix

#### Props

Properties for the Affix component.

- `class`: Additional class names to apply to the content element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<AffixUi>`; optional)
- `placeholderProps`: Properties forwarded to the placeholder element. (type `AffixPlaceholderProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `AffixContentProps`; optional)
- `offsetTop`: The offset from the top of the target container when the element becomes affixed. (type `number`; default `0`; optional)
- `offsetBottom`: The offset from the bottom of the target container when the element becomes affixed. (type `number`; optional)
- `target`: The element that Affix listens to for scroll position updates. (type `AffixTarget | null`; default `window`; optional)

#### Emits

Events for the Affix component.

- `change`: Emitted when change occurs. (type `[affixed: boolean]`; parameters `affixed: boolean`)

### AffixCompact

#### Props

Properties for the AffixCompact component.

- `placeholderProps`: Properties forwarded to the placeholder element. (type `AffixPlaceholderProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `AffixContentProps`; optional)
- `offsetTop`: The offset from the top of the target container when the element becomes affixed. (type `number`; default `0`; optional)
- `offsetBottom`: The offset from the bottom of the target container when the element becomes affixed. (type `number`; optional)
- `target`: The element that Affix listens to for scroll position updates. (type `AffixTarget | null`; default `window`; optional)

#### Emits

Events for the AffixCompact component.

- `change`: Emitted when change occurs. (type `[affixed: boolean]`; parameters `affixed: boolean`)

### AffixContent

- No documented props, emits, slots, or slot props were available.

### AffixPlaceholder

- No documented props, emits, slots, or slot props were available.

### AffixRoot

#### Props

Properties for the AffixRoot component.

- `offsetTop`: The offset from the top of the target container when the element becomes affixed. (type `number`; default `0`; optional)
- `offsetBottom`: The offset from the bottom of the target container when the element becomes affixed. (type `number`; optional)
- `target`: The element that Affix listens to for scroll position updates. (type `AffixTarget | null`; default `window`; optional)

#### Emits

Events for the AffixRoot component.

- `change`: Emitted when change occurs. (type `[affixed: boolean]`; parameters `affixed: boolean`)

## Notes

### Architecture and benchmark comparison

| Concern                      | VeanUI                                     | Ant Design `Affix`              | Element Plus `Affix`     |
| :--------------------------- | :----------------------------------------- | :------------------------------ | :----------------------- |
| Aria / styled separation     | ✅ `@vean/aria/affix` + `scv()` recipe     | ❌ single styled package        | ❌ single styled package |
| Pin to top / bottom          | ✅ `offsetTop` / `offsetBottom`            | ✅ `offsetTop` / `offsetBottom` | ✅ `offset`              |
| Custom target                | ✅ element / selector / window             | ✅ `target` (function)          | ✅ `target` (function)   |
| Placeholder preservation     | ✅ hidden placeholder keeps space          | ✅ `placeholder` node           | ✅ `placeholder` node    |
| `change` event on transition | ✅ fires only on state change              | ✅ `onChange`                   | ✅ `on-change`           |
| rAF-throttled measurement    | ✅ `useRafFn` frame coalescing             | ✅ rAF loop                     | ✅ rAF loop              |
| Touch events                 | ✅ scroll + touchstart/move/end            | ✅ touch support                | —                        |
| Dynamic target switching     | ✅ listener cleanup via `onWatcherCleanup` | ✅ `updatePosition` re-init     | ✅ `update`              |
| Zero-size guard              | ✅ skips when rect is all zeros            | —                               | —                        |
| Imperative API               | ✅ `affixed` + `updatePosition()`          | ✅ `updatePosition`             | —                        |
| SSR safety                   | ✅ guarded `window` / `document`           | partial                         | partial                  |

### Runtime considerations

1. **Offsets are relative to the target rect** — `top = offsetTop + targetRect.top`, `bottom = offsetBottom + (window.innerHeight - targetRect.bottom)`. Both can be combined; the last computed one wins when both thresholds pass.
2. **Zero-size guard** — `isZeroRect` skips positioning while the placeholder rect is all zeros (not rendered, `display: none`, or hidden), avoiding spurious fixing during SSR hydration or animation.
3. **Measurement is rAF-coalesced** — `useRafFn({ immediate: false, once: true })` runs `measurePosition` at most once per animation frame, so a burst of scroll events triggers a single layout read.
4. **Listener lifecycle** — the scroll/touch listeners bind to the resolved target when it changes (via `onWatcherCleanup`); `load` / `pageshow` / `resize` bind to `window`. All are removed on unmount.
5. **`internalOffsetTop`** — when neither `offsetTop` nor `offsetBottom` is provided, `offsetTop` defaults to `0`, so content affixes flush to the target's top edge.
6. **No-op when target is missing** — if the selector target cannot be resolved (or `window` is unavailable during SSR), `measurePosition` resets to static and waits for the next opportunity to resolve.

## FAQ

### When does the content become affixed?

The content affixes when the placeholder's top scrolls past `targetRect.top - offsetTop` (for top pinning) or the placeholder's bottom passes `targetRect.bottom + offsetBottom` (for bottom pinning). Once affixed, the element switches to `position: fixed` and a placeholder keeps its original space.

### How do I use a custom scroll container instead of the window?

Pass the scroll container to `target` — either a DOM element or a CSS selector string (e.g. `target="#scroll-container"`). Scroll and touch events on that container drive the measurement.

### Why does the element keep its width when fixed?

The fixed style copies `width` and `left` from the placeholder's rect so the affixed element stays visually aligned with where it would have been in flow. The placeholder retains `height` and `width` to prevent layout shift.

### Does the `change` event fire on every scroll?

No — `change` fires only when the affixed state actually transitions (`true` when fixing, `false` when releasing). Scrolling while already fixed emits nothing.

### Is the placeholder announced to screen readers?

No — the placeholder is `role="presentation"` and `aria-hidden="true"`, so it is invisible to assistive technology and only preserves layout space.

### How do I reposition programmatically?

`AffixRoot` exposes `affixed` and `updatePosition()`. Call `updatePosition()` after layout changes that the component cannot observe (e.g. content size changes inside the fixed element).

### Does it work with SSR?

Yes — all `window` / `document` access is guarded. On the server the affix simply renders static content; positioning activates client-side once the element and target exist.

## Aria Composition

When the default placeholder/content structure is enough, import `AffixCompact` from `@vean/aria/affix`. If you need separate control over the root, placeholder, and content elements, compose the Aria primitives directly:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AffixContent, AffixPlaceholder, AffixRoot, provideAffixUi } from '@vean/aria';

const ui = computed(() => ({
  content: 'data-[state=fixed]:z-50'
}));

provideAffixUi(ui);
</script>

<template>
  <AffixRoot :offset-top="24">
    <AffixPlaceholder />
    <AffixContent>
      <button type="button">Back to top</button>
    </AffixContent>
  </AffixRoot>
</template>
```
