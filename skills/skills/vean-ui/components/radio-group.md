# Radio Group

Source URL: https://veanui.com/components/radio-group
Markdown URL: https://veanui.com/components/radio-group.md
Category: Forms
Description: A set of checkable radio buttons where no more than one button can be checked at a time. It ships as a data-driven group and a card variant with icon/description content, both built on roving-focus keyboard navigation. Use it for single-choice from a small, mutually exclusive set; when multiple values are allowed, use SCheckboxGroup; when the option set is too large to scan at once, prefer SSelect.

## Overview

A set of checkable radio buttons where no more than one button can be checked at a time. It ships as a data-driven group and a card variant with icon/description content, both built on roving-focus keyboard navigation. Use it for single-choice from a small, mutually exclusive set; when multiple values are allowed, use `SCheckboxGroup`; when the option set is too large to scan at once, prefer `SSelect`.

## Usage

Usage examples for radio-group are rendered on the site.

## Features

- ☑️ Single-choice model — `modelValue` / `defaultValue` with both controlled and uncontrolled modes
- ⌨️ Roving-focus keyboard navigation — Arrow keys move and check, Enter/Space select, optional `loop`
- 🏷 Accessible labels — `RadioGroupLabel` wires `for` to each control's `id`
- 📋 Native form proxy — a visually hidden input carries the current value with `name` / `required`
- 🃏 Card variant (`SRadioGroupCard`) with icon, label, and description content
- 🎨 6 sizes, 8 colors, and dot/outline variants via `radioGroupVariants`
- 📊 Data-driven `RadioGroupCompact` / `RadioGroupCardCompact` aggregation in Aria
- ♿ `role="radiogroup"` + `role="radio"` with `aria-checked` / `data-state` dual reflection, axe-clean

## Component family

- `SRadioGroup` - data-driven radio group with dot/outline variants
- `SRadioGroupCard` - card radio group with icon, label, and description

## Demos

Interactive demos for radio-group are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (9): RadioGroup, RadioGroupCard, RadioGroupCardCompact, RadioGroupCompact, RadioGroupControl, RadioGroupIndicator, RadioGroupItem, RadioGroupLabel, RadioGroupRoot.

### RadioGroup

#### Props

Properties for the RadioGroup component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `variant`: Visual variant of the component. (type `RadioGroupVariant`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<RadioGroupUi>`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `itemProps`: Properties forwarded to the item element. (type `RadioGroupItemProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `RadioGroupControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `RadioGroupIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `RadioGroupLabelProps`; optional)
- `modelValue`: The controlled value of the radio item to check. Can be bound as `v-model`. (type `T['value'] | null`; optional)
- `defaultValue`: The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items. (type `T['value']`; optional)
- `disabled`: When `true`, prevents the user from interacting with radio items. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the radio group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the RadioGroup component.

- `update:modelValue`: Event handler called when the radio group value changes (type `[payload: T | null]`; parameters `payload: T | null`)

### RadioGroupCard

#### Props

