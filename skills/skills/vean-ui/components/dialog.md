# Dialog

Source URL: https://veanui.com/components/dialog
Markdown URL: https://veanui.com/components/dialog.md
Category: Overlay
Description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

## Overview

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

`SDialog` is the declarative wrapper for inline usage. `dialog(...)` is the imperative API for creating alert-style dialogs programmatically. It combines the `DialogRoot`/`DialogTrigger`/`DialogOverlay`/`DialogPopup`/`DialogHeader`/`DialogContent`/`DialogFooter`/`DialogTitle`/`DialogDescription`/`DialogClose`/`DialogFullscreen`/`DialogCancel`/`DialogConfirm` Aria primitive family (zero styles) with the `dialogVariants` style recipe (12 slots, 6 sizes).

Mount `SDialogProvider` once near your app root before calling the imperative `dialog(...)` API.

## Usage

### Declarative

Usage examples for dialog are rendered on the site.

### Imperative API

```vue
<script setup lang="ts">
import { h } from 'vue';
import { SButton, SDialogProvider, dialog } from '@vean/ui';

function openWarningDialog() {
  dialog.warning('Delete Project', {
    description: 'This action cannot be undone.',
    content: h('div', 'Please confirm before continuing.'),
    confirmText: 'Delete'
  });
}
</script>

<template>
  <SDialogProvider />

  <SButton color="warning" @click="openWarningDialog">Open Dialog</SButton>
</template>
```

## Features

- 🧩 Aria/styled split — `DialogCompact` aggregates the primitives and composes the overlay/popup/header/content/footer; `SDialog` only injects styles and forwards slots/events
- 🖱️ Declarative + imperative — inline `SDialog` with a trigger, or `dialog.*` API driven by `SDialogProvider`
- 🎭 Modal by default — `modal` renders `aria-modal`, `useHideOthers`, outside-pointer blocking and focus trapping; toggle with `modal={false}`
- ⚠️ Alert mode — `isAlert` switches to `role="alertdialog"`, adds the type icon and `aria-live` (`polite`/`assertive`)
- 🏷️ Accessible title/description — `title`/`description` wire `aria-labelledby`/`aria-describedby`
- ❌ Closable — `showClose` renders a close control; Escape, outside pointer/focus and the close button all dismiss
- 🖐️ Draggable — `draggable` lets you move the dialog by dragging its header (powered by `useDraggable` from `@vueuse/core`)
- ⛶ Fullscreen — `showFullscreen` renders a toggle; `fullscreen`/`defaultFullscreen` drive a `v-model:fullscreen` state
- 🔘 Cancel/confirm — `showCancel`/`showConfirm` with localized `cancelText`/`confirmText` from `dialog.cancel`/`dialog.confirm`
- 🧹 Pure mode — `pure` drops the header/footer for fully custom content
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — real `role="dialog"`, focus trap + loop, focus restoration on close, `axe-core` zero violations

## Component family

- `SDialog` (styled) — the entry wrapper; `dialogVariants` recipe with dynamic slot forwarding
- `SDialogProvider` (styled) — hosts the imperative `dialog(...)` API; subscribes to `DialogState`
- `DialogRoot` (Aria) — the state owner; `open` via `useControllableState`, `dir`/`modal`, `provideDialogRootContext`
- `DialogTrigger` (Aria) — a `Button` that opens the dialog
- `DialogOverlay` (Aria) — the dimmed backdrop
- `DialogPopup` / `DialogPopupImpl` (Aria) — the focus-trapped, dismissable surface hosting the dialog body
- `DialogTitle` / `DialogDescription` (Aria) — the labelled/described elements
- `DialogClose` (Aria) — the close control, toggles `open` and emits `close`
- `DialogFullscreen` (Aria) — the fullscreen toggle, toggles the `fullscreen` state and emits `fullscreen`
- `DialogCancel` / `DialogConfirm` (Aria) — footer actions, emit `cancel`/`confirm`
- `DialogHeader` / `DialogContent` / `DialogFooter` (Aria) — layout sections
- `DialogCompact` (Aria) — the aggregated composite; composes all primitives and exposes the per-part slots

