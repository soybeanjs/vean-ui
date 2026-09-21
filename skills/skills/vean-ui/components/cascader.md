# Cascader

Source URL: https://veanui.com/components/cascader
Markdown URL: https://veanui.com/components/cascader.md
Category: Forms
Description: A cascader for selecting values from hierarchical tree data. It renders a linked multi-column panel and supports single/multiple selection, full-path value mode, parent-child check-state propagation, local filtering and remote search, lazy loading of children, and virtual scrolling for large datasets. Use it when options are organized as a tree and selection must happen level by level; for flat option lists, prefer SSelect or SCombobox.

## Overview

A cascader for selecting values from hierarchical tree data. It renders a linked multi-column panel and supports single/multiple selection, full-path value mode, parent-child check-state propagation, local filtering and remote search, lazy loading of children, and virtual scrolling for large datasets. Use it when options are organized as a tree and selection must happen level by level; for flat option lists, prefer `SSelect` or `SCombobox`.

## Usage

Usage examples for cascader are rendered on the site.

## Features

- 🗂 Linked multi-column panel — the path unfolds one level per column
- ☑️ Single or multiple selection with cascading parent-child check states (`showCheckedStrategy`: child / parent)
- 🛤 Full-path value mode (`pathMode`) — the model value carries the complete value/label path
- ⏳ Data loading — lazy children (`loadChildren`), debounced remote search (`searchDelay`), local filtering (`filter`) with a localized empty state
- 📜 Built-in per-column virtual scrolling (`virtualScroll`, configurable `itemSize` / `height`)
- ⌨️ Full keyboard navigation — Arrow keys move across columns, Enter selects, plus click/hover expand
- ♿ WAI-ARIA tree semantics — trigger `role="combobox"` + `aria-haspopup="tree"`, option `role="treeitem"`, axe-clean when open
- 🎨 16 recipe slots and 7 size variants via `cascaderVariants`

## Demos

Interactive demos for cascader are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (17): Cascader, CascaderArrow, CascaderClear, CascaderCompact, CascaderCompactOption, CascaderCompactTag, CascaderCompactTriggerValue, CascaderContent, CascaderEmpty, CascaderMenu, CascaderOption, CascaderPortal, CascaderRoot, CascaderSearchInput, CascaderTags, CascaderTrigger, CascaderValue.

### Cascader

#### Props

Properties for the Cascader component.

