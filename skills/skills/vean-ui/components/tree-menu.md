# TreeMenu

Source URL: https://veanui.com/components/tree-menu
Markdown URL: https://veanui.com/components/tree-menu.md
Category: Navigation
Description: A collapsible sidebar navigation tree-menu component. STreeMenu combines the Aria TreeMenuCompact family of composite components (TreeMenuRoot/TreeMenuOptionCompact/TreeMenuSlotCompact, zero-style) with the TreeMenuRoot context (controlled/uncontrolled activation and expansion, collapsed sidebar mode, flyout submenus when collapsed, action menus); the UI layer only injects the 8-step size recipe and slot classes. The recursive items data model ships with built-in icon/badge/tag/actions/isGroup/link fields, and node content can be freely customized through the item/item-leading/item-trailing slots.

## Overview

A collapsible sidebar navigation tree-menu component. `STreeMenu` combines the Aria `TreeMenuCompact` family of composite components (`TreeMenuRoot`/`TreeMenuOptionCompact`/`TreeMenuSlotCompact`, zero-style) with the `TreeMenuRoot` context (controlled/uncontrolled activation and expansion, collapsed sidebar mode, flyout submenus when collapsed, action menus); the UI layer only injects the 8-step size recipe and slot classes. The recursive `items` data model ships with built-in `icon`/`badge`/`tag`/`actions`/`isGroup`/link fields, and node content can be freely customized through the `item`/`item-leading`/`item-trailing` slots.

## Usage

Usage examples for tree-menu are rendered on the site.

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

Interactive demos for tree-menu are rendered on the site.

- 01 Basic — customizer for the sidebar: `expandStrategy` / `collapsed` / `collapsedWidth` / `indent` / `size` controls over groups/icons/badge/tag/action menus/link items

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (17): TreeMenu, TreeMenuBadge, TreeMenuBaseItem, TreeMenuButton, TreeMenuCollapsible, TreeMenuCompact, TreeMenuGroup, TreeMenuGroupLabel, TreeMenuGroupRoot, TreeMenuItem, TreeMenuOptionCompact, TreeMenuOptionsCompact, TreeMenuOptionSlotCompact, TreeMenuRoot, TreeMenuSlotCompact, TreeMenuStyledItem, TreeMenuSub.

### TreeMenu

#### Props

