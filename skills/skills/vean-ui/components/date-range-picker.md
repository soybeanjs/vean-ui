# DateRangePicker

Source URL: https://veanui.com/components/date-range-picker
Markdown URL: https://veanui.com/components/date-range-picker.md
Category: Forms
Description: A date range picker that pairs a keyboard-editable dual segmented date range field with a calendar range popup for visual selection. Type a start and end date directly into the segments or click the calendar toggle and pick both ends from a single month-range grid. Use it whenever a user must choose a bounded interval — booking stay dates, reporting windows, or filter ranges. For pure typing with no popup, prefer SDateRangeField; for a single date with a popup, use SDatePicker.

## Overview

A date range picker that pairs a keyboard-editable dual segmented date range field with a calendar range popup for visual selection. Type a start and end date directly into the segments or click the calendar toggle and pick both ends from a single month-range grid. Use it whenever a user must choose a bounded interval — booking stay dates, reporting windows, or filter ranges. For pure typing with no popup, prefer `SDateRangeField`; for a single date with a popup, use `SDatePicker`.

## Usage

Usage examples for date-range-picker are rendered on the site.

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

Interactive demos for date-range-picker are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (2): DateRangePicker, DateRangePickerCompact.

### DateRangePicker

#### Props

Properties for the DateRangePicker component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<DateRangePickerUi>`; optional)
- `calendarRangeUi`: Per-slot class overrides for the CalendarRange component within the DateRangePicker. (type `Partial<CalendarRangeUi>`; optional)
- `dateFieldProps`: No description. (type `BaseProps`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopoverTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopperPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopoverPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopoverPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopperArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopoverCloseProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
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
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `isDateHighlightable`: Whether a date highlightable. (type `DateMatcher`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `fixedDate`: Fixed date. (type `'start' | 'end'`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DateRangePicker component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)
- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the DateRangePicker component.

- `leading`: Custom content rendered before the date range segments. (type `(() => any) | undefined`)
- `separator`: Custom content rendered between the start and end segment groups. (type `(() => any) | undefined`)

### DateRangePickerCompact

#### Props

Properties for the DateRangePickerCompact component.

- `dateFieldProps`: No description. (type `BaseProps`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopoverTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopperPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopoverPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopoverPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopperArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopoverCloseProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
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
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `initialFocus`: Whether initial focus. (type `boolean`; optional)
- `isDateDisabled`: Whether the date is disabled. (type `DateMatcher`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `isDateHighlightable`: Whether a date highlightable. (type `DateMatcher`; optional)
- `nextPage`: Next page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `prevPage`: Prev page. (type `((placeholder: DateValue) => DateValue)`; optional)
- `disableDaysOutsideCurrentView`: Whether to disable days outside current view. (type `boolean`; optional)
- `fixedDate`: Fixed date. (type `'start' | 'end'`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DateRangePickerCompact component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)
- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the DateRangePickerCompact component.

- `leading`: Custom content rendered before the date range segments. (type `(() => any) | undefined`)
- `separator`: Custom content rendered between the start and end segment groups. (type `(() => any) | undefined`)
- `default`: Custom content for the calendar range popup, receiving the open/close controls and calendar props. (type `((props: DateRangePickerCompactSlotProps) => any) | undefined`)

#### Slot Props

- `open`: No description. (type `boolean`; required)
- `close`: No description. (type `() => void`; required)
- `calendarRangeProps`: No description. (type `CalendarRangeCompactProps`; required)
- `onUpdateModelValue`: No description. (type `(value: DateRange) => void`; required)
- `onUpdatePlaceholder`: No description. (type `(placeholder: DateValue) => void`; required)

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
