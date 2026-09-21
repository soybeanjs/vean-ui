---
head:
  title: DateRangePicker
  description: 'A date range picker that pairs a keyboard-editable dual segmented date range field with a calendar range popup for visual selection. Type a start and end date directly into the segments or click the calendar toggle and pick both ends from a single month-range grid. Use it whenever a user must choose a bounded interval — booking stay dates, reporting windows, or filter ranges. For pure typing with no popup, prefer SDateRangeField; for a single date with a popup, use SDatePicker.'
---

# DateRangePicker

## Overview

A date range picker that pairs a keyboard-editable dual segmented date range field with a calendar range popup for visual selection. Type a start and end date directly into the segments or click the calendar toggle and pick both ends from a single month-range grid. Use it whenever a user must choose a bounded interval — booking stay dates, reporting windows, or filter ranges. For pure typing with no popup, prefer `SDateRangeField`; for a single date with a popup, use `SDatePicker`.

## Usage

<UsageCode component="date-range-picker" />

## Features

- 📅 Dual field + popup combo — the segmented `DateRangeField` stays editable while a `CalendarRange` popover offers visual selection of both dates
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for the value plus `open`/`defaultOpen` for the popup, both backed by `useControllableState`
- ⌨️ Full keyboard editing — segment increment/decrement/typing in both groups, cross-group arrow movement, arrow-key grid navigation in the calendar, `Escape` closes
- ⛓ Range validation — `minValue`/`maxValue`/`isDateUnavailable` disable out-of-range and unavailable days in both the field and the calendar
- 🌍 Locale-aware accessibility — default `aria-label`s for the calendar toggle and popup dialog come from the active locale messages and are overridable via `triggerProps`/`popupProps`
- 🧩 Composable slots — `leading` for content before the segments and `separator` for a custom divider; the default slot exposes `open`/`close`/`calendarRangeProps` for a fully custom popup
- 🎨 Fine-grained styling — `ui` covers the field plus `trigger`/`positioner`/`popup` slots, and `calendarRangeUi` targets the embedded calendar independently
- 🚫 Disabled state — `disabled` blocks both field editing and popup opening

## Component family

- `SDateRangePicker` — the styled wrapper that forwards props to the Aria compact, injects `dateRangePickerVariants` (extending `dateFieldVariants`), and renders `SCalendarRange` inside the popup
- `DateRangePickerCompact` (Aria) — data-driven composition of `DateRangeFieldCompact` + `PopoverCompact` (calendar-icon trigger) that exposes the popup state and `calendarRangeProps` through its default slot; import from `@vean/aria/date-range-picker` for unstyled usage
- `DateRangeFieldCompact` / `PopoverCompact` / `CalendarRangeCompact` (Aria) — the dual segmented field, the popover mechanics, and the range calendar grid that back the picker

## Demos

<PlaygroundGallery component="date-range-picker" />

## API

<ComponentApi component="date-range-picker" />

## Notes

### Architecture and benchmark differences

`SDateRangePicker` forwards props to `DateRangePickerCompact`, which wires `DateRangeFieldCompact` (dual segments + validation) and `PopoverCompact` (a `lucide:calendar` icon trigger with `aria-haspopup="dialog"`). The styled layer injects `dateRangePickerVariants` classes through `provideDateRangePickerUi` so the nested popover parts get `trigger`/`positioner`/`popup` styling, then renders `SCalendarRange` in the default slot with the forwarded `calendarRangeProps`. Selecting a start and an end day emits `update:modelValue` and closes the popup once both ends are set. The popup is a `role="dialog"` with a default accessible name from the locale `popupLabel` message; the toggle gets `toggle`. Most benchmark libraries ship two plain text inputs plus a range panel; the dual-segmented-field-plus-popover combo, the cross-group keyboard focus, and the Aria/styled split are the differentiators.

| Capability                         | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :--------------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split                  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual segmented field + range popup |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled value    |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Controlled / uncontrolled open     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Keyboard segment editing           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Cross-group focus movement         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Calendar keyboard navigation       |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| Range validation                   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`                |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled state                     |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Locale-driven accessible names     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `leading` / `separator` slots      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Independent `calendarRangeUi`      |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- The value is a `DateRange` — an object `{ start, end }` of `DateValue`s, not a `string`. Use it with `SDateRangeField`, `SCalendarRange`, and the other date-family components.
- `defaultValue`/`defaultOpen` are only read on mount — use `v-model`/`open` for external control.
- The toggle button is the calendar icon; its default `aria-label` (locale `toggle`) can be overridden through `triggerProps['aria-label']`. The icon itself is fixed — to render a custom trigger, compose `DateRangePickerCompact` from `@vean/aria/date-range-picker` with your own popover content.
- The popup `role="dialog"` gets its accessible name from the locale `popupLabel` message; override it through `popupProps['aria-label']`.
- Pass `dateFieldProps` (e.g. `placeholder`, `locale`, `granularity`) to configure the embedded dual segmented field; field and calendar share `minValue`/`maxValue`/`isDateUnavailable`.
- `calendarRangeUi` is consumed by the embedded calendar and never reaches the DOM — the same applies to `dateFieldProps`.
- A start later than end is marked invalid but the values are never swapped automatically — clear or correct them in the parent.

## FAQ

### How do I choose a date range with the keyboard?

Tab into either segmented group and type digits or use arrow keys, or press the calendar toggle and navigate the month grid with arrow keys, `Home`/`End` and `PageUp`/`PageDown`; `Enter` commits the selection, `Escape` closes without selecting. Both ends must be picked for the value to emit.

### How do I restrict the selectable range?

Pass `minValue`/`maxValue` — out-of-range days are disabled in the calendar and the field marks itself `data-invalid`. `isDateUnavailable` accepts a predicate for arbitrary exclusions and applies to both the field and the calendar.

### How do I configure the embedded date range field?

Use `dateFieldProps` — for example `{ placeholder }`, `{ locale }`, `{ granularity: 'minute' }` or `{ hourCycle: 12 }`. The field accepts the same props as `SDateRangeField` itself.

### How do I customize the calendar look?

`calendarRangeUi` overrides the range calendar's per-slot classes independently of `ui`. For deeper customization, the default slot receives `calendarRangeProps` (plus `open`/`close`) so you can render your own popup content with `CalendarRangeCompact` from `@vean/aria/calendar-range`.

### How is `SDateRangePicker` different from `SDateRangeField`?

`SDateRangeField` is a pure dual segmented input with no popup — fastest for typing and form submission. `SDateRangePicker` adds the calendar range popover on top of the same field, trading a little footprint for visual selection.
