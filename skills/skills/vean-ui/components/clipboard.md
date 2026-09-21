# Clipboard

Source URL: https://veanui.com/components/clipboard
Markdown URL: https://veanui.com/components/clipboard.md
Category: General
Description: SClipboard is a clipboard action component built on SButton that copies a plain-text value to the system clipboard with accessible button semantics and copied-state feedback.

## Overview

`SClipboard` is a clipboard action component built on `SButton` that copies a plain-text value to the system clipboard with accessible button semantics and copied-state feedback.

Use it to copy short text values (install commands, invite codes, short links, IDs) or to provide a one-click copy entry next to code blocks, table rows, or cards. It is not for rich text, images, or large formatted content — the component only handles `string`.

Built on `SButton`, it inherits the same `color`/`size`/`variant`/`shape` theme tokens and `as`/`asChild` polymorphism, and is commonly paired with display components like `kbd` or `code` as a side copy entry.

## Usage

Usage examples for clipboard are rendered on the site.

## Features

- 📋 Copies a required text value on click
- 🧩 Ships with built-in icon/text content that can be overridden via `leading`/`default`/`trailing` slots
- 🌐 Defaults `copyText`/`copiedText` to localized `clipboard.copy`/`clipboard.copied` messages from `ConfigProvider`
- ✅ Exposes `ready`, `copied`, and `unsupported` states
- 🎨 Reuses `SButton`'s 8 variants, 8 colors, 6 sizes, and 4 shapes
- 🔌 Inherits `SButton`'s `as`/`asChild` polymorphism and `class` override
- 🛡️ Falls back to `execCommand('copy')` when the async Clipboard API is unavailable (disable with `legacy`)
- ♿ Keeps button semantics, disabled behavior, and `data-state` in the Aria layer
- 🎯 TypeScript-safe with fully typed `ClipboardSlotProps`

## Demos

Interactive demos for clipboard are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): Clipboard.

### Clipboard

#### Props

Properties for the Clipboard component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ClipboardVariant`; optional)
- `shape`: Shape of the component. (type `ClipboardShape`; optional)
- `fitContent`: Whether the component should fit its content width. (type `boolean`; optional)
- `value`: The text value to copy. (type `string`; required)
- `copiedDuration`: The duration in milliseconds to keep the copied state. (type `number`; default `2000`; optional)
- `legacy`: Whether to enable the legacy `execCommand` fallback. (type `boolean`; default `true`; optional)
- `copyIcon`: The icon to display before copying. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'lucide:copy'`; optional)
- `copiedIcon`: The icon to display after copying. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'lucide:check'`; optional)
- `copyText`: The text to display before copying. Defaults to the localized `clipboard.copy` message from `ConfigProvider`. (type `string`; optional)
- `copiedText`: The text to display after copying. Defaults to the localized `clipboard.copied` message from `ConfigProvider`. (type `string`; optional)
- `onlyIcon`: Whether to only render the icon without any text. (type `boolean`; default `false`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Clipboard component.

- `click`: Emitted when click occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)
- `copied`: Emitted when copied occurs. (type `[value: string]`; parameters `value: string`)
- `copyError`: Emitted when copy error occurs. (type `[error: unknown]`; parameters `error: unknown`)

#### Slots

Slots for the Clipboard component.

- `leading`: No description. (type `((props: ClipboardSlotProps) => any) | undefined`)
- `default`: No description. (type `((props: ClipboardSlotProps) => any) | undefined`)
- `trailing`: No description. (type `((props: ClipboardSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the Clipboard component.

- `copied`: Whether copied. (type `boolean`; required)
- `disabled`: Whether the component is disabled. (type `boolean`; required)
- `icon`: Icon rendered by the component. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; required)
- `supported`: Whether supported. (type `boolean`; required)
- `state`: State exposed in the slot scope. (type `'ready' | 'copied' | 'unsupported'`; required)
- `text`: Text exposed in the slot scope. (type `string`; required)
- `copy`: Copy exposed in the slot scope. (type `() => Promise<void>`; required)

## Notes

### Architecture and benchmark differences

VeanUI splits the clipboard into an Aria layer (`@vean/aria/clipboard`) that owns copy state, button semantics, and slot props, and a styled layer (`@vean/ui`) that reuses the button variant recipe. This mirrors the headless/styled split used by `shadcn/ui` copy patterns and differs from single-package libraries such as Ant Design, Element Plus, MUI, Mantine, and Naive UI.

| Aspect        | VeanUI                                                                                 | Ant Design / Element Plus / MUI / Mantine / Naive UI          |
| :------------ | :------------------------------------------------------------------------------------- | :------------------------------------------------------------ |
| Architecture  | Aria + styled split on top of `Button`                                                 | single-package `CopyButton` / `Typography.Paragraph copyable` |
| Styling       | UnoCSS utilities via shared `buttonVariants` recipe                                    | CSS-in-JS / SCSS / CSS vars                                   |
| Customization | `class`, `as` / `asChild`, `leading` / `default` / `trailing` slots                    | `icon`, `text`, `format`, component overrides                 |
| Fallback      | `legacy` prop enables a self-implemented `execCommand('copy')` fallback in `shared.ts` | library-specific fallback behavior                            |
| Feedback      | `data-state`, slot props, `copied` / `copyError` events                                | tooltip, message, or inline text swap                         |

### Cautions

- **Secure context**: The async Clipboard API (`navigator.clipboard.writeText`) is only available in secure contexts (HTTPS or `localhost`). In non-secure contexts the API is unavailable; the component falls back to the `legacy` `execCommand('copy')` (when `legacy=true`, the default) or enters the `unsupported` state (when `legacy=false`).
- **Legacy fallback deprecation**: `document.execCommand('copy')` is deprecated. `legacy` defaults to `true` for maximum compatibility; set `legacy={false}` to rely solely on the async API.
- **SSR / hydration**: `isClipboardWriteSupported()` returns `false` on the server (no `navigator`). With the default `legacy=true`, SSR renders `ready` and hydrates consistently. With `legacy=false`, SSR renders `unsupported` and may hydrate to `ready` on a supporting client — wrap in `<ClientOnly>` if this hydration difference matters.
- **Timer cleanup**: The `copied` state auto-resets after `copiedDuration` (default 2000ms) via `useTimeoutFn`, which is cleaned up on unmount — no manual timer management needed.

## FAQ

**How do I customize the copied-state UI?**
Use the `leading`, default, or `trailing` slots. Each slot receives `ClipboardSlotProps` with `copied`, `disabled`, `icon`, `supported`, `state`, `text`, and a `copy()` helper.

**How do I build an icon-only copy button?**
Clear the default slot and pass an explicit `aria-label` (or `copy-text` plus visible text in another slot). See the `icon-only` playground demo.

**What happens when the Clipboard API is unavailable?**
When neither the async Clipboard API nor the legacy fallback can run, the component exposes `data-state="unsupported"` and disables interaction. Set `legacy={false}` if you want to opt out of the `execCommand('copy')` fallback.

**How do I handle copy failures?**
Listen for the `copyError` event. The component keeps `data-state="ready"` on failure so users can retry without entering a false copied state.

**How do I localize the built-in copy text?**
The default `copyText`/`copiedText` resolve to the `clipboard.copy`/`clipboard.copied` messages of the locale selected by `ConfigProvider` (falling back to `en`). Pass explicit `copy-text`/`copied-text` props, or a `messages` override on `ConfigProvider`, to customize them.

**Can I copy programmatically?**
Yes. Call the `copy()` function from slot props, or trigger the button and listen for the `copied` event.
