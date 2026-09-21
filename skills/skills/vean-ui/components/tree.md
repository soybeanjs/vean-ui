# Tree

Source URL: https://veanui.com/components/tree
Markdown URL: https://veanui.com/components/tree.md
Category: Navigation
Description: A component for displaying hierarchical tree data with selection and expand/collapse support. STree combines the Aria TreeRoot family of base primitives (TreeRoot/TreeItem/TreeVirtualizerRoot/TreeVirtualizerItem, zero-style) with the TreeRoot context (controlled/uncontrolled selection and expansion, single/multiple selection, cascading selection, Roving Focus keyboard navigation); STreeVirtualizer layers virtualization on top to smoothly handle 1000+ nodes. Node content is fully customized through the item slot — icons, checkboxes, indentation, and connector lines are all injected by the consumer.

## Overview

A component for displaying hierarchical tree data with selection and expand/collapse support. `STree` combines the Aria `TreeRoot` family of base primitives (`TreeRoot`/`TreeItem`/`TreeVirtualizerRoot`/`TreeVirtualizerItem`, zero-style) with the `TreeRoot` context (controlled/uncontrolled selection and expansion, single/multiple selection, cascading selection, Roving Focus keyboard navigation); `STreeVirtualizer` layers virtualization on top to smoothly handle 1000+ nodes. Node content is fully customized through the `item` slot — icons, checkboxes, indentation, and connector lines are all injected by the consumer.

## Usage

Usage examples for tree are rendered on the site.

## Features

- 🌳 Hierarchical data model — `items: TreeItemData<T>[]` (`value` plus optional recursive `children`); the `TreeItemData<T>` generic preserves custom field types
- 🎛️ Controlled/uncontrolled dual channels — `modelValue` / `defaultValue` control selection, `expanded` / `defaultExpanded` control expansion; both support `v-model` and `update:*` events
- ☑️ Single and multiple selection — `multiple` (linked to the `modelValue` type: single string ↔ array) toggles modes; `selectionBehavior: 'toggle' | 'replace'` controls multi-select clicks; `Shift + Arrow` performs contiguous range selection
- 🧩 Cascading selection — `propagateSelect` (selecting a parent cascades to descendants), `bubbleSelect` (a parent auto-selects when all children are selected), `allowParentSelect` (whether parent nodes can be selected directly)
- 📂 Expansion strategy — `toggleBehavior: 'multiple' | 'single'` (multiple expanded nodes by default; `single` collapses the previous node when expanding a new one, accordion-like)
- ⌨️ Keyboard navigation — Roving Focus: `↑/↓` move focus, `→/←` expand/collapse or enter/return to a parent level, `Enter`/`Space` select, character typeahead for quick location; `loop` (default `true`) wraps around; full RTL support
- ⚡ Virtualization — `STreeVirtualizer` + `height` renders only visible nodes, staying smooth with 1000+ nodes
- ♿ Accessibility — `role="tree"`/`treeitem` with `aria-expanded`/`aria-selected`/`aria-level`/`aria-setsize`/`aria-posinset`/`aria-multiselectable`/`aria-disabled`, plus `data-vean-tree-*` data attributes

## Component family

- `STree` (styled) — entry wrapper; `TreeRootProps<T, U, M>` generic passthrough + `useForwardListeners` event merging + `top`/`item`/`bottom` slots; `withDefaults` mirrors the Aria `loop: true` default
- `STreeVirtualizer` (styled) — virtualized wrapper; forwards `contentProps`/`dynamicContentProps` to `VirtualizerContent`; the `item` slot additionally exposes `virtualItem`
- `TreeRoot` (Aria) — root component; `useControllableState` manages selection/expansion, `useSelectionBehavior` handles single/multi/range selection, `useRovingFocusGroup` + `useTypeahead` implement keyboard navigation; `provideTreeRootContext` bridges child items
- `TreeItem` (Aria) — single node; `useRovingFocusGroupItem` manages focus, renders `aria-*` and `data-*` attributes, dispatches `select`/`toggle` events via `handleAndDispatchCustomEvent`
- `TreeVirtualizerRoot` (Aria) — virtualized root; `VirtualizerRoot` + TanStack Virtual, forwards flattened `flattenItems`
- `TreeVirtualizerItem` (Aria) — virtualized node; combines `TreeItem` + `VirtualizerItem` (`data-vean-tree-virtualizer-item`)

## Demos

Interactive demos for tree are rendered on the site.

