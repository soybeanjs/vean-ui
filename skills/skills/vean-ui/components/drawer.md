# Drawer

Source URL: https://veanui.com/components/drawer
Markdown URL: https://veanui.com/components/drawer.md
Category: Overlay
Description: A gesture-driven panel that slides in from an edge of the screen. It owns its own Aria family — snap points, swipe dismiss, drag handle and nested scaling — built on the dialog primitives for modality, focus and dismissal.

## Overview

A gesture-driven panel that slides in from an edge of the screen. Unlike `SSheet` (a dialog with a side), the drawer owns a real domain state machine: **snap points**, **swipe progress**, a **drag handle**, and **nested scaling** are behaviour the dialog family does not have.

`SDrawer` combines the Aria `drawer` primitive family with the `drawerVariants` style recipe (extends `sheetVariants`, adds a drag `handle` and an opt-in `swipeArea`; 6 sizes × 4 sides). Modality, focus trapping and dismissal still come from the shared dialog primitives.

## Usage

Usage examples for drawer are rendered on the site.

## Features

- 🧩 Dialog-backed modality — inherits the dialog contract (`open`/`defaultOpen`, focus trap, focus restoration, Escape/outside dismissal) while adding the drawer state machine
- 🧭 4 sides — `side="top"`/`"bottom"`/`"left"`/`"right"` (default `bottom`); horizontal sides are mirrored under RTL, vertical sides cap their height and scroll their content
- 📏 Snap points — `snapPoints` accepts fractions (`0.5`), pixel offsets or CSS lengths; bind the active level with `v-model:snap-point`; the drawer opens at the first snap point and resets to it when closed
- 🪜 Sequential snapping — `snapToSequentialPoints` walks one level at a time instead of jumping to the nearest point
- 🖐️ Swipe dismiss — dragging the panel or the handle past `closeThreshold` closes it; `dismissible={false}` forces an explicit action; `swipeDirection` overrides the dismiss direction
- 👉 Swipe to open — opt into an edge gesture strip with `swipeable` (`DrawerSwipeArea`), with axis locking, direction damping, sampled velocity and scroll yielding
- 🖼️ Page indent — `DrawerIndent` / `DrawerIndentBackground` scale, shift and round the page behind the drawer following the live swipe progress (CSS-variable driven)
- 🧲 Handle-only dragging — `handleOnly` restricts the gesture to the handle; `fixed` pins the panel while its content scrolls
- 🪗 Nested drawers — `nested` renders through `DrawerRootNested` so drag, release and open state stay coordinated with the parent
- 🎛️ Modality tiers — `modal` accepts `true` (full modal), `'trap-focus'` (focus trapped, outside pointer events alive) or `false`
- 🔘 Dialog footer — `showClose`/`showCancel`/`showConfirm` with localized `cancelText`/`confirmText`
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ⛶ Fullscreen — `fullscreen`/`defaultFullscreen` (or `v-model:fullscreen`) grow the panel to the viewport from its anchored edge; snapping and dragging are suspended while fullscreen
- ♿ Accessible — `role="dialog"`, focus moves into the panel, `axe-core` clean

## Component family

- `SDrawer` (styled) — the entry wrapper; `drawerVariants` recipe with dynamic slot forwarding
- `DrawerRoot` / `DrawerRootNested` (Aria) — the state owner; `open`, `snapPoints`, `snapPoint`, `dismissible`, `nested`, drag/swipe state
- `DrawerTrigger` (Aria) — the opener, wired to `aria-haspopup`/`aria-expanded`
- `DrawerPortal` (Aria) — the teleport boundary
- `DrawerOverlay` (Aria) — the dimmed backdrop; fades with the live swipe progress
- `DrawerPopup` (Aria) — the focus-trapped surface and the drag gesture host; its position is driven entirely by CSS variables (`--vean-drawer-snap-point-offset` + `--vean-drawer-swipe-movement-x/y`)
- `DrawerViewport` (Aria) — the scrollable region that carries snap-point state
- `DrawerSwipeArea` (Aria) — the opt-in edge strip that opens the drawer by swipe
- `DrawerHandle` (Aria) — the grab handle; double-tap cycles snap points. `DrawerCompact` renders it only for `side="bottom"`
- `DrawerIndent` / `DrawerIndentBackground` (Aria) — wrap the page behind the drawer to get the indent effect; `data-active` marks an open drawer and `--vean-drawer-swipe-progress` carries the live progress
- `DrawerHeader` / `DrawerContent` / `DrawerFooter` / `DrawerTitle` / `DrawerDescription` / `DrawerClose` / `DrawerCancel` / `DrawerConfirm` (Aria) — chrome primitives wrapping Dialog; DOM uses `data-vean-drawer-*`
- `DrawerCompact` (Aria) — the aggregated composite; composes handle, swipe area, header, content and footer and exposes the slots

