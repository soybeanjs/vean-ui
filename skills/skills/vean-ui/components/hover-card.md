# Hover Card

Source URL: https://veanui.com/components/hover-card
Markdown URL: https://veanui.com/components/hover-card.md
Category: Overlay
Description: Displays a richer preview card when the trigger is hovered or receives focus. SHoverCard combines the Aria HoverCardRoot/HoverCardTrigger/HoverCardPositioner/HoverCardPopup/HoverCardArrow primitive family (built on the shared Popper) with the hoverCardVariants style recipe (3 slots, 6 sizes).

## Overview

Displays a richer preview card when the trigger is hovered or receives focus. `SHoverCard` combines the Aria `HoverCardRoot`/`HoverCardTrigger`/`HoverCardPositioner`/`HoverCardPopup`/`HoverCardArrow` primitive family (built on the shared `Popper`) with the `hoverCardVariants` style recipe (3 slots, 6 sizes).

Use a hover card for a non-blocking, hover-triggered preview (user profiles, repository previews, inline metadata). For a small text hint use `tooltip`; for click-triggered rich content use `popover`.

## Usage

Usage examples for hover-card are rendered on the site.

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

Interactive demos for hover-card are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (8): HoverCard, HoverCardArrow, HoverCardCompact, HoverCardPopup, HoverCardPortal, HoverCardPositioner, HoverCardRoot, HoverCardTrigger.

### HoverCard

#### Props

Properties for the HoverCard component.

