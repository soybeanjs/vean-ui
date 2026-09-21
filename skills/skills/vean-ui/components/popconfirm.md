# Popconfirm

Source URL: https://veanui.com/components/popconfirm
Markdown URL: https://veanui.com/components/popconfirm.md
Category: Overlay
Description: A confirmation box component based on Popper, used for lightweight secondary confirmation operations. SPopconfirm combines the Aria PopconfirmCompact (built on the popper primitives) with the popconfirmVariants style recipe (13 slots, 6 sizes × 4 types).

## Overview

A confirmation box component based on `Popper`, used for lightweight secondary confirmation operations. `SPopconfirm` combines the Aria `PopconfirmCompact` (built on the popper primitives) with the `popconfirmVariants` style recipe (13 slots, 6 sizes × 4 types).

Use it for a quick inline confirm (delete, destructive action) next to the trigger. For a richer blocking confirmation use `dialog`; for an unobtrusive hint use `tooltip`.

## Usage

Usage examples for popconfirm are rendered on the site.

## Features

- 🧩 Built on `Popper` — inherits placement, arrow, portal, dismissable and focus behavior
- 🎨 4 types — `type="error"`/`"success"`/`"warning"`/`"info"` drive the leading icon and color
- 🏷️ Title + description + content — `title`/`description`/`content` props or the matching slots
- 🔘 Confirm/cancel — `confirmText`/`cancelText` (localized from `dialog.confirm`/`dialog.cancel`); `showCancel` defaults to `onlyWarning`
- 🖼️ Icon toggle — `showIcon` renders the type icon; `showArrow` renders the popper arrow
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — popup exposes `role="dialog"` labelled by the trigger, focus-managed, `axe-core` clean in the browser e2e
- 🔒 Disabled — `disabled` blocks the trigger from opening the popconfirm

## Component family

- `SPopconfirm` (styled) — the entry wrapper; `popconfirmVariants` recipe with dynamic slot forwarding
- `PopconfirmCompact` (Aria) — the aggregated composite built on `PopperRoot`/`PopperTrigger`/`PopperPositioner`/`PopperPopup`
- `PopconfirmHeader` / `PopconfirmContent` / `PopconfirmFooter` (Aria) — layout sections
- `PopconfirmTitle` / `PopconfirmDescription` (Aria) — the title/description
- `PopconfirmConfirm` / `PopconfirmCancel` (Aria) — footer `<button>`s, emit `confirm`/`cancel`

## Playground

Interactive demos for popconfirm are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (17): Popconfirm, PopconfirmAnchor, PopconfirmArrow, PopconfirmCancel, PopconfirmClose, PopconfirmCompact, PopconfirmConfirm, PopconfirmContent, PopconfirmDescription, PopconfirmFooter, PopconfirmHeader, PopconfirmPopup, PopconfirmPortal, PopconfirmPositioner, PopconfirmRoot, PopconfirmTitle, PopconfirmTrigger.

### Popconfirm

#### Props

Properties for the Popconfirm component.

