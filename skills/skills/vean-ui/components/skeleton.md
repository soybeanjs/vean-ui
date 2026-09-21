# Skeleton

Source URL: https://veanui.com/components/skeleton
Markdown URL: https://veanui.com/components/skeleton.md
Category: Data Display
Description: A placeholder used to indicate that content is still loading. SSkeleton combines the Aria Skeleton primitive (zero styles) with the skeletonVariants style recipe (6 sizes × 2 shapes × animated toggle) and is decorative (aria-hidden by default).

## Overview

A placeholder used to indicate that content is still loading. `SSkeleton` combines the Aria `Skeleton` primitive (zero styles) with the `skeletonVariants` style recipe (6 sizes × 2 shapes × animated toggle) and is decorative (`aria-hidden` by default).

Use it to reserve space and reduce layout shift while data loads — cards, tables, lists, and detail blocks. Prefer `spinner` for an indefinite "please wait" on an action, and `empty` for the final no-data state.

## Usage

Usage examples for skeleton are rendered on the site.

## Features

- 🧩 Aria/styled split — the Aria `Skeleton` primitive owns `aria-hidden`/`as`/`asChild`; `SSkeleton` injects `skeletonVariants`
- 📐 6 size presets — xs–2xl that set both height and width
- 🟦 2 shapes — `auto` (rounded) and `rounded` (pill/circle)
- ⚡ Animated — `animate-pulse` by default; set `animated=false` for a static block
- ♿ Decorative by default — `aria-hidden="true"` unless overridden, so it never confuses assistive tech
- 🔧 Polymorphic — `as`/`asChild` to render as any element
- 🎛️ Custom sizing — override dimensions via `class` for bespoke placeholders

## Component family

- `SSkeleton` (styled) — the entry wrapper; `skeletonVariants` recipe
- `Skeleton` (Aria) — the state-free primitive; `aria-hidden` default + `as`/`asChild`

## Demos

Interactive demos for skeleton are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (1): Skeleton.

### Skeleton

#### Props

Properties for the Skeleton component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `animated`: Whether the skeleton should have an animation effect. Defaults to `true`. (type `boolean`; optional)
- `shape`: Shape of the component. (type `SkeletonShape`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

## Notes

### Architecture and benchmark differences

The Aria `Skeleton` is a state-free primitive that only owns the decorative `aria-hidden` default and polymorphism, while `SSkeleton` keeps all styling in `skeletonVariants`. This mirrors shadcn/ui's headless/styled split, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a single styled skeleton with `paragraph`/`avatar`/`title` composition props. VeanUI stays minimal (one primitive) and expects consumers to compose placeholders with grid/flex — the `size` scale and `rounded` pill shape cover the common cases the single-package libraries expose as presets.

| Capability               | VeanUI | shadcn/ui | Ant Design Skeleton | Element Plus Skeleton | Mantine Skeleton | Naive UI Skeleton |
| :----------------------- | :----: | :-------: | :-----------------: | :-------------------: | :--------------: | :---------------: |
| Aria/styled split        |   ✅   |    ✅     |          —          |           —           |        —         |         —         |
| Animated pulse           |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| Size variants (6)        |   ✅   |     —     |          —          |          ✅           |        ✅        |         —         |
| Shape (rounded / pill)   |   ✅   |     —     |          —          |           —           |        —         |         —         |
| `aria-hidden` by default |   ✅   |     —     |          —          |           —           |        —         |         —         |
| `as`/`asChild`           |   ✅   |    ✅     |          —          |           —           |        —         |         —         |

`—` = unsupported or a different interaction model.

### Cautions

- `SSkeleton` is decorative and `aria-hidden` by default. If the placeholder carries meaning, put a visually-hidden label (or real content once loaded) in an accessible container.
- `animated` defaults to `true` (an `animate-pulse`). Set `animated="false"` for a static block to avoid motion.
- The `size` presets set both width and height; use `class` (e.g. `w-full h-32`) to customize dimensions.
- Compose multiple `SSkeleton` blocks with your own layout (flex/grid) for card/table-shaped placeholders.
- Rendered as a `<div>` by default; use `as`/`asChild` when a different element is required.

### Roadmap

No blocking gaps identified for the core skeleton API. Composed `skeleton` blocks (title/avatar/paragraph) are left to consumer composition rather than shipped as presets.

## FAQ

### How do I render a circular skeleton?

Use `shape="rounded"`:

```vue

```

### How do I disable the animation?

Set `animated="false"`:

```vue

```

### How do I set a custom size?

Override with `class` (the presets only set defaults):

```vue

```

### Is it accessible?

Yes — `SSkeleton` is `aria-hidden` by default so screen readers ignore it. If the loading state is meaningful, wrap it with an `aria-live`/`aria-label` container and replace it with real content when ready.

### How do I build a card-shaped placeholder?

Compose several blocks with your own layout:

```vue
<div class="space-y-3 rounded-md border p-4">
  <SSkeleton class="h-6 w-1/3" />
  <SSkeleton class="h-4 w-full" />
  <SSkeleton class="h-4 w-2/3" />
</div>
```
