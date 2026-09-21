---
head:
  title: Toolbar
  description: 'A compact container that groups related actions, links, and toggle controls into a single roving-focus toolbar. SToolbar combines the Aria toolbar primitives (ToolbarRoot/ToolbarButton/ToolbarLink/ToolbarSeparator/ToolbarToggleGroup/ToolbarToggleItem) with the toolbarVariants style recipe (7 slots, 6 sizes × 2 orientations).'
---

# Toolbar

## Overview

A compact container that groups related actions, links, and toggle controls into a single roving-focus toolbar. `SToolbar` combines the Aria toolbar primitives (`ToolbarRoot`/`ToolbarButton`/`ToolbarLink`/`ToolbarSeparator`/`ToolbarToggleGroup`/`ToolbarToggleItem`) with the `toolbarVariants` style recipe (7 slots, 6 sizes × 2 orientations).

Use a toolbar for a dense, keyboard-navigable row of actions. For a single action button use `button`; for grouped buttons use `toggle-group`.

## Usage

<UsageCode component="toolbar" />

## Features

- 🧩 Aria/styled split — `ToolbarRoot` provides the toolbar context; each part (`button`/`link`/`separator`/`toggle-group`) is a thin styled primitive
- ⌨️ Roving focus — arrow-key navigation between toolbar items, Home/End, with optional `loop`; separators/disabled items are skipped
- ↔️ Orientation — `horizontal` (default) or `vertical`; separators auto-flip orientation
- 🔘 Toggle group — `SToolbarToggleGroup`/`SToolbarToggleItem` for single/multi-select toggles with `v-model`
- 🔗 Link support — `SToolbarLink` renders an anchor with a leading icon (`showIcon`)
- 📐 6 sizes — xs–2xl `size`; per-slot `ui` overrides
- ♿ Accessible — `role="toolbar"`, `aria-orientation`, `aria-pressed` on toggles, `axe-core` clean

## Component family

- `SToolbar` (styled) — the root wrapper; `toolbarVariants` recipe (`size` + orientation) with `provideToolbarUi`
- `SToolbarButton` (styled) — a toolbar button (`Button` base)
- `SToolbarLink` (styled) — a toolbar link (`Link` base with optional `showIcon`)
- `SToolbarSeparator` (styled) — an orientation-aware divider (`SeparatorRoot` base)
- `SToolbarToggleGroup` / `SToolbarToggleItem` (styled) — toggle-group controls (`ToggleGroupRoot`/`ToggleGroupItem` base)
- `ToolbarRoot`/`ToolbarButton`/`ToolbarLink`/`ToolbarSeparator`/`ToolbarToggleGroup`/`ToolbarToggleItem` (Aria) — the underlying primitives

## Demos

<PlaygroundGallery component="toolbar" />

## API

<ComponentApi component="toolbar" />

## Notes

### Architecture and benchmark differences

The toolbar family is a multi-slot composition: `ToolbarRoot` provides the roving-focus + orientation context while each part (button/link/separator/toggle-group) reuses the button, link, separator and toggle-group primitives, with the UI wrapper injecting `toolbarVariants` classes per slot. This mirrors radix-ui/shadcn-ui's headless toolbar/toggle-group split. Ant Design, Element Plus, Mantine and Naive UI ship a button/segmented-control but not a dedicated roving-focus toolbar container with orientation-aware separators; VeanUI provides a complete toolbar with `loop`/RTL support and a `size` scale.

| Capability          | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------ | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/styled split   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Roving focus + loop |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| Orientation-aware   |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Toggle group        |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    —     |
| Link support        |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| Sizes (6)           |   ✅   |     —     |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `SToolbar` renders `role="toolbar"` with `aria-orientation` (`horizontal` default / `vertical`); separators auto-flip to match.
- Roving focus uses arrow keys + Home/End; `loop` wraps navigation. Disabled items and separators are skipped.
- `SToolbarToggleGroup` supports single (`model-value` string) and multiple (`model-value` array) selection with `v-model`.
- `dir`/RTL is derived from the `ConfigProvider` locale (e.g. `ar`) or set explicitly on the root.
- `SToolbarLink` renders an anchor; `showIcon` adds a leading icon next to the link text.

### Roadmap

N/A — toolbar is feature-complete for the current parity set.

## FAQ

### How do I build a toolbar?

Compose buttons, links, a separator and a toggle group:

```vue
<SToolbar>
  <SToolbarButton>Cut</SToolbarButton>
  <SToolbarButton>Copy</SToolbarButton>
  <SToolbarSeparator />
  <SToolbarToggleGroup v-model="align">
    <SToolbarToggleItem value="left">Left</SToolbarToggleItem>
    <SToolbarToggleItem value="center">Center</SToolbarToggleItem>
  </SToolbarToggleGroup>
</SToolbar>
```

### How do I make it vertical?

Set `orientation="vertical"`:

```vue
<SToolbar orientation="vertical">
  <SToolbarButton>Up</SToolbarButton>
  <SToolbarButton>Down</SToolbarButton>
</SToolbar>
```

### How do I make navigation loop?

Set `loop`:

```vue
<SToolbar loop>
  <SToolbarButton>A</SToolbarButton>
  <SToolbarButton>B</SToolbarButton>
</SToolbar>
```

### How do I add a link?

Use `SToolbarLink` with `href` and `show-icon`:

```vue
<SToolbar>
  <SToolbarLink href="https://example.com" show-icon>Website</SToolbarLink>
</SToolbar>
```