## Demos

Interactive demos for dialog are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (19): Dialog, DialogCancel, DialogClose, DialogCompact, DialogCompactBase, DialogConfirm, DialogContent, DialogDescription, DialogFooter, DialogFullscreen, DialogFullscreenState, DialogHeader, DialogOverlay, DialogPopup, DialogPortal, DialogProvider, DialogRoot, DialogTitle, DialogTrigger.

### Dialog

#### Props

Properties for the Dialog component.

- `showFullscreen`: Whether show the fullscreen toggle button in the header of the dialog. (type `boolean`; default `false`; optional)
- `class`: the popup class of the dialog (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<DialogUi>`; optional)
- `title`: The title of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `title` slot is not provided. (type `string`; optional)
- `description`: The description of the dialog. This is used for accessibility purposes and will be rendered in the content of the dialog if the `description` slot is not provided. (type `string`; optional)
- `icon`: The icon of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `icon` slot is not provided. (type `string | import("vue").Component | VNode<import("vue").RendererNode, import("vue").RendererElement, { [key: string]: ...`; optional)
- `showClose`: Whether show the close button in the header of the dialog. (type `boolean`; default `true`; optional)
- `pure`: Whether to use the pure version of the dialog, which does not include the header and footer. This is useful when you want to fully control the content of the dialog and do not need the built-in header and footer. (type `boolean`; default `false`; optional)
- `showCancel`: Whether to show the cancel button. When set to `onlyWarning`, the cancel button will only be shown when the dialog is an alert dialog with `alertType="warning"`. When set to `true`, the cancel button will always be shown. (type `boolean | 'onlyWarning'`; default `'onlyWarning'`; optional)
- `cancelText`: The text of the cancel button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `cancel` slot is not provided. Defaults to the localized `dialog.cancel` message from `ConfigProvider`. (type `string`; optional)
- `showConfirm`: Whether to show the confirm button when the dialog is an alert dialog. The default value is `true` when the dialog is an alert dialog. (type `boolean`; optional)
- `confirmText`: The text of the confirm button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `confirm` slot is not provided. Defaults to the localized `dialog.confirm` message from `ConfigProvider`. (type `string`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `DialogTriggerProps`; optional)
- `overlayProps`: Properties forwarded to the overlay element. (type `DialogOverlayProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `DialogPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `DialogPopupProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `DialogHeaderProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `DialogContentProps`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `DialogFooterProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `DialogTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `DialogDescriptionProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `DialogCloseProps`; optional)
- `fullscreenProps`: Properties forwarded to the fullscreen element. (type `DialogFullscreenProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `DialogCancelProps`; optional)
- `confirmProps`: Properties forwarded to the confirm element. (type `DialogConfirmProps`; optional)
- `modal`: The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers. Set to `'trap-focus'` to trap focus while still letting outside pointer events through (non-modal side panels such as `Drawer` in the `'trap-focus'` tier). (type `ModalityTier`; default `true`; optional)
- `dir`: The text direction of the dialog (type `Direction`; optional)
- `isAlert`: Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response. When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes. (type `boolean`; default `false`; optional)
- `alertType`: The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog. (type `DialogAlertType`; optional)
- `draggable`: Whether the dialog can be moved by dragging its header. (type `boolean`; default `false`; optional)
- `fullscreen`: The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`. (type `boolean`; default `undefined`; optional)
- `defaultFullscreen`: The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state. (type `boolean`; default `false`; optional)
- `open`: The controlled open state of the dialog. Can be bound with `v-model:open`. (type `boolean`; default `undefined`; optional)
- `defaultOpen`: The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; default `false`; optional)

#### Emits

Events for the Dialog component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `update:fullscreen`: Event handler called when the fullscreen state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `click`: Event handler called when the dialog trigger is activated. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `close`: Event handler called when the dialog is requested to be closed. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `fullscreen`: Event handler called when the fullscreen state of the dialog is requested to be toggled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `confirm`: Event handler called when the dialog is requested to be closed by confirming. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `cancel`: Event handler called when the dialog is requested to be canceled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

#### Slots

Slots for the Dialog component.

- `default`: Custom content for the default slot. (type `(props: DialogCompactBaseSlotProps) => any`; parameters `props: DialogCompactBaseSlotProps`)
- `trigger`: Custom content for the trigger slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `fullscreen`: Custom content for the fullscreen slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `cancel`: Custom content for the cancel slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `confirm`: Custom content for the confirm slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)

