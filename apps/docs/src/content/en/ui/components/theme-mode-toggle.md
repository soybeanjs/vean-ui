---
head:
  title: ThemeModeToggle
  description: 'SThemeModeToggle is a context-bound cycling button bound to the active SConfigProvider theme. Each click advances the preference through auto → light → dark → auto, and the icon shows the current preference (monitor / sun / moon). Use it when a header needs a single compact control that can also express and return to auto.'
---

# ThemeModeToggle

## Overview

`SThemeModeToggle` is a context-bound cycling button bound to the active `SConfigProvider` theme. Each click advances the preference through `auto` → `light` → `dark` → `auto`, and the icon always shows the _current_ preference (monitor / sun / moon). Use it as a one-button scheme control in a header or toolbar when a dropdown is too heavy and a binary switch cannot express `auto`.

## Usage

<UsageCode component="theme-mode-toggle" />

## Features

- 🔁 Cycles `auto` → `light` → `dark` → `auto` in one click each
- 🖼 Icon reflects the _current_ preference, so all three states are distinguishable
- 🎚 Writes the preference through the shared theme context — no `modelValue`
- ♿ Accessible name is the localized `Scheme: <current>` text (overridable via `ariaLabel`), and it doubles as the tooltip
- 🎨 Inherits `size` / `color` / `variant` / `shape` from `SButtonIcon`

## Demos

<PlaygroundGallery component="theme-mode-toggle" />

## API

<ComponentApi component="theme-mode-toggle" />

## Notes

### Scope

Like `SThemeModeSelect`, `SThemeModeSwitch`, and `SThemeModeSegment`, `SThemeModeToggle` is a theme-layer component that operates on the theme context from a parent `SConfigProvider`. It does not accept a `modelValue`; the preference is owned by the provider and shared across all theme components. It is the single-button counterpart of `SThemeModeSegment`: same three preferences, no dropdown and no visible option list.

### Cautions

- The component must be rendered inside a `SConfigProvider`, otherwise `useTheme` throws.
- Unlike `SThemeModeSwitch`, it tracks the _preference_, not the effective scheme: with `auto` the icon stays a monitor even though the resolved scheme is light or dark.
- Cycling always moves forward, so reaching a specific preference takes up to two clicks; use `SThemeModeSelect` or `SThemeModeSegment` for direct selection.