- `class`: the class of cascader trigger (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<CascaderUi>`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `showArrow`: When `true`, the arrow icon is rendered. (type `boolean`; default `true`; optional)
- `placement`: The placement of the content. (type `import("@/index").Placement`; optional)
- `triggerProps`: Properties forwarded to the trigger part. (type `CascaderTriggerProps`; optional)
- `valueProps`: Properties forwarded to the value part. (type `CascaderValueProps`; optional)
- `searchInputProps`: Properties forwarded to the search input part. (type `CascaderSearchInputProps`; optional)
- `portalProps`: Properties forwarded to the portal part. (type `PortalProps`; optional)
- `contentProps`: Properties forwarded to the content part. (type `CascaderContentProps`; optional)
- `menuProps`: Properties forwarded to every menu part. (type `CascaderMenuProps`; optional)
- `optionProps`: Properties forwarded to every option part. (type `Partial<CascaderOptionProps<T>>`; optional)
- `emptyProps`: Properties forwarded to the empty part. (type `CascaderEmptyProps`; optional)
- `emptyLabel`: The text shown in the empty state. (type `string`; default `The locale message`; optional)
- `clearLabel`: The accessible label of the clear button. (type `string`; default `The locale message`; optional)
- `arrowProps`: Properties forwarded to the arrow part. (type `PopperArrowProps`; optional)
- `modelValue`: The controlled value of the selected node(s). Can be bound with `v-model`. (type `CascaderValueType<T, M, P>`; optional)
- `defaultValue`: The default value of the selected node(s). (type `CascaderValueType<T, M, P>`; optional)
- `multiple`: When `true`, multiple nodes can be selected. (type `M`; optional)
- `pathMode`: When `true`, the model value is the full path array(s) instead of the node value(s). (type `P`; default `false`; optional)
- `options`: Options of the cascader. (type `CascaderOptionData<T>[]`; optional)
- `fieldKeys`: Field keys used to extract the option fields. (type `CascaderFieldKeys`; optional)
- `open`: The controlled open state of the Cascader. Can be bound as `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the cascader when it is initially rendered. (type `boolean`; optional)
- `disabled`: When `true`, prevents the user from interacting with the Cascader. (type `boolean`; optional)
- `clearable`: When `true`, the value can be cleared by the clear button. (type `boolean`; optional)
- `expandTrigger`: The trigger to expand the children of a node. (type `'click' | 'hover'`; default `'click'`; optional)
- `checkStrictly`: When `false`, only leaf nodes can be selected (single) or the parent-children check states are linked (multiple). When `true`, any node can be selected independently. (type `boolean`; default `false`; optional)
- `showCheckedStrategy`: The strategy used to collect and display checked nodes in multiple mode. - `child`: collect the leaves of the checked region. - `parent`: collect the topmost checked nodes (fold fully-checked subtrees into parents). (type `'child' | 'parent'`; default `'child'`; optional)
- `separator`: The separator used to join the path labels. (type `string`; default `' / '`; optional)
- `filterable`: When `true`, the trigger becomes a search input and the panel shows flat filtered results. (type `boolean`; optional)
- `filter`: Custom filter function used in local filtering mode. The default performs a case-insensitive `includes` match against every label of the path. (type `((pattern: string, option: CascaderOptionData<T>, path: string[]) => boolean)`; optional)
- `remote`: When `true`, the panel loads its options from `onSearch` instead of filtering locally. (type `boolean`; optional)
- `onSearch`: Async search function used in remote mode. Returns the flat options for the keyword. (type `((pattern: string) => Promise<CascaderOptionData<T>[]>)`; optional)
- `searchDelay`: Debounce delay in milliseconds for filtering and remote search. (type `number`; default `300`; optional)
- `lazy`: When `true`, children of a node are loaded asynchronously via `onLoad`. (type `boolean`; optional)
- `onLoad`: Async function used to load the children of a node when `lazy` is `true`. (type `((option: CascaderNode<T>) => Promise<CascaderOptionData<T>[]>)`; optional)
- `virtualScroll`: When `true`, only the visible rows of each column are rendered. (type `boolean`; optional)
- `itemSize`: The fixed height of a row used by virtual scrolling. (type `number`; default `34`; optional)
- `height`: The height of the panel used by virtual scrolling. (type `number`; default `204`; optional)
- `dir`: The reading direction of the component. (type `Direction`; optional)
- `placeholder`: The content shown when no node is selected. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the Cascader component.

- `update:modelValue`: Event handler called when the value of the cascader changes. Can be bound as `v-model`. (type `[value: CascaderValueType<T, M, P>]`; parameters `value: CascaderValueType<T, M, P>`)
- `update:open`: Event handler called when the open state of the cascader changes. Can be bound as `v-model:open`. (type `[value: boolean]`; parameters `value: boolean`)
- `change`: Event handler called when the value changes, with the selected nodes. (type `[value: CascaderValueType<T, M, P> | undefined, nodes: CascaderNode<T>[]]`; parameters `value: CascaderValueType<T, M, P> | undefined, nodes: CascaderNode<T>[]`)
- `clear`: Event handler called when the selection is cleared. (type `[]`)
- `loaded`: Event handler called when the children of a node have been loaded (lazy mode). (type `[node: CascaderNode<T>]`; parameters `node: CascaderNode<T>`)
- `closeAutoFocus`: Emitted when close auto focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `placed`: Emitted when the content is placed. (type `[]`)

#### Slots

Slots for the Cascader component.

- `trigger-icon`: Custom content for the trigger icon (arrow). (type `(() => any) | undefined`)
- `trigger-value`: Custom content for the trigger value. (type `((props: CascaderCompactTriggerValueSlotProps<T, M, P>) => any) | undefined`)
- `search-input`: Custom content for the search input. (type `(() => any) | undefined`)
- `option`: Custom content for a single option. (type `((props: CascaderCompactOptionSlotProps<T>) => any) | undefined`)
- `tag`: Custom content for a tag in multiple mode. (type `((props: CascaderCompactTagSlotProps<T>) => any) | undefined`)
- `empty`: Custom content for the empty state. (type `(() => any) | undefined`)

### CascaderArrow

- No documented props, emits, slots, or slot props were available.

### CascaderClear

#### Props

Properties for the CascaderClear component.

- `ariaLabel`: The accessible label of the clear button. (type `string`; default `'清除'`; optional)

### CascaderCompact

#### Props

Properties for the CascaderCompact component.

- `showArrow`: When `true`, the arrow icon is rendered. (type `boolean`; default `true`; optional)
- `placement`: The placement of the content. (type `import("@/index").Placement`; optional)
- `triggerProps`: Properties forwarded to the trigger part. (type `CascaderTriggerProps`; optional)
- `valueProps`: Properties forwarded to the value part. (type `CascaderValueProps`; optional)
- `searchInputProps`: Properties forwarded to the search input part. (type `CascaderSearchInputProps`; optional)
- `portalProps`: Properties forwarded to the portal part. (type `PortalProps`; optional)
- `contentProps`: Properties forwarded to the content part. (type `CascaderContentProps`; optional)
- `menuProps`: Properties forwarded to every menu part. (type `CascaderMenuProps`; optional)
- `optionProps`: Properties forwarded to every option part. (type `Partial<CascaderOptionProps<T>>`; optional)
- `emptyProps`: Properties forwarded to the empty part. (type `CascaderEmptyProps`; optional)
- `emptyLabel`: The text shown in the empty state. (type `string`; default `The locale message`; optional)
- `clearLabel`: The accessible label of the clear button. (type `string`; default `The locale message`; optional)
- `arrowProps`: Properties forwarded to the arrow part. (type `PopperArrowProps`; optional)
- `modelValue`: The controlled value of the selected node(s). Can be bound with `v-model`. (type `CascaderValueType<T, M, P>`; optional)
- `defaultValue`: The default value of the selected node(s). (type `CascaderValueType<T, M, P>`; optional)
- `multiple`: When `true`, multiple nodes can be selected. (type `M`; optional)
- `pathMode`: When `true`, the model value is the full path array(s) instead of the node value(s). (type `P`; default `false`; optional)
- `options`: Options of the cascader. (type `CascaderOptionData<T>[]`; optional)
- `fieldKeys`: Field keys used to extract the option fields. (type `CascaderFieldKeys`; optional)
- `open`: The controlled open state of the Cascader. Can be bound as `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the cascader when it is initially rendered. (type `boolean`; optional)
- `disabled`: When `true`, prevents the user from interacting with the Cascader. (type `boolean`; optional)
- `clearable`: When `true`, the value can be cleared by the clear button. (type `boolean`; optional)
- `expandTrigger`: The trigger to expand the children of a node. (type `'click' | 'hover'`; default `'click'`; optional)
- `checkStrictly`: When `false`, only leaf nodes can be selected (single) or the parent-children check states are linked (multiple). When `true`, any node can be selected independently. (type `boolean`; default `false`; optional)
- `showCheckedStrategy`: The strategy used to collect and display checked nodes in multiple mode. - `child`: collect the leaves of the checked region. - `parent`: collect the topmost checked nodes (fold fully-checked subtrees into parents). (type `'child' | 'parent'`; default `'child'`; optional)
- `separator`: The separator used to join the path labels. (type `string`; default `' / '`; optional)
- `filterable`: When `true`, the trigger becomes a search input and the panel shows flat filtered results. (type `boolean`; optional)
- `filter`: Custom filter function used in local filtering mode. The default performs a case-insensitive `includes` match against every label of the path. (type `((pattern: string, option: CascaderOptionData<T>, path: string[]) => boolean)`; optional)
- `remote`: When `true`, the panel loads its options from `onSearch` instead of filtering locally. (type `boolean`; optional)
- `onSearch`: Async search function used in remote mode. Returns the flat options for the keyword. (type `((pattern: string) => Promise<CascaderOptionData<T>[]>)`; optional)
- `searchDelay`: Debounce delay in milliseconds for filtering and remote search. (type `number`; default `300`; optional)
- `lazy`: When `true`, children of a node are loaded asynchronously via `onLoad`. (type `boolean`; optional)
- `onLoad`: Async function used to load the children of a node when `lazy` is `true`. (type `((option: CascaderNode<T>) => Promise<CascaderOptionData<T>[]>)`; optional)
- `virtualScroll`: When `true`, only the visible rows of each column are rendered. (type `boolean`; optional)
- `itemSize`: The fixed height of a row used by virtual scrolling. (type `number`; default `34`; optional)
- `height`: The height of the panel used by virtual scrolling. (type `number`; default `204`; optional)
- `dir`: The reading direction of the component. (type `Direction`; optional)
- `placeholder`: The content shown when no node is selected. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CascaderCompact component.

- `update:modelValue`: Event handler called when the value of the cascader changes. Can be bound as `v-model`. (type `[value: CascaderValueType<T, M, P>]`; parameters `value: CascaderValueType<T, M, P>`)
- `update:open`: Event handler called when the open state of the cascader changes. Can be bound as `v-model:open`. (type `[value: boolean]`; parameters `value: boolean`)
- `change`: Event handler called when the value changes, with the selected nodes. (type `[value: CascaderValueType<T, M, P> | undefined, nodes: CascaderNode<T>[]]`; parameters `value: CascaderValueType<T, M, P> | undefined, nodes: CascaderNode<T>[]`)
- `clear`: Event handler called when the selection is cleared. (type `[]`)
- `loaded`: Event handler called when the children of a node have been loaded (lazy mode). (type `[node: CascaderNode<T>]`; parameters `node: CascaderNode<T>`)
- `closeAutoFocus`: Emitted when close auto focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `placed`: Emitted when the content is placed. (type `[]`)

#### Slots

Slots for the CascaderCompact component.

- `trigger-icon`: Custom content for the trigger icon (arrow). (type `(() => any) | undefined`)
- `trigger-value`: Custom content for the trigger value. (type `((props: CascaderCompactTriggerValueSlotProps<T, M, P>) => any) | undefined`)
- `search-input`: Custom content for the search input. (type `(() => any) | undefined`)
- `option`: Custom content for a single option. (type `((props: CascaderCompactOptionSlotProps<T>) => any) | undefined`)
- `tag`: Custom content for a tag in multiple mode. (type `((props: CascaderCompactTagSlotProps<T>) => any) | undefined`)
- `empty`: Custom content for the empty state. (type `(() => any) | undefined`)

### CascaderCompactOption

#### Slot Props

Slot properties for the CascaderCompact option.

- `node`: The node being rendered. (type `CascaderNode<T>`; required)
- `checked`: Whether the node is checked. (type `boolean`; required)
- `indeterminate`: Whether the node is in an indeterminate state. (type `boolean`; required)
- `selected`: Whether the node is the currently selected node (single-select). (type `boolean`; required)
- `highlighted`: Whether the node is currently highlighted. (type `boolean`; required)
- `childSelected`: Whether a descendant of the node is currently selected (breadcrumb emphasis). (type `boolean`; required)
- `loading`: Whether the node is currently loading its children. (type `boolean`; required)
- `expand`: Expands the children column of the node without toggling its selection. (type `() => void`; required)

### CascaderCompactTag

#### Slot Props

Slot properties for the CascaderCompact tag.

- `node`: The node of the tag. (type `CascaderNode<T>`; required)
- `remove`: Removes the tag from the selection. (type `(node: CascaderNode<T>) => void`; required)

### CascaderCompactTriggerValue

#### Slot Props

Slot properties for the CascaderCompact trigger value.

- `modelValue`: Current model value. (type `M extends true ? MultipleCascaderValue<T, P> : SingleCascaderValue<T, P>`; required)
- `selectedLabels`: Labels of the selected nodes. (type `string[]`; required)
- `slotText`: Text shown in the trigger (selected path or placeholder). (type `string`; required)

### CascaderContent

#### Props

Properties for the CascaderContent component.

- `menuProps`: Properties forwarded to every menu part. (type `CascaderMenuProps`; optional)
- `emptyProps`: Properties forwarded to the empty part. (type `CascaderEmptyProps`; optional)
- `open`: Whether the floating layer is open. Drives the positioning lifecycle (`isPositioned` resets when open flips); the positioning primitive itself has no open state, so consumers wire their own open state here. (type `boolean`; default `true`; optional)
- `placement`: The placement of the floating element. If used, it will override the `side` and `align` props. (type `Placement`; default `undefined`; optional)
- `side`: The preferred side of the anchor to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. (type `Side`; default `'bottom'`; optional)
- `sideOffset`: The distance in pixels from the anchor. (type `number`; default `0`; optional)
- `sideFlip`: Flip to the opposite side when colliding with boundary. (type `boolean`; default `true`; optional)
- `align`: The preferred alignment against the anchor. May change when collisions occur. (type `Align`; default `'center'`; optional)
- `alignOffset`: An offset in pixels from the `start` or `end` alignment options. (type `number`; default `0`; optional)
- `alignFlip`: Flip alignment when colliding with boundary. May only occur when `prioritizePosition` is true. (type `boolean`; default `true`; optional)
- `avoidCollisions`: When `true`, overrides the side and align preferences to prevent collisions with boundary edges. (type `boolean`; default `true`; optional)
- `collisionBoundary`: The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check. (type `Element | (Element | null)[] | null`; default `[ ]`; optional)
- `collisionPadding`: The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }. (type `Padding`; default `0`; optional)
- `arrowPadding`: The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners. (type `number`; default `0`; optional)
- `hideShiftedArrow`: When `true`, hides the arrow when it cannot be centered to the reference element. (type `boolean`; default `false`; optional)
- `sticky`: The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the anchor is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. (type `'partial' | 'always'`; default `'partial'`; optional)
- `hideWhenDetached`: Whether to hide the content when the anchor becomes fully occluded. (type `boolean`; default `false`; optional)
- `positionStrategy`: The type of CSS position property to use. (type `'fixed' | 'absolute'`; default `'fixed'`; optional)
- `updatePositionStrategy`: Strategy to update the position of the floating element on every animation frame. (type `'always' | 'optimized'`; default `'optimized'`; optional)
- `disableUpdateOnLayoutShift`: Whether to disable the update position for the content when the layout shifted. (type `boolean`; default `false`; optional)
- `prioritizePosition`: Force content to be position within the viewport. Might overlap the reference element, which may not be desired. (type `boolean`; default `false`; optional)
- `reference`: The custom element or virtual element that will be set as the reference to position the floating element. If provided, it will replace the default anchor element. (type `ReferenceElement`; optional)
- `disableOutsidePointerEvents`: When `true`, hover/focus/click interactions will be disabled on elements outside the `DismissableLayer`. Users will need to click twice on outside elements to interact with them: once to close the `DismissableLayer`, and again to trigger the element. (type `boolean`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

#### Emits

Events for the CascaderContent component.

- `closeAutoFocus`: Emitted when close auto focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `placed`: Emitted when the content is placed. (type `[]`)

### CascaderEmpty

- No documented props, emits, slots, or slot props were available.

### CascaderMenu

#### Props

Properties for the CascaderMenu component.

- `level`: The depth of the menu column. (type `number`; optional)
- `optionProps`: Properties forwarded to every option part. (type `Partial<CascaderOptionProps<DefinedValue>>`; optional)

### CascaderOption

#### Props

Properties for the CascaderOption component.

- `node`: The node rendered by the option. (type `CascaderNode<T>`; required)
- `index`: The position of the node inside its column. (type `number`; optional)
- `level`: The depth of the column the option belongs to. (type `number`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the CascaderOption component.

- `select`: Event handler called when the node is selected. Can be prevented by calling `event.preventDefault`. (type `[event: CascaderSelectEvent<T>]`; parameters `event: CascaderSelectEvent<T>`)
- `expand`: Event handler called when the node is expanded. Can be prevented by calling `event.preventDefault`. (type `[event: CascaderExpandEvent<T>]`; parameters `event: CascaderExpandEvent<T>`)

### CascaderPortal

#### Props

Alias of the portal props used by the cascader portal part.

- `to`: Vue native teleport component prop `:to` {@link https://vuejs.org/guide/built-ins/teleport.html#basic-usage} (type `string | HTMLElement`; optional)
- `disabled`: Disable teleport and render the component inline {@link https://vuejs.org/guide/built-ins/teleport.html#disabling-teleport} (type `boolean`; optional)
- `defer`: Defer the resolving of a Teleport target until other parts of the application have mounted (requires Vue 3.5.0+) {@link https://vuejs.org/guide/built-ins/teleport.html#deferred-teleport} (type `boolean`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

### CascaderRoot

#### Props

Properties for the CascaderRoot component.

- `modelValue`: The controlled value of the selected node(s). Can be bound with `v-model`. (type `CascaderValueType<T, M, P>`; optional)
- `defaultValue`: The default value of the selected node(s). (type `CascaderValueType<T, M, P>`; optional)
- `multiple`: When `true`, multiple nodes can be selected. (type `M`; optional)
- `pathMode`: When `true`, the model value is the full path array(s) instead of the node value(s). (type `P`; default `false`; optional)
- `options`: Options of the cascader. (type `CascaderOptionData<T>[]`; optional)
- `fieldKeys`: Field keys used to extract the option fields. (type `CascaderFieldKeys`; optional)
- `open`: The controlled open state of the Cascader. Can be bound as `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the cascader when it is initially rendered. (type `boolean`; optional)
- `disabled`: When `true`, prevents the user from interacting with the Cascader. (type `boolean`; optional)
- `clearable`: When `true`, the value can be cleared by the clear button. (type `boolean`; optional)
- `expandTrigger`: The trigger to expand the children of a node. (type `'click' | 'hover'`; default `'click'`; optional)
- `checkStrictly`: When `false`, only leaf nodes can be selected (single) or the parent-children check states are linked (multiple). When `true`, any node can be selected independently. (type `boolean`; default `false`; optional)
- `showCheckedStrategy`: The strategy used to collect and display checked nodes in multiple mode. - `child`: collect the leaves of the checked region. - `parent`: collect the topmost checked nodes (fold fully-checked subtrees into parents). (type `'child' | 'parent'`; default `'child'`; optional)
- `separator`: The separator used to join the path labels. (type `string`; default `' / '`; optional)
- `filterable`: When `true`, the trigger becomes a search input and the panel shows flat filtered results. (type `boolean`; optional)
- `filter`: Custom filter function used in local filtering mode. The default performs a case-insensitive `includes` match against every label of the path. (type `((pattern: string, option: CascaderOptionData<T>, path: string[]) => boolean)`; optional)
- `remote`: When `true`, the panel loads its options from `onSearch` instead of filtering locally. (type `boolean`; optional)
- `onSearch`: Async search function used in remote mode. Returns the flat options for the keyword. (type `((pattern: string) => Promise<CascaderOptionData<T>[]>)`; optional)
- `searchDelay`: Debounce delay in milliseconds for filtering and remote search. (type `number`; default `300`; optional)
- `lazy`: When `true`, children of a node are loaded asynchronously via `onLoad`. (type `boolean`; optional)
- `onLoad`: Async function used to load the children of a node when `lazy` is `true`. (type `((option: CascaderNode<T>) => Promise<CascaderOptionData<T>[]>)`; optional)
- `virtualScroll`: When `true`, only the visible rows of each column are rendered. (type `boolean`; optional)
- `itemSize`: The fixed height of a row used by virtual scrolling. (type `number`; default `34`; optional)
- `height`: The height of the panel used by virtual scrolling. (type `number`; default `204`; optional)
- `dir`: The reading direction of the component. (type `Direction`; optional)
- `placeholder`: The content shown when no node is selected. (type `string`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the CascaderRoot component.

- `update:modelValue`: Event handler called when the value of the cascader changes. Can be bound as `v-model`. (type `[value: CascaderValueType<T, M, P>]`; parameters `value: CascaderValueType<T, M, P>`)
- `update:open`: Event handler called when the open state of the cascader changes. Can be bound as `v-model:open`. (type `[value: boolean]`; parameters `value: boolean`)
- `change`: Event handler called when the value changes, with the selected nodes. (type `[value: CascaderValueType<T, M, P> | undefined, nodes: CascaderNode<T>[]]`; parameters `value: CascaderValueType<T, M, P> | undefined, nodes: CascaderNode<T>[]`)
- `clear`: Event handler called when the selection is cleared. (type `[]`)
- `loaded`: Event handler called when the children of a node have been loaded (lazy mode). (type `[node: CascaderNode<T>]`; parameters `node: CascaderNode<T>`)

### CascaderSearchInput

- No documented props, emits, slots, or slot props were available.

### CascaderTags

#### Slots

Slots for the CascaderTags component.

- `tag`: Custom content for a single tag in multiple mode. (type `((props: CascaderCompactTagSlotProps<T>) => any) | undefined`)
- `value`: Custom content shown when there is no selection. (type `(() => any) | undefined`)

### CascaderTrigger

#### Props

Properties for the CascaderTrigger component.

- `disabled`: When `true`, prevents the user from interacting with the trigger. (type `boolean`; optional)
- `reference`: No description. (type `ReferenceElement`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### CascaderValue

#### Props

Properties for the CascaderValue component.

- `placeholder`: The content shown when no node is selected. (type `string`; optional)

## Notes

### Architecture and benchmark differences

VeanUI implements cascader with a self-developed data engine (`useCascaderData`) rather than reusing the listbox selection/collection bases, whose flat single-value model does not fit tree cascading: `shallowReactive` node trees cache `pathValues` / `pathLabels` / `level` for O(1) lookups, the `menus` computed derives the visible columns, and cascading checks run `setCheckedDeep` / `recomputeAncestors` / `collectCheckedNodes`. `CascaderOption` dispatches cancellable `select` / `expand` custom events (reka-ui style). The `scv()` recipe `cascaderVariants` declares 16 slots and 7 size variants.

| Capability                        | VeanUI | Ant Design `Cascader` | reka-ui `Cascader` | Element Plus `Cascader` |
| :-------------------------------- | :----: | :-------------------: | :----------------: | :---------------------: |
| Aria/styled split                 |   ✅   |           —           |         ✅         |            —            |
| Multi-column panel                |   ✅   |          ✅           |         ✅         |           ✅            |
| Cascading checks + half-check     |   ✅   |          ✅           |         —          |           ✅            |
| Lazy loading / remote search      |   ✅   |          ✅           |         ✅         |           ✅            |
| `showCheckedStrategy`             |   ✅   |          ✅           |         —          |            —            |
| `pathMode` (path values)          |   ✅   |          ✅           |         —          |            —            |
| Virtual scrolling                 |   ✅   |           —           |         —          |            —            |
| Cancellable custom events         |   ✅   |           —           |         ✅         |            —            |
| Localized strings (not hardcoded) |   ✅   |           —           |         —          |           ✅            |
| axe-clean (open state)            |   ✅   |           —           |         —          |            —            |

### Cautions

- All built-in strings are localized (`LocaleCascaderMessages`); override per instance with `emptyLabel` / `clearLabel` or the matching `aria-label` attrs.
- In filterable mode the trigger becomes `tabindex=-1` and focus lives in the search input — keyboard navigation starts there.
- Clicking a non-leaf node in search mode only highlights it; the multi-column path does not expand (differs from AntD) — expand on demand if you need that behavior.
- `select` / `expand` events still fire on disabled items (emitted before the guard) without changing the model value; guard in the consumer if needed.

## FAQ

### How do I get the full path instead of the last value?

Enable `pathMode`; the model value then carries the complete value/label path rather than the deepest node only.

### How do I load children lazily from an API?

Pass `loadChildren` returning the children for a node; the engine tracks the loading state and emits `loaded` when it finishes.

### How do I filter remotely?

Use `searchDelay` for debouncing and provide your own `filter` implementation (or feed filtered `items`); the built-in filtering matches path labels client-side.

### How do I emit only checked leaves?

Configure `showCheckedStrategy: 'child'` to collect only leaf nodes when a parent is checked, or `'parent'` to emit the checked parents.
