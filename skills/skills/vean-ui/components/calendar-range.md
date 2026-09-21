# CalendarRange

Source URL: https://veanui.com/components/calendar-range
Markdown URL: https://veanui.com/components/calendar-range.md
Category: Forms
Description: CalendarRange displays one or more month grids and lets users pick a start and end date directly from the calendar surface. Selecting the first date starts the range, a live hover preview highlights the candidate range, and the second click commits it — with reversed selections sorted automatically. Use it for booking, scheduling, or any range-picking surface that needs a keyboard-navigable grid instead of two text inputs. Pair it with SDateRangePicker when you need a popup trigger, or use it standalone inside forms and custom layouts.

## Overview

CalendarRange displays one or more month grids and lets users pick a start and end date directly from the calendar surface. Selecting the first date starts the range, a live hover preview highlights the candidate range, and the second click commits it — with reversed selections sorted automatically. Use it for booking, scheduling, or any range-picking surface that needs a keyboard-navigable grid instead of two text inputs. Pair it with `SDateRangePicker` when you need a popup trigger, or use it standalone inside forms and custom layouts.

## Usage

Usage examples for calendar-range are rendered on the site.

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

Interactive demos for calendar-range are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (14): CalendarRange, CalendarRangeCell, CalendarRangeCellTrigger, CalendarRangeCompact, CalendarRangeGrid, CalendarRangeGridBody, CalendarRangeGridHead, CalendarRangeGridRow, CalendarRangeHeadCell, CalendarRangeHeader, CalendarRangeHeading, CalendarRangeNext, CalendarRangePrev, CalendarRangeRoot.

### CalendarRange

#### Props