- `class`: class of popup (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<PopconfirmUi>`; optional)
- `type`: Type. (type `PopconfirmType`; optional)
- `placement`: Placement. (type `Placement`; optional)
- `title`: Title text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `content`: Content. (type `string`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; default `true`; optional)
- `showIcon`: Whether to show an icon. (type `boolean`; default `true`; optional)
- `confirmText`: The text of the confirm button. Defaults to the localized `dialog.confirm` message from `ConfigProvider`. (type `string`; optional)
- `cancelText`: The text of the cancel button. Defaults to the localized `dialog.cancel` message from `ConfigProvider`. (type `string`; optional)
- `showCancel`: Determines whether the cancel button is shown. (type `boolean | 'onlyWarning'`; default `'onlyWarning'`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopconfirmTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopconfirmPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopconfirmPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopconfirmPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopconfirmArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopconfirmCloseProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `PopconfirmHeaderProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `PopconfirmTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `PopconfirmDescriptionProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `PopconfirmContentProps`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `PopconfirmFooterProps`; optional)
- `confirmProps`: Properties forwarded to the confirm element. (type `PopconfirmConfirmProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `PopconfirmCancelProps`; optional)
- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the Popconfirm component.

- `update:open`: No description. (type `[value: boolean, reason: PopperOpenChangeReason]`; parameters `value: boolean, reason: PopperOpenChangeReason`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)
- `confirm`: Emitted when confirm occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `cancel`: Emitted when cancel occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the Popconfirm component.

- `default`: Custom content for the default slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `trigger`: Custom content for the trigger slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)

### PopconfirmAnchor

#### Props

Properties for the PopconfirmAnchor component.

- `reference`: No description. (type `ReferenceElement`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### PopconfirmArrow

- No documented props, emits, slots, or slot props were available.

### PopconfirmCancel

#### Props

Properties for the PopconfirmCancel component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the PopconfirmCancel component.

- `cancel`: Emitted when cancel occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### PopconfirmClose

#### Props

Properties for the PopconfirmClose component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the PopconfirmClose component.

- `close`: Emitted when close occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### PopconfirmCompact

#### Props

Properties for the PopconfirmCompact component.

- `type`: Type. (type `PopconfirmType`; optional)
- `placement`: Placement. (type `Placement`; optional)
- `title`: Title text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `content`: Content. (type `string`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; default `true`; optional)
- `showIcon`: Whether to show an icon. (type `boolean`; default `true`; optional)
- `confirmText`: The text of the confirm button. Defaults to the localized `dialog.confirm` message from `ConfigProvider`. (type `string`; optional)
- `cancelText`: The text of the cancel button. Defaults to the localized `dialog.cancel` message from `ConfigProvider`. (type `string`; optional)
- `showCancel`: Determines whether the cancel button is shown. (type `boolean | 'onlyWarning'`; default `'onlyWarning'`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `PopconfirmTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `PopconfirmPortalProps`; optional)
- `positionerProps`: Properties forwarded to the positioner element. (type `PopconfirmPositionerProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopconfirmPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopconfirmArrowProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `PopconfirmCloseProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `PopconfirmHeaderProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `PopconfirmTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `PopconfirmDescriptionProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `PopconfirmContentProps`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `PopconfirmFooterProps`; optional)
- `confirmProps`: Properties forwarded to the confirm element. (type `PopconfirmConfirmProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `PopconfirmCancelProps`; optional)
- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the PopconfirmCompact component.

- `update:open`: No description. (type `[value: boolean, reason: PopperOpenChangeReason]`; parameters `value: boolean, reason: PopperOpenChangeReason`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)
- `confirm`: Emitted when confirm occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `cancel`: Emitted when cancel occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the PopconfirmCompact component.

