---
head:
  title: Virtualizer
  description: 'A virtual scrolling component that efficiently renders large lists by only rendering items currently in the viewport. SVirtualizer wraps the Aria VirtualizerRoot/VirtualizerContent primitives (built on @tanstack/vue-virtual) — only the visible window of items is mounted into the DOM, keeping large lists fast.'
---

# Virtualizer

## Overview

A virtual scrolling component that efficiently renders large lists by only rendering items currently in the viewport. `SVirtualizer` wraps the Aria `VirtualizerRoot`/`VirtualizerContent` primitives (built on `@tanstack/vue-virtual`) — only the visible window of items is mounted into the DOM, keeping large lists fast.

Use a virtualizer for long lists/tables where rendering all rows would be slow. For a listbox/tree with virtual scrolling, see the higher-level integrations (e.g. `select`, `tree`).

## Usage

<UsageCode component="virtualizer" />

## Features

- ⚡ Virtual scrolling — built on `@tanstack/vue-virtual`; only viewport-visible items render
- 📊 Data-driven — pass `items` (any record shape) and `estimateSize` for row height
- 📏 Scroll container — `height` sets the root scroll viewport (with `overflow: auto`)
- ↔️ Orientation — `options.horizontal` renders a horizontally scrolling row
- 🎚️ TanStack options — pass `options` (`overscan`, `scrollMargin`, `paddingStart/End`, measurement overrides, …)
- 🔁 Dynamic mode — `dynamic` enables variable-height item measurement
- 🧩 Item slot — the `item` slot receives `{ virtualItem, index, item }` for custom rendering
- ♿ Accessible — root is keyboard-scrollable (`tabindex="-1"`) and exposes virtualized content

## Component family

- `SVirtualizer` (styled) — the entry wrapper; iterates `virtualItems` into the `item` slot
- `VirtualizerRoot` (Aria) — the scroll container; owns the `useVirtualizer` instance, computes `virtualItems`/`totalSize`/`contentStyle`
- `VirtualizerContent` (Aria) — the sized inner content that positions virtual items
- `VirtualizerItem` (Aria) — a positioned virtual item (used by advanced custom builds)

## Demos

<PlaygroundGallery component="virtualizer" />

## API

<ComponentApi component="virtualizer" />

## Notes

### Architecture and benchmark differences

`VirtualizerRoot` owns the `@tanstack/vue-virtual` instance and computes `virtualItems`/`totalSize`/`contentStyle`, while `SVirtualizer` only iterates the virtual items into the `item` slot. This delegates the measurement/positioning engine to the industry-standard TanStack Virtual (the same engine used by shadcn-ui/TanStack). Ant Design (`rc-virtual-list`), Element Plus (`el-table-v2`), Mantine (`ListVirtualization`) and Naive UI (`virtual-list`) provide their own virtual engines; VeanUI exposes a thin, engine-agnostic wrapper so any `@tanstack/vue-virtual` option can flow through.

| Capability          | VeanUI | TanStack | Ant Design | Element Plus | Mantine | Naive UI |
| :------------------ | :----: | :------: | :--------: | :----------: | :-----: | :------: |
| Virtual engine      |   ✅   |    ✅    |     ✅     |      ✅      |   ✅    |    ✅    |
| Data-driven items   |   ✅   |    ✅    |     ✅     |      ✅      |   ✅    |    ✅    |
| Horizontal mode     |   ✅   |    ✅    |     ✅     |      ✅      |    —    |    —     |
| Dynamic measurement |   ✅   |    ✅    |     —      |      —       |    —    |    —     |
| Full engine options |   ✅   |    ✅    |     —      |      —       |    —    |    —     |

`—` = unsupported or a different interaction model.

### Cautions

- `height` sets the root scroll viewport; `estimateSize` provides the row size used before measurement.
- `items` can be any record shape; the `item` slot receives `{ virtualItem, index, item }`.
- Pass `options` (from `@tanstack/vue-virtual`) for `overscan`, `horizontal`, `scrollMargin`, measurement overrides, etc.
- `dynamic` enables variable-height item measurement; otherwise rows are measured once and reused.
- This is a low-level primitive — for listbox/tree virtual scrolling use the higher-level components that wrap it.

### Roadmap

N/A — virtualizer is feature-complete for the current parity set.

## FAQ

### How do I render a large list?

Pass `items`, a row `estimate-size` and a `height`, with an `item` slot:

```vue
<SVirtualizer :items="rows" :estimate-size="40" :height="400">
  <template #item="{ item }">{{ item.label }}</template>
</SVirtualizer>
```

### How do I scroll horizontally?

Set `options.horizontal`:

```vue
<SVirtualizer :items="cols" :estimate-size="120" :height="300" :options="{ horizontal: true }" />
```

### How do I tune overscan?

Pass `overscan` in `options`:

```vue
<SVirtualizer :items="rows" :estimate-size="40" :height="400" :options="{ overscan: 10 }" />
```

### How do I support variable-height items?

Set `dynamic`:

```vue
<SVirtualizer :items="rows" dynamic :estimate-size="40" :height="400">
  <template #item="{ item, virtualItem }">{{ item.label }}</template>
</SVirtualizer>
```
