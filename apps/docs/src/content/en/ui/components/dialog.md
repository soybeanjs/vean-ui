---
head:
  title: Dialog
  description: 'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.'
---

# Dialog

## Overview

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

`SDialog` is the declarative wrapper for inline usage. `dialog(...)` is the imperative API for creating alert-style dialogs programmatically. It combines the `DialogRoot`/`DialogTrigger`/`DialogOverlay`/`DialogPopup`/`DialogHeader`/`DialogContent`/`DialogFooter`/`DialogTitle`/`DialogDescription`/`DialogClose`/`DialogFullscreen`/`DialogCancel`/`DialogConfirm` Aria primitive family (zero styles) with the `dialogVariants` style recipe (12 slots, 6 sizes).

Mount `SDialogProvider` once near your app root before calling the imperative `dialog(...)` API.

## Usage

### Declarative

<UsageCode component="dialog" />

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

<PlaygroundGallery component="dialog" />

## API

<ComponentApi component="dialog" />

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
<SDialog is-alert alert-type="warning" title="Delete" description="This cannot be undone.">
  <template #trigger><SButton>Delete</SButton></template>
</SDialog>
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
<SDialog v-model:open="open" pure>
  <div class="custom">...</div>
</SDialog>
```

### How do I make a non-modal dialog?

Set `modal={false}` to allow interacting with content outside the dialog:

```vue
<SDialog v-model:open="open" :modal="false" title="Palette">...</SDialog>
```

### How do I make a draggable dialog?

Set `draggable` and drag the header to move the dialog. The position is kept until the dialog is closed:

```vue
<SDialog draggable title="Panel">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drag the header to move this dialog.</div>
</SDialog>
```

### How do I use the fullscreen mode?

Toggle it with the header button (`showFullscreen`, hidden by default — pass `show-fullscreen` to opt in) or drive it with `v-model:fullscreen`:

```vue
<SDialog v-model:fullscreen="fullscreen" title="Panel">...</SDialog>
```
