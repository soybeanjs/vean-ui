---
head:
  title: AspectRatio
  description: 'SAspectRatio maintains a fixed aspect ratio for its content using the CSS padding-bottom technique. It wraps content in a relatively-positioned container with a dynamic paddingBottom percentage, and an absolutely-positioned inner element that fills the container. Use it to prevent layout shift when loading images, videos, or embeds with known dimensions.'
---

# AspectRatio

## Overview

`SAspectRatio` maintains a fixed aspect ratio for its content using the CSS padding-bottom technique. It wraps content in a relatively-positioned container with a dynamic `paddingBottom` percentage, and an absolutely-positioned inner element that fills the container. Use it to prevent layout shift when loading images, videos, or embeds with known dimensions.

## Usage

<UsageCode component="aspect-ratio" />

## Features

- 📐 **Aspect ratio control** — Pass any numeric `ratio` (e.g., `16/9`, `4/3`, `1`); the component computes the correct padding percentage.
- 🔧 **Polymorphic rendering** — The `as` prop lets you render the inner content element as any HTML tag or component (defaults to `div`).
- 📊 **Slot scope** — The default slot receives `aspect` (the computed padding percentage) for advanced use cases.
- 🎨 **Class forwarding** — `class` and other attrs are forwarded to the inner content element, not the wrapper.
- ♿ **Accessible** — The wrapper is a plain `<div>`; accessibility depends on the slotted content (e.g., `<img alt="...">`).
- 🌐 **SSR-safe** — Pure computed values, no browser APIs.

## Demos

<PlaygroundGallery component="aspect-ratio" />

## API

<ComponentApi component="aspect-ratio" />

## Notes

### Architecture

`SAspectRatio` is an Aria primitive — the UI layer re-exports the Aria component directly. It uses the padding-bottom aspect-ratio technique: a wrapper `<div>` with `position: relative; width: 100%` and `paddingBottom: (1/ratio) * 100%`, and an inner element (via `Primitive`) with `position: absolute; inset: 0` that fills the wrapper. The inner element's `paddingBottom` is reactive — changing `ratio` updates the layout instantly.

The inline positioning styles (`position: relative`, `position: absolute; inset: 0`) are structural — they are essential to the padding-bottom technique and are not decorative. This matches the Radix UI / shadcn-ui AspectRatio implementation.

### Benchmark differences

| Aspect       | VeanUI                    | shadcn/ui `AspectRatio`   | MUI `AspectRatio`         | Ant Design |
| :----------- | :------------------------ | :------------------------ | :------------------------ | :--------- |
| Architecture | Aria + UI re-export       | Aria + styled             | styled only               | —          |
| Technique    | padding-bottom + absolute | padding-bottom + absolute | padding-bottom + absolute | —          |
| Polymorphic  | `as` prop via `Primitive` | —                         | —                         | —          |
| Slot scope   | `aspect` percentage       | —                         | —                         | —          |
| Ratio input  | `number` (e.g., `16/9`)   | `number` (e.g., `16/9`)   | `ratio` (e.g., `16/9`)    | —          |

### FAQ

**How do I use a 16:9 ratio?**
Pass `:ratio="16/9"` (note the `:` for Vue expression binding): `<SAspectRatio :ratio="16/9">...</SAspectRatio>`.

**Can I render the inner element as something other than a div?**
Yes. Use the `as` prop: `<SAspectRatio as="section">...</SAspectRatio>` renders the inner element as a `<section>`.

**Why are there inline styles in the Aria layer?**
The `position: relative` on the wrapper and `position: absolute; inset: 0` on the inner element are structural — they are required for the padding-bottom technique to work. Without them, the aspect ratio cannot be maintained. This is an accepted deviation from the "no styles in Aria" rule, consistent with Radix UI and shadcn/ui.

**What is the `aspect` slot prop?**
The default slot receives `aspect` — the computed padding percentage (e.g., `56.25` for 16:9). You can use it for debugging or custom layout logic: `<SAspectRatio v-slot="{ aspect }">...</SAspectRatio>`.
