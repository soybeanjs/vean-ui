# Link

Source URL: https://veanui.com/components/link
Markdown URL: https://veanui.com/components/link.md
Category: General
Description: SLink is a polymorphic link component that supports internal routing (via RouterLink) and external links (via <a> tag). It automatically detects external links and sets safe target and rel attributes, supports disabled state and polymorphic rendering (as/asChild).

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

Usage examples for link are rendered on the site.

## Demos

Interactive demos for link are rendered on the site.

## Accessibility

- **Disabled state**: Sets `aria-disabled="true"`, `role="link"`, `tabindex="-1"`, and calls `preventDefault()` to block click navigation. Visually, the `data-disabled` attribute triggers `cursor-not-allowed` and `opacity-50`.
- **External link safety**: Automatically adds `rel="noopener noreferrer"` to prevent newly opened pages from accessing `window.opener`.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (3): Link, LinkBase, LinkExtra.

### Link

#### Props

Properties for the Link component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `to`: Route Location the link should navigate to when clicked on. (type `string | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric`; optional)
- `replace`: Calls `router.replace` instead of `router.push`. (type `boolean`; optional)
- `href`: The URL the link should navigate to when clicked on. (type `string`; optional)
- `disabled`: When `true`, the link is disabled. (type `boolean`; optional)
- `activeClass`: Class to apply when the link is active (type `string`; optional)
- `exactActiveClass`: Class to apply when the link is exact active (type `string`; optional)
- `inactiveClass`: The class to apply to the link when it is inactive. (type `string`; optional)
- `prefetchedClass`: A class to apply to links that have been prefetched. (type `string`; optional)
- `external`: Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases (type `boolean`; optional)
- `ariaCurrentValue`: Value passed to the attribute `aria-current` when the link is exact active. (type `'true' | 'false' | 'page' | 'date' | 'time' | 'step' | 'location'`; default `'page'`; optional)
- `viewTransition`: Pass the returned promise of `router.push()` to `document.startViewTransition()` if supported. (type `boolean`; optional)
- `target`: Where to display the linked URL, as the name for a browsing context. (type `(string & {}) | '_blank' | '_parent' | '_self' | '_top' | null`; optional)
- `rel`: A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links. (type `(string & {}) | 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | null`; default `'noopener noreferrer'`; optional)
- `noRel`: If set to true, no rel attribute will be added to the link (type `boolean`; optional)
- `prefetch`: When enabled will prefetch middleware, layouts and payloads of links in the viewport. (type `boolean`; optional)
- `prefetchOn`: Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility. (type `'visibility' | 'interaction' | Partial<{ visibility: boolean; interaction: boolean; }>`; optional)
- `noPrefetch`: Escape hatch to disable `prefetch` attribute. (type `boolean`; optional)
- `trailingSlash`: An option to either add or remove trailing slashes in the `href` for this specific link. Overrides the global `trailingSlash` option if provided. (type `'append' | 'remove'`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### LinkBase

#### Props

Properties for the LinkBase component.

- `href`: The URL the link should navigate to when clicked on. (type `string`; optional)
- `to`: Route Location the link should navigate to when clicked on. (type `string | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric`; optional)
- `external`: Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases (type `boolean`; optional)
- `target`: Where to display the linked URL, as the name for a browsing context. (type `(string & {}) | '_blank' | '_parent' | '_self' | '_top' | null`; optional)

### LinkExtra

#### Props

Properties for the LinkExtra component.

- `replace`: Calls `router.replace` instead of `router.push`. (type `boolean`; optional)
- `disabled`: When `true`, the link is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `activeClass`: Class to apply when the link is active (type `string`; optional)
- `exactActiveClass`: Class to apply when the link is exact active (type `string`; optional)
- `inactiveClass`: The class to apply to the link when it is inactive. (type `string`; optional)
- `prefetchedClass`: A class to apply to links that have been prefetched. (type `string`; optional)
- `ariaCurrentValue`: Value passed to the attribute `aria-current` when the link is exact active. (type `'true' | 'false' | 'page' | 'date' | 'time' | 'step' | 'location'`; default `'page'`; optional)
- `viewTransition`: Pass the returned promise of `router.push()` to `document.startViewTransition()` if supported. (type `boolean`; optional)
- `rel`: A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links. (type `(string & {}) | 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | null`; default `'noopener noreferrer'`; optional)
- `noRel`: If set to true, no rel attribute will be added to the link (type `boolean`; optional)
- `prefetch`: When enabled will prefetch middleware, layouts and payloads of links in the viewport. (type `boolean`; optional)
- `prefetchOn`: Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility. (type `'visibility' | 'interaction' | Partial<{ visibility: boolean; interaction: boolean; }>`; optional)
- `noPrefetch`: Escape hatch to disable `prefetch` attribute. (type `boolean`; optional)
- `trailingSlash`: An option to either add or remove trailing slashes in the `href` for this specific link. Overrides the global `trailingSlash` option if provided. (type `'append' | 'remove'`; optional)

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
