# Carousel

Source URL: https://veanui.com/components/carousel
Markdown URL: https://veanui.com/components/carousel.md
Category: Data Display
Description: A carousel built on top of Embla Carousel that lets users browse a sequence of content (images, cards, banners, etc.) horizontally or vertically in a constrained space. SCarousel combines a CarouselRoot-family of Aria primitives (zero styles) with the carouselVariants style recipe (8 slots: root/content/container/item/control/navigation/previous/next, 6 sizes × 2 orientations).

## Overview

A carousel built on top of Embla Carousel that lets users browse a sequence of content (images, cards, banners, etc.) horizontally or vertically in a constrained space. `SCarousel` combines a `CarouselRoot`-family of Aria primitives (zero styles) with the `carouselVariants` style recipe (8 slots: root/content/container/item/control/navigation/previous/next, 6 sizes × 2 orientations).

Use it for image galleries, product/article carousels, banner rotators, or any "one viewport at a time, paged back and forth" content. Prefer `list` or `layout` for static grids and masonry; prefer `tree`/`list` with `virtualizer` for drag-sorting or long virtual lists instead of a carousel.

`SCarousel` aggregates the primitives through `CarouselCompact` and exposes a `slides`-driven API. For fully custom compositions, fall back to the Aria `CarouselRoot`/`CarouselContent`/`CarouselContainer`/`CarouselItem`/`CarouselControl`/`CarouselNavigation`/`CarouselPrevious`/`CarouselNext` primitives.

## Usage

Usage examples for carousel are rendered on the site.

## Features

- 🧩 Aria/styled split — `CarouselCompact` aggregates the 8 primitives and exposes 7 `*Props` channels (content/container/item/control/navigation/previous/next); `SCarousel` only injects styles and forwards slots/events
- 🧭 Horizontal / vertical — `orientation` switches the slide axis, the arrow-key navigation axis and the layout direction
- 🌐 Direction-aware — `dir` is forwarded to Embla and swaps the `ArrowLeft`/`ArrowRight` key semantics under RTL
- ⌨️ Keyboard reachable — when the root region is focused, arrow keys page back and forth; `previous`/`next` auto-`disabled` at the boundaries
- ♿ Accessible by default — root `role="region"` + `aria-roledescription="carousel"`, each slide `role="group"` + `aria-roledescription="slide"`; button default content and `aria-label` fallbacks are localized via `useLocaleMessages`
- 🎛️ Controlled / uncontrolled — pass Embla configuration directly through `options` (`loop`, `align`, `dragFree`, …); the root slot exposes `scrollTo`/`scrollNext`/`scrollPrev`/`selectedIndex`/`scrollSnaps`/`progress`
- 🎨 8-slot styling — root/content/container/item/control/navigation/previous/next with 6 sizes (xs–2xl) and a `floatNav` floating-navigation layout
- 🧩 Fully customizable — per-slot `ui` overrides, root `class` override, `slides`-driven data with `item`/`control`/`previous`/`next` slots replacing the defaults

## Component family

- `SCarousel` (styled) — the entry wrapper; `carouselVariants` recipe with dynamic slot forwarding and `useForwardListeners` event merging
- `CarouselRoot` (Aria) — the state owner: initializes/destroys the Embla instance via `useEmblaCarousel`, derives `canScrollNext`/`canScrollPrev`/`selectedIndex`/`scrollSnaps`/`progress`; renders `role="region"`, `data-orientation`, the localized `aria-label` fallback and arrow-key navigation
- `CarouselContent` (Aria) — the viewport; holds the Embla root element reference and generates the `id` shared with the nav buttons
- `CarouselContainer` (Aria) — the sliding track; hosts every `CarouselItem`
- `CarouselItem` (Aria) — a single slide; `role="group"` + `aria-roledescription="slide"`
- `CarouselControl` (Aria) — the controls container; hosts the navigation or custom controls
- `CarouselNavigation` (Aria) — the container for the previous/next buttons
- `CarouselPrevious` / `CarouselNext` (Aria) — `Button`-based prev/next buttons; default icon rendered via `Icon`, default text visually hidden (`VisuallyHidden`) and localized
- `CarouselCompact` (Aria) — the aggregated composite; iterates `slides` into `CarouselItem`, exposing `item`/`control`/`previous`/`next` slots

## Demos

Interactive demos for carousel are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (10): Carousel, CarouselCompact, CarouselContainer, CarouselContent, CarouselControl, CarouselItem, CarouselNavigation, CarouselNext, CarouselPrevious, CarouselRoot.

### Carousel

#### Props

