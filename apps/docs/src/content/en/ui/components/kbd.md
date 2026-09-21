---
head:
  title: Kbd
  description: 'The SKbd component represents a keyboard input element, typically used to display keyboard shortcuts and key combinations. It wraps the native <kbd> element and optionally symbolizes key names (e.g., shift → ⇧, enter → ↵) with platform-aware resolution for modifier keys (meta, alt, ctrl).'
---

# Kbd

## Overview

The `SKbd` component represents a keyboard input element, typically used to display keyboard shortcuts and key combinations. It wraps the native `<kbd>` element and optionally symbolizes key names (e.g., `shift` → `⇧`, `enter` → `↵`) with platform-aware resolution for modifier keys (`meta`, `alt`, `ctrl`).

Use it in tooltips, help dialogs, or inline documentation to show shortcuts like `⌘K` or `Ctrl+S`.

## Usage

<UsageCode component="kbd" />

## Features

- ⌨️ **Symbolization** — Converts known key names (`shift`, `enter`, `tab`, arrows, etc.) to their Unicode symbols automatically.
- 🖥️ **Platform-aware modifiers** — `meta`, `alt`, and `ctrl` resolve to the correct symbol for the user's OS (`⌘`/`⌥`/`⌃` on macOS, `⊞`/`alt`/`ctrl` on Windows).
- 🎨 **Variants** — `solid`, `outline` (default), and `ghost` visual styles.
- 📐 **Size scaling** — Six sizes (`xs`–`2xl`) control height, min-width, and font size.
- 🌡️ **Raised effect** — Optional `raised` prop adds a 2px shadow for a tactile, key-cap appearance.
- 🔗 **Key groups** — When `value` is an array, a `data-group` attribute enables letter-spacing for readability.
- ♿ **Semantic** — Uses the native `<kbd>` element, which is inherently accessible to screen readers.
- 🌐 **Dark mode** — Uses semantic color tokens that adapt to dark themes automatically.

## Demos

<PlaygroundGallery component="kbd" />

## API

<ComponentApi component="kbd" />

## Notes

### Architecture and benchmark differences

VeanUI splits `Kbd` into an Aria layer (`@vean/aria/kbd`) that owns the `<kbd>` element, symbolization logic (via the `useKbd` composable), and `data-group` state, and a styled layer (`@vean/ui`) that owns the `cv()` variant recipe (size/variant/raised). This follows the shadcn/ui headless/styled separation. The `useKbd` composable is a `createSharedComposable` singleton that detects macOS via `navigator.userAgent`.

| Aspect         | VeanUI                                                         | shadcn/ui `Kbd` | Mantine `Kbd` | Ant Design |
| :------------- | :------------------------------------------------------------- | :-------------- | :------------ | :--------- |
| Architecture   | Aria + styled split                                            | styled only     | styled only   | —          |
| Symbolization  | `useKbd` composable; 20 key symbols + platform-aware modifiers | —               | —             | —          |
| Platform-aware | macOS / Windows modifier resolution via `navigator.userAgent`  | —               | —             | —          |
| Variants       | `solid` / `outline` / `ghost`                                  | —               | —             | —          |
| Size scaling   | `xs`–`2xl`                                                     | `sm`–`lg`       | `xs`–`xl`     | —          |
| Raised effect  | `raised` prop (2px shadow)                                     | —               | —             | —          |
| Key groups     | `data-group` + letter-spacing                                  | —               | —             | —          |

### Runtime cautions

- **Platform detection**: `useKbd` detects macOS via `navigator.userAgent` inside `onMounted`. On SSR, modifier keys (`meta`, `alt`, `ctrl`) render a space placeholder and update to the correct symbol after client hydration. This may produce a hydration mismatch warning for modifier keys; Vue resolves it on mount. Non-modifier keys (e.g., `shift` → `⇧`, `enter` → `↵`) are static and SSR-safe.
- **Case sensitivity**: Known key names in `KbdKey` are lowercase (`shift`, `enter`, `tab`). Passing a capitalized string like `Shift` will not match the symbol map and will fall back to `SHIFT` (uppercased). Always use lowercase key names for symbolization.
- **Singleton composable**: `useKbd` is a `createSharedComposable` — the platform detection runs once and is shared across all `SKbd` instances. This avoids repeated `navigator` checks.

### FAQ

**How do I display a key combination like `Ctrl+K`?**
Pass an array: `<SKbd :value="['ctrl', 'K']" />`. The component joins the symbolized values and adds `data-group` for letter-spacing. On macOS, `ctrl` resolves to `⌃` and the output is `⌃K`.

**How do I disable symbolization?**
Set `symbolize` to `false`: `<SKbd value="shift" :symbolize="false" />` renders the raw text `shift` instead of `⇧`.

**Why does my modifier key show a space on the server?**
`meta`, `alt`, and `ctrl` require platform detection (`navigator.userAgent`), which only runs in the browser. On SSR they render a space placeholder and update to the correct symbol (`⌘`, `⌥`, `⌃`) after hydration. Use non-modifier keys or accept the hydration update for modifier-based shortcuts.

**How do I customize the content entirely?**
Use the default slot: `<SKbd><span class="my-style">⌘P</span></SKbd>`. The slot replaces the `value` prop entirely.
