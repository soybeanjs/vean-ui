---
head:
  title: Calendar
  description: 'A monthly date grid that supports single or multiple selection, disabled and unavailable dates, min/max bounds, custom cell rendering, and month/year Select controls in the compact header. Use it for booking, scheduling, or any date-picking surface that needs keyboard-navigable grids instead of a plain text input. Pair it with SDatePicker when you need a popup trigger, or SRangeCalendar-style composites for range selection.'
---

# Calendar

## Overview

A monthly date grid that supports single or multiple selection, disabled and unavailable dates, min/max bounds, custom cell rendering, and month/year Select controls in the compact header. Use it for booking, scheduling, or any date-picking surface that needs keyboard-navigable grids instead of a plain text input. Pair it with `SDatePicker` when you need a popup trigger, or `SRangeCalendar`-style composites for range selection.

## Usage

<UsageCode component="calendar" />

## Features

- 📅 Month grid — one or more month grids (`numberOfMonths`) with locale-aware weekday headers, today, and outside-view markers
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for single dates or date arrays (`multiple`), backed by `useControllableState`
- ✅ Multiple selection — click or keyboard-toggle dates; `preventDeselect` keeps the selection sticky
- ⌨️ Full keyboard support — `ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown` navigation with RTL reversal, cross-month paging, and disabled-date skipping; `Enter`/`Space` selects
- ⛓ Bounds & matching — `minValue`/`maxValue` clamp the page and disable out-of-range dates; `isDateDisabled`/`isDateUnavailable` mark arbitrary dates
- 🧩 Composable slots — `day`, `head-cell`, `heading`, `prev`, and `next` slots with rich slot props; `*Props` passthrough for every sub-part
- 🔤 Localized UI — `locale`, `weekStartsOn`, and `weekdayFormat`; month/year Select controls carry localized `aria-label`s
- 🗓 Month/year controls — compact header renders Select controls for fast month/year jumps, disabled per `minValue`/`maxValue`
- ↕️ Fixed weeks — `fixedWeeks` renders a consistent 6-row grid; `initialFocus` moves focus into the grid on mount
- 🚫 Disabled / readonly — `disabled` blocks all interaction; `readonly` keeps browsing but blocks selection

## Component family

- `SCalendar` — the styled wrapper that forwards props to the Aria compact and injects `calendarVariants` classes (12 slots, shared button icon recipes for prev/next)
- `CalendarCompact` (Aria) — data-driven composition of `CalendarRoot` + header (prev/heading/next) + one grid per month (grid head/body rows of `CalendarCellTrigger`); import from `@vean/aria/calendar` for unstyled usage
- `CalendarRoot` (Aria) — state owner: `useControllableState` for value/placeholder, `useCalendar` for grid/month pages and validation, `useCalendarState` for selected/invalid state
- `CalendarCellTrigger` / `CalendarCell` / `CalendarGrid*` (Aria) — the editable day button (keyboard handling, focus management, data attributes) and its semantic grid cell wrappers

## Demos

<PlaygroundGallery component="calendar" />

## API

<ComponentApi component="calendar" />

## Notes

### Architecture and benchmark differences

`CalendarRoot` owns the value via `useControllableState` (single date or array when `multiple`), keeps the placeholder for grid paging, and delegates grid creation to `useCalendar` (which rebuilds the grid on locale/week-start/placeholder changes and clamps pages with `minValue`/`maxValue`). `useCalendarState` derives selected/invalid state. `CalendarCellTrigger` is the only interactive piece: it reads the shared context, computes `data-focused`/`data-selected`/`data-today`/`data-unavailable`/`data-outside-view`, handles Arrow/Enter/Space keys with `dir`-aware direction (RTL flips ArrowLeft/ArrowRight), and pages to adjacent months when navigation crosses the grid boundary. The compact owns iteration over months/weeks/days and the header wiring (prev/heading/next with month/year Select controls). Most benchmark libraries ship a monolithic calendar panel; the Aria/styled split, per-part `*Props` passthrough, and slot-driven cell rendering are the differentiators.

| Capability                     | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :----------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Single / multiple selection    |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Keyboard grid navigation       |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| RTL direction reversal         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `numberOfMonths` grid          |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `minValue`/`maxValue` bounds   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateDisabled` / unavailable |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `fixedWeeks` / `weekStartsOn`  |   ✅   |     —      |      ✅      |   ✅    |    —     |   —    |
| Month/year Select controls     |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| Custom `prevPage`/`nextPage`   |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Per-part `*Props` passthrough  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Localized `aria-label`s        |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |

### Cautions

- The value is a native `Date` at local midnight (the `DateValue` model: `Date` or `{ date, time? }`). Use `date-fns` or `Intl` when formatting or converting.
- `multiple` changes the model shape to `DateValue[]`; the `M` generic infers it from the prop.
- `defaultValue`/`defaultPlaceholder` are read on mount only — use `v-model` for external control.
- `isDateDisabled` and `isDateUnavailable` differ: disabled dates are unselectable by policy, unavailable dates are additionally marked visually (`line-through` in the default style).
- Dates outside the current month are rendered by default; pass `disableDaysOutsideCurrentView` to disable them.
- The prev/next `aria-label`s default to locale messages; override per button through `prevProps`/`nextProps`.
- Navigation buttons auto-disable at `minValue`/`maxValue`; custom `prevPage`/`nextPage` functions take part in that computation.

## FAQ

### How do I select multiple dates?

Pass `multiple` (boolean shorthand works in templates) and bind `v-model` to an array of `DateValue`s. Clicking toggles dates; `preventDeselect` stops removal.

### How do I prevent dates before today?

Pass `minValue={new Date(2026, 0, 1)}` (or any `DateValue`). Out-of-range dates are disabled and the prev button auto-disables at the bound.

### How do I show several months at once?

Set `numberOfMonths={2}` — the calendar renders two month grids side by side and pages both when crossing the boundary.

### Why is `PageUp`/`PageDown` not handled?

Grid navigation currently covers Arrow keys, `Enter`/`Space`, and cross-month paging. `PageUp`/`PageDown`/`Home`/`End` (present in Ant Design/Element Plus panels) are a scheduled enhancement.

### How do I build a date range with this component?

Use `SRangeCalendar` for a dedicated range grid, or pair two `SCalendar`s with `minValue`/`maxValue` bound to the other side's selection.
