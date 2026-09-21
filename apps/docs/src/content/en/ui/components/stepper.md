---
head:
  title: Stepper
  description: 'Displays progress through a multi-step workflow. SStepper combines a StepperRoot-family of Aria primitives (zero styles) with the stepperVariants style recipe (8 slots: root/item/trigger/indicator/indicatorIcon/itemContent/separator/title/description) and 7 colors × 7 sizes. In linear mode (the default) steps must be completed in order — future steps are disabled and cannot be skipped; in non-linear mode any step can be activated freely. The current step is announced to screen readers through a localized role="status" live region, and the group exposes an aria-label that falls back to the stepper.ariaLabel locale message.'
---

# Stepper

## Overview

Displays progress through a multi-step workflow. `SStepper` combines a `StepperRoot`-family of Aria primitives (zero styles) with the `stepperVariants` style recipe (8 slots: root/item/trigger/indicator/indicatorIcon/itemContent/separator/title/description) and 7 colors × 7 sizes. In **linear mode** (the default) steps must be completed in order — future steps are disabled and cannot be skipped; in non-linear mode any step can be activated freely. The current step is announced to screen readers through a localized `role="status"` live region, and the group exposes an `aria-label` that falls back to the `stepper.ariaLabel` locale message.

## Usage

<UsageCode component="stepper" />

## Features

- 🔁 Linear mode by default — `linear` (default `true`) disables inaccessible future steps and blocks jumping ahead; previous steps always remain reachable
- 🧭 Horizontal / vertical — `orientation` switches the layout, connector direction and arrow-key navigation axis
- 🎛️ Controlled / uncontrolled — `modelValue` + `update:modelValue` or `defaultValue` (default `1`); the root slot exposes `goToStep` / `nextStep` / `prevStep` / `hasNext` / `hasPrev` / `totalSteps` and more
- 🖱️ Click, Enter or Space to select a step; arrow keys move focus (orientation-aware, honoring `dir`), Home/End jump to the first/last reachable step
- ♿ Accessible by default — `role="group"` with a localized `aria-label` fallback, `aria-current="step"` on the active item, `aria-labelledby`/`aria-describedby` wiring between trigger/title/description, and a `role="status"` live region (`stepper.stepOf` message)
- 🧩 Aria/styled split — `StepperCompact` aggregates the 7 primitives and exposes 6 `*Props` channels (item/trigger/indicator/separator/title/description); the `step` is always derived from item order
- 🎨 8-slot styling — root/item/trigger/indicator/indicatorIcon/itemContent/separator/title/description with 7 colors (primary/destructive/success/warning/info/carbon/secondary/accent) and 7 sizes (xs–2xl)
- 🌐 Localized by default — the live region, group `aria-label` and indicator default content use `useLocaleMessages` (`stepper.step` / `stepper.ariaLabel` / `stepper.stepOf`)

## Component family

- `SStepper` (styled) — the entry wrapper; `stepperVariants` recipe with dynamic 8-slot forwarding and `useForwardListeners` event merging; mirrors the `linear` default so an absent Boolean prop is not cast to `false`
- `StepperRoot` (Aria) — the state owner: `useControllableState` over `modelValue`/`defaultValue`, `totalSteps`/`currentStep` derivation, `canGoToStep` linear gating, and the `goToStep`/`nextStep`/`prevStep` API; renders `role="group"`, `data-linear`, `data-orientation`, the `aria-label` fallback and the `VisuallyHidden` live region
- `StepperItem` (Aria) — `step` (1-based), `disabled`, `completed`; derives `data-state` (`completed`/`active`/`inactive`) from position and `isFocusable` from `linear` + `disabled`
- `StepperTrigger` (Aria) — `button` by default; `mousedown.left` plus Enter/Space to select, arrow keys/Home/End to navigate; renders `disabled`/`data-disabled`/`tabindex="-1"` for unreachable steps and registers into the root collection
- `StepperIndicator` (Aria) — `span` by default; default content is the localized `stepper.step` message (`Step {step}`)
- `StepperTitle` / `StepperDescription` (Aria) — `h4`/`p` defaults; expose `id`s consumed by the trigger's `aria-labelledby`/`aria-describedby`
- `StepperSeparator` (Aria) — `SeparatorRoot`-based connector; `decorative` by default, orientation and `data-state` flow from root/item context
- `StepperCompact` (Aria) — the aggregated composite; normalizes items with `step: index + 1`, default indicator shows a check icon (`lucide:check` via the ConfigProvider `iconRender`) for completed steps or the step number otherwise, default title falls back to `Step {n}`; slots: `item`/`indicator`/`title`/`description`/`separator`

## Demos

<PlaygroundGallery component="stepper" />