### DialogCancel

#### Props

Properties for the DialogCancel component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DialogCancel component.

- `cancel`: Event handler called when the dialog is requested to be canceled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DialogClose

#### Props

Properties for the DialogClose component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DialogClose component.

- `close`: Event handler called when the dialog is requested to be closed. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DialogCompact

#### Props

Properties for the DialogCompact component.

- `title`: The title of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `title` slot is not provided. (type `string`; optional)
- `description`: The description of the dialog. This is used for accessibility purposes and will be rendered in the content of the dialog if the `description` slot is not provided. (type `string`; optional)
- `icon`: The icon of the dialog. This is used for accessibility purposes and will be rendered in the header of the dialog if the `icon` slot is not provided. (type `string | import("vue").Component | VNode<import("vue").RendererNode, import("vue").RendererElement, { [key: string]: ...`; optional)
- `showClose`: Whether show the close button in the header of the dialog. (type `boolean`; default `true`; optional)
- `showFullscreen`: Whether show the fullscreen toggle button in the header of the dialog. (type `boolean`; default `true`; optional)
- `pure`: Whether to use the pure version of the dialog, which does not include the header and footer. This is useful when you want to fully control the content of the dialog and do not need the built-in header and footer. (type `boolean`; default `false`; optional)
- `showCancel`: Whether to show the cancel button. When set to `onlyWarning`, the cancel button will only be shown when the dialog is an alert dialog with `alertType="warning"`. When set to `true`, the cancel button will always be shown. (type `boolean | 'onlyWarning'`; default `'onlyWarning'`; optional)
- `cancelText`: The text of the cancel button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `cancel` slot is not provided. Defaults to the localized `dialog.cancel` message from `ConfigProvider`. (type `string`; optional)
- `showConfirm`: Whether to show the confirm button when the dialog is an alert dialog. The default value is `true` when the dialog is an alert dialog. (type `boolean`; optional)
- `confirmText`: The text of the confirm button. This is used for accessibility purposes and will be rendered in the footer of the dialog if the `confirm` slot is not provided. Defaults to the localized `dialog.confirm` message from `ConfigProvider`. (type `string`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `DialogTriggerProps`; optional)
- `overlayProps`: Properties forwarded to the overlay element. (type `DialogOverlayProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `DialogPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `DialogPopupProps`; optional)
- `headerProps`: Properties forwarded to the header element. (type `DialogHeaderProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `DialogContentProps`; optional)
- `footerProps`: Properties forwarded to the footer element. (type `DialogFooterProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `DialogTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `DialogDescriptionProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `DialogCloseProps`; optional)
- `fullscreenProps`: Properties forwarded to the fullscreen element. (type `DialogFullscreenProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `DialogCancelProps`; optional)
- `confirmProps`: Properties forwarded to the confirm element. (type `DialogConfirmProps`; optional)
- `modal`: The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers. Set to `'trap-focus'` to trap focus while still letting outside pointer events through (non-modal side panels such as `Drawer` in the `'trap-focus'` tier). (type `ModalityTier`; default `true`; optional)
- `dir`: The text direction of the dialog (type `Direction`; optional)
- `isAlert`: Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response. When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes. (type `boolean`; default `false`; optional)
- `alertType`: The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog. (type `DialogAlertType`; optional)
- `draggable`: Whether the dialog can be moved by dragging its header. (type `boolean`; default `false`; optional)
- `fullscreen`: The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`. (type `boolean`; default `undefined`; optional)
- `defaultFullscreen`: The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state. (type `boolean`; default `false`; optional)
- `open`: The controlled open state of the dialog. Can be bound with `v-model:open`. (type `boolean`; default `undefined`; optional)
- `defaultOpen`: The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; default `false`; optional)

#### Emits

