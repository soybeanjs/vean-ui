# AppShell

Source URL: https://veanui.com/components/app-shell
Markdown URL: https://veanui.com/components/app-shell.md
Category: Layout
Description: An aggregated application shell that assembles the layout regions, menu, breadcrumb, page tabs, brand, and footer from props and slots.

## Overview

`SAppShell` is an aggregated application shell for admin-style applications. A single `mode`, one menu tree, and a handful of props assemble the whole shell: the layout regions (sidebar, header, tabs, content, footer) plus everything that fills them — navigation, breadcrumb, page tabs, brand, and footer.

Use it when an application needs a persistent shell around routed pages — a sidebar or top-bar navigation, a breadcrumb in the header, a page-tab strip, and a footer — without writing the wiring yourself. Prefer the primitives (`SLayout`, `SSplitNav`, `STreeMenu`, `STreeNav`, `SPageTabs`, `SBreadcrumb`) when the composition does not fit; the Layout Composition demo shows the same shell assembled by hand.

`SAppShell` is the aggregation layer of the layout family. It owns one thing the primitives cannot: the **mode skeleton** — which layout orientation, which menu renderer, which region each menu pane is mounted into, and the sidebar widths those panes require. Everything else stays in the family it belongs to: `SLayout` renders the regions, `SSplitNav` / `STreeMenu` / `STreeNav` render the menu, `SBreadcrumb` and `SPageTabs` render their own bars.

