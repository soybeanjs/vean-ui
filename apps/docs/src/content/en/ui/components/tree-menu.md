---
head:
  title: TreeMenu
  description: 'A collapsible sidebar navigation tree-menu component. STreeMenu combines the Aria TreeMenuCompact family of composite components (TreeMenuRoot/TreeMenuOptionCompact/TreeMenuSlotCompact, zero-style) with the TreeMenuRoot context (controlled/uncontrolled activation and expansion, collapsed sidebar mode, flyout submenus when collapsed, action menus); the UI layer only injects the 8-step size recipe and slot classes. The recursive items data model ships with built-in icon/badge/tag/actions/isGroup/link fields, and node content can be freely customized through the item/item-leading/item-trailing slots.'
---

# TreeMenu

## Overview

A collapsible sidebar navigation tree-menu component. `STreeMenu` combines the Aria `TreeMenuCompact` family of composite components (`TreeMenuRoot`/`TreeMenuOptionCompact`/`TreeMenuSlotCompact`, zero-style) with the `TreeMenuRoot` context (controlled/uncontrolled activation and expansion, collapsed sidebar mode, flyout submenus when collapsed, action menus); the UI layer only injects the 8-step size recipe and slot classes. The recursive `items` data model ships with built-in `icon`/`badge`/`tag`/`actions`/`isGroup`/link fields, and node content can be freely customized through the `item`/`item-leading`/`item-trailing` slots.

## Usage

<UsageCode component="tree-menu" />

## Features

- 🧭 Hierarchical data model — `items: TreeMenuOptionData<T>[]` (`value`/`label` plus recursive `children`); the `TreeMenuOptionData<T>` generic preserves custom fields; built-in `isGroup`/`hidden`/`icon`/`badge`/`tag`/`disabled`/`actions`/`to`/`href` fields
- 🎛️ Controlled/uncontrolled dual channels — `modelValue` / `defaultValue` (active item), `expanded` / `defaultExpanded` (expanded items), `collapsed` / `defaultCollapsed` (collapsed state); all support `v-model` and `update:*` events
- 🎯 Expand strategy — `expandStrategy="keep"` (default) preserves manual expansion no matter which menu is selected; `expandStrategy="selected"` auto-expands only the selected menu and its ancestors, collapsing non-selected branches whenever the selected menu changes
- 📉 Collapsed sidebar mode — `collapsed` + `collapsedWidth` (default 50px) / `indent` collapses the rail; items with children render a flyout menu while collapsed, and the expansion state is stashed and restored automatically
- 🧩 Action menus — `actions` + `actionMenuProps` + `onActionSelect` attach hover actions (ellipsis button) to items; the trigger aria-label is localized across 13 language packs
- 🏷️ Badge/tag/icon — built-in `icon`/`badge`/`tag` fields, freely extended via the `item-leading`/`item-trailing` slots
- 🔗 Link items — `to`/`href` render route links or external links (`external` controls behavior); external links show an arrow-up-right icon automatically
- 🗂️ Grouping — `isGroup` groups with the `group-label` slot; `top`/`bottom` slots host menu header/footer content
- 🎨 8 sizes + style injection — `size` from xs to 2xl; `class`/`ui` overrides across 20+ named slots
- ⌨️ Keyboard navigation — WAI-ARIA tree pattern: the root is a single tab stop with `role="tree"`, ↑/↓ roam visible items, → expands or enters children, ← collapses or returns to the parent, Home/End jump to the first/last item, and Enter/Space activates (direction keys only move focus — they never change the active item)
- ♿ Accessibility — `role="tree"`/`treeitem` semantics with `aria-expanded`/`aria-controls`/`aria-selected`, roving tabindex, `data-vean-tree-menu-*` data attributes, zero axe violations

## Component family

