# List

Source URL: https://veanui.com/components/list
Markdown URL: https://veanui.com/components/list.md
Category: Data Display
Description: A semantic container for displaying a vertical list of items. SList and SListItem are UI-only components: they render the <ul>/<li> and item/content/title/description anatomy themselves, styled by the listVariants style recipe (5 slots: root/item/content/title/description; 6 sizes).

## Overview

A semantic container for displaying a vertical list of items. `SList` and `SListItem` are **UI-only**: they render the `<ul>`/`<li>` and the item/content/title/description anatomy themselves and share the `listVariants` style recipe (5 slots: root/item/content/title/description; 6 sizes) over a small UI-level context.

Use it for user lists, settings/menu groups, notification feeds, or any simple vertical collection. Prefer `table` for tabular data with columns and sorting, `tree` for hierarchical data, and `select`/`combobox` for selectable option lists.

There is no Aria `list` family: a plain `ul`/`li` carries no keyboard, focus or ARIA-widget logic of its own, so it has no place in the Aria layer. Interactive lists are served by the admitted `listbox` / `tree` families instead.

## Usage

Usage examples for list are rendered on the site.

## Features

- 🧩 UI-only anatomy shell — `SList`/`SListItem` own the markup and share `listVariants` classes through a UI-level `provideListUi` context; no Aria `list` family exists
- 📋 Semantic markup — renders a real `<ul>`/`<li>` with `data-vean-list-*` hooks
- 🏷️ Item composition — `SListItem` renders an optional `title` + `description` block via `title`/`description` props or slots
- ↔️ Leading / trailing — `leading`/`trailing` slots on `SListItem` for icons, badges, avatars or actions
- 🎨 6 sizes — xs–2xl `size` matching `ThemeSize`
- 🎛️ Per-slot control — `contentProps`/`titleProps`/`descriptionProps` forwarded to each item part
- ♿ Accessible by default — semantic list semantics and zero `axe-core` violations

## Component family

- `SList` — the list container; renders the `<ul>` with the `root` slot and provides `listVariants` to its items
- `SListItem` — the item row; renders the `<li>` plus the `item`/`content`/`title`/`description` nodes and exposes `leading`/`trailing`/`title`/`description`/default slots

## Demos

Interactive demos for list are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (6): List, ListContent, ListDescription, ListItem, ListRoot, ListTitle.

### List

#### Props

Properties for the List component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ListUi>`; optional)

### ListContent

- No documented props, emits, slots, or slot props were available.

### ListDescription

- No documented props, emits, slots, or slot props were available.

### ListItem

#### Props

Properties for the ListItem component.

- `class`: Additional class names applied to the item element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `title`: Title text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `contentProps`: Properties forwarded to the content element. (type `ListContentProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `ListTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `ListDescriptionProps`; optional)

#### Slots

Slots for the ListItem component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `title`: Custom content for the title slot. (type `(() => any) | undefined`)
- `description`: Custom content for the description slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)

### ListRoot

- No documented props, emits, slots, or slot props were available.

### ListTitle

- No documented props, emits, slots, or slot props were available.

## Notes

### Architecture and benchmark differences

`SList`/`SListItem` are UI-only: a plain `ul`/`li` anatomy shell failed the Aria deletion test, so the family was removed from the Aria layer and the markup now lives in the UI layer, with all styling in `listVariants` and the slot classes passed down through `provideListUi`. This mirrors shadcn/ui's composition-first approach, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a config-driven list (`dataSource`/`renderItem`). VeanUI deliberately keeps `SList` a presentational container — data iteration stays with the consumer — so very large data is handled by the standalone `virtualizer` component rather than a built-in virtual scroll. Interactive lists use `listbox` / `tree` instead of `SList`.

| Capability                | VeanUI | shadcn/ui | Ant Design List | Element Plus | Mantine List | Naive UI |
| :------------------------ | :----: | :-------: | :-------------: | :----------: | :----------: | :------: |
| Aria/styled split         |   ✅   |    ✅     |        —        |      —       |      —       |    —     |
| Semantic `ul`/`li` markup |   ✅   |    ✅     |       ✅        |      ✅      |      ✅      |    ✅    |
| Title + description item  |   ✅   |     —     |       ✅        |      ✅      |      ✅      |    ✅    |
| Leading / trailing slots  |   ✅   |     —     |       ✅        |      ✅      |      ✅      |    ✅    |
| Size variants (6)         |   ✅   |     —     |       ✅        |      ✅      |      ✅      |    ✅    |
| Built-in virtual scroll   |   ➕   |     —     |       ✅        |      —       |      ✅      |    ✅    |

`—` = unsupported or a different interaction model; `➕` = valuable enhancement (delegated to `virtualizer`).

### Cautions

- `SList` is a presentational container: it does not own data iteration or virtual scrolling. For 1k+ items render the items directly or compose them with the standalone `virtualizer` component.
- Items render as `<li>` inside a `<ul>`. Keep the direct children list items and avoid nesting full interactive blocks that break list semantics.
- Use `SListItem` for a title + description row; for a plain list you can also drop raw `<li>` elements into `SList`.
- The item `title` renders as an `<h3>` and the `description` as a `<p>`; if the list is part of a document outline, pick `size`/`class` or your own markup so the heading level still fits.

### Roadmap

A built-in virtualized list or a `dataSource`/`renderItem` config mode is evaluated as an enhancement, delegated to the standalone `virtualizer` today (see `docs/roadmap.md`).

## FAQ

### How do I build a list with title and description items?

Use `SListItem` with `title`/`description`:

```vue
<SListItem title="Changelog" description="See what's new in v0.29" />
<SListItem title="Guides" description="Step-by-step tutorials" />
```

### How do I add an icon or avatar to an item?

Use the `leading` slot (and `trailing` for actions):

```vue
<template #leading><SAvatar src="/jenny.png" fallback-label="J" /></template>
<template #trailing><SIcon icon="lucide:chevron-right" /></template>
```

### How do I change the list size?

Pass `size` (xs–2xl):

```vue
<SListItem title="Large list" />
```

### How do I render a very large list efficiently?

`SList` is presentational — for 1k+ rows, render items directly or use the standalone `virtualizer` to keep only visible rows in the DOM.

### How do I make an item clickable?

Wrap the clickable surface yourself (a link or `SButton`), since a list item is not interactive by default:

```vue
<SListItem title="Open profile">
    <template #trailing><a href="/profile" class="text-primary">View</a></template>
  </SListItem>
```
