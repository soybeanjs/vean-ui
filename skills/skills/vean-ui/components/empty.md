# Empty

Source URL: https://veanui.com/components/empty
Markdown URL: https://veanui.com/components/empty.md
Category: Data Display
Description: A lightweight empty-state component that highlights missing content and guides the user toward a next action. SEmpty is a UI-only composition of plain elements plus the SIcon component, styled by the emptyVariants style recipe (6 slots, 6 sizes).

## Overview

A lightweight empty-state component that highlights missing content and guides the user toward a next action. `SEmpty` is a **UI-only** component: it renders plain elements for the root/header/media/title/description/content anatomy plus `SIcon` for the default media, all styled by the `emptyVariants` recipe (6 slots, 6 sizes).

Use it for "no results", empty inboxes, blank tables, or onboarding prompts. Prefer `alert` for inline feedback about state, and `skeleton` when content is still loading rather than absent.

There is no Aria `empty` family: an empty state carries no keyboard, focus, ARIA or state logic that would need to be shared across wrappers, so the whole assembly lives in the UI layer and keeps `data-vean-empty-*` attributes for styling and tests.

## Usage

Usage examples for empty are rendered on the site.

## Features

- 🧩 UI-only anatomy shell — `SEmpty` owns the header/media/title/description orchestration and stays style-driven; there is no Aria `empty` family to compose
- 🖼️ Media / icon — `icon` prop or the `media` slot for an illustration, emoji or custom graphic
- 🏷️ Title + description — `title`/`description` props or the matching slots
- ⚡ Action area — `content`/`default` slots for buttons or follow-up guidance
- 🎨 6 sizes — xs–2xl `size` matching `ThemeSize`
- 🎛️ Per-slot control — `headerProps`/`mediaProps`/`contentProps`/`titleProps`/`descriptionProps` forwarded to each part
- ♿ Accessible by default — title renders as a real heading and `axe-core` reports zero violations

## Component family

`SEmpty` is a single export. It renders the whole anatomy itself and exposes `data-vean-empty-root` / `-header` / `-media` / `-title` / `-description` / `-content` on the matching nodes, so `class`/`ui` and per-part `*Props` reach every part.

## Demos

Interactive demos for empty are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyRoot, EmptyTitle.

### Empty

#### Props

Properties for the Empty component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<EmptyUi>`; optional)
- `size`: Size variant of the component. (type `ThemeSize`; optional)
- `title`: Title text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `icon`: Icon rendered by the component. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)
- `headerProps`: Properties forwarded to the header element. (type `EmptyHeaderProps`; optional)
- `mediaProps`: Properties forwarded to the media element. (type `EmptyMediaProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `EmptyContentProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `EmptyTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `EmptyDescriptionProps`; optional)

#### Slots

Slots for the Empty component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `media`: Custom content for the media slot. (type `(() => any) | undefined`)
- `title`: Custom content for the title slot. (type `(() => any) | undefined`)
- `description`: Custom content for the description slot. (type `(() => any) | undefined`)
- `content`: Custom content for the content slot. (type `(() => any) | undefined`)

### EmptyContent

- No documented props, emits, slots, or slot props were available.

### EmptyDescription

- No documented props, emits, slots, or slot props were available.

### EmptyHeader

- No documented props, emits, slots, or slot props were available.

### EmptyMedia

- No documented props, emits, slots, or slot props were available.

### EmptyRoot

- No documented props, emits, slots, or slot props were available.

### EmptyTitle

- No documented props, emits, slots, or slot props were available.

## Notes

### Architecture and benchmark differences

`SEmpty` owns the header/media/title/description orchestration in the UI layer — the empty state is an anatomy shell with no behavior behind it, so it deliberately has no Aria family. This mirrors shadcn/ui's composition-first approach, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single styled `Empty` with `image`/`description` props. VeanUI exposes a full per-part `*Props` channel set and a `size` scale the single-package libraries generally omit, and renders the default media through `SIcon`.

| Capability            | VeanUI | shadcn/ui | Ant Design Empty | Element Plus Empty | Mantine | Naive UI Empty |
| :-------------------- | :----: | :-------: | :--------------: | :----------------: | :-----: | :------------: |
| Aria/styled split     |   ✅   |    ✅     |        —         |         —          |    —    |       —        |
| Media / icon          |   ✅   |    ✅     |        ✅        |         ✅         |   ✅    |       ✅       |
| Title                 |   ✅   |     —     |        ✅        |         ✅         |   ✅    |       ✅       |
| Description           |   ✅   |     —     |        ✅        |         ✅         |   ✅    |       ✅       |
| Action / content slot |   ✅   |     —     |        ✅        |         ✅         |   ✅    |       ✅       |
| Size variants (6)     |   ✅   |     —     |        —         |         —          |    —    |       —        |
| Per-part `*Props`     |   ✅   |    ✅     |        —         |         —          |    —    |       —        |

`—` = unsupported or a different interaction model.

### Cautions

- The default media renders through `SIcon`, so any Iconify name or component works out of the box. Provide the `media` slot for an illustration or emoji instead.
- The title renders as a heading; keep the empty state at an appropriate heading level for the surrounding document outline.
- The root uses a dashed border by default — override via `class`/`ui` when embedding inside a card or a filled surface.
- `Empty` is purely presentational and holds no state; it does not intercept focus or provide interactive semantics.

### Roadmap

No blocking gaps identified for the core empty API.

## FAQ

### How do I show an icon or illustration?

Pass `icon` (rendered through `SIcon`) or use the `media` slot for arbitrary content:

```vue

```

### How do I add an action button?

Use the `content` (or `default`) slot:

```vue
<SButton color="primary">New project</SButton>
```

### How do I change the size?

Pass `size` (xs–2xl):

```vue

```

### How do I customize the look?

Use `class`/`ui` for styling or the `custom-styling` demo pattern; pass per-part props to adjust header/media/content individually.

### Is it accessible?

The title is a real heading and the component passes `axe-core` with zero violations; any action you place in the slots keeps its own accessible semantics.
