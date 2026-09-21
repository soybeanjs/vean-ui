---
head:
  title: Spinner
  description: 'SSpinner is a lightweight loading indicator built on top of SIcon. It defaults to the Iconify svg-spinners collection and is suitable for inline loading states such as button loading, content placeholders, and async fetch indicators. Use the color and size props to match the surrounding UI, or swap the icon prop for any svg-spinners:* animation.'
---

# Spinner

## Overview

`SSpinner` is a lightweight loading indicator built on top of `SIcon`. It defaults to the Iconify `svg-spinners` collection and is suitable for inline loading states such as button loading, content placeholders, and async fetch indicators. Use the `color` and `size` props to match the surrounding UI, or swap the `icon` prop for any `svg-spinners:*` animation.

## Usage

<UsageCode component="spinner" />

## Features

- 🎬 **Iconify svg-spinners** — Defaults to `svg-spinners:270-ring`; swap with any icon from the `svg-spinners` collection via the `icon` prop.
- 🎨 **Theme colors** — Eight color options (`current`, `primary`, `destructive`, `success`, `warning`, `info`, `carbon`, `secondary`, `accent`) using semantic tokens.
- 📐 **Size scaling** — Six sizes (`xs`–`2xl`) control the spinner dimensions.
- 🔧 **Icon passthrough** — All `SIcon` props (except `icon` and `color`) are forwarded, so `width`, `height`, `ssr`, and ARIA attributes pass through naturally.
- ♿ **Accessible by opt-in** — Pass `aria-label="Loading"` to announce the spinner to screen readers; defaults to `aria-hidden` for inline use inside text-bearing elements.
- 🌐 **Dark mode** — Uses semantic color tokens that adapt to dark themes automatically.

## Demos

<PlaygroundGallery component="spinner" />

## API

<ComponentApi component="spinner" />

## Notes

### Architecture and benchmark differences

`SSpinner` is a UI-only component — it has no Aria layer because it is a thin preset over `SIcon` (which already has an Aria layer). It applies the `spinnerVariants` `cv()` recipe (color/size) and forwards all other `IconProps` to `SIcon`. This matches the shadcn/ui `Spinner` approach of wrapping an icon with preset styling.

| Aspect         | VeanUI                                        | shadcn/ui `Spinner` | MUI `CircularProgress` | Mantine `Loader`   | Ant Design `Spin`  |
| :------------- | :-------------------------------------------- | :------------------ | :--------------------- | :----------------- | :----------------- |
| Architecture   | UI-only preset over `SIcon`                   | styled SVG          | styled SVG             | styled SVG         | component + tip    |
| Icon source    | Iconify `svg-spinners` (swappable)            | inline SVG (fixed)  | inline SVG (fixed)     | inline SVG (fixed) | inline SVG (fixed) |
| Color variants | 8 semantic tokens                             | —                   | `color` prop           | `color` prop       | —                  |
| Size scaling   | `xs`–`2xl` (6 steps)                          | `sm`–`lg`           | `size` prop            | `xs`–`xl`          | `small`/`default`  |
| Custom icon    | `icon` prop accepts any `svg-spinners:*`      | —                   | —                      | —                  | `indicator` slot   |
| A11y           | `aria-hidden` by default; `aria-label` opt-in | `role="status"`     | `aria-label`           | —                  | `tip` text         |

### Runtime cautions

- **Accessibility**: The spinner inherits `aria-hidden="true"` from `SIcon` by default. This is intentional for the most common use case — a spinner inside a button that already has text (e.g., "Loading..."). For standalone loading indicators, pass `aria-label="Loading"` so screen readers announce the loading state.
- **Icon swappability**: The `icon` prop is typed as `` `svg-spinners:${string}` `` to ensure only valid Iconify spinner icons are used. To use a non-spinner icon, use `SIcon` directly.
- **Color vs `text-*`**: The `color` prop applies semantic theme color classes (e.g., `text-primary`). For custom colors, pass a `class` override (e.g., `class="text-orange-500"`); the `class` prop merges with variant classes via `cv()`.

### FAQ

**How do I make the spinner accessible to screen readers?**
Pass an `aria-label`: `<SSpinner aria-label="Loading data" />`. Without it, the spinner is `aria-hidden` and invisible to assistive technology. This is correct when the spinner sits inside a button or next to text that already describes the loading state.

**Can I use a different spinner animation?**
Yes. Pass any icon from the Iconify `svg-spinners` collection: `<SSpinner icon="svg-spinners:ring-resize" />`. Browse available icons at [icones.js.org](https://icones.js.org/collection/svg-spinners).

**How do I control the spinner size beyond the `size` prop?**
The `size` prop maps to fixed dimensions (`size-3` to `size-10`). For custom sizing, pass `width` and `height` props (forwarded to `SIcon`) or override with `class="w-8 h-8"`.

**Why is there no Aria layer for Spinner?**
The spinner is a purely presentational icon preset — it has no state, interactivity, or ARIA logic beyond what `SIcon` already provides. Adding an Aria layer would be unnecessary indirection. The Aria/styled split lives in `SIcon` itself.