Events for the DialogCompact component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `update:fullscreen`: Event handler called when the fullscreen state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `click`: Event handler called when the dialog trigger is activated. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `close`: Event handler called when the dialog is requested to be closed. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `fullscreen`: Event handler called when the fullscreen state of the dialog is requested to be toggled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `confirm`: Event handler called when the dialog is requested to be closed by confirming. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)
- `cancel`: Event handler called when the dialog is requested to be canceled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

#### Slots

Slots for the DialogCompact component.

- `default`: Custom content for the default slot. (type `(props: DialogCompactBaseSlotProps) => any`; parameters `props: DialogCompactBaseSlotProps`)
- `trigger`: Custom content for the trigger slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `fullscreen`: Custom content for the fullscreen slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `cancel`: Custom content for the cancel slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `confirm`: Custom content for the confirm slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)

### DialogCompactBase

#### Slot Props

Slot properties for the DialogCompactBase component.

- `open`: Whether the component is open. (type `boolean`; required)
- `close`: Close exposed in the slot scope. (type `() => void`; required)

### DialogConfirm

#### Props

Properties for the DialogConfirm component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DialogConfirm component.

- `confirm`: Event handler called when the dialog is requested to be closed by confirming. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DialogContent

- No documented props, emits, slots, or slot props were available.

### DialogDescription

- No documented props, emits, slots, or slot props were available.

### DialogFooter

- No documented props, emits, slots, or slot props were available.

### DialogFullscreen

#### Props

Properties for the DialogFullscreen component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DialogFullscreen component.

- `fullscreen`: Event handler called when the fullscreen state of the dialog is requested to be toggled. (type `[event: MouseEvent]`; parameters `event: MouseEvent`)

### DialogFullscreenState

#### Emits

Events for the fullscreen state of the dialog. Kept separate from `DialogRootEmits`
because the latter is shared by other disclosure primitives (popover, menu, drawer).

- `update:fullscreen`: Event handler called when the fullscreen state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)

### DialogHeader

- No documented props, emits, slots, or slot props were available.

### DialogOverlay

#### Props

Properties for the DialogOverlay component.

- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

### DialogPopup

#### Props

Properties for the DialogPopup component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

#### Emits

Events for the DialogPopup component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)

### DialogPortal

- No documented props, emits, slots, or slot props were available.

### DialogProvider

- No documented props, emits, slots, or slot props were available.

### DialogRoot

#### Props

Properties for the DialogRoot component.

- `modal`: The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers. Set to `'trap-focus'` to trap focus while still letting outside pointer events through (non-modal side panels such as `Drawer` in the `'trap-focus'` tier). (type `ModalityTier`; default `true`; optional)
- `dir`: The text direction of the dialog (type `Direction`; optional)
- `isAlert`: Whether the dialog is an alert dialog. An alert dialog is a dialog that interrupts the user's workflow to communicate an important message and requires a response. When set to `true`, the dialog will have `role="alertdialog"` and will require a `DialogTitle` to be provided. This is used for accessibility purposes. (type `boolean`; default `false`; optional)
- `alertType`: The alert type of the dialog, which determines the default icon and styles when the dialog is an alert dialog. (type `DialogAlertType`; optional)
- `draggable`: Whether the dialog can be moved by dragging its header. (type `boolean`; default `false`; optional)
- `fullscreen`: The controlled fullscreen state of the dialog. Can be bound with `v-model:fullscreen`. (type `boolean`; default `undefined`; optional)
- `defaultFullscreen`: The fullscreen state of the dialog when it is initially rendered. Use when you do not need to control its fullscreen state. (type `boolean`; default `false`; optional)
- `open`: The controlled open state of the dialog. Can be bound with `v-model:open`. (type `boolean`; default `undefined`; optional)
- `defaultOpen`: The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; default `false`; optional)

#### Emits

Events for the DialogRoot component.

- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)

### DialogTitle

- No documented props, emits, slots, or slot props were available.

### DialogTrigger

#### Props

Properties for the DialogTrigger component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the DialogTrigger component.

- `click`: Event handler called when the dialog trigger is activated. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

