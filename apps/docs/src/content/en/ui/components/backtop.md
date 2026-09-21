---
head:
  title: Backtop
  description: 'SBacktop reveals a floating button after the scroll target passes a configurable threshold and smoothly scrolls that target back to the top when activated. It wraps SButton with scroll-position tracking, requestAnimationFrame-based smooth scrolling, and prefers-reduced-motion support. Use it to let users quickly return to the top of long pages or scrollable containers.'
---

# Backtop

## Overview

`SBacktop` reveals a floating button after the scroll target passes a configurable threshold and smoothly scrolls that target back to the top when activated. It wraps `SButton` with scroll-position tracking, `requestAnimationFrame`-based smooth scrolling, and `prefers-reduced-motion` support. Use it to let users quickly return to the top of long pages or scrollable containers.

> Note: In addition to `SBacktop`, the Aria layer also exports `Backtop` for custom composition.

## Usage

<UsageCode component="backtop" />

## Features

- 📏 **Visibility threshold** — The button appears only after scrolling past `visibilityHeight` pixels (default `400`).
- 🎬 **Smooth animation** — Scrolls to top with an `easeInOutCubic` easing over `duration` ms (default `300`). Set `duration={0}` for instant scroll.
- ♿ **Reduced motion** — Respects `prefers-reduced-motion: reduce`; skips animation and scrolls instantly when the user prefers reduced motion.
- 🎯 **Flexible target** — `target` accepts `window` (default), an `HTMLElement`, a `Ref<HTMLElement>`, or a CSS selector string.
- 🔧 **Aria composition** — The Aria `Backtop` is exported separately for custom button styling; `SBacktop` provides preset `buttonVariants` + fixed positioning.
- 🎨 **Full button props** — Inherits all `ButtonProps` (color, size, variant, shape, shadow, disabled, etc.) plus `icon`/`iconClass`/`iconProps` for the default icon.
- 📡 **Events** — Emits `change` (visibility toggled) and `click` (button clicked).
- 🌐 **SSR-safe** — Guards all browser APIs (`window`, `document`, `matchMedia`); renders without errors on the server.

## Demos

<PlaygroundGallery component="backtop" />

## API

<ComponentApi component="backtop" />

## Notes

### Architecture and benchmark differences

`SBacktop` splits into an Aria layer that owns scroll tracking, target resolution, animation, and visibility state, and a styled layer that owns the `backtopVariants` recipe (extends `buttonVariants` with `fixed z-50` and size-based `bottom-* end-*` positioning). This follows the VeanUI Aria/styled separation pattern.

| Aspect               | VeanUI                                          | Ant Design `BackTop`        | Element Plus `Backtop`      | Naive UI `BackTop`          |
| :------------------- | :---------------------------------------------- | :-------------------------- | :-------------------------- | :-------------------------- |
| Architecture         | Aria + styled split                             | styled only                 | styled only                 | styled only                 |
| Smooth scrolling     | `requestAnimationFrame` + `easeInOutCubic`      | `requestAnimationFrame`     | `requestAnimationFrame`     | `requestAnimationFrame`     |
| Reduced motion       | ✅ `prefers-reduced-motion`                     | —                           | —                           | —                           |
| Target type          | `window` / `HTMLElement` / `Ref` / CSS selector | `HTMLElement` / function    | `HTMLElement` / string      | `HTMLElement` / string      |
| Visibility threshold | `visibilityHeight` (number)                     | `visibilityHeight` (number) | `visibilityHeight` (number) | `visibilityHeight` (number) |
| Animation duration   | `duration` (ms)                                 | —                           | —                           | —                           |
| Aria export          | ✅ `Backtop`                                    | —                           | —                           | —                           |
| Disabled state       | ✅ inherited from Button                        | —                           | —                           | —                           |

### Runtime cautions

- **`hidden` attribute**: When the button is not visible, the Aria layer sets `hidden` on the `<button>` element, which applies `display: none`. This prevents CSS transitions on show/hide. If you need fade transitions, override `[hidden] { display: block; }` and use opacity/visibility transitions in your custom class.
- **Focus management**: When the button becomes hidden while focused (e.g., after scrolling to top), the Aria layer automatically blurs it to prevent focus being trapped on a hidden element.
- **Scroll listener cleanup**: The Aria layer uses `useEventListener` with `onWatcherCleanup` to remove scroll listeners when the target changes or the component unmounts. No manual cleanup is needed.
- **`target` reactivity**: Changing `target` or `visibilityHeight` at runtime triggers target re-resolution and a visibility re-check via `nextTick`.

### FAQ

**How do I target a specific scrollable container?**
Pass the element or a CSS selector: `<SBacktop target="#my-scroll-container" />` or `<SBacktop :target="scrollRef" />`. The component resolves the target and listens to its `scroll` event.

**How do I disable the smooth animation?**
Set `duration={0}`: `<SBacktop :duration="0" />`. The component also automatically skips animation when the user has `prefers-reduced-motion: reduce` enabled.

**Can I use a custom button instead of the default?**
Yes. Import the Aria `Backtop` from `@vean/aria/backtop` and compose it with your own button:

```vue
<script setup lang="ts">
import { Backtop } from '@vean/aria/backtop';
</script>

<template>
  <Backtop :visibility-height="200" class="my-custom-button">
    <MyIcon />
  </Backtop>
</template>
```

**Why does the button disappear immediately after clicking?**
After scrolling to top, the scroll position drops below `visibilityHeight`, so the button hides. The Aria layer blurs the button before hiding it to avoid focus being trapped on a hidden element.

**How do I change the default icon?**
Pass the `icon` prop: `<SBacktop icon="lucide:chevron-up" />`. Use `iconClass` for icon styling and `iconProps` for additional `SIcon` props.
