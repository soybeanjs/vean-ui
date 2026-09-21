# NavMenu

Source URL: https://veanui.com/components/nav-menu
Markdown URL: https://veanui.com/components/nav-menu.md
Category: Navigation
Description: NavMenu builds site-level horizontal or vertical navigation with a single shared floating surface. It replaces the retired NavigationMenu family (see the NavMenu migration guide) and is modeled directly on the Popper primitives: the whole viewport is one PopperPositioner, its reference switches to the active trigger, and all hover timing runs on a single shared Popper hover machine with value routing through pendingValue.

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

Usage examples for nav-menu are rendered on the site.

## Demos

Interactive demos for nav-menu are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (12): NavMenu, NavMenuCompact, NavMenuContent, NavMenuItem, NavMenuLink, NavMenuList, NavMenuOptionCompact, NavMenuRoot, NavMenuSubContent, NavMenuSubTrigger, NavMenuTrigger, NavMenuViewport.

### NavMenu

#### Props

Properties for the NavMenu component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<NavMenuUi>`; optional)
- `items`: The items to render in the navigation menu. (type `NavMenuOptionData[]`; required)
- `modelValue`: The controlled value of the active item. Can be used as `v-model`. (type `string`; optional)
- `defaultValue`: The value of the item that should be active when initially rendered. (type `string`; optional)
- `dir`: The reading direction of the menu. (type `Direction`; optional)
- `orientation`: The orientation of the menu. (type `DataOrientation`; optional)
- `delayDuration`: The duration from when the pointer enters the trigger until the submenu opens. (type `number`; default `200`; optional)
- `skipDelayDuration`: How much time a user has to enter another trigger without incurring a delay again. (type `number`; default `300`; optional)
- `disableClickTrigger`: If `true`, the menu cannot be opened by clicking a trigger. (type `boolean`; default `false`; optional)
- `disableHoverTrigger`: If `true`, the menu cannot be opened by hovering a trigger. (type `boolean`; default `false`; optional)
- `disablePointerLeaveClose`: If `true`, the menu will not close when the pointer leaves the content. (type `boolean`; default `false`; optional)
- `itemProps`: Properties forwarded to the item element. (type `NavMenuItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `Omit<NavMenuLinkProps, LinkBasePropsKey>`; optional)
- `subTriggerProps`: Properties forwarded to the nested flyout trigger element. (type `NavMenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the nested flyout content element. (type `NavMenuSubContentProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `NavMenuTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `NavMenuContentProps`; optional)
- `listProps`: Properties forwarded to the list element. (type `NavMenuListProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `NavMenuViewportProps`; optional)

#### Emits

Events for the NavMenu component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `select`: Emitted when a link is selected. (type `[payload: CustomEvent<{ originalEvent: Event; }>]`; parameters `payload: CustomEvent<{ originalEvent: Event; }>`)

#### Slots

Slots for the NavMenu component.

- `item`: No description. (type `(props: { item: NavMenuOptionData; isTrigger?: boolean; }) => any`; parameters `props: { item: NavMenuOptionData; isTrigger?: boolean; }`)
- `item-leading`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-trailing`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-link-icon`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-trigger-icon`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-children`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)

### NavMenuCompact

#### Props

Properties for the NavMenuCompact component.

