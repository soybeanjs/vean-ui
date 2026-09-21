# Checkbox

Source URL: https://veanui.com/components/checkbox
Markdown URL: https://veanui.com/components/checkbox.md
Category: Forms
Description: A control that lets the user select or clear an option, with an indeterminate half-check state for partial selections. It ships as a standalone control, a roving-focus group, and data-driven card variants. Use it for independent toggles, multi-select lists, and "select all" scenarios with cascading half-check; for single-choice from a set, prefer SRadioGroup.

## Overview

A control that lets the user select or clear an option, with an indeterminate half-check state for partial selections. It ships as a standalone control, a roving-focus group, and data-driven card variants. Use it for independent toggles, multi-select lists, and "select all" scenarios with cascading half-check; for single-choice from a set, prefer `SRadioGroup`.

## Usage

Usage examples for checkbox are rendered on the site.

## Features

- ☑️ Tri-state model — `CheckedState` of `boolean | 'indeterminate'`, reflected via both `aria-checked` (`mixed`) and `data-state`
- 🗂 Groups with roving-focus keyboard navigation (`useRovingFocusGroup`, Arrow keys)
- 🏷 Accessible label — `SCheckboxLabel` wires `for` to the control's `id`
- 📋 Native form proxy — renders a visually hidden input carrying `name` / `value` (default `'on'`) / `checked` for form submission
- 🃏 Card variants (`SCheckboxCard` / `SCheckboxCardGroup`) with icon, label, and description content
- 🎨 6 sizes, 8 colors, 2 shapes, and horizontal/vertical orientation via `checkboxVariants`
- 📊 Data-driven Compact aggregation — `CheckboxGroupCompact` / `CheckboxCardGroupCompact` own iteration and default composition
- ♿ `role="checkbox"` with full aria support, axe-clean across all four forms

## Component family

- `SCheckbox` - base checkbox with label, control, and indicator
- `SCheckboxGroup` - vertical/horizontal group with roving-focus navigation and form proxy
- `SCheckboxCard` - card checkbox with icon, label, and description
- `SCheckboxCardGroup` - data-driven group of card checkboxes

## Demos

Interactive demos for checkbox are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (13): Checkbox, CheckboxCard, CheckboxCardCompact, CheckboxCardGroup, CheckboxCardGroupCompact, CheckboxCompact, CheckboxControl, CheckboxGroup, CheckboxGroupCompact, CheckboxGroupRoot, CheckboxIndicator, CheckboxLabel, CheckboxRoot.

### Checkbox

#### Props

Properties for the Checkbox component.

