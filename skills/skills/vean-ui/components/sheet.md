# Sheet

Source URL: https://veanui.com/components/sheet
Markdown URL: https://veanui.com/components/sheet.md
Category: Overlay
Description: A panel that slides out from the edge of the screen. It reuses the declarative API and slot contract of SDialog (same Aria DialogCompact base, same modal/focus/dismissable behavior), and adds side to control where the panel enters — top/bottom/left/right (default right).

## Overview

A panel that slides out from the edge of the screen. It reuses the declarative API and slot contract of `SDialog` (same Aria `DialogCompact` base, same modal/focus/dismissable behavior), and adds `side` to control where the panel enters — `top`/`bottom`/`left`/`right` (default `right`).

`SSheet` combines the Aria dialog primitive family with the `sheetVariants` style recipe (extends `dialogVariants`, 6 sizes × 4 sides).

> Looking for a gesture-driven panel with snap points and swipe dismiss? That is [Drawer](/components/drawer) — the sheet is deliberately "a dialog with a side".

## Usage

Usage examples for sheet are rendered on the site.

## Features

- 🧩 Reuses the dialog base — built on `DialogCompact`, inherits `SDialog`'s slots, events, per-part `*Props`, `pure`, `isAlert` and the imperative `dialog(...)` API
- 🧭 4 sides — `side="top"`/`"bottom"`/`"left"`/`"right"` (default `right`); RTL-aware slide direction for left/right
- 🎭 Modal by default — `aria-modal`, `useHideOthers`, outside-pointer blocking and focus trapping, same as `SDialog`
- ❌ Closable — `showClose`, Escape, outside pointer/focus and the close button all dismiss
- 🎞️ Animated — enter/exit transitions (`slide-in-from-*` / `slide-out-to-*`) driven by the open state
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ⛶ Fullscreen — `showFullscreen` renders a toggle; `fullscreen`/`defaultFullscreen` drive a `v-model:fullscreen` state that grows the panel to the viewport
- 🔘 Cancel/confirm footer — `showCancel`/`showConfirm` with localized `cancelText`/`confirmText`
- ♿ Accessible — `role="dialog"`, focus trap + loop, focus restoration on close, `axe-core` zero violations

## Component family

- `SSheet` (styled) — the entry wrapper; `sheetVariants` recipe (`size` + `side`) with dynamic slot forwarding
- All other parts come from the Aria dialog family (see `Dialog`): `DialogRoot`, `DialogTrigger`, `DialogOverlay`, `DialogPopup`, `DialogHeader`, `DialogContent`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogCancel`, `DialogConfirm`, `DialogCompact`

## Demos

Interactive demos for sheet are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): Sheet.

### Sheet

#### Props

Properties for the Sheet component.

- `side`: Side placement of the component. (type `Side`; optional)
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

Events for the Sheet component.

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

Slots for the Sheet component.

- `default`: Custom content for the default slot. (type `(props: DialogCompactBaseSlotProps) => any`; parameters `props: DialogCompactBaseSlotProps`)
- `trigger`: Custom content for the trigger slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `title`: Custom content for the title slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `description`: Custom content for the description slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `close`: Custom content for the close slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `fullscreen`: Custom content for the fullscreen slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `cancel`: Custom content for the cancel slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)
- `confirm`: Custom content for the confirm slot. (type `((props: DialogCompactBaseSlotProps) => any) | undefined`)

## Notes

### Architecture and benchmark differences

`SSheet` is a thin styled wrapper: it forwards every prop/slot/event to the Aria `DialogCompact` and only supplies the `sheetVariants` recipe that extends `dialogVariants` with side-specific `popup` classes. This keeps sheet and dialog behavior identical while varying only presentation — the same headless/styled split as shadcn-ui/vaul-style panels, versus Ant Design's `drawer` (single styled component with `placement`/`width`/`closable`/`mask` props) and Element Plus/Mantine/Naive UI equivalents.

| Capability                | VeanUI | shadcn/ui | Ant Design Drawer | Element Plus Drawer | Mantine Drawer | Naive UI Drawer |
| :------------------------ | :----: | :-------: | :---------------: | :-----------------: | :------------: | :-------------: |
| Reuses dialog base        |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| Aria/styled split         |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| 4 placements (side)       |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| Modal (aria-modal + trap) |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| Focus return on close     |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| Sizes (6)                 |   ✅   |     —     |         —         |          —          |       —        |        —        |
| Pure (no header/footer)   |   ✅   |     —     |         —         |          —          |       —        |        —        |

`—` = unsupported or a different interaction model.

### Cautions

- Sheet inherits the dialog contract: it is modal by default and the popup teleports to `document.body`; Escape/outside interaction dismisses it.
- `side` only changes the slide direction and position classes; the accessible `role` remains `dialog` (a sheet is not a distinct ARIA role).
- Left/right sheets slide in the logical direction and are mirrored under RTL (`dir`).
- In fullscreen the panel covers the viewport from the edge it is anchored to, so `side` only decides which edge that is; the per-side size caps (`w-3/4`/`sm:max-w-sm`, and the `100dvh - 2rem` height cap) are released.
- The imperative `dialog(...)` API also renders sheets if you pass the matching options — no separate sheet service is needed.

### Migrating from `SDrawer` (v0.50.0)

The name `SDrawer` now belongs to the gesture-driven [Drawer](/components/drawer). The side panel keeps its exact behaviour under a new name:

| Before                                        | After                                      |
| :-------------------------------------------- | :----------------------------------------- |
| `SDrawer` (side panel)                        | `SSheet`                                   |
| `@vean/ui` → `SDrawer`                        | `@vean/ui` → `SSheet`                      |
| `drawerVariants`                              | `sheetVariants`                            |
| `DrawerProps` / `DrawerEmits` / `DrawerSlots` | `SheetProps` / `SheetEmits` / `SheetSlots` |

```vue
<SDrawer v-model:open="open" side="left" title="Filters">...</SDrawer>

<SSheet v-model:open="open" side="left" title="Filters">...</SSheet>
```

## FAQ

### How do I slide the sheet from a specific edge?

Set `side` to `top`/`bottom`/`left`/`right`:

```vue
<SSheet v-model:open="open" side="left" title="Filters">...</SSheet>
```

### How do I control the open state?

Bind `open` with `v-model`, or use `defaultOpen` for an uncontrolled sheet:

```vue
<SSheet v-model:open="open" title="Settings">...</SSheet>
```

### How do I add cancel/confirm actions?

Use the `footer` slot, or rely on `showCancel`/`showConfirm` with localized text:

```vue
<template #trigger><SButton>Open</SButton></template>
```

### How do I build a custom sheet?

Use `pure` and fill the default slot:

```vue
<div class="custom">...</div>
```

### How do I make the sheet fullscreen?

Render the header toggle with `show-fullscreen`, or drive the state with `v-model:fullscreen`. Either way the panel grows to the viewport from its `side` edge:

```vue
<template #trigger><SButton>Open</SButton></template>
```