## Notes

### Architecture and benchmark differences

`DialogCompact` owns the overlay/popup/header/content/footer composition and the imperative `dialog(...)` state flow while every primitive stays style-free and only the UI wrapper injects the `dialogVariants` classes. This mirrors radix-ui/shadcn-ui's headless/styled split. Ant Design, Element Plus, Mantine and Naive UI ship a single styled dialog with `mask`/`closable`/`keyboard`/`width` props; VeanUI additionally exposes a per-slot `*Props` channel, a `size` scale, and an imperative provider API (`dialog.*`) that the single-package libraries fold into a static service.

| Capability                    | VeanUI | shadcn/ui | Ant Design Modal | Element Plus Dialog | Mantine Modal | Naive UI Dialog |
| :---------------------------- | :----: | :-------: | :--------------: | :-----------------: | :-----------: | :-------------: |
| Aria/styled split             |   ✅   |    ✅     |        —         |          —          |       —       |        —        |
| Imperative API                |   ✅   |     —     |        ✅        |         ✅          |      ✅       |       ✅        |
| Modal (aria-modal + trap)     |   ✅   |    ✅     |        ✅        |         ✅          |      ✅       |       ✅        |
| Alert mode (alertdialog)      |   ✅   |    ✅     |        ✅        |          —          |       —       |       ✅        |
| Focus return on close         |   ✅   |    ✅     |        ✅        |         ✅          |      ✅       |       ✅        |
| Sizes (6)                     |   ✅   |     —     |        —         |          —          |       —       |        —        |
| Localized cancel/confirm text |   ✅   |     —     |        —         |          —          |       —       |        —        |
| Pure (no header/footer)       |   ✅   |     —     |        —         |          —          |       —       |        —        |

`—` = unsupported or a different interaction model.

### Cautions

- `DialogCompact` defaults to `modal` (`true`); the portal teleports the popup to `document.body` and the body scroll is managed by the hide-others layer.
- `showConfirm` defaults to `true` when the dialog is an alert; `showCancel` defaults to `'onlyWarning'` (cancel appears only for `alertType="warning"`). Pass an explicit boolean to override.
- `cancelText`/`confirmText` default to the localized `dialog.cancel`/`dialog.confirm` messages; override per instance.
- `isAlert` requires a `DialogTitle` for accessibility (`role="alertdialog"` must be labelled). Set `title` or the `title` slot.
- `pure` removes the header and footer, so `title`/`description` are no longer rendered — provide your own accessible label in that mode.
- The imperative `dialog(...)` API needs `SDialogProvider` mounted; calling it without the provider is a no-op.

## FAQ

### How do I control the open state?

Bind `open` with `v-model`, or pass `defaultOpen` for an uncontrolled dialog:

```vue
<SDialog v-model:open="open" title="Preferences">...</SDialog>
```

### How do I show an alert-style dialog?

Set `is-alert` with an `alert-type`. The popup gets `role="alertdialog"` and the matching type icon:

```vue
<template #trigger><SButton>Delete</SButton></template>
```

### How do I use the imperative API?

Mount `SDialogProvider` once, then call `dialog.*` from anywhere (see the Overview section for a full example):

```ts
import { dialog } from '@vean/ui';
dialog.warning('Disk full', { description: 'Free up space.' });
```

### How do I build a fully custom dialog?

Use `pure` and fill the default slot:

```vue
<div class="custom">...</div>
```

### How do I make a non-modal dialog?

Set `modal={false}` to allow interacting with content outside the dialog:

```vue
<SDialog v-model:open="open" :modal="false" title="Palette">...</SDialog>
```

### How do I make a draggable dialog?

Set `draggable` and drag the header to move the dialog. The position is kept until the dialog is closed:

```vue
<template #trigger><SButton>Open</SButton></template>
<div>Drag the header to move this dialog.</div>
```

### How do I use the fullscreen mode?

Toggle it with the header button (`showFullscreen`, hidden by default — pass `show-fullscreen` to opt in) or drive it with `v-model:fullscreen`:

```vue
<SDialog v-model:fullscreen="fullscreen" title="Panel">...</SDialog>
```
