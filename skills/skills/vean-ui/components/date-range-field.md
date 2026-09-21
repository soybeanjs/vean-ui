# DateRangeField

Source URL: https://veanui.com/components/date-range-field
Markdown URL: https://veanui.com/components/date-range-field.md
Category: Forms
Description: A segmented date range input that renders two groups of keyboard-editable date segments — one for the start date and one for the end date — while submitting native form values for both. Use it whenever a user must enter a bounded interval fast, such as booking stay dates, reporting windows, or filter ranges where typing beats calendar clicking. For a range chosen from a calendar popup, prefer SDateRangePicker; for a single date, use SDateField.

## Overview

A segmented date range input that renders two groups of keyboard-editable date segments — one for the start date and one for the end date — while submitting native form values for both. Use it whenever a user must enter a bounded interval fast, such as booking stay dates, reporting windows, or filter ranges where typing beats calendar clicking. For a range chosen from a calendar popup, prefer `SDateRangePicker`; for a single date, use `SDateField`.

## Usage

Usage examples for date-range-field are rendered on the site.

## Features

- 🧩 Dual segmented groups — independent start and end segment groups (day/month/year, optional time), each part an editable `role="spinbutton"` segment
- ⌨️ Cross-group focus movement — arrow keys navigate within a group, and at the group edges `ArrowLeft`/`ArrowRight` move focus into the other group, with directions reversed in RTL
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` accept a `DateRange` `{ start, end }`, backed by `useControllableState`
- ⛓ Range validation — `minValue`/`maxValue`/`isDateUnavailable` per date, and a start later than end automatically marks the root `data-invalid`
- 📝 Dual native form values — two visually hidden inputs (`startName`/`endName`, falling back to `name` for the start) submit the ISO values
- 🕐 Granularity & time — `granularity` (day/hour/minute/second), 12/24-hour `hourCycle`, and `dayPeriod` segments apply to both groups
- 🧩 Customizable separation — a `separator` prop (default `–`) plus `leading`/`trailing` slots, or a `separator` slot for fully custom content
- 🚫 Disabled / readonly — both states render proper `data-*`/`aria-*` attributes and block editing across both groups

## Component family

- `SDateRangeField` — the styled wrapper that forwards props to the Aria compact and injects `dateRangeFieldVariants` (extending `dateFieldVariants`) classes
- `DateRangeFieldCompact` (Aria) — data-driven composition of `DateRangeFieldRoot` + per-segment `DateRangeFieldInput` for both groups, plus `leading`/`trailing`/`separator` slots; import from `@vean/aria/date-range-field` for unstyled usage
- `DateRangeFieldRoot` / `DateRangeFieldInput` (Aria) — the state owner (dual segment values, validation, hidden inputs, cross-group focus) and a single editable segment bound to the shared `useDateField` composable

## Demos

Interactive demos for date-range-field are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): DateRangeField, DateRangeFieldCompact, DateRangeFieldInput, DateRangeFieldRoot.

### DateRangeField

#### Props

Properties for the DateRangeField component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<DateRangeFieldUi>`; optional)
- `inputProps`: Properties forwarded to the input element. (type `DateRangeFieldInputProps`; optional)
- `separator`: Separator. (type `string`; optional)
- `defaultValue`: Default value. (type `DateRange`; optional)
- `modelValue`: Current model value. (type `DateRange`; optional)
- `startName`: Start name. (type `string`; optional)
- `endName`: End name. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `granularity`: Granularity. (type `Granularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)

#### Emits

Events for the DateRangeField component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)
- `update:endValue`: Emitted when the end value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the DateRangeField component.

- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `separator`: Custom content for the separator slot. (type `(() => any) | undefined`)

#### Slot Props

Slot properties for the DateRangeField component.

- `startSegments`: Start segments used by the component context. (type `DateFieldSegment[]`; required)
- `endSegments`: End segments used by the component context. (type `DateFieldSegment[]`; required)
- `modelValue`: Current model value. (type `DateRange`; required)
- `isInvalid`: Whether the date is invalid. (type `boolean`; required)

### DateRangeFieldCompact

#### Props

Properties for the DateRangeFieldCompact component.

- `inputProps`: Properties forwarded to the input element. (type `DateRangeFieldInputProps`; optional)
- `separator`: Separator. (type `string`; optional)
- `defaultValue`: Default value. (type `DateRange`; optional)
- `modelValue`: Current model value. (type `DateRange`; optional)
- `startName`: Start name. (type `string`; optional)
- `endName`: End name. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `granularity`: Granularity. (type `Granularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)

#### Emits