## Demos

Interactive demos for drawer are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (21): Drawer, DrawerCancel, DrawerClose, DrawerCompact, DrawerConfirm, DrawerContent, DrawerDescription, DrawerFooter, DrawerHandle, DrawerHeader, DrawerIndent, DrawerIndentBackground, DrawerOverlay, DrawerPopup, DrawerPortal, DrawerRoot, DrawerRootNested, DrawerSwipeArea, DrawerTitle, DrawerTrigger, DrawerViewport.

### Drawer

#### Props

Properties for the Drawer component.

- `description`: The description of the dialog. This is used for accessibility purposes and will be rendered in the content of the dialog if the `description` slot is not provided. (type `string`; optional)
- `open`: The controlled open state of the dialog. Can be bound with `v-model:open`. (type `boolean`; default `undefined`; optional)
- `defaultOpen`: The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; default `false`; optional)
- `dir`: The text direction of the dialog (type `Direction`; optional)
- `draggable`: Whether the dialog can be moved by dragging its header. (type `boolean`; default `false`; optional)
- `title`: The title of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `title` slot is not provided. (type `string`; optional)
- `icon`: The icon of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `icon` slot is not provided. (type `string | import("vue").Component | VNode<import("vue").RendererNode, import("vue").RendererElement, { [key: string]: ...`; optional)
- `pure`: Whether to use the pure version of the dialog, which does not include the header and footer. This is useful when you want to fully control the content of the dialog and do not need the built-in header and footer. (type `boolean`; default `false`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `DrawerPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `DrawerPopupProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `DialogTriggerProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `DialogHeaderProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `DialogContentProps`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `DialogFooterProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `DialogCloseProps`; optional)
- `fullscreen`: The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`. (type `boolean`; default `undefined`; optional)
- `showClose`: Whether show the close button in the header of the dialog. (type `boolean`; default `true`; optional)
- `showFullscreen`: Whether show the fullscreen toggle button in the header of the dialog. (type `boolean`; default `true`; optional)
- `showCancel`: Whether to show the cancel button. When set to `onlyWarning`, the cancel button will only be shown when the dialog is an alert dialog with `alertType="warning"`. When set to `true`, the cancel button will always be shown. (type `boolean | 'onlyWarning'`; default `'onlyWarning'`; optional)
- `cancelText`: The text of the cancel button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `cancel` slot is not provided. Defaults to the localized `dialog.cancel` message from `ConfigProvider`. (type `string`; optional)
- `showConfirm`: Whether to show the confirm button when the dialog is an alert dialog. The default value is `true` when the dialog is an alert dialog. (type `boolean`; optional)
- `confirmText`: The text of the confirm button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `confirm` slot is not provided. Defaults to the localized `dialog.confirm` message from `ConfigProvider`. (type `string`; optional)
- `overlayProps`: Properties forwarded to the overlay element. (type `DrawerOverlayProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `DialogTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `DialogDescriptionProps`; optional)
- `fullscreenProps`: Properties forwarded to the fullscreen element. (type `DialogFullscreenProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `DialogCancelProps`; optional)
- `confirmProps`: Properties forwarded to the confirm element. (type `DialogConfirmProps`; optional)
- `isAlert`: Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response. When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes. (type `boolean`; default `false`; optional)
- `alertType`: The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog. (type `DialogAlertType`; optional)
- `defaultFullscreen`: The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state. (type `boolean`; default `false`; optional)
- `modal`: Modality tier. `true` blocks outside pointer events, `'trap-focus'` only traps focus, `false` keeps the surface non-modal. (type `import("../../types").ModalityTier`; default `true`; optional)
- `snapPoint`: The controlled snap point. Can be bound with `v-model:snapPoint`. (type `DrawerSnapPoint | null`; optional)
- `defaultSnapPoint`: The snap point used when the drawer is initially rendered. Use when you do not need to control it. Defaults to the first entry of `snapPoints`. (type `DrawerSnapPoint | null`; optional)
- `snapToSequentialPoints`: When `true`, snaps to the next sequential snap point (one step at a time). When `false`, snaps to the nearest snap point by distance. (type `boolean`; default `false`; optional)
- `closeThreshold`: Close threshold as a fraction of the drawer size (0–1). (type `number`; default `0.25`; optional)
- `swipeDirection`: The swipe direction that dismisses the drawer. Defaults to the direction opposite the drawer's entry edge (`side`). (type `SwipeDirection`; optional)
- `fixed`: Whether fixed. (type `boolean`; optional)
- `dismissible`: Whether dismissible. (type `boolean`; default `true`; optional)
- `nested`: Whether nested. (type `boolean`; default `false`; optional)
- `side`: Direction. (type `Side`; default `'bottom'`; optional)
- `noBodyStyles`: When `true` the `body` doesn't get any styles assigned from the drawer (type `boolean`; optional)
- `handleOnly`: Whether handle only. (type `boolean`; default `false`; optional)
- `preventScrollRestoration`: Whether prevent scroll restoration. (type `boolean`; optional)
- `snapPoints`: Snap points used to position the drawer. Use numbers between 0 and 1 to represent fractions of the viewport height, numbers greater than 1 as pixel values, or strings in `px`/`rem` units. (type `DrawerSnapPoint[]`; optional)
- `handleProps`: Properties forwarded to the handle element. (type `DrawerHandleProps`; optional)
- `swipeable`: Render the opt-in swipe-to-open area at the drawer's edge. (type `boolean`; default `false`; optional)
- `swipeAreaProps`: Properties forwarded to the swipe area element. (type `DrawerSwipeAreaProps`; optional)
- `class`: the popup class of the drawer (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<DrawerUi>`; optional)

#### Emits

Events for the Drawer component.

- `cancel`: Event handler called when the dialog is requested to be canceled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `click`: Event handler called when the dialog trigger is activated. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `fullscreen`: Event handler called when the fullscreen state of the dialog is requested to be toggled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `confirm`: Event handler called when the dialog is requested to be closed by confirming. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `update:fullscreen`: Event handler called when the fullscreen state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `drag`: Emitted while dragging with the live progress: 0 fully open, 1 closed. (type `[percentageDragged: number]`; parameters `percentageDragged: number`)
- `release`: Emitted when a drag gesture releases; `true` when the drawer stays open. (type `[open: boolean]`; parameters `open: boolean`)
- `close`: Emitted when close occurs. (type `[]`)
- `update:snapPoint`: Emitted when the snap point value changes. (type `[val: DrawerSnapPoint | null]`; parameters `val: DrawerSnapPoint | null`)

#### Slots

Slots for the Drawer component.

- `default`: Custom content for the default slot. (type `(props: DialogCompactBaseSlotProps) => any`; parameters `props: DialogCompactBaseSlotProps`)
- `trigger`: Custom content for the trigger slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `fullscreen`: Custom content for the fullscreen slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `cancel`: Custom content for the cancel slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `confirm`: Custom content for the confirm slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)