Properties for the RadioGroupCard component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `variant`: Visual variant of the component. (type `RadioGroupVariant`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<RadioGroupCardUi>`; optional)
- `contentProps`: Properties forwarded to the content element. (type `BaseProps`; optional)
- `textContentProps`: Properties forwarded to the text content element. (type `BaseProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `BaseProps`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `itemProps`: Properties forwarded to the item element. (type `RadioGroupItemProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `RadioGroupControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `RadioGroupIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `RadioGroupLabelProps`; optional)
- `modelValue`: The controlled value of the radio item to check. Can be bound as `v-model`. (type `T['value'] | null`; optional)
- `defaultValue`: The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items. (type `T['value']`; optional)
- `disabled`: When `true`, prevents the user from interacting with radio items. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the radio group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the RadioGroupCard component.

- `update:modelValue`: Event handler called when the radio group value changes (type `[payload: T | null]`; parameters `payload: T | null`)

#### Slots

Slots for the RadioGroupCard component.

- `description`: Slot for rendering custom description content within the radio card. (type `((props: { item: T; }) => any) | undefined`)

### RadioGroupCardCompact

#### Props

Properties for the RadioGroupCard component.

- `contentProps`: Properties forwarded to the content element. (type `BaseProps`; optional)
- `textContentProps`: Properties forwarded to the text content element. (type `BaseProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `BaseProps`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `itemProps`: Properties forwarded to the item element. (type `RadioGroupItemProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `RadioGroupControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `RadioGroupIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `RadioGroupLabelProps`; optional)
- `modelValue`: The controlled value of the radio item to check. Can be bound as `v-model`. (type `T['value'] | null`; optional)
- `defaultValue`: The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items. (type `T['value']`; optional)
- `disabled`: When `true`, prevents the user from interacting with radio items. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the radio group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the RadioGroupCardCompact component.

- `update:modelValue`: Event handler called when the radio group value changes (type `[payload: T | null]`; parameters `payload: T | null`)

#### Slots

Slots for the RadioGroupCompact component.

- `description`: Slot for rendering custom description content within the radio card. (type `((props: { item: T; }) => any) | undefined`)

### RadioGroupCompact

#### Props

Properties for the RadioGroupCompact component.

- `items`: Items rendered by the component. (type `T[]`; required)
- `itemProps`: Properties forwarded to the item element. (type `RadioGroupItemProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `RadioGroupControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `RadioGroupIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `RadioGroupLabelProps`; optional)
- `modelValue`: The controlled value of the radio item to check. Can be bound as `v-model`. (type `T['value'] | null`; optional)
- `defaultValue`: The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items. (type `T['value']`; optional)
- `disabled`: When `true`, prevents the user from interacting with radio items. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the radio group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the RadioGroupCompact component.

- `update:modelValue`: Event handler called when the radio group value changes (type `[payload: T | null]`; parameters `payload: T | null`)

### RadioGroupControl

#### Props

Properties for the RadioGroupControl component.

- `id`: Id of the element (type `string`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### RadioGroupIndicator

#### Props

Properties for the RadioGroupIndicator component.

- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### RadioGroupItem

#### Props

Properties for the RadioGroupItem component.

- `value`: The value given as data when submitted with a `name`. (type `boolean | import("@/index").DefinedValue`; required)
- `disabled`: When `true`, prevents the user from interacting with the radio item. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the RadioGroupItem component.

- `select`: Event handler called when the radio item is selected (type `[event: RadioSelectEvent]`; parameters `event: RadioSelectEvent`)

### RadioGroupLabel

- No documented props, emits, slots, or slot props were available.

### RadioGroupRoot

#### Props

Properties for the RadioGroupRoot component.

- `modelValue`: The controlled value of the radio item to check. Can be bound as `v-model`. (type `T | null`; optional)
- `defaultValue`: The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items. (type `T`; optional)
- `disabled`: When `true`, prevents the user from interacting with radio items. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the radio group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the RadioGroupRoot component.

- `update:modelValue`: Event handler called when the radio group value changes (type `[payload: T | null]`; parameters `payload: T | null`)

## Notes

### Architecture and benchmark differences

VeanUI builds the radio group from Aria `RadioGroupRoot` (`useControllableState` + `useRovingFocusGroup`) → `RadioGroupItem` (checked derivation + `VisuallyHiddenInput` form proxy) → `RadioGroupControl` (`Button` base + `role="radio"` + `aria-checked`/`data-state`, focus-derived selection) → `RadioGroupIndicator` (`usePresence` conditional mount) → `RadioGroupLabel` (`for` ↔ control `id`). `RadioGroupCompact` / `RadioGroupCardCompact` own item iteration and default composition while the UI wrappers only inject variant classes. The `scv()` recipes `radioGroupVariants` / `radioGroupCardVariants` declare 6 sizes, 8 colors, and dot/outline variants.

| Capability                      | VeanUI | Ant Design `Radio` | Element Plus `Radio` | Mantine `Radio` | Naive UI `Radio` | shadcn `RadioGroup` |
| :------------------------------ | :----: | :----------------: | :------------------: | :-------------: | :--------------: | :-----------------: |
| Aria/styled split               |   ✅   |         —          |          —           |        —        |        —         |         ✅          |
| Single-choice exclusive         |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| Roving-focus keyboard nav       |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| Controlled/uncontrolled         |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| Card variant (icon/description) |   ✅   |         —          |          —           |        —        |        —         |          —          |
| `button` variant                |   ➕   |         ✅         |          ✅          |        —        |        —         |          —          |
| `Radio.Button` composite        |   ➕   |         ✅         |          —           |        —        |        —         |          —          |
| Form proxy / `name` submit      |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| Axe-clean (group + card)        |   ✅   |         —          |          —           |        —        |        —         |          —          |

### Cautions

- Arrow-key selection commits through a focus-derived click on the control, so it flows through the same `radio.select` / `update:modelValue` path as mouse clicks.
- The form proxy renders when a `name` is present on a `form`-classed root; pair it with a native `<form>` or the `SForm` integration.
- `select` is a cancellable custom event — call `event.preventDefault()` to veto the value change.
- Enter is wired explicitly to the select handler (matching the checkbox family); Space relies on the native button click behavior.

## FAQ

### How does keyboard navigation work?

The group uses roving focus: one radio is tabbable, Arrow keys move focus (and check the focused radio), Enter/Space select. Set `loop` to cycle from last to first and vice versa.

### Controlled or uncontrolled?

Pass `modelValue` with `v-model` for a controlled value; pass `defaultValue` to let the group own its state internally. Both are supported via `useControllableState`.

### How do I submit the selected value with a form?

Give the group a `name`; inside a `form`-classed root a visually hidden input carries the current value so native form submission picks it up.

### What is the difference between `SRadioGroup` and `SCheckboxGroup`?

`SRadioGroup` enforces single choice — selecting one radio unchecks the others; `SCheckboxGroup` allows multiple checked values. Use radio for mutually exclusive options.