- `default`: Custom content for the default slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `trigger`: Custom content for the trigger slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: PopconfirmCompactBaseSlotProps) => any) | undefined`)

### PopconfirmConfirm

#### Props

Properties for the PopconfirmConfirm component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the PopconfirmConfirm component.

- `confirm`: Emitted when confirm occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### PopconfirmContent

- No documented props, emits, slots, or slot props were available.

### PopconfirmDescription

- No documented props, emits, slots, or slot props were available.

### PopconfirmFooter

- No documented props, emits, slots, or slot props were available.

### PopconfirmHeader

- No documented props, emits, slots, or slot props were available.

### PopconfirmPopup

- No documented props, emits, slots, or slot props were available.

### PopconfirmPortal

- No documented props, emits, slots, or slot props were available.

### PopconfirmPositioner

#### Props

Properties for the PopconfirmPositioner component.

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

Events for the PopconfirmPositioner component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: No description. (type `[]`)

### PopconfirmRoot

#### Props

Properties for the PopconfirmRoot component.

- `dir`: No description. (type `Direction`; optional)
- `open`: No description. (type `boolean`; optional)
- `defaultOpen`: No description. (type `boolean`; optional)
- `modal`: No description. (type `boolean`; optional)
- `disabled`: No description. (type `boolean`; optional)

#### Emits

Events for the PopconfirmRoot component.

- `update:open`: No description. (type `[value: boolean, reason: PopperOpenChangeReason]`; parameters `value: boolean, reason: PopperOpenChangeReason`)

### PopconfirmTitle

- No documented props, emits, slots, or slot props were available.

### PopconfirmTrigger

#### Props

Properties for the PopconfirmTrigger component.

- `trigger`: No description. (type `PopperTriggerType`; optional)
- `reference`: No description. (type `ReferenceElement`; optional)
- `openDelay`: No description. (type `number`; optional)
- `closeDelay`: No description. (type `number`; optional)
- `skipDelayDuration`: No description. (type `number`; optional)
- `pressOpenDelay`: No description. (type `number`; optional)
- `openOnFocus`: No description. (type `boolean`; optional)
- `focusOpenDelay`: Open delay applied to focus-driven opens. Defaults to `openDelay`; set `0` to open instantly on focus (Tooltip semantics). (type `number`; default `inherit from `openDelay``; optional)
- `focusVisibleOnly`: When `true`, focus-driven opening only responds to keyboard/programmatic focus (`:focus-visible`), ignoring pointer-derived focus. (type `boolean`; default `false`; optional)
- `ariaMode`: How the trigger references its popup for assistive technology. - `controls`: `aria-expanded` + `aria-controls` (expandable widgets: popover / menu) - `describedby`: `aria-describedby` while open (tooltip-like descriptions) - `none`: no popup-reference attributes (type `PopperTriggerAriaMode`; default `'controls'`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark differences

`PopconfirmCompact` composes the popper trigger/positioner/popup with a confirm-style header, content and footer, while every primitive stays style-free and only the UI wrapper injects the `popconfirmVariants` classes. This mirrors radix-ui/shadcn-ui's headless split. Ant Design, Element Plus, Mantine and Naive UI ship a single styled popconfirm with `title`/`description`/`okText`/`cancelText`/`onConfirm` props; VeanUI additionally exposes per-slot `*Props`, a `size` scale, a `type` color/icon system, and localized action labels.

| Capability               | VeanUI | shadcn/ui | Ant Design Popconfirm | Element Plus Popconfirm | Mantine Popconfirm | Naive UI Popconfirm |
| :----------------------- | :----: | :-------: | :-------------------: | :---------------------: | :----------------: | :-----------------: |
| Built on Popper          |   ✅   |    ✅     |           —           |            —            |         —          |          —          |
| Aria/styled split        |   ✅   |    ✅     |           —           |            —            |         —          |          —          |
| Type icon + color        |   ✅   |     —     |           —           |           ✅            |         —          |          —          |
| Title + description      |   ✅   |    ✅     |          ✅           |           ✅            |         ✅         |         ✅          |
| Localized confirm/cancel |   ✅   |     —     |           —           |            —            |         —          |          —          |
| Sizes (6)                |   ✅   |     —     |           —           |            —            |         —          |          —          |
| Placement (popper)       |   ✅   |    ✅     |          ✅           |           ✅            |         ✅         |         ✅          |

`—` = unsupported or a different interaction model.

### Cautions

- `modal` defaults to `false` for popconfirm (unlike dialog), so it does not block outside interaction or lock body scroll.
- `showCancel` defaults to `'onlyWarning'` — the cancel button appears only for `type="warning"`. Pass an explicit boolean to override.
- `confirmText`/`cancelText` default to the localized `dialog.confirm`/`dialog.cancel` messages; override per instance.
- The popup renders `role="dialog"` and is labelled by the trigger; provide a `title` so the dialog has a clear accessible name.
- Confirm/cancel emit `confirm`/`cancel` events; the popup dismisses after either action (subject to your own `beforeClose` handling in the parent).

### Roadmap

N/A — popconfirm is feature-complete for the current parity set.

## FAQ

### How do I show a title, description and content?

Pass `title`/`description`/`content` props or the matching slots:

```vue
<template #trigger><SButton danger>Delete</SButton></template>
```

### How do I set the type and icon?

Use `type` (`error`/`success`/`warning`/`info`) and toggle `show-icon`:

```vue
<template #trigger><SButton>Delete</SButton></template>
```

### How do I customize the action labels?

Set `confirm-text`/`cancel-text`, and control the cancel button with `show-cancel`:

```vue
<template #trigger><SButton>Delete</SButton></template>
```

### How do I control the open state?

Bind `open` with `v-model` or use `defaultOpen`:

```vue
<template #trigger><SButton>Delete</SButton></template>
```

### How do I disable the trigger?

Set `disabled` to block opening:

```vue
<template #trigger><SButton>Delete</SButton></template>
```
