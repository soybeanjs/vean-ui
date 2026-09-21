---
head:
  title: Segment
  description: 'A linear set of two or more mutually exclusive options presented as a unified control, with a sliding indicator that follows the active option. Use it for compact segmented pickers — time ranges, view toggles, or any small set of single-choice options — where the selection should change immediately. For a set of independent two-state buttons (single or multiple), use SToggleGroup; for plain tabbed content panels, use STabs.'
---

# Segment

## Overview

A linear set of two or more mutually exclusive options presented as a unified control, with a sliding indicator that follows the active option. Use it for compact segmented pickers — time ranges, view toggles, or any small set of single-choice options — where the selection should change immediately. For a set of independent two-state buttons (single or multiple), use `SToggleGroup`; for plain tabbed content panels, use `STabs`.

## Usage

<UsageCode component="segment" />

## Features

- 🎯 Mutually exclusive single selection — one active segment at a time, backed by `useControllableState`
- 🎚 Controlled / uncontrolled — `v-model` and `defaultValue` (with type-safe generic values via `T extends SegmentOptionData`)
- 🧩 Data-driven composition — pass `items` and let Aria `SegmentCompact` own iteration and indicator layout
- ✨ Optional sliding indicator — `enableIndicator` (default `true`), fully customizable through the `indicator` slot
- ⌨️ Roving focus keyboard navigation — arrow keys move between segments, `loop` wraps around, and arrow direction reverses in RTL
- 🎨 6 sizes × 2 orientations × 2 shapes (square/rounded) × 2 fills (auto/full) via `segmentVariants`
- 🧩 `ui` per-slot class overrides (`root` / `list` / `trigger` / `indicator` / `indicatorContent`), plus item-level `disabled`
- ♿ `role="tab"` + `aria-selected` with `data-state` reflection, axe-clean

## Component family

- `SSegment` — the styled wrapper that forwards props to the Aria compact and injects `segmentVariants` classes
- `SegmentRoot` / `SegmentList` / `SegmentTrigger` / `SegmentIndicator` (Aria) — domain primitives wrapping Tabs; DOM uses `data-vean-segment-*`
- `SegmentCompact` (Aria) — data-driven composition of those primitives; import from `@vean/aria/segment` for unstyled usage

## Demos

<PlaygroundGallery component="segment" />

## API

<ComponentApi component="segment" />

## Notes

### Architecture and benchmark differences

`SegmentCompact` composes the Aria `SegmentRoot`/`SegmentList`/`SegmentTrigger`/`SegmentIndicator` primitives (each wrapping the matching Tabs part): it iterates `items`, forwards `listProps`/`triggerProps`/`indicatorProps`, and exposes `item`/`indicator` slots. `SegmentTrigger` keeps the Tabs ARIA pattern (`role="tab"` + roving focus), so `loop` and `dir` (RTL) behave identically to tabs. `SSegment` is a thin wrapper that only computes `segmentVariants` (an alias of `tabsVariants`) and calls `provideSegmentUi`. The indicator is measured asynchronously (resize observer + post-flush watch), so it appears one frame after mount. `segment` maps to the segmented-control pattern; the benchmark libraries express it natively except shadcn, which typically uses Tabs.

| Capability                    | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :---------------------------- | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled split             |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Single (mutually exclusive)   |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Controlled / uncontrolled     |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Data-driven items             |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Sliding indicator             |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Roving focus arrow keys       |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   —    |
| Loop navigation               |   ✅   |     —      |      —       |    —    |    —     |   —    |
| RTL-aware arrow direction     |   ✅   |     —      |      —       |    —    |    —     |   —    |
| Orientation (vertical)        |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| Sizes × shapes × fills        |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| Item-level disabled           |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| Custom item / indicator slots |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### Cautions

- `loop` and `unmountOnHide` default to `true`; `enableIndicator` defaults to `true`. Set `:enable-indicator="false"` to hide the sliding indicator (active state is then reflected through `data-state`).
- The indicator is positioned after an asynchronous layout measurement — it renders one frame after the active segment changes.
- Segments use the Tabs ARIA pattern (`role="tab"` + `aria-selected`), so avoid nesting segments inside another tabs-like control.
- `defaultValue` is only read on mount; subsequent changes are ignored (use `v-model` for external control).
- For icon-only items, add `aria-label` so the segment has an accessible name.
- `unmountOnHide` only matters when content panels are attached; a bare `SSegment` renders no content area.

## FAQ

### What is the difference between `SSegment` and `SToggleGroup`?

`SSegment` is a single mutually exclusive segmented control with a sliding indicator — exactly one option is active. `SToggleGroup` coordinates a set of independent toggle buttons that can be single or multiple selection, with no indicator.

### How do I disable the sliding indicator?

Pass `:enable-indicator="false"`. The selected segment is then highlighted through the `data-selected` style rules instead.

### How do I make arrow keys wrap around?

Keep `loop` (default `true`) — focus wraps from the last segment to the first and vice versa. Disabled segments are skipped automatically.

### How do I control the selected value externally?

Bind `v-model` for two-way control, or pass only `defaultValue` for uncontrolled usage. Use `items` to declare options; each item supports `value`, `label`, and `disabled`.

### Can I style the indicator and items?

Yes — the `indicator` slot replaces the default indicator content, the `item` slot receives `{ ...item, active }` for full customization, and `ui.root` / `ui.list` / `ui.trigger` / `ui.indicator` override classes per slot.
