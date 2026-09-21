# Tabs

Source URL: https://veanui.com/components/tabs
Markdown URL: https://veanui.com/components/tabs.md
Category: Navigation
Description: A set of layered sections of content—known as tab panels—that are displayed one at a time.

## Overview

A set of layered sections of content—known as tab panels—that are displayed one at a time.

## Features

- **WAI-ARIA tabs pattern** — the list renders as a `tablist`, triggers as `role="tab"`, panels as `role="tabpanel"`; the active tab carries `aria-selected`, each trigger links its panel via `aria-controls`/`aria-labelledby`, and `aria-orientation` reflects the layout direction.
- **Data-driven compact composition** — `STabs` delegates item iteration, default trigger/content composition, and indicator rendering to the generic Aria `TabsCompact<T>`, which owns the ARIA wiring for every item.
- **Controlled or uncontrolled state** — `modelValue` supports `v-model` (controlled); `defaultValue` provides uncontrolled usage backed by `useControllableState`.
- **Two activation modes** — `activationMode: 'automatic'` activates a tab on focus (ARIA default); `'manual'` activates only on click / `Enter` / `Space`.
- **Full keyboard navigation** — the `useRovingFocusGroup` hook provides arrow-key (and Home/End) movement that skips disabled tabs; `Enter` / `Space` activates the focused tab.
- **Presence-based content mounting** — `unmountOnHide: true` (default) unmounts inactive panels after the exit animation; `false` keeps every panel mounted but `hidden`; `forceMount` keeps a panel in the DOM unconditionally.
- **Animated indicator** — a sliding indicator tracks the active tab with CSS variables (`--vean-tabs-indicator-size` / `--vean-tabs-indicator-position`), measured via `ResizeObserver` and re-positioned on value/direction changes; RTL offsets are mirrored automatically.
- **Horizontal and vertical layouts** — `orientation: 'vertical'` stacks the list and runs the indicator along the block axis.
- **Three customization slots** — `trigger` (scoped `{ ...item, active }`), `content` (scoped `{ ...item, active }`), and `indicator`.
- **Six visual variants** — `size` (xs…2xl), `orientation` (horizontal / vertical), `shape` (square / rounded), `fill` (full / auto), and `enableIndicator` (falls back to a solid active-trigger style) via the `tabsVariants` `scv()` recipe.
- **Aria composition** — `TabsRoot` / `TabsList` / `TabsTrigger` / `TabsContent` / `TabsIndicator` / `TabsCompact` are exported from `@vean/aria/tabs` for fully custom styled builds.

## Usage

Usage examples for tabs are rendered on the site.

> `STabs` now delegates item iteration, default trigger/content composition, and indicator rendering to Aria `TabsCompact`. For unstyled, data-driven usage, import `TabsCompact` from `@vean/aria/tabs`.

## Demos

Interactive demos for tabs are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): Tabs, TabsCompact, TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger.

### Tabs

#### Props

