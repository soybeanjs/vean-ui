# Calendar

Source URL: https://veanui.com/components/calendar
Markdown URL: https://veanui.com/components/calendar.md
Category: Forms
Description: A monthly date grid that supports single or multiple selection, disabled and unavailable dates, min/max bounds, custom cell rendering, and month/year Select controls in the compact header. Use it for booking, scheduling, or any date-picking surface that needs keyboard-navigable grids instead of a plain text input. Pair it with SDatePicker when you need a popup trigger, or SRangeCalendar-style composites for range selection.

## Overview

A monthly date grid that supports single or multiple selection, disabled and unavailable dates, min/max bounds, custom cell rendering, and month/year Select controls in the compact header. Use it for booking, scheduling, or any date-picking surface that needs keyboard-navigable grids instead of a plain text input. Pair it with `SDatePicker` when you need a popup trigger, or `SRangeCalendar`-style composites for range selection.

## Usage

Usage examples for calendar are rendered on the site.

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

Interactive demos for calendar are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (14): Calendar, CalendarCell, CalendarCellTrigger, CalendarCompact, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev, CalendarRoot.

### Calendar

#### Props

Properties for the Calendar component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CalendarUi>`; optional)
- `headerProps`: Properties forwarded to the header element. (type `CalendarHeaderProps`; optional)
- `headingProps`: Properties forwarded to the heading element. (type `CalendarHeadingProps`; optional)
- `prevProps`: Properties forwarded to the prev element. (type `CalendarPrevProps`; optional)
- `nextProps`: Properties forwarded to the next element. (type `CalendarNextProps`; optional)
- `gridProps`: Properties forwarded to the grid element. (type `CalendarGridProps`; optional)
- `gridHeadProps`: Properties forwarded to the grid head element. (type `CalendarGridHeadProps`; optional)
- `gridBodyProps`: Properties forwarded to the grid body element. (type `CalendarGridBodyProps`; optional)
- `gridRowProps`: Properties forwarded to the grid row element. (type `CalendarGridRowProps`; optional)
- `headCellProps`: Properties forwarded to the head cell element. (type `CalendarHeadCellProps`; optional)
- `cellProps`: Properties forwarded to the cell element. (type `CalendarCellProps`; optional)
- `cellTriggerProps`: Properties forwarded to the cell trigger element. (type `CalendarCellTriggerProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `locale`: Locale. (type `string`; optional)
- `modelValue`: Current model value. (type `CalendarModelValue<M>`; optional)
- `defaultValue`: Default value. (type `CalendarModelValue<M>`; optional)
- `multiple`: Whether multiple values are supported. (type `M`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `pagedNavigation`: Whether paged navigation. (type `boolean`; optional)
- `preventDeselect`: Whether prevent deselect. (type `boolean`; optional)
- `weekStartsOn`: Week starts on. (type `WeekStartsOn`; optional)
- `weekdayFormat`: Weekday format. (type `WeekDayFormat`; optional)
- `calendarLabel`: Calendar label. (type `string`; optional)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `numberOfMonths`: Number of months. (type `number`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Calendar component.

- `update:modelValue`: Emitted when the model value changes. (type `[date: CalendarModelValue<M>]`; parameters `date: CalendarModelValue<M>`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)

#### Slots

Slots for the Calendar component.

- `default`: Custom content for the default slot. (type `((props: { modelValue: CalendarModelValue<M>; }) => any) | undefined`)
- `prev`: Custom content for the prev slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `heading`: Custom content for the heading slot. (type `((props: CalendarHeadingSlotProps) => any) | undefined`)
- `next`: Custom content for the next slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `head-cell`: Custom content for the head cell slot. (type `((props: { date: Date; index: number; label: string; }) => any) | undefined`)
- `day`: Custom content for the day slot. (type `((props: CalendarDaySlotProps) => any) | undefined`)

### CalendarCell

#### Props

Properties for the CalendarCell component.

- `date`: Date. (type `Date`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarCellTrigger

#### Props

Properties for the CalendarCellTrigger component.

- `day`: Day. (type `Date`; required)
- `month`: Month. (type `Date`; required)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the CalendarCellTrigger component.

- `default`: Custom content for the default slot. (type `((props: CalendarCellTriggerSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the CalendarCellTrigger component.

- `dayValue`: Day value string exposed in the slot scope. (type `string`; required)
- `disabled`: Whether the date is disabled. (type `boolean`; required)
- `selected`: Whether the date is selected. (type `boolean`; required)
- `unavailable`: Whether the date is unavailable. (type `boolean`; required)
- `today`: Whether the date is today. (type `boolean`; required)
- `outsideView`: Whether the date is outside the current view. (type `boolean`; required)
- `outsideVisibleView`: Whether the date is outside the visible view. (type `boolean`; required)

### CalendarCompact

#### Props

Properties for the CalendarCompact component.

- `headerProps`: Properties forwarded to the header element. (type `CalendarHeaderProps`; optional)
- `headingProps`: Properties forwarded to the heading element. (type `CalendarHeadingProps`; optional)
- `prevProps`: Properties forwarded to the prev element. (type `CalendarPrevProps`; optional)
- `nextProps`: Properties forwarded to the next element. (type `CalendarNextProps`; optional)
- `gridProps`: Properties forwarded to the grid element. (type `CalendarGridProps`; optional)
- `gridHeadProps`: Properties forwarded to the grid head element. (type `CalendarGridHeadProps`; optional)
- `gridBodyProps`: Properties forwarded to the grid body element. (type `CalendarGridBodyProps`; optional)
- `gridRowProps`: Properties forwarded to the grid row element. (type `CalendarGridRowProps`; optional)
- `headCellProps`: Properties forwarded to the head cell element. (type `CalendarHeadCellProps`; optional)
- `cellProps`: Properties forwarded to the cell element. (type `CalendarCellProps`; optional)
- `cellTriggerProps`: Properties forwarded to the cell trigger element. (type `CalendarCellTriggerProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `locale`: Locale. (type `string`; optional)
- `modelValue`: Current model value. (type `CalendarModelValue<M>`; optional)
- `defaultValue`: Default value. (type `CalendarModelValue<M>`; optional)
- `multiple`: Whether multiple values are supported. (type `M`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `pagedNavigation`: Whether paged navigation. (type `boolean`; optional)
- `preventDeselect`: Whether prevent deselect. (type `boolean`; optional)
- `weekStartsOn`: Week starts on. (type `WeekStartsOn`; optional)
- `weekdayFormat`: Weekday format. (type `WeekDayFormat`; optional)
- `calendarLabel`: Calendar label. (type `string`; optional)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `numberOfMonths`: Number of months. (type `number`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the CalendarCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[date: CalendarModelValue<M>]`; parameters `date: CalendarModelValue<M>`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)

#### Slots

Slots for the CalendarCompact component.

- `default`: Custom content for the default slot. (type `((props: { modelValue: CalendarModelValue<M>; }) => any) | undefined`)
- `prev`: Custom content for the prev slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `heading`: Custom content for the heading slot. (type `((props: CalendarHeadingSlotProps) => any) | undefined`)
- `next`: Custom content for the next slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `head-cell`: Custom content for the head cell slot. (type `((props: { date: Date; index: number; label: string; }) => any) | undefined`)
- `day`: Custom content for the day slot. (type `((props: CalendarDaySlotProps) => any) | undefined`)

### CalendarGrid

#### Props

Properties for the CalendarGrid component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarGridBody

#### Props

Properties for the CalendarGridBody component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarGridHead

#### Props

Properties for the CalendarGridHead component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarGridRow

#### Props

Properties for the CalendarGridRow component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarHeadCell

#### Props

Properties for the CalendarHeadCell component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarHeader

#### Props

Properties for the CalendarHeader component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarHeading

#### Props

Properties for the CalendarHeading component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slot Props

Slot properties for the CalendarHeading component.

- `selectedMonth`: No description. (type `number`; required)
- `selectedYear`: No description. (type `number`; required)
- `headingValue`: Heading value exposed in the slot scope. (type `string`; required)
- `yearOptions`: Year options exposed in the slot scope. (type `SelectOptionData<number>[]`; required)
- `onYearChange`: Callback invoked when the year changes. (type `(value?: number | undefined) => void`; required)
- `monthOptions`: Month options exposed in the slot scope. (type `SelectOptionData<number>[]`; required)
- `onMonthChange`: Callback invoked when the month changes. (type `(value?: number | undefined) => void`; required)

### CalendarNext

#### Props

Properties for the CalendarNext component.

- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarPrev

#### Props

Properties for the CalendarPrev component.

- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRoot

#### Props

Properties for the CalendarRoot component.

- `dir`: Reading direction of the component. (type `Direction`; optional)
- `locale`: Locale. (type `string`; optional)
- `modelValue`: Current model value. (type `CalendarModelValue<M>`; optional)
- `defaultValue`: Default value. (type `CalendarModelValue<M>`; optional)
- `multiple`: Whether multiple values are supported. (type `M`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `pagedNavigation`: Whether paged navigation. (type `boolean`; optional)
- `preventDeselect`: Whether prevent deselect. (type `boolean`; optional)
- `weekStartsOn`: Week starts on. (type `WeekStartsOn`; optional)
- `weekdayFormat`: Weekday format. (type `WeekDayFormat`; optional)
- `calendarLabel`: Calendar label. (type `string`; optional)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `numberOfMonths`: Number of months. (type `number`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the CalendarRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[date: CalendarModelValue<M>]`; parameters `date: CalendarModelValue<M>`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)

#### Slots

Slots for the Calendar component.

- `default`: Custom content for the default slot. (type `((props: CalendarRootSlotProps<M>) => any) | undefined`)

#### Slot Props

Slot properties for the CalendarRoot component.

- `date`: Date exposed in the slot scope. (type `Date | import("../../date").DateTimeValue`; required)
- `headingValue`: Heading value exposed in the slot scope. (type `string`; required)
- `placeholder`: Placeholder exposed in the slot scope. (type `Date | import("../../date").DateTimeValue`; required)
- `grid`: Grid exposed in the slot scope. (type `DateGrid<Date>[]`; required)
- `weekDays`: Week days exposed in the slot scope. (type `string[]`; required)
- `weekStartsOn`: Week starts on exposed in the slot scope. (type `number`; required)
- `locale`: Locale exposed in the slot scope. (type `string`; required)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; required)
- `modelValue`: Current model value. (type `M extends true ? DateValue[] | undefined : DateValue | undefined`; required)
- `formatter`: Formatter exposed in the slot scope. (type `Formatter`; required)
- `minValue`: Min value exposed in the slot scope. (type `DateValue | undefined`; required)
- `maxValue`: Max value exposed in the slot scope. (type `DateValue | undefined`; required)
- `disabled`: Whether the component is disabled. (type `boolean`; required)
- `onPlaceholderChange`: Callback invoked when the placeholder changes. (type `(date: DateValue) => void`; required)
- `yearOptions`: Year options exposed in the slot scope. (type `SelectOptionData<number>[]`; required)
- `onYearChange`: Callback invoked when the year changes. (type `(value?: number | undefined) => void`; required)
- `monthOptions`: Month options exposed in the slot scope. (type `SelectOptionData<number>[]`; required)
- `onMonthChange`: Callback invoked when the month changes. (type `(value?: number | undefined) => void`; required)

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