- 01 Basic — controlled `v-model` over `items`
- 02 Vertical — `orientation="vertical"` layout
- 03 Linear — ordered completion with Previous/Next controls
- 04 Custom styling — 8-slot `ui` overrides

## API

<ComponentApi component="stepper" />

## Notes

### Architecture and benchmark differences

`StepperRoot` owns the whole state machine (controllable state, ordered item collection, linear gating) while every primitive stays style-free and only the UI wrapper injects the `stepperVariants` classes. `isFocusable` is derived per item (`disabled || (!linear && step > currentStep + 1)`) and mirrored into the DOM as `disabled`/`data-disabled`/`tabindex`, so unreachable steps are both non-clickable and out of the tab order. Arrow navigation uses `useArrowNavigation` with `loop: false` and respects `orientation`/`dir`; in linear mode focus cannot land on a disabled future step. The completed check icon requires a ConfigProvider `iconRender` (default: the `Icon` component renders nothing), otherwise completed steps fall back to their number. The live region and `aria-label` fallback are localized via `useLocaleMessages`, unlike shadcn/ui's stepper block which hardcodes English strings.

| Capability                                 | VeanUI | shadcn/ui (blocks) | Ant Design Steps | Element Plus Steps | Mantine Stepper |
| :----------------------------------------- | :----: | :----------------: | :--------------: | :----------------: | :-------------: |
| Aria/styled split                          |   ✅   |         —          |        —         |         —          |        —        |
| Linear mode (ordered completion)           |   ✅   |         ✅         |        ⚠️        |         ✅         |       ✅        |
| Orientation (horizontal/vertical)          |   ✅   |         ✅         |        ✅        |         ✅         |       ✅        |
| Arrow-key navigation (Home/End)            |   ✅   |         —          |        —         |         —          |        —        |
| Localized live region + group `aria-label` |   ✅   |         ⚠️         |        —         |         —          |        —        |
| Controlled/uncontrolled                    |   ✅   |         —          |        ⚠️        |         ⚠️         |       ✅        |
| Compact composite with per-part props      |   ✅   |         —          |        —         |         —          |        —        |
| `completed`/`disabled` per step            |   ✅   |         ✅         |        ✅        |         ✅         |       ✅        |

`⚠️` = partial (AntD uses a `status` prop instead of a linear gate; Element Plus exposes `process-status`/`finish-status` without a navigation gate; shadcn/ui's stepper block renders the status text with hardcoded English and is not a library component).

### Cautions

- `step` on `StepperItem` must be 1-based and sequential: `canGoToStep` and the focus logic index the ordered collection by `step - 1`. The compact normalizes this automatically from item order; custom Aria compositions must keep steps contiguous.
- `itemProps` intentionally omits `step` — it is derived from item order and cannot be overridden.
- In linear mode only the current step and the next one are reachable; `goToStep`/`nextStep` silently ignore unreachable targets, so drive navigation through `hasNext`/`hasPrev` or the `nextStep`/`prevStep` helpers.
- The live region (`role="status"`) only renders when `totalSteps > 0`; give the root an explicit `aria-label` when the default locale message is not appropriate.
- The default indicator falls back to the step number when no ConfigProvider `iconRender` is present; provide one to render the completed check icon.
- `disabled` steps are skipped by arrow navigation but the collection is still ordered; a fully disabled stepper should still expose the group `aria-label`.

## FAQ

### How do I make future steps clickable?

Set `linear="false"` — every step becomes focusable and selectable regardless of the current position:

```vue
<SStepper :items="items" :linear="false" />
```

### How do I drive the stepper with buttons?

Listen to the root slot helpers or simply bind `v-model` and use `hasNext`/`hasPrev` from the root slot to gate your controls:

```vue
<SStepper v-model="value" :items="items" linear>
  <template #default="{ hasNext, hasPrev, nextStep, prevStep }">
    <!-- your custom layout with nextStep() / prevStep() -->
  </template>
</SStepper>
```

### How do I render a vertical stepper?

Set `orientation="vertical"` — the connector and arrow-key navigation axis follow:

```vue
<SStepper :items="items" orientation="vertical" />
```

### How do I mark a step as completed regardless of position?

Pass `completed` in the item data; an explicit `completed` wins over position-derived state:

```vue
<SStepper :items="[{ title: 'Account', completed: true }, { title: 'Profile' }]" />
```

### How do I customize the indicator content?

Use the `indicator` slot — it receives the item data, step and state:

```vue
<SStepper :items="items">
  <template #indicator="{ state, step }">
    <span>{{ state === 'completed' ? '✓' : step }}</span>
  </template>
</SStepper>
```

### How do I localize the status announcement?

The live region and group `aria-label` follow the ConfigProvider locale (`stepper.stepOf` / `stepper.ariaLabel`); override the label per-instance with `aria-label`:

```vue
<SStepper :items="items" aria-label="Checkout progress" />
```