- 01 Basic — a basic directory tree (`items` + `default-expanded` + `top` slot)
- 02 Virtualizer — `STreeVirtualizer` rendering 1000+ nodes with virtualization

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (6): Tree, TreeItem, TreeRoot, TreeVirtualizer, TreeVirtualizerItem, TreeVirtualizerRoot.

### Tree

#### Slots

Slots for the Tree component.

- `top`: Content rendered before the tree items. (type `(() => any) | undefined`)
- `bottom`: Content rendered after the tree items. (type `(() => any) | undefined`)
- `item`: Content for a single tree item. (type `((props: { item: FlattenedItem<T>; modelValue: MaybeArray<string> | undefined; expanded: string[]; }) => any) | undef...`)

### TreeItem

#### Props

Properties for the TreeItem component.

- `value`: Value associated with the current item. (type `string`; required)
- `level`: Level. (type `number`; required)
- `disabled`: When `true`, prevents the user from selecting or toggling the item. (type `boolean`; optional)
- `disabledSelect`: When `true`, prevents the user from selecting the item. (type `boolean`; optional)
- `disabledToggle`: When `true`, prevents the user from toggling the item. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the TreeItem component.

- `select`: Event handler called when selecting item. (type `[event: TreeSelectEvent<string>]`; parameters `event: TreeSelectEvent<string>`)
- `toggle`: Event handler called when toggling item. (type `[event: TreeToggleEvent<string>]`; parameters `event: TreeToggleEvent<string>`)

### TreeRoot

#### Props

Properties for the TreeRoot component.

