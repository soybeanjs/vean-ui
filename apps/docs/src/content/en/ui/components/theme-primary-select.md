---
head:
  title: ThemePrimarySelect
  description: 'SThemePrimarySelect is a context-bound dropdown bound to the active SConfigProvider theme. It lists every built-in palette and writes the chosen one back as the theme primary color, with a simple mode that shows a single 500 swatch.'
---

# ThemePrimarySelect

## Overview

`SThemePrimarySelect` is a context-bound dropdown bound to the active `SConfigProvider` theme. It lists all 26 built-in palettes (`PaletteKey`) and writes the selection back as the theme `primary`, so every token derived from the brand color updates at once.

Use it when a page needs a one-click brand color switch — a settings panel, a navbar color menu, or a compact replacement for the full `SThemeCustomizer`. Prefer `SThemeCustomizer` when the user also needs the base palette, radius, size, spacing, or custom presets.

It shares the theme context with `SThemeModeSelect` and `SThemeModeSwitch`: all of them read and write the same provider state, so they stay in sync without prop wiring.

## Usage

<UsageCode component="theme-primary-select" />

## Features

- 🎨 All 26 built-in palettes as options, sourced from the theme engine's own `PALETTE_KEYS`
- 🧩 `simple` mode collapses the palette stack to a single `500` swatch in the trigger and each option
- 🎚 `size` forwards to the underlying select trigger, matching the theme size scale (`xs`…`2xl`)
- 🔗 Writes through the shared theme context — no `modelValue`, no local mirror state
- ♿ Exposes an `aria-label` on the trigger so the select is reachable without visible text
- 🎯 Reuses the theme customizer's primary picker, so both surfaces render identical swatches

## Demos

<PlaygroundGallery component="theme-primary-select" />

## API

<ComponentApi component="theme-primary-select" />

## Notes

### Architecture and benchmark differences

| Aspect           | Vean                                                      | Ant Design / Element Plus                                     |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| Data source      | The theme engine's `PALETTE_KEYS` / `paletteColor`        | A color picker or a preset swatch list owned by the component |
| State            | Reads and writes the `SConfigProvider` theme context      | Usually a `v-model` color value the app persists              |
| Swatch rendering | `simple` toggles one `500` swatch vs. the 5-level stack   | Fixed swatch style per library                                |
| Styling          | Inherits UnoCSS + theme tokens; no dedicated style recipe | Dedicated SCSS / CSS variables                                |

- The component is **UI-only** (`@vean/ui`): it composes the existing `SSelect` and the shared `ColorDecorator`, so there is no `@vean/aria` counterpart.
- `simple` defaults to `true` because the component's purpose is the compact form. Set `simple="false"` to get the same five-level stack the theme customizer shows.

### Cautions

- It must be rendered inside an `SConfigProvider`; `useTheme` throws otherwise.
- It does not accept `modelValue`. To drive the primary color from your own store, use the theme context (`useTheme().primary`) or pass `theme` / `themeConfig` to the provider.
- `simple="false"` uses the customizer's default level stack `[100, 900, 300, 800, 600]`, which is intentionally not a light-to-dark ramp — it is a "brand identity" sample, not a scale.

## FAQ

### Why is there no `modelValue`?

The primary color belongs to the theme provider, not to this component. Binding it locally would create a second source of truth that drifts from the emitted CSS tokens. Read `useTheme().primary` if you need the current value.

### How do I show only the color dot without the palette name?

That is what `simple` does — it reduces the swatch stack to the single `500` color. The option label text still comes from the underlying select; hide it with the `ui` slot overrides on `SSelect` if you need an icon-only trigger.

### Can I limit the palette list?

Not through props today. The list comes from the theme engine's `PALETTE_KEYS`. Compose `SSelect` directly with a filtered `items` array if you need a subset.

### Why does the swatch color differ from the CSS variable I set?

Swatches are resolved through `paletteColor(key, level, 'hsl')` from the palette definition, not from computed CSS. An `overrides` entry on the theme changes the rendered tokens but not the palette sample.
