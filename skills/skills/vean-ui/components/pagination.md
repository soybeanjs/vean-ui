# Pagination

Source URL: https://veanui.com/components/pagination
Markdown URL: https://veanui.com/components/pagination.md
Category: Navigation
Description: Pagination is used for splitting up content or data into several pages, with a control for navigating to the next or previous page.

## Overview

Pagination is used for splitting up content or data into several pages, with a control for navigating to the next or previous page.

## Features

- **Data-driven compact composition** — `SPagination` delegates the whole structure to the Aria `PaginationCompact`, which owns the page windowing, default content, and internal composition (root → list → page items / actions → ellipsis).
- **Controlled or uncontrolled page state** — `page` / `pageSize` support `v-model` (controlled), while `defaultPage` / `defaultPageSize` provide uncontrolled usage backed by `useControllableState`.
- **Smart page windowing** — `siblingCount` controls how many page buttons surround the current page; `showEdges: true` always pins the first and last page and renders single or double ellipsis depending on where the current page sits.
- **Boundary auto-disable** — prev/first are disabled on the first page and next/last on the last page; `disabled: true` disables the entire control and suppresses all interaction.
- **Four visual variants** — `variant` (`pure` / `solid` / `outline` / `soft`), `shape` (`rounded` / `square`), and `size` (xs…2xl) are applied through the `paginationVariants` `scv()` recipe.
- **`actionVariant`** — when enabled, the first/prev/next/last action buttons also take the current `variant` styling, which otherwise paints only the current page.
- **Eight customization slots** — `default` (list), `leading`, `trailing`, `first`, `prev`, `next`, `last`, and `ellipsis`; dynamic slot forwarding keeps every Aria slot reachable from the styled wrapper.
- **Per-region props forwarding** — `listProps`, `listItemProps`, `ellipsisProps`, `firstProps`, `prevProps`, `nextProps`, `lastProps` forward attributes to each region.
- **Full ARIA semantics** — the root is a `nav`; the active page carries `aria-current="page"` and the selected state attribute; every button gets a localized `aria-label`.
- **Localized accessibility text** — action labels and the page label template come from the locale registry (`pageLabel` supports the `{value}` placeholder) across 13 built-in languages.
- **RTL support** — action icons are mirrored automatically via `rtl:[&>svg]:rotate-180`.
- **Aria composition** — `PaginationRoot` / `PaginationList` / `PaginationListItem` / `PaginationEllipsis` / `PaginationFirst` / `PaginationPrev` / `PaginationNext` / `PaginationLast` are exported from `@vean/aria/pagination` for fully custom styled builds.

## Usage

Usage examples for pagination are rendered on the site.

> `SPagination` delegates its page windowing to Aria `PaginationCompact`. For unstyled, data-driven composition, import `PaginationCompact` from `@vean/aria/pagination`.

## Demos

Interactive demos for pagination are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (11): Pagination, PaginationButton, PaginationCompact, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot.

### Pagination

#### Props

Properties for the Pagination component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: The custom ui class names (type `Partial<PaginationUi>`; optional)
- `size`: The size of the pagination (type `ThemeSize`; optional)
- `variant`: The variant of the pagination (type `PaginationVariant`; optional)
- `shape`: The shape of the pagination (type `PaginationShape`; optional)
- `actionVariant`: Whether the first/prev/next/last action buttons also use the `variant` styling, which otherwise only paints the current page (type `boolean`; optional)
- `showFirstOrLast`: Whether to show a first or last. (type `boolean`; optional)
- `listProps`: Properties forwarded to the list element. (type `PaginationListProps`; optional)
- `listItemProps`: Properties forwarded to the list item element. (type `PaginationListItemProps`; optional)
- `ellipsisProps`: Properties forwarded to the ellipsis element. (type `PaginationEllipsisProps`; optional)
- `firstProps`: Properties forwarded to the first element. (type `PaginationButtonProps`; optional)
- `prevProps`: Properties forwarded to the prev element. (type `PaginationButtonProps`; optional)
- `nextProps`: Properties forwarded to the next element. (type `PaginationButtonProps`; optional)
- `lastProps`: Properties forwarded to the last element. (type `PaginationButtonProps`; optional)
- `page`: The controlled value of the current page. Can be bound as `v-model:page`. (type `number`; optional)
- `defaultPage`: The value of the page that should be active when initially rendered. Use when you do not need to control the value state. (type `number`; optional)
- `pageSize`: Number of items per page (type `number`; optional)
- `defaultPageSize`: The default value of `pageSize` when initially rendered. Use when you do not need to control the value state. (type `number`; default `10`; optional)
- `total`: Number of items in your list (type `number`; optional)
- `siblingCount`: Number of sibling should be shown around the current page (type `number`; optional)
- `disabled`: When `true`, prevents the user from interacting with item (type `boolean`; optional)
- `showEdges`: When `true`, always show first page, last page, and ellipsis (type `boolean`; optional)

#### Emits

Events for the Pagination component.

- `update:page`: Event handler called when the page value changes (type `[value: number]`; parameters `value: number`)
- `update:pageSize`: Event handler called when the page size value changes (type `[value: number]`; parameters `value: number`)