- `modelValue`: The controlled value of the tree. Can be bound-with with `v-model`. (type `U`; optional)
- `defaultValue`: The value of the tree when initially rendered. Use when you do not need to control the state of the tree (type `U`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. (type `IsMultiple<U, M>`; optional)
- `items`: List of items (type `T[]`; optional)
- `expanded`: The controlled value of the expanded item. Can be bound-with with `v-model`. (type `string[]`; optional)
- `defaultExpanded`: The value of the expanded tree when initially rendered. (type `string[]`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `TreeSelectBehavior`; optional)
- `toggleBehavior`: Determines whether a "single" or "multiple" items can be toggled at a time. (type `TreeToggleBehavior`; default `'multiple'`; optional)
- `dir`: The reading direction. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with tree (type `boolean`; optional)
- `propagateSelect`: When `true`, selecting parent will select the descendants. (type `boolean`; optional)
- `bubbleSelect`: When `true`, selecting children will update the parent state. (type `boolean`; optional)
- `allowParentSelect`: When `true`, parent can be selected. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the TreeRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `update:expanded`: Emitted when the expanded state changes. (type `[value: string[]]`; parameters `value: string[]`)

### TreeVirtualizer

#### Props

Properties for the TreeVirtualizer component.

- `contentProps`: Properties forwarded to the content element. (type `VirtualizerContentProps`; optional)
- `dynamicContentProps`: Properties forwarded to the dynamic content element. (type `VirtualizerDynamicContentProps`; optional)
- `animated`: When `true`, renders visible items in normal document flow (dynamic mode) so item positions stay correct across expand/collapse without absolute offsets. (type `boolean`; default `false`; optional)
- `modelValue`: The controlled value of the tree. Can be bound-with with `v-model`. (type `U`; optional)
- `defaultValue`: The value of the tree when initially rendered. Use when you do not need to control the state of the tree (type `U`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. (type `IsMultiple<U, M>`; optional)
- `items`: List of items (type `T[]`; optional)
- `expanded`: The controlled value of the expanded item. Can be bound-with with `v-model`. (type `string[]`; optional)
- `defaultExpanded`: The value of the expanded tree when initially rendered. (type `string[]`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `TreeSelectBehavior`; optional)
- `toggleBehavior`: Determines whether a "single" or "multiple" items can be toggled at a time. (type `TreeToggleBehavior`; default `'multiple'`; optional)
- `dir`: The reading direction. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with tree (type `boolean`; optional)
- `propagateSelect`: When `true`, selecting parent will select the descendants. (type `boolean`; optional)
- `bubbleSelect`: When `true`, selecting children will update the parent state. (type `boolean`; optional)
- `allowParentSelect`: When `true`, parent can be selected. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `height`: The height of the virtualizer root (type `string | number`; required)
- `options`: Options. (type `VirtualizerOptions`; optional)
- `dynamic`: Whether dynamic. (type `boolean`; optional)

#### Emits

Events for the TreeVirtualizer component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `update:expanded`: Emitted when the expanded state changes. (type `[value: string[]]`; parameters `value: string[]`)

### TreeVirtualizerItem

#### Props

Properties for the TreeVirtualizerItem component.

- `value`: Value associated with the current item. (type `string`; required)
- `level`: Level. (type `number`; required)
- `disabled`: When `true`, prevents the user from selecting or toggling the item. (type `boolean`; optional)
- `disabledSelect`: When `true`, prevents the user from selecting the item. (type `boolean`; optional)
- `disabledToggle`: When `true`, prevents the user from toggling the item. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `data`: Data. (type `VirtualItem`; required)
- `customStyle`: Whether custom style. (type `boolean`; optional)

#### Emits

Events for the TreeVirtualizerItem component.

- `select`: Event handler called when selecting item. (type `[event: TreeSelectEvent<string>]`; parameters `event: TreeSelectEvent<string>`)
- `toggle`: Event handler called when toggling item. (type `[event: TreeToggleEvent<string>]`; parameters `event: TreeToggleEvent<string>`)

### TreeVirtualizerRoot

#### Props

Properties for the TreeVirtualizerRoot component.

- `modelValue`: The controlled value of the tree. Can be bound-with with `v-model`. (type `U`; optional)
- `defaultValue`: The value of the tree when initially rendered. Use when you do not need to control the state of the tree (type `U`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. (type `IsMultiple<U, M>`; optional)
- `items`: List of items (type `T[]`; optional)
- `expanded`: The controlled value of the expanded item. Can be bound-with with `v-model`. (type `string[]`; optional)
- `defaultExpanded`: The value of the expanded tree when initially rendered. (type `string[]`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `TreeSelectBehavior`; optional)
- `toggleBehavior`: Determines whether a "single" or "multiple" items can be toggled at a time. (type `TreeToggleBehavior`; default `'multiple'`; optional)
- `dir`: The reading direction. (type `Direction`; optional)
- `loop`: When `true`, keyboard navigation will loop from last item to first, and vice versa. (type `boolean`; default `true`; optional)
- `disabled`: When `true`, prevents the user from interacting with tree (type `boolean`; optional)
- `propagateSelect`: When `true`, selecting parent will select the descendants. (type `boolean`; optional)
- `bubbleSelect`: When `true`, selecting children will update the parent state. (type `boolean`; optional)
- `allowParentSelect`: When `true`, parent can be selected. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)
- `height`: The height of the virtualizer root (type `string | number`; required)
- `options`: Options. (type `VirtualizerOptions`; optional)
- `dynamic`: Whether dynamic. (type `boolean`; optional)

#### Emits

Events for the TreeVirtualizerRoot component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `update:expanded`: Emitted when the expanded state changes. (type `[value: string[]]`; parameters `value: string[]`)

## Notes

### Architecture and benchmark differences

`TreeRoot` owns all state (selection/expansion through the `useControllableState` controlled/uncontrolled dual channels) and the selection strategy (`useSelectionBehavior`'s toggle/replace/range selection); all base primitives stay zero-style. `STree`/`STreeVirtualizer` only mirror the `loop` default and pass through slots — the node visuals are fully composed inside the `item` slot via `STreeItem`/`STreeVirtualizerItem` (indentation, icons, checkboxes, focus states all injected through classes). Keyboard navigation builds on Roving Focus (`↑/↓` move, `→/←` expand/collapse, typeahead) and additionally supports `Shift` range selection — an interaction beyond the default contract of most mainstream tree components. Virtualization builds on the `@vean/aria` virtualizer and renders only visible nodes.

| Capability                                      | VeanUI | Ant Design | Element Plus | Naive UI |
| :---------------------------------------------- | :----: | :--------: | :----------: | :------: |
| Aria/style separation                           |   ✅   |     —      |      —       |    —     |
| Single/multiple selection (toggle/replace)      |   ✅   |     ✅     |      ✅      |    ✅    |
| Expansion strategy (single/multiple toggle)     |   ✅   |     ✅     |      ✅      |    ✅    |
| Cascading selection (propagate/bubble/parent)   |   ✅   |     ✅     |      ✅      |    ⚠️    |
| Keyboard navigation (arrows + loop + typeahead) |   ✅   |     ✅     |      ✅      |    ⚠️    |
| Virtualization (1k nodes)                       |   ✅   |     ✅     |      ⚠️      |    ✅    |
| Checkable mode (checkbox)                       |   ⚠️   |     ✅     |      ✅      |    ✅    |
| Draggable reordering                            |   —    |     ✅     |      ✅      |    ✅    |
| Async child loading (loadData)                  |   —    |     ✅     |      ✅      |    ✅    |
| Search filtering (searchValue)                  |   —    |     ✅     |      ✅      |    —     |

`⚠️` = partial support (VeanUI checkable can be built via `multiple` + a custom `item` slot checkbox icon + the `data-selected`/`data-contains-selected` states; Naive UI has no built-in range selection or character location).

### Cautions

- The `modelValue` type is tied to `multiple`: a single-string `modelValue` forces single-select; an array with `multiple` truthy enables multi-select (enforced by the `IsMultiple<U, M>` conditional type).
- The `item` slot is **free composition**: the consumer must render `STreeItem` (or `STreeVirtualizerItem`) passing `item.value`/`item.level`; the slot also exposes `item.data` (the raw node data) and `isExpanded`/`isSelected`/`isIndeterminate`/`hasChildren` states.
- Parent nodes are **not selectable by default** (`allowParentSelect` defaults to `false`); enable it explicitly when needed.
- `propagateSelect`/`bubbleSelect` only take effect in multi-select mode (`multiple` + array value); with both on, the semi-checked state is expressed via `data-contains-selected`/`isIndeterminate`.
- With `toggleBehavior: 'single'`, expansion is accordion-like — only one branch stays expanded (`findParentPath` rebuilds the path).
- `loop` defaults to `true` (keyboard focus wraps around); both `STree` and `STreeVirtualizer` mirror this default in their wrappers, so no extra work is needed when using the Aria `TreeRoot` directly.
- Virtualization requires a `height`; the `STreeVirtualizer` `item` slot additionally provides `virtualItem` (for `:data` passthrough and absolute-position styling).
- Expand and collapse animate with a height-collapsing transition on the moved subtree. `STreeVirtualizer` has an opt-in `animated` prop that renders visible items in normal document flow (dynamic mode) so item positions stay correct across expand/collapse without absolute offsets — it is off by default since dynamic measuring is heavier for very large datasets, and while a motion runs the transition list renders fully in document flow before windowing resumes.
- Node text is fully provided by slots — the component has no hardcoded copy, so no localization is needed.

## FAQ

### How do I build a checkable tree?

Use `multiple` with a custom `item` slot that renders a checkbox icon and consumes the `isSelected`/`isIndeterminate` states:

```vue
<template #item="{ item, isSelected, isIndeterminate }">
  <STreeItem :value="item.value" :level="item.level">
    <SIcon :icon="isIndeterminate ? 'lucide:minus' : isSelected ? 'lucide:check-square' : 'lucide:square'" />
    {{ item.data.label }}
  </STreeItem>
</template>
```

Add `propagateSelect` to cascade parent selection to descendants, or `bubbleSelect` to auto-select a parent when all its children are selected.

### How do I control the expansion state?

Controlled: `v-model:expanded="expandedKeys"` (array of strings); or uncontrolled with `:default-expanded="['node-1']"`. The expansion event is `update:expanded`.

### How do I optimize for large data?

Use `STreeVirtualizer` with a `height`: only visible nodes render (customize `options.estimateSize` for row height), staying smooth with 1000+ nodes.

```vue
<template #item="{ item, virtualItem }">
  <STreeVirtualizerItem :value="item.value" :level="item.level" :data="virtualItem">
    {{ item.data.label }}
  </STreeVirtualizerItem>
</template>
```

### How do I prevent selecting parent nodes?

`allowParentSelect` defaults to `false` — clicking a parent with children only expands/collapses it without selecting. Set `:allow-parent-select="true"` explicitly to allow selecting parents.

### How do I load children asynchronously?

There is no built-in `loadData` contract; load lazily in the `toggle` event and update `items`:

```vue
<STree :items="items" @toggle="event => loadChildren(event.value)">


```

Write `children` into the matching node of `items` once loaded (expansion is tracked by `expanded`).

### How do I customize node icons and indentation?

The `item` slot composes freely: compute `padding-left` from `item.level`, switch icons on `item.hasChildren`/`isExpanded`, and style the focus state with `focus:ring-*` classes — see demo 01.

### How does the keyboard work?

`↑/↓` move focus across visible nodes; `→` expands a collapsed node (or enters a child level), `←` collapses (or returns to the parent); `Enter`/`Space` select the current node; typing characters triggers typeahead location; `Shift + ↑/↓` performs range selection in multi-select mode; with `loop` on (default), focus wraps around.
