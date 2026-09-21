---
head:
  title: Radio Group
  description: 'A set of checkable radio buttons where no more than one button can be checked at a time. It ships as a data-driven group and a card variant with icon/description content, both built on roving-focus keyboard navigation. Use it for single-choice from a small, mutually exclusive set; when multiple values are allowed, use SCheckboxGroup; when the option set is too large to scan at once, prefer SSelect.'
---

# Radio Group

## Overview

A set of checkable radio buttons where no more than one button can be checked at a time. It ships as a data-driven group and a card variant with icon/description content, both built on roving-focus keyboard navigation. Use it for single-choice from a small, mutually exclusive set; when multiple values are allowed, use `SCheckboxGroup`; when the option set is too large to scan at once, prefer `SSelect`.

## Usage

<UsageCode component="radio-group" />

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

<PlaygroundGallery component="radio-group" />

## API

<ComponentApi component="radio-group" />

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