- `class`: class of popup (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<HoverCardUi>`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopperAnchorProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `HoverCardPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `HoverCardPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `HoverCardPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `HoverCardArrowProps`; optional)
- `defaultOpen`: The open state of the hover card when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `open`: The controlled open state of the hover card. (type `boolean`; optional)
- `openDelay`: The duration from when the pointer enters the trigger until the hover card opens. (type `number`; optional)
- `closeDelay`: The duration from when the pointer leaves the trigger or popup until the hover card closes. (type `number`; optional)
- `dir`: No description. (type `Direction`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the HoverCard component.

- `update:open`: Event handler called when the open state of the hover card changes. (type `[value: boolean, reason?: PopperOpenChangeReason | undefined]`; parameters `value: boolean, reason?: PopperOpenChangeReason | undefined`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)

#### Slots

Slots for the HoverCard component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `trigger`: Custom content for the trigger slot. (type `(() => any) | undefined`)

### HoverCardArrow

- No documented props, emits, slots, or slot props were available.

### HoverCardCompact

#### Props

Properties for the HoverCardCompact component.

- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopperAnchorProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `HoverCardPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `HoverCardPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `HoverCardPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `HoverCardArrowProps`; optional)
- `defaultOpen`: The open state of the hover card when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `open`: The controlled open state of the hover card. (type `boolean`; optional)
- `openDelay`: The duration from when the pointer enters the trigger until the hover card opens. (type `number`; optional)
- `closeDelay`: The duration from when the pointer leaves the trigger or popup until the hover card closes. (type `number`; optional)
- `dir`: No description. (type `Direction`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the HoverCardCompact component.

- `update:open`: Event handler called when the open state of the hover card changes. (type `[value: boolean, reason?: PopperOpenChangeReason | undefined]`; parameters `value: boolean, reason?: PopperOpenChangeReason | undefined`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)

#### Slots

Slots for the HoverCardCompact component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `trigger`: Custom content for the trigger slot. (type `(() => any) | undefined`)

### HoverCardPopup

- No documented props, emits, slots, or slot props were available.

### HoverCardPortal

- No documented props, emits, slots, or slot props were available.

### HoverCardPositioner

#### Props

Properties for the HoverCardPositioner component.

- `placement`: The placement of the floating element. If used, it will override the `side` and `align` props. (type `Placement`; default `undefined`; optional)
- `side`: The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. (type `Side`; default `'bottom'`; optional)
- `sideOffset`: The distance in pixels from the trigger. (type `number`; default `0`; optional)
- `sideFlip`: Flip to the opposite side when colliding with boundary. (type `boolean`; default `true`; optional)
- `align`: The preferred alignment against the trigger. May change when collisions occur. (type `Align`; default `'center'`; optional)
- `alignOffset`: An offset in pixels from the `start` or `end` alignment options. (type `number`; default `0`; optional)
- `alignFlip`: Flip alignment when colliding with boundary. May only occur when `prioritizePosition` is true. (type `boolean`; default `true`; optional)
- `avoidCollisions`: When `true`, overrides the side and align preferences to prevent collisions with boundary edges. (type `boolean`; default `true`; optional)
- `collisionBoundary`: The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check. (type `Element | (Element | null)[] | null`; default `[ ]`; optional)
- `collisionPadding`: The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }. (type `Padding`; default `0`; optional)
- `arrowPadding`: The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners. (type `number`; default `0`; optional)
- `hideShiftedArrow`: When `true`, hides the arrow when it cannot be centered to the reference element. (type `boolean`; default `true`; optional)
- `sticky`: The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. (type `'partial' | 'always'`; default `'partial'`; optional)
- `hideWhenDetached`: Whether to hide the content when the trigger becomes fully occluded. (type `boolean`; default `false`; optional)
- `positionStrategy`: The type of CSS position property to use. (type `'fixed' | 'absolute'`; default `'fixed'`; optional)
- `updatePositionStrategy`: Strategy to update the position of the floating element on every animation frame. (type `'always' | 'optimized'`; default `'optimized'`; optional)
- `disableUpdateOnLayoutShift`: Whether to disable the update position for the content when the layout shifted. (type `boolean`; default `false`; optional)
- `prioritizePosition`: Force content to be position within the viewport. Might overlap the reference element, which may not be desired. (type `boolean`; default `false`; optional)
- `reference`: The custom element or virtual element that will be set as the reference to position the floating element. If provided, it will replace the default anchor element. (type `ReferenceElement`; optional)
- `trapFocus`: Whether focus is trapped inside the popup while open (Tab cycles within the layer and body scroll is locked for modal layers). (type `boolean`; default `modal`; optional)
- `disableHoverableContent`: When `true`, hovering the popup closes instead of keeping it open (the grace area is disabled, so leaving the trigger closes the layer immediately). (type `boolean`; default `false`; optional)
- `onGracePointerExit`: Callback invoked when the pointer finally leaves the grace area. Lets an upper layer (e.g. Tooltip) run area-scoped close logic without registering its own second grace area. (type `(() => void)`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

#### Emits

Events for the HoverCardPositioner component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)

### HoverCardRoot

#### Props

Properties for the HoverCardRoot component.

- `defaultOpen`: The open state of the hover card when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `open`: The controlled open state of the hover card. (type `boolean`; optional)
- `openDelay`: The duration from when the pointer enters the trigger until the hover card opens. (type `number`; optional)
- `closeDelay`: The duration from when the pointer leaves the trigger or popup until the hover card closes. (type `number`; optional)
- `dir`: No description. (type `Direction`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the HoverCardRoot component.

- `update:open`: Event handler called when the open state of the hover card changes. (type `[value: boolean, reason?: PopperOpenChangeReason | undefined]`; parameters `value: boolean, reason?: PopperOpenChangeReason | undefined`)

### HoverCardTrigger

- No documented props, emits, slots, or slot props were available.

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
<template #trigger><SButton>Hover me</SButton></template>
<div>Preview content</div>
```

### How do I position the card?

Use `placement`:

```vue
<template #trigger><SButton>Hover me</SButton></template>
<div>Preview content</div>
```

### How do I hide the arrow?

Set `show-arrow={false}`:

```vue
<template #trigger><SButton>Hover me</SButton></template>
<div>Preview content</div>
```

### How do I control the open state?

Bind `open` with `v-model` or use `defaultOpen`:

```vue
<template #trigger><SButton>Hover me</SButton></template>
<div>Preview content</div>
```
