---
head:
  title: TimeField
  description: "A segmented time input that renders individually editable hour, minute, and optional second and day-period segments while submitting a native form value. Use it whenever a user must enter a time fast and precisely — scheduling, booking, time-window filtering, or any form that needs a validated time. For a date with a time, use SDateField with granularity: 'minute'; for a range, prefer STimeRangeField."
---

# TimeField

## Overview

A segmented time input that renders individually editable hour, minute, and optional second and day-period segments while submitting a native form value. Use it whenever a user must enter a time fast and precisely — scheduling, booking, time-window filtering, or any form that needs a validated time. For a date with a time, use `SDateField` with `granularity: 'minute'`; for a range, prefer `STimeRangeField`.

## Usage

<UsageCode component="time-field" />

## Features

- 🕐 Segmented editing — hour, minute, and optional second and day-period segments, each an editable `role="spinbutton"`
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for the value, backed by `useControllableState`
- 🕛 12/24-hour cycle — `hourCycle` switches between `AM/PM` and 24-hour display per locale, with day-period segment editing
- ⌨️ Full keyboard support — digit typing with auto-advance, `ArrowUp`/`ArrowDown` increment/decrement, `ArrowLeft`/`ArrowRight` segment navigation with RTL reversal
- ⛓ Time validation — `minValue`/`maxValue`/`isTimeUnavailable` mark the root `data-invalid`
- 📝 Native form value — a visually hidden `input[type="time"]` carries the ISO value to its owning form
- ⚙️ Granularity & step — `granularity` (hour/minute/second) and `step` control which segments render and the increment per arrow
- 🧩 Composable slots — `leading`/`trailing` place content around the segments
- 🚫 Disabled / readonly — both states block editing and render proper `data-*`/`aria-*` attributes

## Component family

- `STimeField` — the styled wrapper that forwards props to the Aria compact and injects `dateFieldVariants` (shared with `SDateField`) classes
- `TimeFieldCompact` (Aria) — data-driven composition of `TimeFieldRoot` + one `TimeFieldInput` per segment, plus `leading`/`trailing` slots; import from `@vean/aria/time-field` for unstyled usage
- `TimeFieldRoot` / `TimeFieldInput` (Aria) — the state owner (segment values, validation, hidden input, focus management) and a single editable segment bound to the shared `useDateField` composable

## Demos

<PlaygroundGallery component="time-field" />

## API

<ComponentApi component="time-field" />

## Notes

### Architecture and benchmark differences

`TimeFieldRoot` owns the `TimeValue` via `useControllableState`, keeps `segmentValues` as a shallowRef, and runs validation through `isInvalid`. Each `TimeFieldInput` binds the same `useDateField` composable used by the `date-field` family for per-part keydown logic; `TimeFieldCompact` iterates the segments produced by `createContent` and renders one input each, with `leading`/`trailing` slots around them. Focus movement is handled by the root's `moveFocus`, mapping the physical arrow key from `dir` so RTL swaps `ArrowLeft`/`ArrowRight`. Most benchmark libraries ship a plain text input or select-based picker; the segmented spinbutton pattern with keyboard increment/typing and the Aria/styled split are the differentiators.

| Capability                   | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :--------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Segmented editable segments  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled    |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 12/24-hour cycle             |   ✅   |     ✅     |      ✅      |    —    |    ✅    |   —    |
| Keyboard increment/typing    |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Segment navigation + RTL     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation             |   ✅   |     ✅     |      —       |    —    |    —     |   —    |
| `isTimeUnavailable`          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (second)         |   ✅   |     ✅     |      ✅      |    —    |    ✅    |   —    |
| Configurable step            |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| Native form value            |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `leading` / `trailing` slots |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled / readonly          |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### Cautions

- The value is a `TimeValue` — a native `Date` whose hour/minute/second parts are meaningful (the date part is normalized), not a `string`. Use it with the other date-family components.
- `defaultValue` is only read on mount — use `v-model` for external control.
- When the value is empty the segments display the placeholder time (derived from `defaultValue`/`defaultPlaceholder` or the current time) — the submitted form value is still empty until the user types.
- `granularity` defaults to `'minute'`; pass `'second'` for seconds segments or `'hour'` to hide the minute segment.
- `hourCycle` (`12`/`24`) controls the day-period segment and the accessible hour range; leave it unset to follow the locale.
- Time validation marks the root `data-invalid` but never clamps the value — clear or correct it in the parent.

## FAQ

### How do I edit a time with the keyboard?

Tab into the field and type digits — after the segment fills it advances automatically. `ArrowUp`/`ArrowDown` increment or decrement the focused segment, `ArrowLeft`/`ArrowRight` move between segments (reversed in RTL), and `Backspace` clears digits. On a 12-hour cycle `a`/`p` toggles `AM`/`PM`.

### How do I show seconds or hide the minute segment?

Pass `granularity: 'second'` to render hour, minute, and second segments, or `granularity: 'hour'` to render only the hour segment.

### How do I switch between 12-hour and 24-hour display?

Pass `hourCycle: 12` or `hourCycle: 24`. Leave it unset to follow the active locale.

### How do I restrict the selectable time?

Pass `minValue`/`maxValue` — times outside are marked `data-invalid` and rejected. `isTimeUnavailable` accepts a predicate for arbitrary exclusions.

### How is `STimeField` different from `SDateField` with `granularity: 'minute'`?

`STimeField` is a pure time input — it never renders date segments. `SDateField` with a time granularity renders the full date and time together (for example `2026/04/19 14:30`) and accepts a `{ date, time }` value.
