---
head:
  title: Menubar
  description: 'Menubar builds a persistent horizontal menu bar for application chrome: a row of triggers with roving focus that open dropdown menus on click or hover, with arbitrarily nested submenus and full keyboard navigation.'
---

# Menubar

## Overview

Menubar builds a persistent horizontal menu bar for application chrome: a row of triggers with roving focus that open dropdown menus on click or hover, with arbitrarily nested submenus and full keyboard navigation.

`SMenubar` is a data-driven aggregation component: pass an `items` array and it renders the full `role="menubar"` structure, triggers, dropdown content, and nested submenus. A top-level item can be either a trigger that opens a dropdown or a link that navigates (set `href` / `to`). Logic and accessibility semantics live in the Aria `MenubarCompact`; styles are injected through a `scv()` recipe.

> `SMenubar` delegates all structural composition to the Aria `MenubarCompact`. For unstyled data-driven usage, import from `@vean/aria/menubar`; the dropdown layer reuses `MenuOptionsCompact` from `@vean/aria/menu`.

## Features

- **Data-driven composition** — pass `items` (`MenuOptionData`) to render the menubar; top-level items declare dropdowns via `children`, and child items support `label` / `icon` / `shortcut` / `disabled` / `separator` / `href` / `to` with unlimited nesting.
- **Horizontal roving focus** — the root keeps a single tab stop; `ArrowLeft` / `ArrowRight` move focus between triggers and `loop` wraps around at the ends; disabled triggers drop out of the focus order.
- **Full keyboard navigation** — `Enter` / `Space` toggle the menu and `ArrowDown` opens it; arrow keys roam menu items, `ArrowRight` / `ArrowLeft` switch between neighboring top-level menus; `Escape` closes and restores focus.
- **Hover / pointer switching** — with a menu open, hovering another trigger switches the open menu; hovering a link trigger dismisses the menu and focuses the link.
- **Click / hover trigger modes** — `trigger` supports `click` (default) and `hover`: `click` opens on click while hovering an open menubar still switches menus; `hover` opens on hover (tune with `delayDuration` / `skipDelayDuration`) and includes a pointer grace area so the pointer can move between the menubar and the content without accidental closes.
- **Overflow collapsing** — with `collapsible`, when the menubar content is wider than its container, trailing top-level items merge into a trailing "more" menu so the content always fits; customize via `moreLabel` / `moreIcon` / `moreProps` / the `more-trigger` slot.
- **Link top-level items** — items with `href` / `to` render as links (no dropdown), matching the `nav-menu` pattern; link semantics for `target` / `external` / `disabled` are preserved.
- **Nested submenus** — child items render arbitrarily deep submenus via `MenuSub`, with arrow-key entry/exit and a pointer-grace debounce (100ms open delay).
- **Controlled / uncontrolled** — with `modelValue`, the open menu follows the prop and emits `update:modelValue`; otherwise `defaultValue` seeds the initial state.
- **Per-item and whole-bar disabling** — `item.disabled` makes a single top-level trigger fully inert (`aria-disabled` + out of tab order + blocked interaction); the compact-level `disabled` prop disables every trigger at once, including link triggers.
- **Hidden items** — `item.hidden` drops a top-level trigger and its dropdown; hidden items are filtered before the overflow math, so `collapsible` only counts visible triggers. Hidden child items are dropped from their dropdown.
- **Bidirectional direction** — `dir` supports LTR / RTL; arrow keys and submenu slide direction follow logical direction; `portalProps` controls whether content teleports to `body`.
- **Six sizes** — `size` (xs…2xl) variants cover root and trigger spacing, padding, and font size.
- **Menu slot passthrough** — `item-leading` / `item-trailing` / `trigger` / `item-link-icon` slots forward to the menu layer for per-item customization; the `ui` prop overrides root and trigger slots.
- **Aria composition** — `MenubarRoot` / `MenubarMenu` / `MenubarTrigger` / `MenubarContent` / `MenubarSubTrigger` / `MenubarSubContent` and `Compact` are all exported from `@vean/aria/menubar`; menu primitives are reused from `@vean/aria/menu`.

## Usage

<UsageCode component="menubar" />

## Demos

<PlaygroundGallery component="menubar" />

## API

<ComponentApi component="menubar" />

## Notes

### Architecture & benchmark comparison

