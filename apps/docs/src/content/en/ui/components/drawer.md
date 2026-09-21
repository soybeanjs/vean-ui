---
head:
  title: Drawer
  description: 'A gesture-driven panel that slides in from an edge of the screen. It owns its own Aria family — snap points, swipe dismiss, drag handle and nested scaling — built on the dialog primitives for modality, focus and dismissal.'
---

# Drawer

## Overview

A gesture-driven panel that slides in from an edge of the screen. Unlike `SSheet` (a dialog with a side), the drawer owns a real domain state machine: **snap points**, **swipe progress**, a **drag handle**, and **nested scaling** are behaviour the dialog family does not have.

`SDrawer` combines the Aria `drawer` primitive family with the `drawerVariants` style recipe (extends `sheetVariants`, adds a drag `handle` and an opt-in `swipeArea`; 6 sizes × 4 sides). Modality, focus trapping and dismissal still come from the shared dialog primitives.

## Usage

<UsageCode component="drawer" />

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

<PlaygroundGallery component="drawer" />

## API

<ComponentApi component="drawer" />

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
<!-- Before -->
<SBottomSheet v-model:open="open" should-scale-background>
  <div data-vean-drawer-scale>Page</div>
</SBottomSheet>

<!-- After -->
<SDrawer v-model:open="open">
  <DrawerIndent class="page-indent">Page</DrawerIndent>
  <template #trigger><SButton>Open</SButton></template>
</SDrawer>
```

```vue
<!-- Before -->
<SBottomSheet v-model:open="open" v-model:active-snap-point="snap" :snap-points="[0.5, 1]">
  <template #trigger><SButton>Open</SButton></template>
  Content
</SBottomSheet>

<!-- After -->
<SDrawer v-model:open="open" v-model:snap-point="snap" :snap-points="[0.5, 1]">
  <template #trigger><SButton>Open</SButton></template>
  Content
</SDrawer>
```

### Roadmap

Horizontal snap points, on-device verification of the touch pipeline (iOS Safari / Android Chrome), and iOS virtual keyboard coordination.

## FAQ

### How do I anchor the drawer to a different edge?

Set `side` to `top`/`bottom`/`left`/`right`:

```vue
<SDrawer v-model:open="open" side="left" title="Filters">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```

### How do I enable snap points?

Pass an array of fractions, pixels or CSS lengths, and bind the active level:

```vue
<SDrawer v-model:open="open" v-model:snap-point="snapPoint" :snap-points="[0.4, 0.8, 1]" title="Filters">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```

### How do I open the drawer with a swipe gesture?

Set `swipeable`. An edge strip is rendered at the panel's `side` and swipes in the opposite direction:

```vue
<SDrawer v-model:open="open" swipeable title="Details">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```

### How do I disable drag-to-dismiss?

Set `dismissible={false}` to require an explicit action:

```vue
<SDrawer :dismissible="false" title="Confirm">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```

### How do I restrict dragging to the handle?

Set `handle-only`:

```vue
<SDrawer handle-only title="Details">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```

### How do I build a non-modal side panel that still traps focus?

Use the `'trap-focus'` tier:

```vue
<SDrawer v-model:open="open" modal="trap-focus" title="Inspector">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```

### How do I make the drawer fullscreen?

Bind `v-model:fullscreen`, or let it start fullscreen with `default-fullscreen`. The panel grows to the viewport from its `side` edge and stops responding to drags, so snapping and dragging resume only once you switch fullscreen off:

```vue
<SDrawer v-model:open="open" v-model:fullscreen="fullscreen" :snap-points="[0.6, 1]" title="Details">
  <template #trigger><SButton>Open</SButton></template>
  <div>Drawer content</div>
</SDrawer>
```
