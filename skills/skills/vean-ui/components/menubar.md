# Menubar

Source URL: https://veanui.com/components/menubar
Markdown URL: https://veanui.com/components/menubar.md
Category: Navigation
Description: Menubar builds a persistent horizontal menu bar for application chrome: a row of triggers with roving focus that open dropdown menus on click or hover, with arbitrarily nested submenus and full keyboard navigation.

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

Usage examples for menubar are rendered on the site.

## Demos

Interactive demos for menubar are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (21): Menubar, MenubarArrow, MenubarCheckboxGroup, MenubarCheckboxItem, MenubarCompact, MenubarContent, MenubarGroup, MenubarGroupLabel, MenubarItem, MenubarItemIndicator, MenubarMenu, MenubarMenus, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarRoot, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger.

### Menubar

#### Props

Properties for the Menubar component.

- `class`: class of menubar root (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<MenubarUi>`; optional)
- `indicatorPosition`: Indicator position. (type `AlignSide`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `placement`: Placement. (type `Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `MenubarTriggerProps`; optional)
- `collapsible`: When `true`, if the menubar content is wider than its container, the trailing items collapse into a trailing "more" menu so the content always fits inside the container. (type `boolean`; optional)
- `moreLabel`: Label of the trailing "more" trigger when `collapsible`. (type `string`; default `undefined`; optional)
- `moreIcon`: Icon of the trailing "more" trigger when `collapsible`. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)
- `moreProps`: Properties forwarded to the trailing "more" trigger. (type `MenubarTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `MenuPortalProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `MenubarContentProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `MenuPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `MenuArrowProps`; optional)
- `modelValue`: The controlled value of the menu to open. Can be used as `v-model`. (type `T`; optional)
- `defaultValue`: The value of the menu that should be open when initially rendered. (type `T`; optional)
- `dir`: The reading direction of the menubar when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation loops from last trigger to first and vice versa. (type `boolean`; optional)
- `trigger`: The trigger type of the menubar. - `click`: The menu will be opened when the trigger is clicked (hovering an open menubar still switches between menus). - `hover`: The menu will be opened when the trigger is hovered. (type `MenubarTriggerType`; default `'click'`; optional)
- `delayDuration`: The duration from when the pointer enters the trigger until the menu gets opened in hover mode. (type `number`; default `150`; optional)
- `skipDelayDuration`: How much time a user has to enter another trigger without incurring a delay again. (type `number`; default `300`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `items`: Items rendered by the component. (type `MenuOptionData<T>[]`; required)
- `selectedValue`: The selected value of the menu. (type `T`; optional)
- `itemProps`: Properties forwarded to the item element. (type `MenuItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `MenuSubProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `MenuGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `MenuGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element. (type `MenuShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `MenuSeparatorProps`; optional)
- `subTriggerProps`: Properties forwarded to the sub trigger element. (type `MenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the sub content element. (type `MenuSubContentProps`; optional)

#### Emits

Events for the Menubar component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: T]`; parameters `value: T`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `entryFocus`: Emitted when entry focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `select`: Emitted when select occurs. (type `[item: MenuOptionData<T>, event: Event]`; parameters `item: MenuOptionData<T>, event: Event`)

#### Slots

Slots for the Menubar component.

- `item`: Custom content for the item slot. (type `((props: { item: MenuOptionData<T>; isTrigger?: boolean; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `item-trigger-icon`: Custom content for the item trigger icon slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `item-link-icon`: Custom content for the item link icon slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `trigger`: Custom content for the trigger slot. Optional: `MenubarCompact` renders full default trigger content (icon, label, link icon, trailing slot) when the consumer does not provide it. (type `((data: { item: MenuOptionData<T>; }) => any) | undefined`)
- `more-trigger`: Custom content for the trailing "more" trigger when `collapsible`. (type `(() => any) | undefined`)

### MenubarArrow

- No documented props, emits, slots, or slot props were available.

### MenubarCheckboxGroup

- No documented props, emits, slots, or slot props were available.

### MenubarCheckboxItem

- No documented props, emits, slots, or slot props were available.

### MenubarCompact

#### Props

Properties for the MenubarCompact component.

- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `placement`: Placement. (type `Placement`; optional)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `MenubarTriggerProps`; optional)
- `collapsible`: When `true`, if the menubar content is wider than its container, the trailing items collapse into a trailing "more" menu so the content always fits inside the container. (type `boolean`; optional)
- `moreLabel`: Label of the trailing "more" trigger when `collapsible`. (type `string`; default `undefined`; optional)
- `moreIcon`: Icon of the trailing "more" trigger when `collapsible`. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)
- `moreProps`: Properties forwarded to the trailing "more" trigger. (type `MenubarTriggerProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `MenuPortalProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `MenubarContentProps`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `MenuPopupProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `MenuArrowProps`; optional)
- `modelValue`: The controlled value of the menu to open. Can be used as `v-model`. (type `T`; optional)
- `defaultValue`: The value of the menu that should be open when initially rendered. (type `T`; optional)
- `dir`: The reading direction of the menubar when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation loops from last trigger to first and vice versa. (type `boolean`; optional)
- `trigger`: The trigger type of the menubar. - `click`: The menu will be opened when the trigger is clicked (hovering an open menubar still switches between menus). - `hover`: The menu will be opened when the trigger is hovered. (type `MenubarTriggerType`; default `'click'`; optional)
- `delayDuration`: The duration from when the pointer enters the trigger until the menu gets opened in hover mode. (type `number`; default `150`; optional)
- `skipDelayDuration`: How much time a user has to enter another trigger without incurring a delay again. (type `number`; default `300`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `items`: Items rendered by the component. (type `MenuOptionData<T>[]`; required)
- `selectedValue`: The selected value of the menu. (type `T`; optional)
- `itemProps`: Properties forwarded to the item element. (type `MenuItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `subProps`: Properties forwarded to the sub element. (type `MenuSubProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `MenuGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `MenuGroupLabelProps`; optional)
- `shortcutProps`: Properties forwarded to the shortcut element. (type `MenuShortcutProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `MenuSeparatorProps`; optional)
- `subTriggerProps`: Properties forwarded to the sub trigger element. (type `MenuSubTriggerProps`; optional)
- `subContentProps`: Properties forwarded to the sub content element. (type `MenuSubContentProps`; optional)

#### Emits

Events for the MenubarCompact component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: T]`; parameters `value: T`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `entryFocus`: Emitted when entry focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `update:open`: Event handler called when the open state of the dialog changes. (type `[value: boolean]`; parameters `value: boolean`)
- `select`: Emitted when select occurs. (type `[item: MenuOptionData<T>, event: Event]`; parameters `item: MenuOptionData<T>, event: Event`)

#### Slots

Slots for the MenubarCompact component.

- `item`: Custom content for the item slot. (type `((props: { item: MenuOptionData<T>; isTrigger?: boolean; }) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `item-trigger-icon`: Custom content for the item trigger icon slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `item-link-icon`: Custom content for the item link icon slot. (type `((props: { item: MenuOptionData<T>; }) => any) | undefined`)
- `trigger`: Custom content for the trigger slot. Optional: `MenubarCompact` renders full default trigger content (icon, label, link icon, trailing slot) when the consumer does not provide it. (type `((data: { item: MenuOptionData<T>; }) => any) | undefined`)
- `more-trigger`: Custom content for the trailing "more" trigger when `collapsible`. (type `(() => any) | undefined`)

### MenubarContent

#### Props

Properties for the MenubarContent component.

- `popupProps`: Properties forwarded to the popup element. (type `MenuPopupProps`; optional)
- `placement`: The placement of the floating element. If used, it will override the `side` and `align` props. (type `Placement`; default `undefined`; optional)
- `side`: The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. (type `Side`; default `'bottom'`; optional)
- `sideOffset`: The distance in pixels from the trigger. (type `number`; default `0`; optional)
- `sideFlip`: Flip to the opposite side when colliding with boundary. (type `boolean`; default `true`; optional)
- `align`: The preferred alignment against the trigger. May change when collisions occur. (type `Align`; default `'center'`; optional)
- `alignOffset`: An offset in pixels from the `start` or `end` alignment options. (type `number`; default `0`; optional)
- `alignFlip`: Flip alignment when colliding with boundary. May only occur when `prioritizePosition` is true. (type `boolean`; default `true`; optional)
- `avoidCollisions`: When `true`, overrides the side and align preferences to prevent collisions with boundary edges. (type `boolean`; default `true`; optional)
- `collisionBoundary`: The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check. (type `Element | (Element | null)[] | null`; default `[ ]`; optional)
- `collisionPadding`: The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }. (type `Padding`; default `0`; optional)
- `arrowPadding`: The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners. (type `number`; default `0`; optional)
- `hideShiftedArrow`: When `true`, hides the arrow when it cannot be centered to the reference element. (type `boolean`; default `true`; optional)
- `sticky`: The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. (type `'partial' | 'always'`; default `'partial'`; optional)
- `hideWhenDetached`: Whether to hide the content when the trigger becomes fully occluded. (type `boolean`; default `false`; optional)
- `positionStrategy`: The type of CSS position property to use. (type `'fixed' | 'absolute'`; default `'fixed'`; optional)
- `updatePositionStrategy`: Strategy to update the position of the floating element on every animation frame. (type `'always' | 'optimized'`; default `'optimized'`; optional)
- `disableUpdateOnLayoutShift`: Whether to disable the update position for the content when the layout shifted. (type `boolean`; default `false`; optional)
- `prioritizePosition`: Force content to be position within the viewport. Might overlap the reference element, which may not be desired. (type `boolean`; default `false`; optional)
- `reference`: The custom element or virtual element that will be set as the reference to position the floating element. If provided, it will replace the default anchor element. (type `ReferenceElement`; optional)
- `trapFocus`: Whether focus is trapped inside the popup while open (Tab cycles within the layer and body scroll is locked for modal layers). (type `boolean`; default `modal`; optional)
- `disableHoverableContent`: When `true`, hovering the popup closes instead of keeping it open (the grace area is disabled, so leaving the trigger closes the layer immediately). (type `boolean`; default `false`; optional)
- `onGracePointerExit`: Callback invoked when the pointer finally leaves the grace area. Lets an upper layer (e.g. Tooltip) run area-scoped close logic without registering its own second grace area. (type `(() => void)`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)

#### Emits

Events for the MenubarContent component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `entryFocus`: Emitted when entry focus occurs. (type `[event: Event]`; parameters `event: Event`)

### MenubarGroup

- No documented props, emits, slots, or slot props were available.

### MenubarGroupLabel

- No documented props, emits, slots, or slot props were available.

### MenubarItem

- No documented props, emits, slots, or slot props were available.

### MenubarItemIndicator

- No documented props, emits, slots, or slot props were available.

### MenubarMenu

#### Props

Properties for the MenubarMenu component.

- `value`: A unique value that associates the trigger with the active root value when controlled. (type `DefinedValue`; optional)

### MenubarMenus

#### Props

Properties for the MenubarMenus component (the internal list renderer used
by `MenubarCompact`).

- `items`: Top-level items rendered as visible triggers. (type `MenuOptionData<T>[]`; required)
- `moreItems`: Items collapsed into the trailing "more" menu. (type `MenuOptionData<T>[]`; required)
- `rootProps`: Props forwarded to the menubar root. (type `{ [x: string]: unknown; }`; required)
- `listeners`: Listeners forwarded to the menubar root. (type `{ [x: string]: unknown; }`; required)
- `optionsProps`: Props forwarded to the menu options of each open menu. (type `{ [x: string]: unknown; }`; required)
- `linkProps`: Props forwarded to link triggers. (type `LinkExtraProps`; optional)
- `contentProps`: Props forwarded to the content of each menu. (type `MenubarContentProps`; required)
- `portalProps`: Props forwarded to the portal of each menu. (type `MenuPortalProps`; optional)
- `getTriggerProps`: Resolve the effective props of a top-level trigger item. (type `(item: MenuOptionData<T>) => MenubarTriggerProps`; required)
- `moreTriggerProps`: Props forwarded to the trailing "more" trigger. (type `{ [x: string]: unknown; }`; required)
- `moreLabel`: Label of the trailing "more" trigger. (type `string`; optional)
- `moreIcon`: Icon of the trailing "more" trigger. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)

### MenubarPortal

- No documented props, emits, slots, or slot props were available.

### MenubarRadioGroup

- No documented props, emits, slots, or slot props were available.

### MenubarRadioItem

- No documented props, emits, slots, or slot props were available.

### MenubarRoot

#### Props

Properties for the MenubarRoot component.

- `modelValue`: The controlled value of the menu to open. Can be used as `v-model`. (type `T`; optional)
- `defaultValue`: The value of the menu that should be open when initially rendered. (type `T`; optional)
- `dir`: The reading direction of the menubar when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation loops from last trigger to first and vice versa. (type `boolean`; optional)
- `trigger`: The trigger type of the menubar. - `click`: The menu will be opened when the trigger is clicked (hovering an open menubar still switches between menus). - `hover`: The menu will be opened when the trigger is hovered. (type `MenubarTriggerType`; default `'click'`; optional)
- `delayDuration`: The duration from when the pointer enters the trigger until the menu gets opened in hover mode. (type `number`; default `150`; optional)
- `skipDelayDuration`: How much time a user has to enter another trigger without incurring a delay again. (type `number`; default `300`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the MenubarRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: T]`; parameters `value: T`)

### MenubarSeparator

- No documented props, emits, slots, or slot props were available.

### MenubarSub

- No documented props, emits, slots, or slot props were available.

### MenubarSubContent

#### Props

Properties for the MenubarSubContent component.

- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `placement`: The placement of the floating element. If used, it will override the `side` and `align` props. (type `Placement`; default `undefined`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `MenuPopupProps`; optional)
- `sideOffset`: The distance in pixels from the trigger. (type `number`; default `0`; optional)
- `arrowPadding`: The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners. (type `number`; default `0`; optional)
- `updatePositionStrategy`: Strategy to update the position of the floating element on every animation frame. (type `'always' | 'optimized'`; default `'optimized'`; optional)
- `sideFlip`: Flip to the opposite side when colliding with boundary. (type `boolean`; default `true`; optional)
- `alignOffset`: An offset in pixels from the `start` or `end` alignment options. (type `number`; default `0`; optional)
- `alignFlip`: Flip alignment when colliding with boundary. May only occur when `prioritizePosition` is true. (type `boolean`; default `true`; optional)
- `avoidCollisions`: When `true`, overrides the side and align preferences to prevent collisions with boundary edges. (type `boolean`; default `true`; optional)
- `collisionBoundary`: The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check. (type `Element | (Element | null)[] | null`; default `[ ]`; optional)
- `collisionPadding`: The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }. (type `Padding`; default `0`; optional)
- `hideShiftedArrow`: When `true`, hides the arrow when it cannot be centered to the reference element. (type `boolean`; default `true`; optional)
- `sticky`: The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. (type `'partial' | 'always'`; default `'partial'`; optional)
- `hideWhenDetached`: Whether to hide the content when the trigger becomes fully occluded. (type `boolean`; default `false`; optional)
- `positionStrategy`: The type of CSS position property to use. (type `'fixed' | 'absolute'`; default `'fixed'`; optional)
- `disableUpdateOnLayoutShift`: Whether to disable the update position for the content when the layout shifted. (type `boolean`; default `false`; optional)
- `prioritizePosition`: Force content to be position within the viewport. Might overlap the reference element, which may not be desired. (type `boolean`; default `false`; optional)
- `reference`: The custom element or virtual element that will be set as the reference to position the floating element. If provided, it will replace the default anchor element. (type `ReferenceElement`; optional)
- `trapFocus`: Whether focus is trapped inside the popup while open (Tab cycles within the layer and body scroll is locked for modal layers). (type `boolean`; default `modal`; optional)
- `disableHoverableContent`: When `true`, hovering the popup closes instead of keeping it open (the grace area is disabled, so leaving the trigger closes the layer immediately). (type `boolean`; default `false`; optional)
- `onGracePointerExit`: Callback invoked when the pointer finally leaves the grace area. Lets an upper layer (e.g. Tooltip) run area-scoped close logic without registering its own second grace area. (type `(() => void)`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

#### Emits

Events for the MenubarSubContent component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `entryFocus`: Emitted when entry focus occurs. (type `[event: Event]`; parameters `event: Event`)

### MenubarSubTrigger

#### Props

Properties for the MenubarSubTrigger component.

- `disabled`: When `true`, prevents the user from interacting with the item. (type `boolean`; optional)
- `textValue`: Optional text used for typeahead purposes. By default the typeahead behavior will use the `.textContent` of the item. <br> Use this when the content is complex, or you have non-textual content inside. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### MenubarTrigger

#### Props

Properties for the MenubarTrigger component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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
