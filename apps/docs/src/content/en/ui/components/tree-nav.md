---
head:
  title: TreeNav
  description: 'TreeNav is a data-driven horizontal navigation bar with a persistent selection state: top-level entries sit in a row, branch entries open dropdown popups (hover by default), and selecting any leaf keeps the whole ancestor chain highlighted.'
---

# TreeNav

## Overview

TreeNav is a data-driven horizontal navigation bar with a persistent selection state: top-level entries sit in a row, branch entries open dropdown popups (hover by default), and selecting any leaf keeps the whole ancestor chain highlighted.

`STreeNav` is the horizontal counterpart of `STreeMenu`: both consume the same tree-shaped `items` data (`TreeNavOptionData`) and derive highlights from the selected value, but TreeNav renders branches as DropdownMenu popups instead of collapsible sections. Logic and accessibility semantics live in the Aria `TreeNavCompact`; styles are injected through an `scv()` recipe.

> Unlike Menubar (a transient "which menu is open" command-menu model), TreeNav models **selection**: opening a popup never marks anything active — only selection does. Selected leaves carry `data-selected`, and ancestors of the selected leaf carry `data-child-selected`.

## Features

- **Persistent selection** — bind `modelValue` (`v-model`) or seed with `defaultValue`; selection survives closing popups and page interactions.
- **Highlight derivation** — the selected leaf renders `data-selected="true"`, and every ancestor in its path renders `data-child-selected`; derivation reuses the shared tree-path helper, so highlighting works at any depth.
- **Hover-first popups** — branch popups open on hover by default (`trigger="click"` to override), tuned via `delayDuration` / `skipDelayDuration`.
- **Familiar data shape** — pass one `items` array (`TreeNavOptionData`: `value` / `label` / `icon` / `children` / `href` / `to` / `disabled` …), aligned with TreeMenu's option model; item customization beyond these fields (badges, tags, actions…) is provided via slots instead of extra data fields.
- **Link top-level items** — items with `href` / `to` render as links that also update the selection on click.
- **Overflow collapsing** — with `collapsible`, trailing top-level items merge into a trailing "more" popup so the bar always fits its container; customize via `moreLabel` / `moreIcon` / `moreProps` / the `more-trigger` slot.
- **Navigation semantics** — root renders as `<nav>` (`as` overridable); popup trigger semantics (`aria-haspopup` / `aria-expanded`, Escape handling) are inherited from the DropdownMenu layer.
- **Keyboard navigation** — the top level is a single roving tab stop: ←/→ roam all entries alike (skipping disabled, no wrap), Home/End jump to the first/last entry; branch popups open through the explicit keys — Enter/Space (native button semantics) or ArrowDown — and once a popup is open its keys are owned by the Menu machinery.
- **Per-item and whole-bar disabling** — `item.disabled` makes a single entry inert; the bar-level `disabled` disables everything.
- **Hidden items** — `item.hidden` drops the entry and its subtree from the bar and its popup; a branch whose children are all hidden renders as a plain leaf.
- **Six sizes & two variants** — `size` (xs…2xl) plus `variant="default"` (subtle card surface) or `variant="nav"` (bare bar).
- **Slot passthrough** — `item` / `item-leading` / `item-trailing` / `item-trigger-icon` / `item-link-icon` forward into both the top level and popups.
- **Aria composition** — import from `@vean/aria/tree-nav` for unstyled data-driven usage; popup options reuse `MenuOptionsCompact`.

## Usage

<UsageCode component="tree-nav" />

## Demos

<PlaygroundGallery component="tree-nav" />

## API

<ComponentApi component="tree-nav" />

## Notes

### When to use which navigation component

| Component   | State model                                   | Layout     | Use for                               |
| :---------- | :-------------------------------------------- | :--------- | :------------------------------------ |
| `SMenubar`  | open menu (`modelValue` = which menu is open) | horizontal | application command menus (File/Edit) |
| `SNavMenu`  | highlighted item (`modelValue`)               | horizontal | site-level nav with flyout panels     |
| `STreeMenu` | persistent selection                          | vertical   | sidebar navigation                    |
| `STreeNav`  | persistent selection                          | horizontal | top navigation bars                   |

### Runtime considerations

1. **Open ≠ active** — popup open state is transient UI state managed internally by the DropdownMenu layer; only leaf selection updates `data-selected`. Do not use `SMenubar`'s `modelValue` semantics here.
2. **Collapsed highlight consistency** — when a selected item collapses into the "more" popup, its visible ancestor still shows `data-child-selected` because derivation runs on the full `items` list.
3. **Collapsible measurement** — like Menubar's overflow collapsing, measurement runs against real layout after mount; give the parent a constrained width (e.g. `max-w-*` / fixed width) for best results. The first frame may briefly render all items before collapsing.
4. **Controlled mode** — with `modelValue`, internal writes only emit `update:modelValue`; uncontrolled usage seeds the initial state with `defaultValue`.
5. **Keyboard model** — while the bar is closed, ←/→ (and Home/End) roam the top level through a roving tabindex; branch triggers are roam targets like any other entry, so arrows never open popups. Opening stays on Enter/Space or ArrowDown (focus then moves to the first menu item); once a popup is open, all keys belong to the Menu (↑/↓ inside, Escape to close and return focus to the trigger), and a hover popup closes itself when focus leaves the trigger.

## FAQ

### Which keyboard shortcuts does the nav bar support?

←/→ roam the top-level entries (Home/End jump to the ends) — branch triggers included, so the arrows only move focus and never open popups. Popups open via Enter/Space or ArrowDown on a branch trigger (focus lands on the first menu item). Direction keys never change the selection — selection only happens on explicit activation (click or Enter/Space on a leaf).

### How do I make a top-level entry navigate instead of opening a dropdown?

Set `href` or `to` on the item — link entries render as `<a>` elements and update the selection on click.

### How do I control which entry stays highlighted?

Bind `v-model`. The selected value is compared against the whole `items` tree; matched leaves get `data-selected` and their ancestors get `data-child-selected`.

### Why doesn't hovering a branch mark it active?

Opening a popup is transient state, not selection — select a leaf inside instead. This mirrors `STreeMenu`, where container nodes never carry the active state.

### What happens when my nav bar overflows?

Pass `collapsible`. Trailing items collapse into a "more" popup (default label `More`) whenever they exceed the container width, recomputed automatically on resize.
