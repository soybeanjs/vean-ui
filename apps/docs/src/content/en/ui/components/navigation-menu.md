---
head:
  title: NavigationMenu (removed)
  description: 'NavigationMenu was removed in v0.50.0 — SNavigationMenu and the whole navigation-menu family no longer ship. NavMenu is the single navigation-menu family; this page keeps the component/type mapping and the behavioral differences for one release cycle.'
---

# NavigationMenu (removed in v0.50.0)

> **⚠️ Removed:** `NavigationMenu` / `SNavigationMenu` and the whole `navigation-menu` family are **gone in v0.50.0**. Nothing is exported any more — use [`NavMenu`](/components/nav-menu) instead.

The family was frozen for one release cycle and then removed inside the v0.50.0 breaking window, together with the date / table / form engine replacements. This page is kept for one release cycle so existing code has a single place to migrate from; it documents only the removal and the mapping to `NavMenu`.

## What was removed

| Surface                                                     | Status                                                |
| :---------------------------------------------------------- | :---------------------------------------------------- |
| `@vean/aria/navigation-menu` sub-path                       | Removed — every `NavigationMenu*` primitive and type  |
| `NavigationMenu*` symbols in the headless root export       | Removed (and from the `Headless.*` namespaced export) |
| `SNavigationMenu` in `@vean/ui`                             | Removed — no styled counterpart is shipped            |
| `provideNavigationMenuUi`                                   | Removed — use `provideNavMenuUi`                      |
| Docs examples, component API data, changelog component page | Removed                                               |
| `ui/navigation-menu` registry item (`vean`)                 | Removed                                               |

## Migrating to NavMenu

[`NavMenu`](/components/nav-menu) models the same domain — site-level navigation with hover/click triggers, keyboard navigation, a positioned viewport, and a data-driven `items` API — but on a single shared Popper surface: one `PopperPositioner` whose reference switches to the active trigger, with hover timing driven by one shared state machine. Root props are largely isomorphic (`modelValue` / `defaultValue`, `orientation`, `dir`, `delayDuration`, `skipDelayDuration`, `disableClickTrigger`, `disableHoverTrigger`, `disablePointerLeaveClose`).

```diff
- import { SNavigationMenu } from '@vean/ui';
+ import { SNavMenu } from '@vean/ui';

- <SNavigationMenu :items="items" />
+ <SNavMenu :items="items" />
```

```diff
- import { NavigationMenuRoot, NavigationMenuItem } from '@vean/aria/navigation-menu';
+ import { NavMenuRoot, NavMenuItem } from '@vean/aria/nav-menu';
```

### Component mapping

| Removed                                                                              | NavMenu                                                   |
| :----------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| `SNavigationMenu` / `NavigationMenuCompact`                                          | `SNavMenu` / `NavMenuCompact`                             |
| `NavigationMenuRoot` / `List` / `Item` / `Trigger` / `Content` / `Link` / `Viewport` | same name with the `NavMenu` prefix                       |
| `NavigationMenuSubList`                                                              | `NavMenuSubTrigger` + `NavMenuSubContent`                 |
| `NavigationMenuIndicator`                                                            | — (the shared `NavMenu` viewport carries a `PopperArrow`) |
| `provideNavigationMenuUi`                                                            | `provideNavMenuUi`                                        |

### Type mapping

Every removed `NavigationMenu*` type has a `NavMenu*` counterpart with the same suffix: `NavigationMenuRootProps` → `NavMenuRootProps`, `NavigationMenuOptionData` → `NavMenuOptionData`, `NavigationMenuUiSlot` → `NavMenuUiSlot`, and so on.

### Behavioral differences

- **Submenu surfaces** — `NavigationMenu` rendered sub-items inside an indicator + viewport pair; `NavMenu` opens a nested flyout next to the item's trigger (`NavMenuSubTrigger` / `NavMenuSubContent`), with `sideOffset` available on both `NavMenuViewport` and `NavMenuSubContent`.
- **Indicator** — `NavMenu` has no separate indicator primitive; the arrow lives on the shared viewport and follows the active trigger.
- **Mount control** — `NavigationMenuRoot` exposed `unmountOnHide`; `NavMenu` instead honors `forceMount` on its content primitives.
- **UI slots** — the slot sets differ (the removed `NavigationMenuUiSlot` declared 19 slots, `NavMenuUiSlot` declares 20 including `subTrigger` / `subContent` / `positioner`); `class`, `size`, and the `ui` prop keep the same meaning.
