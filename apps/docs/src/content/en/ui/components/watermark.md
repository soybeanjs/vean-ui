---
head:
  title: Watermark
  description: "SWatermark overlays a repeating text or image pattern on top of page content to indicate ownership, confidentiality, or branding. It generates a tiled canvas data URL as the overlay's background-image, supports text and image watermarks with rotation, gap, offset, and cross-pattern configuration, and includes an optional anti-tamper defense mechanism that automatically restores the overlay if it is removed or modified via DevTools."
---

# Watermark

## Overview

`SWatermark` overlays a repeating text or image pattern on top of page content to indicate ownership, confidentiality, or branding. It generates a tiled canvas data URL as the overlay's `background-image`, supports text and image watermarks with rotation, gap, offset, and cross-pattern configuration, and includes an optional anti-tamper defense mechanism that automatically restores the overlay if it is removed or modified via DevTools.

> Note: In addition to `SWatermark`, the Aria layer also exports `WatermarkCompact` for the default root/overlay structure, plus `WatermarkRoot`, `WatermarkOverlay`, and `provideWatermarkUi` for fully custom composition and style injection.

## Usage

<UsageCode component="watermark" />

## Features

- 📝 **Text watermarks** — Render repeating text with configurable font size, family, color, and weight.
- 🖼️ **Image watermarks** — Pass an `image` URL to tile an image pattern; supports `crossOrigin: 'anonymous'` for CORS-enabled sources.
- 🔄 **Rotation** — Rotate watermarks by any angle (default `-22°`).
- 📐 **Gap and offset** — Control tile spacing via `gap: [x, y]` and positioning via `offset: [x, y]`.
- ✖️ **Cross pattern** — Set `cross: true` to render two overlapping watermarks along both diagonals.
- 🛡️ **Anti-tamper defense** — When `defense: true`, `MutationObserver` detects overlay removal or attribute tampering and automatically repairs the overlay by re-rendering it.
- 🖥️ **Fullscreen mode** — Set `fullscreen: true` to fix the overlay to the viewport instead of the parent container.
- 🔧 **Aria composition** — Export `WatermarkRoot` + `WatermarkOverlay` + `WatermarkCompact` for custom layouts; inject styles via `provideWatermarkUi`.
- 🌐 **SSR-safe** — Canvas generation guarded by `typeof window === 'undefined'`; overlay not rendered on server.

## Demos

<PlaygroundGallery component="watermark" />

## API

<ComponentApi component="watermark" />

## Notes

### Architecture and benchmark differences

`SWatermark` splits into an Aria layer that owns canvas generation, overlay state, and defense logic, and a styled layer that owns the `watermarkVariants` `scv()` recipe (root: `relative`, overlay: `absolute inset-0 pointer-events-none bg-repeat`). The Aria `WatermarkCompact` composes `WatermarkRoot` + `WatermarkOverlay` and provides the `repairOverlay` function for defense.

| Aspect              | VeanUI                                      | Ant Design `Watermark` | Element Plus `Watermark` | MUI Watermark |
| :------------------ | :------------------------------------------ | :--------------------- | :----------------------- | :------------ |
| Architecture        | Aria + styled split                         | styled only            | styled only              | styled only   |
| Text watermark      | ✅                                          | ✅                     | ✅                       | ✅            |
| Image watermark     | ✅ `crossOrigin: anonymous`                 | ✅                     | ✅                       | —             |
| Cross pattern       | ✅ `cross` prop                             | —                      | —                        | —             |
| Anti-tamper defense | ✅ `MutationObserver` (removal + attribute) | ✅ `MutationObserver`  | ✅ `MutationObserver`    | —             |
| Fullscreen mode     | ✅ `fullscreen` prop                        | ✅ `inherit`           | ✅ `content` slot        | —             |
| Aria export         | ✅ Root + Overlay + Compact                 | —                      | —                        | —             |
| Gap/offset control  | ✅ `gap` + `offset`                         | ✅ `gap` + `offset`    | ✅ `gap` + `offset`      | ✅ `gap`      |

### Runtime cautions

- **Canvas requirement**: Watermark generation uses `<canvas>` and `canvas.toDataURL()`. In environments without canvas support (e.g., some SSR setups), the overlay will not render — `generateWatermarkDataUrl` returns `undefined`.
- **CORS for images**: Image watermarks use `crossOrigin = 'anonymous'`. The image server must send appropriate CORS headers (`Access-Control-Allow-Origin`), otherwise the canvas becomes tainted and `toDataURL()` throws.
- **Defense is opt-in**: The `defense` prop defaults to `false`. Enable it with `defense: true` to activate `MutationObserver`-based tamper detection. Defense has a small performance cost due to observer callbacks.
- **Defense scope**: The defense mechanism detects overlay removal (via root's `childList` observer) and attribute tampering (via overlay's `attributes` observer). It checks `aria-hidden`, `class`, `style`, `hidden`, and `data-vean-watermark-overlay` attribute. If any is modified, the overlay is re-rendered via a `:key` increment.
- **`fullscreen` positioning**: When `fullscreen: true`, the overlay switches from `absolute inset-0` (parent-relative) to `fixed inset-0 z-9999` (viewport-fixed), covering the entire screen.

### Aria Composition

When the default root/overlay structure is enough, import `WatermarkCompact` from `@vean/aria/watermark`. If you need separate control over the root and overlay elements, compose the Aria primitives directly:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { WatermarkOverlay, WatermarkRoot, provideWatermarkUi } from '@vean/aria';

const ui = computed(() => ({
  root: 'relative',
  overlay: 'absolute inset-0 pointer-events-none bg-repeat'
}));

provideWatermarkUi(ui);
</script>

<template>
  <WatermarkRoot content="CONFIDENTIAL" :rotate="-22">
    <slot />
    <WatermarkOverlay />
  </WatermarkRoot>
</template>
```

### FAQ

**How do I add a watermark to the entire page?**
Set `fullscreen: true`: `<SWatermark content="CONFIDENTIAL" fullscreen />`. The overlay switches to `fixed inset-0 z-9999`, covering the viewport.

**How do I prevent users from removing the watermark via DevTools?**
Enable defense: `<SWatermark content="CONFIDENTIAL" defense />`. The component uses `MutationObserver` to detect overlay removal or attribute tampering and automatically re-renders the overlay. Note that this is not foolproof — determined users can still disable JavaScript or block observers.

**Can I use an image as the watermark pattern?**
Yes. Pass the `image` prop: `<SWatermark image="/logo.png" />`. The image is loaded with `crossOrigin = 'anonymous'`, so the server must send CORS headers. When both `content` and `image` are provided, `image` takes priority.

**What is the `cross` pattern?**
Set `cross: true` to render two overlapping watermarks — one along the main diagonal and one along the anti-diagonal with opposite rotation. This creates a denser, cross-shaped pattern.

**How do I control the tile spacing?**
Use the `gap` prop: `<SWatermark content="DRAFT" :gap="[200, 150]" />`. The first value is horizontal spacing, the second is vertical. Use `offset` to shift the watermark within each tile.
