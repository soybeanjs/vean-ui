# Toolbar

Source URL: https://veanui.com/components/toolbar
Markdown URL: https://veanui.com/components/toolbar.md
Category: Layout
Description: A compact container that groups related actions, links, and toggle controls into a single roving-focus toolbar. SToolbar combines the Aria toolbar primitives (ToolbarRoot/ToolbarButton/ToolbarLink/ToolbarSeparator/ToolbarToggleGroup/ToolbarToggleItem) with the toolbarVariants style recipe (7 slots, 6 sizes × 2 orientations).

## Overview

A compact container that groups related actions, links, and toggle controls into a single roving-focus toolbar. `SToolbar` combines the Aria toolbar primitives (`ToolbarRoot`/`ToolbarButton`/`ToolbarLink`/`ToolbarSeparator`/`ToolbarToggleGroup`/`ToolbarToggleItem`) with the `toolbarVariants` style recipe (7 slots, 6 sizes × 2 orientations).

Use a toolbar for a dense, keyboard-navigable row of actions. For a single action button use `button`; for grouped buttons use `toggle-group`.

## Usage

Usage examples for toolbar are rendered on the site.

## Features

- 🧩 Aria/styled split — `ToolbarRoot` provides the toolbar context; each part (`button`/`link`/`separator`/`toggle-group`) is a thin styled primitive
- ⌨️ Roving focus — arrow-key navigation between toolbar items, Home/End, with optional `loop`; separators/disabled items are skipped
- ↔️ Orientation — `horizontal` (default) or `vertical`; separators auto-flip orientation
- 🔘 Toggle group — `SToolbarToggleGroup`/`SToolbarToggleItem` for single/multi-select toggles with `v-model`
- 🔗 Link support — `SToolbarLink` renders an anchor with a leading icon (`showIcon`)
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — `role="toolbar"`, `aria-orientation`, `aria-pressed` on toggles, `axe-core` clean

## Component family

- `SToolbar` (styled) — the root wrapper; `toolbarVariants` recipe (`size` + orientation) with `provideToolbarUi`
- `SToolbarButton` (styled) — a toolbar button (`Button` base)
- `SToolbarLink` (styled) — a toolbar link (`Link` base with optional `showIcon`)
- `SToolbarSeparator` (styled) — an orientation-aware divider (`SeparatorRoot` base)
- `SToolbarToggleGroup` / `SToolbarToggleItem` (styled) — toggle-group controls (`ToggleGroupRoot`/`ToggleGroupItem` base)
- `ToolbarRoot`/`ToolbarButton`/`ToolbarLink`/`ToolbarSeparator`/`ToolbarToggleGroup`/`ToolbarToggleItem` (Aria) — the underlying primitives

## Demos

Interactive demos for toolbar are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): Toolbar, ToolbarButton, ToolbarLink, ToolbarRoot, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem.

### Toolbar

#### Props

Properties for the Toolbar component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ToolbarUi>`; optional)
- `orientation`: The orientation of the toolbar. (type `DataOrientation`; optional)
- `dir`: The reading direction of the toolbar. (type `Direction`; optional)
- `loop`: Whether keyboard roving focus loops. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ToolbarButton

#### Props

Properties for the ToolbarButton component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ToolbarButton component.

- `click`: Emitted when click occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### ToolbarLink

#### Props

Properties for the ToolbarLink component.

- `showIcon`: Whether or not to show an icon when the `href` prop is provided. (type `boolean`; optional)
- `to`: Route Location the link should navigate to when clicked on. (type `string | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric`; optional)
- `replace`: Calls `router.replace` instead of `router.push`. (type `boolean`; optional)
- `href`: The URL the link should navigate to when clicked on. (type `string`; optional)
- `disabled`: When `true`, the link is disabled. (type `boolean`; optional)
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
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ToolbarRoot

#### Props

Properties for the ToolbarRoot component.

- `orientation`: The orientation of the toolbar. (type `DataOrientation`; optional)
- `dir`: The reading direction of the toolbar. (type `Direction`; optional)
- `loop`: Whether keyboard roving focus loops. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ToolbarSeparator

#### Props

Properties for the ToolbarSeparator component.

- `decorative`: Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes are updated so that that the rendered element is removed from the accessibility tree. (type `boolean`; optional)

### ToolbarToggleGroup

#### Props

Properties for the ToolbarToggleGroup component.

- `rovingFocus`: When `false`, navigating through items with arrow keys is disabled. (type `boolean`; optional)
- `disabled`: When `true`, prevents interaction with all items in the group. (type `boolean`; optional)
- `orientation`: The orientation of the component. (type `DataOrientation`; optional)
- `dir`: The reading direction of the group when applicable. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation loops from last to first item, and vice versa. (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? T[] : T)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? T[] : T)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ToolbarToggleGroup component.

- `update:modelValue`: No description. (type `[value: M extends true ? T[] : T]`; parameters `value: M extends true ? T[] : T`)

### ToolbarToggleItem

#### Props

Properties for the ToolbarToggleItem component.

- `value`: A unique value that identifies the item inside the group. (type `T`; required)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark differences

The toolbar family is a multi-slot composition: `ToolbarRoot` provides the roving-focus + orientation context while each part (button/link/separator/toggle-group) reuses the button, link, separator and toggle-group primitives, with the UI wrapper injecting `toolbarVariants` classes per slot. This mirrors radix-ui/shadcn-ui's headless toolbar/toggle-group split. Ant Design, Element Plus, Mantine and Naive UI ship a button/segmented-control but not a dedicated roving-focus toolbar container with orientation-aware separators; VeanUI provides a complete toolbar with `loop`/RTL support and a `size` scale.

| Capability          | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------ | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Roving focus + loop |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| Orientation-aware   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Toggle group        |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Link support        |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)           |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `SToolbar` renders `role="toolbar"` with `aria-orientation` (`horizontal` default / `vertical`); separators auto-flip to match.
- Roving focus uses arrow keys + Home/End; `loop` wraps navigation. Disabled items and separators are skipped.
- `SToolbarToggleGroup` supports single (`model-value` string) and multiple (`model-value` array) selection with `v-model`.
- `dir`/RTL is derived from the `ConfigProvider` locale (e.g. `ar`) or set explicitly on the root.
- `SToolbarLink` renders an anchor; `showIcon` adds a leading icon next to the link text.

### Roadmap

N/A — toolbar is feature-complete for the current parity set.

## FAQ

### How do I build a toolbar?

Compose buttons, links, a separator and a toggle group:

```vue
<SToolbarButton>Cut</SToolbarButton>
<SToolbarButton>Copy</SToolbarButton>
<SToolbarSeparator />
<SToolbarToggleGroup v-model="align">
    <SToolbarToggleItem value="left">Left</SToolbarToggleItem>
    <SToolbarToggleItem value="center">Center</SToolbarToggleItem>
  </SToolbarToggleGroup>
```

### How do I make it vertical?

Set `orientation="vertical"`:

```vue
<SToolbarButton>Up</SToolbarButton>
<SToolbarButton>Down</SToolbarButton>
```

### How do I make navigation loop?

Set `loop`:

```vue
<SToolbarButton>A</SToolbarButton>
<SToolbarButton>B</SToolbarButton>
```

### How do I add a link?

Use `SToolbarLink` with `href` and `show-icon`:

```vue
<SToolbarLink href="https://example.com" show-icon>Website</SToolbarLink>
```
