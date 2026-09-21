# Breadcrumb

Source URL: https://veanui.com/components/breadcrumb
Markdown URL: https://veanui.com/components/breadcrumb.md
Category: Navigation
Description: Breadcrumbs allow users to navigate through the hierarchy of pages. It displays the current location within the application structure.

## Overview

Breadcrumbs allow users to navigate through the hierarchy of pages. It displays the current location within the application structure.

## Features

- **Data-driven compact composition** — `SBreadcrumb` renders items from an `items` array; the Aria `BreadcrumbCompact` owns iteration, default content, and internal composition (root → list → items → separators).
- **Link vs. current page** — items with `to` / `href` render as `BreadcrumbLink` (reusing the Link primitive); the trailing item without a destination renders as `BreadcrumbPage` with `aria-current="page"` and `aria-disabled`.
- **Ellipsis collapsing** — `ellipsis: true` collapses all middle items into an ellipsis when there are 5+ items; `ellipsis: [start, end]` allows a custom collapse range (normalized so `start 0 → 1` and `end length → length - 1`).
- **Click events with item data** — the `click` event emits the full activated item object; disabled items never emit.
- **Full ARIA semantics** — `nav` carries a localized `aria-label`; separators and the ellipsis are `role="presentation"` + `aria-hidden`; the current page uses `aria-current="page"`.
- **Per-region props forwarding** — `listProps`, `itemProps`, `linkProps`, `pageProps`, `separatorProps`, `ellipsisProps` forward attributes to each region.
- **Eight customization slots** — `default`, `ellipsis`, `ellipsis-icon`, `separator`, `item-leading`, `item-link`, `item-label`, `item-trailing` with typed scoped props (`item`, `index`, `ellipsisItems`).
- **Icon support** — each item can carry an `icon` (rendered via the `item-leading` slot default) with `IconValue` typing.
- **Disabled items** — `disabled: true` on an item disables the link and suppresses click emission.
- **Size scaling** — `size` (xs…2xl) scales typography and spacing via `breadcrumbVariants`.
- **Aria composition** — `BreadcrumbRoot` / `BreadcrumbList` / `BreadcrumbItem` / `BreadcrumbLink` / `BreadcrumbPage` / `BreadcrumbSeparator` / `BreadcrumbEllipsis` are exported from `@vean/aria/breadcrumb` for fully custom styled builds.

## Usage

Usage examples for breadcrumb are rendered on the site.

> `SBreadcrumb` delegates its list aggregation to Aria `BreadcrumbCompact`. For unstyled, data-driven composition, import `BreadcrumbCompact` from `@vean/aria/breadcrumb`.

## Demos

Interactive demos for breadcrumb are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (11): Breadcrumb, BreadcrumbCompact, BreadcrumbCompactEllipsis, BreadcrumbCompactItem, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbRoot, BreadcrumbSeparator.

### Breadcrumb

#### Props

Properties for the Breadcrumb component.

- `class`: root class (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<BreadcrumbUi>`; optional)
- `items`: Items rendered by the component. (type `T[]`; required)
- `ellipsis`: The range of items to show ellipsis. When the item count is greater than 4, we will show ellipsis. (type `true | [number, number] | null`; optional)
- `listProps`: Properties forwarded to the list element. (type `BreadcrumbListProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `BreadcrumbItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `pageProps`: Properties forwarded to the page element. (type `BreadcrumbPageProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `BreadcrumbSeparatorProps`; optional)
- `ellipsisProps`: Properties forwarded to the ellipsis element. (type `BreadcrumbEllipsisProps`; optional)

#### Emits

Events for the Breadcrumb component.

- `click`: Emitted when click occurs. (type `[item: T]`; parameters `item: T`)

#### Slots

Slots for the Breadcrumb component.

