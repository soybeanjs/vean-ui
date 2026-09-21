---
head:
  title: Collapsible
  description: 'An interactive component that expands/collapses a panel. SCollapsible wraps the Aria CollapsibleRoot with the collapsibleVariants style recipe (3 slots: root/trigger/content; 6 sizes), and the Aria CollapsibleTrigger/CollapsibleContent primitives provide the toggle button and the animated panel.'
---

# Collapsible

## Overview

An interactive component that expands/collapses a panel. `SCollapsible` wraps the Aria `CollapsibleRoot` with the `collapsibleVariants` style recipe (3 slots: root/trigger/content; 6 sizes), and the Aria `CollapsibleTrigger`/`CollapsibleContent` primitives provide the toggle button and the animated panel.

Use it for a single "expand to reveal" section, FAQ items, or inline collapsible filters. Prefer `accordion` when you need multiple coordinated sections (single/multiple open), and `dialog`/`popover` for floating surfaces.

## Usage

<UsageCode component="collapsible" />

## Features

- 🧩 Aria/styled split — `SCollapsible` injects `collapsibleVariants`; the Aria primitives own state, a11y and animation
- 🎛️ Controlled / uncontrolled — `v-model:open` or `defaultOpen`
- 📜 Animated panel — `CollapsibleContent` measures real dimensions and animates open/closed via `data-state`
- 🗑️ `unmountOnHide` — removes closed content from the DOM, or keeps it mounted (hidden)
- 🧲 `forceMount` — keep content present even when closed (for measurement/custom animation)
- 🔗 Accessible wiring — the trigger exposes `aria-expanded`/`aria-controls`; root/content reflect `data-state`/`data-disabled`
- 🔧 Polymorphic — `as`/`asChild` on root, trigger and content

## Component family

- `SCollapsible` (styled) — the root wrapper; `collapsibleVariants` recipe and `provideCollapsibleUi`
- `CollapsibleRoot` (Aria) — the state owner; `useControllableState` + `provideCollapsibleRootContext`
- `CollapsibleTrigger` (Aria) — the `Button`-based trigger; `aria-expanded`/`aria-controls`/`data-state`
- `CollapsibleContent` (Aria) — the animated panel; presence-based dimension measurement and `data-state`

## Demos

<PlaygroundGallery component="collapsible" />

## API

<ComponentApi component="collapsible" />

## Notes

### Architecture and benchmark differences

`SCollapsible` is a thin styled wrapper; the Aria primitives own the open state (`useControllableState`), the presence/animation cycle (`usePresence` + `getBoundingClientRect` dimension measurement) and the accessibility wiring (`aria-expanded`/`aria-controls`/`data-state`). This mirrors shadcn/ui and Radix's headless `Collapsible`, unlike Ant Design, Element Plus and Mantine which ship a config-driven collapsible or fold. VeanUI routes the trigger through its `Button` primitive so the styled `Button` variants are reused instead of a bespoke toggle.

| Capability              | VeanUI | shadcn/ui | Radix Collapsible | Ant Design | Element Plus | Mantine |
| :---------------------- | :----: | :-------: | :---------------: | :--------: | :----------: | :-----: |
| Aria/styled split       |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| Controlled/uncontrolled |   ✅   |    ✅     |        ✅         |     ✅     |      ✅      |   ✅    |
| Height animation        |   ✅   |    ✅     |        ✅         |     ✅     |      ✅      |   ✅    |
| `unmountOnHide`         |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| `forceMount`            |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| `as`/`asChild`          |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| Trigger reuses Button   |   ✅   |     —     |         —         |     —      |      —       |    —    |

`—` = unsupported or a different interaction model.

### Cautions

- The collapse animation measures real dimensions with `getBoundingClientRect`, so it only runs on the client; under SSR the first paint renders the open/closed state without animating.
- With `unmountOnHide: true` (default) closed content is removed from the DOM; with `false` it stays mounted but is hidden (`hidden="until-found"`).
- `forceMount` keeps the content element present even when closed — combine it with your own animation/transition to control reveal.
- Wire the trigger via the Aria `CollapsibleTrigger` (a `Button`) so `aria-expanded`/`aria-controls` stay correct; a custom button must set these manually.
- The content element carries `data-state`/`data-disabled` and the recipe's `data-[state=open]:animate-*` classes drive the transition.

### Roadmap

No blocking gaps identified for the core collapsible API.

## FAQ

### How do I build a collapsible with a toggle?

Use `SCollapsible` with the Aria `CollapsibleTrigger` for a styled button trigger:

```vue
<SCollapsible v-model:open="open">
  <template #default="{ open }">
    <SCollapsibleTrigger>Toggle ({{ open ? 'on' : 'off' }})</SCollapsibleTrigger>
    <SCollapsibleContent>Hidden panel content</SCollapsibleContent>
  </template>
</SCollapsible>
```

### How do I control the open state?

Bind `open` with `v-model` (or use `default-open`):

```vue
<SCollapsible v-model:open="open">…</SCollapsible>
```

### How do I keep the content mounted when closed?

Set `unmount-on-hide="false"` so it stays in the DOM (hidden) instead of being removed:

```vue
<SCollapsible :unmount-on-hide="false">…</SCollapsible>
```

### How do I animate with my own transition?

Use `force-mount` and drive the reveal with your own classes or a `<Transition>`:

```vue
<SCollapsible force-mount>…</SCollapsible>
```

### Is the panel keyboard accessible?

Yes — the `CollapsibleTrigger` is a real `<button>` that sets `aria-expanded` and `aria-controls` to the content id, and the content reflects `data-state`; focus stays on the trigger after toggling.
