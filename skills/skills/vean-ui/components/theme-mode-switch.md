# ThemeModeSwitch

Source URL: https://veanui.com/components/theme-mode-switch
Markdown URL: https://veanui.com/components/theme-mode-switch.md
Category: Other
Description: SThemeModeSwitch is a context-bound toggle bound to the active SConfigProvider theme. It reflects the current _effective_ scheme (so an auto preference shows the OS-resolved light/dark state) and pins an explicit light / dark preference when toggled. Use it as a quick, compact light/dark switch in a header or toolbar.

## Overview

`SThemeModeSwitch` is a context-bound toggle bound to the active `SConfigProvider` theme. It reflects the current _effective_ scheme (so an `auto` preference shows the OS-resolved light/dark state) and pins an explicit `light` / `dark` preference when toggled. Use it as a quick, compact light/dark switch in a header or toolbar.

## Usage

Usage examples for theme-mode-switch are rendered on the site.

## Features

- 🌓 Reflects the _effective_ scheme — with `auto`, the thumb tracks the OS `prefers-color-scheme`
- 🎚 Pins an explicit preference on toggle, overriding any `auto` resolution
- 🎨 Inherits `size` and `color` from the theme, with a sun/moon icon by default
- ♿ Forwards an accessible label to the `role="switch"` control (`axe`-clean)
- 🧩 `showIcon` toggles the sun/moon glyph

## Demos

Interactive demos for theme-mode-switch are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): ThemeModeSwitch.

### ThemeModeSwitch

#### Props

Properties for the ThemeModeSwitch component.

A context-bound toggle bound to the active `SConfigProvider` theme. It shows
the current _effective_ scheme (so an `auto` preference is reflected as the
OS-resolved light/dark) and pins an explicit `light` / `dark` preference when
toggled. To restore `auto`, use `SThemeModeSelect`.

- `size`: Visual size of the switch. (type `ThemeSize`; default `'md'`; optional)
- `color`: Theme color of the switch track. (type `ThemeColor`; default `'accent'`; optional)
- `showIcon`: Whether to render a sun/moon icon inside the switch thumb. (type `boolean`; default `true`; optional)
- `aria-label`: Accessible label for the switch control. (type `string`; default `'Toggle color scheme'`; optional)

## Notes

### Scope

`SThemeModeSwitch` is a theme-layer component that operates directly on the theme context from a parent `SConfigProvider`. It does not accept a `modelValue`; state is owned by the provider and shared across all theme components. To select `auto` (which a binary switch cannot express), pair it with `SThemeModeSelect`.

### Cautions

- The component must be rendered inside a `SConfigProvider` that provides the theme context, otherwise `useTheme` throws.
- Toggling a switch that is currently following `auto` pins an explicit `light` / `dark` preference; use `SThemeModeSelect` to return to `auto`.