#### Slots

Slots for the Pagination component.

- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `first`: Custom content for the first slot. (type `(() => any) | undefined`)
- `prev`: Custom content for the prev slot. (type `(() => any) | undefined`)
- `next`: Custom content for the next slot. (type `(() => any) | undefined`)
- `last`: Custom content for the last slot. (type `(() => any) | undefined`)
- `ellipsis`: Custom content for the ellipsis slot. (type `(() => any) | undefined`)

### PaginationButton

#### Props

Properties for the PaginationButton component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### PaginationCompact

#### Props

Properties for the PaginationCompact component.

- `showFirstOrLast`: Whether to show a first or last. (type `boolean`; optional)
- `listProps`: Properties forwarded to the list element. (type `PaginationListProps`; optional)
- `listItemProps`: Properties forwarded to the list item element. (type `PaginationListItemProps`; optional)
- `ellipsisProps`: Properties forwarded to the ellipsis element. (type `PaginationEllipsisProps`; optional)
- `firstProps`: Properties forwarded to the first element. (type `PaginationButtonProps`; optional)
- `prevProps`: Properties forwarded to the prev element. (type `PaginationButtonProps`; optional)
- `nextProps`: Properties forwarded to the next element. (type `PaginationButtonProps`; optional)
- `lastProps`: Properties forwarded to the last element. (type `PaginationButtonProps`; optional)
- `page`: The controlled value of the current page. Can be bound as `v-model:page`. (type `number`; optional)
- `defaultPage`: The value of the page that should be active when initially rendered. Use when you do not need to control the value state. (type `number`; optional)
- `pageSize`: Number of items per page (type `number`; optional)
- `defaultPageSize`: The default value of `pageSize` when initially rendered. Use when you do not need to control the value state. (type `number`; default `10`; optional)
- `total`: Number of items in your list (type `number`; optional)
- `siblingCount`: Number of sibling should be shown around the current page (type `number`; optional)
- `disabled`: When `true`, prevents the user from interacting with item (type `boolean`; optional)
- `showEdges`: When `true`, always show first page, last page, and ellipsis (type `boolean`; optional)

#### Emits

Events for the PaginationCompact component.

- `update:page`: Event handler called when the page value changes (type `[value: number]`; parameters `value: number`)
- `update:pageSize`: Event handler called when the page size value changes (type `[value: number]`; parameters `value: number`)

#### Slots

Slots for the PaginationCompact component.

- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `first`: Custom content for the first slot. (type `(() => any) | undefined`)
- `prev`: Custom content for the prev slot. (type `(() => any) | undefined`)
- `next`: Custom content for the next slot. (type `(() => any) | undefined`)
- `last`: Custom content for the last slot. (type `(() => any) | undefined`)
- `ellipsis`: Custom content for the ellipsis slot. (type `(() => any) | undefined`)

### PaginationEllipsis

- No documented props, emits, slots, or slot props were available.

### PaginationFirst

- No documented props, emits, slots, or slot props were available.

### PaginationLast

- No documented props, emits, slots, or slot props were available.

### PaginationList

- No documented props, emits, slots, or slot props were available.

### PaginationListItem

#### Props

Properties for the PaginationListItem component.

- `value`: Value for the page (type `number`; required)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### PaginationNext

- No documented props, emits, slots, or slot props were available.

### PaginationPrev

- No documented props, emits, slots, or slot props were available.

### PaginationRoot

#### Props

Properties for the PaginationRoot component.

- `page`: The controlled value of the current page. Can be bound as `v-model:page`. (type `number`; optional)
- `defaultPage`: The value of the page that should be active when initially rendered. Use when you do not need to control the value state. (type `number`; optional)
- `pageSize`: Number of items per page (type `number`; optional)
- `defaultPageSize`: The default value of `pageSize` when initially rendered. Use when you do not need to control the value state. (type `number`; default `10`; optional)
- `total`: Number of items in your list (type `number`; optional)
- `siblingCount`: Number of sibling should be shown around the current page (type `number`; optional)
- `disabled`: When `true`, prevents the user from interacting with item (type `boolean`; optional)
- `showEdges`: When `true`, always show first page, last page, and ellipsis (type `boolean`; optional)

#### Emits

Events for the PaginationRoot component.

- `update:page`: Event handler called when the page value changes (type `[value: number]`; parameters `value: number`)
- `update:pageSize`: Event handler called when the page size value changes (type `[value: number]`; parameters `value: number`)

## Notes

### Architecture and benchmark comparison

