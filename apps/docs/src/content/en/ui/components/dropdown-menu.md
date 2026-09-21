---
head:
  title: DropdownMenu
  description: 'Displays a menu to the user—such as a set of actions or functions—triggered by a button. SDropdownMenu is a data-driven menu built on the Aria menu primitives (MenuOptions/MenuItem/…), rendered through the shared popover portal. The family also ships checkbox (SDropdownMenuCheckbox, multi-select), radio (SDropdownMenuRadio, single-select) and custom (SDropdownMenuWrapper) variants.'
---

# DropdownMenu

## Overview

Displays a menu to the user—such as a set of actions or functions—triggered by a button. `SDropdownMenu` is a data-driven menu built on the Aria menu primitives (`MenuOptions`/`MenuItem`/…), rendered through the shared popover portal. The family also ships checkbox (`SDropdownMenuCheckbox`, multi-select), radio (`SDropdownMenuRadio`, single-select) and custom (`SDropdownMenuWrapper`) variants.

Use a dropdown for a compact action menu. For navigation menus use `nav-menu`; for a rich hover preview use `hover-card`.

## Usage

<UsageCode component="dropdown-menu" />

## Features

- 🧩 Aria/menu based — built on the shared menu primitives with full keyboard navigation (arrow/Home/End/PageUp/PageDown), typeahead and roving focus
- 🖱️ Trigger modes — `trigger="click"` or `"hover"`; `delayDuration`/`skipDelayDuration` tune hover latency
- 📊 Data-driven — pass `items` (with `value`/`label`/`icon`/`disabled`/`hidden`/`separator`…) or use the item slots
- ☑️ Checkbox variant — `SDropdownMenuCheckbox` for multi-select with `v-model`
- 🔘 Radio variant — `SDropdownMenuRadio` for single-select with `v-model`
- 🧩 Wrapper variant — `SDropdownMenuWrapper` for fully custom menu content
- 🎯 Placement — popper `placement` + `showArrow`
- 🎭 Modal — `modal` controls outside-pointer blocking and focus trapping
- 🪜 Submenus — nested submenu support with side-aware open/close keys (RTL-aware)
- 🙈 Hidden items — an item flagged `hidden` (and its whole subtree) is dropped from the menu
- ♿ Accessible — `role="menu"`/`menuitem`, `aria-checked` on checkbox/radio, `axe-core` clean

## Component family

- `SDropdownMenu` (styled) — the data-driven menu; forwards to `DropdownMenuCompact`
- `SDropdownMenuCheckbox` (styled) — multi-select menu with `v-model`
- `SDropdownMenuRadio` (styled) — single-select menu with `v-model`
- `SDropdownMenuWrapper` (styled) — custom-content menu
- `DropdownMenuCompact` / `DropdownMenuWrapperCompact` / `DropdownMenuCheckboxCompact` / `DropdownMenuRadioCompact` (Aria) — the aggregated composites
- `MenuOptions`/`MenuItem`/… (Aria) — the shared menu primitives (roving focus, keyboard nav, submenus)

## Demos

<PlaygroundGallery component="dropdown-menu" />

## API

<ComponentApi component="dropdown-menu" />

## Notes

### Architecture and benchmark differences

The dropdown-menu family composes the shared `menu` primitives (`MenuOptions`/`MenuItem`) inside a popover portal; the UI wrappers only inject the shared `menuVariants` classes (via `provideMenuUi`) and forward props/slots. This mirrors radix-ui/shadcn-ui's headless menu split. Ant Design, Element Plus, Mantine and Naive UI ship a single styled dropdown with `items`/`onSelect` props; VeanUI additionally exposes dedicated checkbox/radio/wrapper variants, a `size` scale, and full keyboard/typeahead behavior through the shared menu layer.

| Capability           | VeanUI | shadcn/ui | Ant Design Dropdown | Element Plus Dropdown | Mantine Menu | Naive UI Dropdown |
| :------------------- | :----: | :-------: | :-----------------: | :-------------------: | :----------: | :---------------: |
| Aria/styled split    |   ✅   |    ✅     |          —          |           —           |      —       |         —         |
| Data-driven items    |   ✅   |    ✅     |         ✅          |          ✅           |      ✅      |        ✅         |
| Checkbox / radio     |   ✅   |    ✅     |          —          |           —           |      ✅      |         —         |
| Trigger click/hover  |   ✅   |    ✅     |         ✅          |          ✅           |      ✅      |        ✅         |
| Keyboard + typeahead |   ✅   |    ✅     |          —          |           —           |      —       |         —         |
| Submenu              |   ✅   |    ✅     |         ✅          |          ✅           |      ✅      |        ✅         |
| Sizes (6)            |   ✅   |     —     |          —          |           —           |      —       |         —         |

`—` = unsupported or a different interaction model.

### Cautions

- `SDropdownMenu` is `modal` by default (`true`); pass `modal={false}` for a lightweight, non-blocking menu.
- `trigger` accepts `"click"` (default) or `"hover"`; for hover, tune `delayDuration` (open) and `skipDelayDuration` (between triggers).
- `items` is data-driven; use the matching item slots (`item`, `item-leading`, `item-trailing`) for custom rendering.
- Checkbox/radio variants bind selection with `v-model`; radio expects a single value, checkbox an array.
- The menu is rendered through a portal; position it inside a relatively-positioned ancestor only with `portalProps: { disabled: true }`.

### Roadmap

N/A — dropdown-menu is feature-complete for the current parity set.

## FAQ

### How do I build a basic action menu?

Pass `items` and a `trigger` slot:

```vue
<SDropdownMenu
  :items="[
    { value: 'edit', label: 'Edit' },
    { value: 'delete', label: 'Delete', disabled: true }
  ]"
>
  <template #trigger><SButton>Actions</SButton></template>
</SDropdownMenu>
```

### How do I use the checkbox (multi-select) variant?

Use `SDropdownMenuCheckbox` with `v-model`:

```vue
<SDropdownMenuCheckbox v-model="selected" :items="items">
  <template #trigger><SButton>Filters</SButton></template>
</SDropdownMenuCheckbox>
```

### How do I use the radio (single-select) variant?

Use `SDropdownMenuRadio` with `v-model`:

```vue
<SDropdownMenuRadio v-model="sort" :items="sortOptions">
  <template #trigger><SButton>Sort</SButton></template>
</SDropdownMenuRadio>
```

### How do I build a fully custom menu?

Use `SDropdownMenuWrapper` and fill the default slot with `MenuItem`s:

```vue
<SDropdownMenuWrapper>
  <template #trigger><SButton>Open</SButton></template>
  <MenuItem value="a">Item A</MenuItem>
  <MenuItem value="b">Item B</MenuItem>
</SDropdownMenuWrapper>
```

### How do I open on hover?

Set `trigger="hover"` and adjust the delays:

```vue
<SDropdownMenu trigger="hover" :delay-duration="100" :items="items">
  <template #trigger><SButton>Hover</SButton></template>
</SDropdownMenu>
```
