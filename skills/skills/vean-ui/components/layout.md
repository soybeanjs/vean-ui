# Layout

Source URL: https://veanui.com/components/layout
Markdown URL: https://veanui.com/components/layout.md
Category: Layout
Description: The layout component structure for admin dashboards or complex applications. It manages sidebar, header, footer, tabs, and main content areas.

## Overview

The layout component structure for admin dashboards or complex applications. It manages sidebar, header, footer, tabs, and main content areas.

## Features

- **One unified layout** — `SLayout` combines the modern sidebar shell with admin-classic capabilities: scrollable wrapper, fixed header/footer, and orientation support.
- **Three variants** — `sidebar` (bordered), `floating` (rounded shadow), and `inset` (content with margin and rounded corners).
- **Collapsible sidebar** — `collapsible="icon"` collapses the sidebar to a rail width; `collapsible="offcanvas"` slides it off-canvas while preserving layout space.
- **Side control** — `side="left"` or `side="right"` flips the sidebar position with full RTL-aware logical properties.
- **Mobile drawer** — unset `isMobile` follows the viewport and swaps the desktop sidebar for a `Dialog`-based drawer with overlay and focus trap; pass a boolean to override the breakpoint.
- **Slot-level overrides** — every region (sidebar, header, tab, content, footer) accepts per-slot `*Props` for granular attribute forwarding.
- **CSS-variable driven** — dimensions (`sidebarWidth`, `headerHeight`, `tabHeight`, `footerHeight`) emit rem-based CSS variables for runtime customization.
- **Size scaling** — `size` (xs…2xl) scales the layout spacing and base typography through `themeSizeRatio`.
- **`fullContent` mode** — pins the content area to fill the viewport while keeping the tab bar above it.
- **Orientation** — `Layout` supports horizontal (sidebar beside content) and vertical (sidebar stacked under header) orientations.
- **Scroll behaviors** — `scrollBehavior="content"` scrolls only the content region; `scrollBehavior="wrapper"` scrolls the entire main wrapper.
- **Fixed header/footer** — `fixedTop` and `fixedFooter` keep the header/footer pinned during content scroll, with automatic placeholder elements to prevent overlap.
- **Base z-index control** — `baseZIndex` derives the stacking order of sidebar, header, tab, and footer so multiple layouts compose predictably.
- **Aria composition** — every region (`LayoutRoot`, `LayoutSidebar`, `LayoutRail`, `LayoutHeader`, `LayoutTab`, `LayoutContent`, `LayoutFooter`, `LayoutMobile`, `LayoutTrigger`) is exported from `@vean/aria/layout` for custom styled builds.
- **SSR safe** — no `window`/`document` access in setup; the viewport fallback is guarded, and `useId()` generates stable scroll ids for server rendering.

## Usage

Usage examples for layout are rendered on the site.

## Demos

Interactive demos for layout are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (13): Layout, LayoutCompact, LayoutContent, LayoutFooter, LayoutHeader, LayoutMain, LayoutMobile, LayoutPlaceholder, LayoutRail, LayoutRoot, LayoutSidebar, LayoutTab, LayoutTrigger.

### Layout

#### Props

