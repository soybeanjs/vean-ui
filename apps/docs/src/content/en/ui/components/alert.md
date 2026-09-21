---
head:
  title: Alert
  description: 'A callout that surfaces important, time-sensitive information — warnings, errors, or confirmations — near the content it refers to. SAlert combines an AlertRoot/AlertTitle/AlertDescription/AlertClose family of Aria primitives (zero styles) with the alertVariants style recipe (6 slots, 8 colors × 5 variants × 6 sizes).'
---

# Alert

## Overview

A callout that surfaces important, time-sensitive information — warnings, errors, or confirmations — near the content it refers to. `SAlert` combines an `AlertRoot`/`AlertTitle`/`AlertDescription`/`AlertClose` family of Aria primitives (zero styles) with the `alertVariants` style recipe (6 slots, 8 colors × 5 variants × 6 sizes).

Use it for inline feedback that must not be missed. Prefer `toast` for transient, global notifications and `dialog` for blocking confirmations. For a banner-style full-width variant, track the roadmap `Banner` item.

## Usage

<UsageCode component="alert" />

## Features

- 🧩 Aria/styled split — `AlertCompact` aggregates the primitives and composes the default icon/title/description/close; `SAlert` only injects styles and forwards slots/events
- 🏷️ Title + description — `title`/`description` props or the matching slots
- ❌ Closable — `closable` renders a close `<button>` (localized `aria-label`) driven by `v-model:open`
- 🎨 8 colors — `ThemeColor` values (`primary`/`destructive`/`success`/`warning`/`info`/`carbon`/`secondary`/`accent`)
- 🖌️ 5 variants — `solid`/`pure`/`outline`/`soft`/`ghost`
- 📐 6 sizes — xs–2xl `size`
- 🖼️ Leading icon — `icon` prop or the `leading` slot
- ♿ Accessible — the close control is a real `<button>` with a localized `aria-label`; `axe-core` reports zero violations

## Component family

- `SAlert` (styled) — the entry wrapper; `alertVariants` recipe with dynamic slot forwarding
- `AlertRoot` (Aria) — the container; owns `open` via `useControllableState` and `provideAlertRootContext`
- `AlertContent` (Aria) — the content area hosting title/description
- `AlertTitle` (Aria) — the title
- `AlertDescription` (Aria) — the description
- `AlertClose` (Aria) — the close `<button>`; localized `aria-label`, emits `close` and toggles `open`
- `AlertCompact` (Aria) — the aggregated composite; composes icon/title/description/close and exposes the slots

## Demos

<PlaygroundGallery component="alert" />

## API

<ComponentApi component="alert" />

## Notes

### Architecture and benchmark differences

`AlertCompact` owns the icon/title/description/close composition while every primitive stays style-free and only the UI wrapper injects the `alertVariants` classes. This mirrors shadcn/ui's headless/styled split, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single styled alert with `type`/`closable`/`showIcon` props. VeanUI exposes the full per-slot `*Props` channels and a `size` scale the single-package libraries generally omit, and localizes the close button's `aria-label` (via `alert.close`) instead of relying on a plain `×` glyph.

| Capability                  | VeanUI | shadcn/ui | Ant Design Alert | Element Plus Alert | Mantine Alert | Naive UI Alert |
| :-------------------------- | :----: | :-------: | :--------------: | :----------------: | :-----------: | :------------: |
| Aria/styled split           |   ✅   |    ✅     |        —         |         —          |       —       |       —        |
| Title + description         |   ✅   |    ✅     |        ✅        |         ✅         |      ✅       |       ✅       |
| Closable                    |   ✅   |     —     |        ✅        |         ✅         |      ✅       |       ✅       |
| Leading icon                |   ✅   |     —     |        ✅        |         ✅         |      ✅       |       ✅       |
| Variants (solid/soft/ghost) |   ✅   |    ✅     |        —         |         —          |       —       |       —        |
| Colors (8)                  |   ✅   |    ✅     |        ✅        |         ✅         |      ✅       |       ✅       |
| Sizes (6)                   |   ✅   |     —     |        —         |         —          |       —       |       —        |
| Localized close label       |   ✅   |     —     |        —         |         ✅         |       —       |       —        |

`—` = unsupported or a different interaction model.

### Cautions

- The close button's `aria-label` is localized from `alert.close` (e.g. `Close alert`). Override it via `aria-label` on `SAlert` or a custom `close` slot.
- `open` defaults to `true`; `closable` shows the close button. Bind `open` with `v-model` to control dismissal.
- `variant="solid"` swaps text to the color's foreground; `soft`/`ghost` tint the background with a translucent color.
- The `icon` leading graphic is decorative; the title/description carry the message content.
- `Alert` is a static callout — it does not set a live/alert `role` or auto-dismiss; use `toast` for transient notifications.

### Roadmap

A full-width `Banner` variant is tracked in `docs/roadmap.md` (P2).

## FAQ

### How do I show a title and description?

Pass `title`/`description` props (or the matching slots):

```vue
<SAlert color="warning" title="Heads up" description="Your session will expire soon." />
```

### How do I make an alert closable?

Set `closable` and bind `open` with `v-model`:

```vue
<SAlert v-model:open="open" closable title="Dismiss me" />
```

### How do I change the color and variant?

Use `color` (8 values) and `variant` (`solid`/`pure`/`outline`/`soft`/`ghost`):

```vue
<SAlert color="success" variant="soft" title="Saved" description="All changes are stored." />
```

### How do I add an icon?

Use the `icon` prop (via ConfigProvider `iconRender`) or the `leading` slot:

```vue
<SAlert icon="lucide:info" title="Information" description="Read the docs." />
```

### How do I customize the close control?

Use the `close` slot and read the close behavior from it (or provide your own `aria-label`):

```vue
<SAlert v-model:open="open" closable title="Custom close">
  <template #close>
    <button type="button" aria-label="Dismiss" @click="open = false">×</button>
  </template>
</SAlert>
```
