---
head:
  title: TimeRangeField
  description: 'A segmented time range input with independently editable start and end time segments (hour, minute, and optional second and day-period) while still submitting native form values for both sides. Use it whenever a user must enter a start and end time quickly and precisely — scheduling, booking, shift or time-window filtering. For a single time use STimeField; for a date and time range use SDateRangeField with a time granularity or SDateRangePicker.'
---

# TimeRangeField

## Overview

A segmented time range input with independently editable start and end time segments (hour, minute, and optional second and day-period) while still submitting native form values for both sides. Use it whenever a user must enter a start and end time quickly and precisely — scheduling, booking, shift or time-window filtering. For a single time use `STimeField`; for a date and time range use `SDateRangeField` with a time granularity or `SDateRangePicker`.

## Usage

<UsageCode component="time-range-field" />

## Features

- ⏱ Two segmented groups — independent start/end hour, minute, and optional second and day-period segments, each an editable `role="spinbutton"`
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for the whole `{ start, end }` range, backed by `useControllableState`
- 🕛 12/24-hour cycle — `hourCycle` switches between `AM/PM` and 24-hour display per locale, with day-period segment editing on both sides
- ⌨️ Full keyboard support — digit typing with auto-advance, `ArrowUp`/`ArrowDown` increment/decrement, `ArrowLeft`/`ArrowRight` navigation that crosses group boundaries and reverses in RTL
- ⛓ Range validation — `start ≤ end` is enforced, plus `minValue`/`maxValue`/`isTimeUnavailable` mark the root `data-invalid`
- 📝 Two native form values — visually hidden `input[type="time"]` elements carry both sides under `startName`/`endName`
- ⚙️ Granularity & step — `granularity` (hour/minute/second) and `step` control which segments render and the increment per arrow
- 🧩 Composable slots — `leading`/`trailing` place content around the groups and `separator` customizes the divider between them
- 🚫 Disabled / readonly — both states block editing on every segment and render proper `data-*`/`aria-*` attributes

## Component family

- `STimeRangeField` — the styled wrapper that forwards props to the Aria compact and injects `dateRangeFieldVariants` (shared with `SDateRangeField`) classes
- `TimeRangeFieldCompact` (Aria) — data-driven composition of `TimeRangeFieldRoot` + one `TimeRangeFieldInput` per segment in two groups, plus `leading`/`separator`/`trailing` slots; import from `@vean/aria/time-range-field` for unstyled usage
- `TimeRangeFieldRoot` / `TimeRangeFieldInput` (Aria) — the state owner (segment values, range validation, two hidden inputs, cross-group focus management) and a single editable segment bound to the shared `useDateField` composable

## Demos

<PlaygroundGallery component="time-range-field" />

## API

<ComponentApi component="time-range-field" />

## Notes

### Architecture and benchmark differences

`TimeRangeFieldRoot` owns the `TimeRange` via `useControllableState`, keeps `startSegmentValues`/`endSegmentValues` as two shallowRefs, and runs range validation through `isInvalid` (start after end, `minValue`/`maxValue`, `isTimeUnavailable`). Each `TimeRangeFieldInput` binds the same `useDateField` composable used by the `date-field` family; `TimeRangeFieldCompact` iterates the segments produced by `createContent` and renders one input per segment inside two `data-time-range-field-part` groups separated by the `separator` slot. Cross-group focus movement is handled by the root's `moveFocus`, mapping the physical arrow key from `dir` so RTL swaps `ArrowLeft`/`ArrowRight` — the group boundary is crossed on the physical direction (`delta`), not the semantic key. Most benchmark libraries ship two independent text inputs (or a plain picker); the dual segmented spinbutton groups with cross-boundary keyboard navigation and the Aria/styled split are the differentiators.

| Capability                     | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :----------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual segmented editable groups |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Cross-group focus movement     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL direction reversal         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled      |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Keyboard increment/typing      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation (start ≤ end) |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isTimeUnavailable`            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (second)           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Two native form values         |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| Separator prop / slot          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled / readonly            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### Cautions

- The value is a `TimeRange` — `{ start, end }` of `TimeValue`s (native `Date`s whose time-of-day parts are meaningful), not `string`s. Use it with the other date-family components.
- `defaultValue` is only read on mount — use `v-model` for external control.
- When a side is empty its segments display the placeholder time (derived from `defaultValue`/`defaultPlaceholder` or the current time) — the submitted form value is still empty until the user types.
- `granularity` defaults to `'minute'`; pass `'second'` for seconds segments on both sides.
- `hourCycle` (`12`/`24`) controls the day-period segments and the accessible hour range; leave it unset to follow the locale.
- Range validation marks the root `data-invalid` but never clamps the value — clear or correct it in the parent.
- The two hidden inputs share `required`; if you need per-side submit names pass `startName`/`endName` (falling back to `name` for the start side).

## FAQ

### How do I edit the range with the keyboard?

Tab into either group and type digits — after a segment fills it advances automatically. `ArrowUp`/`ArrowDown` increment or decrement the focused segment, and `ArrowLeft`/`ArrowRight` move between segments — including across the start/end boundary — reversed in RTL. On a 12-hour cycle `a`/`p` toggles `AM`/`PM`.

### How do I show seconds on both sides?

Pass `granularity: 'second'` to render hour, minute, and second segments in the start and end groups.

### How do I customize the separator between start and end?

Pass `separator: '→'` as a prop for a simple text divider, or use the `separator` slot to render any content (an icon, for example).

### How do I enforce that end is after start?

The component marks the root `data-invalid` automatically when `end` is before `start`. Combine with `minValue`/`maxValue`/`isTimeUnavailable` for arbitrary constraints — validation never clamps the value, so correct it in the parent.

### How is `STimeRangeField` different from `SDateRangeField`?

`STimeRangeField` is a pure time range input — it never renders date segments. `SDateRangeField` renders full dates (with optional time via granularity) and accepts `DateValue` pairs.