Properties for the Layout component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<LayoutUi>`; optional)
- `open`: The controlled open state of the layout. Can be bound with `v-model`. (type `boolean`; optional)
- `defaultOpen`: The open state of the layout when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `side`: The side of the layout. (type `HorizontalSide`; optional)
- `variant`: The variant of the layout. (type `LayoutVariant`; optional)
- `collapsible`: The collapsible state of the layout. (type `LayoutCollapsible`; optional)
- `sidebarVisible`: whether to show the sidebar. (type `boolean`; default `true`; optional)
- `sidebarWidth`: The width of the sidebar. (px) (type `number`; default `240`; optional)
- `collapsedSidebarWidth`: The width of the sidebar when it is collapsed. (px) (type `number`; default `50`; optional)
- `isMobile`: Whether the layout is in mobile view. Resolution order: this prop, then a host viewport decision provided through `provideViewportContext` (a simulated viewport — a device frame, an embedded shell), then `useMediaQuery(mobileViewportQuery)` — the same breakpoint the styled desktop sidebar is hidden at. Pass an explicit boolean to force the mode (e.g. a server-side detection); `false` re-enables the inline sidebar even below the breakpoint. (type `boolean`; optional)
- `mobileOpen`: The controlled open state of the mobile drawer. Can be bound with `v-model:mobileOpen`. Kept apart from `open`, which drives the desktop sidebar: on mobile the inline sidebar is replaced by a drawer, so the two states never apply at the same time. (type `boolean`; optional)
- `defaultMobileOpen`: The open state of the mobile drawer when it is initially rendered. (type `boolean`; default `false`; optional)
- `mobileSidebarWidth`: The width of the sidebar in the mobile view. (px) (type `number`; default `240`; optional)
- `headerVisible`: whether to show the header. (type `boolean`; default `true`; optional)
- `headerHeight`: The height of the header. (px) (type `number`; default `56`; optional)
- `tabVisible`: whether to show the tab. (type `boolean`; default `true`; optional)
- `tabHeight`: The height of the tab. (px) (type `number`; default `44`; optional)
- `footerVisible`: whether to show the footer. (type `boolean`; default `true`; optional)
- `footerHeight`: The height of the footer. (px) (type `number`; default `48`; optional)
- `fullContent`: whether the content takes the full height of the layout (include). (type `boolean`; default `false`; optional)
- `pxToRem`: The function to convert pixels to rem. (type `((px: number) => number)`; default `(px: number) => px / 16 (16 is the base font size)`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `scrollBehavior`: Scroll behavior. (type `LayoutScrollBehavior`; optional)
- `scrollId`: Scroll id. (type `string`; optional)
- `baseZIndex`: The base z-index of the layout. The z-index of the sidebar, header, tab, footer, and their fixed versions will be calculated based on this value. (type `number`; default `50`; optional)
- `fixedTop`: Whether the header and tab are fixed to the top of the layout when the orientation is vertical. If true, the header and tab will be fixed to the top of the layout when the orientation is vertical, and will scroll with the content when the orientation is horizontal. (type `boolean`; default `true`; optional)
- `fixedFooter`: Whether footer is fixed (type `boolean`; default `true`; optional)
- `stretchFooter`: Whether the footer should stretch to the full width of the layout or the content when layout orientation is vertical. (type `boolean`; default `true`; optional)
- `sidebarProps`: No description. (type `LayoutSidebarProps`; optional)
- `railProps`: No description. (type `LayoutRailProps`; optional)
- `mainProps`: No description. (type `LayoutMainProps`; optional)
- `headerProps`: No description. (type `LayoutHeaderProps`; optional)
- `tabProps`: No description. (type `LayoutTabProps`; optional)
- `contentProps`: No description. (type `LayoutContentProps`; optional)
- `footerProps`: No description. (type `LayoutFooterProps`; optional)
- `mobileProps`: No description. (type `LayoutMobileProps`; optional)

#### Emits

Events for the Layout component.

- `update:open`: Emitted when the open state changes. (type `[open: boolean]`; parameters `open: boolean`)
- `update:mobileOpen`: Emitted when the mobile drawer open state changes. (type `[open: boolean]`; parameters `open: boolean`)

#### Slots

Slots for the Layout component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `sidebar`: Custom content for the sidebar slot. `collapsed` is the mode-aware state to render from: it is `false` on mobile, where the sidebar is a drawer that always shows the expanded navigation, so a collapse chosen on desktop does not follow the content into the drawer. `open` still reports the desktop state. (type `((props: { open: boolean | undefined; collapsedSidebarWidth: number; collapsed: boolean; }) => any) | undefined`)
- `header`: Custom content for the header slot. (type `(() => any) | undefined`)
- `tab`: Custom content for the tab slot. (type `(() => any) | undefined`)
- `content`: Custom content for the content slot. (type `(() => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `(() => any) | undefined`)

### LayoutCompact

#### Props

Properties for the LayoutCompact component.

