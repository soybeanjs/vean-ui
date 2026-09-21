---
head:
  title: SplitNav
  description: 'A split navigation for admin layouts. SSplitNav takes one menu tree and renders it across independent first-level and nested panes, instead of nesting every level in a single sidebar. It ships four layout modes — dual-vertical, vertical-horizontal, horizontal-vertical, and horizontal-dual-vertical. The first-level rail is a dedicated RovingFocus menu (Menubar-like arrow keys; Enter/Space to activate; ArrowDown on a horizontal parent, ArrowLeft/ArrowRight on a vertical parent to open the nested pane). Nested vertical panes reuse TreeMenuCompact; the nested horizontal pane reuses TreeNavCompact.'
---

# SplitNav

## Overview

A split navigation for admin layouts. `SSplitNav` takes one menu tree and renders it across independent first-level and nested panes, instead of nesting every level in a single sidebar. It ships four layout modes — `dual-vertical`, `vertical-horizontal`, `horizontal-vertical`, and `horizontal-dual-vertical`. The first-level rail is a dedicated RovingFocus menu (Menubar-like arrow keys; Enter/Space to activate; ArrowDown on a horizontal parent, ArrowLeft/ArrowRight on a vertical parent to open the nested pane). Nested vertical panes reuse `TreeMenuCompact`; the nested horizontal pane reuses `TreeNavCompact`.

Use it when a layout needs a first-level switcher plus a nested tree or horizontal nav (two vertical columns, a vertical rail with a horizontal bar, a top bar with a sider, or a top bar plus two vertical columns). Prefer `STreeMenu` for a single nested sidebar and `STreeNav` for a standalone horizontal tree nav.

## Usage

<UsageCode component="split-nav" />

## Features

- 🧭 Four modes — `mode` selects the pane composition; the root switches the matching mode component
- 🎹 First-level keyboard — vertical/horizontal `useRovingFocusGroup` with Arrow, Home/End; Enter/Space activates; ArrowDown on a horizontal parent and ArrowLeft/ArrowRight on a vertical parent open the nested pane; Tab moves between panes
- 🪟 Teleport mounting — `verticalMountedId` / `horizontalMountedId` mount panes into `#id` elements (`dual-vertical` teleports as one block)
- 🪜 Path slicing — `openPath` drives nested panes; `modelValue` is the selected leaf only
- 🔄 Controlled/uncontrolled — `modelValue` / `defaultValue` store the selected leaf; clicking a parent only opens its pane, without changing `v-model` or applying the selected style
- 🌲 Expand strategy — `expandStrategy` (`keep` by default, or `selected`) is forwarded to the nested `TreeMenuCompact`
- 📢 Open event — activating a parent emits `open` with its complete option data (children included), e.g. to activate the first child at the same time
- 🧩 Reuses `TreeMenuCompact` (nested vertical) and `TreeNavCompact` (nested horizontal)
- 🙈 Hidden options — `hidden` drops an entry and its subtree from the first-level rail and from the nested panes; a parent whose children are all hidden renders as a leaf
- 🎨 6 sizes + style injection — `size` from xs to 2xl; `class` / `ui` overrides across named slots
- ✏️ Customizable — `first-level-item` / `item` / `item-leading` / `item-trailing` slots
- 🧷 Menu brand cells — `top-left` / `top-right` render above the two columns of a dual-vertical menu: the rail cell takes the rail's width, the pane cell follows that column's width and fold. The divider between the two is the pane's own leading edge — it runs that column's whole height, the brand band included — so the rail never draws one of its own. A host brand belongs inside the menu there, instead of in a region beside it
- ♿ Accessibility — `role="menubar"` / `menuitem`, `data-vean-split-nav-*` attributes, RTL-aware `dir`

## Component family

- `SSplitNav` (styled) — entry wrapper; composes `SplitNavRoot` + `splitNavVariants` mode/size recipe + `provideSplitNavUi` slot-class injection
- `SplitNavRoot` (Aria) — compact aggregator; `useControllableState` for the active value, mode switch, slot forwarding
- Internal mode components (Aria) — `DualVerticalMenu`, `VerticalHorizontalMenu`, `HorizontalVerticalMenu`, `HorizontalDualVerticalMenu`
- Internal first-level menus (Aria) — `VerticalFirstLevelMenu` / `HorizontalFirstLevelMenu` with shared RovingFocus items

