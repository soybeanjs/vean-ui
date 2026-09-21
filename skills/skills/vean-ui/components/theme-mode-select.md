# ThemeModeSelect

Source URL: https://veanui.com/components/theme-mode-select
Markdown URL: https://veanui.com/components/theme-mode-select.md
Category: Other
Description: SThemeModeSelect is a context-bound dropdown bound to the active SConfigProvider theme. It exposes the three ThemeModePreference options — auto (follows the OS prefers-color-scheme), light, and dark — each with a scheme icon, letting users pick a color scheme preference directly.

## Overview

`SThemeModeSelect` is a context-bound dropdown bound to the active `SConfigProvider` theme. It exposes the three `ThemeModePreference` options — `auto` (follows the OS `prefers-color-scheme`), `light`, and `dark` — each with a scheme icon, letting users pick a color scheme preference directly.

## Usage

Usage examples for theme-mode-select are rendered on the site.

## Features

- 🌓 Three options — `auto` / `light` / `dark`, matching the theme `mode` type
- 🎚 Selection writes the preference through the shared theme context
- 🎨 Inherits `size` from the theme, with per-option scheme icons by default
- 🧩 `showIcon` toggles the monitor / sun / moon glyphs in the trigger and options

## Demos

Interactive demos for theme-mode-select are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): ThemeModeSelect.

### ThemeModeSelect

#### Props

Properties for the ThemeModeSelect component.

A context-bound dropdown bound to the active `SConfigProvider` theme. It
offers the three `ThemeModePreference` options — `auto` (follows the OS
`prefers-color-scheme`), `light`, and `dark`.

- `size`: Visual size of the select trigger. (type `ThemeSize`; default `'md'`; optional)
- `showIcon`: Whether to render a scheme icon (monitor / sun / moon) in the trigger and each option. (type `boolean`; default `true`; optional)

## Notes

### Scope

Like `SThemeModeSwitch`, `SThemeModeSelect` is a theme-layer component that operates on the theme context from a parent `SConfigProvider`. It does not accept a `modelValue`; the preference is owned by the provider and shared across all theme components.

### Cautions

- The component must be rendered inside a `SConfigProvider`, otherwise `useTheme` throws.
- `auto` is a _preference_ — the resolved scheme (`light` / `dark`) still depends on the OS `prefers-color-scheme` and is exposed as `effectiveMode` on the theme context.