| Capability              | VeanUI                                                  | Ant Design `Menu`              | Element Plus `Menu` | Radix `Menubar`              |
| :---------------------- | :------------------------------------------------------ | :----------------------------- | :------------------ | :--------------------------- |
| Aria/styled split       | ✅ `@vean/aria/menubar` + `scv()`                       | ❌ single package              | ❌ single package   | ✅ `@radix-ui/react-menubar` |
| Data-driven compact API | ✅ `MenubarCompact` + nested `items`                    | ✅ `items`                     | ✅ `items`          | ❌ JSX composition           |
| Top-level triggers      | ✅ click / hover switch + arrows                        | ✅ click / hover               | ✅ click / hover    | ✅ click / hover + arrows    |
| Horizontal roving       | ✅ Roving Focus + `loop`                                | ✅                             | ✅                  | ✅                           |
| Cross-menu switching    | ✅ `ArrowRight` / `ArrowLeft`                           | ✅                             | ✅                  | ✅                           |
| Nested submenus         | ✅ any depth (reuses menu layer)                        | ✅ `SubMenu`                   | ✅ `el-sub-menu`    | ✅                           |
| Link top-level items    | ✅ `href` / `to` + `target` / `external` / `disabled`   | ✅ `danger` etc.               | —                   | ✅ `LinkItem`                |
| Disabled                | ✅ per-item + compact-wide                              | ✅ `disabled`                  | ✅ `disabled`       | ✅ `disabled`                |
| Controlled mode         | ✅ `modelValue` / `defaultValue`                        | ✅ `openKeys` / `selectedKeys` | ✅ `default-active` | ✅ `value` / `onValueChange` |
| Direction               | ✅ LTR / RTL + logical arrow keys                       | ✅ RTL                         | ✅ RTL              | ✅ RTL                       |
| Size variants           | ✅ `size` xs…2xl                                        | ✅ `size`                      | ✅ `size`           | —                            |
| Menu item types         | ✅ checkbox / radio / separator / shortcut (menu layer) | ✅ full                        | ✅ full             | ✅ full                      |

### Runtime considerations

1. **Open state and pointer** — in the default mode (`trigger="click"`), top-level triggers open their menu on `pointerdown`; clicking the same trigger again while open closes it via the dismissable layer ("click again to collapse"). Hovering another trigger switches the open menu. With `trigger="hover"` the menu opens on hover; `delayDuration` (default 150ms) controls the open delay and `skipDelayDuration` (default 300ms) the no-delay re-open window.
2. **Link top-level items** — items with `href` / `to` render no dropdown; clicking or keyboard activation navigates directly. Hovering a link item while a menu is open collapses the menu and moves focus to the link.
3. **Disabled semantics** — `item.disabled` targets a single top-level item: `aria-disabled`, `tabindex="-1"`, and blocked click/keyboard activation. The compact-level `disabled` disables every trigger (including link triggers). Disabled child items follow menu-layer semantics.
4. **Portal and positioning** — dropdown content teleports to `body` by default (disable via `portalProps.disabled`). If content appears in the wrong place, check for `transform` / animation-container ancestors; positioning relies on `getBoundingClientRect` measurements.
5. **Controlled / uncontrolled** — with `modelValue`, internal writes only emit `update:modelValue` and the open menu fully follows the prop; uncontrolled usage seeds the initial state with `defaultValue`.
6. **Focus restoration** — keyboard paths (`Escape` / arrow switching) restore focus to the trigger precisely; pointer paths (click outside to close) do not move focus, matching the "pointer interaction does not hijack focus" convention.
7. **RTL** — with `dir="rtl"`, arrow-key semantics mirror (`ArrowLeft` becomes "next") and menu layout flips via logical properties.
8. **Overflow collapsing** — with `collapsible`, trailing items merge into the "more" menu when the content overflows its container; measurement runs against the real rendered layout, so the container's parent must provide a fixed/constrained width (e.g. `max-w-*`). If the menubar sits in a flex container that does not shrink, set `min-w-0` or a width constraint on the parent.

## FAQ

### How do I make a top-level item navigate instead of opening a dropdown?

Set `href` or `to` on the item — link top-level items render as an `<a>` with no dropdown; use `target` / `external` to control how the link opens.

### How do I precisely control which menu is open?

Bind `modelValue` with `v-model`. The top-level item `value` becomes the controlled value; activation emits `update:modelValue`, and external changes sync the open menu. Uncontrolled usage seeds the initial state with `defaultValue`.

### How do I disable the whole menubar or single items?

Pass `disabled` to `SMenubar` to disable everything, or set `disabled: true` on a single top-level item. Disabled items render `aria-disabled`, drop out of tab order, and block click and keyboard activation.

### What is the keyboard flow?

`Tab` enters the menubar; `ArrowLeft` / `ArrowRight` move between triggers; `Enter` / `Space` toggle a menu and `ArrowDown` opens it; inside a menu, arrow keys roam items, `ArrowRight` / `ArrowLeft` switch to neighboring top-level menus, and `Escape` closes. Disabled items are excluded from tab order.

### Can I use checkboxes or radios inside submenus?

Yes — dropdown content reuses the menu layer: `item-checked` slots, `MenuCheckboxItem` / `MenuRadioItem`, plus `separator` / `shortcut` are all available; pass the matching fields on child items in compact usage.

### Why does the menu collapse when hovering a link item?

Link top-level items have no dropdown; on pointer enter the menubar collapses the currently open menu and moves focus to the link — matching Radix Menubar's link-item behavior and avoiding focus lingering on the trigger of a closed menu.

### How do I make the menu open on hover instead of on click?

Pass `trigger="hover"` to `SMenubar`. Hovering a trigger opens its menu (`delayDuration` controls the open delay, `skipDelayDuration` the re-open window); the pointer can move between the menubar and the menu content without accidental closes. Keyboard operation (arrows / Enter / Space / Escape) is identical in both modes.

### What if there are too many menu items to fit?

Pass `collapsible` to `SMenubar`. When the menubar content is wider than its container, trailing top-level items automatically merge into a trailing "more" menu (default label `More`, customizable via `moreLabel` / `moreIcon` / `moreProps`), so the content never exceeds the container width. The collapse state recomputes automatically when the container resizes.
