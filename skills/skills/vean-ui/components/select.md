# Select

Source URL: https://veanui.com/components/select
Markdown URL: https://veanui.com/components/select.md
Category: Forms
Description: Displays a list of options for the user to pick from, triggered by a button. The trigger renders the selected value (or placeholder), and the popup supports keyboard navigation, typeahead, grouping, multiple selection, and clearable mode. Use it to pick one or more values from a bounded set; for free-text search over a list, use SCombobox; for cascading hierarchical data, use SCascader.

## Overview

Displays a list of options for the user to pick from, triggered by a button. The trigger renders the selected value (or placeholder), and the popup supports keyboard navigation, typeahead, grouping, multiple selection, and clearable mode. Use it to pick one or more values from a bounded set; for free-text search over a list, use `SCombobox`; for cascading hierarchical data, use `SCascader`.

## Usage

Usage examples for select are rendered on the site.

## Features

- 📊 Data-driven `SelectCompact` API — pass `items` (options use `label` / `value` fields)
- ⌨️ Full combobox interaction — pointer/keyboard open, Arrow/Home/End navigation, typeahead search, Enter/Space select, Escape close
- 🗂 Grouping with group labels, separators, and item indicators
- ✅ `multiple` selection with accumulation and deduplication
- 🧹 Clearable mode — trigger hover-reveal clear, plus `selectionBehavior` for whether re-selecting toggles or resets
- 📍 Item-aligned positioning (`position="item-aligned"`)
- 📋 Native form submission via a hidden proxy `<select>` (`SelectBubbleSelect`)
- 📌 `top` / `bottom` slots for fixed header and footer content inside the popup
- ♿ Full accessibility support — `role="combobox"` / `listbox` / `option`, axe-clean

## Demos

Interactive demos for select are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (20): Select, SelectArrow, SelectClear, SelectCompact, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectItemIndicator, SelectItemText, SelectPopup, SelectPortal, SelectRoot, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectTriggerIcon, SelectValue, SelectViewport.

### Select

#### Props

Properties for the Select component.

- `class`: the class of select trigger (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<SelectUi>`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `items`: Items rendered by the component. (type `SelectOptionData<T>[]`; required)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `SelectTriggerProps`; optional)
- `triggerIconProps`: Properties forwarded to the trigger icon element. (type `SelectTriggerIconProps`; optional)
- `showTriggerIcon`: Whether to show the trigger icon. (type `boolean`; default `true`; optional)
- `clearLabel`: Clear label. (type `string`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `SelectClearProps`; optional)
- `placeholder`: Placeholder. (type `string`; optional)
- `valueProps`: Properties forwarded to the value element. (type `SelectValueProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `SelectPortalProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `SelectContentProps`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `SelectPopupProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `SelectViewportProps`; optional)
- `scrollDownButtonProps`: Properties forwarded to the scroll down button element. (type `SelectScrollDownButtonProps`; optional)
- `scrollUpButtonProps`: Properties forwarded to the scroll up button element. (type `SelectScrollUpButtonProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `SelectGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `SelectGroupLabelProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `SelectItemProps`; optional)
- `itemTextProps`: Properties forwarded to the item text element. (type `SelectItemTextProps`; optional)
- `itemIndicatorProps`: Properties forwarded to the item indicator element. (type `SelectItemIndicatorProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `SelectSeparatorProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopperArrowProps`; optional)
- `open`: The controlled open state of the Select. Can be bind as `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the select when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `nullableValue`: The value of the hidden native select option when the model value is nullish. (type `string`; optional)
- `dir`: The reading direction of the combobox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `autocomplete`: Native html input `autocomplete` attribute. (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with Select (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? T[] : T)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? T[] : T)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the Select component.

- `update:modelValue`: No description. (type `[value: M extends true ? T[] : T]`; parameters `value: M extends true ? T[] : T`)
- `update:open`: Event handler called when the open state of the context menu changes. (type `[value: boolean]`; parameters `value: boolean`)
- `closeAutoFocus`: Emitted when close auto focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectItemEvent<T>]`; parameters `event: SelectItemEvent<T>`)

