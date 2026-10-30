# ThemeModeToggle

Source URL: https://veanui.com/components/theme-mode-toggle
Markdown URL: https://veanui.com/components/theme-mode-toggle.md
Category: Utilities
Description: SThemeModeToggle is a context-bound cycling button bound to the active SConfigProvider theme. Each click advances the preference through auto → light → dark → auto, and the icon shows the current preference (monitor / sun / moon). Use it when a header needs a single compact control that can also express and return to auto.

## Overview

`SThemeModeToggle` is a context-bound cycling button bound to the active `SConfigProvider` theme. Each click advances the preference through `auto` → `light` → `dark` → `auto`, and the icon always shows the _current_ preference (monitor / sun / moon). Use it as a one-button scheme control in a header or toolbar when a dropdown is too heavy and a binary switch cannot express `auto`.

## Usage

Usage examples for theme-mode-toggle are rendered on the site.

## Features

- 🔁 Cycles `auto` → `light` → `dark` → `auto` in one click each
- 🖼 Icon reflects the _current_ preference, so all three states are distinguishable
- 🎚 Writes the preference through the shared theme context — no `modelValue`
- ♿ Accessible name is the localized `Scheme: <current>` text (overridable via `ariaLabel`), and it doubles as the tooltip
- 🎨 Inherits `size` / `color` / `variant` / `shape` from `SButtonIcon`

## Demos

Interactive demos for theme-mode-toggle are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): ThemeModeToggle.

### ThemeModeToggle

#### Props

Properties for the ThemeModeToggle component.

A context-bound cycling button bound to the active `SConfigProvider` theme.
Each click advances the preference through `auto` -> `light` -> `dark` ->
`auto`, and the icon always shows the _current_ preference (monitor / sun /
moon) — so unlike `SThemeModeSwitch` it can express and return to `auto`
without a dropdown.

- `size`: Visual size of the button. (type `ThemeSize`; default `'md'`; optional)
- `color`: Theme color of the button. (type `ThemeColor`; default `'accent'`; optional)
- `variant`: Visual variant of the button. (type `ButtonVariant`; default `'ghost'`; optional)
- `shape`: Shape of the button. (type `ButtonShape`; default `'square'`; optional)
- `ariaLabel`: Accessible label of the button. Defaults to the localized `Scheme: <current preference>` text, which also drives the `title` tooltip. (type `string`; optional)

## Notes

### Scope

Like `SThemeModeSelect`, `SThemeModeSwitch`, and `SThemeModeSegment`, `SThemeModeToggle` is a theme-layer component that operates on the theme context from a parent `SConfigProvider`. It does not accept a `modelValue`; the preference is owned by the provider and shared across all theme components. It is the single-button counterpart of `SThemeModeSegment`: same three preferences, no dropdown and no visible option list.

### Cautions

- The component must be rendered inside a `SConfigProvider`, otherwise `useTheme` throws.
- Unlike `SThemeModeSwitch`, it tracks the _preference_, not the effective scheme: with `auto` the icon stays a monitor even though the resolved scheme is light or dark.
- Cycling always moves forward, so reaching a specific preference takes up to two clicks; use `SThemeModeSelect` or `SThemeModeSegment` for direct selection.
