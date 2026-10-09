# ThemeCustomizer

Source URL: https://veanui.com/components/theme-customizer
Markdown URL: https://veanui.com/components/theme-customizer.md
Category: Utilities
Description: SThemeCustomizer is the visual theme editing panel behind the Vean theme engine — mode, palette, radius, size, spacing, fonts, feedback scheme, and per-token light/dark overrides. It does not own a container (popover / drawer / sidebar); the caller hosts it and decides the shell.

## Overview

`SThemeCustomizer` is the visual editing body of the Vean theme engine: it exposes every `ThemeOptions` field plus per-token light/dark overrides, and writes each change straight to the running theme. Use it when an application wants to ship an in-app theme settings surface.

It is a **body, not a shell** — it renders no popover, drawer, or sidebar of its own. Host it wherever the application wants: a `SPopover` behind a settings button, a `SDrawer` panel, or an inline sidebar region. That split is deliberate: the panel keeps a stable fixed box, and the host decides the container.

It reads and writes the theme context owned by the surrounding `SConfigProvider`, so it pairs with `SThemeModeSegment` / `SThemeModeSelect` when the host also needs a compact light/dark control.

## Usage

Usage examples for theme-customizer are rendered on the site.

## Features

- 🧭 Two top-level tabs — **Theme** (routine settings) and **Custom** (per-token overrides)
- 🗂 Eight selectable sections via `sections`: `mode` / `palette` / `radius` / `size` / `spacing` / `font` / `scheme` / `advanced`
- 🎨 Seven-slot `ui` map (`root` / `tabs` / `content` / `panel` / `actions`) for shell overrides
- 🧱 A stable box — fixed `w-96 h-[70vh]` with a scrolling content region and `scrollbar-gutter: stable`, so switching tabs never resizes the host popover
- 🌗 Mode handled by `SThemeModeSegment`, so `auto` resolves through the OS rather than a binary toggle
- ✍️ Font editing across four arms (`sans` / `serif` / `mono` / `heading`), each accepting a preset key or a custom stack
- 🧬 **Custom** tab flattens ~41 semantic tokens by group and renders `final` values, so an override shows the current derived token
- ♿ Localized labels, `size` forwarded to every child control, and an `axe`-clean panel
- ⚡ Advanced groups mount one animation frame at a time, so opening **Custom** does not block the first paint

## Demos

Interactive demos for theme-customizer are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): ThemeCustomizer.

### ThemeCustomizer

#### Props

Properties for the ThemeCustomizer component.

A real-app reusable theme settings body. It does not own any container
(popover / drawer / sidebar) — the caller hosts it and decides the shell.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component shell. `ui.root` carries the outer box, so a host can drop the default fixed width / height (`w-96 h-[70vh]`) when it already constrains the surface itself. (type `Partial<ThemeCustomizerUi>`; optional)
- `sections`: The sections to show (defaults to all). (type `ThemeCustomizerSection[]`; optional)
- `size`: The size forwarded to the underlying controls. (type `ThemeSize`; optional)
- `persist`: Whether to persist changes to storage. (type `boolean`; default `true`; optional)
- `showActions`: Whether to show the bottom action row (save preset / reset). (type `boolean`; default `true`; optional)
- `labelResolver`: Resolve a label key (section / group / variant token) to a display string. (type `((key: string) => string)`; optional)

## Notes

### Architecture and benchmark differences

| Aspect      | Vean                                                                                                                                                                   | Ant Design / Element Plus / Mantine                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Engine      | One theme engine (`@vean/theme`) with a single token contract; the panel edits engine options directly                                                                 | Per-library theme algorithm or CSS-variable preset; panel is coupled to the library's own config shape |
| Container   | `SThemeCustomizer` is a **body only** — no popover / drawer / modal wrapper                                                                                            | Usually a modal or drawer component with the panel baked in                                            |
| Overrides   | Two layers: `ThemeOptions` fields plus per-token light/dark overrides with a live `final` preview                                                                      | A color-picker list or a raw JSON/css-var editor on a separate route                                   |
| Persistence | `SConfigProvider` owns the single `__VEAN_THEME` envelope writer; the panel never writes storage itself                                                                | Persistence is left to the application                                                                 |
| Tokens      | Flat semantic-token contract; the panel's groups (`surfaces` / `fills` / `hairlines` / `brand` / `sidebar` / `feedback` / `charts`) are a presentation vocabulary only | Groups and tokens are the same list                                                                    |

### Cautions

- **Must live inside a `SConfigProvider`.** The panel reads `useTheme()` and throws (via `useTheme('ThemeCustomizer')`) when no provider supplies the theme context.
- **`persist` is currently a no-op.** `SConfigProvider` is the single envelope writer (`apply` → `setThemeState` → the derived payload), so the panel does not write `__VEAN_THEME` itself; persistence follows the provider's `persistTheme` setting.
- **No `modelValue`.** The panel is not a controlled form: changes apply to the running theme immediately, and there is no cancel.
- **`sections` is exhaustive whitelist filtering.** Sections you omit are not rendered; the `mode` section renders only `SThemeModeSegment`, and `advanced` covers both the token-override tab and the border-opacity / surface-style rows.
- **The `Custom` tab is heavy.** It mounts ~41 `SPalettePicker`s (each wrapping a full `SSelect`), so groups are appended one `requestAnimationFrame` at a time — assert on the mounted state, not on the first frame.
- **`ui.root` is the box escape hatch.** A host that already constrains the surface should override it to drop the default `w-96 h-[70vh]`.
- **The font arms do not load fonts.** Selecting a family only writes the CSS variable; loading the font file stays the application's job.

## FAQ

### How do I show only a few sections?

Pass `sections`, e.g. `:sections="['mode', 'palette', 'radius']"`. The array is a whitelist and defaults to all eight sections.

### How do I host it in a popover?

Wrap the panel in your own container — the basic example uses `SPopover` with a settings trigger. If the host already sizes the surface, override `ui.root` to drop the default fixed width and height.

### Where do the changes go?

Into the live theme context of the surrounding `SConfigProvider`. Each edit commits to the runtime immediately and re-emits the provider's theme event; persistence is the provider's job.

### How do I get a light/dark control outside the panel?

Use `SThemeModeSwitch` for a compact toggle or `SThemeModeSelect` when `auto` must be selectable. Both bind to the same theme context, so they stay in sync with the panel's `mode` section.

### How do I add a custom reset?

`showActions` renders a reset row that calls `useThemeSettings().reset`. To control the reset target yourself, hide the row (`:show-actions="false"`) and snap the theme back through `SConfigProvider` / `setThemeState`.

### Why does a token edit show a different value than I typed?

The `Custom` tab binds each `SPalettePicker` to the **derived** token (`variants.final`), not to the raw override. Once committed, edits stay exact: an override is written verbatim, but a value outside the override list displays the engine's current derived result.
