# Color Swatch

Source URL: https://veanui.com/components/color-swatch
Markdown URL: https://veanui.com/components/color-swatch.md
Category: Data Display
Description: A read-only color preview block with support for transparent and OKLCH values. SColorSwatch combines the Aria ColorSwatchRoot/ColorSwatchChecker/ColorSwatchFill primitives with the colorSwatchVariants style recipe (3 slots, 6 sizes × 2 shapes).

## Overview

A read-only color preview block with support for transparent and OKLCH values. `SColorSwatch` combines the Aria `ColorSwatchRoot`/`ColorSwatchChecker`/`ColorSwatchFill` primitives with the `colorSwatchVariants` style recipe (3 slots, 6 sizes × 2 shapes).

Use a color swatch to display a color value (with an optional transparency checker) inside pickers, tables, or labels.

## Usage

Usage examples for color-swatch are rendered on the site.

## Features

- 🧩 Aria/styled split — `ColorSwatchCompact` composes checker + fill; `SColorSwatch` only injects styles and forwards props/slots
- 🖼️ Transparency checker — renders a checkerboard behind translucent/alpha colors
- 🎨 OKLCH + transparent support — accepts any `ColorValue`, including `oklch` and alpha colors
- 🏷️ Accessible label — `role="img"` with `aria-label` from `label`; empty colors marked `data-no-color`
- 🔵 Shape — `shape="square"` (default) or `"circle"`
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- 🔌 Slot scope — the default slot exposes `{ color, alpha }` (RGB string + 0–1 alpha)

## Component family

- `SColorSwatch` (styled) — the entry wrapper; `colorSwatchVariants` recipe with dynamic slot forwarding
- `ColorSwatchRoot` (Aria) — the accessible preview root (`role="img"`, `color`/`label`)
- `ColorSwatchChecker` (Aria) — the transparency checkerboard
- `ColorSwatchFill` (Aria) — the solid color fill
- `ColorSwatchCompact` (Aria) — the aggregated composite; composes checker + fill

## Demo

Interactive demos for color-swatch are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): ColorSwatch, ColorSwatchChecker, ColorSwatchCompact, ColorSwatchFill, ColorSwatchRoot.

### ColorSwatch

#### Props

Properties for the ColorSwatch component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ColorSwatchUi>`; optional)
- `shape`: Shape of the component. (type `ColorSwatchShape`; optional)
- `checkerProps`: Props for the checker element of the ColorSwatch component. (type `ColorSwatchCheckerProps`; optional)
- `fillProps`: Props for the fill element of the ColorSwatch component. (type `ColorSwatchFillProps`; optional)
- `color`: Theme color of the component. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the ColorSwatch component.

- `default`: No description. (type `((props: ColorSwatchSlotProps) => any) | undefined`)

#### Slot Props

Properties for the ColorSwatch component slots.

- `color`: Color value in RGB format, e.g., "rgb(255, 0, 0)". (type `string`; required)
- `alpha`: Alpha value of the color, ranging from 0 to 1. (type `number`; required)

### ColorSwatchChecker

- No documented props, emits, slots, or slot props were available.

### ColorSwatchCompact

#### Props

Properties for the ColorSwatch component in compact mode.

- `checkerProps`: Props for the checker element of the ColorSwatch component. (type `ColorSwatchCheckerProps`; optional)
- `fillProps`: Props for the fill element of the ColorSwatch component. (type `ColorSwatchFillProps`; optional)
- `color`: Theme color of the component. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the ColorSwatch component in compact mode.

- `default`: No description. (type `((props: ColorSwatchSlotProps) => any) | undefined`)

### ColorSwatchFill

- No documented props, emits, slots, or slot props were available.

### ColorSwatchRoot

#### Props

Properties for the ColorSwatch component.

- `color`: Theme color of the component. (type `import("@soybeanjs/colord").AnyColor`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the ColorSwatch component.

- `default`: No description. (type `((props: ColorSwatchSlotProps) => any) | undefined`)

## Notes

### Architecture and benchmark differences

`ColorSwatchCompact` owns the checker/fill composition while every primitive stays style-free and only the UI wrapper injects the `colorSwatchVariants` classes. This mirrors radix-ui-color/shadcn-ui headless split. Ant Design, Element Plus, Mantine and Naive UI render a plain colored `<span>` for swatches; VeanUI exposes an accessible `role="img"` preview with a transparency checker, shape/size control and a slot scope exposing the parsed color/alpha.

| Capability            | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :-------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split     |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Transparency checker  |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| OKLCH / alpha support |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Accessible role/img   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Shape (square/circle) |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Sizes (6)             |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- Provide `label` for an accessible name; empty colors are marked `data-no-color` (rendered muted).
- `color` accepts a color string or `ColorValue` (including `oklch`/alpha); the fill uses the resolved CSS color.
- The default slot receives `{ color, alpha }` (RGB string + 0–1 alpha) for custom overlays/labels.
- `shape` switches between square (`rounded-md`) and circle (`rounded-full`).
- This is a read-only preview; use `color-picker`/`color-swatch-picker` for selection.

### Roadmap

N/A — color-swatch is feature-complete for the current parity set.

## FAQ

### How do I show a color swatch?

Pass `color` and an optional `label`:

```vue

```

### How do I make it circular?

Set `shape="circle"`:

```vue

```

### How do I access the parsed color/alpha?

Use the default slot scope:

```vue
<template #default="{ alpha }">{{ (alpha * 100).toFixed(0) }}%</template>
```
