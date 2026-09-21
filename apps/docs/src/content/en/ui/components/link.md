---
head:
  title: Link
  description: 'SLink is a polymorphic link component that supports internal routing (via RouterLink) and external links (via <a> tag). It automatically detects external links and sets safe target and rel attributes, supports disabled state and polymorphic rendering (as/asChild).'
---

# Link

## Overview

`SLink` is a polymorphic link component that supports internal routing (via `RouterLink`) and external links (via `<a>` tag). It automatically detects external links and sets safe `target` and `rel` attributes, supports disabled state and polymorphic rendering (`as`/`asChild`).

## Features

- 🔗 **Smart Routing**: Automatically distinguishes internal routes (`to`) from external links (`href`), gracefully falls back to `<a>` when RouterLink is unavailable.
- 🧩 **Pluggable Link Component**: Inject a framework-specific component (e.g. Nuxt `NuxtLink`) via `SConfigProvider` `linkComponent`.
- 🛡️ **Safe Defaults**: External links automatically get `target="_blank"` and `rel="noopener noreferrer"` to prevent reverse tabnabbing.
- 🔧 **Polymorphic**: Render as any element or component via `as`/`asChild`.
- ♿ **Accessible Disabled**: Disabled state sets `aria-disabled`, `role="link"`, `tabindex="-1"`, and blocks click events.
- 🎨 **Styling**: Override styles via `class` prop; `linkVariants` provides base utility classes.

## Usage

<UsageCode component="link" />

## Demos

<PlaygroundGallery component="link" />

## Accessibility

- **Disabled state**: Sets `aria-disabled="true"`, `role="link"`, `tabindex="-1"`, and calls `preventDefault()` to block click navigation. Visually, the `data-disabled` attribute triggers `cursor-not-allowed` and `opacity-50`.
- **External link safety**: Automatically adds `rel="noopener noreferrer"` to prevent newly opened pages from accessing `window.opener`.

## API

<ComponentApi component="link" />

## Notes

### Architecture and benchmark differences

VeanUI splits the link into an Aria layer (route detection, disabled handling, `RouterLink` integration) and a styled layer (`linkVariants` styling). This differs from single-package solutions like Nuxt Link, React Router Link, and Next.js Link.

| Aspect          | VeanUI                                                              | Nuxt Link / React Router Link / Next.js Link |
| :-------------- | :------------------------------------------------------------------ | :------------------------------------------- |
| Architecture    | Aria + styled split                                                 | single package                               |
| Route detection | auto-detect `http` prefix, `external` prop, RouterLink availability | explicit `<NuxtLink>` / `<Link>`             |
| External links  | auto `target="_blank"` + `rel="noopener noreferrer"`                | manual setup required                        |
| Disabled state  | `aria-disabled` + `tabindex="-1"` + `preventDefault`                | manual handling required                     |
| Polymorphism    | `as`/`asChild` via `Primitive`                                      | `as` / `passHref`                            |
| Styling         | UnoCSS utility classes + `linkVariants`                             | CSS Modules / styled / none                  |

### FAQ

**When to use `to` vs `href`?**
Use `to` for internal route navigation (requires `RouterLink`) and `href` for external links. When `to` is a string starting with `http`, the component automatically treats it as an external link and renders an `<a>` tag.

**Can I use it without vue-router installed?**
Yes. The component uses `resolveComponent('RouterLink')` to check if RouterLink is available. When unavailable, it automatically falls back to rendering an `<a>` tag.

**Can I plug in a framework-specific link component (Nuxt `NuxtLink`, a locale-prefixing `Link`)?**
Yes. Set `linkComponent` on `SConfigProvider` (same injection mechanism as `iconRender`); `Link` then renders internal links with that component instead of the global `RouterLink`. Framework-specific props that `LinkProps` does not declare (e.g. `locale`) fall through as attrs to the injected component, and you can type them via module augmentation of `LinkProps`. External links still render a native `<a>`.

**How do I disable a link?**
Set `disabled: true`. The component sets `aria-disabled="true"`, `tabindex="-1"`, `role="link"`, and calls `preventDefault()` to block click navigation. The `data-disabled` attribute is added to trigger `cursor-not-allowed` and `opacity-50` visually.

**What's the difference between `as` and `asChild`?**
`as` specifies the root element tag (e.g., `as="button"` renders a `<button>`). `asChild` makes the component not render its own root element, instead forwarding attributes and events to its child (similar to Radix UI's `asChild` pattern).

**What are the default values for `target` and `rel`?**
External links default to `target="_blank"`, `rel="noopener noreferrer"`; internal routes default to `target="_self"`. Both can be overridden via props.
