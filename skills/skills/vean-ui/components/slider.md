# Slider

Source URL: https://veanui.com/components/slider
Markdown URL: https://veanui.com/components/slider.md
Category: Forms
Description: A slider for picking one or more numeric values within a continuous range, supporting horizontal and vertical orientations, multi-thumb range mode, RTL and inverted directions, and complete keyboard navigation. Use it when the value belongs to a bounded numeric range and the user should adjust it with mouse or keyboard precision; when the value is free-form text or numbers, prefer SInputNumber instead.

## Overview

A slider for picking one or more numeric values within a continuous range, supporting horizontal and vertical orientations, multi-thumb range mode, RTL and inverted directions, and complete keyboard navigation. Use it when the value belongs to a bounded numeric range and the user should adjust it with mouse or keyboard precision; when the value is free-form text or numbers, prefer `SInputNumber` instead.

## Usage

Usage examples for slider are rendered on the site.

## Features

- 🎚 `modelValue` / `defaultValue` — controlled and uncontrolled modes backed by `useControllableState`
- 🔢 Single or multi-thumb range — pass an array with two values for a range slider
- ⌨️ Full keyboard support — Arrow keys step by `step`, PageUp/PageDown and Shift+Arrow jump 10 steps, Home/End go to min/max
- ↔ RTL-aware direction with `dir`, plus `inverted` to flip the value direction
- 📐 Horizontal and vertical orientations with `aria-orientation` reflection
- 📋 Native form proxy — a visually hidden input (or `name[0]`/`name[1]` pair for ranges) carries the value with `name` / `required`
- 🎨 6 sizes and 8 colors via `sliderVariants`
- 🧩 `trackProps` / `rangeProps` / `thumbProps` forwarding plus a default slot to customize thumb content
- 📏 `minStepsBetweenThumbs` and `thumbAlignment` (`contain` / `overflow`) for precise range control

## Demos

Interactive demos for slider are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (6): Slider, SliderCompact, SliderRange, SliderRoot, SliderThumb, SliderTrack.

### Slider

#### Props

