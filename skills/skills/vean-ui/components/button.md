# Button

Source URL: https://veanui.com/components/button
Markdown URL: https://veanui.com/components/button.md
Category: General
Description: A button component that can be used to trigger an action.

## Overview

A button component that can be used to trigger an action.

## Usage

Usage examples for button are rendered on the site.

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

Interactive demos for button are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (5): Button, ButtonGroup, ButtonIcon, ButtonLink, ButtonLoading.

### Button

#### Props

Properties for the Button component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ButtonVariant`; optional)
- `shape`: Shape of the component. (type `ButtonShape`; optional)
- `shadow`: Shadow style of the component. (type `ButtonShadow`; optional)
- `fitContent`: Whether the component should fit its content width. (type `boolean`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the Button component.

- `click`: Emitted when click occurs. (type `[event: PointerEvent]`; parameters `event: PointerEvent`)

### ButtonGroup

#### Props

Properties for the ButtonGroup component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ButtonVariant`; optional)
- `shape`: Shape of the component. (type `ButtonShape`; optional)
- `shadow`: Shadow style of the component. (type `ButtonShadow`; optional)
- `fitContent`: Whether the component should fit its content width. (type `boolean`; optional)
- `disabled`: Whether all descendant buttons are disabled. (type `boolean`; optional)
- `orientation`: The orientation of the button group. (type `DataOrientation`; default `'horizontal'`; optional)
- `dir`: The reading direction of the button group. (type `Direction`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ButtonIcon

#### Props

Properties for the ButtonIcon component.

- `icon`: The icon value of iconify. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; required)
- `iconClass`: The class of the icon. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `iconProps`: The props of the icon. (type `Partial<IconProps>`; optional)
- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ButtonVariant`; optional)
- `shape`: Shape of the component. (type `ButtonShape`; optional)
- `shadow`: Shadow style of the component. (type `ButtonShadow`; optional)
- `fitContent`: Whether the component should fit its content width. (type `boolean`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ButtonLink

#### Props

Properties for the ButtonLink component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | 'info' | 'carbon'`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ButtonVariant`; optional)
- `shape`: Shape of the component. (type `ButtonShape`; optional)
- `shadow`: Shadow style of the component. (type `ButtonShadow`; optional)
- `fitContent`: Whether the component should fit its content width. (type `boolean`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. When `true`, the link is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `to`: Route Location the link should navigate to when clicked on. (type `string | import("vue-router").RouteLocationAsRelativeGeneric | import("vue-router").RouteLocationAsPathGeneric`; optional)
- `replace`: Calls `router.replace` instead of `router.push`. (type `boolean`; optional)
- `href`: The URL the link should navigate to when clicked on. (type `string`; optional)
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

### ButtonLoading

#### Props

Properties for the ButtonLoading component.

- `loading`: Whether the button is loading. (type `boolean`; default `false`; optional)
- `loadingText`: The text to display when the button is loading. It will be displayed when the loading position is center. (type `string`; optional)
- `loadingDuration`: The duration of the loading state in milliseconds. (type `number`; default `150 ms`; optional)
- `autoLoading`: Whether to automatically handle loading state during click event. When true, the button will show loading state during click event execution. When false, you need to manually control the loading state. (type `boolean`; default `false`; optional)
- `loadingIcon`: The icon name of iconify to display when the button is loading. (type `string | import("vue").Component | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, { [...`; default `'svg-spinners:270-ring'`; optional)
- `loadingIconProps`: The props of the loading icon. (type `Partial<IconProps>`; optional)
- `loadingPosition`: The position of the loading icon. (type `Align`; default `'start'`; optional)
- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `color`: Theme color of the component. (type `ThemeColor`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `variant`: Visual variant of the component. (type `ButtonVariant`; optional)
- `shape`: Shape of the component. (type `ButtonShape`; optional)
- `shadow`: Shadow style of the component. (type `ButtonShadow`; optional)
- `fitContent`: Whether the component should fit its content width. (type `boolean`; optional)
- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

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
