---
head:
  title: Breadcrumb
  description: Breadcrumbs allow users to navigate through the hierarchy of pages. It displays the current location within the application structure.
---

# Breadcrumb

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

<UsageCode component="breadcrumb" />

> `SBreadcrumb` delegates its list aggregation to Aria `BreadcrumbCompact`. For unstyled, data-driven composition, import `BreadcrumbCompact` from `@vean/aria/breadcrumb`.

## Demos

<PlaygroundGallery component="breadcrumb" />

## API

<ComponentApi component="breadcrumb" />

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
