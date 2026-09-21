# TimeField

Source URL: https://veanui.com/components/time-field
Markdown URL: https://veanui.com/components/time-field.md
Category: Forms
Description: A segmented time input that renders individually editable hour, minute, and optional second and day-period segments while submitting a native form value. Use it whenever a user must enter a time fast and precisely — scheduling, booking, time-window filtering, or any form that needs a validated time. For a date with a time, use SDateField with granularity: 'minute'; for a range, prefer STimeRangeField.

## Overview

A segmented time input that renders individually editable hour, minute, and optional second and day-period segments while submitting a native form value. Use it whenever a user must enter a time fast and precisely — scheduling, booking, time-window filtering, or any form that needs a validated time. For a date with a time, use `SDateField` with `granularity: 'minute'`; for a range, prefer `STimeRangeField`.

## Usage

Usage examples for time-field are rendered on the site.

## Features

- 🕐 Segmented editing — hour, minute, and optional second and day-period segments, each an editable `role="spinbutton"`
- 🎚 Controlled / uncontrolled — `v-model`/`defaultValue` for the value, backed by `useControllableState`
- 🕛 12/24-hour cycle — `hourCycle` switches between `AM/PM` and 24-hour display per locale, with day-period segment editing
- ⌨️ Full keyboard support — digit typing with auto-advance, `ArrowUp`/`ArrowDown` increment/decrement, `ArrowLeft`/`ArrowRight` segment navigation with RTL reversal
- ⛓ Time validation — `minValue`/`maxValue`/`isTimeUnavailable` mark the root `data-invalid`
- 📝 Native form value — a visually hidden `input[type="time"]` carries the ISO value to its owning form
- ⚙️ Granularity & step — `granularity` (hour/minute/second) and `step` control which segments render and the increment per arrow
- 🧩 Composable slots — `leading`/`trailing` place content around the segments
- 🚫 Disabled / readonly — both states block editing and render proper `data-*`/`aria-*` attributes

## Component family

- `STimeField` — the styled wrapper that forwards props to the Aria compact and injects `dateFieldVariants` (shared with `SDateField`) classes
- `TimeFieldCompact` (Aria) — data-driven composition of `TimeFieldRoot` + one `TimeFieldInput` per segment, plus `leading`/`trailing` slots; import from `@vean/aria/time-field` for unstyled usage
- `TimeFieldRoot` / `TimeFieldInput` (Aria) — the state owner (segment values, validation, hidden input, focus management) and a single editable segment bound to the shared `useDateField` composable

## Demos

Interactive demos for time-field are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (4): TimeField, TimeFieldCompact, TimeFieldInput, TimeFieldRoot.

### TimeField

#### Props

Properties for the TimeField component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<TimeFieldUi>`; optional)
- `inputProps`: Properties forwarded to the input element. (type `TimeFieldInputProps`; optional)
- `defaultValue`: Default value for the time field. (type `Date`; optional)
- `modelValue`: Current model value. (type `Date`; optional)
- `defaultPlaceholder`: Default placeholder. (type `Date`; optional)
- `placeholder`: Placeholder. (type `Date`; optional)
- `granularity`: Granularity. (type `TimeGranularity`; optional)
- `maxValue`: Max value. (type `Date`; optional)
- `minValue`: Min value. (type `Date`; optional)
- `isTimeUnavailable`: Whether the time is unavailable. (type `TimeMatcher`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)

#### Emits

Events for the TimeField component.

- `update:modelValue`: Emitted when the model value changes. (type `[time: Date | undefined]`; parameters `time: Date | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[time: Date]`; parameters `time: Date`)

#### Slots

Slots for the TimeField component.

- `leading`: Content rendered before the time segments. (type `(() => any) | undefined`)
- `trailing`: Content rendered after the time segments. (type `(() => any) | undefined`)

### TimeFieldCompact

#### Props

Properties for the time field compact component.

- `inputProps`: Properties forwarded to the input element. (type `TimeFieldInputProps`; optional)
- `defaultValue`: Default value for the time field. (type `Date`; optional)
- `modelValue`: Current model value. (type `Date`; optional)
- `defaultPlaceholder`: Default placeholder. (type `Date`; optional)
- `placeholder`: Placeholder. (type `Date`; optional)
- `granularity`: Granularity. (type `TimeGranularity`; optional)
- `maxValue`: Max value. (type `Date`; optional)
- `minValue`: Min value. (type `Date`; optional)
- `isTimeUnavailable`: Whether the time is unavailable. (type `TimeMatcher`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)

#### Emits

Events for the time field compact component.

- `update:modelValue`: Emitted when the model value changes. (type `[time: Date | undefined]`; parameters `time: Date | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[time: Date]`; parameters `time: Date`)

#### Slots

Slots for the TimeFieldCompact component.

- `leading`: Content rendered before the time segments. (type `(() => any) | undefined`)
- `trailing`: Content rendered after the time segments. (type `(() => any) | undefined`)

### TimeFieldInput

- No documented props, emits, slots, or slot props were available.

### TimeFieldRoot

#### Props

Properties for the TimeFieldRoot component.

- `defaultValue`: Default value for the time field. (type `Date`; optional)
- `modelValue`: Current model value. (type `Date`; optional)
- `defaultPlaceholder`: Default placeholder. (type `Date`; optional)
- `placeholder`: Placeholder. (type `Date`; optional)
- `granularity`: Granularity. (type `TimeGranularity`; optional)
- `maxValue`: Max value. (type `Date`; optional)
- `minValue`: Min value. (type `Date`; optional)
- `isTimeUnavailable`: Whether the time is unavailable. (type `TimeMatcher`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `id`: Id. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `readonly`: Whether the component is readonly. (type `boolean`; optional)
- `step`: Step. (type `DateStep`; optional)
- `locale`: Locale. (type `string`; optional)
- `hourCycle`: Hour cycle. (type `12 | 24`; optional)
- `hideTimeZone`: Whether hide time zone. (type `boolean`; optional)

#### Emits

Events for the TimeFieldRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[time: Date | undefined]`; parameters `time: Date | undefined`)
- `update:placeholder`: Emitted when the placeholder value changes. (type `[time: Date]`; parameters `time: Date`)

