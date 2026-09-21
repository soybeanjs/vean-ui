---
head:
  title: NavMenu
  description: 'NavMenu builds site-level horizontal or vertical navigation with a single shared floating surface. It replaces the retired NavigationMenu family (see the NavMenu migration guide) and is modeled directly on the Popper primitives: the whole viewport is one PopperPositioner, its reference switches to the active trigger, and all hover timing runs on a single shared Popper hover machine with value routing through pendingValue.'
---

# NavMenu

## Overview

NavMenu builds site-level horizontal or vertical navigation with a single shared floating surface. It replaces the retired `NavigationMenu` family (see the [NavMenu migration guide](/components/navigation-menu)) and is modeled directly on the Popper primitives: the whole viewport is one `PopperPositioner`, its reference switches to the active trigger, and all hover timing runs on a single shared Popper hover machine with value routing through `pendingValue`.

`SNavMenu` is a data-driven composite: pass an `items` array and it renders the `nav > ul > li` structure, trigger/content pairs, indicator, and the floating viewport. Styles are injected through an `scv()` recipe.

> For an unstyled, data-driven usage, import `@vean/aria/nav-menu`.

## Features

- **Single shared Popper model** — one `PopperRoot`, one `PopperPositioner` (the viewport), and a dynamic reference that switches to the active trigger. Positioning (Floating UI), the grace corridor and Escape/outside dismissal come from the positioner for free.
- **Value routing** — hover timing (open delay, skip-delay window) runs on the shared machine; the value of the most recently hovered trigger routes into `modelValue`, so switching between triggers is instant.
- **Hover / click triggers** — hover opens and click toggles by default; `disableClickTrigger` / `disableHoverTrigger` turn each trigger mode off independently.
- **Grace corridor** — moving between a trigger and the open viewport is protected by a real geometric corridor (no debounce), with `skipDelayDuration` and `disablePointerLeaveClose` tuning closing behavior.
- **Submenu surfaces** — items with `children` open a floating viewport anchored to their trigger, with an arrow indicator and `unmountOnHide` control.
- **Hidden items** — `hidden` drops an item and its whole subtree from the root list and from the nested flyouts; an item whose children are all hidden renders as a leaf link.
- **Keyboard navigation** — arrow keys move focus across items; `Enter` / `Space` activate a link or toggle a submenu; the entry arrow key moves focus into the content; `Escape` closes and restores focus to the trigger.
- **Popup arrow** — the viewport carries a `PopperArrow` that points at the active trigger; its placement and rotation come from Floating UI's `arrow` middleware, and it slides with the viewport on trigger switch.
- **Controlled / uncontrolled** — with `modelValue`, highlight follows the prop and `update:modelValue` fires; otherwise `defaultValue` seeds the initial open item.
- **Bidirectional** — `orientation` supports horizontal / vertical; `dir` supports LTR / RTL with logical placement.
- **Six sizes** — `size` (xs…2xl) variants cover spacing and type scale across the list, trigger, viewport, and links.
- **Aria composition** — `NavMenuRoot` / `List` / `Item` / `Trigger` / `Content` / `Link` / `Viewport` plus the `Compact` series are exported from `@vean/aria/nav-menu`.

## Usage

<UsageCode component="nav-menu" />

## Demos

<PlaygroundGallery component="nav-menu" />

## API

<ComponentApi component="nav-menu" />

## Notes

### Architecture

| Capability     | NavMenu (Popper-native)                                             |
| :------------- | :------------------------------------------------------------------ |
| floating model | single `PopperRoot` + viewport as `PopperPositioner`                |
| positioning    | Floating UI against the active trigger (dynamic ref)                |
| hover delay    | shared Popper hover machine (`delayDuration` / `skipDelayDuration`) |
| grace corridor | positioner's `useGraceArea` anchored on the nav                     |
| dismissal      | positioner's `usePopperDismiss` (Escape / outside)                  |
| value routing  | `pendingValue` slot on the shared root context                      |

### Runtime notes

1. **Hover timing** — the menu opens after `delayDuration` on hover; while open (or within `skipDelayDuration` of the last close) hovering another trigger switches instantly. `disablePointerLeaveClose` keeps the menu open when the pointer leaves the content.
2. **Click vs. hover** — a submenu opened by hover ignores the subsequent click (`hasPointerMoveOpenedRef` guard), preventing accidental toggling. Set `disableHoverTrigger: true` for a click-only experience.
3. **Controlled / uncontrolled** — with `modelValue`, internal writes only emit `update:modelValue`; highlight fully follows the prop.
4. **Focus handling** — the content participates in Tab navigation via a focus proxy; `Escape` returns focus to the active trigger.

## FAQ

### How does NavMenu differ from the retired NavigationMenu family?

NavMenu drops the shared measured-size viewport and per-item hover roots in favor of Popper's native single-root + positioner model: Floating UI positions the viewport, and the grace corridor / dismissal come from the positioner. It trades the old size/motion-direction transitions for a standard floating popup. `NavigationMenu` and `SNavigationMenu` were removed in v0.50.0 — see the [migration guide](/components/navigation-menu).

### How do I keep only click triggers?

Set `disableHoverTrigger: true` — hovering no longer opens submenus while clicks still toggle. For hover-only, set `disableClickTrigger: true`.

### Can a parent item be both a link and have a submenu?

Yes — give the item both `href` / `to` and `children`. The trigger then renders as a link; clicking an open link trigger dismisses the menu first.
