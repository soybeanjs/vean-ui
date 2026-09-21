---
head:
  title: Checkbox
  description: 'A control that lets the user select or clear an option, with an indeterminate half-check state for partial selections. It ships as a standalone control, a roving-focus group, and data-driven card variants. Use it for independent toggles, multi-select lists, and "select all" scenarios with cascading half-check; for single-choice from a set, prefer SRadioGroup.'
---

# Checkbox

## Overview

A control that lets the user select or clear an option, with an indeterminate half-check state for partial selections. It ships as a standalone control, a roving-focus group, and data-driven card variants. Use it for independent toggles, multi-select lists, and "select all" scenarios with cascading half-check; for single-choice from a set, prefer `SRadioGroup`.

## Usage

<UsageCode component="checkbox" />

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

<PlaygroundGallery component="checkbox" />

## API

<ComponentApi component="checkbox" />

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