## Demos

<PlaygroundGallery component="split-nav" />

- 01 Basic — `dual-vertical` two vertical columns, with TreeMenu width and collapse
- 02 Vertical-Horizontal — level-1 vertical rail + nested TreeNav
- 03 Horizontal-Vertical — level-1 horizontal bar + nested TreeMenu
- 04 Horizontal-Dual-Vertical — top horizontal bar + nested dual-vertical
- 05 Teleport — mount panes into external `#id` elements
- 06 Custom — override first-level and nested item content through slots
- 07 Open Event — listen to `open` and activate the first child when a parent is clicked
- 08 Expand Strategy — switch the nested `TreeMenuCompact` between `keep` and `selected`
- 09 Top Slots — put a brand into the dual-vertical menu's `top-left` / `top-right` cells, and drop the title through the `collapsed` slot prop once the pane folds

## API

<ComponentApi component="split-nav" />

## Notes

### Architecture

`SSplitNav` is a thin styled wrapper. Aria `SplitNavRoot` owns mode switching, the active path (`findActivePath`), and leaf-vs-parent selection. First-level items are a dedicated RovingFocus list — not a TreeMenu — so parent nodes switch the nested pane instead of expanding in place, and they **do not** take on the selected-leaf style. Vertical first-level items stack icon above label in a compact rail (overflowing labels ellipsize); horizontal first-level items stay icon-then-label in a row. Nested vertical content is `TreeMenuCompact` styled with `treeMenuVariants`, including a dedicated pane width, `v-model:collapsed`, and the `expandStrategy` you pass to the root; nested horizontal content is `TreeNavCompact` styled with `treeNavVariants` so it matches `STreeNav`. `class` applies to the standalone `dual-vertical` pane; mixed modes render as independent teleported fragments.

| Capability              | VeanUI | Ant Design | Element Plus | Naive UI |
| :---------------------- | :----: | :--------: | :----------: | :------: |
| Multiple layout modes   |   ✅   |     ⚠️     |      ⚠️      |    —     |
| Teleport to external el |   ✅   |     —      |      —       |    —     |
| Aria/style separation   |   ✅   |     —      |      —       |    —     |
| First-level roving keys |   ✅   |     ⚠️     |      ⚠️      |    —     |

### Cautions

