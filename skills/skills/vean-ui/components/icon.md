# Icon

Source URL: https://veanui.com/components/icon
Markdown URL: https://veanui.com/components/icon.md
Category: General
Description: SIcon is a unified icon component built on top of Iconify. It supports rendering icons from the Iconify dataset or custom components/VNodes. It integrates with SConfigProvider for consistent sizing across the application.

## Overview

`SIcon` is a unified icon component built on top of [Iconify](https://iconify.design/). It supports rendering icons from the Iconify dataset or custom components/VNodes. It integrates with `SConfigProvider` for consistent sizing across the application.

## Features

- 📦 **Iconify Support**: Render any icon from the massive Iconify library.
- 🔧 **Custom Icons**: Support for Vue components, VNodes, or raw strings.
- 📏 **Global Sizing**: Inherits default size from `SConfigProvider`.
- 🎨 **Styling**: Easy customization via props or CSS classes.
- ♿ **Accessibility**: Decorative icons are `aria-hidden` by default; semantic icons are exposed via `aria-label` / `aria-labelledby`.

## Basic Usage

### Using Iconify Name

```vue
<script setup lang="ts">
import { SIcon } from '@vean/ui';
</script>

<template>
  <SIcon icon="lucide:home" />
  <SIcon icon="mdi:account" class="text-primary" />
</template>
```

### Custom Size

```vue
<template>
  <SIcon icon="lucide:settings" width="24" height="24" />
</template>
```

You can also set a default size globally via `SConfigProvider`:

```vue
<script setup lang="ts">
import { SConfigProvider, SIcon } from '@vean/ui';
</script>

<template>
  <SConfigProvider :iconify="{ width: '1.5rem', height: '1.5rem' }">
    <SIcon icon="lucide:home" />
  </SConfigProvider>
</template>
```

### Custom Icon Component

```vue
<script setup lang="ts">
import { SIcon } from '@vean/ui';
import CustomIcon from './CustomIcon.vue';
</script>

<template>
  <SIcon :icon="CustomIcon" />
</template>
```

## Accessibility

- **Decorative icons** (default): `aria-hidden="true"` is set automatically, hiding the icon from assistive technology.
- **Semantic icons**: pass `aria-label` or `ariaLabelledby` and `aria-hidden` will not be set, making the icon visible to assistive technology.

```vue
<template>
  <SIcon icon="lucide:check" />

  <SIcon icon="lucide:check" aria-label="Completed" />
</template>
```

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): Icon.

### Icon

#### Props

Properties for the Icon component.

- `icon`: Icon rendered by the component. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; required)
- `ariaHidden`: Whether the icon is hidden from assistive technology. Defaults to `true` for decorative icons. Set to `false` or provide `ariaLabel` / `ariaLabelledby` to expose the icon. (type `boolean`; optional)
- `ariaLabel`: Accessible label for the icon. When provided, `aria-hidden` is not set so the label is announced. (type `string`; optional)
- `ariaLabelledby`: ID of an element that labels the icon. When provided, `aria-hidden` is not set so the label is announced. (type `string`; optional)

## Notes

### Architecture and benchmark differences

VeanUI splits the icon into an Aria layer (`_icon` in `@vean/aria`, providing the `IconValue` type and render hook) and a styled layer (`SIcon` in `@vean/ui`, wrapping Iconify rendering, size inheritance, and accessibility logic). This differs from single-package libraries such as Ant Design, Element Plus, MUI, Mantine, and Naive UI.

| Aspect        | VeanUI                                                            | Ant Design / Element Plus / MUI / Mantine / Naive UI |
| :------------ | :---------------------------------------------------------------- | :--------------------------------------------------- |
| Architecture  | Aria + styled split                                               | single package                                       |
| Icon source   | Iconify (200+ icon sets, on-demand loading)                       | built-in icon set / custom SVG                       |
| Styling       | UnoCSS utility classes                                            | CSS-in-JS / SCSS / CSS vars                          |
| Sizing        | prop + `SConfigProvider` global inheritance                       | prop / token                                         |
| Accessibility | decorative/semantic auto-distinction, smart `aria-hidden` default | manual `aria-label`                                  |

### FAQ

**Why is `aria-hidden="true"` set by default?**
Most icons are decorative and serve only as visual aids. Defaulting to `aria-hidden="true"` prevents screen readers from announcing meaningless icon names. When an icon carries semantic meaning, pass `aria-label` or `ariaLabelledby` and `aria-hidden` is automatically removed.

**How do I use an Iconify string name?**
Pass a string in the `icon="prefix:name"` format, e.g. `icon="lucide:home"`. Iconify loads the icon data on demand from its API. You can also pre-register icon data via `addIcon` / `addCollection` for offline use.

**How do I rotate or flip an icon?**
Use `hFlip` for a horizontal mirror, `vFlip` for a vertical mirror, `rotate` for rotation, and `inline` for baseline alignment. These props are forwarded to Iconify:

```vue
<template>
  <SIcon icon="lucide:arrow-right" :h-flip="true" />
  <SIcon icon="lucide:refresh-cw" rotate="90deg" />
  <SIcon icon="lucide:home" inline />
</template>
```

`rotate` accepts a string (e.g. `"90deg"`) or a number of quarter turns (e.g. `1` for 90°, `2` for 180°).

**How does `SConfigProvider` size priority work?**
The `width` / `height` props passed directly take precedence over the `iconify.width` / `iconify.height` configured in `SConfigProvider`.

**Is SSR supported?**
Yes. The Iconify component renders an empty placeholder in SSR environments and loads icon data after client hydration. For instant SSR rendering, pre-register icon data.