- `class`: the class of root element (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CheckboxUi>`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `shape`: Shape of the component. (type `CheckboxShape`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `id`: Id. (type `string`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `CheckedState | null`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `CheckedState`; optional)
- `value`: The value given as data when submitted with a `name`. (type `DefinedValue`; default `on`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkbox (type `boolean`; default `false`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the Checkbox component.

- `update:modelValue`: Event handler called when the value of the checkbox changes. (type `[value: CheckedState | null]`; parameters `value: CheckedState | null`)

### CheckboxCard

#### Props

Properties for the CheckboxCard component.

- `class`: the class of root element (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CheckboxCardUi>`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `shape`: Shape of the component. (type `CheckboxShape`; optional)
- `icon`: Icon rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `id`: Id. (type `string`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `CheckedState | null`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `CheckedState`; optional)
- `value`: The value given as data when submitted with a `name`. (type `DefinedValue`; default `on`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkbox (type `boolean`; default `false`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxCard component.

- `update:modelValue`: Event handler called when the value of the checkbox changes. (type `[value: CheckedState | null]`; parameters `value: CheckedState | null`)

### CheckboxCardCompact

#### Props

Properties for the CheckboxCardCompact component.

- `icon`: Icon rendered by the component. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `label`: Label text rendered by the component. (type `string`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `id`: Id. (type `string`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `CheckedState | null`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `CheckedState`; optional)
- `value`: The value given as data when submitted with a `name`. (type `DefinedValue`; default `on`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkbox (type `boolean`; default `false`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxCardCompact component.

- `update:modelValue`: Event handler called when the value of the checkbox changes. (type `[value: CheckedState | null]`; parameters `value: CheckedState | null`)

### CheckboxCardGroup

#### Props

Properties for the CheckboxCardGroup component.

- `class`: the class of group root element (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CheckboxCardUi>`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `shape`: Shape of the component. (type `CheckboxShape`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `rootProps`: Properties forwarded to the root element. (type `CheckboxRootProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `T['value'][]`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `T['value'][]`; optional)
- `rovingFocus`: When `false`, navigating through the items using arrow keys will be disabled. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkboxes (type `boolean`; default `false`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxCardGroup component.

- `update:modelValue`: Event handler called when the value of the checkbox group changes. (type `[value: T[]]`; parameters `value: T[]`)

### CheckboxCardGroupCompact

#### Props

Properties for the CheckboxCardGroupCompact component.

- `items`: Items rendered by the component. (type `T[]`; required)
- `rootProps`: Properties forwarded to the root element. (type `CheckboxRootProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `T['value'][]`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `T['value'][]`; optional)
- `rovingFocus`: When `false`, navigating through the items using arrow keys will be disabled. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkboxes (type `boolean`; default `false`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxCardGroupCompact component.

- `update:modelValue`: Event handler called when the value of the checkbox group changes. (type `[value: T[]]`; parameters `value: T[]`)

### CheckboxCompact

#### Props

Properties for the CheckboxCompact component.

- `label`: Label text rendered by the component. (type `string`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `id`: Id. (type `string`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `CheckedState | null`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `CheckedState`; optional)
- `value`: The value given as data when submitted with a `name`. (type `DefinedValue`; default `on`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkbox (type `boolean`; default `false`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxCompact component.

- `update:modelValue`: Event handler called when the value of the checkbox changes. (type `[value: CheckedState | null]`; parameters `value: CheckedState | null`)

### CheckboxControl

#### Props

Properties for the CheckboxControl component.

- `id`: Id of the element (type `string`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CheckboxGroup

#### Props

Properties for the CheckboxGroup component.

- `class`: the class of group root element (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CheckboxUi>`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `shape`: Shape of the component. (type `CheckboxShape`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `rootProps`: Properties forwarded to the root element. (type `CheckboxRootProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `T['value'][]`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `T['value'][]`; optional)
- `rovingFocus`: When `false`, navigating through the items using arrow keys will be disabled. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkboxes (type `boolean`; default `false`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxGroup component.

- `update:modelValue`: Event handler called when the value of the checkbox group changes. (type `[value: T[]]`; parameters `value: T[]`)

### CheckboxGroupCompact

#### Props

Properties for the CheckboxGroupCompact component.

- `items`: Items rendered by the component. (type `T[]`; required)
- `rootProps`: Properties forwarded to the root element. (type `CheckboxRootProps`; optional)
- `controlProps`: Properties forwarded to the control element. (type `CheckboxControlProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `CheckboxIndicatorProps`; optional)
- `labelProps`: Properties forwarded to the label element. (type `CheckboxLabelProps`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `T['value'][]`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `T['value'][]`; optional)
- `rovingFocus`: When `false`, navigating through the items using arrow keys will be disabled. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkboxes (type `boolean`; default `false`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxGroupCompact component.

- `update:modelValue`: Event handler called when the value of the checkbox group changes. (type `[value: T[]]`; parameters `value: T[]`)

### CheckboxGroupRoot

#### Props

Properties for the CheckboxGroupRoot component.

- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `T[]`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `T[]`; optional)
- `rovingFocus`: When `false`, navigating through the items using arrow keys will be disabled. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkboxes (type `boolean`; default `false`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxGroupRoot component.

- `update:modelValue`: Event handler called when the value of the checkbox group changes. (type `[value: T[]]`; parameters `value: T[]`)

### CheckboxIndicator

#### Props

Properties for the CheckboxIndicator component.

- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CheckboxLabel

- No documented props, emits, slots, or slot props were available.

### CheckboxRoot

#### Props

Properties for the CheckboxRoot component.

- `id`: Id. (type `string`; optional)
- `modelValue`: The controlled value of the checkbox. Can be bound with v-model. (type `CheckedState | null`; optional)
- `defaultValue`: The value of the checkbox when it is initially rendered. Use when you do not need to control its value. (type `CheckedState`; optional)
- `value`: The value given as data when submitted with a `name`. (type `DefinedValue`; default `on`; optional)
- `disabled`: When `true`, prevents the user from interacting with the checkbox (type `boolean`; default `false`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CheckboxRoot component.

- `update:modelValue`: Event handler called when the value of the checkbox changes. (type `[value: CheckedState | null]`; parameters `value: CheckedState | null`)

## Notes

### Architecture and benchmark differences

VeanUI builds checkbox with a single-source tri-state state machine: `CheckboxRoot` (`useControllableState` + `CheckedState`) derives `ariaChecked` (`indeterminate` → `mixed`) and `dataState` (checked / indeterminate / unchecked), which `CheckboxControl` reflects on `role="checkbox"` while `CheckboxIndicator` mounts conditionally via `usePresence`. Group value changes are emitted by `CheckboxGroupRoot`, which wraps `useRovingFocusGroup` for arrow-key navigation and renders a `VisuallyHiddenInput` form proxy. The `scv()` recipes `checkboxVariants` / `checkboxCardVariants` declare 6 sizes, 8 colors, and 2 shapes; all four Compact layers own iteration and default composition while the UI wrappers only inject variant classes.

| Capability                       | VeanUI | Ant Design `Checkbox` | Element Plus `Checkbox` | Mantine `Checkbox` | shadcn/ui `Checkbox` |
| :------------------------------- | :----: | :-------------------: | :---------------------: | :----------------: | :------------------: |
| Aria/styled split                |   ✅   |           —           |            —            |         —          |          ✅          |
| Tri-state (indeterminate)        |   ✅   |          ✅           |           ✅            |         ✅         |          ✅          |
| Independent `indeterminate` prop |   ➕   |          ✅           |           ✅            |         ✅         |          —           |
| Form value mapping               |   ✅   |          ✅           |           ✅            |         ✅         |          ✅          |
| Card variant (icon/description)  |   ✅   |           —           |            —            |         —          |          —           |
| Group roving-focus keyboard nav  |   ✅   |          ✅           |           ✅            |         ✅         |          —           |
| `button` variant                 |   ➕   |          ✅           |           ✅            |         —          |          —           |
| Select-all / half-check helper   |   ➕   |          ✅           |            —            |         —          |          —           |

### Cautions

- The half-check state is driven by `modelValue="indeterminate"`; a dedicated `indeterminate` prop is a roadmap enhancement, not yet implemented.
- A `disabled` group disables every item; an individual `disabled` on an item is honored inside an enabled group.
- The form proxy activates when a `name` is present — pair it with a native `<form>` or the `SForm` integration to submit values.
- The indicator uses `pointer-events: none` so clicks always land on the control itself.

## FAQ

### How do I show a partial / indeterminate state?

Pass `modelValue="indeterminate"` (or `defaultValue`); the control reflects `aria-checked="mixed"` and `data-state="indeterminate"`.

### How do I build a "select all" list?

Combine a master `SCheckbox` with `modelValue="indeterminate"` and an `SCheckboxGroup`; mirror the group's `update:modelValue` back to the master to drive the half-check.

### How do I submit checkbox values with a form?

Give the checkbox or group a `name`; the component renders a visually hidden input so native form submission carries `value` (default `'on'`) or the array of checked values.

### What is the difference between `SCheckboxCard` and `SCheckbox`?

`SCheckboxCard` renders a bordered card with `icon` / `label` / `description` content slots and a `data-[state=checked]` border highlight; `SCheckbox` is the bare control.