Properties for the TreeMenu component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<Record<TreeMenuUiSlot, ClassValue>>`; optional)
- `modelValue`: the selected value of the tree menu. can be bound-with with `v-model`. (type `string`; optional)
- `defaultValue`: the value of the tree menu when initially rendered. use when you do not need to control the state of the tree. (type `string`; optional)
- `expanded`: the expanded value of the tree menu. can be bound-with with `v-model`. (type `string[]`; optional)
- `defaultExpanded`: the expanded value of the tree menu when initially rendered. use when you do not need to control the state of the tree. (type `string[]`; optional)
- `expandStrategy`: The expand strategy of the tree menu. - `keep`: keep the current expanded state; manually expanded or collapsed menus are not affected by activating other menus. The collapsible ancestors of the selected menu are expanded on mount and whenever the selected menu changes from outside (e.g. driven by an external route), so it stays visible. - `selected`: only expand the currently selected menu and all its ancestor menus; non-selected menus are collapsed when the selected menu changes. (type `TreeMenuExpandStrategy`; default `'keep'`; optional)
- `collapsed`: Whether the tree menu is collapsed. (type `boolean`; default `false`; optional)
- `defaultCollapsed`: The value of the tree menu when it's collapsed. (type `boolean`; optional)
- `collapsedWidth`: The width of the sidebar menu when it's collapsed. (type `number`; default `50`; optional)
- `indent`: The width of the indent. (type `number`; default `16`; optional)
- `pxToRem`: The function to convert pixels to rem. (type `((px: number) => number)`; default `(px: number) => px / 16 (16 is the base font size)`; optional)
- `items`: Items rendered by the component. (type `TreeMenuOptionData<T>[]`; required)
- `groupRootProps`: Properties forwarded to the group root element. (type `TreeMenuGroupRootProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `TreeMenuGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `TreeMenuGroupLabelProps`; optional)
- `showGroupIcon`: Whether to show the group icon. (type `boolean`; default `false`; optional)
- `side`: Horizontal side. (type `HorizontalSide`; optional)
- `itemProps`: Properties forwarded to the item element. (type `TreeMenuItemProps`; optional)
- `buttonProps`: Properties forwarded to the button element. (type `TreeMenuButtonProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `collapsibleProps`: Properties forwarded to the collapsible element. (type `TreeMenuCollapsibleProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `TreeMenuSubProps`; optional)

#### Emits

Events for the TreeMenu component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:expanded`: Emitted when the expanded state changes. (type `[value: string[]]`; parameters `value: string[]`)
- `update:collapsed`: Emitted when the collapsed state changes. (type `[value: boolean]`; parameters `value: boolean`)
- `selectDropdown`: Emitted when select dropdown occurs. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the TreeMenu component.

- `top`: Custom content rendered before the options. (type `(() => any) | undefined`)
- `bottom`: Custom content rendered after the options. (type `(() => any) | undefined`)
- `group-label`: Custom content for the group label slot. (type `((props: { item: TreeMenuOptionData<T>; }) => any) | undefined`)
- `item`: Custom content for the item slot. (type `((props: { item: T; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: T; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: T; }) => any) | undefined`)

### TreeMenuBadge

#### Props

Properties for the badge markup rendered inside a TreeMenu option.

The `badge` family is UI-only (it failed aria admission), so the tree-menu renders its own
badge anatomy instead of composing an aria badge primitive. The shape mirrors the retired
`BadgeCompactProps` minus `content`, which the option supplies through `TreeMenuBaseOptionData.badge`.

- `open`: Whether the badge bubble is rendered. (type `boolean`; default `true`; optional)
- `contentProps`: Properties forwarded to the badge bubble element. (type `BaseProps`; optional)

### TreeMenuBaseItem

#### Props

Properties for the TreeMenuBaseItem component.

- `value`: The unique value of the item. (type `string`; required)
- `disabled`: When `true`, prevents the user from interacting with the item. (type `boolean`; optional)

### TreeMenuButton

#### Props

Properties for the TreeMenuButton component.

- `disabledSelect`: When `true`, prevents the user from selecting the item. (type `boolean`; default `false`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TreeMenuCollapsible

#### Props

Properties for the TreeMenuCollapsible component.

- `disabledCollapsible`: When `true`, prevents the user from activating the collapsible trigger. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TreeMenuCompact

#### Props

Properties for the TreeMenuCompact component.

- `modelValue`: the selected value of the tree menu. can be bound-with with `v-model`. (type `string`; optional)
- `defaultValue`: the value of the tree menu when initially rendered. use when you do not need to control the state of the tree. (type `string`; optional)
- `expanded`: the expanded value of the tree menu. can be bound-with with `v-model`. (type `string[]`; optional)
- `defaultExpanded`: the expanded value of the tree menu when initially rendered. use when you do not need to control the state of the tree. (type `string[]`; optional)
- `expandStrategy`: The expand strategy of the tree menu. - `keep`: keep the current expanded state; manually expanded or collapsed menus are not affected by activating other menus. The collapsible ancestors of the selected menu are expanded on mount and whenever the selected menu changes from outside (e.g. driven by an external route), so it stays visible. - `selected`: only expand the currently selected menu and all its ancestor menus; non-selected menus are collapsed when the selected menu changes. (type `TreeMenuExpandStrategy`; default `'keep'`; optional)
- `collapsed`: Whether the tree menu is collapsed. (type `boolean`; default `false`; optional)
- `defaultCollapsed`: The value of the tree menu when it's collapsed. (type `boolean`; optional)
- `collapsedWidth`: The width of the sidebar menu when it's collapsed. (type `number`; default `50`; optional)
- `indent`: The width of the indent. (type `number`; default `16`; optional)
- `pxToRem`: The function to convert pixels to rem. (type `((px: number) => number)`; default `(px: number) => px / 16 (16 is the base font size)`; optional)
- `items`: Items rendered by the component. (type `TreeMenuOptionData<T>[]`; required)
- `groupRootProps`: Properties forwarded to the group root element. (type `TreeMenuGroupRootProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `TreeMenuGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `TreeMenuGroupLabelProps`; optional)
- `showGroupIcon`: Whether to show the group icon. (type `boolean`; default `false`; optional)
- `side`: Horizontal side. (type `HorizontalSide`; optional)
- `itemProps`: Properties forwarded to the item element. (type `TreeMenuItemProps`; optional)
- `buttonProps`: Properties forwarded to the button element. (type `TreeMenuButtonProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `collapsibleProps`: Properties forwarded to the collapsible element. (type `TreeMenuCollapsibleProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `TreeMenuSubProps`; optional)

#### Emits

Events for the TreeMenuCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:expanded`: Emitted when the expanded state changes. (type `[value: string[]]`; parameters `value: string[]`)
- `update:collapsed`: Emitted when the collapsed state changes. (type `[value: boolean]`; parameters `value: boolean`)
- `selectDropdown`: Emitted when select dropdown occurs. (type `[value: string]`; parameters `value: string`)

#### Slots

Slots for the TreeMenuCompact component.

- `top`: Custom content rendered before the options. (type `(() => any) | undefined`)
- `bottom`: Custom content rendered after the options. (type `(() => any) | undefined`)
- `group-label`: Custom content for the group label slot. (type `((props: { item: TreeMenuOptionData<T>; }) => any) | undefined`)
- `item`: Custom content for the item slot. (type `((props: { item: T; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: T; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: T; }) => any) | undefined`)

### TreeMenuGroup

#### Props

Properties for the TreeMenuGroup component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TreeMenuGroupLabel

- No documented props, emits, slots, or slot props were available.

### TreeMenuGroupRoot

- No documented props, emits, slots, or slot props were available.

### TreeMenuItem

#### Props

Properties for the TreeMenuItem component.

- `value`: The unique value of the item. (type `string`; required)
- `disabled`: When `true`, prevents the user from interacting with the item. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TreeMenuOptionCompact

#### Props

Properties for the TreeMenuOptionCompact component.

- `as`: Rendered element tag. (type `AsTag`; optional)
- `item`: Current item data. (type `Omit<TreeMenuBaseOptionData, 'children'> & { children?: TreeMenuOptionData<TreeMenuBaseOptionData>[] | undefined; }`; required)
- `side`: Horizontal side. (type `HorizontalSide`; optional)
- `selectedPaths`: The selected paths of the tree menu, used to determine whether the current item is selected or has selected descendants. (type `string[]`; optional)
- `itemProps`: Properties forwarded to the item element. (type `TreeMenuItemProps`; optional)
- `buttonProps`: Properties forwarded to the button element. (type `TreeMenuButtonProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `collapsibleProps`: Properties forwarded to the collapsible element. (type `TreeMenuCollapsibleProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `TreeMenuSubProps`; optional)

#### Emits

Events for the TreeMenuOptionCompact component.

- `selectDropdown`: Emitted when select dropdown occurs. (type `[value: string]`; parameters `value: string`)

### TreeMenuOptionsCompact

#### Props

Properties for the TreeMenuOptionsCompact component.

- `items`: Items rendered by the component. (type `TreeMenuOptionData<T>[]`; required)
- `groupRootProps`: Properties forwarded to the group root element. (type `TreeMenuGroupRootProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `TreeMenuGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `TreeMenuGroupLabelProps`; optional)
- `showGroupIcon`: Whether to show the group icon. (type `boolean`; default `false`; optional)
- `side`: Horizontal side. (type `HorizontalSide`; optional)
- `itemProps`: Properties forwarded to the item element. (type `TreeMenuItemProps`; optional)
- `buttonProps`: Properties forwarded to the button element. (type `TreeMenuButtonProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `collapsibleProps`: Properties forwarded to the collapsible element. (type `TreeMenuCollapsibleProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `TreeMenuSubProps`; optional)

#### Emits

Events for the TreeMenuOptionsCompact component.

- `selectDropdown`: Emitted when select dropdown occurs. (type `[value: string]`; parameters `value: string`)

### TreeMenuOptionSlotCompact

#### Props

Slot properties for the TreeMenuOptionCompact component.

- `showLinkIcon`: Whether to show the link icon. (type `boolean`; optional)
- `as`: Rendered element tag. (type `AsTag`; optional)
- `item`: Current item data. (type `Omit<TreeMenuBaseOptionData, 'children'> & { children?: TreeMenuOptionData<TreeMenuBaseOptionData>[] | undefined; }`; required)
- `side`: Horizontal side. (type `HorizontalSide`; optional)
- `selectedPaths`: The selected paths of the tree menu, used to determine whether the current item is selected or has selected descendants. (type `string[]`; optional)
- `itemProps`: Properties forwarded to the item element. (type `TreeMenuItemProps`; optional)
- `buttonProps`: Properties forwarded to the button element. (type `TreeMenuButtonProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `collapsibleProps`: Properties forwarded to the collapsible element. (type `TreeMenuCollapsibleProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `TreeMenuSubProps`; optional)

### TreeMenuRoot

#### Props

Properties for the TreeMenuRoot component.

- `modelValue`: the selected value of the tree menu. can be bound-with with `v-model`. (type `string`; optional)
- `defaultValue`: the value of the tree menu when initially rendered. use when you do not need to control the state of the tree. (type `string`; optional)
- `expanded`: the expanded value of the tree menu. can be bound-with with `v-model`. (type `string[]`; optional)
- `defaultExpanded`: the expanded value of the tree menu when initially rendered. use when you do not need to control the state of the tree. (type `string[]`; optional)
- `expandStrategy`: The expand strategy of the tree menu. - `keep`: keep the current expanded state; manually expanded or collapsed menus are not affected by activating other menus. The collapsible ancestors of the selected menu are expanded on mount and whenever the selected menu changes from outside (e.g. driven by an external route), so it stays visible. - `selected`: only expand the currently selected menu and all its ancestor menus; non-selected menus are collapsed when the selected menu changes. (type `TreeMenuExpandStrategy`; default `'keep'`; optional)
- `collapsed`: Whether the tree menu is collapsed. (type `boolean`; default `false`; optional)
- `defaultCollapsed`: The value of the tree menu when it's collapsed. (type `boolean`; optional)
- `collapsedWidth`: The width of the sidebar menu when it's collapsed. (type `number`; default `50`; optional)
- `indent`: The width of the indent. (type `number`; default `16`; optional)
- `pxToRem`: The function to convert pixels to rem. (type `((px: number) => number)`; default `(px: number) => px / 16 (16 is the base font size)`; optional)

#### Emits

Events for the TreeMenuRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `update:expanded`: Emitted when the expanded state changes. (type `[value: string[]]`; parameters `value: string[]`)
- `update:collapsed`: Emitted when the collapsed state changes. (type `[value: boolean]`; parameters `value: boolean`)

### TreeMenuSlotCompact

- No documented props, emits, slots, or slot props were available.

### TreeMenuStyledItem

#### Props

Properties for the TreeMenuStyledItem component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<Record<TreeMenuStyledItemUiSlot, ClassValue>>`; optional)
- `disabled`: Whether the row is disabled. The row carries `data-disabled` — what the recipe's disabled styles key on — and `aria-disabled`. A native `button` row additionally gets the `disabled` attribute; every other element only declares the state, so nested content (for example a trigger inside the row) decides how it blocks itself. (type `boolean`; default `false`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Slots

Slots for the TreeMenuStyledItem component.

- `default`: Content of the row. (type `(() => any) | undefined`)

### TreeMenuSub

#### Props

Properties for the TreeMenuSub component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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

```

### How do flyout submenus work when collapsed?

Items with children automatically render a flyout menu in collapsed mode (default `hover` trigger; switch to `click` via `dropdownMenuProps.trigger`). The flyout's active state is synced with `modelValue`.

### How do I add action buttons to an item?

```vue
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

```

Use `keep` for free-form browsing where the user controls every branch, and `active` for navigation-driven sidebars where the current route's path should always stay visible.

### How do I create groups?

Set `isGroup: true` on a node with `children` to turn it into a group; customize the group title through the `group-label` slot:

```vue
<template #group-label="{ item }">{{ item.label }} ({{ item.children.length }})</template>
```

### How do I add link items?

```vue
{ label: 'Vean', value: 'vean', href: 'https://veanui.com' } { label: 'About', value: 'about', to: '/about' }
```

External links automatically show the arrow-up-right icon; `external: true` forces external-link handling.

### How do I customize icons, badges, and tags?

Built-in fields: `icon` (icon), `badge` + `badgeProps` (badge), `tag` + `tagProps` (tag). For richer content use the `item-leading`/`item-trailing`/`item` slots:

```vue
<template #item-leading="{ item }">
  <span class="text-primary">{{ item.label.slice(0, 1) }}</span>
</template>
```

### How do I disable an item?

Set `disabled: true` on the node to block activation/expansion/actions; disabled items render `data-disabled` and native `disabled` semantics.

### How do I style a custom row like a menu item?

Render `STreeMenuStyledItem` — it is the row the menu items themselves are drawn with, so it takes the same size recipe, the same icon column, and the same fold: inside a collapsed ancestor (`group` + `data-state="collapsed"`) the row narrows to the item's icon width. Pass `size` to match the menu, `as` / `asChild` when the row is not a button (a `div` for a non-interactive brand, `asChild` to merge into your own link), and `disabled` to mark it. When the row folds it is icon-only, so hide the label yourself and center the icon — a mark wider than the folded content box would otherwise sit against the row's trailing edge: `:ui="{ button: 'group-data-[state=collapsed]:justify-center' }"`.

### How is the action button aria-label localized?

Switch the `ConfigProvider` locale (13 built-in language packs); the action button uses the `treeMenu.openActions` template — `Open {label} actions` — where `{label}` is replaced by the item label.
