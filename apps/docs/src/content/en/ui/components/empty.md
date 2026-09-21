---
head:
  title: Empty
  description: 'A lightweight empty-state component that highlights missing content and guides the user toward a next action. SEmpty is a UI-only composition of plain elements plus the SIcon component, styled by the emptyVariants style recipe (6 slots, 6 sizes).'
---

# Empty

## Overview

A lightweight empty-state component that highlights missing content and guides the user toward a next action. `SEmpty` is a **UI-only** component: it renders plain elements for the root/header/media/title/description/content anatomy plus `SIcon` for the default media, all styled by the `emptyVariants` recipe (6 slots, 6 sizes).

Use it for "no results", empty inboxes, blank tables, or onboarding prompts. Prefer `alert` for inline feedback about state, and `skeleton` when content is still loading rather than absent.

There is no Aria `empty` family: an empty state carries no keyboard, focus, ARIA or state logic that would need to be shared across wrappers, so the whole assembly lives in the UI layer and keeps `data-vean-empty-*` attributes for styling and tests.

## Usage

<UsageCode component="empty" />

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

<PlaygroundGallery component="empty" />

## API

<ComponentApi component="empty" />

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
<SEmpty title="No messages" description="Inbox is empty" icon="lucide:inbox" />
```

### How do I add an action button?

Use the `content` (or `default`) slot:

```vue
<SEmpty title="No projects" description="Create one to get started.">
  <SButton color="primary">New project</SButton>
</SEmpty>
```

### How do I change the size?

Pass `size` (xs–2xl):

```vue
<SEmpty size="lg" title="Large empty state" />
```

### How do I customize the look?

Use `class`/`ui` for styling or the `custom-styling` demo pattern; pass per-part props to adjust header/media/content individually.

### Is it accessible?

The title is a real heading and the component passes `axe-core` with zero violations; any action you place in the slots keeps its own accessible semantics.
