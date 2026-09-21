---
head:
  title: Color Swatch Picker
  description: 'Choose a color quickly from a preset palette, useful for theme panels and suggested color selections. SColorSwatchPicker combines the Aria ColorSwatchPickerRoot/Item/ItemSwatch/ItemIndicator primitives (built on the listbox) with the colorSwatchPickerVariants style recipe (6 slots, 6 sizes × 2 shapes).'
---

# Color Swatch Picker

## Overview

Choose a color quickly from a preset palette, useful for theme panels and suggested color selections. `SColorSwatchPicker` combines the Aria `ColorSwatchPickerRoot`/`Item`/`ItemSwatch`/`ItemIndicator` primitives (built on the listbox) with the `colorSwatchPickerVariants` style recipe (6 slots, 6 sizes × 2 shapes).

Use a swatch picker for a compact, clickable preset palette (theme panels, brand colors, suggested colors).

## Usage

<UsageCode component="color-swatch-picker" />

## Features

- 🧩 Aria/listbox based — built on the listbox primitives with `role="listbox"`/`option`, roving focus and selection
- 🎨 Preset palette — pass `colors` as an array; each renders a `ColorSwatch` with a check indicator
- 🔘 Single/multiple — `multiple` (via the listbox `M` generic) selects one or many values
- ✅ Indicator — an `indicator` slot (default `lucide:check`) marks the active swatch
- 🔵 Shape — `shape="square"` (default) or `"circle"`
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- 🧩 Custom content — the `default` slot (when no `colors`) and `swatch`/`indicator` slots for full control

## Component family

- `SColorSwatchPicker` (styled) — the entry wrapper; `colorSwatchPickerVariants` recipe with dynamic slot forwarding
- `ColorSwatchPickerCompact` (Aria) — the aggregated composite; iterates `colors` into items with swatch + indicator
- `ColorSwatchPickerRoot` (Aria) — the listbox root (`modelValue`, `multiple`)
- `ColorSwatchPickerItem` (Aria) — a selectable swatch option (`role="option"`)
- `ColorSwatchPickerItemSwatch` (Aria) — the swatch (`ColorSwatchCompact` base)
- `ColorSwatchPickerItemIndicator` (Aria) — the selection check indicator

## Demo

<PlaygroundGallery component="color-swatch-picker" />

## API

<ComponentApi component="color-swatch-picker" />

## Notes

### Architecture and benchmark differences

`ColorSwatchPickerCompact` owns the palette iteration (item + swatch + indicator) while every primitive stays style-free and only the UI wrapper injects the `colorSwatchPickerVariants` classes. This mirrors radix-ui-color/shadcn-ui headless split, built on the shared listbox primitives. Ant Design, Element Plus, Mantine and Naive UI ship a single color-picker with a preset row; VeanUI exposes a standalone listbox-based swatch picker with single/multiple selection, a check indicator, shape/size control and full slot overrides.

| Capability            | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :-------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/listbox based    |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Single/multiple       |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Check indicator       |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Roving focus          |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Shape (square/circle) |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Sizes (6)             |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `colors` is an array of color strings; each renders an `ColorSwatch` option with a check indicator on the active value.
- Selection emits `update:modelValue` (single: a string; `multiple`: an array) and `select`.
- Provide `indicator`/`swatch` slots to customize the check mark and swatch content; use the `default` slot to render fully custom content when `colors` is empty.
- `shape` switches between square (`rounded-md`) and circle (`rounded-full`).
- Built on the listbox primitives, so keyboard/roving-focus behavior follows the listbox contract.

### Roadmap

N/A — color-swatch-picker is feature-complete for the current parity set.

## FAQ

### How do I build a swatch picker?

Pass `colors` and bind `model-value`:

```vue
<SColorSwatchPicker v-model:model-value="color" :colors="['#7c3aed', '#06b6d4', '#10b981']" />
```

### How do I allow multiple selection?

Use `multiple` (the value becomes an array):

```vue
<SColorSwatchPicker v-model:model-value="colors" multiple :colors="palette" />
```

### How do I make the swatches circular?

Set `shape="circle"`:

```vue
<SColorSwatchPicker v-model:model-value="color" :colors="palette" shape="circle" />
```

### How do I customize the indicator?

Use the `indicator` slot:

```vue
<SColorSwatchPicker v-model:model-value="color" :colors="palette">
  <template #indicator>✓</template>
</SColorSwatchPicker>
```