- `open`: The controlled open state of the layout. Can be bound with `v-model`. (type `boolean`; optional)
- `defaultOpen`: The open state of the layout when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `side`: The side of the layout. (type `HorizontalSide`; optional)
- `variant`: The variant of the layout. (type `LayoutVariant`; optional)
- `collapsible`: The collapsible state of the layout. (type `LayoutCollapsible`; optional)
- `sidebarVisible`: whether to show the sidebar. (type `boolean`; default `true`; optional)
- `sidebarWidth`: The width of the sidebar. (px) (type `number`; default `240`; optional)
- `collapsedSidebarWidth`: The width of the sidebar when it is collapsed. (px) (type `number`; default `50`; optional)
- `isMobile`: Whether the layout is in mobile view. Resolution order: this prop, then a host viewport decision provided through `provideViewportContext` (a simulated viewport — a device frame, an embedded shell), then `useMediaQuery(mobileViewportQuery)` — the same breakpoint the styled desktop sidebar is hidden at. Pass an explicit boolean to force the mode (e.g. a server-side detection); `false` re-enables the inline sidebar even below the breakpoint. (type `boolean`; optional)
- `mobileOpen`: The controlled open state of the mobile drawer. Can be bound with `v-model:mobileOpen`. Kept apart from `open`, which drives the desktop sidebar: on mobile the inline sidebar is replaced by a drawer, so the two states never apply at the same time. (type `boolean`; optional)
- `defaultMobileOpen`: The open state of the mobile drawer when it is initially rendered. (type `boolean`; default `false`; optional)
- `mobileSidebarWidth`: The width of the sidebar in the mobile view. (px) (type `number`; default `240`; optional)
- `headerVisible`: whether to show the header. (type `boolean`; default `true`; optional)
- `headerHeight`: The height of the header. (px) (type `number`; default `56`; optional)
- `tabVisible`: whether to show the tab. (type `boolean`; default `true`; optional)
- `tabHeight`: The height of the tab. (px) (type `number`; default `44`; optional)
- `footerVisible`: whether to show the footer. (type `boolean`; default `true`; optional)
- `footerHeight`: The height of the footer. (px) (type `number`; default `48`; optional)
- `fullContent`: whether the content takes the full height of the layout (include). (type `boolean`; default `false`; optional)
- `pxToRem`: The function to convert pixels to rem. (type `((px: number) => number)`; default `(px: number) => px / 16 (16 is the base font size)`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `scrollBehavior`: Scroll behavior. (type `LayoutScrollBehavior`; optional)
- `scrollId`: Scroll id. (type `string`; optional)
- `baseZIndex`: The base z-index of the layout. The z-index of the sidebar, header, tab, footer, and their fixed versions will be calculated based on this value. (type `number`; default `50`; optional)
- `fixedTop`: Whether the header and tab are fixed to the top of the layout when the orientation is vertical. If true, the header and tab will be fixed to the top of the layout when the orientation is vertical, and will scroll with the content when the orientation is horizontal. (type `boolean`; default `true`; optional)
- `fixedFooter`: Whether footer is fixed (type `boolean`; default `true`; optional)
- `stretchFooter`: Whether the footer should stretch to the full width of the layout or the content when layout orientation is vertical. (type `boolean`; default `true`; optional)
- `sidebarProps`: No description. (type `LayoutSidebarProps`; optional)
- `railProps`: No description. (type `LayoutRailProps`; optional)
- `mainProps`: No description. (type `LayoutMainProps`; optional)
- `headerProps`: No description. (type `LayoutHeaderProps`; optional)
- `tabProps`: No description. (type `LayoutTabProps`; optional)
- `contentProps`: No description. (type `LayoutContentProps`; optional)
- `footerProps`: No description. (type `LayoutFooterProps`; optional)
- `mobileProps`: No description. (type `LayoutMobileProps`; optional)

#### Emits

Events for the LayoutCompact component.

- `update:open`: Emitted when the open state changes. (type `[open: boolean]`; parameters `open: boolean`)
- `update:mobileOpen`: Emitted when the mobile drawer open state changes. (type `[open: boolean]`; parameters `open: boolean`)

#### Slots

Slots for the LayoutCompact component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `sidebar`: Custom content for the sidebar slot. `collapsed` is the mode-aware state to render from: it is `false` on mobile, where the sidebar is a drawer that always shows the expanded navigation, so a collapse chosen on desktop does not follow the content into the drawer. `open` still reports the desktop state. (type `((props: { open: boolean | undefined; collapsedSidebarWidth: number; collapsed: boolean; }) => any) | undefined`)
- `header`: Custom content for the header slot. (type `(() => any) | undefined`)
- `tab`: Custom content for the tab slot. (type `(() => any) | undefined`)
- `content`: Custom content for the content slot. (type `(() => any) | undefined`)
- `footer`: Custom content for the footer slot. (type `(() => any) | undefined`)

### LayoutContent

- No documented props, emits, slots, or slot props were available.

### LayoutFooter

- No documented props, emits, slots, or slot props were available.

### LayoutHeader

- No documented props, emits, slots, or slot props were available.

### LayoutMain

- No documented props, emits, slots, or slot props were available.

### LayoutMobile

- No documented props, emits, slots, or slot props were available.

### LayoutPlaceholder

#### Props

Properties for the LayoutPlaceholder component.

- `type`: Which region the placeholder reserves space for. (type `'header' | 'tab' | 'footer'`; required)

### LayoutRail

- No documented props, emits, slots, or slot props were available.

### LayoutRoot

#### Props

Properties for the LayoutRoot component.

- `open`: The controlled open state of the layout. Can be bound with `v-model`. (type `boolean`; optional)
- `defaultOpen`: The open state of the layout when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `side`: The side of the layout. (type `HorizontalSide`; optional)
- `variant`: The variant of the layout. (type `LayoutVariant`; optional)
- `collapsible`: The collapsible state of the layout. (type `LayoutCollapsible`; optional)
- `sidebarVisible`: whether to show the sidebar. (type `boolean`; default `true`; optional)
- `sidebarWidth`: The width of the sidebar. (px) (type `number`; default `240`; optional)
- `collapsedSidebarWidth`: The width of the sidebar when it is collapsed. (px) (type `number`; default `50`; optional)
- `isMobile`: Whether the layout is in mobile view. Resolution order: this prop, then a host viewport decision provided through `provideViewportContext` (a simulated viewport — a device frame, an embedded shell), then `useMediaQuery(mobileViewportQuery)` — the same breakpoint the styled desktop sidebar is hidden at. Pass an explicit boolean to force the mode (e.g. a server-side detection); `false` re-enables the inline sidebar even below the breakpoint. (type `boolean`; optional)
- `mobileOpen`: The controlled open state of the mobile drawer. Can be bound with `v-model:mobileOpen`. Kept apart from `open`, which drives the desktop sidebar: on mobile the inline sidebar is replaced by a drawer, so the two states never apply at the same time. (type `boolean`; optional)
- `defaultMobileOpen`: The open state of the mobile drawer when it is initially rendered. (type `boolean`; default `false`; optional)
- `mobileSidebarWidth`: The width of the sidebar in the mobile view. (px) (type `number`; default `240`; optional)
- `headerVisible`: whether to show the header. (type `boolean`; default `true`; optional)
- `headerHeight`: The height of the header. (px) (type `number`; default `56`; optional)
- `tabVisible`: whether to show the tab. (type `boolean`; default `true`; optional)
- `tabHeight`: The height of the tab. (px) (type `number`; default `44`; optional)
- `footerVisible`: whether to show the footer. (type `boolean`; default `true`; optional)
- `footerHeight`: The height of the footer. (px) (type `number`; default `48`; optional)
- `fullContent`: whether the content takes the full height of the layout (include). (type `boolean`; default `false`; optional)
- `pxToRem`: The function to convert pixels to rem. (type `((px: number) => number)`; default `(px: number) => px / 16 (16 is the base font size)`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `scrollBehavior`: Scroll behavior. (type `LayoutScrollBehavior`; optional)
- `scrollId`: Scroll id. (type `string`; optional)
- `baseZIndex`: The base z-index of the layout. The z-index of the sidebar, header, tab, footer, and their fixed versions will be calculated based on this value. (type `number`; default `50`; optional)
- `fixedTop`: Whether the header and tab are fixed to the top of the layout when the orientation is vertical. If true, the header and tab will be fixed to the top of the layout when the orientation is vertical, and will scroll with the content when the orientation is horizontal. (type `boolean`; default `true`; optional)
- `fixedFooter`: Whether footer is fixed (type `boolean`; default `true`; optional)
- `stretchFooter`: Whether the footer should stretch to the full width of the layout or the content when layout orientation is vertical. (type `boolean`; default `true`; optional)

#### Emits

Events for the LayoutRoot component.

- `update:open`: Emitted when the open state changes. (type `[open: boolean]`; parameters `open: boolean`)
- `update:mobileOpen`: Emitted when the mobile drawer open state changes. (type `[open: boolean]`; parameters `open: boolean`)

### LayoutSidebar

- No documented props, emits, slots, or slot props were available.

### LayoutTab

- No documented props, emits, slots, or slot props were available.

### LayoutTrigger

#### Props

Properties for the LayoutTrigger component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark comparison

| Concern                  | VeanUI                                                                            | Ant Design `Layout`/`Header`/`Sider`/`Content`/`Footer` | Element Plus `ElContainer`/`ElHeader`/`ElAside`/`ElMain`/`ElFooter` |
| :----------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------ | :------------------------------------------------------------------ |
| Aria / styled separation | ✅ `@vean/aria/layout` ships logic + structure; `@vean/ui` ships `scv()` recipes  | ❌ single styled package                                | ❌ single styled package                                            |
| Sidebar variants         | `sidebar` / `floating` / `inset`                                                  | `sider` only                                            | `aside` only                                                        |
| Collapsible modes        | `icon` (rail) + `offcanvas` (slide out)                                           | `collapsible` + `collapsedWidth`                        | —                                                                   |
| Mobile drawer            | built-in `Dialog`-based drawer (follows the viewport)                             | requires `Drawer` composition                           | requires `Drawer` composition                                       |
| Fixed header/footer      | `Layout` with `fixedTop` / `fixedFooter` + automatic placeholders                 | requires manual sticky CSS                              | requires manual sticky CSS                                          |
| Orientation              | `Layout` `orientation="horizontal" \| "vertical"`                                 | —                                                       | —                                                                   |
| Scroll behavior          | `wrapper` / `content` on `Layout`                                                 | —                                                       | —                                                                   |
| CSS-variable dimensions  | `--vean-sidebar-width`, `--vean-layout-header-height`, etc.                       | inline width on `Sider`                                 | inline width on `Aside`                                             |
| RTL support              | logical properties (`start-*`, `end-*`, `ps-*`, `pe-*`) + `rtl:` variants on rail | —                                                       | —                                                                   |
| Z-index orchestration    | `baseZIndex` derives sidebar/header/tab/footer z-index                            | manual                                                  | manual                                                              |
| Region visibility        | `sidebarVisible` / `headerVisible` / `tabVisible` / `footerVisible` props         | remove the component                                    | remove the component                                                |

### Runtime considerations

1. **CSS variables are rem-based** — `sidebarWidth`, `collapsedSidebarWidth`, `headerHeight`, `tabHeight`, `footerHeight`, and `mobileSidebarWidth` are converted via `pxToRem` (default `px / 16`). Pass a custom `pxToRem` to align with a non-default root font size.
2. **`size` scales spacing and typography** — the UI wrapper multiplies pixel dimensions by `themeSizeRatio[size] / themeSizeMap.md`, so `size="xs"` shrinks both text and sidebar width proportionally.
3. **`isMobile` resolves through three levels** — the prop, then a viewport a host publishes with `provideViewportContext` (a documentation device frame, an embedded shell), then `useMediaQuery(mobileViewportQuery)`, the breakpoint shared with the styled sidebar's `lt-md` hiding rule (`767.9px`). The winning source is published as `data-mobile-source="explicit|viewport"`, and the styled `lt-md` fallback only applies to `viewport`: an explicit `isMobile="false"` below the breakpoint keeps the inline sidebar **and** its reserved width, instead of reserving space for a sidebar the CSS had hidden. The drawer is teleported out of the layout, so on mobile the sidebar reserves no space: the start gaps (`--vean-layout-start-gap`, `--vean-layout-header-start-gap`, `--vean-layout-footer-start-gap`) collapse to `0`, and each variant falls back to its own end gap — `sidebar`/`floating` become full-bleed, `inset` stays inset symmetrically on both edges. The same fallback covers `sidebarVisible="false"` on desktop: a hidden sidebar reserves no space either, so the extra spacing `floating`/`inset` add beside the sidebar width is withdrawn with it, and the main column stays aligned with the fixed header and footer. A host that resolves the sidebar to no column at all — `SAppShell`'s split modes do, while a first-level leaf is active — declares `sidebarWidth="0"` instead: the root then reports `data-sidebar-flow="false"`, the styled layer withdraws the same spacing and paints no column, and because the region itself stays mounted (its mount targets host teleported panes), only the column disappears, not the subtree.
4. **The `sidebar` slot renders from a mode-aware `collapsed`** — the slot hands its content `collapsed` next to `open`: it is `false` on mobile, where the sidebar is a drawer that always shows the expanded navigation, so a collapse picked on desktop does not follow the content into the drawer. Render from `collapsed` (a menu's `collapsed`, a brand title's visibility); `open` keeps reporting the desktop state, and the collapse returns the moment the mode does.
5. **`LayoutTrigger` vs `LayoutRail`** — `LayoutTrigger` is a focusable button in the header for keyboard users; `LayoutRail` is the edge drag affordance with `tabindex="-1"` (click-only). Both reflect `aria-expanded` for whichever sidebar the current mode renders — on mobile that is the drawer, not the desktop `open` state.
6. **`Layout` placeholder elements** — when `fixedTop` or `fixedFooter` is enabled, `LayoutPlaceholder` renders empty spacer divs (`data-vean-layout-{header|tab|footer}-placeholder`) to prevent content from sliding under the fixed region. Hiding a region removes its placeholder with it, and the fixed regions below close the gap: with the header hidden the tab takes the layout's top edge instead of keeping the header's height (`inset` keeps only its own half-spacing).
7. **`scrollId` for scroll restoration** — `Layout` generates a stable `soybean-layout-scroll-{id}` on the scrolling element (wrapper or content depending on `scrollBehavior`). Pass `scrollId` to make it deterministic across SSR/CSR.

## FAQ

### Which layout mode should I use?

Use `SLayout` for both modern application shells and admin dashboards. It handles fixed header/footer, orientation switching (`horizontal` / `vertical`), and wrapper-level scrolling with placeholder spacers through a single unified component.

### How do I control the sidebar open state?

Use `v-model:open` (controlled) or `default-open` (uncontrolled). The state is reflected on the root via `data-state="expanded|collapsed"` and on `LayoutTrigger`/`LayoutRail` via `aria-expanded`.

On mobile the inline sidebar is replaced by a drawer, which carries its own state: bind `v-model:mobileOpen` (or `default-mobile-open` uncontrolled) to drive it. `open` keeps controlling the desktop sidebar, so a host that pins `isMobile` reaches what the user sees through `mobileOpen` — and the trigger reports that state. A single `open` binding cannot mean both, because the desktop sidebar defaults to expanded while the drawer has to start closed.

### How do I make the sidebar collapse to icons instead of sliding away?

Set `collapsible="icon"` (default) and `collapsedSidebarWidth` to the rail width. The sidebar shrinks to the collapsed width and the `sidebarGapHandler` adjusts the main area accordingly. Use `collapsible="offcanvas"` to slide the sidebar off-canvas instead.

### How does mobile mode work?

Leave `isMobile` unset (the default) and the layout follows the viewport, swapping the desktop sidebar for a `Dialog`-based drawer; pass a boolean to pin the mode yourself. The drawer inherits `mobileSidebarWidth` and reuses the same `sidebar` slot content. The drawer overlay and focus trap are provided by the underlying `Dialog` component.

### Can a host decide the mode for a whole subtree?

Yes. A host that already knows the answer — a device preview frame rendering a phone, a shell embedded in a desktop app, an SSR pass with a device hint — publishes it once with `provideViewportContext({ isMobile })` from `@vean/aria/composables`; every layout below it follows, and an explicit `isMobile` prop still wins per instance. Publishing at the frame rather than per component is also what keeps a documentation preview honest: the frame can simulate a phone viewport while the browser window stays wide. Note that viewport-prefixed utilities (`lt-md:hidden`, `sm:`, `md:`) still key off the browser window, so a simulated viewport moves the JS structure (drawer vs. inline sidebar) and the prop-driven spacing, not those breakpoint classes.

### Can I render the sidebar on the right?

Yes — set `side="right"`. The layout uses RTL-aware logical properties (`start-*`, `end-*`, `border-s`, `border-e`) so the sidebar, gap handler, rail cursor, and fixed header/footer insets all flip correctly.

### How are z-index values coordinated?

`Layout` accepts a `baseZIndex` (default `50`). The sidebar, header, tab, and footer z-index values are derived from this base so they stack predictably. The derived values are exposed as `--layout-{sidebar|header|tab|footer}-z-index` CSS variables.

### How do I customize region-level attributes?

Each region accepts a `*Props` prop on the compact component (e.g. `sidebarProps`, `headerProps`, `tabProps`, `contentProps`, `footerProps`, `mainProps`, `railProps`, `mobileProps`). These are forwarded to the corresponding Aria region component.
