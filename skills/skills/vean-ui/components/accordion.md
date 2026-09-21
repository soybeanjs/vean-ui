# Accordion

Source URL: https://veanui.com/components/accordion
Markdown URL: https://veanui.com/components/accordion.md
Category: Data Display
Description: A vertically (or horizontally) stacked set of interactive headings that each reveal a section of content, supporting single or multiple expansion. SAccordion combines an AccordionRoot/AccordionItem/AccordionHeader/AccordionTrigger/AccordionContent/AccordionDescription family of Aria primitives (zero styles) with the accordionVariants style recipe (8 slots, 6 sizes).

## Overview

A vertically (or horizontally) stacked set of interactive headings that each reveal a section of content, supporting single or multiple expansion. `SAccordion` combines an `AccordionRoot`/`AccordionItem`/`AccordionHeader`/`AccordionTrigger`/`AccordionContent`/`AccordionDescription` family of Aria primitives (zero styles) with the `accordionVariants` style recipe (8 slots, 6 sizes).

Use it for FAQs, settings groups, collapsible navigation, or any "expand to reveal" pattern where one (or several) sections should be open at a time. Prefer `tabs` when only one panel should be visible at once and each panel has a persistent label, and `collapsible` for a single standalone foldable section.

`SAccordion` aggregates the primitives through `AccordionCompact` and is `items`-driven with `item`/`leading`/`title`/`trigger-icon`/`content` slots. For fully custom compositions, fall back to the Aria `AccordionRoot`-family primitives.

## Usage

Usage examples for accordion are rendered on the site.

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

Interactive demos for accordion are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (8): Accordion, AccordionCompact, AccordionContent, AccordionDescription, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger.

### Accordion

#### Props

Properties for the Accordion component.

- `class`: root class (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<AccordionUi>`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `itemProps`: Properties forwarded to the item element. (type `AccordionItemProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `AccordionHeaderProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `AccordionTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `AccordionContentProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `AccordionDescriptionProps`; optional)
- `collapsible`: When type is "single", allows closing content when clicking trigger for an open item. When type is "multiple", this prop has no effect. (type `boolean`; default `false`; optional)
- `dir`: The reading direction of the accordion when applicable. If omitted, assumes LTR (left-to-right) reading mode. (type `Direction`; default `'ltr'`; optional)
- `disabled`: When `true`, prevents the user from interacting with the accordion and all its items (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the accordion. (type `DataOrientation`; default `'vertical'`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)

#### Emits

Events for the Accordion component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)

#### Slots

Slots for the Accordion component.

- `item`: Custom content for the item slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `trigger-icon`: Custom content for the trigger icon slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `content`: Custom content for the content slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)

### AccordionCompact

#### Props

Properties for the AccordionCompact component.

- `items`: Items rendered by the component. (type `T[]`; required)
- `itemProps`: Properties forwarded to the item element. (type `AccordionItemProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `AccordionHeaderProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `AccordionTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `AccordionContentProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `AccordionDescriptionProps`; optional)
- `collapsible`: When type is "single", allows closing content when clicking trigger for an open item. When type is "multiple", this prop has no effect. (type `boolean`; default `false`; optional)
- `dir`: The reading direction of the accordion when applicable. If omitted, assumes LTR (left-to-right) reading mode. (type `Direction`; default `'ltr'`; optional)
- `disabled`: When `true`, prevents the user from interacting with the accordion and all its items (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the accordion. (type `DataOrientation`; default `'vertical'`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)

#### Emits

Events for the AccordionCompact component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)

#### Slots

Slots for the AccordionCompact component.

- `item`: Custom content for the item slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `trigger-icon`: Custom content for the trigger icon slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)
- `content`: Custom content for the content slot. (type `((props: AccordionCompactSlotProps<T, M>) => any) | undefined`)

#### Slot Props

Slot properties for the AccordionCompact component.

- `item`: Current item data. (type `T`; required)
- `index`: Index of the current item. (type `number`; required)
- `modelValue`: Current model value. (type `(M extends true ? string[] : string) | undefined`; required)
- `open`: Whether the component is open. (type `boolean`; required)

### AccordionContent

#### Props

Properties for the AccordionContent component.

- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### AccordionDescription

- No documented props, emits, slots, or slot props were available.

### AccordionHeader

- No documented props, emits, slots, or slot props were available.

### AccordionItem

#### Props

Properties for the AccordionItem component.

- `value`: Value of the accordion item. All items within an accordion should use a unique value. (type `string`; required)
- `disabled`: When `true`, prevents the user from interacting with the collapsible. (type `boolean`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### AccordionRoot

#### Props

Properties for the AccordionRoot component.

- `collapsible`: When type is "single", allows closing content when clicking trigger for an open item. When type is "multiple", this prop has no effect. (type `boolean`; default `false`; optional)
- `dir`: The reading direction of the accordion when applicable. If omitted, assumes LTR (left-to-right) reading mode. (type `Direction`; default `'ltr'`; optional)
- `disabled`: When `true`, prevents the user from interacting with the accordion and all its items (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the accordion. (type `DataOrientation`; default `'vertical'`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)

#### Emits

Events for the AccordionRoot component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)

### AccordionTrigger

#### Props

Properties for the AccordionTrigger component.

- `disabledCollapsible`: When `true`, prevents the user from toggling the collapsible. (type `boolean`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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

```

### How do I allow multiple sections open?

Set `multiple` and bind an array:

```vue

```

### How do I let all sections be closed?

`collapsible` is `true` by default, so clicking the open trigger closes it:

```vue

```

### How do I customize the trigger icon?

Use the `trigger-icon` slot (or `leading` for a left icon):

```vue
<template #trigger-icon="{ open }">
  <SIcon :icon="open ? 'lucide:minus' : 'lucide:plus'" />
</template>
```

### How do I build a fully custom item?

Use the `item` slot to compose the Aria parts yourself:

```vue
<template #item="{ item, open }">
  <div class="border-b">
    <button type="button" :aria-expanded="open">{{ item.title }}</button>
    <div v-if="open">{{ item.description }}</div>
  </div>
</template>
```
