---
head:
  title: Rating
  description: 'A star-rating component built on a multi-slot Aria core: RatingRoot provides the slider context, state, and keyboard handling, while each RatingItem renders a single star. Supports controlled and uncontrolled modes, half-star precision, clear-on-repeat-click, read-only and disabled states, horizontal/vertical orientation, RTL direction, and native form integration through a visually hidden input. Use it whenever users need to express a graded preference—product reviews, feedback surveys, or skill self-assessment.'
---

# Rating

## Overview

A star-rating component built on a multi-slot Aria core: `RatingRoot` provides the slider context, state, and keyboard handling, while each `RatingItem` renders a single star. Supports controlled and uncontrolled modes, half-star precision, clear-on-repeat-click, read-only and disabled states, horizontal/vertical orientation, RTL direction, and native form integration through a visually hidden input. Use it whenever users need to express a graded preference—product reviews, feedback surveys, or skill self-assessment.

## Usage

<UsageCode component="rating" />

## Features

- 🎚 `modelValue` / `defaultValue` — controlled and uncontrolled modes backed by `useControllableState`
- ⭐ `max` (default 5) drives the star count; each `RatingItem` is generated from context
- ½ `allowHalf` enables half-star precision; pointer position and arrow-key steps resolve to 0.5 increments
- ♻️ `allowClear` resets the value to 0 when the current item is clicked again
- ⌨️ Keyboard operable — ArrowUp/Right increments, ArrowDown/Left decrements, Home resets to 0, End sets to max
- ♿ `role="slider"` with full `aria-valuenow/min/max/valuetext/orientation/readonly/disabled/label` reflection
- 🧭 `orientation` (horizontal/vertical) and `dir` (ltr/rtl) drive layout and ARIA orientation
- 🎨 `ratingVariants` (6 sizes) + `ratingItemVariants` (8 colors × 2 variants × 6 sizes); default color `warning`, default variant `filled`
- 🧩 `icon` slot exposes `{ index, value, state }` (`state` is `'full' | 'half' | 'empty'`) for custom star rendering
- 📝 Form integration via `VisuallyHiddenInput` when `name` is provided
- 🌐 Localized ARIA — `rating.ariaLabel`, `rating.starN` (`{count} of {max} stars`), `rating.empty`
- 🚫 `readonly` + `disabled` states with guarded pointer and keyboard handling

## Demos

<PlaygroundGallery component="rating" />

## API

<ComponentApi component="rating" />

## Notes

### Architecture and benchmark differences

VeanUI splits the rating into Aria `RatingRoot` (slider context, `useControllableState`, keyboard navigation, ARIA reflection, half-step pointer resolution, `VisuallyHiddenInput` form binding) and Aria `RatingItem` (renders each star from context, exposes `state` for slot-driven icons). The UI wrapper `SRating` injects `ratingVariants` and `ratingItemVariants` classes via the standard multi-slot `provide*Ui` / `useUiContext` pattern; state and visuals stay decoupled through `data-[state=...]` selectors. Compared with AntD `Rate`, Element Plus `el-rate`, Mantine `Rating`, and Naive UI `n-rate`, VeanUI is the only benchmarked library with an Aria/styled split, RTL support, vertical orientation, and native form integration; shadcn ships no rating component.

| Capability              | VeanUI |   Ant Design   |  Element Plus  |    Mantine     |  Naive UI  | shadcn |
| :---------------------- | :----: | :------------: | :------------: | :------------: | :--------: | :----: |
| Aria/styled split       |   ✅   |       —        |       —        |       —        |     —      |   —    |
| Controlled/uncontrolled |   ✅   |       ✅       |       ✅       |       ✅       |     ✅     |   —    |
| Half-star precision     |   ✅   |       ✅       |       ✅       | ✅ (fractions) |     ✅     |   —    |
| Allow clear             |   ✅   |       ✅       |       ✅       |       ✅       |     ✅     |   —    |
| Read-only mode          |   ✅   |       ✅       |       ✅       |       ✅       |     ✅     |   —    |
| Custom icon (slot)      |   ✅   | ✅ (character) | ✅ (iconClass) |       ✅       |     ✅     |   —    |
| Keyboard navigation     |   ✅   |       —        |       —        |       ✅       |     —      |   —    |
| RTL support             |   ✅   |       —        |       —        |       —        |     —      |   —    |
| Vertical orientation    |   ✅   |       —        |       —        |       ✅       |     —      |   —    |
| Form integration        |   ✅   |       —        |       —        |       ✅       |     —      |   —    |
| Color/size variants     |   ✅   |      size      |      size      |      size      | size/color |   —    |

### Cautions

- The root element carries `role="slider"`; do not add `role="img"` or any other conflicting role to child items.
- Half-star precision depends on the pointer position within a single item; on touch devices, consider increasing the hit area so users can reliably target the half region.
- `allowClear` only fires when the clicked item matches the current value—clicking any other item changes the value normally.
- The `icon` slot receives `state` (`'full'` / `'half'` / `'empty'`); style custom icons with `data-[state=...]` selectors or conditional rendering.

## FAQ

### Controlled or uncontrolled?

Pass `modelValue` with `v-model` for a controlled value, or `defaultValue` to let the rating own its state internally. Both are supported via `useControllableState`.

### How do I use half-star precision?

Set `allowHalf` to `true`. Arrow keys then step by 0.5, and pointer position within an item determines whether the step resolves to a half or a full star.

### How do I customize the icon?

Use the `icon` slot and read the `state` prop: `<template #icon="{ state }">...</template>`. The slot also receives `index` and `value` if you need position-aware rendering.

### How do I clear the rating?

Set `allowClear` to `true`. Clicking the item that matches the current value resets the rating to 0; clicking any other item behaves normally.
