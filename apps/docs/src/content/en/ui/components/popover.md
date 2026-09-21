---
head:
  title: Popover
  description: 'Displays rich content in a portal, triggered by a button. SPopover combines the Aria PopoverRoot/PopoverTrigger/PopoverPositioner/PopoverPopup/PopoverArrow/PopoverClose primitive family (built on the shared Popper + dialog-style dismissable/focus layers) with the popoverVariants style recipe (5 slots, 6 sizes).'
---

# Popover

## Overview

Displays rich content in a portal, triggered by a button. `SPopover` combines the Aria `PopoverRoot`/`PopoverTrigger`/`PopoverPositioner`/`PopoverPopup`/`PopoverArrow`/`PopoverClose` primitive family (built on the shared `Popper` + dialog-style dismissable/focus layers) with the `popoverVariants` style recipe (5 slots, 6 sizes).

Use a popover for contextual, non-critical rich content (menus of actions, settings, help). For navigation menus use `dropdown-menu`; for a small hover hint use `tooltip`; for a blocking confirmation use `popconfirm` or `dialog`.

## Usage

<UsageCode component="popover" />

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

<PlaygroundGallery component="popover" />

## API

<ComponentApi component="popover" />

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
<SPopover placement="top">
  <template #trigger><SButton>Info</SButton></template>
</SPopover>
```

### How do I add a close button?

Provide the `close` slot:

```vue
<SPopover>
  <template #trigger><SButton>More</SButton></template>
  <template #close>Dismiss</template>
</SPopover>
```

### How do I make a non-blocking popover?

Set `modal={false}`:

```vue
<SPopover :modal="false">
  <template #trigger><SButton>Open</SButton></template>
</SPopover>
```

### How do I control the open state?

Bind `open` with `v-model` or use `defaultOpen`:

```vue
<SPopover v-model:open="open">
  <template #trigger><SButton>Open</SButton></template>
</SPopover>
```
