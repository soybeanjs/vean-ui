---
head:
  title: Sheet
  description: 'A panel that slides out from the edge of the screen. It reuses the declarative API and slot contract of SDialog (same Aria DialogCompact base, same modal/focus/dismissable behavior), and adds side to control where the panel enters — top/bottom/left/right (default right).'
---

# Sheet

## Overview

A panel that slides out from the edge of the screen. It reuses the declarative API and slot contract of `SDialog` (same Aria `DialogCompact` base, same modal/focus/dismissable behavior), and adds `side` to control where the panel enters — `top`/`bottom`/`left`/`right` (default `right`).

`SSheet` combines the Aria dialog primitive family with the `sheetVariants` style recipe (extends `dialogVariants`, 6 sizes × 4 sides).

> Looking for a gesture-driven panel with snap points and swipe dismiss? That is [Drawer](/components/drawer) — the sheet is deliberately "a dialog with a side".

## Usage

<UsageCode component="sheet" />

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

<PlaygroundGallery component="sheet" />

## API

<ComponentApi component="sheet" />

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
<!-- Before -->
<SDrawer v-model:open="open" side="left" title="Filters">...</SDrawer>

<!-- After -->
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
<SSheet v-model:open="open" show-confirm confirm-text="Apply" title="Preferences">
  <template #trigger><SButton>Open</SButton></template>
</SSheet>
```

### How do I build a custom sheet?

Use `pure` and fill the default slot:

```vue
<SSheet v-model:open="open" pure side="bottom">
  <div class="custom">...</div>
</SSheet>
```

### How do I make the sheet fullscreen?

Render the header toggle with `show-fullscreen`, or drive the state with `v-model:fullscreen`. Either way the panel grows to the viewport from its `side` edge:

```vue
<SSheet v-model:open="open" v-model:fullscreen="fullscreen" show-fullscreen side="right" title="Settings">
  <template #trigger><SButton>Open</SButton></template>
</SSheet>
```
