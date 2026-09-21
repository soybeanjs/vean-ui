---
head:
  title: CalendarRange
  description: 'CalendarRange displays one or more month grids and lets users pick a start and end date directly from the calendar surface. Selecting the first date starts the range, a live hover preview highlights the candidate range, and the second click commits it — with reversed selections sorted automatically. Use it for booking, scheduling, or any range-picking surface that needs a keyboard-navigable grid instead of two text inputs. Pair it with SDateRangePicker when you need a popup trigger, or use it standalone inside forms and custom layouts.'
---

# CalendarRange

## Overview

CalendarRange displays one or more month grids and lets users pick a start and end date directly from the calendar surface. Selecting the first date starts the range, a live hover preview highlights the candidate range, and the second click commits it — with reversed selections sorted automatically. Use it for booking, scheduling, or any range-picking surface that needs a keyboard-navigable grid instead of two text inputs. Pair it with `SDateRangePicker` when you need a popup trigger, or use it standalone inside forms and custom layouts.

## Usage

<UsageCode component="calendar-range" />

## Features

- 📅 Month grids — one or more grids (`numberOfMonths`) with locale-aware weekday headers, today, and outside-view markers
- 🎯 Range picking — click start then end (in either order, sorted automatically); hover previews the candidate range before commit
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` bound to a `DateRange` (`{ start, end }`), backed by `useControllableState`
- ⌨️ Full keyboard support — `ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown` navigation with RTL reversal, cross-month paging, and disabled-date skipping; `Enter`/`Space` selects the start/end
- ⛓ Range constraints — `allowNonContiguousRanges` toggles gaps, `maximumDays` caps the span, `isDateDisabled`/`isDateUnavailable`/`isDateHighlightable` control every day, `minValue`/`maxValue` clamp the page
- 📌 Fixed anchors — `fixedDate` (`'start'`/`'end'`) keeps one end pinned while re-picking the other; `preventDeselect` keeps a lone start sticky
- 🧩 Composable slots — `day`, `head-cell`, `heading`, `prev`, and `next` slots with rich slot props; `*Props` passthrough for every sub-part
- 🔤 Localized UI — `locale`, `weekStartsOn`, and `weekdayFormat`; month/year Select controls carry localized `aria-label`s
- 🚫 Disabled / readonly — `disabled` blocks all interaction; `readonly` keeps browsing but blocks selection
- ↕️ Fixed weeks — `fixedWeeks` renders a consistent 6-row grid; `initialFocus` moves focus into the grid on mount
- 🖱 Live hover preview — `data-highlighted`/`data-highlighted-start`/`data-highlighted-end` attributes drive range preview styling while picking the end

## Component family

- `SCalendarRange` — the styled wrapper that forwards props to the Aria compact, injects `calendarRangeVariants` classes (12 slots, shared button icon recipes), and renders the default month/year Select controls in the heading
- `CalendarRangeCompact` (Aria) — data-driven composition of `CalendarRangeRoot` + header (prev/heading/next) + one grid per month (grid head/body rows of `CalendarRangeCellTrigger`); import from `@vean/aria/calendar-range` for unstyled usage
- `CalendarRangeRoot` (Aria) — state owner: `useControllableState` for `DateRange`/placeholder, `useCalendar` for grid/month pages, `useCalendarRangeState` for selected/highlighted/invalid state and candidate-range validation
- `CalendarRangeCellTrigger` / `CalendarRangeCell` / `CalendarRangeGrid*` (Aria) — the editable day button (keyboard handling, focus management, range data attributes) and its semantic grid cell wrappers

## Demos

<PlaygroundGallery component="calendar-range" />

## API

<ComponentApi component="calendar-range" />

## Notes

### Architecture and benchmark differences

`CalendarRangeRoot` owns the value via `useControllableState` (`DateRange` = `{ start, end }`), keeps the placeholder for grid paging, and delegates grid creation to `useCalendar` (shared with `calendar`). `useCalendarRangeState` derives selected/highlighted state and exposes `isRangeInvalid(start, end)` — a candidate-range validator used both by the derived `data-invalid` state and by `onDateChange` when committing a new range (so a non-contiguous range is rejected based on the candidate, not the previously committed state). `CalendarRangeCellTrigger` is the only interactive piece: it reads the shared context, computes `data-selection-start`/`data-selection-end`/`data-highlighted`/`data-selected`/`data-today`/`data-unavailable`/`data-outside-view`, handles Arrow/Enter/Space keys with `dir`-aware direction (RTL flips ArrowLeft/ArrowRight), and pages to adjacent months when navigation crosses the grid boundary. `CalendarRangeCell` carries `data-in-range` for the days of a committed range, which is what the styled band keys on — a lone start is `data-selected` without a band, so the band can only appear once both ends are picked. Most benchmark libraries ship a monolithic range panel; the Aria/styled split, per-part `*Props` passthrough, hover preview, and candidate-range validation are the differentiators.

| Capability                     | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :----------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range picking (start + end)    |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Hover range preview            |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| Keyboard grid navigation       |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| RTL direction reversal         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `numberOfMonths` grid          |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `allowNonContiguousRanges`     |   ✅   |     —      |      ✅      |   ✅    |    —     |   —    |
| `maximumDays` cap              |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `fixedDate` pinned end         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `minValue`/`maxValue` bounds   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateDisabled` / unavailable |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Month/year Select controls     |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| Candidate-range validation     |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- The value is a `DateRange` — `{ start, end }` of `DateValue`s (native `Date` at local midnight), never strings.
- A range with gaps is rejected by default (the second click restarts the range at the clicked day); pass `allowNonContiguousRanges` to allow gaps.
- `defaultValue`/`defaultPlaceholder` are read on mount only — use `v-model` for external control.
- `isDateDisabled` and `isDateUnavailable` differ: disabled dates are unselectable by policy, unavailable dates are additionally marked visually (`line-through` in the default style).
- `fixedDate` pins one end: with `fixedDate="start"` re-picking always updates the end; with `fixedDate="end"` re-picking always updates the start.
- The prev/next `aria-label`s default to locale messages; override per button through `prevProps`/`nextProps`.
- Each day button's `aria-label` defaults to the full localized date; override it per cell through `cellTriggerProps`.
- The range band is cell-level: days inside a committed range carry `data-in-range` (a lone start is `data-selected` only, so it draws no band). Key custom band styling on `ui.cell` + `data-in-range`, not on `data-selected`.

## FAQ

### How do I select a range?

Click the start date, then the end date — in either order. While picking the end, the hovered span is previewed with the highlighted state. The range is emitted as `{ start, end }` via `v-model`.

### How do I prevent ranges that span unavailable days?

Keep `allowNonContiguousRanges` off (default): when the second click would create a range crossing a disabled or unavailable day, the selection is rejected and restarts at the clicked day. Set `allowNonContiguousRanges` to allow gaps.

### How do I cap the range length?

Pass `maximumDays` (inclusive). Clicking an end that exceeds the cap restarts the selection at the clicked day.

### How do I keep one end fixed while re-picking?

Pass `fixedDate="start"` (or `"end"`). Clicking any day updates the other end, and clicking before/after the pinned end sorts the result automatically.

### How do I build a popup range picker?

Use `SDateRangePicker`, which composes `CalendarRangeCompact` inside a popover trigger. Use `SCalendarRange` standalone when the calendar surface is always visible.
