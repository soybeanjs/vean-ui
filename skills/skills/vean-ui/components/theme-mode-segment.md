# ThemeModeSegment

Source URL: https://veanui.com/components/theme-mode-segment
Markdown URL: https://veanui.com/components/theme-mode-segment.md
Category: Other
Description: SThemeModeSegment is a context-bound segmented control bound to the active SConfigProvider theme. It exposes the three ThemeModePreference options — auto (follows the OS prefers-color-scheme), light, and dark — as icon-led segment options, letting users pick a color scheme preference directly. Visual props are inherited from the Segment component, with shape defaulting to rounded.

## Overview

`SThemeModeSegment` is a context-bound segmented control bound to the active `SConfigProvider` theme. It exposes the three `ThemeModePreference` options — `auto` (follows the OS `prefers-color-scheme`), `light`, and `dark` — as icon-led segment options, letting users pick a color scheme preference directly. Use it when all three preferences should be visible at a glance, such as in a header, settings panel, or customizer.

## Usage

Usage examples for theme-mode-segment are rendered on the site.

## Features

- 🌓 Three options — `auto` / `light` / `dark`, matching the theme `mode` type
- 🎚 Selection writes the preference through the shared theme context
- 🎨 Inherits `Segment` visual props (`size` / `shape` / `fill` / …), with `shape` defaulting to `rounded`
- 🖼 Scheme icons (monitor / sun / moon) are always rendered; `showLabel` adds the localized label next to them (hidden labels still provide accessible names)

## Demos

Interactive demos for theme-mode-segment are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): ThemeModeSegment.

### ThemeModeSegment

#### Props

Properties for the ThemeModeSegment component.

A context-bound segmented control bound to the active `SConfigProvider`
theme. It exposes the three `ThemeModePreference` options — `auto` (follows
the OS `prefers-color-scheme`), `light`, and `dark` — as icon-led segment
options. Visual props are inherited from `SegmentProps` (with `shape`
defaulting to `rounded`); `items`, `modelValue`, and `defaultValue` are not
exposed — the option list is fixed and the state is owned by the theme
context shared across all theme components.

- `showLabel`: Whether to render the localized label next to the scheme icon. When `false`, the label stays visually hidden so each option keeps an accessible name. (type `boolean`; default `false`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `fill`: Fill. (type `SegmentFill`; optional)
- `shape`: Shape of the component. (type `SegmentShape`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `SegmentTriggerProps`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `listProps`: Properties forwarded to the list element. (type `SegmentListProps`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<SegmentUi>`; optional)
- `enableIndicator`: Whether to enable indicator. (type `boolean`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `SegmentIndicatorProps`; optional)
- `activationMode`: Whether a tab is activated automatically (on focus) or manually (on click). (type `TabsActivationMode`; default `automatic`; optional)

## Notes

### Scope

Like `SThemeModeSelect` and `SThemeModeSwitch`, `SThemeModeSegment` is a theme-layer component that operates on the theme context from a parent `SConfigProvider`. It does not accept a `modelValue`; the preference is owned by the provider and shared across all theme components. It is the segmented counterpart of `SThemeModeSelect` — same three options, no dropdown.

### Cautions

- The component must be rendered inside a `SConfigProvider`, otherwise `useTheme` throws.
- `auto` is a _preference_ — the resolved scheme (`light` / `dark`) still depends on the OS `prefers-color-scheme` and is exposed as `effectiveMode` on the theme context.
- `items`, `modelValue`, and `defaultValue` are not exposed: the option list is fixed and the state lives in the theme context.