- `STreeMenu` (styled) — entry wrapper; composes `TreeMenuCompact` + the `treeMenuVariants` size recipe + `provideTreeMenuUi` slot-class injection, `useForwardListeners` event merging
- `STreeMenuStyledItem` (styled) — one row drawn with the item recipe, for content that is not a menu node (a brand, a trigger, a footer row); renders through `Primitive`, so `as` / `asChild` pick the element and `disabled` marks the row
- `TreeMenuCompact` (Aria) — composite root; `TreeMenuRoot` state root + `TreeMenuOptionsCompact` grouping/recursive rendering + `top`/`bottom` slots
- `TreeMenuRoot` (Aria) — state root; `useControllableState` manages activation/expansion/collapse; `backupExpanded` stashes expansion while collapsed and restores it on recovery
- `TreeMenuOptionsCompact` (Aria) — grouping/recursive rendering; with `expandStrategy="selected"` it syncs the expanded state to the selected menu path
- `TreeMenuOptionCompact` (Aria) — single-node composition; leaves render buttons/links + the action menu, parents render a `TreeMenuCollapsible` trigger + recursive `TreeMenuSub` + a collapsed-mode flyout `DropdownMenuCompact`
- `TreeMenuSlotCompact` (Aria) — node content orchestration (icon/label/badge/tag/external-link icon/chevron)
- Base primitives (Aria) — `TreeMenuButton`/`TreeMenuItem`/`TreeMenuCollapsible`/`TreeMenuSub`/`TreeMenuGroup`/`TreeMenuGroupLabel`/`TreeMenuTooltipCompact`, all zero-style

## Demos

<PlaygroundGallery component="tree-menu" />

- 01 Basic — customizer for the sidebar: `expandStrategy` / `collapsed` / `collapsedWidth` / `indent` / `size` controls over groups/icons/badge/tag/action menus/link items

## API

<ComponentApi component="tree-menu" />

## Notes

### Architecture and benchmark differences

`TreeMenuRoot` owns all state (activation/expansion/collapse through the `useControllableState` controlled/uncontrolled dual channels). On collapse it stashes the expanded branches via `backupExpanded`, clears expansion, and triggers the flyout menus; on recovery it restores the branches verbatim — a lossless collapse/expand round trip. Composition happens in the Aria layer: `TreeMenuOptionCompact` orchestrates leaves (button/link + action menu) and parents (Collapsible trigger + recursive `TreeMenuSub` + flyout menu), while the UI `STreeMenu` only injects the size recipe and slot classes and carries no state. Both the action menu and the flyout menu reuse the data-driven `DropdownMenuCompact` (rendered by `MenuOptions`). The root follows the WAI-ARIA tree pattern — a single roving tab stop with `role="tree"`, `treeitem` items, and `group` sub-lists — and the axe scan reports zero violations. Compared with mainstream sidebar-menu libraries, VeanUI is more complete in Aria separation, built-in action menus, collapsed flyouts, external link items, and 13-language localization.

| Capability                            | VeanUI | Ant Design | Element Plus | Naive UI |
| :------------------------------------ | :----: | :--------: | :----------: | :------: |
| Aria/style separation                 |   ✅   |     —      |      —       |    —     |
| Controlled activation/expand/collapse |   ✅   |     ✅     |      ✅      |    ✅    |
| Collapsed sidebar (rail width)        |   ✅   |     ✅     |      ✅      |    ⚠️    |
| Flyout submenus when collapsed        |   ✅   |     ✅     |      ✅      |    ⚠️    |
| Built-in action menus (actions)       |   ✅   |     —      |      —       |    —     |
| Badge/tag (badge/tag)                 |   ✅   |     ⚠️     |      —       |    —     |
| Groups/icons/external links           |   ✅   |     ✅     |      ✅      |    ✅    |
| Localized aria-label                  |   ✅   |     ✅     |      ✅      |    ✅    |

`⚠️` = partial support (Naive UI needs extra `collapsed` + custom popup content for flyouts; Ant Design implements badges through custom `label` nodes).

### Cautions

- Keyboard navigation follows the WAI-ARIA tree pattern: ↑/↓ (and Home/End) roam the visible items without wrapping, → expands a closed branch then enters its first child, ← collapses an expanded branch then returns to the parent, and Enter/Space activate the focused item. Direction keys only move focus — the active item only changes on explicit activation.
- In collapsed mode the flyout branch popups are owned by the Menu machinery; the tree roaming applies to the rail items only.
- In collapsed mode (`collapsed`) the action menu (`actions`) is hidden; the action button only renders in expanded mode.
- The collapsed flyout defaults to `hover` triggering; switch it via `dropdownMenuProps.trigger: 'click'`.
- Toggling `collapsed` stashes and restores the expansion state; the original expanded branches survive the collapse round trip.
- The action button's accessible name comes from the `treeMenu.openActions` template (with the `{label}` placeholder) and follows the `ConfigProvider` locale across 13 languages.
- A node's `disabled` blocks activation/expansion/actions; disabled items render `data-disabled` and native `disabled` semantics.
- Clicking a leaf activates it and emits `update:modelValue`; clicking an item with children toggles expansion and emits `update:expanded`.
- With `expandStrategy="selected"` the expanded state is re-synced to the selected menu path whenever the selected menu changes or the strategy switches to `selected`; manually expanded non-selected branches stay open until the next selection.
- Data attributes use only `data-vean-tree-menu-*` (D1-07) with no redundant attributes.
- `size` supports 8 steps from xs to 2xl; style overrides are injected via `ui` (20+ named slots) and the root `class`.

