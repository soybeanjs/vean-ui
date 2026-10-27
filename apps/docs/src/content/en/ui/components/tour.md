---
head:
  title: Tour
  description: 'A guided walkthrough that highlights interface targets and explains product features one step at a time. STour combines Aria step management, viewport spotlight geometry, and Popper positioning with an accessible, localized bubble.'
---

# Tour

## Overview

`STour` guides users through product features with a positioned bubble and a spotlight around the active target. Each step can provide a selector, element, or lazy target resolver, a title, a description, and its own placement.

Declare steps in order with `<STourStep>` children and pass template refs directly to `target`. For data-driven steps, you can also pass a `steps` array.

Use a tour for a short onboarding walkthrough or to introduce a workflow. Use `tooltip` for a single non-interactive hint and `stepper` when users need to see progress without a floating explanation.

## Usage

<UsageCode component="tour" />

## Features

- 🎯 Highlights an element selected by CSS selector, `HTMLElement`, `SVGElement`, or lazy resolver
- 🧭 Positions the bubble with Popper collision handling; each step can override placement
- 🔢 Controls visibility with `v-model` and the zero-based active step with `v-model:current`
- ✨ Slides the spotlight smoothly between targets when the active step changes, respecting reduced-motion preferences
- 🔔 Emits `change` with the zero-based active step index
- ⌨️ Supports Escape to close and native keyboard-accessible navigation buttons
- 📜 Scrolls the active target into view by default; disable with `autoScroll`
- 🔒 Locks page scrolling while the tour is open by default; disable with `:lock-scroll="false"`
- 🌓 Shows a viewport mask by default, supports hiding it, adjustable spotlight padding/radius, and optional mask dismissal
- 🎨 Supports per-step mask, arrow, and close-button visibility; customize mask colors with the `ui.mask` class
- 🔘 Uses dot indicators by default and supports custom indicators through the `indicators` slot
- 🧭 Supports all 12 standard placements and centers steps that omit a target
- 📜 Accepts `scrollIntoViewOptions` and allows Escape closing to be disabled
- 📐 Uses a `520px` bubble by default with a `6px` / `2px` spotlight gap/radius
- 🎨 Supports `type="primary"` for an emphasized bubble, useful without a mask
- 🌐 Localizes action labels and progress announcements through `ConfigProvider`
- 🎨 Offers six sizes and per-slot `ui` overrides

## Component family

- `STour` — controls the walkthrough, spotlight, bubble, and navigation.
- `STourStep` — declares one target, its content, and step-level options.

## Demos

<PlaygroundGallery component="tour" />

## API

<ComponentApi component="tour" />

## Notes

### Architecture and benchmark differences

The Aria layer owns step state, target measurement, keyboard dismissal, and the geometry for the spotlight. `STour` supplies the visual recipe and forwards slots. This follows the headless composition model used by shadcn-style walkthroughs while keeping target resolution and positioning in the component library.

| Capability                            | VeanUI Tour | [Ant Design Tour](https://ant.design/components/tour/) | [Element Plus Tour](https://element-plus.org/en-US/component/tour) | [Mantine Tour](https://mantine.dev/core/tour/) |
| :------------------------------------ | :---------: | :----------------------------------------------------: | :----------------------------------------------------------------: | :--------------------------------------------: |
| Aria/styled split                     |     ✅      |                           —                            |                                 —                                  |                       —                        |
| Selector, element, or resolver target |     ✅      |                           ✅                           |                                 ✅                                 |                       ✅                       |
| Controlled active step                |     ✅      |                           ✅                           |                                 ✅                                 |                       ✅                       |
| Per-step placement                    |     ✅      |                           ✅                           |                                 ✅                                 |                       ✅                       |
| Per-region style customization        |     ✅      |                           ✅                           |                              Partial                               |                       ✅                       |

### Cautions

- A selector or element must be present when its step becomes active. The selector is resolved again on every step change.
- `v-model` controls visibility. Use `v-model:current` for the zero-based active step; the first step is `0`. `v-model:open` remains an alias for visibility.
- Without `target`, the bubble is positioned in the viewport center and the mask has no spotlight cutout, which works for welcome or completion steps.
- The tour uses a non-modal dialog bubble and does not trap focus. Escape closes it; the mask blocks pointer input outside the spotlight unless `maskClosable` is enabled.
- `showMask` is enabled by default. Set `:show-mask="false"` to keep the bubble without dimming the page; see the “Mask configuration” demo.
- The bubble is `520px` wide by default and shrinks on narrow viewports. The spotlight has a `6px` gap and `2px` corner radius; adjust them with `spotlightPadding` and `spotlightRadius`.
- The arrow tip keeps a `12px` gap from its target by default. Adjust the gap with `positionerProps.sideOffset`.
- The overlay is portaled to `document.body` by default. Set `portalProps` only when you need a different portal target.
- Smooth scrolling is enabled by default. Turn off `autoScroll` when the host application manages scrolling itself.
- Page scrolling is locked while the tour is open by default. Set `:lock-scroll="false"` to allow users to scroll the page during the tour.
- `scrollIntoViewOptions` accepts a `ScrollIntoViewOptions` object or `false`; `:auto-scroll="false"` remains available as a simple off switch.
- `closeOnPressEscape` is enabled by default. Set it to `false` when the host application handles Escape itself.
- A step can override `showMask`, `showArrow`, or `showClose`; omitted values inherit the Tour-level option.

## FAQ

### How do I start the tour?

Bind a boolean with `v-model` and set it to `true` from your own launch button. The component does not render or own a trigger.

### Can I use a Vue template ref as a target?

Yes. Declare the step inside `STour` and pass the component ref's `$el` to `target`:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const profileButton = shallowRef<{ $el: HTMLButtonElement }>();
</script>

<template>
  <SButton @click="open = true">Begin tour</SButton>
  <SButton ref="profileButton">Profile</SButton>
  <STour v-model="open">
    <STourStep :target="profileButton?.$el" title="Profile">
      <p>Update your personal information.</p>
    </STourStep>
  </STour>
</template>
```

### How do I control the current step?

Bind `v-model:current` to control the active step. It is zero-based, so the first step is `0`.

### How do I change placement for one step?

Set `placement` on that step. It overrides the tour-level `placement` for that step only.

### How do I show the bubble without the mask?

Set `:show-mask="false"`. The bubble remains positioned against its target; set it back to `true` to restore the mask, or see the “Mask configuration” demo.

### How do I replace the complete bubble content?

Use the `content` slot. It receives the active step, current/total step counts, and `previous`, `next`, and `close` actions. The default slot on `STour` is reserved for ordered `STourStep` children.

### How do I customize the step indicators?

Use the `indicators` slot. Its `current` value is zero-based and `total` is the number of steps. The default indicators are dots, while screen readers continue to receive the localized step announcement.

### How do I customize the mask color?

Set the `mask` class through `ui`, for example `:ui="{ mask: 'fill-primary/35' }"`. Use `showMask` on a step to hide the mask only for that step.

### What value does the `change` event receive?

It receives a zero-based step index, matching `current` and Element Plus. The default `v-model` controls whether the tour is open.

### How do I emphasize a tour without a mask?

Set `:show-mask="false"` and `type="primary"`. The primary bubble uses contrasting text, arrow, and action button colors.
