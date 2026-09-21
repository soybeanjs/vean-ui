# TimeRangeField

Source URL: https://veanui.com/components/time-range-field
Markdown URL: https://veanui.com/components/time-range-field.md
Category: Forms
Description: A segmented time range input with independently editable start and end time segments (hour, minute, and optional second and day-period) while still submitting native form values for both sides. Use it whenever a user must enter a start and end time quickly and precisely — scheduling, booking, shift or time-window filtering. For a single time use STimeField; for a date and time range use SDateRangeField with a time granularity or SDateRangePicker.

## Overview

A segmented time range input with independently editable start and end time segments (hour, minute, and optional second and day-period) while still submitting native form values for both sides. Use it whenever a user must enter a start and end time quickly and precisely — scheduling, booking, shift or time-window filtering. For a single time use `STimeField`; for a date and time range use `SDateRangeField` with a time granularity or `SDateRangePicker`.

## Usage

Usage examples for time-range-field are rendered on the site.

## Features

- ⏱ Two segmented groups — independent start/end hour, minute, and optional second and day-period segments, each an editable `role="spinbutton"`
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for the whole `{ start, end }` range, backed by `useControllableState`
- 🕛 12/24-hour cycle — `hourCycle` switches between `AM/PM` and 24-hour display per locale, with day-period segment editing on both sides
- ⌨️ Full keyboard support — digit typing with auto-advance, `ArrowUp`/`ArrowDown` increment/decrement, `ArrowLeft`/`ArrowRight` navigation that crosses group boundaries and reverses in RTL
- ⛓ Range validation — `start ≤ end` is enforced, plus `minValue`/`maxValue`/`isTimeUnavailable` mark the root `data-invalid`
- 📝 Two native form values — visually hidden `input[type="time"]` elements carry both sides under `startName`/`endName`
- ⚙️ Granularity & step — `granularity` (hour/minute/second) and `step` control which segments render and the increment per arrow
- 🧩 Composable slots — `leading`/`trailing` place content around the groups and `separator` customizes the divider between them
- 🚫 Disabled / readonly — both states block editing on every segment and render proper `data-*`/`aria-*` attributes

## Component family

- `STimeRangeField` — the styled wrapper that forwards props to the Aria compact and injects `dateRangeFieldVariants` (shared with `SDateRangeField`) classes
- `TimeRangeFieldCompact` (Aria) — data-driven composition of `TimeRangeFieldRoot` + one `TimeRangeFieldInput` per segment in two groups, plus `leading`/`separator`/`trailing` slots; import from `@vean/aria/time-range-field` for unstyled usage
- `TimeRangeFieldRoot` / `TimeRangeFieldInput` (Aria) — the state owner (segment values, range validation, two hidden inputs, cross-group focus management) and a single editable segment bound to the shared `useDateField` composable

## Demos

Interactive demos for time-range-field are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): TimeRangeField, TimeRangeFieldCompact, TimeRangeFieldInput, TimeRangeFieldRoot.

### TimeRangeField

#### Props

Properties for the TimeRangeField component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<TimeRangeFieldUi>`; optional)
- `inputProps`: Properties forwarded to the input element. (type `TimeRangeFieldInputProps`; optional)
- `separator`: Separator. (type `string`; optional)
- `defaultValue`: Default value. (type `TimeRange`; optional)
- `modelValue`: Current model value. (type `TimeRange`; optional)
- `startName`: Start name. (type `string`; optional)
- `endName`: End name. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `placeholder`: Placeholder. (type `Date`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `Date`; optional)
- `maxValue`: Max value. (type `Date`; optional)
- `minValue`: Min value. (type `Date`; optional)
- `granularity`: Granularity. (type `TimeGranularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)
- `isTimeUnavailable`: Whether the time is unavailable. (type `TimeMatcher`; optional)

#### Emits

Events for the TimeRangeField component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: TimeRange]`; parameters `range: TimeRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[time: Date]`; parameters `time: Date`)
- `update:startValue`: Emitted when the start value changes. (type `[time: Date | null]`; parameters `time: Date | null`)
- `update:endValue`: Emitted when the end value changes. (type `[time: Date | null]`; parameters `time: Date | null`)

#### Slots

Slots for the TimeRangeField component.

- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `separator`: Custom content for the separator slot. (type `(() => any) | undefined`)

#### Slot Props

Slot Props for the TimeRangeField component.

- `modelValue`: Current model value. (type `TimeRange`; required)
- `startSegments`: Start segments. (type `DateFieldSegment[]`; required)
- `endSegments`: End segments. (type `DateFieldSegment[]`; required)
- `isInvalid`: Whether the field is invalid. (type `boolean`; required)

### TimeRangeFieldCompact

#### Props

Properties for the TimeRangeFieldCompact component.

- `inputProps`: Properties forwarded to the input element. (type `TimeRangeFieldInputProps`; optional)
- `separator`: Separator. (type `string`; optional)
- `defaultValue`: Default value. (type `TimeRange`; optional)
- `modelValue`: Current model value. (type `TimeRange`; optional)
- `startName`: Start name. (type `string`; optional)
- `endName`: End name. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `placeholder`: Placeholder. (type `Date`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `Date`; optional)
- `maxValue`: Max value. (type `Date`; optional)
- `minValue`: Min value. (type `Date`; optional)
- `granularity`: Granularity. (type `TimeGranularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)
- `isTimeUnavailable`: Whether the time is unavailable. (type `TimeMatcher`; optional)

