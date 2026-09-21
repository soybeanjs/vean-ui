---
head:
  title: ContextMenu
  description: 'Displays a menu located at the pointer, triggered by a right-click. SContextMenu is a data-driven menu built on the shared Aria menu primitives, opening at the pointer position via the contextmenu event (or a press-and-hold on touch, after pressOpenDelay). The family also ships checkbox (SContextMenuCheckbox), radio (SContextMenuRadio) and custom (SContextMenuWrapper) variants.'
---

# ContextMenu

## Overview

Displays a menu located at the pointer, triggered by a right-click. `SContextMenu` is a data-driven menu built on the shared Aria menu primitives, opening at the pointer position via the `contextmenu` event (or a press-and-hold on touch, after `pressOpenDelay`). The family also ships checkbox (`SContextMenuCheckbox`), radio (`SContextMenuRadio`) and custom (`SContextMenuWrapper`) variants.

Use a context menu for pointer-relative actions (files, canvas, tree nodes). For a button-triggered menu use `dropdown-menu`; for a rich hover preview use `hover-card`.

## Usage

<UsageCode component="context-menu" />

## Features

- 🖱️ Right-click trigger — opens at the pointer via the `contextmenu` event; `event.preventDefault()` prevents the native menu
- 📱 Press-and-hold — `pressOpenDelay` (default 700ms) opens on long-press for touch/pen
- 🧩 Aria/menu based — built on the shared menu primitives with full keyboard navigation, typeahead and roving focus
- 📊 Data-driven — pass `items` (with `value`/`label`/`icon`/`disabled`/`hidden`/`separator`…) or use the item slots
- 🙈 Hidden items — an item flagged `hidden` (and its whole subtree) is dropped from the menu
- ☑️ Checkbox / 🔘 Radio variants — `SContextMenuCheckbox`/`SContextMenuRadio` for selectable menus
- 🧩 Wrapper variant — `SContextMenuWrapper` for fully custom menu content
- 🎭 Modal — `modal` controls outside-pointer blocking and focus trapping
- ♿ Accessible — `role="menu"`/`menuitem`, `aria-checked` on checkbox/radio, `axe-core` clean

## Component family

- `SContextMenu` (styled) — the data-driven menu; forwards to `ContextMenuCompact`
- `SContextMenuCheckbox` / `SContextMenuRadio` (styled) — selectable menus with `v-model`
- `SContextMenuWrapper` (styled) — custom-content menu
- `ContextMenuCompact` / `ContextMenuWrapperCompact` / `ContextMenuCheckboxCompact` / `ContextMenuRadioCompact` (Aria) — the aggregated composites
- `ContextMenuRoot` / `ContextMenuTrigger` / `ContextMenuContent` (Aria) — the pointer-anchored trigger and menu surface
- `MenuOptions`/`MenuItem`/… (Aria) — the shared menu primitives

## Demos

<PlaygroundGallery component="context-menu" />

## API

<ComponentApi component="context-menu" />

## Notes

### Architecture and benchmark differences

The context-menu family composes the shared `menu` primitives inside a pointer-anchored popover portal; the UI wrappers only inject the shared `menuVariants` classes (via `provideMenuUi`) and forward props/slots. This mirrors radix-ui/shadcn-ui's headless menu split. Ant Design, Element Plus, Mantine and Naive UI ship a single styled context-menu (or reuse their dropdown with `trigger="contextmenu"`); VeanUI additionally exposes checkbox/radio/wrapper variants, a `size` scale, and full keyboard/typeahead behavior through the shared menu layer.

| Capability             | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :--------------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Pointer-positioned     |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |
| Right-click trigger    |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |
| Press-and-hold (touch) |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Checkbox / radio       |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| Keyboard + typeahead   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)              |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- The menu opens at the pointer via `contextmenu`; `pressOpenDelay` governs touch long-press (default 700ms).
- `SContextMenu` is `modal` by default (`true`); pass `modal={false}` for a lightweight menu.
- `items` is data-driven; use the matching item slots (`item`, `item-leading`, `item-trailing`) for custom rendering.
- Checkbox/radio variants bind selection with `v-model`; radio expects a single value, checkbox an array.
- The menu is rendered through a portal at the pointer position; `event.preventDefault()` on right-click suppresses the native browser menu.

### Roadmap

N/A — context-menu is feature-complete for the current parity set.

## FAQ

### How do I build a basic context menu?

Pass `items` and wrap a trigger region:

```vue
<SContextMenu
  :items="[
    { value: 'copy', label: 'Copy' },
    { value: 'paste', label: 'Paste' },
    { type: 'separator' },
    { value: 'delete', label: 'Delete', disabled: true }
  ]"
>
  <div class="target">Right-click here</div>
</SContextMenu>
```

### How do I open on press-and-hold for touch?

Adjust `press-open-delay`:

```vue
<SContextMenu :press-open-delay="500" :items="items">
  <div class="target">Hold to open</div>
</SContextMenu>
```

### How do I use the checkbox/radio variants?

Use `SContextMenuCheckbox`/`SContextMenuRadio` with `v-model`:

```vue
<SContextMenuCheckbox v-model="selected" :items="items">
  <div class="target">Right-click</div>
</SContextMenuCheckbox>
```

### How do I build a custom menu?

Use `SContextMenuWrapper` with `MenuItem`s:

```vue
<SContextMenuWrapper>
  <div class="target">Right-click</div>
  <MenuItem value="a">Item A</MenuItem>
  <MenuItem value="b">Item B</MenuItem>
</SContextMenuWrapper>
```