#### Slots

Slots for the TimeFieldRoot component.

- `default`: No description. (type `((props: TimeFieldRootSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the TimeFieldRoot component.

- `modelValue`: Current model value. (type `Date | undefined`; required)
- `segments`: Segments used by the default slot. (type `DateFieldSegment[]`; required)
- `isInvalid`: Whether the current value is invalid. (type `boolean`; required)

## Notes

### Architecture and benchmark differences

`TimeFieldRoot` owns the `TimeValue` via `useControllableState`, keeps `segmentValues` as a shallowRef, and runs validation through `isInvalid`. Each `TimeFieldInput` binds the same `useDateField` composable used by the `date-field` family for per-part keydown logic; `TimeFieldCompact` iterates the segments produced by `createContent` and renders one input each, with `leading`/`trailing` slots around them. Focus movement is handled by the root's `moveFocus`, mapping the physical arrow key from `dir` so RTL swaps `ArrowLeft`/`ArrowRight`. Most benchmark libraries ship a plain text input or select-based picker; the segmented spinbutton pattern with keyboard increment/typing and the Aria/styled split are the differentiators.

| Capability                   | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :--------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split            |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Segmented editable segments  |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Controlled / uncontrolled    |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| 12/24-hour cycle             |   ✅   |     ✅     |      ✅      |    —    |    ✅    |   —    |
| Keyboard increment/typing    |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Segment navigation + RTL     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Range validation             |   ✅   |     ✅     |      —       |    —    |    —     |   —    |
| `isTimeUnavailable`          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Granularity (second)         |   ✅   |     ✅     |      ✅      |    —    |    ✅    |   —    |
| Configurable step            |   ✅   |     ✅     |      ✅      |    —    |    —     |   —    |
| Native form value            |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| `leading` / `trailing` slots |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Disabled / readonly          |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### Cautions

- The value is a `TimeValue` — a native `Date` whose hour/minute/second parts are meaningful (the date part is normalized), not a `string`. Use it with the other date-family components.
- `defaultValue` is only read on mount — use `v-model` for external control.
- When the value is empty the segments display the placeholder time (derived from `defaultValue`/`defaultPlaceholder` or the current time) — the submitted form value is still empty until the user types.
- `granularity` defaults to `'minute'`; pass `'second'` for seconds segments or `'hour'` to hide the minute segment.
- `hourCycle` (`12`/`24`) controls the day-period segment and the accessible hour range; leave it unset to follow the locale.
- Time validation marks the root `data-invalid` but never clamps the value — clear or correct it in the parent.

## FAQ

### How do I edit a time with the keyboard?

Tab into the field and type digits — after the segment fills it advances automatically. `ArrowUp`/`ArrowDown` increment or decrement the focused segment, `ArrowLeft`/`ArrowRight` move between segments (reversed in RTL), and `Backspace` clears digits. On a 12-hour cycle `a`/`p` toggles `AM`/`PM`.

### How do I show seconds or hide the minute segment?

Pass `granularity: 'second'` to render hour, minute, and second segments, or `granularity: 'hour'` to render only the hour segment.

### How do I switch between 12-hour and 24-hour display?

Pass `hourCycle: 12` or `hourCycle: 24`. Leave it unset to follow the active locale.

### How do I restrict the selectable time?

Pass `minValue`/`maxValue` — times outside are marked `data-invalid` and rejected. `isTimeUnavailable` accepts a predicate for arbitrary exclusions.

### How is `STimeField` different from `SDateField` with `granularity: 'minute'`?

`STimeField` is a pure time input — it never renders date segments. `SDateField` with a time granularity renders the full date and time together (for example `2026/04/19 14:30`) and accepts a `{ date, time }` value.