### DrawerCancel

#### Props

Properties for the DrawerCancel component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DrawerCancel component.

- `cancel`: Event handler called when the dialog is requested to be canceled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DrawerClose

#### Props

Properties for the DrawerClose component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DrawerClose component.

- `close`: Event handler called when the dialog is requested to be closed. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DrawerCompact

#### Props

Properties for the DrawerCompact component.

- `description`: The description of the dialog. This is used for accessibility purposes and will be rendered in the content of the dialog if the `description` slot is not provided. (type `string`; optional)
- `open`: The controlled open state of the dialog. Can be bound with `v-model:open`. (type `boolean`; default `undefined`; optional)
- `defaultOpen`: The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; default `false`; optional)
- `dir`: The text direction of the dialog (type `Direction`; optional)
- `draggable`: Whether the dialog can be moved by dragging its header. (type `boolean`; default `false`; optional)
- `title`: The title of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `title` slot is not provided. (type `string`; optional)
- `icon`: The icon of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `icon` slot is not provided. (type `string | import("vue").Component | VNode<import("vue").RendererNode, import("vue").RendererElement, { [key: string]: ...`; optional)
- `pure`: Whether to use the pure version of the dialog, which does not include the header and footer. This is useful when you want to fully control the content of the dialog and do not need the built-in header and footer. (type `boolean`; default `false`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `DrawerPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `DrawerPopupProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `DialogTriggerProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `DialogHeaderProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `DialogContentProps`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `DialogFooterProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `DialogCloseProps`; optional)
- `fullscreen`: The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`. (type `boolean`; default `undefined`; optional)
- `showClose`: Whether show the close button in the header of the dialog. (type `boolean`; default `true`; optional)
- `showFullscreen`: Whether show the fullscreen toggle button in the header of the dialog. (type `boolean`; default `true`; optional)
- `showCancel`: Whether to show the cancel button. When set to `onlyWarning`, the cancel button will only be shown when the dialog is an alert dialog with `alertType="warning"`. When set to `true`, the cancel button will always be shown. (type `boolean | 'onlyWarning'`; default `'onlyWarning'`; optional)
- `cancelText`: The text of the cancel button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `cancel` slot is not provided. Defaults to the localized `dialog.cancel` message from `ConfigProvider`. (type `string`; optional)
- `showConfirm`: Whether to show the confirm button when the dialog is an alert dialog. The default value is `true` when the dialog is an alert dialog. (type `boolean`; optional)
- `confirmText`: The text of the confirm button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `confirm` slot is not provided. Defaults to the localized `dialog.confirm` message from `ConfigProvider`. (type `string`; optional)
- `overlayProps`: Properties forwarded to the overlay element. (type `DrawerOverlayProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `DialogTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `DialogDescriptionProps`; optional)
- `fullscreenProps`: Properties forwarded to the fullscreen element. (type `DialogFullscreenProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `DialogCancelProps`; optional)
- `confirmProps`: Properties forwarded to the confirm element. (type `DialogConfirmProps`; optional)
- `isAlert`: Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response. When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes. (type `boolean`; default `false`; optional)
- `alertType`: The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog. (type `DialogAlertType`; optional)
- `defaultFullscreen`: The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state. (type `boolean`; default `false`; optional)
- `modal`: Modality tier. `true` blocks outside pointer events, `'trap-focus'` only traps focus, `false` keeps the surface non-modal. (type `import("../../types").ModalityTier`; default `true`; optional)
- `snapPoint`: The controlled snap point. Can be bound with `v-model:snapPoint`. (type `DrawerSnapPoint | null`; optional)
- `defaultSnapPoint`: The snap point used when the drawer is initially rendered. Use when you do not need to control it. Defaults to the first entry of `snapPoints`. (type `DrawerSnapPoint | null`; optional)
- `snapToSequentialPoints`: When `true`, snaps to the next sequential snap point (one step at a time). When `false`, snaps to the nearest snap point by distance. (type `boolean`; default `false`; optional)
- `closeThreshold`: Close threshold as a fraction of the drawer size (0–1). (type `number`; default `0.25`; optional)
- `swipeDirection`: The swipe direction that dismisses the drawer. Defaults to the direction opposite the drawer's entry edge (`side`). (type `SwipeDirection`; optional)
- `fixed`: Whether fixed. (type `boolean`; optional)
- `dismissible`: Whether dismissible. (type `boolean`; default `true`; optional)
- `nested`: Whether nested. (type `boolean`; default `false`; optional)
- `side`: Direction. (type `Side`; default `'bottom'`; optional)
- `noBodyStyles`: When `true` the `body` doesn't get any styles assigned from the drawer (type `boolean`; optional)
- `handleOnly`: Whether handle only. (type `boolean`; default `false`; optional)
- `preventScrollRestoration`: Whether prevent scroll restoration. (type `boolean`; optional)
- `snapPoints`: Snap points used to position the drawer. Use numbers between 0 and 1 to represent fractions of the viewport height, numbers greater than 1 as pixel values, or strings in `px`/`rem` units. (type `DrawerSnapPoint[]`; optional)
- `handleProps`: Properties forwarded to the handle element. (type `DrawerHandleProps`; optional)
- `swipeable`: Render the opt-in swipe-to-open area at the drawer's edge. (type `boolean`; default `false`; optional)
- `swipeAreaProps`: Properties forwarded to the swipe area element. (type `DrawerSwipeAreaProps`; optional)

#### Emits

Events for the DrawerCompact component.

- `cancel`: Event handler called when the dialog is requested to be canceled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `click`: Event handler called when the dialog trigger is activated. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `fullscreen`: Event handler called when the fullscreen state of the dialog is requested to be toggled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `confirm`: Event handler called when the dialog is requested to be closed by confirming. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `update:fullscreen`: Event handler called when the fullscreen state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `drag`: Emitted while dragging with the live progress: 0 fully open, 1 closed. (type `[percentageDragged: number]`; parameters `percentageDragged: number`)
- `release`: Emitted when a drag gesture releases; `true` when the drawer stays open. (type `[open: boolean]`; parameters `open: boolean`)
- `close`: Emitted when close occurs. (type `[]`)
- `update:snapPoint`: Emitted when the snap point value changes. (type `[val: DrawerSnapPoint | null]`; parameters `val: DrawerSnapPoint | null`)

#### Slots

Slots for the DrawerCompact component.

- `default`: Custom content for the default slot. (type `(props: DialogCompactBaseSlotProps) => any`; parameters `props: DialogCompactBaseSlotProps`)
- `trigger`: Custom content for the trigger slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `fullscreen`: Custom content for the fullscreen slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `cancel`: Custom content for the cancel slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `confirm`: Custom content for the confirm slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)

### DrawerConfirm

#### Props

Properties for the DrawerConfirm component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DrawerConfirm component.

- `confirm`: Event handler called when the dialog is requested to be closed by confirming. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DrawerContent

- No documented props, emits, slots, or slot props were available.

### DrawerDescription

- No documented props, emits, slots, or slot props were available.

### DrawerFooter

- No documented props, emits, slots, or slot props were available.

### DrawerHandle

#### Props

Properties for the DrawerHandle component.

- `preventCycle`: Whether prevent cycle. (type `boolean`; optional)

### DrawerHeader

- No documented props, emits, slots, or slot props were available.

### DrawerIndent

- No documented props, emits, slots, or slot props were available.

### DrawerIndentBackground

- No documented props, emits, slots, or slot props were available.

### DrawerOverlay

- No documented props, emits, slots, or slot props were available.

### DrawerPopup

- No documented props, emits, slots, or slot props were available.

### DrawerPortal

- No documented props, emits, slots, or slot props were available.

### DrawerRoot

#### Props

Properties for the DrawerRoot component.

- `open`: The controlled open state of the dialog. Can be bound with `v-model:open`. (type `boolean`; default `undefined`; optional)
- `defaultOpen`: The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; default `false`; optional)
- `dir`: The text direction of the dialog (type `Direction`; optional)
- `draggable`: Whether the dialog can be moved by dragging its header. (type `boolean`; default `false`; optional)
- `fullscreen`: The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`. (type `boolean`; default `undefined`; optional)
- `isAlert`: Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response. When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes. (type `boolean`; default `false`; optional)
- `alertType`: The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog. (type `DialogAlertType`; optional)
- `defaultFullscreen`: The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state. (type `boolean`; default `false`; optional)
- `modal`: Modality tier. `true` blocks outside pointer events, `'trap-focus'` only traps focus, `false` keeps the surface non-modal. (type `import("../../types").ModalityTier`; default `true`; optional)
- `snapPoint`: The controlled snap point. Can be bound with `v-model:snapPoint`. (type `DrawerSnapPoint | null`; optional)
- `defaultSnapPoint`: The snap point used when the drawer is initially rendered. Use when you do not need to control it. Defaults to the first entry of `snapPoints`. (type `DrawerSnapPoint | null`; optional)
- `snapToSequentialPoints`: When `true`, snaps to the next sequential snap point (one step at a time). When `false`, snaps to the nearest snap point by distance. (type `boolean`; default `false`; optional)
- `closeThreshold`: Close threshold as a fraction of the drawer size (0–1). (type `number`; default `0.25`; optional)
- `swipeDirection`: The swipe direction that dismisses the drawer. Defaults to the direction opposite the drawer's entry edge (`side`). (type `SwipeDirection`; optional)
- `fixed`: Whether fixed. (type `boolean`; optional)
- `dismissible`: Whether dismissible. (type `boolean`; default `true`; optional)
- `nested`: Whether nested. (type `boolean`; default `false`; optional)
- `side`: Direction. (type `Side`; default `'bottom'`; optional)
- `noBodyStyles`: When `true` the `body` doesn't get any styles assigned from the drawer (type `boolean`; optional)
- `handleOnly`: Whether handle only. (type `boolean`; default `false`; optional)
- `preventScrollRestoration`: Whether prevent scroll restoration. (type `boolean`; optional)
- `snapPoints`: Snap points used to position the drawer. Use numbers between 0 and 1 to represent fractions of the viewport height, numbers greater than 1 as pixel values, or strings in `px`/`rem` units. (type `DrawerSnapPoint[]`; optional)

#### Emits

Events for the DrawerRoot component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `update:fullscreen`: Event handler called when the fullscreen state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `drag`: Emitted while dragging with the live progress: 0 fully open, 1 closed. (type `[percentageDragged: number]`; parameters `percentageDragged: number`)
- `release`: Emitted when a drag gesture releases; `true` when the drawer stays open. (type `[open: boolean]`; parameters `open: boolean`)
- `close`: Emitted when close occurs. (type `[]`)
- `update:snapPoint`: Emitted when the snap point value changes. (type `[val: DrawerSnapPoint | null]`; parameters `val: DrawerSnapPoint | null`)

#### Slots

Slots for the DrawerRoot component.

- `default`: Custom content for the default slot. (type `((props: { open: boolean; close: () => void; }) => any) | undefined`)

### DrawerRootNested

- No documented props, emits, slots, or slot props were available.

### DrawerSwipeArea

#### Props

Properties for the DrawerSwipeArea component.

- `swipeDirection`: Override the swipe side that opens the drawer. Defaults to the opposite of the root swipe direction. (type `SwipeDirection`; optional)
- `disabled`: Disable swipe-to-open. (type `boolean`; default `false`; optional)

### DrawerTitle

- No documented props, emits, slots, or slot props were available.

### DrawerTrigger

#### Props

Properties for the DrawerTrigger component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DrawerTrigger component.

- `click`: Event handler called when the dialog trigger is activated. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### DrawerViewport

- No documented props, emits, slots, or slot props were available.

## Notes

### Architecture and benchmark differences

`DrawerCompact` owns the handle/swipe-area/overlay/popup/header/content/footer composition and the drag/snap state flow (via `useDrawerSnapPoints` and `useSwipeDismiss`), while every primitive stays style-free and only the UI wrapper injects the `drawerVariants` classes. The popup transform is CSS-variable driven — the gesture layer writes variables, never inline transforms — so snap settling, release bounce and dismissal all resolve through CSS transitions. This mirrors the Base UI Drawer model. Ant Design, Element Plus, Mantine and Naive UI ship a single styled drawer; a dedicated draggable panel with `snapPoints` is typically a separate library (vaul, Base UI Drawer). VeanUI exposes per-slot `*Props`, a `size` scale, and the snap/indent/drag/swipe model inline.

| Capability               | VeanUI | shadcn/ui + vaul | reka-ui Drawer | Base UI | Ant Design | Element Plus | Mantine |
| :----------------------- | :----: | :--------------: | :------------: | :-----: | :--------: | :----------: | :-----: |
| Reuses dialog primitives |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| Aria/styled split        |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| Drag-to-dismiss          |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |   ✅    |
| Snap points              |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| Swipe-to-open area       |   ✅   |        —         |       ✅       |   ✅    |     —      |      —       |    —    |
| Page indent effect       |   ✅   |        ✅        |       —        |   ✅    |     —      |      —       |    —    |
| Nested drawers           |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| Modality tiers           |   ✅   |        —         |       ✅       |   ✅    |     —      |      —       |    —    |
| Sizes (6)                |   ✅   |        —         |       —        |    —    |     —      |      —       |    —    |

`—` = unsupported or a different interaction model.

### Cautions

- `modal` defaults to `true`; the panel teleports to `document.body` and body scroll is locked by the hide-others layer. The `'trap-focus'` tier keeps outside pointer events alive but still traps focus.
- `side` picks the anchored edge. Vertical sides (`top`/`bottom`) cap the panel at `calc(100dvh - 2rem)` so a long body scrolls inside the `content` slot instead of growing past the viewport; horizontal sides fill the viewport height and cap their width.
- Drag-to-dismiss uses pointer capture; `dismissible` (default `true`) allows releasing past `closeThreshold` to close. Set `false` to force explicit actions. `swipeDirection` overrides the dismiss direction (defaults to the direction opposite the entry edge).
- Horizontal sides ship **vertical snap only** in this release — `snapPoints` resolves against the vertical axis, so `left`/`right` snap behaviour is not yet supported.
- `snapPoints` accepts fractions (0–1), pixel values (> 1) or CSS length strings; `snapPoint` tracks the current level and is bound with `v-model:snap-point`. The drawer opens at the first snap point and resets to it on close.
- The drag handle is rendered only for `side="bottom"` in `DrawerCompact`; compose `DrawerHandle` manually for other sides.
- `handleOnly` restricts dragging to the handle; `fixed` keeps the panel in place while inner content scrolls.
- `swipeable` renders a gesture strip at the drawer's edge; it is inert while the drawer is open.
- `nested` renders via `DrawerRootNested`; each nested drawer coordinates drag and release with its parent.
- Fullscreen defines the panel's size _and_ freezes its drag, matching how a dialog disables its draggable in fullscreen: a resting snap level below "fully open" would translate the panel back down and leave the half beyond its anchored edge off-screen, and a drag away from the edge would contradict the prop. Snapping and dragging resume when fullscreen is switched off; `snapPoints` stay configured throughout.
- Because the drag is suspended, dismissal in fullscreen falls back to the explicit paths: the close button, Escape, and an outside press on a non-modal drawer. A modal fullscreen drawer with `showClose={false}` and `dismissible={false}` therefore has no way out — keep the close button (or `modal={false}`) if the user must be able to leave it.
- The handle stops cycling snap levels while fullscreen, so it cannot rewrite `snapPoint` behind the scenes.
- The drawer renders **no** fullscreen button of its own, so the dialog's `showFullscreen` has no effect here — drive the state with `v-model:fullscreen`/`defaultFullscreen`, or render your own control inside the panel.
- An uncontrolled fullscreen session does not survive a close: the drawer reopens at `defaultFullscreen` (matching the dialog's reset).

### Migrating from `BottomSheet`

v0.50.0 renamed the whole family — the name `bottom-sheet` is retired.

| Before                                                                                 | After                                                              |
| :------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `SBottomSheet`                                                                         | `SDrawer`                                                          |
| `BottomSheetRoot` / `BottomSheetRootNested`                                            | `DrawerRoot` / `DrawerRootNested`                                  |
| `BottomSheetPopup` / `BottomSheetOverlay`                                              | `DrawerPopup` / `DrawerOverlay`                                    |
| `BottomSheetHandle` / `BottomSheetCompact`                                             | `DrawerHandle` / `DrawerCompact`                                   |
| `BottomSheetTitle` / `BottomSheetDescription`                                          | `DrawerTitle` / `DrawerDescription`                                |
| `BottomSheetHeader` / `BottomSheetContent` / `BottomSheetFooter`                       | `DrawerHeader` / `DrawerContent` / `DrawerFooter`                  |
| `BottomSheetTrigger` / `BottomSheetClose` / `BottomSheetCancel` / `BottomSheetConfirm` | `DrawerTrigger` / `DrawerClose` / `DrawerCancel` / `DrawerConfirm` |
| `v-model:active-snap-point`                                                            | `v-model:snap-point`                                               |
| `direction` prop (Aria)                                                                | `side` prop                                                        |
| `@vean/aria/bottom-sheet`                                                              | `@vean/aria/drawer`                                                |
| `data-vean-bottom-sheet-*`, `soybean-bottom-sheet-dragging`                            | `data-vean-drawer-*`, `soybean-drawer-dragging`                    |
| `data-vean-bottom-sheet-scale`                                                         | removed with the scale-background engine (see below)               |

The old `SDrawer` (a dialog with a side) was renamed to `SSheet`. See [Sheet](/components/sheet) for the side-panel API.

### Migrating from the vaul-style engine

v0.50.0 replaced the vaul-derived engine with a Base UI-style one. The public surface changes:

| Before                                                | After                                                                                     |
| :---------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| `shouldScaleBackground` / `setBackgroundColorOnScale` | removed. Wrap the page in `DrawerIndent` + `DrawerIndentBackground` inside `DrawerRoot`   |
| `fadeFromIndex`                                       | removed; the overlay fades continuously with the swipe progress                           |
| `snapPoint` defaulting to `null`                      | defaults to the first entry of `snapPoints` (the drawer opens positioned at a snap point) |
| implicit drag direction from `side`                   | still the default, overridable with `swipeDirection`                                      |
| imperative transforms                                 | CSS variables (`--vean-drawer-snap-point-offset`, `--vean-drawer-swipe-movement-x/y`)     |

```vue
<div data-vean-drawer-scale>Page</div>

<DrawerIndent class="page-indent">Page</DrawerIndent>
<template #trigger><SButton>Open</SButton></template>
```

```vue
<template #trigger><SButton>Open</SButton></template>
Content

<template #trigger><SButton>Open</SButton></template>
Content
```

### Roadmap

Horizontal snap points, on-device verification of the touch pipeline (iOS Safari / Android Chrome), and iOS virtual keyboard coordination.

## FAQ

### How do I anchor the drawer to a different edge?

Set `side` to `top`/`bottom`/`left`/`right`:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```

### How do I enable snap points?

Pass an array of fractions, pixels or CSS lengths, and bind the active level:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```

### How do I open the drawer with a swipe gesture?

Set `swipeable`. An edge strip is rendered at the panel's `side` and swipes in the opposite direction:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```

### How do I disable drag-to-dismiss?

Set `dismissible={false}` to require an explicit action:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```

### How do I restrict dragging to the handle?

Set `handle-only`:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```

### How do I build a non-modal side panel that still traps focus?

Use the `'trap-focus'` tier:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```

### How do I make the drawer fullscreen?

Bind `v-model:fullscreen`, or let it start fullscreen with `default-fullscreen`. The panel grows to the viewport from its `side` edge and stops responding to drags, so snapping and dragging resume only once you switch fullscreen off:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drawer content</div>
```
