---
head:
  title: ThemeBaseSelect
  description: 'SThemeBaseSelect is a context-bound dropdown bound to the active SConfigProvider theme. It lists the neutral palettes and writes the chosen one back as the theme base color, with a simple mode that shows a single 500 swatch.'
---

# ThemeBaseSelect

## Overview

`SThemeBaseSelect` is a context-bound dropdown bound to the active `SConfigProvider` theme. It lists the nine neutral palettes (`NEUTRAL_PALETTES` — slate, mist, gray, zinc, neutral, stone, taupe, olive, mauve) and writes the selection back as the theme `base`, so every neutral surface token (background, card, border, muted) re-derives at once.

Use it when a page needs a one-click neutral surface switch — a settings panel, a navbar theme menu, or a compact replacement for the full `SThemeCustomizer`. Prefer `SThemeCustomizer` when the user also needs the primary palette, radius, size, spacing, or custom presets.

It shares the theme context with `SThemePrimarySelect`, `SThemeModeSelect` and `SThemeModeSwitch`: all of them read and write the same provider state, so they stay in sync without prop wiring.

## Usage

<UsageCode component="theme-base-select" />

## Features

- 🎨 All nine neutral palettes as options, sourced from the theme engine's own `NEUTRAL_PALETTES`
- 🧩 `simple` mode collapses the palette stack to a single `500` swatch in the trigger and each option
- 🎚 `size` forwards to the underlying select trigger, matching the theme size scale (`xs`…`2xl`)
- 🔗 Writes through the shared theme context — no `modelValue`, no local mirror state
- ♿ Exposes an `aria-label` on the trigger so the select is reachable without visible text
- 🎯 Shares the `ColorDecorator` swatch renderer with `SThemePrimarySelect`, so both surfaces render identical swatches

## Demos

<PlaygroundGallery component="theme-base-select" />

## API

<ComponentApi component="theme-base-select" />

## Notes

### Architecture and benchmark differences

| Aspect           | Vean                                                      | Ant Design / Element Plus                                     |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| Data source      | The theme engine's `NEUTRAL_PALETTES` / `paletteColor`    | A color picker or a preset swatch list owned by the component |
| State            | Reads and writes the `SConfigProvider` theme context      | Usually a `v-model` color value the app persists              |
| Swatch rendering | `simple` toggles one `500` swatch vs. the 5-level stack   | Fixed swatch style per library                                |
| Styling          | Inherits UnoCSS + theme tokens; no dedicated style recipe | Dedicated SCSS / CSS variables                                |

- The component is **UI-only** (`@vean/ui`): it composes the existing `SSelect` and the shared `ColorDecorator`, so there is no `@vean/aria` counterpart.
- `simple` defaults to `true` because the component's purpose is the compact form. Set `simple="false"` to get the same five-level stack the theme customizer shows.

### Cautions

- It must be rendered inside an `SConfigProvider`; `useTheme` throws otherwise.
- It does not accept `modelValue`. To drive the base color from your own store, use the theme context (`useTheme().base`) or pass `theme` / `themeConfig` to the provider.
- `simple="false"` uses the shared level stack `[100, 900, 300, 800, 600]`, which is intentionally not a light-to-dark ramp — it is a "surface identity" sample, not a scale.

## FAQ

### Why is there no `modelValue`?

The base color belongs to the theme provider, not to this component. Binding it locally would create a second source of truth that drifts from the emitted CSS tokens. Read `useTheme().base` if you need the current value.

### How is it different from `SThemePrimarySelect`?

Same shape, different token and different option set: `SThemeBaseSelect` writes `base` over the neutral palettes, `SThemePrimarySelect` writes `primary` over all 26 palettes. Use both side by side and they cover the customizer's whole palette section.

### Can I limit the palette list?

Not through props today. The list comes from the theme engine's `NEUTRAL_PALETTES`. Compose `SSelect` directly with a filtered `items` array if you need a subset.

### Why does the swatch color differ from the CSS variable I set?

Swatches are resolved through `paletteColor(key, level, 'hsl')` from the palette definition, not from computed CSS. An `overrides` entry on the theme changes the rendered tokens but not the palette sample.