Events for the DateRangeFieldCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)
- `update:endValue`: Emitted when the end value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the DateRangeFieldCompact component.

- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `separator`: Custom content for the separator slot. (type `(() => any) | undefined`)

### DateRangeFieldInput

#### Props

Properties for the DateRangeFieldInput component.

- `type`: Type. (type `DateRangeType`; optional)
- `part`: Part. (type `import("../../date").EditableSegmentPart | import("../../date").NonEditableSegmentPart`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### DateRangeFieldRoot

#### Props

Properties for the DateRangeFieldRoot component.

- `defaultValue`: Default value. (type `DateRange`; optional)
- `modelValue`: Current model value. (type `DateRange`; optional)
- `startName`: Start name. (type `string`; optional)
- `endName`: End name. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `placeholder`: Placeholder. (type `DateValue`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `DateValue`; optional)
- `maxValue`: Max value. (type `DateValue`; optional)
- `minValue`: Min value. (type `DateValue`; optional)
- `isDateUnavailable`: Whether the date is unavailable. (type `DateMatcher`; optional)
- `granularity`: Granularity. (type `Granularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)

#### Emits

Events for the DateRangeFieldRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: DateRange]`; parameters `range: DateRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[date: DateValue]`; parameters `date: DateValue`)
- `update:startValue`: Emitted when the start value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)
- `update:endValue`: Emitted when the end value changes. (type `[date: DateValue | null]`; parameters `date: DateValue | null`)

#### Slots

Slots for the DateRangeFieldRoot component.

- `default`: Custom content for the default slot. (type `((props: DateRangeFieldSlotProps) => any) | undefined`)

## Notes

### Architecture and benchmark differences

`DateRangeFieldRoot` owns the `{ start, end }` value via `useControllableState`, keeps separate `startSegmentValues`/`endSegmentValues` shallowRefs for the two groups, and runs validation through `isInvalid` (including a start-later-than-end check). Each `DateRangeFieldInput` binds the same `useDateField` composable used by the `time-field` family for per-part keydown logic. Cross-group movement is handled by the root's `moveFocus`: at the physical end of the start group the next arrow moves into the end group, and at the beginning of the end group the previous arrow returns, with the physical key mapped from the `dir` so RTL swaps `ArrowLeft`/`ArrowRight`. Most benchmark libraries implement a range as two separate text inputs or one text input with a separator; the dual segmented-field pattern with cross-group keyboard focus comes from the reka-ui (Radix) date-field lineage.

| Capability                     | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :----------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual segmented editable groups |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Cross-group focus movement     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL direction reversal         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled      |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Keyboard increment/typing      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation (start ≤ end) |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isDateUnavailable`            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (minute/second)    |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual native form values        |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| Disabled / readonly            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Separator prop / slot          |   ✅   |     —      |      —       |    —    |    —     |   —    |

### Cautions

- The value is a `DateRange` — an object `{ start, end }` of `DateValue`s, not a `string`. Use it with the other date-family components.
- `defaultValue` is only read on mount — use `v-model` for external control.
- A start later than end is marked invalid but the values are never swapped automatically — clear or correct them in the parent.
- Form submission uses two hidden inputs: the start one takes `startName` (or the shared `name`), the end one takes `endName`. Set both to submit distinct fields; `required`/`min`/`max` are reflected but do not run custom validation.
- Deleting the last digit of one group emits `update:modelValue` with that side `undefined`; segments fall back to placeholder styling.
- Each group renders `role="group"` with per-segment `role="spinbutton"`; add an `aria-label` to the whole control so screen readers announce both groups.

## FAQ

### How do I move focus between the two groups with the keyboard?

Use `ArrowLeft`/`ArrowRight` — at the first segment of the end group `ArrowLeft` jumps to the last start segment, and at the last segment of the start group `ArrowRight` jumps to the first end segment. In RTL the physical keys are reversed.

### How do I submit two form values?

Pass `name` (fallback for the start) plus `startName` and `endName` for distinct field names — each group renders a visually hidden native input carrying its ISO value.

### How do I restrict the selectable range?

Pass `minValue`/`maxValue` — dates outside are marked `data-invalid` and rejected. `isDateUnavailable` accepts a predicate for arbitrary exclusions, and a start later than end is invalid on its own.

### How is `SDateRangeField` different from `SDateRangePicker`?

`SDateRangeField` is a pure dual segmented input with no popup — fastest for typing and form submission. `SDateRangePicker` adds a calendar popover on top of the same field for visual selection.

### How do I customize the separator?

Pass `separator` (e.g. `"→"`) to change the text, or use the `separator` slot to render anything (an icon, a styled label). `leading`/`trailing` slots place content around the two groups.
