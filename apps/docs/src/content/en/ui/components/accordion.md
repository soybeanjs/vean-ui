---
head:
  title: Accordion
  description: 'A vertically (or horizontally) stacked set of interactive headings that each reveal a section of content, supporting single or multiple expansion. SAccordion combines an AccordionRoot/AccordionItem/AccordionHeader/AccordionTrigger/AccordionContent/AccordionDescription family of Aria primitives (zero styles) with the accordionVariants style recipe (8 slots, 6 sizes).'
---

# Accordion

## Overview

A vertically (or horizontally) stacked set of interactive headings that each reveal a section of content, supporting single or multiple expansion. `SAccordion` combines an `AccordionRoot`/`AccordionItem`/`AccordionHeader`/`AccordionTrigger`/`AccordionContent`/`AccordionDescription` family of Aria primitives (zero styles) with the `accordionVariants` style recipe (8 slots, 6 sizes).

Use it for FAQs, settings groups, collapsible navigation, or any "expand to reveal" pattern where one (or several) sections should be open at a time. Prefer `tabs` when only one panel should be visible at once and each panel has a persistent label, and `collapsible` for a single standalone foldable section.

`SAccordion` aggregates the primitives through `AccordionCompact` and is `items`-driven with `item`/`leading`/`title`/`trigger-icon`/`content` slots. For fully custom compositions, fall back to the Aria `AccordionRoot`-family primitives.

## Usage

<UsageCode component="accordion" />

## Features

- 🧩 Aria/styled split — `AccordionCompact` aggregates the 6 primitives and is `items`-driven; `SAccordion` only injects styles and forwards slots/events
- 🎚️ Single / multiple — `multiple` toggles one-open vs many-open (`M extends boolean` generic); `collapsible` allows all sections closed
- ⌨️ Keyboard navigation — arrow keys move between triggers (`useArrowNavigation`), respecting `orientation` and `dir`; triggers expose `aria-expanded`/`aria-disabled`/`data-state`
- 🧭 Orientation — `vertical` (default) or `horizontal`
- ⛔ Disabled items — per-item `disabled` and root `disabled` propagation
- 🎨 6 sizes — xs–2xl `size` matching `ThemeSize`
- 🔧 Fully customizable — `as`/`asChild` on the trigger, `leading`/`title`/`trigger-icon`/`content`/`item` slots, and per-slot `ui` overrides
- ♿ Accessible by default — real `<button>` triggers with `aria-expanded`, collapsible animation via `data-state`, and `axe-core` zero violations

## Component family

- `SAccordion` (styled) — the entry wrapper; `accordionVariants` recipe with dynamic slot forwarding
- `AccordionRoot` (Aria) — the state owner; `useSelection` manages single/multiple `modelValue`, exposes `dir`/`orientation`
- `AccordionItem` (Aria) — one section; derives its open/disabled state from the root and wires arrow-key navigation
- `AccordionHeader` (Aria) — the header container for the trigger
- `AccordionTrigger` (Aria) — the `<button>` trigger; `aria-expanded`/`aria-disabled`/`data-state` and click-to-toggle
- `AccordionContent` (Aria) — the animated collapsible content (`CollapsibleContent`)
- `AccordionDescription` (Aria) — the default description text inside content
- `AccordionCompact` (Aria) — the aggregated composite; iterates `items` into items and exposes the customization slots

## Demos

<PlaygroundGallery component="accordion" />

## API

<ComponentApi component="accordion" />

## Notes

### Architecture and benchmark differences

`AccordionCompact` owns the `items` iteration and default content assembly while every primitive stays style-free and only the UI wrapper injects the `accordionVariants` classes. This mirrors shadcn/ui's headless split and Radix's `Accordion` primitive, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a config-driven collapse with `defaultActiveKey`/`activeKey`. Vean's root uses `useSelection` so single/multiple modes share one state model, and arrow-key navigation is driven by the same `useArrowNavigation` composable used across the menu family for consistency.

| Capability                    | VeanUI | shadcn/ui | Ant Design Collapse | Element Plus Collapse | Mantine Accordion | Naive UI Collapse |
| :---------------------------- | :----: | :-------: | :-----------------: | :-------------------: | :---------------: | :---------------: |
| Aria/styled split             |   ✅   |    ✅     |          —          |           —           |         —         |         —         |
| Single / multiple             |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| Collapsible (all closed)      |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| Keyboard arrow navigation     |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| Custom trigger icon           |   ✅   |     —     |         ✅          |          ✅           |        ✅         |        ✅         |
| Data-driven `items` (Compact) |   ✅   |     —     |         ✅          |          ✅           |        ✅         |        ✅         |
| Disabled item                 |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| Orientation (v/h)             |   ✅   |     —     |         ✅          |          ✅           |         —         |         —         |
| `as`/`asChild` trigger        |   ✅   |    ✅     |          —          |           —           |         —         |         —         |

`—` = unsupported or a different interaction model.

### Cautions

- In single mode (`multiple: false`) only one section stays open; with `collapsible` (default `true`) clicking the open trigger closes it, leaving all sections closed.
- Arrow-key navigation requires a trigger to be focused; the keys follow `orientation` (`ArrowUp`/`ArrowDown` vertically, `ArrowLeft`/`ArrowRight` horizontally) and swap under RTL via `dir`.
- `unmountOnHide` (default `true`) unmounts closed content; set it to `false` to keep it in the DOM (e.g. to preserve inner form state).
- The default trigger chevron rotates with CSS based on `data-state`; replace it via the `trigger-icon` slot if you need a different indicator.
- Disabled items ignore clicks and are skipped by arrow navigation but remain reachable in the DOM order for assistive tech.

### Roadmap

No blocking gaps identified for the core accordion API. A bordered `variant` set and a `left`-icon trigger layout are evaluated as enhancements tracked in `docs/roadmap.md`.

## FAQ

### How do I allow only one section open at a time?

Single mode is the default — bind `modelValue` to a single value:

```vue
<SAccordion v-model="open" :items="items" />
```

### How do I allow multiple sections open?

Set `multiple` and bind an array:

```vue
<SAccordion v-model="openList" multiple :items="items" />
```

### How do I let all sections be closed?

`collapsible` is `true` by default, so clicking the open trigger closes it:

```vue
<SAccordion collapsible :items="items" />
```

### How do I customize the trigger icon?

Use the `trigger-icon` slot (or `leading` for a left icon):

```vue
<SAccordion :items="items">
  <template #trigger-icon="{ open }">
    <SIcon :icon="open ? 'lucide:minus' : 'lucide:plus'" />
  </template>
</SAccordion>
```

### How do I build a fully custom item?

Use the `item` slot to compose the Aria parts yourself:

```vue
<SAccordion :items="items">
  <template #item="{ item, open }">
    <div class="border-b">
      <button type="button" :aria-expanded="open">{{ item.title }}</button>
      <div v-if="open">{{ item.description }}</div>
    </div>
  </template>
</SAccordion>
```