#### Slots

Slots for the Select component.

- `top`: Custom content rendered at the top of the popup, fixed above the scrollable list. (type `(() => any) | undefined`)
- `bottom`: Custom content rendered at the bottom of the popup, fixed below the scrollable list. (type `(() => any) | undefined`)
- `trigger-leading`: Custom content for the trigger leading slot. (type `(() => any) | undefined`)
- `trigger-value`: Custom content for the trigger value slot. (type `((props: SelectCompactTriggerValueSlotProps<T, M>) => any) | undefined`)
- `trigger-trailing`: Custom content for the trigger trailing slot. (type `(() => any) | undefined`)
- `trigger-icon`: Custom content for the trigger icon slot. (type `(() => any) | undefined`)
- `scroll-up-button`: Custom content for the scroll up button slot. (type `(() => any) | undefined`)
- `scroll-down-button`: Custom content for the scroll down button slot. (type `(() => any) | undefined`)
- `group-label`: Custom content for the group label slot. (type `((props: SelectCompactGroupLabelSlotProps<T>) => any) | undefined`)
- `item-text`: Custom content for the item text slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)
- `item-indicator`: Custom content for the item indicator slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)

### SelectArrow

- No documented props, emits, slots, or slot props were available.

### SelectClear

#### Props

Properties for the SelectClear component.

- `ariaLabel`: Aria label for the clear button. (type `string`; optional)
- `disabled`: Whether the clear button is disabled. (type `boolean`; optional)

### SelectCompact

#### Props

Properties for the SelectCompact component.

