---
head:
  title: Button
  description: A button component that can be used to trigger an action.
---

# Button

## Overview

A button component that can be used to trigger an action.

## Usage

<UsageCode component="button" />

## Features

- 🎨 8 variants: solid, outline, dashed, soft, ghost, link, plain, pure
- 🌈 8 colors: primary, destructive, success, warning, info, carbon, secondary, accent
- 📏 6 sizes: xs, sm, md, lg, xl, 2xl
- 🔲 4 shapes: auto, rounded, square, circle
- ⚡ Loading state support
- 🌐 Link function support (SButtonLink)
- ♿ Full accessibility support
- 🎯 TypeScript type safety

## Button component family

- **SButton** - Basic button component
- **SButtonLink** - Link button, supports route navigation
- **SButtonIcon** - Icon button, compact design
- **SButtonLoading** - Loading state button
- **SButtonGroup** - Button group component

## Demos

<PlaygroundGallery component="button" />

## API

<ComponentApi component="button" />

## Notes

### Architecture and benchmark differences

VeanUI splits the button into an Aria layer (`@vean/aria/button`) that owns state, ARIA, and keyboard behavior, and a styled layer (`@vean/ui`) that owns variants and UnoCSS classes. This mirrors `shadcn/ui`'s headless/styled separation and differs from single-package libraries such as Ant Design, Element Plus, MUI, Mantine, and Naive UI.

| Aspect        | VeanUI                                                      | Ant Design / Element Plus / MUI / Mantine / Naive UI |
| :------------ | :---------------------------------------------------------- | :--------------------------------------------------- |
| Architecture  | Aria + styled split                                         | single package                                       |
| Styling       | UnoCSS utility classes via `cv()` recipe                    | CSS-in-JS / SCSS / CSS vars                          |
| Customization | `class` prop, `as` / `asChild` polymorphism, slot overrides | `className`, `style`, component overrides            |
| Loading       | dedicated `SButtonLoading` component                        | `loading` prop on the base button                    |
| Icon button   | dedicated `SButtonIcon` component                           | `icon` prop on the base button                       |

### FAQ

**Why does the disabled button keep `aria-disabled` in addition to the native `disabled`?**
The native `disabled` attribute removes the button from the tab order and blocks platform-level clicks. `aria-disabled="true"` is also set so assistive technology can announce the disabled state when the button is rendered as a non-`<button>` element through the `as` prop (e.g. `as="a"` or `as="div"`), where the native `disabled` attribute does not apply.

**How do I make a full-width button?**
Pass `class="w-full"` (or `fitContent` for the opposite effect). VeanUI does not add a `block` prop because UnoCSS utilities cover this without expanding the API surface.

**How do I show a loading indicator?**
Use `SButtonLoading`. It supports `autoLoading` (toggles loading during the click handler), a controlled `loading` prop, `loadingPosition` (`start` / `center` / `end`), `loadingText`, and a custom `loadingIcon`. The base `SButton` intentionally stays loading-free to keep its API minimal. While loading, the button sets `aria-busy="true"` and the loading icon is `aria-hidden` so the state is announced without redundant decoration.

**How does `SButtonGroup` propagate props to children?**
`SButtonGroup` provides a context that forwards `color`, `size`, `variant`, `shape`, `shadow`, `disabled`, and `fitContent` to descendant `SButton` instances. A child's own prop takes precedence over the group's value.

**Can I render the button as a link or another element?**
Yes. Use the `as` prop to change the root tag (`as="a"`, `as="div"`, …), or `asChild` to merge props onto a custom child. For routing-aware link buttons, prefer `SButtonLink`, which composes `SButton` with the `Link` component.