#### Emits

Events for the TimeRangeFieldCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: TimeRange]`; parameters `range: TimeRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[time: Date]`; parameters `time: Date`)
- `update:startValue`: Emitted when the start value changes. (type `[time: Date | null]`; parameters `time: Date | null`)
- `update:endValue`: Emitted when the end value changes. (type `[time: Date | null]`; parameters `time: Date | null`)

#### Slots

Slots for the TimeRangeFieldCompact component.

- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `separator`: Custom content for the separator slot. (type `(() => any) | undefined`)

### TimeRangeFieldInput

#### Props

Properties for the TimeRangeFieldInput component.

- `type`: Type. (type `'start' | 'end'`; optional)
- `part`: Part. (type `import("../../date").EditableSegmentPart | import("../../date").NonEditableSegmentPart`; required)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TimeRangeFieldRoot

#### Props

Properties for the TimeRangeFieldRoot component.

- `defaultValue`: Default value. (type `TimeRange`; optional)
- `modelValue`: Current model value. (type `TimeRange`; optional)
- `startName`: Start name. (type `string`; optional)
- `endName`: End name. (type `string`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `placeholder`: Placeholder. (type `Date`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `defaultPlaceholder`: Default placeholder. (type `Date`; optional)
- `maxValue`: Max value. (type `Date`; optional)
- `minValue`: Min value. (type `Date`; optional)
- `granularity`: Granularity. (type `TimeGranularity`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)
- `isTimeUnavailable`: Whether the time is unavailable. (type `TimeMatcher`; optional)

#### Emits

Events for the TimeRangeFieldRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[range: TimeRange]`; parameters `range: TimeRange`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[time: Date]`; parameters `time: Date`)
- `update:startValue`: Emitted when the start value changes. (type `[time: Date | null]`; parameters `time: Date | null`)
- `update:endValue`: Emitted when the end value changes. (type `[time: Date | null]`; parameters `time: Date | null`)

#### Slots

Slots for the TimeRangeField component.

- `default`: Custom content for the default slot. (type `((props: TimeRangeFieldSlotProps) => any) | undefined`)

## Notes

### Architecture and benchmark differences

`TimeRangeFieldRoot` owns the `TimeRange` via `useControllableState`, keeps `startSegmentValues`/`endSegmentValues` as two shallowRefs, and runs range validation through `isInvalid` (start after end, `minValue`/`maxValue`, `isTimeUnavailable`). Each `TimeRangeFieldInput` binds the same `useDateField` composable used by the `date-field` family; `TimeRangeFieldCompact` iterates the segments produced by `createContent` and renders one input per segment inside two `data-time-range-field-part` groups separated by the `separator` slot. Cross-group focus movement is handled by the root's `moveFocus`, mapping the physical arrow key from `dir` so RTL swaps `ArrowLeft`/`ArrowRight` — the group boundary is crossed on the physical direction (`delta`), not the semantic key. Most benchmark libraries ship two independent text inputs (or a plain picker); the dual segmented spinbutton groups with cross-boundary keyboard navigation and the Aria/styled split are the differentiators.

| Capability                     | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :----------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Dual segmented editable groups |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Cross-group focus movement     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL direction reversal         |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled      |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Keyboard increment/typing      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation (start ≤ end) |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `isTimeUnavailable`            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (second)           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Two native form values         |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| Separator prop / slot          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled / readonly            |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### Cautions

- The value is a `TimeRange` — `{ start, end }` of `TimeValue`s (native `Date`s whose time-of-day parts are meaningful), not `string`s. Use it with the other date-family components.
- `defaultValue` is only read on mount — use `v-model` for external control.
- When a side is empty its segments display the placeholder time (derived from `defaultValue`/`defaultPlaceholder` or the current time) — the submitted form value is still empty until the user types.
- `granularity` defaults to `'minute'`; pass `'second'` for seconds segments on both sides.
- `hourCycle` (`12`/`24`) controls the day-period segments and the accessible hour range; leave it unset to follow the locale.
- Range validation marks the root `data-invalid` but never clamps the value — clear or correct it in the parent.
- The two hidden inputs share `required`; if you need per-side submit names pass `startName`/`endName` (falling back to `name` for the start side).

## FAQ

### How do I edit the range with the keyboard?

Tab into either group and type digits — after a segment fills it advances automatically. `ArrowUp`/`ArrowDown` increment or decrement the focused segment, and `ArrowLeft`/`ArrowRight` move between segments — including across the start/end boundary — reversed in RTL. On a 12-hour cycle `a`/`p` toggles `AM`/`PM`.

### How do I show seconds on both sides?

Pass `granularity: 'second'` to render hour, minute, and second segments in the start and end groups.

### How do I customize the separator between start and end?

Pass `separator: '→'` as a prop for a simple text divider, or use the `separator` slot to render any content (an icon, for example).

### How do I enforce that end is after start?

The component marks the root `data-invalid` automatically when `end` is before `start`. Combine with `minValue`/`maxValue`/`isTimeUnavailable` for arbitrary constraints — validation never clamps the value, so correct it in the parent.

### How is `STimeRangeField` different from `SDateRangeField`?

`STimeRangeField` is a pure time range input — it never renders date segments. `SDateRangeField` renders full dates (with optional time via granularity) and accepts `DateValue` pairs.
