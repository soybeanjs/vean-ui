# Tag

Source URL: https://veanui.com/components/tag
Markdown URL: https://veanui.com/components/tag.md
Category: Data Display
Description: A compact label used to categorize, filter, or mark content inline. STag combines the Aria Tag primitive (zero styles) with the tagVariants style recipe (8 colors × 6 sizes × 5 variants × 2 shapes) and exposes leading/trailing/close slots.

## Overview

A compact label used to categorize, filter, or mark content inline. `STag` combines the Aria `Tag` primitive (zero styles) with the `tagVariants` style recipe (8 colors × 6 sizes × 5 variants × 2 shapes) and exposes `leading`/`trailing`/`close` slots.

Use it for status labels, category chips, keywords, or filterable metadata. Prefer `badge` when the label should overlay a host element as a count/notification bubble, and `alert` for larger contextual feedback.

`STag` supports `v-model:open` for controlled visibility and a `closable` close button with a localized accessible label. The Aria `Tag` primitive exposes the `close` action via slot props for fully custom compositions.

## Usage

Usage examples for tag are rendered on the site.

## Features

- 🧩 Aria/styled split — the Aria `Tag` owns the `open`/`close` state; `STag` injects the `tagVariants` classes and the default close control
- 🎨 8 colors — `ThemeColor` values (`primary`/`destructive`/`success`/`warning`/`info`/`carbon`/`secondary`/`accent`)
- 🖌️ 5 variants — `solid`/`pure`/`outline`/`soft`/`ghost`/`raw` covering filled, bordered, and tinted looks
- 📐 6 sizes — xs–2xl from `ThemeSize`
- 🟦 2 shapes — `auto` (rounded) and `rounded` (pill)
- ❌ Closable — `closable` renders a close button driven by `v-model:open`; the close control is a real `<button>` with a localized `aria-label` (keyboard-operable)
- 🌐 RTL-ready — layout uses inline-flex and logical spacing
- ♿ Accessible by default — the close button is focusable, exposes an accessible name, and `axe-core` reports zero violations in the default and closable states

## Component family

- `STag` (styled) — the entry wrapper; `tagVariants` recipe plus `leading`/`trailing`/`close` slots
- `Tag` (Aria) — the state primitive; owns `open` via `useControllableState` and exposes the `close` action through slot props

## Demos

Interactive demos for tag are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): Tag.

### Tag

#### Props

Properties for the Tag component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `TagVariant`; optional)
- `shape`: Shape of the component. (type `TagShape`; optional)
- `content`: Content. (type `string`; optional)
- `closable`: Whether the component can be closed. (type `boolean`; optional)
- `open`: Whether the component is open. Controlled when provided. (type `boolean`; optional)

#### Emits

Events for the Tag component.

- `update:open`: Emitted when the open state changes. (type `[open: boolean]`; parameters `open: boolean`)

## Notes

### Architecture and benchmark differences

The Aria `Tag` is a minimal present/close state primitive, and `STag` keeps all styling in the `tagVariants` recipe while providing the default close control. This mirrors shadcn/ui's headless/styled split, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single styled tag with `closable`/`onClose` props. Vean's close button is a real focusable `<button>` whose `aria-label` is localized from `tag.remove` (e.g. `Remove {label}`), whereas several libraries rely on a plain `×` glyph that is less robust for screen readers.

| Capability                     | VeanUI | shadcn/ui | Ant Design Tag | Element Plus Tag | Mantine Badge | Naive UI Tag |
| :----------------------------- | :----: | :-------: | :------------: | :--------------: | :-----------: | :----------: |
| Aria/styled split              |   ✅   |    ✅     |       —        |        —         |       —       |      —       |
| Color variants (8)             |   ✅   |    ✅     |       ✅       |        ✅        |      ✅       |      ✅      |
| Variants (solid/outline/soft)  |   ✅   |    ✅     |       ✅       |        ✅        |      ✅       |      ✅      |
| Size variants (6)              |   ✅   |     —     |       ✅       |        ✅        |      ✅       |      ✅      |
| Shape (auto / pill)            |   ✅   |    ✅     |       ✅       |        ✅        |      ✅       |      ✅      |
| Closable tag                   |   ✅   |     —     |       ✅       |        ✅        |       —       |      ✅      |
| Localized close `aria-label`   |   ✅   |     —     |       —        |        ✅        |       —       |      —       |
| Controlled visibility (`open`) |   ✅   |     —     |       —        |        —         |       —       |      —       |
| RTL-ready                      |   ✅   |    ✅     |       ✅       |        —         |       —       |      ✅      |

`—` = unsupported or a different interaction model.

### Cautions

- The close button's `aria-label` is derived from the localized `tag.remove` template using the `content` prop. If you pass the label via the `default` slot instead of `content`, the default close `aria-label` falls back to the bare verb — override it through the `close` slot or the `content` prop.
- `open` defaults to `true`. Use `:open="false"` or `v-model:open` to control visibility.
- `variant="pure"`/`outline` intentionally override the color foreground to use `foreground`/`border` tokens; `soft`/`ghost` tint the background with a translucent color.
- The close button inherits the tag's text color and uses transparent background/border; on a `soft` background it stays visible, but verify contrast for your chosen color/background combination.
- The tag root is a `<div>` — if you need the whole tag clickable, wrap it in a link/button yourself.

### Roadmap

No blocking gaps identified for the core tag API. A dedicated standalone `tag-group` and `checkable` tag behavior are evaluated enhancements tracked in `docs/roadmap.md`.

## FAQ

### How do I make a closable tag?

Set `closable` and bind `open` with `v-model`:

```vue

```

### How do I react when the tag is closed?

Listen to `@update:open` — it emits `false` when the close button is activated:

```vue

```

### How do I change the variant, shape and color?

Use `variant` (`solid`/`pure`/`outline`/`soft`/`ghost`/`raw`), `shape` (`auto`/`rounded`) and `color`:

```vue

```

### How do I add an icon before or after the text?

Use the `leading` / `trailing` slots:

```vue
<template #leading><SIcon icon="lucide:circle" /></template>
```

### How do I customize the close button?

Use the `close` slot and read the `close` action from its props:

```vue
<template #close="{ close }">
  <button type="button" aria-label="Dismiss" @click="close">×</button>
</template>
```