Properties for the Carousel component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CarouselUi>`; optional)
- `size`: The size of the carousel, which determines the spacing and sizing of its elements. (type `ThemeSize`; optional)
- `floatNav`: Whether to use floating navigation, which positions the navigation controls outside of the carousel content and allows them to float over the content. This is useful for carousels with a lot of content or when you want to maximize the space available for the slides. (type `boolean`; optional)
- `slides`: Slides to be rendered in the carousel. (type `T[]`; required)
- `contentProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselContentProps`; optional)
- `containerProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselContainerProps`; optional)
- `itemProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselItemProps`; optional)
- `controlProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselControlProps`; optional)
- `navigationProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselNavigationProps`; optional)
- `previousProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselPreviousProps`; optional)
- `nextProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselNextProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `options`: Options. (type `Partial<import("../../../node_modules/embla-carousel/esm/components/Options").OptionsType>`; optional)
- `plugins`: Plugins. (type `import("embla-carousel").CreatePluginType<import("../../../node_modules/embla-carousel/esm/components/Plugins").Loose...`; optional)

#### Emits

Events for the Carousel component.

- `init`: Emitted when init occurs. (type `[carousel: EmblaCarouselType]`; parameters `carousel: EmblaCarouselType`)

#### Slots

Slots for the Carousel component.

- `item`: Default slot for the carousel component, which can be used to render custom content in the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps & { slide: T; index: number; selected: boolean; }) => any) | undefined`)
- `control`: Control slot for the carousel component, which can be used to render custom controls for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps) => any) | undefined`)
- `previous`: Navigation slot for the carousel component, which can be used to render custom navigation for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps) => any) | undefined`)
- `next`: Next slot for the carousel component, which can be used to render custom next controls for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps) => any) | undefined`)

### CarouselCompact

#### Props

Properties for the CarouselCompact component.

