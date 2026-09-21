# Rating

Source URL: https://veanui.com/components/rating
Markdown URL: https://veanui.com/components/rating.md
Category: Other
Description: A star-rating component built on a multi-slot Aria core: RatingRoot provides the slider context, state, and keyboard handling, while each RatingItem renders a single star. Supports controlled and uncontrolled modes, half-star precision, clear-on-repeat-click, read-only and disabled states, horizontal/vertical orientation, RTL direction, and native form integration through a visually hidden input. Use it whenever users need to express a graded preference—product reviews, feedback surveys, or skill self-assessment.

## Overview

A star-rating component built on a multi-slot Aria core: `RatingRoot` provides the slider context, state, and keyboard handling, while each `RatingItem` renders a single star. Supports controlled and uncontrolled modes, half-star precision, clear-on-repeat-click, read-only and disabled states, horizontal/vertical orientation, RTL direction, and native form integration through a visually hidden input. Use it whenever users need to express a graded preference—product reviews, feedback surveys, or skill self-assessment.

## Usage

Usage examples for rating are rendered on the site.

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

Interactive demos for rating are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (3): Rating, RatingItem, RatingRoot.

### Rating

#### Props

Properties for the Rating component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `RatingVariant`; optional)
- `modelValue`: The controlled value of the rating. Can be bound as `v-model`. (type `number`; optional)
- `defaultValue`: The initial value of the rating when uncontrolled. (type `number`; optional)
- `max`: The maximum rating value (number of items). (type `number`; optional)
- `allowHalf`: Whether half-star precision is allowed. (type `boolean`; optional)
- `allowClear`: Whether clicking the current value clears the rating to 0. (type `boolean`; optional)
- `readonly`: Whether the rating is read-only (focusable but not interactive). (type `boolean`; optional)
- `disabled`: Whether the rating is disabled (inert). (type `boolean`; optional)
- `orientation`: The orientation of the rating. (type `DataOrientation`; optional)
- `dir`: The reading direction of the rating. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Rating component.

- `update:modelValue`: Event handler called when the rating value changes. (type `[value: number]`; parameters `value: number`)
- `hoverChange`: Event handler called when the hover preview value changes. `null` when the pointer leaves. (type `[value: number | null]`; parameters `value: number | null`)
- `valueCommit`: Event handler called when a rating interaction is committed (click or keyboard). (type `[value: number]`; parameters `value: number`)

### RatingItem

#### Props

Properties for the RatingItem component.

- `index`: The zero-based index of the item within the rating. (type `number`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### RatingRoot

#### Props

Properties for the RatingRoot component.

- `modelValue`: The controlled value of the rating. Can be bound as `v-model`. (type `number`; optional)
- `defaultValue`: The initial value of the rating when uncontrolled. (type `number`; optional)
- `max`: The maximum rating value (number of items). (type `number`; optional)
- `allowHalf`: Whether half-star precision is allowed. (type `boolean`; optional)
- `allowClear`: Whether clicking the current value clears the rating to 0. (type `boolean`; optional)
- `readonly`: Whether the rating is read-only (focusable but not interactive). (type `boolean`; optional)
- `disabled`: Whether the rating is disabled (inert). (type `boolean`; optional)
- `orientation`: The orientation of the rating. (type `DataOrientation`; optional)
- `dir`: The reading direction of the rating. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the RatingRoot component.

- `update:modelValue`: Event handler called when the rating value changes. (type `[value: number]`; parameters `value: number`)
- `hoverChange`: Event handler called when the hover preview value changes. `null` when the pointer leaves. (type `[value: number | null]`; parameters `value: number | null`)
- `valueCommit`: Event handler called when a rating interaction is committed (click or keyboard). (type `[value: number]`; parameters `value: number`)

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