Like `SLayout`, the shell is router-agnostic: it takes a menu tree, breadcrumb items, and tab items as data and reports interactions back through events. Routing, permissions, tab collections, and cache policy stay in the host, and the [playground examples](#demos) show the wiring.

## Usage

Usage examples for app-shell are rendered on the site.

## Features

- 🧭 **Six modes** — `sidebar` (nested sidebar menu), `top` (popup top-bar menu), and the four `SSplitNav` modes `dual-vertical` / `vertical-horizontal` / `horizontal-vertical` / `horizontal-dual-vertical`, forwarded verbatim.
- 📐 **A sidebar that follows the menu** — the nested-pane modes size the sidebar to the panes they actually render: `rail + tree` while a first-level menu with children is active, the rail plus the folded pane or the rail alone otherwise.
- 🧩 **Renderer per mode** — one `items` tree feeds `STreeMenu`, `STreeNav`, or `SSplitNav`, chosen by the mode; `menuProps` / `menuUi` forward to the active renderer only.
- 🌲 **A menu that mirrors the route** — `expandStrategy` (default `selected`, or `keep`) drives the nested `STreeMenu` and the split panes: the active path stays expanded and the branches the session left behind close; `top` renders `STreeNav`, which has no expand strategy.
- 🪆 **Teleport mounting** — panes that belong in another region (a top bar beside a sidebar tree) are mounted into shell-owned targets; the shell generates the ids and exposes them on the `menu` slot.
- 🍞 **Breadcrumb from the menu** — the header breadcrumb is derived from `items` and the active value: the trail down to the active menu, where every ancestor whose menu has children opens a dropdown of those children, nested like the menu itself — an entry that has children keeps its own submenu. Pass `breadcrumbs` to render your own data instead.
- 📑 **Tabs and footer** — `tabs` render in the tab region and the footer is a slot; both accept per-region props and `ui` overrides.
- 🗂️ **A collapse that follows the panes** — a collapsed sidebar keeps its rail and folds the nested pane into its own icon rail, so the sidebar narrows to the columns it actually shows instead of leaving an expanded tree beside a shrunken rail; the trigger sits in the header, or in the sidebar's bottom corner for the modes whose first level is a top bar.
- 🏷️ **Brand is a slot** — the shell renders no logo of its own: inject the mark through `#logo` and the app name through `#title`. The shell places them so they line up with the menu: a single-column sidebar renders the region as one menu row (mark and title in it, folding to the item's icon width together with the menu), while a dual-vertical sidebar hands both to the menu's own top cells — the mark over the first-level rail, the title over the nested pane below it. `logoPlacement` moves the region to the top of the sidebar, its bottom, or the header.
- 📱 **Mobile drawer** — an unset `isMobile` follows the viewport, and the sidebar becomes the layout's dialog drawer. The shell renders the `sidebar` skeleton there whatever mode is bound, so the drawer holds the **full menu tree** — brand and one nested `STreeMenu` — and a top bar or a rail has nowhere to hide. The drawer always shows the expanded navigation: a collapse picked on desktop stays on desktop.
- 🎛️ **Three override levels** — `ui` for the shell's own nodes, `layoutUi` for the layout regions it themes, `menuUi` for the menu renderer; each region also accepts a slot.
- ♿ **Accessibility inherited** — keyboard, focus, ARIA, and RTL come from the composed families; the shell only adds structure and classes.

## Demos

Interactive demos for app-shell are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (3): AppShell, AppShellBrand, AppShellMenu.

### AppShell

#### Props

Properties for the AppShell component.

- `class`: Additional class names applied to the shell root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<UiClass<AppShellUiSlot>>`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; default `'md'`; optional)
- `mode`: Shell skeleton, driving both the layout regions and the menu shape. The **desktop** skeleton: in the mobile view the shell renders the `sidebar` one instead, so the drawer holds one nested tree holding the full menu. (type `AppShellMode`; default `'sidebar'`; optional)
- `side`: Side the sidebar is placed on. (type `import("@vean/aria").HorizontalSide`; default `'left'`; optional)
- `open`: The controlled expanded state of the sidebar. Can be bound with `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The expanded state of the sidebar when initially rendered. (type `boolean`; default `true`; optional)
- `mobileOpen`: The controlled open state of the mobile drawer. Can be bound with `v-model:mobileOpen`. The shell renders the drawer through `SLayout`, where the drawer is the mobile counterpart of the desktop sidebar and carries its own state. (type `boolean`; optional)
- `defaultMobileOpen`: The open state of the mobile drawer when it is initially rendered. (type `boolean`; default `false`; optional)
- `isMobile`: Whether the shell is in mobile view. When omitted, it is forwarded unset and `SLayout` resolves the mode: a viewport published by a host through `provideViewportContext`, then `useMediaQuery('(max-width: 767.9px)')`. Pass an explicit boolean to force it, e.g. for a server-side detection. (type `boolean`; optional)
- `layoutProps`: Properties forwarded to `SLayout`. Shell-owned options (`open`, `orientation`, `sidebarVisible`, `isMobile`, `pxToRem`) are derived from `mode`; `sidebarWidth` and `collapsedSidebarWidth` default to the widths the mode requires — override them only when the menu panes do not need to line up. (type `Omit<LayoutCompactProps, 'open' | 'defaultOpen' | 'class' | 'pxToRem' | 'mobileOpen' | 'defaultMobileOpen' | 'orienta...`; optional)
- `layoutUi`: Per-slot class overrides for the internal `SLayout`. Takes precedence over the shell's `layout*` UI slots. (type `Partial<LayoutUi>`; optional)
- `logoPlacement`: Placement of the brand region. `auto` follows the skeleton the shell renders; `sidebar` and `sidebar-bottom` need a skeleton whose sidebar is always a column of its own — see `AppShellLogoPlacement` for the modes that support the bottom placement. In the mobile view that skeleton is the `sidebar` one, so `auto` puts the brand in the drawer whatever mode is bound. (type `AppShellLogoPlacement`; default `'auto'`; optional)
- `expandStrategy`: The expand strategy of the rendered menu. - `keep`: keep the current expanded state; manually expanded or collapsed menus are not affected by activating other menus. The collapsible ancestors of the selected menu are expanded on mount and whenever the selected menu changes from outside (e.g. driven by an external route), so it stays visible. - `selected`: only expand the currently selected menu and all its ancestor menus; non-selected menus are collapsed when the selected menu changes. The shell defaults to `selected`: the navigation mirrors the current route, so one path stays expanded and the active entry keeps its place instead of competing with the branches opened earlier in the session. Applies to the single `STreeMenu` (`sidebar` mode) and to the nested vertical panes of `SSplitNav` (the split modes). `top` mode renders `STreeNav`, which has no expand strategy. `menuProps.tree` / `menuProps.split` take precedence over this prop. (type `TreeMenuExpandStrategy`; default `'selected'`; optional)
- `items`: Menu tree rendered by the shell. (type `AppShellMenuItem[]`; required)
- `modelValue`: The controlled active menu value. Can be bound with `v-model`. The active menu is controlled only: the shell derives the sidebar geometry and the breadcrumb from it before rendering, so it reads the value it is given rather than keeping one of its own. (type `string`; optional)
- `menuProps`: Properties forwarded to the rendered menu. (type `AppShellMenuProps`; optional)
- `menuUi`: Per-slot class overrides forwarded to the rendered menu. (type `AppShellMenuUi`; optional)
- `breadcrumbs`: Breadcrumb items rendered in the header. Omit it to derive the breadcrumb from `items` and the active value: the trail from the root menu down to the active item, where every ancestor whose menu has children opens a dropdown of those children — nested like the menu itself, so an entry that has children keeps its own submenu. Provide it to render a plain breadcrumb from your own data instead. (type `BreadcrumbOptionData[]`; optional)
- `breadcrumbVisible`: Whether the breadcrumb region renders when the trail is not empty. The region is hidden below the `md` breakpoint either way: a phone header keeps its trigger and its trailing actions. Bind `ui.breadcrumb` (e.g. `lt-md:flex`) to bring it back there. (type `boolean`; default `true`; optional)
- `breadcrumbProps`: Properties forwarded to `SBreadcrumb`. (type `Omit<BreadcrumbCompactProps<BreadcrumbOptionData>, 'items'>`; optional)
- `breadcrumbUi`: Per-slot class overrides for `SBreadcrumb`. (type `Partial<BreadcrumbUi>`; optional)
- `tabs`: Page tabs rendered in the tab region. (type `PageTabsOptionData[]`; optional)
- `tabValue`: The controlled active tab value. Can be bound with `v-model:tabValue`. (type `string`; optional)
- `tabProps`: Properties forwarded to `SPageTabs`. (type `Omit<PageTabsCompactProps<PageTabsOptionData>, 'modelValue' | 'defaultValue' | 'items'>`; optional)
- `tabUi`: Per-slot class overrides for `SPageTabs`. (type `Partial<PageTabsUi>`; optional)
- `triggerVisible`: Whether the sidebar trigger renders in the header. (type `boolean`; default `true`; optional)

#### Emits

Events for the AppShell component.

- `update:open`: Emitted when the sidebar expanded state changes. (type `[open: boolean]`; parameters `open: boolean`)
- `update:mobileOpen`: Emitted when the mobile drawer open state changes. (type `[open: boolean]`; parameters `open: boolean`)
- `update:modelValue`: Emitted when the active menu value changes. (type `[value: string]`; parameters `value: string`)
- `select`: Emitted when a menu leaf is selected. (type `[key: string, event?: Event | undefined]`; parameters `key: string, event?: Event | undefined`)
- `open`: Emitted when a menu parent opens its nested pane. (type `[item: AppShellMenuItem, event?: Event | undefined]`; parameters `item: AppShellMenuItem, event?: Event | undefined`)
- `update:tabValue`: Emitted when the active tab changes. (type `[value: string]`; parameters `value: string`)
- `update:tabs`: Emitted when the tab collection changes (close, pin, drag reorder). (type `[tabs: PageTabsOptionData[]]`; parameters `tabs: PageTabsOptionData[]`)
- `tabClick`: Emitted when a tab is clicked. (type `[tab: PageTabsOptionData]`; parameters `tab: PageTabsOptionData`)
- `tabClose`: Emitted when a tab is closed. (type `[tab: PageTabsOptionData]`; parameters `tab: PageTabsOptionData`)
- `tabPin`: Emitted when a tab is pinned or unpinned. (type `[tab: PageTabsOptionData]`; parameters `tab: PageTabsOptionData`)
- `tabContextmenu`: Emitted when the tab context menu target changes. (type `[tab: PageTabsOptionData]`; parameters `tab: PageTabsOptionData`)
- `tabSelectContextMenu`: Emitted when a tab context menu item is selected. (type `[menu: PageTabsContextMenuOptionData, tab: PageTabsOptionData]`; parameters `menu: PageTabsContextMenuOptionData, tab: PageTabsOptionData`)
- `tabDragStart`: Emitted when dragging a tab starts. (type `[tab: PageTabsDragEvent<PageTabsOptionData>]`; parameters `tab: PageTabsDragEvent<PageTabsOptionData>`)
- `tabDragMove`: Emitted while a tab is being dragged. (type `[tab: PageTabsDragEvent<PageTabsOptionData>]`; parameters `tab: PageTabsDragEvent<PageTabsOptionData>`)
- `tabDragReorder`: Emitted when the dragged tab is reordered in place. (type `[tab: PageTabsDragEvent<PageTabsOptionData>]`; parameters `tab: PageTabsDragEvent<PageTabsOptionData>`)
- `tabDragEnd`: Emitted when dragging a tab ends. (type `[tab: PageTabsDragEvent<PageTabsOptionData>]`; parameters `tab: PageTabsDragEvent<PageTabsOptionData>`)
- `breadcrumbClick`: Emitted when a breadcrumb item is clicked. (type `[item: BreadcrumbOptionData]`; parameters `item: BreadcrumbOptionData`)

#### Slots

Slots for the AppShell component.

- `default`: Custom content for the default slot — the page content. (type `(() => any) | undefined`)
- `logo`: Custom content for the brand mark. The shell renders it in a cell of its own so the brand lines up with the menu: over the first-level rail of the rail modes, and centered while the sidebar is collapsed. In the sidebar placement of the dual-vertical shapes that cell is the menu's own `top-left` one, so the rail's divider runs through the mark instead of the shell drawing a second one; every other placement renders the region beside the menu. The region renders as soon as this slot is provided; `title` is optional. (type `((props: AppShellBrandSlotProps) => any) | undefined`)
- `title`: Custom content for the brand title. Rendered next to the mark, and aligned to the sidebar's second (nested pane) column in the rail modes — through the menu's own `top-right` cell in the dual-vertical shapes. It is hidden while the sidebar is collapsed — the column it aligns to is folded away — and in placements that have no pane column to align to. (type `((props: AppShellBrandSlotProps) => any) | undefined`)
- `sidebar-start`: Custom content rendered at the top of the sidebar. (type `(() => any) | undefined`)
- `sidebar-end`: Custom content rendered at the bottom of the sidebar. (type `(() => any) | undefined`)
- `menu`: Custom content for the menu. Replaces the menu instance, not the mount targets. (type `((props: AppShellMenuSlotProps) => any) | undefined`)
- `header-start`: Custom content for the header leading region. (type `(() => any) | undefined`)
- `header`: Custom content for the header center region. (type `(() => any) | undefined`)
- `header-end`: Custom content for the header trailing region. (type `(() => any) | undefined`)
- `breadcrumb`: Custom content for the breadcrumb region. (type `((props: { items: BreadcrumbOptionData[]; }) => any) | undefined`)
- `tabs`: Custom content for the tab region. (type `(() => any) | undefined`)
- `footer`: Custom content for the footer region. (type `(() => any) | undefined`)

### AppShellBrand

#### Slot Props

Slot properties of the brand slots.

- `collapsed`: Whether the sidebar is collapsed. (type `boolean`; required)
- `placement`: Region the brand is rendered in. (type `'header' | 'sidebar' | 'sidebar-bottom'`; required)

### AppShellMenu

#### Props

Per-renderer props forwarded by the shell to the menu it renders.

- `tree`: Forwarded to the nested `STreeMenu` (`sidebar` mode). (type `Omit<TreeMenuCompactProps<import("@vean/aria").TreeMenuBaseOptionData>, 'modelValue' | 'defaultValue' | 'items' | 'co...`; optional)
- `split`: Forwarded to `SSplitNav` (the four split modes). (type `Omit<SplitNavRootProps<SplitNavBaseOptionData>, 'modelValue' | 'defaultValue' | 'as' | 'class' | 'items' | 'collapsed...`; optional)
- `treeNav`: Forwarded to `STreeNav` (`top` mode). (type `Omit<TreeNavCompactProps, 'modelValue' | 'defaultValue' | 'class' | 'items'>`; optional)

#### Slot Props

Slot properties of the menu slot.

- `mode`: Shell mode the menu renders for. The mode the host bound, reported as-is: the shell renders the `sidebar` skeleton in the mobile view whatever this says. (type `'sidebar' | 'top' | SplitNavMode`; required)
- `collapsed`: Whether the sidebar is collapsed. (type `boolean`; required)
- `collapsedWidth`: Collapsed width of the sidebar, in pixels. (type `number`; required)
- `side`: Side the sidebar is placed on. (type `'right' | 'left'`; required)
- `headerMountId`: Id of the header element the horizontal pane mounts into, when the mode teleports it. (type `string | undefined`; required)
- `sidebarMountId`: Id of the sidebar element the vertical pane mounts into, when the mode teleports it. (type `string | undefined`; required)

## Notes

### Mode skeleton

`mode` drives the layout orientation, the menu renderer, and where the menu panes mount. Mode names describe the **menu shape**, not the layout orientation — the orientation follows from whether the first menu level is vertical or horizontal.

| `mode`                     | First level | Renderer    | `layoutProps.orientation` | Brand   | Collapse trigger | Menu panes                                            |
| :------------------------- | :---------- | :---------- | :------------------------ | :------ | :--------------- | :---------------------------------------------------- |
| `sidebar`                  | sidebar     | `STreeMenu` | `horizontal`              | sidebar | header           | one nested tree                                       |
| `top`                      | header      | `STreeNav`  | `vertical`                | header  | —                | one nav bar, collapsible via `menuProps.treeNav`      |
| `dual-vertical`            | sidebar     | `SSplitNav` | `horizontal`              | sidebar | header           | rail + nested tree, side by side                      |
| `vertical-horizontal`      | sidebar     | `SSplitNav` | `horizontal`              | header  | header           | rail in the sidebar, horizontal sub-nav in the header |
| `horizontal-vertical`      | header      | `SSplitNav` | `vertical`                | header  | sidebar bottom   | top bar in the header, tree in the sidebar            |
| `horizontal-dual-vertical` | header      | `SSplitNav` | `vertical`                | header  | sidebar bottom   | top bar in the header, rail + tree in the sidebar     |

The table describes the desktop view. On a phone the shell renders the `sidebar` skeleton for every mode — see [Mobile view](#mobile-view).

The collapse trigger lives where the mode's first level is: the top-bar-first modes (`horizontal-vertical`, `horizontal-dual-vertical`) keep it in the bottom corner of the sidebar — right-aligned over the column it collapses, centered over that column's icon rail once the sidebar is folded — because their header already carries the first level; every other sidebar mode keeps it beside the brand in the header. `triggerVisible` hides it either way.

The two sidebar placements render the trigger only while that pane column exists: a sidebar left with nothing but a rail has nothing to collapse, so opening a branch from the top bar is what brings the trigger out. The row it sits in mirrors the columns as well — its first cell is the rail's width and carries the same divider the pane column leads with, so the line runs on past the menu to the sidebar's bottom edge.

The nested panes only take space while they have something to show, and the shell asks the split-nav family which columns exist instead of guessing per mode: the sidebar of `dual-vertical` is the rail plus the tree while a first-level menu with children is active, and the rail alone otherwise; `horizontal-vertical` has no rail, so its sidebar is the tree or nothing at all. `horizontal-dual-vertical` is the one to read twice: its sidebar hosts the dual-vertical pane of the active **first-level** menu, so the rail holds that menu's children and the pane the level below them — activating a first-level leaf, or opening a menu whose children have not been opened yet, leaves the sidebar with the rail alone or with no column at all. A sidebar left with no column takes and paints nothing: it reports the column as out of flow (`data-sidebar-flow="false"` on the layout root), which collapses the sidebar-adjacent spacing the `floating`/`inset` variants add and hides the empty column, while the region itself stays in the tree — it hosts the mount targets the panes teleport into, and the menu root that owns the top bar. The pane follows every menu activation rather than the value: activating a parent opens it, activating a leaf closes it, and re-activating the leaf that is already active closes it too — that activation resets the menu's path without moving `v-model`. Collapsing the sidebar folds the pane with it: the sidebar becomes the rail plus the pane's icon rail (or that icon rail alone in the rail-less mode), and the entries below the pane's own top level stay reachable from the popups the collapsed menu opens.

The rule behind the orientation column: a vertical first level keeps the sidebar full height and lets the header start beside it (`orientation="horizontal"`); a horizontal first level puts the header across the full width with the sidebar beneath it (`orientation="vertical"`). This is the inverse of the raw `SLayout` prop names, so read this table rather than guessing.

### Mobile view

On a phone the sidebar is the layout's drawer, and a drawer is a single column: a top bar, a rail, or a pane has nowhere to go in it. So the shell renders the **`sidebar` skeleton** there for every mode — brand on top, one nested `STreeMenu` under it holding the full menu tree, opened from the header trigger. The other regions stay where they are, and the tabs, content, and footer are untouched. A `top` mode therefore still has navigation on a phone: its bar moves into the drawer instead of unfolding across a header that cannot hold it.

The header gives up the breadcrumb there. A trail beside the trigger and the trailing actions has no room on a phone, and it outranks both: it would take its own content width and push the actions outside the viewport — the page with it. So the crumb is hidden below the `md` breakpoint, which is the same `767.9px` the shell switches views on. It is a styled rule, not a rendered one: the region is still in the markup on a phone, invisible, so the first paint on a server-rendered page never shows the trail either. Pass `ui.breadcrumb` (e.g. `lt-md:flex`) to bring it back, or `breadcrumbVisible` to drop it everywhere.

On a header that does have room, a deep trail **truncates** instead of wrapping or pushing: the crumb region is the only part of the leading region that shrinks, its items stay on one line, and each label is ellipsized — the trailing actions keep their share whatever the trail length.

The `mode` prop is never overwritten: it describes the desktop shape, `data-mode` keeps reporting what you bound, and the `menu` slot keeps receiving it. Leaving the mobile view is all it takes to get that shape back.

The shell resolves the view the same way `SLayout` does — the explicit `isMobile` prop, a viewport published by a host through `provideViewportContext`, then `useMediaQuery` over the shared `767.9px` breakpoint — so the two can never disagree about which view they are in. Force the shape from the outside the same way the shell does: bind `isMobile`, or publish a viewport through `provideViewportContext` for a device preview.

Two consequences follow from rendering the `sidebar` skeleton. The brand follows it — `logoPlacement="auto"` puts the region in the drawer even in the modes whose desktop default is the header — and a custom `#menu` slot is rendered as-is: replacing the menu means owning the phone shape too, since the drawer is a single column.

### Brand placement

`#logo` and `#title` render in one region; `logoPlacement` decides where that region goes, and the mode decides what it can line up with. The sidebar placements mirror the columns the menu renders — the mark takes the first column, the title the second — so the brand sits exactly over the rail and the pane below it instead of being padded to the sidebar. In the `dual-vertical` shapes those two cells are the menu's own: the shell passes the mark to its `top-left` and the title to its `top-right`, so the pane column's leading divider runs through the brand band instead of the shell drawing a line of its own.

| `mode`                     | Default placement | `sidebar` | `sidebar-bottom` | What the region lines up with                                        |
| :------------------------- | :---------------- | :-------: | :--------------: | :------------------------------------------------------------------- |
| `sidebar`                  | sidebar           |    ✅     |        ✅        | One column: mark and title share a row, centered while collapsed.    |
| `top`                      | header            |    ❌     |        ❌        | No sidebar region; both fall back to the header.                     |
| `dual-vertical`            | sidebar           |    ✅     |        ✅        | The menu's `top-left` cell on the rail, its `top-right` on the pane. |
| `vertical-horizontal`      | header            |    ⚠️     |        ❌        | The sidebar is the rail alone, so only the mark renders there.       |
| `horizontal-vertical`      | header            |    ⚠️     |        ❌        | The sidebar is the pane of the active first-level menu.              |
| `horizontal-dual-vertical` | header            |    ⚠️     |        ❌        | The sidebar hosts the columns of the active first-level menu.        |

❌ means the shell keeps the mode's default placement rather than rendering the region where it cannot stay. ⚠️ means the placement is honored, but those sidebars only have columns while the active first-level menu has children — the brand comes and goes with the menu, which is why `sidebar-bottom` is refused there: a brand pinned to a column that keeps disappearing reads as a bug, while one in the header never moves.

In the mobile view the shell renders the `sidebar` skeleton, so `auto` puts the region in the drawer whatever mode is bound — see [Mobile view](#mobile-view).

Three rules hold in every placement: a bottom region renders after the menu and `sidebar-end`, so it sits on the sidebar's bottom edge; the title is hidden while the sidebar is collapsed, because the pane column it aligns to is folded away; and the mark either centers in the shrunken sidebar (`sidebar`) or stays on the rail that keeps its column (the dual-vertical shapes, where it is the menu's `top-left` cell).

The divider belongs to the column that follows: `SSplitNav` leads the pane with it, so it spans that column's whole height — the brand band above the items included — and the collapse-trigger row continues it to the sidebar's bottom edge. The shell adds no brand-cell divider of its own, and a sidebar that shows the rail alone has no inner divider at all. The columns themselves stretch to the sidebar's full height for the same reason — a divider that stops where the items do looks like a mistake.

### Architecture and benchmark comparison

| Concern           | SoybeanUI `SAppShell`                                                              | Ant Design Pro `ProLayout`               | Element Plus          | shadcn/ui                 |
| :---------------- | :--------------------------------------------------------------------------------- | :--------------------------------------- | :-------------------- | :------------------------ |
| Layer split       | Styled aggregation over the Aria `layout` family; `SLayout` still ships standalone | Single styled package                    | Single styled package | Copy-in block, no library |
| Modes             | 6 (`sidebar`, `top`, + 4 split shapes) driven by one `mode`                        | 6 (`side`/`top`/`mix` + header variants) | —                     | 1                         |
| Menu tree         | One `items` tree, rendered by `STreeMenu` / `STreeNav` / `SSplitNav` per mode      | Routes/props                             | `el-menu` config      | Composed by hand          |
| Sidebar geometry  | Derived from `mode` + `size`, aligned to the menu panes                            | Numeric props                            | Numeric props         | Hand-written CSS          |
| Brand             | `#logo` / `#title` slots, aligned to the menu columns                              | `logo` / `title` props                   | `el-aside` content    | Composed by hand          |
| Breadcrumb / tabs | `breadcrumbs` / `tabs` data props, rendered by `SBreadcrumb` / `SPageTabs`         | `menu` config + `PageContainer`          | Composed by hand      | Composed by hand          |
| Router dependency | None — data in, events out                                                         | Vue Router assumed                       | None                  | None                      |
| Overrides         | `ui` / `layoutUi` / `menuUi` + a slot per region                                   | `token` / slots                          | CSS vars              | Edit the copied source    |
| Accessibility     | Owned by the composed Aria families                                                | Package-level                            | Package-level         | Manual                    |

### Cautions

1. **The brand is yours.** There is no `logo` or `title` prop: the mark goes in `#logo`, the app name and any subtitle in `#title`. The shell renders the region and hands both slots the live `collapsed` state and the resolved `placement` so the injected content can adapt. `#title` is optional — it is hidden while the sidebar is collapsed, since the column it aligns to is folded away — and a brand without `#logo` renders no region at all. Where the sidebar is a single column, the region itself renders as a tree-menu item row: it takes the menu root's inset and folds to the item's icon width with the menu, which is what keeps the mark in the menu's icon column after collapsing — and it centers the mark there, since the folded row is icon-only and its own padding would otherwise leave a mark wider than the content box against the row's trailing edge. In the dual-vertical shapes the mark and the title are injected into the menu's `top-left` / `top-right` cells instead, so the divider belongs to the menu; in the header and bottom placements the region keeps its own cells. The row itself is not interactive — inject your own link or trigger inside the slot when the brand has to navigate.
2. **`isMobile` defaults to the viewport, on both layers.** The shell resolves the view for the skeleton it renders — the explicit `isMobile` prop, a viewport published by a host through `provideViewportContext`, or `useMediaQuery(mobileViewportQuery)` (the `767.9px` breakpoint the styled sidebar hides at) — while the raw prop is what reaches `SLayout`, still unset, so the layout keeps its `lt-md` first-paint fallback. Pass an explicit boolean (e.g. a server-side hint) to override both at once. See [Mobile view](#mobile-view).
3. **Sidebar widths are derived — do not override them casually.** `layoutProps.sidebarWidth` / `collapsedSidebarWidth` win over the derived values, but in the split modes that breaks the alignment between the sidebar and the menu panes, and it also loses the dynamic behaviour below.
4. **Switching modes re-creates the menu.** Each mode renders a different menu instance, so the panes' expanded state (which lives inside `SSplitNav` / `STreeMenu`) resets to the active path on a mode change — and on the switch between the desktop and mobile shapes, which replaces the renderer just as well.
5. **The top bar is a `STreeNav`, not a plain menubar.** It selects through `modelValue` like the sidebar: activating a leaf emits `select` / `update:modelValue`, an entry with children only opens its popup, and an entry that carries `to` / `href` follows it as well. Set `menuProps.treeNav.collapsible` to fold the entries that no longer fit into a trailing "more" popup.
6. **The tab collection is mutated in place.** `SPageTabs` removes a closed tab and flips `pinned` by mutating the `tabs` array it is given; `update:tabs` only fires for bulk operations (close others/all) and drag reorders. Keep the collection reactive (a deep `ref`, not `shallowRef`) and use `tabClose` / `tabPin` when you need to observe those actions.
7. **A collapsed sidebar folds the nested pane with it.** The rail keeps its width, the pane collapses to its icon rail, and the sidebar takes exactly those columns — nothing overlays the content. The folded menu keeps its own behaviour: leaves show tooltips and branches open their flyout popup, so the hierarchy stays reachable at every level. A menu tree that has to stay readable at a glance should keep the sidebar open and let the pane take a column. The collapse trigger follows the same skeleton: the top-bar-first modes keep it in the sidebar's bottom corner — and only while the pane column is there to collapse — right-aligned over the pane and centered over that column once it folds, while every other mode keeps it in the header.
8. **Sidebar content sits outside a landmark.** The layout sidebar region is a plain element with no landmark role, so content injected around the menu (brand, `sidebar-start`, `sidebar-end`) is not inside a landmark. Wrap it in your own landmark if you run an accessibility audit.
9. **The active menu is controlled — there is no initial-value prop.** The shell derives its sidebar geometry and breadcrumb from the value before it renders, so it reads the value it is given instead of keeping one of its own. Bind `v-model` (or pass `modelValue` and handle `update:modelValue`): with no value the shell shows no active menu, an empty breadcrumb, and a sidebar with none of its pane columns.
10. **The menu expands along the route by default.** `expandStrategy` defaults to `selected`: only the chain the active menu sits in stays expanded, so a branch you opened and then navigated away from closes instead of piling up in the pane. Pass `expand-strategy="keep"` when manual expansions have to survive navigation, or set it per renderer through `menuProps.tree` / `menuProps.split` when only one of them should differ — those take precedence over the shell prop. The `top` mode renders `STreeNav`, which has no expand strategy, so the prop never reaches its markup.
11. **The brand follows the columns, and only two modes can pin it to the bottom.** In the sidebar placements the mark takes the first column the menu renders and the title the second — through the menu's own `top-left` / `top-right` cells in the dual-vertical shapes, through a region of the shell's own everywhere else — so they line up with the rail and the pane below them; a column that does not exist drops its cell, which is why the title is hidden whenever the sidebar shows no pane (nothing opened yet, or collapsed). `sidebar-bottom` additionally needs a sidebar that is always a column of its own — `sidebar` and `dual-vertical` support it, every other mode keeps its default placement instead of pinning the brand where it would come and go with the menu. See [Brand placement](#brand-placement).

## FAQ

### How do I keep the breadcrumb in sync with the route?

Keep `v-model` in sync with the route and the breadcrumb follows on its own: it is derived from `items` plus the active value, so the trail, the labels, and the dropdowns all come from one menu tree. It renders in the header where that header has room for it, and is hidden on a phone — see [Mobile view](#mobile-view). When the trail has to differ from the menu — permission-trimmed routes, a title that is not the menu label — pass your own `breadcrumbs` and the shell renders that data instead. `breadcrumbClick` reports crumb activation, while picking an entry in an ancestor dropdown behaves exactly like that entry in the menu: one with children opens its own submenu, and a leaf emits `select` / `update:modelValue`.

### Why does the sidebar change width when I open another menu?

Because the nested pane is part of the sidebar only while it exists. A first-level menu without children has no pane to show, so the sidebar falls back to its rail; activating a menu with children widens it again. A sidebar left with no column at all — a rail-less mode such as `horizontal-vertical` on a first-level leaf — takes and paints nothing instead of keeping an empty column. The collapsed sidebar follows the same rule with the pane folded: the rail plus the pane's icon rail, or the rail alone when there is nothing to show. Overriding `layoutProps.sidebarWidth` gives a constant width and loses that behaviour.

### Why does the branch I opened close when I navigate?

Because the menu follows the route by default. `expandStrategy` is `selected`, so the expanded set is replaced by the chain the active menu sits in as soon as the selection changes: the pane stays aligned with the current page instead of accumulating the branches of a long session. Pass `expand-strategy="keep"` to let a branch you opened by hand survive navigation:

```vue

```

Either way the chain of the active menu is expanded on mount and whenever the value moves from outside — a route change driving `v-model`, for example — so the current page never goes out of sight. The strategy reaches the nested `STreeMenu` (`sidebar` mode) and the split panes; `top` mode renders a `STreeNav` with no branches to expand, so it has no effect there.

### How do I pin the brand to the bottom of the sidebar?

Set `logo-placement="sidebar-bottom"` in a mode that supports it (`sidebar` or `dual-vertical`). The region renders after the menu and after `sidebar-end`, and the menu region grows to fill the sidebar, so the brand lands on the bottom edge:

```vue

```

Everything else about the brand stays the same: the mark and the title still line up with the columns above them, the title still hides when the sidebar is collapsed, and the mark still centers in the shrunken sidebar — or stays on the rail in `dual-vertical`. The other modes keep their default placement, which the [Brand placement](#brand-placement) table spells out per mode.

### Why does the brand title disappear?

Because the title's cell is a sidebar column like any other: it takes the width of the nested pane, and the pane column only exists while a first-level menu with children is open and the sidebar is expanded. With nothing opened yet, or with the sidebar collapsed (the pane folds into its icon rail), there is no column for the title to align to, so the shell stops rendering it instead of reserving width the sidebar does not take — the title cell of `SSplitNav` simply never receives content. The mark always stays — it aligns to the first-level rail, which is the column that survives.

### How do I make the sidebar narrower or wider?

Set `layoutProps.sidebarWidth` / `collapsedSidebarWidth` for the `sidebar` mode. In the split modes leave them alone: the widths are computed from the pane metrics of the active `size`, and overriding them desynchronises the sidebar from the menu.

### How do I open or close the mobile drawer?

Bind `v-model:mobileOpen` (`default-mobile-open` when uncontrolled). On mobile the layout replaces the desktop sidebar with a drawer, so the drawer carries its own state next to `open`: `open` / `v-model:open` keeps controlling the desktop collapse, and the shell's trigger toggles whichever state the current mode renders. One binding cannot serve both — the desktop sidebar starts expanded while the drawer has to start closed.

### How do I keep the top bar in sync with the route?

The same way as the sidebar: keep `v-model` in sync and the bar highlights the active entry, including through nested levels — an ancestor whose child is active is marked as well. Entries with `to` / `href` navigate as well as report, so a routed app can either let the router drive `v-model` or rely on the activation the shell reports.

### How do I add a page header or a footer above the tabs?

The `#header` slot replaces the header's center region (the `#header-start` / `#header-end` slots cover the leading and trailing regions), and the `#footer` slot fills the footer. For a page-level header inside the content, compose `SCard` or a plain header in the default slot — there is no page-header region in the shell.

### How do I replace the menu entirely?

Use the `#menu` slot. It replaces the menu instance, not the mount targets: the shell still renders the region and the teleport targets, and the slot receives `headerMountId` / `sidebarMountId` so your own `SSplitNav` can target them.
