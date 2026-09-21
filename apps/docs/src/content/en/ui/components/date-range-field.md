---
head:
  title: DateRangeField
  description: 'A segmented date range input that renders two groups of keyboard-editable date segments — one for the start date and one for the end date — while submitting native form values for both. Use it whenever a user must enter a bounded interval fast, such as booking stay dates, reporting windows, or filter ranges where typing beats calendar clicking. For a range chosen from a calendar popup, prefer SDateRangePicker; for a single date, use SDateField.'
---

# DateRangeField

## Overview

A segmented date range input that renders two groups of keyboard-editable date segments — one for the start date and one for the end date — while submitting native form values for both. Use it whenever a user must enter a bounded interval fast, such as booking stay dates, reporting windows, or filter ranges where typing beats calendar clicking. For a range chosen from a calendar popup, prefer `SDateRangePicker`; for a single date, use `SDateField`.

## Usage

<UsageCode component="date-range-field" />

## Features

- 🧩 Dual segmented groups — independent start and end segment groups (day/month/year, optional time), each part an editable `role="spinbutton"` segment
- ⌨️ Cross-group focus movement — arrow keys navigate within a group, and at the group edges `ArrowLeft`/`ArrowRight` move focus into the other group, with directions reversed in RTL
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` accept a `DateRange` `{ start, end }`, backed by `useControllableState`
- ⛓ Range validation — `minValue`/`maxValue`/`isDateUnavailable` per date, and a start later than end automatically marks the root `data-invalid`
- 📝 Dual native form values — two visually hidden inputs (`startName`/`endName`, falling back to `name` for the start) submit the ISO values
- 🕐 Granularity & time — `granularity` (day/hour/minute/second), 12/24-hour `hourCycle`, and `dayPeriod` segments apply to both groups
- 🧩 Customizable separation — a `separator` prop (default `–`) plus `leading`/`trailing` slots, or a `separator` slot for fully custom content
- 🚫 Disabled / readonly — both states render proper `data-*`/`aria-*` attributes and block editing across both groups

## Component family

- `SDateRangeField` — the styled wrapper that forwards props to the Aria compact and injects `dateRangeFieldVariants` (extending `dateFieldVariants`) classes
- `DateRangeFieldCompact` (Aria) — data-driven composition of `DateRangeFieldRoot` + per-segment `DateRangeFieldInput` for both groups, plus `leading`/`trailing`/`separator` slots; import from `@vean/aria/date-range-field` for unstyled usage
- `DateRangeFieldRoot` / `DateRangeFieldInput` (Aria) — the state owner (dual segment values, validation, hidden inputs, cross-group focus) and a single editable segment bound to the shared `useDateField` composable

## Demos

<PlaygroundGallery component="date-range-field" />

## API

<ComponentApi component="date-range-field" />

## Notes

### Architecture and benchmark differences

`DateRangeFieldRoot` owns the `{ start, end }` value via `useControllableState`, keeps separate `startSegmentValues`/`endSegmentValues` shallowRefs for the two groups, and runs validation through `isInvalid` (including a start-later-than-end check). Each `DateRangeFieldInput` binds the same `useDateField` composable used by the `time-field` family for per-part keydown logic. Cross-group movement is handled by the root's `moveFocus`: at the physical end of the start group the next arrow moves into the end group, and at the beginning of the end group the previous arrow returns, with the physical key mapped from the `dir` so RTL swaps `ArrowLeft`/`ArrowRight`. Most benchmark libraries implement a range as two separate text inputs or one text input with a separator; the dual segmented-field pattern with cross-group keyboard focus comes from the reka-ui (Radix) date-field lineage.

| Capability                     | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :----------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual segmented editable groups |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Cross-group focus movement     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL direction reversal         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled      |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Keyboard increment/typing      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation (start ≤ end) |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (minute/second)    |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual native form values        |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| Disabled / readonly            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Separator prop / slot          |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- The value is a `DateRange` — an object `{ start, end }` of `DateValue`s, not a `string`. Use it with the other date-family components.
- `defaultValue` is only read on mount — use `v-model` for external control.
- A start later than end is marked invalid but the values are never swapped automatically — clear or correct them in the parent.
- Form submission uses two hidden inputs: the start one takes `startName` (or the shared `name`), the end one takes `endName`. Set both to submit distinct fields; `required`/`min`/`max` are reflected but do not run custom validation.
- Deleting the last digit of one group emits `update:modelValue` with that side `undefined`; segments fall back to placeholder styling.
- Each group renders `role="group"` with per-segment `role="spinbutton"`; add an `aria-label` to the whole control so screen readers announce both groups.

## FAQ

### How do I move focus between the two groups with the keyboard?

Use `ArrowLeft`/`ArrowRight` — at the first segment of the end group `ArrowLeft` jumps to the last start segment, and at the last segment of the start group `ArrowRight` jumps to the first end segment. In RTL the physical keys are reversed.

### How do I submit two form values?

Pass `name` (fallback for the start) plus `startName` and `endName` for distinct field names — each group renders a visually hidden native input carrying its ISO value.

### How do I restrict the selectable range?

Pass `minValue`/`maxValue` — dates outside are marked `data-invalid` and rejected. `isDateUnavailable` accepts a predicate for arbitrary exclusions, and a start later than end is invalid on its own.

### How is `SDateRangeField` different from `SDateRangePicker`?

`SDateRangeField` is a pure dual segmented input with no popup — fastest for typing and form submission. `SDateRangePicker` adds a calendar popover on top of the same field for visual selection.

### How do I customize the separator?

Pass `separator` (e.g. `"→"`) to change the text, or use the `separator` slot to render anything (an icon, a styled label). `leading`/`trailing` slots place content around the two groups.