Properties for the CalendarRange component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CalendarRangeUi>`; optional)
- `headerProps`: Properties forwarded to the header element. (type `CalendarRangeHeaderProps`; optional)
- `headingProps`: Properties forwarded to the heading element. (type `CalendarRangeHeadingProps`; optional)
- `prevProps`: Properties forwarded to the prev element. (type `CalendarRangePrevProps`; optional)
- `nextProps`: Properties forwarded to the next element. (type `CalendarRangeNextProps`; optional)
- `gridProps`: Properties forwarded to the grid element. (type `CalendarRangeGridProps`; optional)
- `gridHeadProps`: Properties forwarded to the grid head element. (type `CalendarRangeGridHeadProps`; optional)
- `gridBodyProps`: Properties forwarded to the grid body element. (type `CalendarRangeGridBodyProps`; optional)
- `gridRowProps`: Properties forwarded to the grid row element. (type `CalendarRangeGridRowProps`; optional)
- `headCellProps`: Properties forwarded to the head cell element. (type `CalendarRangeHeadCellProps`; optional)
- `cellProps`: Properties forwarded to the cell element. (type `CalendarRangeCellProps`; optional)
- `cellTriggerProps`: Properties forwarded to the cell trigger element. (type `CalendarRangeCellTriggerProps`; optional)
- `defaultValue`: Default value. (type `DateRange`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `modelValue`: Current model value. (type `DateRange`; optional)
- `allowNonContiguousRanges`: Whether to allow non contiguous ranges. (type `boolean`; optional)
- `pagedNavigation`: Whether paged navigation. (type `boolean`; optional)
- `preventDeselect`: Whether prevent deselect. (type `boolean`; optional)
- `maximumDays`: Maximum days. (type `number`; optional)
- `weekStartsOn`: Week starts on. (type `WeekStartsOn`; optional)
- `weekdayFormat`: Weekday format. (type `WeekDayFormat`; optional)
- `calendarLabel`: Calendar label. (type `string`; optional)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `locale`: Locale. (type `string`; optional)
- `numberOfMonths`: Number of months. (type `number`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `isDateHighlightable`: Whether a date highlightable. (type `DateMatcher`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `fixedDate`: Fixed date. (type `'start' | 'end'`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the CalendarRange component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the CalendarRange component.

- `default`: Custom content for the default slot. (type `((props: { modelValue: DateRange; }) => any) | undefined`)
- `prev`: Custom content for the prev slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `heading`: Custom content for the heading slot. (type `((props: CalendarRangeHeadingSlotProps) => any) | undefined`)
- `next`: Custom content for the next slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `head-cell`: Custom content for the head cell slot. (type `((props: { date: Date; index: number; label: string; }) => any) | undefined`)
- `day`: Custom content for the day slot. (type `((props: CalendarRangeDaySlotProps) => any) | undefined`)

### CalendarRangeCell

#### Props

Properties for the CalendarRangeCell component.

- `date`: Date. (type `Date | import("../../date").DateTimeValue`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeCellTrigger

#### Props

Properties for the CalendarRangeCellTrigger component.

- `day`: Day. (type `Date`; required)
- `month`: Month. (type `Date`; required)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the CalendarRangeCellTrigger component.

- `default`: No description. (type `((props: CalendarRangeCellTriggerSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the CalendarRangeCellTrigger component.

- `dayValue`: Day value string exposed in the slot scope. (type `string`; required)
- `disabled`: Whether the date is disabled. (type `boolean`; required)
- `selected`: Whether the date is selected. (type `boolean`; required)
- `unavailable`: Whether the date is unavailable. (type `boolean`; required)
- `today`: Whether the date is today. (type `boolean`; required)
- `outsideView`: Whether the date is outside the current view. (type `boolean`; required)
- `outsideVisibleView`: Whether the date is outside the visible view. (type `boolean`; required)
- `highlighted`: Whether the date is focused. (type `boolean`; required)
- `highlightedStart`: Whether the date is a highlighted start. (type `boolean`; required)
- `highlightedEnd`: Whether the date is a highlighted end. (type `boolean`; required)
- `selectionStart`: Whether the date is a selection start. (type `boolean`; required)
- `selectionEnd`: Whether the date is a selection end. (type `boolean`; required)

### CalendarRangeCompact

#### Props

Properties for the CalendarRangeCompact component.

- `headerProps`: Properties forwarded to the header element. (type `CalendarRangeHeaderProps`; optional)
- `headingProps`: Properties forwarded to the heading element. (type `CalendarRangeHeadingProps`; optional)
- `prevProps`: Properties forwarded to the prev element. (type `CalendarRangePrevProps`; optional)
- `nextProps`: Properties forwarded to the next element. (type `CalendarRangeNextProps`; optional)
- `gridProps`: Properties forwarded to the grid element. (type `CalendarRangeGridProps`; optional)
- `gridHeadProps`: Properties forwarded to the grid head element. (type `CalendarRangeGridHeadProps`; optional)
- `gridBodyProps`: Properties forwarded to the grid body element. (type `CalendarRangeGridBodyProps`; optional)
- `gridRowProps`: Properties forwarded to the grid row element. (type `CalendarRangeGridRowProps`; optional)
- `headCellProps`: Properties forwarded to the head cell element. (type `CalendarRangeHeadCellProps`; optional)
- `cellProps`: Properties forwarded to the cell element. (type `CalendarRangeCellProps`; optional)
- `cellTriggerProps`: Properties forwarded to the cell trigger element. (type `CalendarRangeCellTriggerProps`; optional)
- `defaultValue`: Default value. (type `DateRange`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `modelValue`: Current model value. (type `DateRange`; optional)
- `allowNonContiguousRanges`: Whether to allow non contiguous ranges. (type `boolean`; optional)
- `pagedNavigation`: Whether paged navigation. (type `boolean`; optional)
- `preventDeselect`: Whether prevent deselect. (type `boolean`; optional)
- `maximumDays`: Maximum days. (type `number`; optional)
- `weekStartsOn`: Week starts on. (type `WeekStartsOn`; optional)
- `weekdayFormat`: Weekday format. (type `WeekDayFormat`; optional)
- `calendarLabel`: Calendar label. (type `string`; optional)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `locale`: Locale. (type `string`; optional)
- `numberOfMonths`: Number of months. (type `number`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `isDateHighlightable`: Whether a date highlightable. (type `DateMatcher`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `fixedDate`: Fixed date. (type `'start' | 'end'`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the CalendarRangeCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the CalendarRangeCompact component.

- `default`: Custom content for the default slot. (type `((props: { modelValue: DateRange; }) => any) | undefined`)
- `prev`: Custom content for the prev slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `heading`: Custom content for the heading slot. (type `((props: CalendarRangeHeadingSlotProps) => any) | undefined`)
- `next`: Custom content for the next slot. (type `((props: { disabled: boolean; }) => any) | undefined`)
- `head-cell`: Custom content for the head cell slot. (type `((props: { date: Date; index: number; label: string; }) => any) | undefined`)
- `day`: Custom content for the day slot. (type `((props: CalendarRangeDaySlotProps) => any) | undefined`)

### CalendarRangeGrid

#### Props

Properties for the CalendarRangeGrid component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeGridBody

#### Props

Properties for the CalendarRangeGridBody component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeGridHead

#### Props

Properties for the CalendarRangeGridHead component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeGridRow

#### Props

Properties for the CalendarRangeGridRow component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeHeadCell

#### Props

Properties for the CalendarRangeHeadCell component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeHeader

#### Props

Properties for the CalendarRangeHeader component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeHeading

#### Props

Properties for the CalendarRangeHeading component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slot Props

Slot properties for the CalendarRangeHeading component.

- `selectedMonth`: No description. (type `number`; required)
- `selectedYear`: No description. (type `number`; required)
- `headingValue`: Heading value exposed in the slot scope. (type `string`; required)
- `yearOptions`: Year options exposed in the slot scope. (type `SelectOptionData<number>[]`; required)
- `onYearChange`: Callback invoked when the year changes. (type `(value?: number | undefined) => void`; required)
- `monthOptions`: Month options exposed in the slot scope. (type `SelectOptionData<number>[]`; required)
- `onMonthChange`: Callback invoked when the month changes. (type `(value?: number | undefined) => void`; required)

### CalendarRangeNext

#### Props

Properties for the CalendarRangeNext component.

- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangePrev

#### Props

Properties for the CalendarRangePrev component.

- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CalendarRangeRoot

#### Props

Properties for the CalendarRangeRoot component.

- `defaultValue`: Default value. (type `DateRange`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `modelValue`: Current model value. (type `DateRange`; optional)
- `allowNonContiguousRanges`: Whether to allow non contiguous ranges. (type `boolean`; optional)
- `pagedNavigation`: Whether paged navigation. (type `boolean`; optional)
- `preventDeselect`: Whether prevent deselect. (type `boolean`; optional)
- `maximumDays`: Maximum days. (type `number`; optional)
- `weekStartsOn`: Week starts on. (type `WeekStartsOn`; optional)
- `weekdayFormat`: Weekday format. (type `WeekDayFormat`; optional)
- `calendarLabel`: Calendar label. (type `string`; optional)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `locale`: Locale. (type `string`; optional)
- `numberOfMonths`: Number of months. (type `number`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `isDateHighlightable`: Whether a date highlightable. (type `DateMatcher`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `fixedDate`: Fixed date. (type `'start' | 'end'`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the CalendarRangeRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the CalendarRangeRoot component.

- `default`: Custom content for the default slot. (type `((props: CalendarRangeRootSlotProps) => any) | undefined`)

#### Slot Props

- `date`: Date exposed in the slot scope. (type `Date | import("../../date").DateTimeValue`; required)
- `headingValue`: Heading value exposed in the slot scope. (type `string`; required)
- `placeholder`: Placeholder exposed in the slot scope. (type `Date | import("../../date").DateTimeValue`; required)
- `grid`: Grid exposed in the slot scope. (type `DateGrid<Date>[]`; required)
- `weekDays`: Week days exposed in the slot scope. (type `string[]`; required)
- `weekStartsOn`: Week starts on exposed in the slot scope. (type `number`; required)
- `locale`: Locale exposed in the slot scope. (type `string`; required)
- `fixedWeeks`: Whether fixed weeks. (type `boolean`; required)
- `modelValue`: Current model value. (type `DateRange`; required)
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