- `slides`: Slides to be rendered in the carousel. (type `T[]`; required)
- `contentProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselContentProps`; optional)
- `containerProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselContainerProps`; optional)
- `itemProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselItemProps`; optional)
- `controlProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselControlProps`; optional)
- `navigationProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselNavigationProps`; optional)
- `previousProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselPreviousProps`; optional)
- `nextProps`: Per-slot properties for the component, allowing you to pass props directly to the sub components without needing to use the `v-slot` API. This is useful for quickly customizing the sub components without needing to use the full flexibility of slots. (type `CarouselNextProps`; optional)
- `dir`: Reading direction of the component. (type `Direction`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `options`: Options. (type `Partial<import("../../../node_modules/embla-carousel/esm/components/Options").OptionsType>`; optional)
- `plugins`: Plugins. (type `import("embla-carousel").CreatePluginType<import("../../../node_modules/embla-carousel/esm/components/Plugins").Loose...`; optional)

#### Emits

Events for the CarouselCompact component.

- `init`: Emitted when init occurs. (type `[carousel: EmblaCarouselType]`; parameters `carousel: EmblaCarouselType`)

#### Slots

Slots for the CarouselCompact component.

- `item`: Default slot for the carousel component, which can be used to render custom content in the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps & { slide: T; index: number; selected: boolean; }) => any) | undefined`)
- `control`: Control slot for the carousel component, which can be used to render custom controls for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps) => any) | undefined`)
- `previous`: Navigation slot for the carousel component, which can be used to render custom navigation for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps) => any) | undefined`)
- `next`: Next slot for the carousel component, which can be used to render custom next controls for the carousel. The slot props include all the necessary information and methods to control the carousel, such as the carousel instance, whether it can scroll next or prev, the selected index, scroll snaps, progress, and methods to scroll next, prev, or to a specific index. (type `((props: CarouselRootSlotProps) => any) | undefined`)

### CarouselContainer

- No documented props, emits, slots, or slot props were available.

### CarouselContent

- No documented props, emits, slots, or slot props were available.

### CarouselControl

- No documented props, emits, slots, or slot props were available.

### CarouselItem

- No documented props, emits, slots, or slot props were available.

### CarouselNavigation

- No documented props, emits, slots, or slot props were available.

### CarouselNext

#### Props

Properties for the CarouselNext component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CarouselPrevious

#### Props

Properties for the CarouselPrevious component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CarouselRoot

#### Props

Properties for the CarouselRoot component.

- `dir`: Reading direction of the component. (type `Direction`; optional)
- `orientation`: Orientation of the component. (type `DataOrientation`; optional)
- `options`: Options. (type `Partial<import("../../../node_modules/embla-carousel/esm/components/Options").OptionsType>`; optional)
- `plugins`: Plugins. (type `import("embla-carousel").CreatePluginType<import("../../../node_modules/embla-carousel/esm/components/Plugins").Loose...`; optional)

#### Emits

Events for the CarouselRoot component.

- `init`: Emitted when init occurs. (type `[carousel: EmblaCarouselType]`; parameters `carousel: EmblaCarouselType`)

#### Slots

Slots for the CarouselRoot component.

- `default`: No description. (type `((props: CarouselRootSlotProps) => any) | undefined`)

#### Slot Props

Slot properties for the CarouselRoot component.

- `carousel`: No description. (type `EmblaCarouselType | undefined`; required)
- `canScrollNext`: No description. (type `boolean`; required)
- `canScrollPrev`: No description. (type `boolean`; required)
- `selectedIndex`: No description. (type `number`; required)
- `scrollSnaps`: No description. (type `number[]`; required)
- `progress`: No description. (type `number`; required)
- `scrollNext`: No description. (type `() => void`; required)
- `scrollPrev`: No description. (type `() => void`; required)
- `scrollTo`: No description. (type `(index: number, jump?: boolean) => void`; required)

## Notes

### Architecture and benchmark differences

`CarouselRoot` owns the full Embla instance lifecycle (init/re-init/destroy, `select`/`reInit` events syncing scroll state) while every primitive stays style-free and only the UI wrapper injects the `carouselVariants` classes. This mirrors shadcn/ui's headless/styled split, unlike Ant Design, Element Plus, Mantine and Naive UI which ship a carousel as a single styled component with configuration props. VeanUI deliberately routes behaviors such as `autoplay`, `loop` and `align` through `options` into Embla's plugin system instead of declaring them as top-level props, keeping the API lean and letting users plug in any Embla plugin. The prev/next buttons default to `disabled` at the boundaries, derived from `canScrollNext`/`canScrollPrev` rather than depending on the `loop` configuration.

| Capability                           | VeanUI  | shadcn/ui | Ant Design Carousel | Element Plus Carousel | Mantine Carousel | Naive UI Carousel |
| :----------------------------------- | :-----: | :-------: | :-----------------: | :-------------------: | :--------------: | :---------------: |
| Aria/styled split                    |   ✅    |    ✅     |          —          |           —           |        —         |         —         |
| Horizontal / vertical orientation    |   ✅    |     —     |         ✅          |          ✅           |        ✅        |        ✅         |
| Direction-aware (RTL)                |   ✅    |    ✅     |         ✅          |           —           |        —         |         —         |
| Arrow-key navigation                 |   ✅    |     —     |         ✅          |          ✅           |        —         |         —         |
| Localized button/region `aria-label` |   ✅    |     —     |          —          |           —           |        —         |         —         |
| `autoplay` / `loop` / alignment      | options |  options  |        props        |         props         |      props       |       props       |
| Composite with per-part props        |   ✅    |    ✅     |          —          |           —           |        —         |         —         |

`—` = unsupported or a different interaction model (AntD/Element Plus/Mantine/Naive UI are single-package config-driven carousels; shadcn/ui's Carousel block is a copy-source headless composition but hardcodes the nav button text and lacks arrow-key navigation).

### Cautions

- `SCarousel` depends on Embla's layout engine; under SSR the first paint cannot measure real sizes, so scroll snapping and `canScrollNext`/`canScrollPrev` are only correct after client mount. Do not rely on the server-rendered initial `selectedIndex`/`progress`.
- `options` and `plugins` are reactive: changing them `reInit`s the Embla instance. Passing a fresh object literal on every render triggers unnecessary rebuilds — keep a stable `ref`/`shallowRef` reference.
- `floatNav: true` (the default) absolutely positions the prev/next buttons to the sides of the content; in a narrow container they may overflow the visible area. Use `float-nav="false"` or override the navigation positioning via `ui`.
- The default prev/next icons are `lucide:arrow-left`/`lucide:arrow-right` rendered through the ConfigProvider `iconRender`; without one, the `Icon` component renders nothing and only the `VisuallyHidden` text carries the accessible name.
- `CarouselItem` keys are derived from item order (`index`), so reordering `slides` does not reuse component instances — keep the order stable when slide content is stateful.

## FAQ

### How do I enable autoplay?

Configure `{ loop: true }` in `options` and pass Embla's `Autoplay` plugin through `plugins`:

```vue

```

### How do I render custom dots?

Use the `control` slot and read `scrollSnaps`/`selectedIndex` from the slot props, jumping with `scrollTo`:

```vue
<template #control="{ scrollSnaps, selectedIndex, scrollTo }">
  <div v-for="(_, index) in scrollSnaps" :key="index" @click="scrollTo(index)" />
</template>
```

### How do I show progress or page numbers?

The `progress` slot prop is a 0–100 scroll percentage (0 on the first screen) you can feed to `SProgress`; page numbers come from `selectedIndex + 1` over `scrollSnaps.length` (see the `06-progress` and `05-snap` demos).

### How do I show multiple slides at once?

Override the `item` slot's `basis` via `ui` (e.g. `basis-1/2 md:basis-1/3`) and tune snapping with `options.align`/`containScroll` (see the `04-multi` demo).

### How do I localize the prev/next buttons and region name?

The button text and region `aria-label` fallback follow the ConfigProvider locale (`carousel.previous` / `carousel.next` / `carousel.ariaLabel`); override per instance with `aria-label` when needed.

### How do I replace the default buttons?

Use the `previous`/`next` or `control` slots to render custom controls — the slot props include `canScrollNext`/`canScrollPrev` and `scrollNext`/`scrollPrev`.
