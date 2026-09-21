---
head:
  title: Color Swatch
  description: 'A read-only color preview block with support for transparent and OKLCH values. SColorSwatch combines the Aria ColorSwatchRoot/ColorSwatchChecker/ColorSwatchFill primitives with the colorSwatchVariants style recipe (3 slots, 6 sizes × 2 shapes).'
---

# Color Swatch

## Overview

A read-only color preview block with support for transparent and OKLCH values. `SColorSwatch` combines the Aria `ColorSwatchRoot`/`ColorSwatchChecker`/`ColorSwatchFill` primitives with the `colorSwatchVariants` style recipe (3 slots, 6 sizes × 2 shapes).

Use a color swatch to display a color value (with an optional transparency checker) inside pickers, tables, or labels.

## Usage

<UsageCode component="color-swatch" />

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

<PlaygroundGallery component="color-swatch" />

## API

<ComponentApi component="color-swatch" />

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
<SColorSwatch color="#7c3aed" label="Accent" />
```

### How do I make it circular?

Set `shape="circle"`:

```vue
<SColorSwatch color="#06b6d4" shape="circle" />
```

### How do I access the parsed color/alpha?

Use the default slot scope:

```vue
<SColorSwatch :color="color">
  <template #default="{ alpha }">{{ (alpha * 100).toFixed(0) }}%</template>
</SColorSwatch>
```