- `items`: The items to render in the navigation menu. (type `NavMenuOptionData[]`; required)
- `modelValue`: The controlled value of the active item. Can be used as `v-model`. (type `string`; optional)
- `defaultValue`: The value of the item that should be active when initially rendered. (type `string`; optional)
- `dir`: The reading direction of the menu. (type `Direction`; optional)
- `orientation`: The orientation of the menu. (type `DataOrientation`; optional)
- `delayDuration`: The duration from when the pointer enters the trigger until the submenu opens. (type `number`; default `200`; optional)
- `skipDelayDuration`: How much time a user has to enter another trigger without incurring a delay again. (type `number`; default `300`; optional)
- `disableClickTrigger`: If `true`, the menu cannot be opened by clicking a trigger. (type `boolean`; default `false`; optional)
- `disableHoverTrigger`: If `true`, the menu cannot be opened by hovering a trigger. (type `boolean`; default `false`; optional)
- `disablePointerLeaveClose`: If `true`, the menu will not close when the pointer leaves the content. (type `boolean`; default `false`; optional)
- `itemProps`: Properties forwarded to the item element. (type `NavMenuItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `Omit<NavMenuLinkProps, LinkBasePropsKey>`; optional)
- `subTriggerProps`: Properties forwarded to the nested flyout trigger element. (type `NavMenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the nested flyout content element. (type `NavMenuSubContentProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `NavMenuTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `NavMenuContentProps`; optional)
- `listProps`: Properties forwarded to the list element. (type `NavMenuListProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `NavMenuViewportProps`; optional)

#### Emits

Events for the NavMenuCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)
- `select`: Emitted when a link is selected. (type `[payload: CustomEvent<{ originalEvent: Event; }>]`; parameters `payload: CustomEvent<{ originalEvent: Event; }>`)

#### Slots

Slots for the NavMenuCompact component.

- `item`: No description. (type `(props: { item: NavMenuOptionData; isTrigger?: boolean; }) => any`; parameters `props: { item: NavMenuOptionData; isTrigger?: boolean; }`)
- `item-leading`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-trailing`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-link-icon`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-trigger-icon`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-children`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)

### NavMenuContent

#### Props

Properties for the NavMenuContent component.

- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

### NavMenuItem

#### Props

Properties for the NavMenuItem component.

- `value`: Value associated with the current item. (type `string`; optional)

### NavMenuLink

#### Props

Properties for the NavMenuLink component.

- `selected`: Marks the link as the currently selected page. (type `boolean`; optional)
- `sub`: Whether the link is rendered inside a submenu. When `true`, the `subLink` UI slot is used instead of `link` (mirroring the root/sub split of the list). (type `boolean`; optional)
- `replace`: Calls `router.replace` instead of `router.push`. (type `boolean`; optional)
- `disabled`: When `true`, the link is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `href`: The URL the link should navigate to when clicked on. (type `string`; optional)
- `to`: Route Location the link should navigate to when clicked on. (type `string | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric`; optional)
- `activeClass`: Class to apply when the link is active (type `string`; optional)
- `exactActiveClass`: Class to apply when the link is exact active (type `string`; optional)
- `inactiveClass`: The class to apply to the link when it is inactive. (type `string`; optional)
- `prefetchedClass`: A class to apply to links that have been prefetched. (type `string`; optional)
- `external`: Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases (type `boolean`; optional)
- `ariaCurrentValue`: Value passed to the attribute `aria-current` when the link is exact active. (type `'true' | 'false' | 'page' | 'date' | 'time' | 'step' | 'location'`; default `'page'`; optional)
- `viewTransition`: Pass the returned promise of `router.push()` to `document.startViewTransition()` if supported. (type `boolean`; optional)
- `target`: Where to display the linked URL, as the name for a browsing context. (type `(string & {}) | '_blank' | '_parent' | '_self' | '_top' | null`; optional)
- `rel`: A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links. (type `(string & {}) | 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | null`; default `'noopener noreferrer'`; optional)
- `noRel`: If set to true, no rel attribute will be added to the link (type `boolean`; optional)
- `prefetch`: When enabled will prefetch middleware, layouts and payloads of links in the viewport. (type `boolean`; optional)
- `prefetchOn`: Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility. (type `'visibility' | 'interaction' | Partial<{ visibility: boolean; interaction: boolean; }>`; optional)
- `noPrefetch`: Escape hatch to disable `prefetch` attribute. (type `boolean`; optional)
- `trailingSlash`: An option to either add or remove trailing slashes in the `href` for this specific link. Overrides the global `trailingSlash` option if provided. (type `'append' | 'remove'`; optional)

#### Emits

Events for the NavMenuLink component.

- `select`: Emitted when a link is selected. (type `[payload: CustomEvent<{ originalEvent: Event; }>]`; parameters `payload: CustomEvent<{ originalEvent: Event; }>`)

### NavMenuList

- No documented props, emits, slots, or slot props were available.

### NavMenuOptionCompact

#### Props

Properties for the NavMenuOptionCompact component.

- `item`: Current item data. (type `NavMenuOptionData`; required)
- `itemProps`: Properties forwarded to the item element. (type `NavMenuItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `Omit<NavMenuLinkProps, LinkBasePropsKey>`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `NavMenuTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `NavMenuContentProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `NavMenuViewportProps`; optional)
- `listProps`: Properties forwarded to the list element. (type `NavMenuListProps`; optional)
- `subTriggerProps`: Properties forwarded to the nested flyout trigger element. (type `NavMenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the nested flyout content element. (type `NavMenuSubContentProps`; optional)

#### Emits

Events for the NavMenuOptionCompact component.

- `select`: Emitted when a link is selected. (type `[payload: CustomEvent<{ originalEvent: Event; }>]`; parameters `payload: CustomEvent<{ originalEvent: Event; }>`)

#### Slots

Slots for the NavMenuOptionCompact component.

- `item`: No description. (type `(props: { item: NavMenuOptionData; isTrigger?: boolean; }) => any`; parameters `props: { item: NavMenuOptionData; isTrigger?: boolean; }`)
- `item-leading`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-trailing`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-link-icon`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-trigger-icon`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)
- `item-children`: No description. (type `(props: { item: NavMenuOptionData; }) => any`; parameters `props: { item: NavMenuOptionData; }`)

### NavMenuRoot

#### Props

Properties for the NavMenuRoot component.

- `modelValue`: The controlled value of the active item. Can be used as `v-model`. (type `string`; optional)
- `defaultValue`: The value of the item that should be active when initially rendered. (type `string`; optional)
- `dir`: The reading direction of the menu. (type `Direction`; optional)
- `orientation`: The orientation of the menu. (type `DataOrientation`; optional)
- `delayDuration`: The duration from when the pointer enters the trigger until the submenu opens. (type `number`; default `200`; optional)
- `skipDelayDuration`: How much time a user has to enter another trigger without incurring a delay again. (type `number`; default `300`; optional)
- `disableClickTrigger`: If `true`, the menu cannot be opened by clicking a trigger. (type `boolean`; default `false`; optional)
- `disableHoverTrigger`: If `true`, the menu cannot be opened by hovering a trigger. (type `boolean`; default `false`; optional)
- `disablePointerLeaveClose`: If `true`, the menu will not close when the pointer leaves the content. (type `boolean`; default `false`; optional)

#### Emits

Events for the NavMenuRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)

### NavMenuSubContent

#### Props

Properties for the NavMenuSubContent component (the nested flyout surface).

- `sideOffset`: Distance in pixels between the sub trigger and the nested flyout. (type `number`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

### NavMenuSubTrigger

#### Props

Properties for the NavMenuSubTrigger component (the trigger of a nested flyout).

- `disabled`: Whether the trigger is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### NavMenuTrigger

#### Props

Properties for the NavMenuTrigger component.

- `disabled`: Whether the trigger is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### NavMenuViewport

#### Props

Properties for the NavMenuViewport component (the shared floating surface).

- `align`: Align the viewport against the active trigger. (type `Align`; optional)
- `sideOffset`: Distance in pixels between the trigger and the viewport. (type `number`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

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
