# Popover

Source URL: https://veanui.com/components/popover
Markdown URL: https://veanui.com/components/popover.md
Category: Overlay
Description: Displays rich content in a portal, triggered by a button. SPopover combines the Aria PopoverRoot/PopoverTrigger/PopoverPositioner/PopoverPopup/PopoverArrow/PopoverClose primitive family (built on the shared Popper + dialog-style dismissable/focus layers) with the popoverVariants style recipe (5 slots, 6 sizes).

## Overview

Displays rich content in a portal, triggered by a button. `SPopover` combines the Aria `PopoverRoot`/`PopoverTrigger`/`PopoverPositioner`/`PopoverPopup`/`PopoverArrow`/`PopoverClose` primitive family (built on the shared `Popper` + dialog-style dismissable/focus layers) with the `popoverVariants` style recipe (5 slots, 6 sizes).

Use a popover for contextual, non-critical rich content (menus of actions, settings, help). For navigation menus use `dropdown-menu`; for a small hover hint use `tooltip`; for a blocking confirmation use `popconfirm` or `dialog`.

## Usage

Usage examples for popover are rendered on the site.

## Features

- 🧩 Aria/styled split — `PopoverCompact` aggregates the popper positioner, popup, arrow and close; `SPopover` only injects styles and forwards slots/events
- 🎯 Placement — full popper `placement` control (12 directions) with collision avoidance and side-aware slide animations
- 🎭 Modal toggle — `modal` controls outside-pointer blocking, `useHideOthers`, body scroll lock and focus trapping
- 🔽 Arrow — `showArrow` renders a positioned arrow; configurable via `arrowProps`
- ❌ Closable — optional `close` slot with a built-in `lucide:x` icon; Escape and outside interaction dismiss
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — `role="dialog"`, focus trap + loop, `aria-label`d close button, `axe-core` zero violations

## Component family

- `SPopover` (styled) — the entry wrapper; `popoverVariants` recipe with dynamic slot forwarding
- `PopoverRoot` (Aria) — the state owner; `open` via `useControllableState`, `dir`/`modal`/`disabled`, provides the popper root
- `PopoverTrigger` (Aria) — a `Button` that toggles the popover
- `PopoverPositioner` / `PopoverPositionerImpl` (Aria) — the focus-trapped, dismissable, positioned surface (built on `PopperPositioner`)
- `PopoverPopup` (Aria) — the popup body
- `PopoverArrow` (Aria) — the popper arrow
- `PopoverClose` (Aria) — the close `<button>`, emits `close` and toggles `open`
- `PopoverCompact` (Aria) — the aggregated composite; composes positioner/popup/arrow/close and exposes the slots

## Demos

Interactive demos for popover are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (10): Popover, PopoverAnchor, PopoverArrow, PopoverClose, PopoverCompact, PopoverPopup, PopoverPortal, PopoverPositioner, PopoverRoot, PopoverTrigger.

### Popover

#### Props

Properties for the Popover component.

- `class`: class of popup (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<PopoverUi>`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopoverTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopoverPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopoverPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopoverPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopoverArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopoverCloseProps`; optional)
- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the Popover component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)

#### Slots

Slots for the Popover component.

- `default`: Custom content for the default slot. (type `((props: { open: boolean; close: () => void; }) => any) | undefined`)
- `trigger`: Custom content for the trigger slot. (type `(() => any) | undefined`)
- `close`: Custom content for the close slot. (type `(() => any) | undefined`)

### PopoverAnchor

- No documented props, emits, slots, or slot props were available.

### PopoverArrow

- No documented props, emits, slots, or slot props were available.

### PopoverClose

#### Props

Properties for the PopoverClose component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the PopoverClose component.

- `close`: Emitted when close occurs. (type `[PointerEvent]`; parameters `PointerEvent`)

### PopoverCompact

#### Props

Properties for the PopoverCompact component.

- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopoverTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopoverPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopoverPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopoverPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopoverArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopoverCloseProps`; optional)
- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the PopoverCompact component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)

#### Slots

Slots for the PopoverCompact component.

- `default`: Custom content for the default slot. (type `((props: { open: boolean; close: () => void; }) => any) | undefined`)
- `trigger`: Custom content for the trigger slot. (type `(() => any) | undefined`)
- `close`: Custom content for the close slot. (type `(() => any) | undefined`)

### PopoverPopup

- No documented props, emits, slots, or slot props were available.

### PopoverPortal

- No documented props, emits, slots, or slot props were available.

### PopoverPositioner

#### Props

Properties for the PopoverPositioner component.

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

Events for the PopoverPositioner component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)

### PopoverRoot

#### Props

Properties for the PopoverRoot component.

- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the PopoverRoot component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)

### PopoverTrigger

#### Props

Properties for the PopoverTrigger component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark differences

`PopoverCompact` owns the positioner/popup/arrow/close composition while every primitive stays style-free and only the UI wrapper injects the `popoverVariants` classes. This mirrors radix-ui/shadcn-ui's headless/styled split, built on the shared `Popper` primitives. Ant Design, Element Plus, Mantine and Naive UI ship a single styled popover with `placement`/`trigger`/`width` props; VeanUI additionally exposes per-slot `*Props`, a `size` scale, an arrow toggle, and a `modal` mode the single-package popovers generally lack.

| Capability            | VeanUI | shadcn/ui | Ant Design Popover | Element Plus Popover | Mantine Popover | Naive UI Popover |
| :-------------------- | :----: | :-------: | :----------------: | :------------------: | :-------------: | :--------------: |
| Aria/styled split     |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Popper placement (12) |   ✅   |    ✅     |         ✅         |          ✅          |       ✅        |        ✅        |
| Arrow                 |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Modal mode            |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Close button          |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Sizes (6)             |   ✅   |     —     |         —          |          —           |        —        |        —         |
| Focus trap + loop     |   ✅   |    ✅     |         —          |          —           |        —        |        —         |

`—` = unsupported or a different interaction model.

### Cautions

- `PopoverRoot` defaults to modal (`true`): opening it blocks outside pointer events and locks body scroll. Pass `modal={false}` for a lightweight, non-blocking popover.
- The popup is rendered through a `Portal` (teleported to `document.body`); position it inside a relatively-positioned ancestor only with `portalProps: { disabled: true }`.
- `showArrow` renders an arrow; `arrowProps` can override its position/classes.
- Provide a `close` slot to show the close control; it defaults to a `lucide:x` icon.
- Unlike `tooltip`, the popover does not auto-dismiss on pointer-leave; it stays open until dismissed.

### Roadmap

N/A — popover is feature-complete for the current parity set.

## FAQ

### How do I position the popover?

Use `placement` (from popper), e.g. `top`, `bottom-start`, `right-end`:

```vue
<template #trigger><SButton>Info</SButton></template>
```

### How do I add a close button?

Provide the `close` slot:

```vue
<template #trigger><SButton>More</SButton></template>
<template #close>Dismiss</template>
```

### How do I make a non-blocking popover?

Set `modal={false}`:

```vue
<template #trigger><SButton>Open</SButton></template>
```

### How do I control the open state?

Bind `open` with `v-model` or use `defaultOpen`:

```vue
<template #trigger><SButton>Open</SButton></template>
```