- `default`: Custom content for the default slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `ellipsis`: Custom content for the ellipsis slot. (type `((props: BreadcrumbCompactEllipsisSlotProps<T>) => any) | undefined`)
- `ellipsis-icon`: Custom content for the ellipsis icon slot. (type `(() => any) | undefined`)
- `separator`: Custom content for the separator slot. (type `(() => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `item-link`: Custom content for the item link slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `item-label`: Custom content for the item label slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)

### BreadcrumbCompact

#### Props

Properties for the BreadcrumbCompact component.

- `items`: Items rendered by the component. (type `T[]`; required)
- `ellipsis`: The range of items to show ellipsis. When the item count is greater than 4, we will show ellipsis. (type `true | [number, number] | null`; optional)
- `listProps`: Properties forwarded to the list element. (type `BreadcrumbListProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `BreadcrumbItemProps`; optional)
- `linkProps`: Properties forwarded to the link element. (type `LinkExtraProps`; optional)
- `pageProps`: Properties forwarded to the page element. (type `BreadcrumbPageProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `BreadcrumbSeparatorProps`; optional)
- `ellipsisProps`: Properties forwarded to the ellipsis element. (type `BreadcrumbEllipsisProps`; optional)

#### Emits

Events for the BreadcrumbCompact component.

- `click`: Emitted when click occurs. (type `[item: T]`; parameters `item: T`)

#### Slots

Slots for the BreadcrumbCompact component.

- `default`: Custom content for the default slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `ellipsis`: Custom content for the ellipsis slot. (type `((props: BreadcrumbCompactEllipsisSlotProps<T>) => any) | undefined`)
- `ellipsis-icon`: Custom content for the ellipsis icon slot. (type `(() => any) | undefined`)
- `separator`: Custom content for the separator slot. (type `(() => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `item-link`: Custom content for the item link slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `item-label`: Custom content for the item label slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: BreadcrumbCompactItemSlotProps<T>) => any) | undefined`)

### BreadcrumbCompactEllipsis

#### Slot Props

Slot properties for the BreadcrumbCompactEllipsis component.

- `ellipsisItems`: Ellipsis items exposed in the slot scope. (type `T[]`; required)

### BreadcrumbCompactItem

#### Slot Props

Slot properties for the BreadcrumbCompactItem component.

- `item`: Current item data. (type `T`; required)
- `index`: Index of the current item. (type `number`; required)

### BreadcrumbEllipsis

- No documented props, emits, slots, or slot props were available.

### BreadcrumbItem

- No documented props, emits, slots, or slot props were available.

### BreadcrumbLink

#### Props

Properties for the BreadcrumbLink component.

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

### BreadcrumbList

- No documented props, emits, slots, or slot props were available.

### BreadcrumbPage

- No documented props, emits, slots, or slot props were available.

### BreadcrumbRoot

- No documented props, emits, slots, or slot props were available.

### BreadcrumbSeparator

- No documented props, emits, slots, or slot props were available.

## Notes

### Architecture and benchmark comparison

| Concern                       | VeanUI                                                | shadcn-vue `Breadcrumb`                       | Ant Design `Breadcrumb`            | Element Plus `Breadcrumb`     |
| :---------------------------- | :---------------------------------------------------- | :-------------------------------------------- | :--------------------------------- | :---------------------------- |
| Aria / styled separation      | ✅ `@vean/aria/breadcrumb` + `scv()`                  | ❌ single package                             | ❌ single package                  | ❌ single package             |
| Data-driven compact API       | ✅ `items` + `ellipsis` + `click`                     | ❌ slot/component composition only            | ✅ `routes` / `items`              | ✅ `breadcrumb-item` loop     |
| Ellipsis collapsing           | ✅ `true` (5+ items) or custom `[start, end]`         | ❌ manual ellipsis item                       | ✅ `ellipsis` (4+ count)           | ❌ manual                     |
| Link vs. current page         | ✅ `to`/`href` → Link; trailing → `aria-current` page | ✅ separate `BreadcrumbLink`/`BreadcrumbPage` | ✅ `BreadcrumbItem` last = current | ✅ last item auto current     |
| Click event with item data    | ✅ `click(item)`; disabled suppressed                 | ❌ native link only                           | ✅ `onClick(route)`                | ✅ `select` event             |
| Disabled items                | ✅ `disabled` on item data                            | —                                             | ✅                                 | —                             |
| Localized `aria-label`        | ✅ locale registry                                    | hard-coded                                    | `itemRender` only                  | —                             |
| Region-level props forwarding | ✅ 6 props groups                                     | `asChild` per part                            | `itemRender`                       | `separator` slot              |
| Customization slots           | ✅ 8 typed slots                                      | ✅ 5 parts + separator slot                   | `itemRender`                       | ✅ `separator` / `title` slot |
| Size scaling                  | ✅ xs…2xl                                             | ✅ fixed                                      | ✅ `size`                          | —                             |

### Runtime considerations

1. **Ellipsis index math** — `getEllipsisRange` returns `null` below 5 items; `[1, len-2]` for `true`; user ranges are normalized (`start 0 → 1`, `end length → length - 1`) to always keep the first and last item visible.
2. **Ellipsis placement** — the collapsed ellipsis is rendered at the new-array index matching `start`, i.e. directly before the first post-collapse item; a separator follows the ellipsis.
3. **Disabled click suppression** — `handleItemClick` ignores items with `disabled: true`, so the `click` event never carries a disabled item (link clicks are also blocked by the Link primitive).
4. **Link routing** — `BreadcrumbLink` extends the Link primitive, so `to` (router-link) and `href` / `external` (anchor) both work; `target` is honored.
5. **Current page semantics** — the last item without `to`/`href` renders as `BreadcrumbPage` (`role="link"` + `aria-disabled="true"` + `aria-current="page"`), so AT users know it is not a navigable link.
6. **Locale fallback** — the `nav` `aria-label` comes from `useLocaleMessages`; missing locale keys fall back to the default English bundle.

## FAQ

### When does the ellipsis appear?

With `ellipsis: true`, the ellipsis renders only when there are 5 or more items; the first and last items always stay visible and the middle ones are collapsed. Use `ellipsis: [start, end]` to pick exactly which range collapses (both endpoints are normalized to keep the edges visible).

### How do I make an item a link vs. the current page?

An item with `to` (router) or `href`/`external` (anchor) renders as a link. The trailing item without a destination renders as the current page with `aria-current="page"`. To force a non-last item to be a plain label, omit `to`/`href` on it.

### Why doesn't clicking a disabled item emit anything?

Disabled items are intentionally inert: the link is disabled by the Link primitive and the compact component suppresses the `click` event for `disabled: true` items, matching the expected breadcrumb behavior.

### Can I customize the separator?

Yes — use the `separator` slot. Each separator (including the one after the ellipsis) renders your content. For per-region styling, pass `separatorProps` or the `ui` recipe classes.

### What scoped props do the item slots receive?

`item-leading`, `item-link`, `item-label`, `item-trailing`, and the default slot receive `{ item, index }`; the `ellipsis` slot receives `{ ellipsisItems }`. The UI wrapper forwards these unchanged to your custom slot content.

### Is the breadcrumb accessible?

Yes — the root is a `nav` with a localized `aria-label`, the list is an `ol`, separators and the ellipsis are hidden from assistive technology, and the current page is announced via `aria-current="page"`.

### Can I build a fully custom breadcrumb?

Yes — compose `BreadcrumbRoot` / `BreadcrumbList` / `BreadcrumbItem` / `BreadcrumbLink` / `BreadcrumbPage` / `BreadcrumbSeparator` / `BreadcrumbEllipsis` from `@vean/aria/breadcrumb` and inject styles via `provideBreadcrumbUi` (or `SBreadcrumb`'s `ui` prop).