- `items`: Items rendered by the component. (type `SelectOptionData<T>[]`; required)
- `showArrow`: Whether to show an arrow. (type `boolean`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `SelectTriggerProps`; optional)
- `triggerIconProps`: Properties forwarded to the trigger icon element. (type `SelectTriggerIconProps`; optional)
- `showTriggerIcon`: Whether to show the trigger icon. (type `boolean`; default `true`; optional)
- `clearLabel`: Clear label. (type `string`; optional)
- `clearProps`: Properties forwarded to the clear element. (type `SelectClearProps`; optional)
- `placeholder`: Placeholder. (type `string`; optional)
- `valueProps`: Properties forwarded to the value element. (type `SelectValueProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `SelectPortalProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `SelectContentProps`; optional)
- `placement`: Placement. (type `import("@/index").Placement`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `SelectPopupProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `SelectViewportProps`; optional)
- `scrollDownButtonProps`: Properties forwarded to the scroll down button element. (type `SelectScrollDownButtonProps`; optional)
- `scrollUpButtonProps`: Properties forwarded to the scroll up button element. (type `SelectScrollUpButtonProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `SelectGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `SelectGroupLabelProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `SelectItemProps`; optional)
- `itemTextProps`: Properties forwarded to the item text element. (type `SelectItemTextProps`; optional)
- `itemIndicatorProps`: Properties forwarded to the item indicator element. (type `SelectItemIndicatorProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `SelectSeparatorProps`; optional)
- `arrowProps`: Properties forwarded to the arrow element. (type `PopperArrowProps`; optional)
- `open`: The controlled open state of the Select. Can be bind as `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the select when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `nullableValue`: The value of the hidden native select option when the model value is nullish. (type `string`; optional)
- `dir`: The reading direction of the combobox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `autocomplete`: Native html input `autocomplete` attribute. (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with Select (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? T[] : T)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? T[] : T)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the SelectCompact component.

- `update:modelValue`: No description. (type `[value: M extends true ? T[] : T]`; parameters `value: M extends true ? T[] : T`)
- `update:open`: Event handler called when the open state of the context menu changes. (type `[value: boolean]`; parameters `value: boolean`)
- `closeAutoFocus`: Emitted when close auto focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectItemEvent<T>]`; parameters `event: SelectItemEvent<T>`)

#### Slots

Slots for the SelectCompact component.

- `top`: Custom content rendered at the top of the popup, fixed above the scrollable list. (type `(() => any) | undefined`)
- `bottom`: Custom content rendered at the bottom of the popup, fixed below the scrollable list. (type `(() => any) | undefined`)
- `trigger-leading`: Custom content for the trigger leading slot. (type `(() => any) | undefined`)
- `trigger-value`: Custom content for the trigger value slot. (type `((props: SelectCompactTriggerValueSlotProps<T, M>) => any) | undefined`)
- `trigger-trailing`: Custom content for the trigger trailing slot. (type `(() => any) | undefined`)
- `trigger-icon`: Custom content for the trigger icon slot. (type `(() => any) | undefined`)
- `scroll-up-button`: Custom content for the scroll up button slot. (type `(() => any) | undefined`)
- `scroll-down-button`: Custom content for the scroll down button slot. (type `(() => any) | undefined`)
- `group-label`: Custom content for the group label slot. (type `((props: SelectCompactGroupLabelSlotProps<T>) => any) | undefined`)
- `item-text`: Custom content for the item text slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)
- `item-indicator`: Custom content for the item indicator slot. (type `((props: SelectCompactItemSlotProps<T>) => any) | undefined`)

### SelectContent

#### Props

Properties for the SelectContent component.

- `position`: The positioning mode to use `item-aligned (default)` - behaves similarly to a native MacOS menu by positioning content relative to the active item. <br> `popper` - positions content in the same way as our other primitives, for example `Popover` or `DropdownMenu`. (type `SelectPosition`; optional)
- `bodyLock`: The document.body will be lock, and scrolling will be disabled. (type `boolean`; default `true`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `SelectPopupProps`; optional)
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

Events for the SelectContent component.

- `closeAutoFocus`: Emitted when close auto focus occurs. (type `[event: Event]`; parameters `event: Event`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)

### SelectGroup

- No documented props, emits, slots, or slot props were available.

### SelectGroupLabel

- No documented props, emits, slots, or slot props were available.

### SelectItem

#### Props

Properties for the SelectItem component.

- `value`: The value given as data when submitted with a `name`. (type `string | number`; required)
- `disabled`: When `true`, prevents the user from interacting with the item. (type `boolean`; optional)
- `textValue`: Optional text used for typeahead purposes. By default the typeahead behavior will use the `.textContent` of the `SelectItemText` part. Use this when the content is complex, or you have non-textual content inside. (type `string`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the SelectItem component.

- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectItemEvent<T>]`; parameters `event: SelectItemEvent<T>`)

### SelectItemIndicator

#### Props

Properties for the SelectItemIndicator component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SelectItemText

- No documented props, emits, slots, or slot props were available.

### SelectPopup

- No documented props, emits, slots, or slot props were available.

### SelectPortal

- No documented props, emits, slots, or slot props were available.

### SelectRoot

#### Props

Properties for the SelectRoot component.

