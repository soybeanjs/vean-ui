# Alert

Source URL: https://veanui.com/components/alert
Markdown URL: https://veanui.com/components/alert.md
Category: Feedback
Description: A callout that surfaces important, time-sensitive information — warnings, errors, or confirmations — near the content it refers to. SAlert combines an AlertRoot/AlertTitle/AlertDescription/AlertClose family of Aria primitives (zero styles) with the alertVariants style recipe (6 slots, 8 colors × 5 variants × 6 sizes).

## Overview

A callout that surfaces important, time-sensitive information — warnings, errors, or confirmations — near the content it refers to. `SAlert` combines an `AlertRoot`/`AlertTitle`/`AlertDescription`/`AlertClose` family of Aria primitives (zero styles) with the `alertVariants` style recipe (6 slots, 8 colors × 5 variants × 6 sizes).

Use it for inline feedback that must not be missed. Prefer `toast` for transient, global notifications and `dialog` for blocking confirmations. For a banner-style full-width variant, track the roadmap `Banner` item.

## Usage

Usage examples for alert are rendered on the site.

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

Interactive demos for alert are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (7): Alert, AlertClose, AlertCompact, AlertContent, AlertDescription, AlertRoot, AlertTitle.

### Alert

#### Props

Properties for the Alert component.

- `class`: root class (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `variant`: Visual variant of the component. (type `AlertVariant`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<AlertUi>`; optional)
- `title`: Title text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `icon`: Icon rendered by the component. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)
- `closable`: Whether the component can be closed. (type `boolean`; optional)
- `contentProps`: Properties forwarded to the content element. (type `AlertContentProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `AlertTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `AlertDescriptionProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `AlertCloseProps`; optional)
- `open`: The controlled open state of the alert. Can be bound with `v-model:open`. (type `boolean`; default `true`; optional)
- `role`: The ARIA live region role of the alert. `role="alert"` implies an assertive live region (interrupting), while `role="status"` implies a polite one (non-interrupting). (type `'alert' | 'status'`; default `'alert'`; optional)

#### Emits

Events for the Alert component.

- `update:open`: Emitted when the open changes. (type `[open: boolean]`; parameters `open: boolean`)
- `close`: Emitted when the close button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the Alert component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `title`: Custom content for the title slot. (type `(() => any) | undefined`)
- `description`: Custom content for the description slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `close`: Custom content for the close slot. (type `(() => any) | undefined`)

### AlertClose

#### Props

Properties for the AlertClose component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the AlertClose component.

- `close`: Emitted when the close button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### AlertCompact

#### Props

Properties for the AlertCompact component.

- `title`: Title text rendered by the component. (type `string`; optional)
- `description`: Description text rendered by the component. (type `string`; optional)
- `icon`: Icon rendered by the component. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; optional)
- `closable`: Whether the component can be closed. (type `boolean`; optional)
- `contentProps`: Properties forwarded to the content element. (type `AlertContentProps`; optional)
- `titleProps`: Properties forwarded to the title element. (type `AlertTitleProps`; optional)
- `descriptionProps`: Properties forwarded to the description element. (type `AlertDescriptionProps`; optional)
- `closeProps`: Properties forwarded to the close element. (type `AlertCloseProps`; optional)
- `open`: The controlled open state of the alert. Can be bound with `v-model:open`. (type `boolean`; default `true`; optional)
- `role`: The ARIA live region role of the alert. `role="alert"` implies an assertive live region (interrupting), while `role="status"` implies a polite one (non-interrupting). (type `'alert' | 'status'`; default `'alert'`; optional)

#### Emits

Events for the AlertCompact component.

- `update:open`: Emitted when the open changes. (type `[open: boolean]`; parameters `open: boolean`)
- `close`: Emitted when the close button is clicked. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

#### Slots

Slots for the AlertCompact component.

- `default`: Custom content for the default slot. (type `(() => any) | undefined`)
- `leading`: Custom content for the leading slot. (type `(() => any) | undefined`)
- `title`: Custom content for the title slot. (type `(() => any) | undefined`)
- `description`: Custom content for the description slot. (type `(() => any) | undefined`)
- `trailing`: Custom content for the trailing slot. (type `(() => any) | undefined`)
- `close`: Custom content for the close slot. (type `(() => any) | undefined`)

### AlertContent

- No documented props, emits, slots, or slot props were available.

### AlertDescription

- No documented props, emits, slots, or slot props were available.

### AlertRoot

#### Props

Properties for the AlertRoot component.

- `open`: The controlled open state of the alert. Can be bound with `v-model:open`. (type `boolean`; default `true`; optional)
- `role`: The ARIA live region role of the alert. `role="alert"` implies an assertive live region (interrupting), while `role="status"` implies a polite one (non-interrupting). (type `'alert' | 'status'`; default `'alert'`; optional)

#### Emits

Events for the AlertRoot component.

- `update:open`: Emitted when the open changes. (type `[open: boolean]`; parameters `open: boolean`)

### AlertTitle

- No documented props, emits, slots, or slot props were available.

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

```

### How do I make an alert closable?

Set `closable` and bind `open` with `v-model`:

```vue

```

### How do I change the color and variant?

Use `color` (8 values) and `variant` (`solid`/`pure`/`outline`/`soft`/`ghost`):

```vue

```

### How do I add an icon?

Use the `icon` prop (via ConfigProvider `iconRender`) or the `leading` slot:

```vue

```

### How do I customize the close control?

Use the `close` slot and read the close behavior from it (or provide your own `aria-label`):

```vue
<template #close>
  <button type="button" aria-label="Dismiss" @click="open = false">×</button>
</template>
```
