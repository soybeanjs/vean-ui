# DateField

Source URL: https://veanui.com/components/date-field
Markdown URL: https://veanui.com/components/date-field.md
Category: Forms
Description: A segmented date input that keeps day, month, year, and optional time values as separate keyboard-editable parts while still submitting a native form value. Use it for compact date entry where typing should be fast — birth dates, expiry dates, or any single date that needs validation against a range. For a date chosen from a calendar popup, prefer SDatePicker; for browsing a calendar grid, use SCalendar.

## Overview

A segmented date input that keeps day, month, year, and optional time values as separate keyboard-editable parts while still submitting a native form value. Use it for compact date entry where typing should be fast — birth dates, expiry dates, or any single date that needs validation against a range. For a date chosen from a calendar popup, prefer `SDatePicker`; for browsing a calendar grid, use `SCalendar`.

## Usage

Usage examples for date-field are rendered on the site.

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

Interactive demos for date-field are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): DateField, DateFieldCompact, DateFieldInput, DateFieldRoot.

### DateField

#### Props

Properties for the DateField component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<DateFieldUi>`; optional)
- `inputProps`: Properties forwarded to the input element. (type `DateFieldInputProps`; optional)
- `id`: Id. (type `string`; optional)
- `granularity`: Granularity. (type `Granularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `step`: Step. (type `DateStep`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `modelValue`: Current model value. (type `DateValue`; optional)
- `defaultValue`: Default value. (type `DateValue`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DateField component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: DateValue | undefined]`; parameters `value: DateValue | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[value: DateValue]`; parameters `value: DateValue`)

### DateFieldCompact

#### Props

Properties for the DateFieldCompact component.

- `inputProps`: Properties forwarded to the input element. (type `DateFieldInputProps`; optional)
- `id`: Id. (type `string`; optional)
- `granularity`: Granularity. (type `Granularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `step`: Step. (type `DateStep`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `modelValue`: Current model value. (type `DateValue`; optional)
- `defaultValue`: Default value. (type `DateValue`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DateFieldCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: DateValue | undefined]`; parameters `value: DateValue | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[value: DateValue]`; parameters `value: DateValue`)

### DateFieldInput

#### Props

Properties for the DateFieldInput component.

- `part`: Part. (type `import("../../date").EditableSegmentPart | import("../../date").NonEditableSegmentPart`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### DateFieldRoot

#### Props

Properties for the DateFieldRoot component.

- `id`: Id. (type `string`; optional)
- `granularity`: Granularity. (type `Granularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `step`: Step. (type `DateStep`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `modelValue`: Current model value. (type `DateValue`; optional)
- `defaultValue`: Default value. (type `DateValue`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DateFieldRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: DateValue | undefined]`; parameters `value: DateValue | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[value: DateValue]`; parameters `value: DateValue`)

#### Slots

Slots for the DateFieldRoot component.

- `default`: No description. (type `((props: DateFieldRootSlotProps) => any) | undefined`)

#### Slot Props

Properties for the DateFieldRoot slot.

- `modelValue`: Current model value. (type `DateValue | undefined`; required)
- `segments`: Segments used by the default slot. (type `DateFieldSegment[]`; required)
- `isInvalid`: Whether the current value is invalid. (type `boolean`; required)

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
