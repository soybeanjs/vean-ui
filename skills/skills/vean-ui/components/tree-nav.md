# TreeNav

Source URL: https://veanui.com/components/tree-nav
Markdown URL: https://veanui.com/components/tree-nav.md
Category: Navigation
Description: TreeNav is a data-driven horizontal navigation bar with a persistent selection state: top-level entries sit in a row, branch entries open dropdown popups (hover by default), and selecting any leaf keeps the whole ancestor chain highlighted.

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

Usage examples for tree-nav are rendered on the site.

## Demos

Interactive demos for tree-nav are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (6): TreeNav, TreeNavCompact, TreeNavOptionCompact, TreeNavOptionsCompact, TreeNavOverflow, TreeNavRoot.

### TreeNav

#### Props

Properties for the TreeNav component.

- `class`: class of tree-nav root. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<TreeNavUi>`; optional)
- `collapsible`: Whether top-level overflow items collapse into a trailing "more" branch popup so the bar always fits inside its container. (type `boolean`; default `false`; optional)
- `modelValue`: The value of the currently selected item. Can be used as `v-model`. (type `string`; optional)
- `defaultValue`: The value of the item that should be selected when initially rendered. (type `string`; optional)
- `dir`: The reading direction of the component when applicable. (type `Direction`; optional)
- `trigger`: How branch popups are opened. - `click`: The popup will be opened when the trigger is clicked. - `hover`: The popup will be opened when the trigger is hovered. (type `DropdownMenuTriggerType`; default `'hover'`; optional)
- `delayDuration`: The duration from when the pointer enters a branch trigger until the popup gets opened in hover mode. (type `number`; default `150`; optional)
- `skipDelayDuration`: How much time a user has to enter another branch trigger without incurring a delay again. (type `number`; default `300`; optional)
- `placement`: The preferred placement of branch popups relative to their trigger. (type `Placement`; default `'bottom-start'`; optional)
- `showArrow`: Whether branch popups show an arrow. (type `boolean`; default `false`; optional)
- `disabled`: Whether the whole navigation bar is disabled. (type `boolean`; optional)
- `linkProps`: Properties forwarded to the link element of link items. (type `LinkExtraProps`; optional)
- `itemProps`: Properties forwarded to the item element of popup items. (type `MenuItemProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element of popup group labels. (type `MenuGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element of popup items. (type `MenuShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element of popup separators. (type `MenuSeparatorProps`; optional)
- `subTriggerProps`: Properties forwarded to the sub trigger element of popup branches. (type `MenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the sub content element of popup branches. (type `MenuSubContentProps`; optional)
- `portalProps`: Properties forwarded to the portal element of popups. (type `MenuPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element of popups. (type `MenuPopupProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element of branch popups. (type `DropdownMenuTriggerProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element of popups. (type `MenuArrowProps`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `items`: Top-level items rendered as visible entries. (type `TreeNavOptionData<TreeNavBaseOptionData>[]`; required)
- `moreItems`: Items collapsed into the trailing "more" popup. (type `TreeNavOptionData<TreeNavBaseOptionData>[]`; optional)
- `moreLabel`: Label of the trailing "more" trigger. (type `string`; default `'More'`; optional)
- `moreIcon`: Icon of the trailing "more" trigger. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'lucide:ellipsis'`; optional)
- `moreProps`: Properties forwarded to the trailing "more" trigger button. (type `ButtonProps`; optional)

#### Emits

Events for the TreeNav component.

- `update:modelValue`: Emitted when the selected value changes. (type `[value: string]`; parameters `value: string`)
- `select`: Emitted when an item is selected. (type `[item: TreeNavOptionData<TreeNavBaseOptionData>, event: Event]`; parameters `item: TreeNavOptionData<TreeNavBaseOptionData>, event: Event`)

#### Slots

Slots for the TreeNav component.

- `item`: Custom content for the item slot. (type `((props: { item: MenuOptionData<DefinedValue>; isTrigger?: boolean; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-trigger-icon`: Custom content for the item trigger icon slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-link-icon`: Custom content for the item link icon slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `more-trigger`: Custom content for the trailing "more" trigger when present. (type `((props: TreeNavMoreEntry) => any) | undefined`)

### TreeNavCompact

#### Props

Properties for the TreeNavCompact component.

- `collapsible`: Whether top-level overflow items collapse into a trailing "more" branch popup so the bar always fits inside its container. (type `boolean`; default `false`; optional)
- `modelValue`: The value of the currently selected item. Can be used as `v-model`. (type `string`; optional)
- `defaultValue`: The value of the item that should be selected when initially rendered. (type `string`; optional)
- `dir`: The reading direction of the component when applicable. (type `Direction`; optional)
- `trigger`: How branch popups are opened. - `click`: The popup will be opened when the trigger is clicked. - `hover`: The popup will be opened when the trigger is hovered. (type `DropdownMenuTriggerType`; default `'hover'`; optional)
- `delayDuration`: The duration from when the pointer enters a branch trigger until the popup gets opened in hover mode. (type `number`; default `150`; optional)
- `skipDelayDuration`: How much time a user has to enter another branch trigger without incurring a delay again. (type `number`; default `300`; optional)
- `placement`: The preferred placement of branch popups relative to their trigger. (type `Placement`; default `'bottom-start'`; optional)
- `showArrow`: Whether branch popups show an arrow. (type `boolean`; default `false`; optional)
- `disabled`: Whether the whole navigation bar is disabled. (type `boolean`; optional)
- `linkProps`: Properties forwarded to the link element of link items. (type `LinkExtraProps`; optional)
- `itemProps`: Properties forwarded to the item element of popup items. (type `MenuItemProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element of popup group labels. (type `MenuGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element of popup items. (type `MenuShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element of popup separators. (type `MenuSeparatorProps`; optional)
- `subTriggerProps`: Properties forwarded to the sub trigger element of popup branches. (type `MenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the sub content element of popup branches. (type `MenuSubContentProps`; optional)
- `portalProps`: Properties forwarded to the portal element of popups. (type `MenuPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element of popups. (type `MenuPopupProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element of branch popups. (type `DropdownMenuTriggerProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element of popups. (type `MenuArrowProps`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `items`: Top-level items rendered as visible entries. (type `TreeNavOptionData<TreeNavBaseOptionData>[]`; required)
- `moreItems`: Items collapsed into the trailing "more" popup. (type `TreeNavOptionData<TreeNavBaseOptionData>[]`; optional)
- `moreLabel`: Label of the trailing "more" trigger. (type `string`; default `'More'`; optional)
- `moreIcon`: Icon of the trailing "more" trigger. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'lucide:ellipsis'`; optional)
- `moreProps`: Properties forwarded to the trailing "more" trigger button. (type `ButtonProps`; optional)

#### Emits

Events for the TreeNavCompact component.

- `update:modelValue`: Emitted when the selected value changes. (type `[value: string]`; parameters `value: string`)
- `select`: Emitted when an item is selected. (type `[item: TreeNavOptionData<TreeNavBaseOptionData>, event: Event]`; parameters `item: TreeNavOptionData<TreeNavBaseOptionData>, event: Event`)

#### Slots

Slots for the TreeNavCompact component.

- `item`: Custom content for the item slot. (type `((props: { item: MenuOptionData<DefinedValue>; isTrigger?: boolean; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-trigger-icon`: Custom content for the item trigger icon slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-link-icon`: Custom content for the item link icon slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `more-trigger`: Custom content for the trailing "more" trigger when present. (type `((props: TreeNavMoreEntry) => any) | undefined`)

### TreeNavOptionCompact

#### Props

Properties for the TreeNavOptionCompact component.

- `item`: Current item data. (type `Omit<TreeNavBaseOptionData, 'children'> & { children?: TreeNavOptionData<TreeNavBaseOptionData>[] | undefined; }`; required)
- `childSelected`: Whether the selected leaf lives inside this branch subtree. (type `boolean`; optional)

### TreeNavOptionsCompact

#### Props

Properties for the TreeNavOptionsCompact component.

- `items`: Top-level items rendered as visible entries. (type `TreeNavOptionData<TreeNavBaseOptionData>[]`; required)
- `moreItems`: Items collapsed into the trailing "more" popup. (type `TreeNavOptionData<TreeNavBaseOptionData>[]`; optional)
- `moreLabel`: Label of the trailing "more" trigger. (type `string`; default `'More'`; optional)
- `moreIcon`: Icon of the trailing "more" trigger. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'lucide:ellipsis'`; optional)
- `moreProps`: Properties forwarded to the trailing "more" trigger button. (type `ButtonProps`; optional)

#### Slots

Slots for the TreeNavOptionsCompact component.

- `item`: Custom content for the item slot. (type `((props: { item: MenuOptionData<DefinedValue>; isTrigger?: boolean; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-trigger-icon`: Custom content for the item trigger icon slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `item-link-icon`: Custom content for the item link icon slot. (type `((props: { item: MenuOptionData<DefinedValue>; }) => any) | undefined`)
- `more-trigger`: Custom content for the trailing "more" trigger when present. (type `((props: TreeNavMoreEntry) => any) | undefined`)

### TreeNavOverflow

- No documented props, emits, slots, or slot props were available.

### TreeNavRoot

#### Props

Properties for the TreeNavRoot component.

- `modelValue`: The value of the currently selected item. Can be used as `v-model`. (type `string`; optional)
- `defaultValue`: The value of the item that should be selected when initially rendered. (type `string`; optional)
- `dir`: The reading direction of the component when applicable. (type `Direction`; optional)
- `trigger`: How branch popups are opened. - `click`: The popup will be opened when the trigger is clicked. - `hover`: The popup will be opened when the trigger is hovered. (type `DropdownMenuTriggerType`; default `'hover'`; optional)
- `delayDuration`: The duration from when the pointer enters a branch trigger until the popup gets opened in hover mode. (type `number`; default `150`; optional)
- `skipDelayDuration`: How much time a user has to enter another branch trigger without incurring a delay again. (type `number`; default `300`; optional)
- `placement`: The preferred placement of branch popups relative to their trigger. (type `Placement`; default `'bottom-start'`; optional)
- `showArrow`: Whether branch popups show an arrow. (type `boolean`; default `false`; optional)
- `disabled`: Whether the whole navigation bar is disabled. (type `boolean`; optional)
- `linkProps`: Properties forwarded to the link element of link items. (type `LinkExtraProps`; optional)
- `itemProps`: Properties forwarded to the item element of popup items. (type `MenuItemProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element of popup group labels. (type `MenuGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element of popup items. (type `MenuShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element of popup separators. (type `MenuSeparatorProps`; optional)
- `subTriggerProps`: Properties forwarded to the sub trigger element of popup branches. (type `MenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the sub content element of popup branches. (type `MenuSubContentProps`; optional)
- `portalProps`: Properties forwarded to the portal element of popups. (type `MenuPortalProps`; optional)
- `popupProps`: Properties forwarded to the popup element of popups. (type `MenuPopupProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element of branch popups. (type `DropdownMenuTriggerProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element of popups. (type `MenuArrowProps`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the TreeNavRoot component.

- `update:modelValue`: Emitted when the selected value changes. (type `[value: string]`; parameters `value: string`)
- `select`: Emitted when an item is selected. (type `[item: TreeNavOptionData<TreeNavBaseOptionData>, event: Event]`; parameters `item: TreeNavOptionData<TreeNavBaseOptionData>, event: Event`)

#### Slots

Slots for the TreeNavRoot component.

- `default`: Default content rendered inside the nav root. (type `(() => any) | undefined`)

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
