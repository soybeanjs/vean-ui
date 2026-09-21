---
head:
  title: Popconfirm
  description: 'A confirmation box component based on Popper, used for lightweight secondary confirmation operations. SPopconfirm combines the Aria PopconfirmCompact (built on the popper primitives) with the popconfirmVariants style recipe (13 slots, 6 sizes × 4 types).'
---

# Popconfirm

## Overview

A confirmation box component based on `Popper`, used for lightweight secondary confirmation operations. `SPopconfirm` combines the Aria `PopconfirmCompact` (built on the popper primitives) with the `popconfirmVariants` style recipe (13 slots, 6 sizes × 4 types).

Use it for a quick inline confirm (delete, destructive action) next to the trigger. For a richer blocking confirmation use `dialog`; for an unobtrusive hint use `tooltip`.

## Usage

<UsageCode component="popconfirm" />

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

<PlaygroundGallery component="popconfirm" />

## API

<ComponentApi component="popconfirm" />

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
<SPopconfirm
  title="Delete item?"
  description="This action cannot be undone."
  content="Please confirm before continuing."
>
  <template #trigger><SButton danger>Delete</SButton></template>
</SPopconfirm>
```

### How do I set the type and icon?

Use `type` (`error`/`success`/`warning`/`info`) and toggle `show-icon`:

```vue
<SPopconfirm type="warning" title="Heads up">
  <template #trigger><SButton>Delete</SButton></template>
</SPopconfirm>
```

### How do I customize the action labels?

Set `confirm-text`/`cancel-text`, and control the cancel button with `show-cancel`:

```vue
<SPopconfirm confirm-text="Delete" cancel-text="Keep" :show-cancel="true" title="Confirm">
  <template #trigger><SButton>Delete</SButton></template>
</SPopconfirm>
```

### How do I control the open state?

Bind `open` with `v-model` or use `defaultOpen`:

```vue
<SPopconfirm v-model:open="open" title="Confirm">
  <template #trigger><SButton>Delete</SButton></template>
</SPopconfirm>
```

### How do I disable the trigger?

Set `disabled` to block opening:

```vue
<SPopconfirm disabled title="Confirm">
  <template #trigger><SButton>Delete</SButton></template>
</SPopconfirm>
```
