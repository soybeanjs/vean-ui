---
head:
  title: Hover Card
  description: 'Displays a richer preview card when the trigger is hovered or receives focus. SHoverCard combines the Aria HoverCardRoot/HoverCardTrigger/HoverCardPositioner/HoverCardPopup/HoverCardArrow primitive family (built on the shared Popper) with the hoverCardVariants style recipe (3 slots, 6 sizes).'
---

# Hover Card

## Overview

Displays a richer preview card when the trigger is hovered or receives focus. `SHoverCard` combines the Aria `HoverCardRoot`/`HoverCardTrigger`/`HoverCardPositioner`/`HoverCardPopup`/`HoverCardArrow` primitive family (built on the shared `Popper`) with the `hoverCardVariants` style recipe (3 slots, 6 sizes).

Use a hover card for a non-blocking, hover-triggered preview (user profiles, repository previews, inline metadata). For a small text hint use `tooltip`; for click-triggered rich content use `popover`.

## Usage

<UsageCode component="hover-card" />

## Features

- 🧩 Aria/styled split — `HoverCardCompact` aggregates the popper trigger, positioner, popup and arrow; `SHoverCard` only injects styles and forwards slots/events
- ⏱️ Open/close delay — `openDelay` (default 700ms) / `closeDelay` (default 300ms) tune the hover latency
- 🎯 Placement — full popper `placement` control with collision avoidance and side-aware slide animations
- 🔽 Arrow — `showArrow` renders a positioned arrow; configurable via `arrowProps`
- ⌨️ Focus trigger — also opens on keyboard focus, not just pointer hover
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — dismiss on Escape/outside interaction, `axe-core` zero violations open and closed

## Component family

- `SHoverCard` (styled) — the entry wrapper; `hoverCardVariants` recipe with dynamic slot forwarding
- `HoverCardRoot` (Aria) — the state owner; `open` via `useControllableState`, `openDelay`/`closeDelay`, provides the popper root
- `HoverCardTrigger` (Aria) — the anchor that opens the card on hover/focus
- `HoverCardPositioner` / `HoverCardPositionerImpl` (Aria) — the dismissable, positioned surface (built on `PopperPositioner`)
- `HoverCardPopup` (Aria) — the popup body
- `HoverCardArrow` (Aria) — the popper arrow
- `HoverCardCompact` (Aria) — the aggregated composite; composes trigger/positioner/popup/arrow and exposes the slots

## Demo

<PlaygroundGallery component="hover-card" />

## API

<ComponentApi component="hover-card" />

## Notes

### Architecture and benchmark differences

`HoverCardCompact` owns the trigger/positioner/popup/arrow composition while every primitive stays style-free and only the UI wrapper injects the `hoverCardVariants` classes. This mirrors radix-ui/shadcn-ui's headless split, built on the shared `Popper` primitives. Ant Design, Element Plus, Mantine and Naive UI ship a single styled popover used for hover previews; VeanUI exposes a dedicated hover-card with configurable `openDelay`/`closeDelay`, per-slot `*Props`, an arrow toggle and a `size` scale the single-package libraries generally omit.

| Capability            | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :-------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split     |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Open/close delay      |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| Popper placement (12) |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |
| Arrow                 |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)             |   ✅   |     —     |     —      |      —       |    —    |    —     |
| Focus trigger         |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |

`—` = unsupported or a different interaction model (hover previews fold into the generic popover).

### Cautions

- The card opens on hover and keyboard focus; tune `openDelay`/`closeDelay` to reduce accidental triggers (defaults 700ms/300ms).
- The popup is rendered through a `Portal` (teleported to `document.body`); position it inside a relatively-positioned ancestor only with `portalProps: { disabled: true }`.
- `showArrow` renders an arrow; `arrowProps` can override its position/classes.
- The hover card is non-modal and dismisses on Escape or outside interaction; it does not trap focus.

### Roadmap

N/A — hover-card is feature-complete for the current parity set.

## FAQ

### How do I adjust the open/close timing?

Set `open-delay` and `close-delay` (ms):

```vue
<SHoverCard :open-delay="200" :close-delay="100">
  <template #trigger><SButton>Hover me</SButton></template>
  <div>Preview content</div>
</SHoverCard>
```

### How do I position the card?

Use `placement`:

```vue
<SHoverCard placement="top">
  <template #trigger><SButton>Hover me</SButton></template>
  <div>Preview content</div>
</SHoverCard>
```

### How do I hide the arrow?

Set `show-arrow={false}`:

```vue
<SHoverCard :show-arrow="false">
  <template #trigger><SButton>Hover me</SButton></template>
  <div>Preview content</div>
</SHoverCard>
```

### How do I control the open state?

Bind `open` with `v-model` or use `defaultOpen`:

```vue
<SHoverCard v-model:open="open">
  <template #trigger><SButton>Hover me</SButton></template>
  <div>Preview content</div>
</SHoverCard>
```
