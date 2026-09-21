---
head:
  title: Badge
  description: 'A small status/notification marker that overlays a trigger (button, avatar, nav item) to indicate a count, a state, or new content. SBadge is a UI-only component: a relative root plus an absolutely positioned bubble with controllable visibility, styled by the badgeVariants style recipe (2 slots: root/content; 8 colors × 6 sizes × 4 positions).'
---

# Badge

## Overview

A small status/notification marker that overlays a trigger (button, avatar, nav item) to indicate a count, a state, or new content. `SBadge` is a **UI-only** component: a relatively positioned root plus an absolutely positioned bubble, styled by the `badgeVariants` recipe (2 slots: root/content; 8 colors × 6 sizes × 4 positions).

Use it for unread counts, notification badges, status dots, or any small label anchored to the top-right (or another corner) of a host element. Prefer `tag` for standalone inline category labels, and `alert` for contextual feedback with more content.

`SBadge` exposes a `content`-driven API with `v-model:open` control over the bubble's visibility. There is no Aria `badge` family: the only logic is a controlled `open` flag, which the UI layer owns directly through `useControllableState`.

## Usage

<UsageCode component="badge" />

## Features

- 🧩 UI-only thin shell — `SBadge` owns markup and the controlled `open` state (`useControllableState`); no Aria `badge` family exists
- 🔢 `content` prop / slot — a plain string or arbitrary VNode inside the bubble via the `content` slot
- 🎛️ Controlled visibility — `v-model:open` toggles whether the bubble renders (`useControllableState`, default `true`)
- 🎨 8 colors — `primary`/`destructive`/`success`/`warning`/`info`/`carbon`/`secondary`/`accent` from `ThemeColor`
- 📐 6 sizes — xs–2xl `size` from `ThemeSize`
- 📍 4 positions — `top-right`/`bottom-right`/`top-left`/`bottom-left`
- 🌐 RTL-aware — corner placement uses logical `start`/`end` properties so it mirrors under RTL
- ♿ Real content — the bubble text is rendered as real content and read by assistive technology; `axe-core` reports zero violations

## Component family

`SBadge` is a single export. It renders the `data-vean-badge-root` container and, while `open`, the `data-vean-badge-content` bubble; `class`/`ui` and `contentProps` reach both nodes.

## Demos

<PlaygroundGallery component="badge" />

## API

<ComponentApi component="badge" />

## Notes

### Architecture and benchmark differences

`SBadge` owns the visibility orchestration in the UI layer — a badge is a thin shell whose only logic is a controlled `open` flag, so it deliberately has no Aria family. This mirrors shadcn/ui's composition-first approach (a plain styled label there) and Radix's `Badge` primitive, unlike Ant Design, Element Plus and Naive UI which ship a single styled `Badge` with `count`/`max`/`dot`/`offset` props. VeanUI exposes the bubble through a `content` prop/slot and a controlled `open` state, leaving count formatting (`max`) and dot/offset convenience out of the core — see the enhancement list below.

| Capability                     | VeanUI | shadcn/ui | Ant Design Badge | Element Plus Badge | Mantine Badge | Naive UI Badge |
| :----------------------------- | :----: | :-------: | :--------------: | :----------------: | :-----------: | :------------: |
| Aria/styled split              |   ✅   |    ✅     |        —         |         —          |       —       |       —        |
| Content / notification bubble  |   ✅   |     —     |        ✅        |         ✅         |       —       |       ✅       |
| Position (corner placement)    |   ✅   |     —     |        ✅        |         ✅         |       —       |       ✅       |
| Color variants (8)             |   ✅   |    ✅     |        ✅        |         ✅         |      ✅       |       ✅       |
| Size variants (6)              |   ✅   |     —     |        ✅        |         ✅         |      ✅       |       ✅       |
| RTL-aware placement            |   ✅   |     —     |        —         |         —          |       —       |       —        |
| Controlled visibility (`open`) |   ✅   |     —     |        ✅        |         ✅         |       —       |       ✅       |
| `max` count cap (99+)          |   ➕   |     —     |        ✅        |         ✅         |       —       |       ✅       |
| `dot` mode / `offset`          |   ➕   |     —     |        ✅        |         ✅         |       —       |       ✅       |

`—` = unsupported or a different interaction model; `➕` = valuable enhancement not yet provided (see below).

### Cautions

- The bubble is absolutely positioned against the root, which is `position: relative`. If the host element has `overflow: hidden`, the bubble may be clipped near the edges.
- `open` defaults to `true`. To hide the bubble use `:open="false"` or bind it with `v-model:open`.
- The bubble uses `whitespace-nowrap`; very long content will overflow instead of wrapping — keep counts short or cap them yourself until a `max` prop lands.
- The bubble text is exposed to screen readers. If it duplicates the trigger's label (e.g. a status dot on a labelled button), consider making it decorative via the `content` slot.
- Under RTL the corner placement mirrors (`top-right` stays visually top-right using logical properties); the `transform` offsets are swapped automatically.

### Roadmap

Count formatting (`max`, rendering `99+`), a bare `dot` mode, and `offset` positioning are evaluated enhancements carried in `docs/roadmap.md` — they are not part of the current public API.

## FAQ

### How do I show an unread count on a button?

Wrap the trigger and set `content`:

```vue
<SBadge content="99+">
  <SButton variant="pure">Inbox</SButton>
</SBadge>
```

### How do I control whether the badge is visible?

Use `v-model:open` (or `:open="false"` to hide it):

```vue
<SBadge v-model:open="show" content="3">
  <SButton variant="pure">Messages</SButton>
</SBadge>
```

### How do I place the badge in a different corner?

Use `position` with one of `top-right` / `bottom-right` / `top-left` / `bottom-left`:

```vue
<SBadge position="bottom-left" content="1">
  <SAvatar src="/me.png" fallback-label="JD" />
</SBadge>
```

### How do I change the color and size?

Use `color` (8 `ThemeColor` values) and `size` (xs–2xl):

```vue
<SBadge color="success" size="lg" content="New" />
```

### How do I render a custom badge bubble?

Use the `content` slot to render any VNode instead of plain text:

```vue
<SBadge>
  <SButton variant="pure">Cart</SButton>
  <template #content><SIcon icon="lucide:bell" /></template>
</SBadge>
```