## FAQ

### Which keyboard shortcuts does the tree menu support?

The menu is a single tab stop following the WAI-ARIA tree pattern: entering the tree focuses the active item (or the first one), ↑/↓ roam visible items (skipping disabled ones), → expands a closed branch and a second press enters its first child, ← collapses or returns to the parent, Home/End jump to the first/last visible item, and Enter/Space activate.

### How do I build a collapsible sidebar menu?

Bind `v-model:collapsed` to the collapsed state; `collapsedWidth` (default 50px) controls the rail width and `indent` the child indentation:

```vue
<STreeMenu v-model:collapsed="collapsed" :items="items" />
```

### How do flyout submenus work when collapsed?

Items with children automatically render a flyout menu in collapsed mode (default `hover` trigger; switch to `click` via `dropdownMenuProps.trigger`). The flyout's active state is synced with `modelValue`.

### How do I add action buttons to an item?

```vue
<STreeMenu :items="items" />
<!-- in items: -->
{ label: 'Design Engineering', value: 'design-engineering', actions: [ { label: 'Edit', value: 'edit', icon:
'lucide:pencil' }, { label: 'Delete', value: 'delete', icon: 'lucide:trash' } ], onActionSelect: action =>
console.log('select', action.value) }
```

Hovering the item reveals an ellipsis button at the end; clicking it opens the action menu. The button aria-label is localized automatically (`Open {label} actions`).

### How do I control the active and expanded items?

Controlled: `v-model:modelValue="active"`, `v-model:expanded="expandedKeys"`, `v-model:collapsed="collapsed"`; uncontrolled initial values use `default-value` / `default-expanded` / `default-collapsed`. The activation event is `update:modelValue` and the expansion event is `update:expanded`.

### What is the difference between the `keep` and `active` expand strategies?

`expandStrategy` decides how the expanded state relates to the active menu. With `keep` (default) expansion is purely manual: activating another menu never changes what is expanded or collapsed. With `active` the menu follows the active item — whenever the active menu changes (or you switch to `active`), only the active menu and all its ancestor menus stay expanded and every other branch collapses:

```vue
<STreeMenu :items="items" expand-strategy="selected" />
```

Use `keep` for free-form browsing where the user controls every branch, and `active` for navigation-driven sidebars where the current route's path should always stay visible.

### How do I create groups?

Set `isGroup: true` on a node with `children` to turn it into a group; customize the group title through the `group-label` slot:

```vue
<STreeMenu :items="items">
  <template #group-label="{ item }">{{ item.label }} ({{ item.children.length }})</template>
</STreeMenu>
```

### How do I add link items?

```vue
{ label: 'Vean', value: 'vean', href: 'https://veanui.com' } { label: 'About', value: 'about', to: '/about' }
```

External links automatically show the arrow-up-right icon; `external: true` forces external-link handling.

### How do I customize icons, badges, and tags?

Built-in fields: `icon` (icon), `badge` + `badgeProps` (badge), `tag` + `tagProps` (tag). For richer content use the `item-leading`/`item-trailing`/`item` slots:

```vue
<STreeMenu :items="items">
  <template #item-leading="{ item }">
    <span class="text-primary">{{ item.label.slice(0, 1) }}</span>
  </template>
</STreeMenu>
```

### How do I disable an item?

Set `disabled: true` on the node to block activation/expansion/actions; disabled items render `data-disabled` and native `disabled` semantics.

### How do I style a custom row like a menu item?

Render `STreeMenuStyledItem` — it is the row the menu items themselves are drawn with, so it takes the same size recipe, the same icon column, and the same fold: inside a collapsed ancestor (`group` + `data-state="collapsed"`) the row narrows to the item's icon width. Pass `size` to match the menu, `as` / `asChild` when the row is not a button (a `div` for a non-interactive brand, `asChild` to merge into your own link), and `disabled` to mark it. When the row folds it is icon-only, so hide the label yourself and center the icon — a mark wider than the folded content box would otherwise sit against the row's trailing edge: `:ui="{ button: 'group-data-[state=collapsed]:justify-center' }"`.

### How is the action button aria-label localized?

Switch the `ConfigProvider` locale (13 built-in language packs); the action button uses the `treeMenu.openActions` template — `Open {label} actions` — where `{label}` is replaced by the item label.
