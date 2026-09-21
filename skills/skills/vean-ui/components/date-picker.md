# DatePicker

Source URL: https://veanui.com/components/date-picker
Markdown URL: https://veanui.com/components/date-picker.md
Category: Forms
Description: A date picker that pairs a keyboard-editable segmented date field with a calendar popup for visual selection. Type a date directly into the segments or click the calendar toggle to pick from a month grid. Use it whenever a user must choose a single date — booking, scheduling, filtering, or any form that needs a validated date range. For pure typing with no popup, prefer SDateField; for browsing a standalone calendar grid, use SCalendar.

## Overview

A date picker that pairs a keyboard-editable segmented date field with a calendar popup for visual selection. Type a date directly into the segments or click the calendar toggle to pick from a month grid. Use it whenever a user must choose a single date — booking, scheduling, filtering, or any form that needs a validated date range. For pure typing with no popup, prefer `SDateField`; for browsing a standalone calendar grid, use `SCalendar`.

## Usage

Usage examples for date-picker are rendered on the site.

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

Interactive demos for date-picker are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (2): DatePicker, DatePickerCompact.

### DatePicker

#### Props

Properties for the DatePicker component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<DatePickerUi>`; optional)
- `calendarUi`: Per-slot class overrides for the Calendar component within the DatePicker. (type `Partial<CalendarUi>`; optional)
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
- `locale`: Locale. (type `string`; optional)
- `modelValue`: Current model value. (type `DateValue`; optional)
- `defaultValue`: Default value. (type `DateValue`; optional)
- `multiple`: Whether multiple values are supported. (type `false`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
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

Events for the DatePicker component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)
- `update:modelValue`: Emitted when the model value changes. (type `[date: DateValue | undefined]`; parameters `date: DateValue | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)

#### Slots

Slots for the DatePicker component.

- `leading`: Custom content rendered before the date segments. (type `(() => any) | undefined`)

### DatePickerCompact

#### Props

Properties for the DatePickerCompact component.

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
- `locale`: Locale. (type `string`; optional)
- `modelValue`: Current model value. (type `DateValue`; optional)
- `defaultValue`: Default value. (type `DateValue`; optional)
- `multiple`: Whether multiple values are supported. (type `false`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
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

Events for the DatePickerCompact component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)
- `update:modelValue`: Emitted when the model value changes. (type `[date: DateValue | undefined]`; parameters `date: DateValue | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)

#### Slots

Slots for the DatePickerCompact component.

- `leading`: Custom content rendered before the date segments. (type `(() => any) | undefined`)
- `default`: Custom content for the calendar popup, receiving the open/close controls and calendar props. (type `((props: DatePickerCompactSlotProps) => any) | undefined`)

#### Slot Props

- `open`: No description. (type `boolean`; required)
- `close`: No description. (type `() => void`; required)
- `calendarProps`: No description. (type `CalendarCompactProps<false>`; required)
- `onUpdateModelValue`: No description. (type `(value: DateValue | undefined) => void`; required)
- `onUpdatePlaceholder`: No description. (type `(placeholder: DateValue) => void`; required)

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
