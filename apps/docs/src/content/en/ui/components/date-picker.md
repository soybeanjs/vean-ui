---
head:
  title: DatePicker
  description: 'A date picker that pairs a keyboard-editable segmented date field with a calendar popup for visual selection. Type a date directly into the segments or click the calendar toggle to pick from a month grid. Use it whenever a user must choose a single date — booking, scheduling, filtering, or any form that needs a validated date range. For pure typing with no popup, prefer SDateField; for browsing a standalone calendar grid, use SCalendar.'
---

# DatePicker

## Overview

A date picker that pairs a keyboard-editable segmented date field with a calendar popup for visual selection. Type a date directly into the segments or click the calendar toggle to pick from a month grid. Use it whenever a user must choose a single date — booking, scheduling, filtering, or any form that needs a validated date range. For pure typing with no popup, prefer `SDateField`; for browsing a standalone calendar grid, use `SCalendar`.

## Usage

<UsageCode component="date-picker" />

## Features

- 📅 Field + popup combo — the segmented `DateField` stays editable while a calendar popover offers visual selection
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for the value plus `open`/`defaultOpen` for the popup, both backed by `useControllableState`
- ⌨️ Full keyboard editing — segment increment/decrement/typing in the field, arrow-key grid navigation in the calendar, `Escape` closes
- ⛓ Range validation — `minValue`/`maxValue`/`isDateUnavailable` disable out-of-range and unavailable days in both the field and the calendar
- 🌍 Locale-aware accessibility — default `aria-label`s for the calendar toggle and popup dialog come from the active locale messages and are overridable via `triggerProps`/`popupProps`
- 🧩 Composable slots — `leading` for content before the segments, `default` slot props expose `open`/`close`/`calendarProps` for a fully custom popup
- 🎨 Fine-grained styling — `ui` covers the field plus `trigger`/`positioner`/`popup` slots, and `calendarUi` targets the embedded calendar independently
- 🚫 Disabled state — `disabled` blocks both field editing and popup opening

## Component family

- `SDatePicker` — the styled wrapper that forwards props to the Aria compact, injects `datePickerVariants` (extending `dateFieldVariants`), and renders `SCalendar` inside the popup
- `DatePickerCompact` (Aria) — data-driven composition of `DateFieldCompact` + `PopoverCompact` (calendar-icon trigger) that exposes the popup state and `calendarProps` through its default slot; import from `@vean/aria/date-picker` for unstyled usage
- `DateFieldCompact` / `PopoverCompact` / `CalendarCompact` (Aria) — the segmented field, the popover mechanics, and the calendar grid that back the picker

## Demos

<PlaygroundGallery component="date-picker" />

## API

<ComponentApi component="date-picker" />

## Notes

### Architecture and benchmark differences

`SDatePicker` forwards props to `DatePickerCompact`, which wires `DateFieldCompact` (segments + validation) and `PopoverCompact` (a `lucide:calendar` icon trigger with `aria-haspopup="dialog"`). The styled layer injects `datePickerVariants` classes through `provideDatePickerUi` so the nested popover parts get `trigger`/`positioner`/`popup` styling, then renders `SCalendar` in the default slot with the forwarded `calendarProps`. Selecting a day emits `update:modelValue` and closes the popup. The popup is a `role="dialog"` with a default accessible name from the locale `popupLabel` message; the toggle gets `toggle`. Most benchmark libraries ship a plain text input plus a picker panel; the segmented-field-plus-popover combo and the Aria/styled split are the differentiators.

| Capability                       | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :------------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split                |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Segmented field + calendar popup |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled value  |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Controlled / uncontrolled open   |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Keyboard segment editing         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Calendar keyboard navigation     |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| Range validation                 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled state                   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Locale-driven accessible names   |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `leading` slot                   |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Independent `calendarUi`         |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- The value is a `DateValue` (`Date` or `{ date, time? }`) — not a `string`. Use it with `SDateField`, `SCalendar`, and the other date-family components.
- `defaultValue`/`defaultOpen` are only read on mount — use `v-model`/`open` for external control.
- The toggle button is the calendar icon; its default `aria-label` (locale `toggle`) can be overridden through `triggerProps['aria-label']`. The icon itself is fixed — to render a custom trigger, compose `DatePickerCompact` from `@vean/aria/date-picker` with your own popover content.
- The popup `role="dialog"` gets its accessible name from the locale `popupLabel` message; override it through `popupProps['aria-label']`.
- Pass `dateFieldProps` (e.g. `placeholder`, `locale`, `granularity`) to configure the embedded segmented field; field and calendar share `minValue`/`maxValue`/`isDateUnavailable`.
- `calendarUi` is consumed by the embedded calendar and never reaches the DOM — the same applies to `dateFieldProps`.

## FAQ

### How do I choose a date with the keyboard?

Tab into the segmented field and type digits or use arrow keys, or press the calendar toggle and navigate the month grid with arrow keys, `Home`/`End` and `PageUp`/`PageDown`; `Enter` selects and closes, `Escape` closes without selecting.

### How do I restrict the selectable range?

Pass `minValue`/`maxValue` — out-of-range days are disabled in the calendar and the field marks itself `data-invalid`. `isDateUnavailable` accepts a predicate for arbitrary exclusions and applies to both the field and the calendar.

### How do I configure the embedded date field?

Use `dateFieldProps` — for example `{ placeholder }`, `{ locale }`, `{ granularity: 'minute' }` or `{ hourCycle: 12 }`. The field accepts the same props as `SDateField` itself.

### How do I customize the calendar look?

`calendarUi` overrides the calendar's per-slot classes independently of `ui`. For deeper customization, the default slot receives `calendarProps` (plus `open`/`close`) so you can render your own popup content with `CalendarCompact` from `@vean/aria/calendar`.

### How is `SDatePicker` different from `SDateField`?

`SDateField` is a pure segmented input with no popup — fastest for typing and form submission. `SDatePicker` adds the calendar popover on top of the same field, trading a little footprint for visual selection.