Properties for the Slider component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<SliderUi>`; optional)
- `trackProps`: Properties forwarded to the track element. (type `SliderTrackProps`; optional)
- `rangeProps`: Properties forwarded to the range element. (type `SliderRangeProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `BaseProps`; optional)
- `modelValue`: The controlled value of the slider. Can be bind as `v-model`. (type `number[]`; optional)
- `defaultValue`: The initial value of the slider when uncontrolled. (type `number[]`; optional)
- `disabled`: Whether the slider is disabled. (type `boolean`; optional)
- `orientation`: The orientation of the slider. (type `DataOrientation`; optional)
- `dir`: The reading direction of the slider. (type `Direction`; optional)
- `inverted`: Whether the slider value direction is inverted. (type `boolean`; optional)
- `min`: The minimum value. (type `number`; optional)
- `max`: The maximum value. (type `number`; optional)
- `step`: The stepping interval. (type `number`; optional)
- `minStepsBetweenThumbs`: The minimum permitted steps between multiple thumbs. (type `number`; optional)
- `thumbAlignment`: Whether thumbs stay within the track bounds or may overflow it. (type `SliderThumbAlignment`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Slider component.

- `update:modelValue`: Event handler called when the slider value changes. (type `[value: number[]]`; parameters `value: number[]`)
- `valueCommit`: Event handler called when a slider interaction is committed. (type `[value: number[]]`; parameters `value: number[]`)

### SliderCompact

#### Props

Properties for the SliderCompact component.

- `trackProps`: Properties forwarded to the track element. (type `SliderTrackProps`; optional)
- `rangeProps`: Properties forwarded to the range element. (type `SliderRangeProps`; optional)
- `thumbProps`: Properties forwarded to the thumb element. (type `BaseProps`; optional)
- `modelValue`: The controlled value of the slider. Can be bind as `v-model`. (type `number[]`; optional)
- `defaultValue`: The initial value of the slider when uncontrolled. (type `number[]`; optional)
- `disabled`: Whether the slider is disabled. (type `boolean`; optional)
- `orientation`: The orientation of the slider. (type `DataOrientation`; optional)
- `dir`: The reading direction of the slider. (type `Direction`; optional)
- `inverted`: Whether the slider value direction is inverted. (type `boolean`; optional)
- `min`: The minimum value. (type `number`; optional)
- `max`: The maximum value. (type `number`; optional)
- `step`: The stepping interval. (type `number`; optional)
- `minStepsBetweenThumbs`: The minimum permitted steps between multiple thumbs. (type `number`; optional)
- `thumbAlignment`: Whether thumbs stay within the track bounds or may overflow it. (type `SliderThumbAlignment`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the SliderCompact component.

- `update:modelValue`: Event handler called when the slider value changes. (type `[value: number[]]`; parameters `value: number[]`)
- `valueCommit`: Event handler called when a slider interaction is committed. (type `[value: number[]]`; parameters `value: number[]`)

#### Slots

Slots for the SliderCompact component.

- `default`: Custom content for the default slot. (type `((props: SliderCompactSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the SliderCompact component.

- `modelValue`: Current model value. (type `number[]`; required)
- `index`: Current thumb index. (type `number`; required)
- `value`: Current thumb value. (type `number`; required)

### SliderRange

#### Props

Properties for the SliderRange component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SliderRoot

#### Props

Properties for the SliderRoot component.

- `modelValue`: The controlled value of the slider. Can be bind as `v-model`. (type `number[]`; optional)
- `defaultValue`: The initial value of the slider when uncontrolled. (type `number[]`; optional)
- `disabled`: Whether the slider is disabled. (type `boolean`; optional)
- `orientation`: The orientation of the slider. (type `DataOrientation`; optional)
- `dir`: The reading direction of the slider. (type `Direction`; optional)
- `inverted`: Whether the slider value direction is inverted. (type `boolean`; optional)
- `min`: The minimum value. (type `number`; optional)
- `max`: The maximum value. (type `number`; optional)
- `step`: The stepping interval. (type `number`; optional)
- `minStepsBetweenThumbs`: The minimum permitted steps between multiple thumbs. (type `number`; optional)
- `thumbAlignment`: Whether thumbs stay within the track bounds or may overflow it. (type `SliderThumbAlignment`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the SliderRoot component.

- `update:modelValue`: Event handler called when the slider value changes. (type `[value: number[]]`; parameters `value: number[]`)
- `valueCommit`: Event handler called when a slider interaction is committed. (type `[value: number[]]`; parameters `value: number[]`)

### SliderThumb

#### Props

Properties for the SliderThumb component.

- `index`: The thumb index in the current slider value array. (type `number`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SliderTrack

#### Props

Properties for the SliderTrack component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark differences

VeanUI builds the slider from Aria `SliderRoot` (`useControllableState` + value normalization + `VisuallyHiddenInput` form proxy) → `SliderTrack` (pointer drag, pointer-move/up/cancel on the document) → `SliderRange` (percentage span between thumbs) → `SliderThumb` (`role="slider"` + `aria-valuemin/max/now` + `aria-orientation`, focus-derived step navigation). `SliderCompact` composes root + track + range + thumbs and owns thumb iteration; the UI wrapper `SSlider` only computes variant classes via `sliderVariants` and injects the `ui` map through `provideSliderUi`.

| Capability                          | VeanUI | Ant Design `Slider` | Element Plus `Slider` | Mantine `Slider` | Naive UI `Slider` | shadcn `Slider` |
| :---------------------------------- | :----: | :-----------------: | :-------------------: | :--------------: | :---------------: | :-------------: |
| Aria/styled split                   |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| Controlled/uncontrolled             |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Range (multi-thumb)                 |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Vertical orientation                |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Inverted / RTL                      |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Keyboard nav (Arrows/Home/End/Page) |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| `minStepsBetweenThumbs`             |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| Form proxy / `name` submit          |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| Axe-clean                           |   ✅   |          —          |           —           |        —         |         —         |        —        |
| Marks (scale ticks)                 |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| Value tooltip while dragging        |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| Linked number input                 |   ➕   |         ✅          |           —           |        —         |         —         |        —        |

### Cautions

- A single thumb has no default accessible name — pass `aria-label` through `thumbProps` (range mode falls back to localized "Minimum"/"Maximum" labels automatically).
- Thumbs default to `contain` inside the track; `thumbAlignment="overflow"` lets them extend beyond the track bounds.
- The form proxy renders only when `name` is present on a `form`-classed root; pair it with a native `<form>` or the `SForm` integration.
- PageUp/PageDown and Shift+Arrow keys step 10× the `step` value; `minStepsBetweenThumbs` blocks thumbs from crossing each other.

## FAQ

### How do I create a range slider?

Pass an array with two values to `modelValue` (or `defaultValue`), e.g. `[20, 80]`. Two thumbs are rendered and `valueCommit` emits both values. Each thumb is labeled "Minimum"/"Maximum" (localized) unless you override `thumbProps['aria-label']`.

### How do I keep the two thumbs apart?

Set `minStepsBetweenThumbs` to the minimum number of steps between thumbs — stepping or dragging is rejected when the gap would fall below that threshold.

### How do I show the current value above the thumb?

Use the default slot, which receives `{ index, value, modelValue }` for each thumb, to render custom content. A built-in tooltip is a planned enhancement.

### What keyboard shortcuts are supported?

Arrow keys step by `step`, PageUp/PageDown and Shift+Arrow jump 10 steps, and Home/End jump to min/max. Direction keys follow `dir` and `inverted` (RTL flips horizontal arrows; `inverted` flips the value direction).