| Concern                     | SoybeanUI                                                        | shadcn-vue `Pagination`                  | Ant Design `Pagination`            | Element Plus `Pagination`    |
| :-------------------------- | :--------------------------------------------------------------- | :--------------------------------------- | :--------------------------------- | :--------------------------- |
| Aria / styled separation    | ✅ `@vean/aria/pagination` + `scv()`                             | ❌ single package                        | ❌ single package                  | ❌ single package            |
| Compact data-driven API     | ✅ `PaginationCompact` + 8 typed slots                           | ✅ `Pagination` + `PaginationItem` parts | ✅ config-driven (total, current)  | ✅ layout / components       |
| Controlled / uncontrolled   | ✅ `page`/`defaultPage`, `pageSize`/`defaultPageSize`            | ✅ `v-model`                             | ✅ `current` / `defaultCurrent`    | ✅ `v-model`                 |
| Ellipsis + pinned edges     | ✅ `showEdges` + automatic single/double ellipsis                | ✅ `showEdges` on `PaginationItem`       | ✅ `showLessItems` / auto ellipsis | ✅ `pager-count`             |
| Boundary auto-disable       | ✅ prev/first at page 1, next/last at last page                  | ✅ `disabled` on parts                   | ✅ `prevIcon`/`nextIcon` handling  | ✅ auto                      |
| Disable entire control      | ✅ `disabled`                                                    | ✅                                       | ✅ `disabled`                      | ✅ `disabled`                |
| Selected page styling       | ✅ `data-[selected]` + `actionVariant`                           | ✅ `data-[active]`                       | ✅ `current` item class            | ✅ `active`                  |
| Localized `aria-label`      | ✅ locale registry (13 langs, `{value}` interpolation)           | hard-coded / `aria-label` prop           | partial                            | —                            |
| Variant system              | ✅ `pure`/`solid`/`outline`/`soft` × `rounded`/`square` × xs…2xl | ✅ size only                             | ✅ `size`                          | ✅ `small`/`default`/`large` |
| Per-region props forwarding | ✅ 7 props groups                                                | ✅ `asChild` per part                    | ✅ `itemRender`                    | ✅ per-part props            |
| RTL icon mirroring          | ✅ automatic                                                     | —                                        | ✅                                 | ✅                           |

### Runtime considerations

1. **Window math** — `getRange` shows both ellipsis only when the current page is far enough from both ends (`leftSiblingIndex > firstPageIndex + 2` and `rightSiblingIndex < lastPageIndex - 2`); near either edge it degrades to a single ellipsis, otherwise the full range renders.
2. **`total` pages** — `pageCount` is `Math.max(1, Math.ceil(total / pageSize))`, so an empty list still yields one page; a `page` above `pageCount` renders the last window without crashing.
3. **Controlled state sync** — when bound with `v-model:page`, clicking an item emits `update:page`; the internal window follows the prop, so external page changes (e.g. after a fetch) re-render the correct window automatically.
4. **`showFirstOrLast`** — setting it to `false` removes the first/last buttons but keeps prev/next; page count math is unaffected.
5. **`actionVariant`** — it only lets the action buttons reuse the `variant` recipe; the selected page item always uses the `data-[selected]` styling regardless of this flag.
6. **Locale fallback** — button labels come from `useLocaleMessages`; missing keys fall back to the default English bundle; `pageLabel` supports the `{value}` placeholder via `interpolate`.
7. **A11y output** — the active page renders with `aria-current="page"` and the `data-selected` attribute; disabled actions keep `disabled` so they are skipped by assistive technology and keyboard navigation.

## FAQ

### When do the ellipsis appear?

With `showEdges: true`, the first and last page are always pinned. The current page sits at either edge of the window → one ellipsis; deep in the middle (e.g. page 50 of 100) → two ellipsis with `siblingCount` pages on each side. With `showEdges: false`, only the current window renders and no ellipsis is shown.

### How do I make pagination controlled vs. uncontrolled?

Pass `page` (and optionally `pageSize`) together with an `@update:page` handler, or simply use `v-model:page`. For uncontrolled usage, rely on `defaultPage` / `defaultPageSize` and let the component manage its own state.

### What is `actionVariant` for?

By default the first/prev/next/last action buttons use a neutral action style. When `actionVariant` is `true`, those buttons also take the `variant` styling — the same one the current page uses (e.g. a solid primary look) — which is useful when the active page visually merges with the action buttons.

### Why are prev/first disabled on the first page?

The first/prev buttons disable automatically when `page === 1` and next/last when `page === pageCount`, preventing out-of-range navigation. Set `disabled: true` to disable the whole control.

### Can I fully customize the buttons?

Yes — the `first`, `prev`, `next`, `last`, `ellipsis`, `leading`, and `trailing` slots replace the default content, and `firstProps` / `prevProps` / `nextProps` / `lastProps` forward attributes (including styles) to the respective regions. The default list slot receives scoped `{ page, pageCount }`-aware items through the Aria list.

### How is accessibility handled?

The root is a `nav` landmark; every button carries a localized `aria-label` (the page buttons use the `pageLabel` template, e.g. "Page 5"); the active page is announced with `aria-current="page"`; disabled buttons use the native `disabled` attribute and are skipped by assistive technology.

### Can I build a fully custom pagination?

Yes — compose `PaginationRoot` / `PaginationList` / `PaginationListItem` / `PaginationEllipsis` / `PaginationFirst` / `PaginationPrev` / `PaginationNext` / `PaginationLast` from `@vean/aria/pagination` and inject styles via `providePaginationUi` (or `SPagination`'s `ui` prop).
