---
head:
  title: Tooltip
  description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. STooltip combines the Aria TooltipRoot/TooltipTrigger/TooltipPositioner/TooltipPopup/TooltipArrow primitive family (built on the shared Popper) with the tooltipVariants style recipe (3 slots, 6 sizes).'
---

# Tooltip

## Overview

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it. `STooltip` combines the Aria `TooltipRoot`/`TooltipTrigger`/`TooltipPositioner`/`TooltipPopup`/`TooltipArrow` primitive family (built on the shared `Popper`) with the `tooltipVariants` style recipe (3 slots, 6 sizes).

Use a tooltip for a short, non-interactive hint. For rich hover content use `hover-card`; for click-triggered content use `popover`; for a confirmation use `popconfirm`.

## Usage

<UsageCode component="tooltip" />

## Features

- 🧩 Aria/styled split — `TooltipCompact` aggregates the popper trigger, positioner, popup and arrow; `STooltip` only injects styles and forwards slots/events
- 🖱️ Hover + focus — opens on pointer hover or keyboard focus; dismisses on Escape or pointer leave
- ⏱️ Delay tuning — `delayDuration` (open) and `skipDelayDuration` (between triggers), with global defaults via `ConfigProvider`
- 🎯 Placement — full popper `placement` control with collision avoidance and side-aware slide animations
- 🔽 Arrow — `showArrow` renders a positioned arrow; configurable via `arrowProps`
- 🏷️ Content — `content` prop or the default slot
- ♿ Behavior toggles — `ignoreNonKeyboardFocus`, `disableHoverableContent`, `disableClosingTrigger`, `disabled`
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — `role="tooltip"` (visually-hidden text node), non-modal, `axe-core` zero violations open and closed

## Component family

- `STooltip` (styled) — the entry wrapper; `tooltipVariants` recipe with dynamic slot forwarding
- `TooltipRoot` (Aria) — the state owner; `open` via `useControllableState`, `delayDuration`/`skipDelayDuration`/`disabled`/`ignoreNonKeyboardFocus`, merges the global `ConfigProvider` tooltip config
- `TooltipTrigger` (Aria) — the anchor that opens the tooltip on hover/focus
- `TooltipPositioner` / `TooltipPositionerImpl` (Aria) — the positioned surface (built on `PopperPositioner`)
- `TooltipPopup` (Aria) — the popup body; exposes a visually-hidden `role="tooltip"` text node for screen readers
- `TooltipArrow` (Aria) — the popper arrow
- `TooltipCompact` (Aria) — the aggregated composite; composes trigger/positioner/popup/arrow and exposes the slots

## Demos

<PlaygroundGallery component="tooltip" />

## API

<ComponentApi component="tooltip" />

## Notes

### Architecture and benchmark differences

`TooltipCompact` owns the trigger/positioner/popup/arrow composition while every primitive stays style-free and only the UI wrapper injects the `tooltipVariants` classes. This mirrors radix-ui/shadcn-ui's headless split, built on the shared `Popper` primitives. Ant Design, Element Plus, Mantine and Naive UI ship a single styled tooltip with `title`/`placement` props; VeanUI additionally exposes per-slot `*Props`, a `size` scale, an arrow toggle, a `delayDuration`/`skipDelayDuration` tuning model with `ConfigProvider` global defaults, and an accessible visually-hidden `role="tooltip"` node.

| Capability            | VeanUI | shadcn/ui | Ant Design Tooltip | Element Plus Tooltip | Mantine Tooltip | Naive UI Tooltip |
| :-------------------- | :----: | :-------: | :----------------: | :------------------: | :-------------: | :--------------: |
| Aria/styled split     |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Popper placement (12) |   ✅   |    ✅     |         ✅         |          ✅          |       ✅        |        ✅        |
| Delay tuning          |   ✅   |    ✅     |         —          |          ✅          |       ✅        |        —         |
| Arrow                 |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Sizes (6)             |   ✅   |     —     |         —          |          —           |        —        |        —         |
| Focus trigger         |   ✅   |    ✅     |         ✅         |          ✅          |       ✅        |        ✅        |

`—` = unsupported or a different interaction model.

### Cautions

- The tooltip opens on hover and keyboard focus; tune `delayDuration`/`skipDelayDuration` (or the `ConfigProvider` tooltip defaults) to reduce accidental triggers.
- `ignoreNonKeyboardFocus` (default) ignores non-keyboard focus (e.g. programmatic), matching native tooltip semantics.
- The popup is rendered through a `Portal` (teleported to `document.body`); position it inside a relatively-positioned ancestor only with `portalProps: { disabled: true }`.
- `showArrow` renders an arrow; `arrowProps` can override its position/classes.
- The tooltip is non-modal and does not trap focus; it dismisses on Escape or pointer leave.

### Roadmap

N/A — tooltip is feature-complete for the current parity set.

## FAQ

### How do I add a tooltip to an element?

Wrap the element in the `trigger` slot and set `content`:

```vue
<STooltip content="Delete this item">
  <template #trigger><SButton>Delete</SButton></template>
</STooltip>
```

### How do I position the tooltip?

Use `placement`:

```vue
<STooltip placement="top" content="Copy">
  <template #trigger><SButton>Copy</SButton></template>
</STooltip>
```

### How do I adjust the open timing?

Set `delay-duration` (ms), with `skip-delay-duration` between triggers:

```vue
<STooltip :delay-duration="150" :skip-delay-duration="50" content="Save">
  <template #trigger><SButton>Save</SButton></template>
</STooltip>
```

### How do I hide the arrow?

Set `show-arrow={false}`:

```vue
<STooltip :show-arrow="false" content="Info">
  <template #trigger><SButton>?</SButton></template>
</STooltip>
```
