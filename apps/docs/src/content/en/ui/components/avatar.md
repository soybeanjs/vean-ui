---
head:
  title: Avatar
  description: 'An image element with a fallback for representing the user. SAvatar combines a AvatarRoot/AvatarImage/AvatarFallback family of Aria primitives (zero styles) with the avatarVariants style recipe (3 slots: root/image/fallback, 6 sizes xs–2xl).'
---

# Avatar

## Overview

An image element with a fallback for representing the user. `SAvatar` combines a `AvatarRoot`/`AvatarImage`/`AvatarFallback` family of Aria primitives (zero styles) with the `avatarVariants` style recipe (3 slots: root/image/fallback, 6 sizes xs–2xl).

Use it for user profiles, team/participant lists, or any spot that needs an identity image that degrades gracefully when the picture is slow, missing, or fails to load. Prefer `image` or `icon` for static or decorative imagery that has no identity fallback; prefer `skeleton` when you want to reserve space before content arrives.

`SAvatar` aggregates the primitives through `AvatarCompact` and exposes a `src`-driven API with `fallback-label` and `delay-ms`. For fully custom compositions, fall back to the Aria `AvatarRoot`/`AvatarImage`/`AvatarFallback` primitives.

## Usage

<UsageCode component="avatar" />

## Features

- 🧩 Aria/styled split — `AvatarCompact` aggregates `AvatarRoot`/`AvatarImage`/`AvatarFallback` and exposes `image`/`fallback` slots; `SAvatar` only injects styles and forwards slots/events
- 🖼️ Graceful loading — the image is shown only once it has actually loaded; while loading or on error the fallback text/slot is rendered instead
- 🎭 Fallback slot — a custom `fallback` slot replaces the text label for initials, icons, or any VNode
- ⏱️ Delay control — `delay-ms` defers the fallback so it only appears for slower connections
- 🎨 6 sizes — xs–2xl sizing with `size` matching the shared `ThemeSize` scale
- ♿ Accessible by default — the loaded image inherits the fallback label as its accessible name, and the default fallback text is rendered as real content; `axe-core` reports zero violations
- 🧩 Fully customizable — per-slot `ui` overrides, root `class` override, and `image`/`fallback` slots replacing the defaults

## Component family

- `SAvatar` (styled) — the entry wrapper; `avatarVariants` recipe with dynamic slot forwarding
- `AvatarRoot` (Aria) — the container; owns the shared image-loading state via `provideAvatarRootContext`
- `AvatarImage` (Aria) — the `<img>`; tracked through `useImageLoadingStatus` and hidden until loaded
- `AvatarFallback` (Aria) — the fallback content; rendered only when the image is not loaded (and after `delay-ms`)
- `AvatarCompact` (Aria) — the aggregated composite; composes root/image/fallback and defaults the image `alt` to `fallback-label`

## Demos

<PlaygroundGallery component="avatar" />

## API

<ComponentApi component="avatar" />

## Notes

### Architecture and benchmark differences

`AvatarCompact` owns the load-state orchestration (which part shows when) while every primitive stays style-free and only the UI wrapper injects the `avatarVariants` classes. This mirrors shadcn/ui's `Avatar`/`AvatarImage`/`AvatarFallback` headless trio and Radix's `Avatar` primitive, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single styled `Avatar` component with an `alt`/`src` prop. VeanUI deliberately routes the fallback text and image `alt` through the aggregate (`fallback-label`), so the loaded image keeps an accessible name without forcing consumers to repeat it.

| Capability                    | VeanUI | shadcn/ui | Ant Design Avatar | Element Plus Avatar | Mantine Avatar | Naive UI Avatar |
| :---------------------------- | :----: | :-------: | :---------------: | :-----------------: | :------------: | :-------------: |
| Aria/styled split             |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| Image + fallback text/slot    |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| Fallback delay (`delay-ms`)   |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| Accessible name auto-derived  |   ✅   |     —     |         —         |          —          |       —        |        —        |
| Composite with per-part props |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| Configurable size (ThemeSize) |   ✅   |   class   |        ✅         |         ✅          |       ✅       |       ✅        |

`—` = unsupported or a different interaction model (AntD/Element Plus/Mantine/Naive UI ship a single styled component; shadcn/ui leaves the image `alt` to the consumer and provides no fallback delay).

### Cautions

- The image is only rendered (and its `alt` exposed) after it loads; before that the fallback is the visible content. Do not rely on the image element existing in the DOM before the load event.
- When the image fails, `loadingStatusChange` emits `'error'` and the fallback stays visible. Listen to this event to drive logging or retries.
- A `fallback-label` is used both as the fallback text and as the loaded image's accessible name. Set `imageProps.alt` to `''` if the avatar is purely decorative and should be skipped by assistive technology.
- `delay-ms` only delays the _fallback_; the image still starts loading immediately, so a fast network still prefers the picture.
- The root is a `<span>` (not a `<button>`/link), so it is not focusable or interactive by default — wrap it in a link/button when it should be clickable.

## FAQ

### How do I show initials when the image has not loaded yet?

Pass `fallback-label` (or the `fallback` slot) — it renders while the image is loading or after a failure:

```vue
<SAvatar src="https://example.com/avatar.png" fallback-label="JD" />
```

### How do I delay the fallback for slow connections?

Use `:delay-ms`; the fallback only appears after the given milliseconds have elapsed without the image loading:

```vue
<SAvatar src="https://example.com/avatar.png" fallback-label="JD" :delay-ms="1000" />
```

### How do I use an icon instead of text as the fallback?

Use the `fallback` slot to render any content:

```vue
<SAvatar src="https://example.com/avatar.png">
  <template #fallback><SIcon icon="lucide:user" /></template>
</SAvatar>
```

### How do I react to a failed image load?

Listen to `@loading-status-change`; it emits `'loading'` / `'loaded'` / `'error'`:

```vue
<SAvatar src="https://example.com/avatar.png" fallback-label="JD" @loading-status-change="onStatus" />
```

### How do I make a purely decorative avatar?

Set `imageProps.alt` to `''` so assistive technology skips it:

```vue
<SAvatar src="https://example.com/logo.png" :image-props="{ alt: '' }" />
```