- `open`: The controlled open state of the Select. Can be bind as `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the select when it is initially rendered. Use when you do not need to control its open state. (type `boolean`; optional)
- `nullableValue`: The value of the hidden native select option when the model value is nullish. (type `string`; optional)
- `dir`: The reading direction of the combobox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `autocomplete`: Native html input `autocomplete` attribute. (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with Select (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? T[] : T)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? T[] : T)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `selectionBehavior`: How multiple selection should behave in the collection. (type `SelectionBehavior`; default `'toggle'`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the SelectRoot component.

- `update:modelValue`: No description. (type `[value: M extends true ? T[] : T]`; parameters `value: M extends true ? T[] : T`)
- `update:open`: Event handler called when the open state of the context menu changes. (type `[value: boolean]`; parameters `value: boolean`)

### SelectScrollDownButton

#### Props

Properties for the SelectScrollDownButton component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SelectScrollUpButton

#### Props

Properties for the SelectScrollUpButton component.

- `type`: The type of the button element. Can be one of 'button', 'submit', or 'reset'. (type `ButtonType`; default `'button'`; optional)
- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SelectSeparator

- No documented props, emits, slots, or slot props were available.

### SelectTrigger

#### Props

Properties for the SelectTrigger component.

- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `reference`: No description. (type `ReferenceElement`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### SelectTriggerIcon

- No documented props, emits, slots, or slot props were available.

### SelectValue

#### Props

Properties for the SelectValue component.

- `placeholder`: The content that will be rendered inside the `SelectValue` when no `value` or `defaultValue` is set. (type `string`; optional)

### SelectViewport

#### Props

Properties for the SelectViewport component.

- `nonce`: Will add `nonce` attribute to the style tag which can be used by Content Security Policy. <br> If omitted, inherits globally from `ConfigProvider`. (type `string`; optional)

## Notes

### Architecture and benchmark differences

VeanUI builds select on a full ComboBox base: `SelectRoot` → `SelectTrigger` (`role="combobox"`) → `SelectValue` (collection label lookup) → `SelectContentImpl` (DismissableLayer + FocusScope + typeahead + keyboard nav) → `SelectItem`, with `SelectBubbleSelect` proxying native form submission. The `scv()` recipe `selectVariants` declares 16 slots and 7 size variants. This mirrors reka-ui / shadcn select semantics with a data-driven `SelectCompact` aggregation as the VeanUI differentiator.

| Capability                           | VeanUI | reka-ui `Select` | shadcn `Select` | Element Plus `el-select` |
| :----------------------------------- | :----: | :--------------: | :-------------: | :----------------------: |
| Aria/styled split                    |   ✅   |        ✅        |        —        |            —             |
| combobox role + keyboard nav         |   ✅   |        ✅        |       ✅        |            ✅            |
| Typeahead search                     |   ✅   |        ✅        |        —        |            ✅            |
| Controlled / uncontrolled + multiple |   ✅   |        ✅        |        —        |            ✅            |
| Grouping + group labels              |   ✅   |        ✅        |       ✅        |            ✅            |
| Form proxying (BubbleSelect)         |   ✅   |        ✅        |        —        |            ✅            |
| Item-aligned positioning             |   ✅   |        ✅        |        —        |            —             |
| Data-driven Compact API              |   ✅   |        —         |        —        |            —             |
| Virtual scrolling                    |   —    |        —         |        —        |            ✅            |
| axe-clean (open state)               |   ✅   |        —         |       ✅        |            —             |

### Cautions

- Before the popup first opens, label lookup relies on the data-driven `fallbackLabel` computed from `items` — pass `items` (not just composition children) so the trigger text renders for `defaultValue` / controlled `modelValue`.
- `virtual` scrolling is not implemented; very large option lists may need custom virtualization.
- `multiple` with `clearable` uses `selectionBehavior` to decide whether clearing toggles off or resets the selection.

## FAQ

### How do I show the selected label before the popup is opened?

Pass `items` to `SSelect`. `SelectCompact` resolves the label from `items` via `fallbackLabel`, so `defaultValue` / controlled `modelValue` render on the trigger immediately.

### How do I enable multiple selection?

Pass `multiple`. Selections accumulate and deduplicate; `modelValue` becomes an array.

### How do I group options?

Pass grouped `items` — a group entry carries a `label` and a nested `items` array. Group headers render via the `group-label` slot, and separators via `separator`.

### How does the select submit in a native form?

The component renders a hidden native `<select>` (`SelectBubbleSelect`) mirroring the current value, so native form submission and browser autofill work.

### How do I make the trigger show an arrow or custom content?

Use the `trigger-icon` / `value` slots or the `showArrow`-equivalent slot surface; all 16 recipe slots are forwarded by `SSelect`.

### How do I clear the selected value from the trigger?

`clearable` defaults to `true`. With a value selected, hover or focus the trigger to reveal an ✕ button; clicking it resets `modelValue` to `undefined` (or `[]` when `multiple`). Pass `:clearable="false"` to hide it. Re-clicking the selected option still follows `selectionBehavior`.

### How do I add fixed header or footer content inside the popup?

Use the `top` and `bottom` slots. `top` renders above the scrollable list and `bottom` below it; both stay fixed while only the middle option list scrolls.