Properties for the Tabs component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Styled tabs ui slots, including `indicatorContent` for the compact indicator body. (type `Partial<TabsUi>`; optional)
- `fill`: Fill. (type `TabsFill`; optional)
- `shape`: Shape of the component. (type `TabsShape`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `enableIndicator`: Whether to enable indicator. (type `boolean`; optional)
- `listProps`: Properties forwarded to the list element. (type `TabsListProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `TabsTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `TabsContentProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `TabsIndicatorProps`; optional)
- `modelValue`: The controlled value of the tab to activate. Can be bind as `v-model`. (type `T['value'] | null`; optional)
- `defaultValue`: The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs (type `T['value'] | null`; optional)
- `activationMode`: Whether a tab is activated automatically (on focus) or manually (on click). (type `TabsActivationMode`; default `automatic`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)

#### Emits

Events for the Tabs component.

- `update:modelValue`: Event handler called when the value changes (type `[payload: Exclude<T, undefined>]`; parameters `payload: Exclude<T, undefined>`)

#### Slots

Slots for the Tabs component.

- `trigger`: Custom content for the trigger slot. (type `((props: T & { selected: boolean; }) => any) | undefined`)
- `content`: Custom content for the content slot. (type `((props: T & { selected: boolean; }) => any) | undefined`)
- `indicator`: Custom content for the indicator slot. (type `(() => any) | undefined`)

### TabsCompact

#### Props

Properties for the TabsCompact component.

- `items`: Items rendered by the component. (type `T[]`; required)
- `enableIndicator`: Whether to enable indicator. (type `boolean`; optional)
- `listProps`: Properties forwarded to the list element. (type `TabsListProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `TabsTriggerProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `TabsContentProps`; optional)
- `indicatorProps`: Properties forwarded to the indicator element. (type `TabsIndicatorProps`; optional)
- `modelValue`: The controlled value of the tab to activate. Can be bind as `v-model`. (type `T['value'] | null`; optional)
- `defaultValue`: The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs (type `T['value'] | null`; optional)
- `activationMode`: Whether a tab is activated automatically (on focus) or manually (on click). (type `TabsActivationMode`; default `automatic`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)

#### Emits

Events for the TabsCompact component.

- `update:modelValue`: Event handler called when the value changes (type `[payload: Exclude<T, undefined>]`; parameters `payload: Exclude<T, undefined>`)

#### Slots

Slots for the TabsCompact component.

- `trigger`: Custom content for the trigger slot. (type `((props: T & { selected: boolean; }) => any) | undefined`)
- `content`: Custom content for the content slot. (type `((props: T & { selected: boolean; }) => any) | undefined`)
- `indicator`: Custom content for the indicator slot. (type `(() => any) | undefined`)

### TabsContent

#### Props

Properties for the TabsContent component.

- `value`: A unique value that associates the content with a trigger. (type `string | number`; required)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

### TabsIndicator

#### Props

Properties for the TabsIndicator component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### TabsList

- No documented props, emits, slots, or slot props were available.

### TabsRoot

#### Props

Properties for the TabsRoot component.

- `modelValue`: The controlled value of the tab to activate. Can be bind as `v-model`. (type `T`; optional)
- `defaultValue`: The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs (type `T`; optional)
- `activationMode`: Whether a tab is activated automatically (on focus) or manually (on click). (type `TabsActivationMode`; default `automatic`; optional)
- `unmountOnHide`: When `true`, the element will be unmounted on closed state. (type `boolean`; default `true`; optional)
- `dir`: The direction of navigation between items. (type `Direction`; optional)
- `loop`: Whether keyboard navigation should loop around (type `boolean`; default `false`; optional)
- `orientation`: The orientation of the group. Mainly so arrow navigation is done accordingly (left & right vs. up & down) (type `DataOrientation`; optional)

#### Emits

Events for the TabsRoot component.

- `update:modelValue`: Event handler called when the value changes (type `[payload: Exclude<T, undefined>]`; parameters `payload: Exclude<T, undefined>`)

### TabsTrigger

#### Props

Properties for the TabsTrigger component.

- `value`: A unique value that associates the trigger with a content. (type `string | number`; required)
- `disabled`: When `true`, prevents the user from interacting with the tab. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark comparison

| Concern                           | VeanUI                                             | shadcn-vue / Radix `Tabs`           | Ant Design `Tabs`                   | Element Plus `Tabs`   |
| :-------------------------------- | :------------------------------------------------- | :---------------------------------- | :---------------------------------- | :-------------------- |
| Aria / styled separation          | ✅ `@vean/aria/tabs` + `scv()`                     | ✅ Aria primitives                  | ❌ single package                   | ❌ single package     |
| Data-driven compact API           | ✅ generic `TabsCompact<T>` + `items`              | ✅ `TabList`/`Tab`/`TabPanel` parts | ✅ config-driven (items)            | ✅ config-driven      |
| Controlled / uncontrolled         | ✅ `modelValue` / `defaultValue`                   | ✅ `modelValue` / `defaultValue`    | ✅ `activeKey` / `defaultActiveKey` | ✅ `v-model`          |
| Activation mode                   | ✅ `automatic` / `manual`                          | ✅                                  | ❌ (always automatic)               | ❌ (always automatic) |
| Keyboard navigation               | ✅ roving focus (arrows/Home/End) + Enter/Space    | ✅ roving focus                     | ✅ arrows / Home / End              | ✅ arrows             |
| Disabled tab skipping             | ✅ roving focus skips disabled items               | ✅                                  | ✅                                  | ✅                    |
| Presence / forceMount content     | ✅ `unmountOnHide` + `forceMount` + exit animation | ✅ `forceMount`                     | ❌                                  | ❌                    |
| Animated indicator                | ✅ CSS vars + ResizeObserver + RTL mirroring       | ❌ (no built-in indicator)          | ✅ ink bar (line type)              | ❌                    |
| Horizontal + vertical             | ✅ `orientation`                                   | ✅                                  | ✅ `tabPosition`                    | ✅ `tab-position`     |
| Variants                          | ✅ size × orientation × shape × fill               | ❌ (style your own)                 | ✅ type / size / tabBarGutter       | ✅ type / size        |
| Custom slots                      | ✅ `trigger` / `content` / `indicator`             | ✅ part-level                       | ✅ `label` / `children`             | ✅ `label` / `icon`   |
| ARIA wiring (controls/labelledby) | ✅ automatic per item                              | ✅ automatic                        | ✅                                  | ✅                    |

### Runtime considerations

1. **Activation on focus** — with `activationMode: 'automatic'` (default), focusing a tab via keyboard (or `ArrowRight`/`ArrowLeft`) activates it; with `'manual'` only clicking or pressing `Enter`/`Space` activates.
2. **Indicator measurement** — the indicator positions itself against the active trigger after the list ref is attached, on value/direction changes, and on resize; it renders only after the first successful measurement.
3. **RTL positioning** — in `dir: 'rtl'` the indicator offset is mirrored (`list.clientWidth - offsetLeft - offsetWidth`) and the CSS `rtl:-translate-x-…` flips the translation, so the indicator stays anchored to the active tab.
4. **Content presence** — with `unmountOnHide: true`, inactive panel content is removed after the exit animation; with `false` it stays mounted but carries the `hidden` attribute; `forceMount` keeps the panel in the DOM while still honoring `hidden` for inactive panels.
5. **Controlled vs. uncontrolled** — when `modelValue` is provided, internal writes only emit `update:modelValue`; the DOM follows the prop, so external changes re-render automatically.
6. **Disabled tabs** — a disabled trigger keeps focusability only for roving focus (`data-disabled`, not the native `disabled` attribute), so arrow navigation can skip it; `mousedown` and key activation are blocked.
7. **ARIA ids** — triggers and panels are linked with deterministic ids (`soybean-tabs-trigger-{value}` / `soybean-tabs-content-{value}`); `aria-controls` is only emitted once the matching panel registers itself.

## FAQ

### How do I switch from automatic to manual activation?

Set `activationMode="manual"`. In manual mode focusing a tab no longer activates it; users activate a tab by clicking or pressing `Enter`/`Space`. This follows the WAI-ARIA tabs pattern for panels that are slow to render.

### Why doesn't the indicator appear immediately?

The indicator needs a first measurement of the active trigger (offset + size). It renders right after the list element is attached or the value changes. In a real browser a `ResizeObserver` notification also triggers a re-measure, keeping it aligned on resize.

### What does `unmountOnHide` control?

With `true` (default), switching tabs removes inactive panel content from the DOM after the exit animation — best for performance. With `false`, every panel stays mounted but inactive ones are `hidden` — best for preserving state (scroll positions, form inputs).

### How is keyboard navigation handled?

The list is a roving-focus group: `ArrowLeft`/`ArrowRight` (or `ArrowUp`/`ArrowDown` in vertical mode) move focus, `Home`/`End` jump to the first/last tab, disabled tabs are skipped, and `Enter`/`Space` activates the focused tab.

### Can I fully customize the tab rendering?

Yes — the `trigger` slot receives scoped `{ ...item, active }` props, the `content` slot `{ ...item, active }`, and `indicator` replaces the indicator body. For a completely custom structure, compose `TabsRoot` / `TabsList` / `TabsTrigger` / `TabsContent` / `TabsIndicator` from `@vean/aria/tabs` and inject styles via `provideTabsUi` (or `STabs`'s `ui` prop).

### Do I need to wire `aria-controls` myself?

No. Each trigger automatically points `aria-controls` at its panel id (`soybean-tabs-content-{value}`) once the panel mounts, and each panel sets `aria-labelledby` back to its trigger — both stay in sync when items are added or removed.
