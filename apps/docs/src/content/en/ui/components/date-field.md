---
head:
  title: DateField
  description: 'A segmented date input that keeps day, month, year, and optional time values as separate keyboard-editable parts while still submitting a native form value. Use it for compact date entry where typing should be fast — birth dates, expiry dates, or any single date that needs validation against a range. For a date chosen from a calendar popup, prefer SDatePicker; for browsing a calendar grid, use SCalendar.'
---

# DateField

## Overview

A segmented date input that keeps day, month, year, and optional time values as separate keyboard-editable parts while still submitting a native form value. Use it for compact date entry where typing should be fast — birth dates, expiry dates, or any single date that needs validation against a range. For a date chosen from a calendar popup, prefer `SDatePicker`; for browsing a calendar grid, use `SCalendar`.

## Usage

<UsageCode component="date-field" />

## Features

- 🧩 Segmented input — each date part (day/month/year, optional hour/minute/second/dayPeriod) is an independent editable segment
- ⌨️ Full keyboard editing — arrow keys increment/decrement, typing fills digits, auto-advance to the next segment, Backspace deletes, `Enter`/focus-out commits
- 🎚 Controlled / uncontrolled — `v-model` and `defaultValue` backed by `useControllableState`, plus `update:placeholder`
- ⛓ Range validation — `minValue`/`maxValue`/`isDateUnavailable` drive the `data-invalid` + `aria-invalid` state
- 🕐 Granularity & time — `granularity` (day/hour/minute/second), 12/24-hour `hourCycle`, and `dayPeriod` segments
- 📝 Form native — a visually hidden input (`name`/`required`/`min`/`max`) submits the ISO value with the owning form
- 🚫 Disabled / readonly — both render proper `data-*`/`aria-*` state and block editing
- 🧩 Extensible — `leading`/`trailing` slots plus `ui.root`/`ui.input` class overrides, built on Aria `DateFieldRoot`/`DateFieldInput`

## Component family

- `SDateField` — the styled wrapper that forwards props to the Aria compact and injects `dateFieldVariants` classes
- `DateFieldCompact` (Aria) — data-driven composition of `DateFieldRoot` + per-segment `DateFieldInput`; import from `@vean/aria/date-field` for unstyled usage
- `DateFieldRoot` / `DateFieldInput` (Aria) — the state owner (segments, validation, hidden input) and a single editable segment

## Demos

<PlaygroundGallery component="date-field" />

## API

<ComponentApi component="date-field" />

## Notes

### Architecture and benchmark differences

`DateFieldRoot` owns the value (via `useControllableState`), derives the segment layout with `Intl.DateTimeFormat` formatters, and runs validation through `isInvalid`. Each `DateFieldInput` binds the `useDateField` composable, which implements per-part keydown logic (increment/decrement/typing/auto-advance/delete) shared by the `time-field` family. Editing mutates a `segmentValues` shallowRef; the root commits the assembled `DateValue` once every segment is filled. The segmented date-field pattern originates from reka-ui (Radix); the benchmark libraries express date input as a plain text input plus a picker popup instead.

| Capability                  | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :-------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Segmented editable parts    |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Keyboard increment/typing   |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Auto-advance between parts  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (minute/second) |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 12/24-hour `dayPeriod`      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled / readonly         |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Native form submission      |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `leading`/`trailing` slots  |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- A segment is committed as soon as every part is filled; deleting the last digit emits `update:modelValue` with `undefined`.
- `defaultValue` is only read on mount — use `v-model` for external control.
- The root uses `role="group"` and each editable part `role="spinbutton"` with `aria-valuemin`/`aria-valuemax`/`aria-valuenow`; add `aria-label` to the field so screen readers announce the whole control.
- Form submission requires `name`; `required`/`min`/`max` are reflected on the hidden input but do not run custom validation.
- `granularity="day"` renders `type="date"`; time granularities render `type="datetime-local"` on the hidden input.
- `readonly` differs from `disabled`: the field stays focusable and visible but blocks editing.

## FAQ

### How do I clear the value?

Backspace on a single-digit segment (or Backspace twice on a two-digit segment) empties it and emits `update:modelValue` with `undefined` — handle the `undefined` in the parent. The segments then fall back to placeholder styling.

### How do I restrict the selectable range?

Pass `minValue`/`maxValue` — the field marks itself `data-invalid` (plus `aria-invalid` on segments) when the value falls outside. `isDateUnavailable` accepts a predicate for arbitrary exclusions.

### How do I use 12-hour time?

Pass `hourCycle={12}` (or let it follow the locale) — the hour segment becomes 1–12 and a `dayPeriod` (AM/PM) segment appears. Arrow keys and `a`/`p` keys toggle the period.

### What is the difference between `SDateField` and `SDatePicker`?

`SDateField` is a pure segmented input with no popup — best for fast typing and form submission. `SDatePicker` embeds a `DateField` alongside a calendar popover for visual selection.

### How do I customize the look?

Use `ui.root`/`ui.input` for class overrides, or `leading`/`trailing` slots to place icons/units around the segments. For fully unstyled control, compose `DateFieldRoot`/`DateFieldInput` from `@vean/aria/date-field`.
