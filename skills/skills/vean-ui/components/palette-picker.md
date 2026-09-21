# PalettePicker

Source URL: https://veanui.com/components/palette-picker
Markdown URL: https://veanui.com/components/palette-picker.md
Category: Forms
Description: SPalettePicker is a color picker that produces a full palette from a single base color. Its modelValue is a ColorValue — either a Tailwind palette key + level (e.g. indigo.500), a simple palette key (black / white / transparent …), or a raw custom color (hsl(...) / oklch(...)).

## Overview

`SPalettePicker` is a color picker that produces a full palette from a single base color. Its `modelValue` is a [`ColorValue`](/overview/theming) — either a Tailwind palette key + level (e.g. `indigo.500`), a simple palette key (`black` / `white` / `transparent` …), or a raw custom color (`hsl(...)` / `oklch(...)`).

## Usage

Usage examples for palette-picker are rendered on the site.

## Features

- 🎯 `modelValue` is a `ColorValue`, directly consumable by the theme system
- 🎨 Pick a Tailwind palette key, then a level, for a clean `key.level` value
- ⚫ Or pick a simple palette key (`black`, `white`, `transparent` …)
- 🌐 Built-in palette color names are localized (follow the current locale)
- ✨ **Custom** mode: pick any color with a `ColorPicker`, see the generated palette, click any level to select/highlight it, and toggle **Recommended palette** to snap the display to the nearest Tailwind palette
- 📤 Emits `paletteChange` with the full generated palette so consumers can register it as a theme preset
- 🌈 `format` (`hsl` / `oklch`) controls how the custom color is serialized

## Demos

Interactive demos for palette-picker are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): PalettePicker.

### PalettePicker

#### Props

Properties for the PalettePicker component.

- `size`: Visual size of the component. (type `ThemeSize`; default `'md'`; optional)
- `format`: Output color space used to serialize the custom color into a `ColorValue`. (type `ColorFormat`; default `'hsl'`; optional)

## Notes

### Custom mode & theme presets

The theme engine's custom presets must be registered. When the user edits a custom color, listen to `paletteChange` and feed `payload.palette` into your registration flow; the emitted `payload.value` is the committed `ColorValue`.

### Recommended palette

In custom mode the generated palette levels are clickable — clicking a level highlights it (like the built-in level selector). When **Recommended palette** is enabled, `generateNearestPalette` snaps the palette to the nearest built-in Tailwind palette, and picking a level commits that palette's `key.level` value. When disabled, the raw custom color is committed in the configured `format`, and clicking a level only highlights it.
