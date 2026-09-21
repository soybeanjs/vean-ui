---
head:
  title: Menu
  description: 'The Menu component family lets you build complex nested menus, including dropdowns and context menus. It provides a data-driven approach using SMenuOptions, SMenuCheckboxOptions, and SMenuRadioOptions for easy configuration of groups, submenus, checkboxes, radio items, separators, shortcuts, and link items. The logic layer reuses @vean/aria/menu with full WAI-ARIA menu semantics and roving-focus keyboard navigation.'
---

# Menu

## Overview

The Menu component family lets you build complex nested menus, including dropdowns and context menus. It provides a data-driven approach using `SMenuOptions`, `SMenuCheckboxOptions`, and `SMenuRadioOptions` for easy configuration of groups, submenus, checkboxes, radio items, separators, shortcuts, and link items. The logic layer reuses `@vean/aria/menu` with full WAI-ARIA menu semantics and roving-focus keyboard navigation.

## Features

- **Data-driven compact composition** — `SMenuOptions` / `SMenuCheckboxOptions` / `SMenuRadioOptions` recursively render items from an `items` array; the Aria `MenuOptionsCompact` owns iteration, default assembly, and submenu recursion.
- **Full WAI-ARIA menu semantics** — `role="menu"` / `menuitem` / `menuitemcheckbox` / `menuitemradio`, `aria-checked` (including `'mixed'`), `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-disabled`.
- **Full keyboard navigation** — roving-focus arrow movement (dir-aware), typeahead character search (skips disabled), Home/End/PageUp/PageDown jumps, Enter/Space selection, Esc close + focus return, Tab loop inside the menu, and submenu open/close arrow keys.
- **Floating positioning** — built on `@floating-ui/dom` (`autoUpdate` + `arrow`/`flip`/`hide`/`limitShift`/`offset`/`shift`/`size` middleware) with arrow, placement, sideOffset, and CSS variable forwarding.
- **Three data shapes** — plain `MenuOptionData` (icon/shortcut/separator/link/submenu), checkbox `MenuCheckboxOptionData` (`CheckedState` including `'mixed'`), and radio `MenuRadioOptionData` (`AcceptableBooleanValue`), each with its own group.
- **Grouping & separators** — `isGroupLabel` renders a `MenuGroupLabel` heading, `separator` renders a divider, and `shortcut` renders a keyboard hint.
- **Floating lifecycle** — dismissable layer (outside pointer / Esc close), Presence (exit animation + `forceMount`), body scroll lock, focus scope/trap, and modal mode.
- **Disabled items** — per-item `disabled` with `itemProps.disabled` fallback (explicit value wins), `aria-disabled` + `tabindex="-1"`.
- **Hidden items** — per-item `hidden` drops the option (and its whole subtree) from rendering, the active-path search and keyboard navigation; an item whose children are all hidden renders as a leaf.
- **Aria composition** — `MenuRoot` / `MenuContent` / `MenuItem` / `MenuCheckboxItem` / `MenuRadioItem` / `MenuSub` / `MenuGroup` exported from `@vean/aria/menu`, reused by dropdown-menu, context-menu, and menubar.

## Component family

- **`SMenuOptions`** — data-driven list of plain menu items (with submenus/links/separators/shortcuts).
- **`SMenuOption`** — the recursive item component used internally by `SMenuOptions` (can be used standalone).
- **`SMenuCheckboxOptions`** — a group of checkbox items (`v-model` array / `CheckedState`).
- **`SMenuRadioOptions`** — a group of radio items (`v-model` bound to `AcceptableBooleanValue`).

## Usage

<UsageCode component="menu" />

## Demos

<PlaygroundGallery component="menu" />

## API

<ComponentApi component="menu" />

## Notes

### Architecture and benchmark comparison

| Concern                  | VeanUI                                   | Radix UI Menu   | Ant Design Menu / Dropdown | Element Plus Dropdown |
| :----------------------- | :--------------------------------------- | :-------------- | :------------------------- | :-------------------- |
| Aria / styled split      | ✅ `@vean/aria/menu` + `scv()`           | ✅ Aria         | ❌ single package          | ❌ single package     |
| Data-driven compact API  | ✅ plain/checkbox/radio                  | ❌ composition  | ✅ config-driven (items)   | ✅ config-driven      |
| roving focus + typeahead | ✅ full model (Home/End/PageUp/PageDown) | ✅              | partial                    | partial               |
| Submenu arrow keys       | ✅ ArrowRight/Left (dir-aware)           | ✅              | partial                    | partial               |
| Checkbox / radio items   | ✅ `menuitemcheckbox` / `menuitemradio`  | ✅              | ✅                         | partial               |
| `'mixed'` indeterminate  | ✅ `CheckedState`                        | ✅              | ✅                         | —                     |
| Floating positioning     | ✅ floating-ui (arrow/size/flip/…)       | ✅              | ✅                         | ✅                    |
| Separator / shortcut     | ✅ `separator` / `shortcut`              | component combo | ✅ (divider / command)     | partial               |
| Grouping                 | ✅ `isGroupLabel` + `MenuGroupLabel`     | ✅ `MenuGroup`  | ✅ (type:'group')          | partial               |

`—` = not supported or uses a different interaction model.

### Runtime considerations

1. **`items` data shape** — `MenuOptionData` includes `label`/`value`/`icon`/`shortcut`/`separator`/`isGroupLabel`/`children`; `children` recursively renders submenus. Checkbox/radio shapes each have their own type.
2. **Controlled / uncontrolled** — checkbox and radio groups support `modelValue` / `defaultValue` (`useControllableState`); a radio group's `modelValue` can be `null` (no selection).
3. **Keyboard activation** — roving focus is maintained by `useRovingFocusGroup`; typeahead jumps by character (skipping disabled); `Esc` closes via `useDismissableLayer` and returns focus to the trigger.
4. **Disabled fallback** — per-item `disabled` wins over `itemProps.disabled`; disabled items are `aria-disabled` + `tabindex="-1"` but stay registered so typeahead can skip them.
5. **Floating lifecycle** — dismissable layer + Presence (`forceMount`); body scroll lock and focus scope are enabled when Root's modal mode is on.
6. **Link items** — items with `href`/`to` render as links (reusing the Link primitive); `itemProps` / `linkProps` forward attributes.
7. **`select` event payload** — `select(item, event)` carries the selected item and the native event; the menu close can be controlled via `event.defaultPrevented`.

## FAQ

### How do I create an item with a submenu?

Provide a `children` array on the `MenuOptionData` to render a submenu recursively; submenus support further nesting.

### How do checkbox and radio items bind values?

Checkbox uses `v-model` bound to an array (`CheckedState[]`, supports `'mixed'`); radio uses `v-model` bound to an `AcceptableBooleanValue` (can be `null` for no selection).

### How do I add separators and shortcuts?

Set `separator: true` on an item to render a divider after it; set `shortcut` (`KbdValue` or array) to render a keyboard hint at the item's end.

### How does keyboard navigation work?

Arrow keys move focus (dir-aware); typing letters triggers typeahead; `Home`/`End` jump to first/last; `Enter`/`Space` select; `Esc` closes and returns focus; `Tab` loops inside the menu; submenus open/close via `ArrowRight`/`ArrowLeft`.

### Can I build a fully custom menu?

Yes — compose `MenuRoot` / `MenuContent` / `MenuItem` / `MenuCheckboxItem` / `MenuRadioItem` / `MenuSub` / `MenuGroup` primitives from `@vean/aria/menu` and inject styles via `provideMenuUi` (or `SMenuOptions`'s `ui` prop).