- Panes render in place by default; set `horizontalMountedId` / `verticalMountedId` only when a pane must mount into an external element (pass the id without `#`).
- In `dual-vertical` and the nested dual-vertical of `horizontal-dual-vertical`, the two vertical columns teleport together via `verticalMountedId`. Mixed modes teleport the first-level and nested panes independently.
- Clicking a parent item only opens the nested pane (`data-state="open"`); it does not change `v-model` or set `data-selected`. Clicking a leaf updates `v-model` and emits `select`; the selected leaf renders `data-selected="true"` and `data-state="closed"`. A parent whose descendant is selected also gets `data-child-selected`.
- Activating a parent item (click or keyboard) emits `open` with the complete option data of that parent, children included; it fires only for parents with visible children and never for leaves.
- The nested pane keeps its own expanded state while it stays mounted, so with the default `expandStrategy="keep"` a branch you expanded under one first-level item is still expanded when you come back to it. The state resets when the pane unmounts, which happens whenever the active first-level item has no visible children.
- Flex layout per `mode` lives in the UI style recipe; the Aria layer carries no layout classes.
- `top-left` / `top-right` belong to the dual-vertical shapes: the other modes render no such cells. `top-left` is the rail column's own top cell — same width as the rail — and `top-right` the pane column's, so the pane's leading divider runs through that band as well. `top-right` only exists while the pane column does, i.e. while the active first-level item has visible children. Both receive `collapsed`, so a host that renders a title there can drop it once the pane folds.
- A vertical first-level rail draws no divider of its own: the column after it leads with one. A sidebar that shows the rail alone (`vertical-horizontal`, and the dual-vertical shapes while no pane is open) therefore has no inner edge — the boundary there belongs to the layout or the container the rail sits in.
- The vertical columns of a sidebar only exist while the current state fills them. `resolveSplitNavSidebarColumns({ mode, items, modelValue, openPath })` answers which of them exist: `dual-vertical` and `horizontal-dual-vertical` use up to two columns (the latter's being the second and third level of the tree), `vertical-horizontal` keeps the rail alone in the sidebar, and `horizontal-vertical` the pane alone. A consumer that has to fix a container's width before rendering — `SAppShell` reserving its sidebar — derives it from there instead of measuring the DOM, which is unavailable during server rendering.

## FAQ

### How do I switch between the four modes?

Set the `mode` prop: `dual-vertical` (two vertical columns), `vertical-horizontal` (rail + horizontal bar), `horizontal-vertical` (horizontal bar + vertical column), or `horizontal-dual-vertical` (top bar + two vertical columns).

### How do I mount a pane into a specific element?

Give the target element an `id` and pass it to `horizontalMountedId` / `verticalMountedId`:

```vue
<SSplitNav
  mode="horizontal-vertical"
  :items="items"
  horizontal-mounted-id="app-header"
  vertical-mounted-id="app-sider"
/>
```

The pane is then rendered into `#app-header` / `#app-sider` through `Teleport` (`defer` keeps late-mounted targets safe).

### How do I size a container around the panes?

`resolveSplitNavSidebarColumns` reports the vertical columns a mode renders, so a container can reserve exactly their width before rendering:

```ts
import { computed } from 'vue';
import { resolveSplitNavSidebarColumns } from '@vean/aria/split-nav';

// `rail` and `pane` say whether each of the two sidebar columns exists.
const columns = computed(() => resolveSplitNavSidebarColumns({ mode, items, modelValue: active.value }));
```

Resolving from the selected value covers a container driven by the active route. Pass `openPath` as well to follow a menu that is only _opened_ — the user browsing a parent without selecting a leaf yet. `SplitNavRoot` keeps that path internal, so mirror it from the `open` event and clear it whenever the model value changes; that is what `SAppShell` does to size its layout around the columns.

### How do I know when a leaf is chosen?

The `select` event fires with the leaf value; `v-model` reflects the selected leaf only. Clicking a parent only opens the nested pane (`data-state="open"`) and does not emit `select` or set `data-selected`. If a descendant is already selected, the parent also gets `data-child-selected`.

### How do I activate the first child when a parent is clicked?

Listen to the `open` event: it carries the complete option data of the activated parent, children included. Pick its first visible child and write the value to `v-model`:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { SSplitNav } from '@vean/ui';
import type { SplitNavOptionData } from '@vean/ui';

const active = shallowRef('');

function handleOpen(item: SplitNavOptionData) {
  const firstChild = item.children?.find(child => !child.hidden);

  if (firstChild) {
    active.value = firstChild.value;
  }
}
</script>

<template>
  <SSplitNav v-model="active" :items="items" @open="handleOpen" />
</template>
```

`open` fires only when a parent with visible children is activated (click or keyboard), so leaves keep using `select`.

### Can I customize each item's content?

Yes — use `first-level-item` for the first-level rail, and `item` / `item-leading` / `item-trailing` for nested TreeMenu and TreeNav items.

### Which branches stay expanded in the nested pane?

`expandStrategy` controls the nested `TreeMenuCompact` and defaults to `keep`.

- `keep` (default) — a branch you expanded by hand stays expanded: selecting another leaf, or switching first-level parents and coming back, does not collapse it. The ancestors of the selected leaf are still expanded on mount and whenever the selection changes from outside (for example when a route drives `v-model`), so the active leaf stays visible.
- `selected` — the expanded set always follows the selection: only the selected leaf and its ancestors stay expanded, and every other branch collapses as soon as the selection changes.

```vue
<SSplitNav v-model="active" expand-strategy="selected" :items="items" />
```

Only the nested vertical pane (`TreeMenuCompact`) has an expand strategy; the nested horizontal pane (`TreeNavCompact`) has none.

### Does it support route links?

Each node can carry `to` / `href` (inherited from `LinkBaseProps`). First-level items and nested TreeMenu / TreeNav renderers handle link rendering.

### How does first-level keyboard navigation work?

The first-level list is a `menubar`: Arrow keys move focus (vertical uses Up/Down, horizontal uses Left/Right, RTL-aware), Home/End jump to the ends, Enter/Space activates the focused item. When the item has children, ArrowDown on a horizontal rail and ArrowLeft/ArrowRight on a vertical rail open the nested pane. Nested TreeMenu and TreeNav keep their own keyboard contracts; Tab moves between panes.
