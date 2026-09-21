# Combobox

Source URL: https://veanui.com/components/combobox
Markdown URL: https://veanui.com/components/combobox.md
Category: Forms
Description: A combobox for searching and selecting values from an option list, with an explicit anchor composition, clearable input, and complete popup/filtering behavior. The input filters options as you type and keyboard navigation follows the WAI-ARIA combobox pattern. Use it when users must type to filter a list; for selection without typing, use SSelect; for fuzzy-matching suggestions over text, use SAutocomplete.

## Overview

A combobox for searching and selecting values from an option list, with an explicit anchor composition, clearable input, and complete popup/filtering behavior. The input filters options as you type and keyboard navigation follows the WAI-ARIA combobox pattern. Use it when users must type to filter a list; for selection without typing, use `SSelect`; for fuzzy-matching suggestions over text, use `SAutocomplete`.

## Usage

Usage examples for combobox are rendered on the site.

## Features

- 🔍 Type-to-filter with a three-state filter model (matched / empty / unset)
- ⌨️ Full keyboard navigation — Arrow keys, Enter/Space select, typeahead, Escape close
- 📜 Optional virtual scrolling (`ComboboxVirtualizer`)
- 🗂 Grouping with group labels and separators
- 🧹 Trigger clear icon deselects (`clearable`); the popup cancel clears only the search input
- 🧩 `ComboboxValue` primitive renders the selected labels (or placeholder) for custom trigger layouts
- 📊 Data-driven `ComboboxCompact` API — `items` (options use `label` / `value` fields) + grouping
- 🎛 Controlled / uncontrolled with `v-model:open` and filter semantics (`ignoreFilter`, `resetSearchTermOnBlur`)
- ♿ Full accessibility support — `role="combobox"` / `listbox` / `option`, `aria-activedescendant`, axe-clean

## Demos

Interactive demos for combobox are rendered on the site.

## API

Structured API summary generated from build-time component metadata.

- Exported symbols (20): Combobox, ComboboxAnchor, ComboboxArrow, ComboboxCancel, ComboboxClear, ComboboxCompact, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxGroupLabel, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxPortal, ComboboxRoot, ComboboxSeparator, ComboboxTrigger, ComboboxValue, ComboboxViewport, ComboboxVirtualizer.

### Combobox

#### Props

Properties for the Combobox component.

- `class`: Additional class names applied to the root element. (type `string | false | Record<string, any> | ClassValue[] | null`; optional)
- `size`: Visual size of the component. (type `ThemeSize`; optional)
- `ui`: Per-slot class overrides for the component. (type `Partial<ComboboxUi>`; optional)
- `items`: Items rendered by the component. (type `ComboboxOptionData[]`; required)
- `placeholder`: Placeholder. (type `string`; optional)
- `searchPlaceholder`: Search placeholder. (type `string`; optional)
- `clearLabel`: Clear label. (type `string`; optional)
- `emptyLabel`: Empty label. (type `string`; optional)
- `anchorProps`: Properties forwarded to the anchor element. (type `ComboboxAnchorProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `ComboboxTriggerProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `ComboboxCancelProps`; optional)
- `valueProps`: Properties forwarded to the value element. (type `ComboboxValueProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `ComboboxPortalProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `ComboboxContentProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `ComboboxViewportProps`; optional)
- `inputProps`: Properties forwarded to the input element. (type `ComboboxInputProps`; optional)
- `emptyProps`: Properties forwarded to the empty element. (type `ComboboxEmptyProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `ComboboxGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `ComboboxGroupLabelProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `ComboboxItemProps`; optional)
- `itemIndicatorProps`: Properties forwarded to the item indicator element. (type `ComboboxItemIndicatorProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `ComboboxSeparatorProps`; optional)
- `open`: The controlled open state of the Combobox. Can be bound with `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the combobox when it is initially rendered. <br> Use when you do not need to control its open state. (type `boolean`; optional)
- `resetSearchTermOnBlur`: Whether to reset the searchTerm when the Combobox input blurred (type `boolean`; default `true`; optional)
- `resetSearchTermOnSelect`: Whether to reset the searchTerm when the Combobox value is selected (type `boolean`; default `true`; optional)
- `openOnFocus`: Whether to open the combobox when the input is focused (type `boolean`; default `false`; optional)
- `openOnClick`: Whether to open the combobox when the input is clicked (type `boolean`; default `false`; optional)
- `ignoreFilter`: When `true`, disable the default filters (type `boolean`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the Combobox component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `update:open`: Emitted when the open state changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: Event handler called when the positioner is placed (type `[]`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)

#### Slots

Slots for the Combobox component.

- `trigger-leading`: Custom content for the trigger leading slot. (type `(() => any) | undefined`)
- `trigger-value`: Custom content for the trigger value slot. (type `((props: ComboboxCompactTriggerValueSlotProps<M>) => any) | undefined`)
- `trigger-trailing`: Custom content for the trigger trailing slot. (type `(() => any) | undefined`)
- `trigger-icon`: Custom content for the trigger icon slot. (type `(() => any) | undefined`)
- `input-leading`: Custom content for the input leading slot. (type `((props: ComboboxCompactInputSlotProps) => any) | undefined`)
- `input-trailing`: Custom content for the input trailing slot. (type `((props: ComboboxCompactInputSlotProps) => any) | undefined`)
- `empty`: Custom content for the empty slot. (type `(() => any) | undefined`)
- `group-label`: Custom content for the group label slot. (type `((props: ComboboxCompactGroupLabelSlotProps) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)
- `item-text`: Custom content for the item text slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)
- `item-indicator`: Custom content for the item indicator slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)

### ComboboxAnchor

#### Props

Properties for the ComboboxAnchor component.

- `reference`: No description. (type `ReferenceElement`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxArrow

- No documented props, emits, slots, or slot props were available.

### ComboboxCancel

#### Props

Properties for the ComboboxCancel component.

- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxClear

#### Props

Properties for the ComboboxClear component.

- `ariaLabel`: Aria label for the clear button. (type `string`; optional)
- `disabled`: Whether the clear button is disabled. (type `boolean`; optional)

### ComboboxCompact

#### Props

Properties for the ComboboxCompact component.

- `items`: Items rendered by the component. (type `ComboboxOptionData[]`; required)
- `placeholder`: Placeholder. (type `string`; optional)
- `searchPlaceholder`: Search placeholder. (type `string`; optional)
- `clearLabel`: Clear label. (type `string`; optional)
- `emptyLabel`: Empty label. (type `string`; optional)
- `anchorProps`: Properties forwarded to the anchor element. (type `ComboboxAnchorProps`; optional)
- `triggerProps`: Properties forwarded to the trigger element. (type `ComboboxTriggerProps`; optional)
- `cancelProps`: Properties forwarded to the cancel element. (type `ComboboxCancelProps`; optional)
- `valueProps`: Properties forwarded to the value element. (type `ComboboxValueProps`; optional)
- `portalProps`: Properties forwarded to the portal element. (type `ComboboxPortalProps`; optional)
- `contentProps`: Properties forwarded to the content element. (type `ComboboxContentProps`; optional)
- `viewportProps`: Properties forwarded to the viewport element. (type `ComboboxViewportProps`; optional)
- `inputProps`: Properties forwarded to the input element. (type `ComboboxInputProps`; optional)
- `emptyProps`: Properties forwarded to the empty element. (type `ComboboxEmptyProps`; optional)
- `groupProps`: Properties forwarded to the group element. (type `ComboboxGroupProps`; optional)
- `groupLabelProps`: Properties forwarded to the group label element. (type `ComboboxGroupLabelProps`; optional)
- `itemProps`: Properties forwarded to the item element. (type `ComboboxItemProps`; optional)
- `itemIndicatorProps`: Properties forwarded to the item indicator element. (type `ComboboxItemIndicatorProps`; optional)
- `separatorProps`: Properties forwarded to the separator element. (type `ComboboxSeparatorProps`; optional)
- `open`: The controlled open state of the Combobox. Can be bound with `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the combobox when it is initially rendered. <br> Use when you do not need to control its open state. (type `boolean`; optional)
- `resetSearchTermOnBlur`: Whether to reset the searchTerm when the Combobox input blurred (type `boolean`; default `true`; optional)
- `resetSearchTermOnSelect`: Whether to reset the searchTerm when the Combobox value is selected (type `boolean`; default `true`; optional)
- `openOnFocus`: Whether to open the combobox when the input is focused (type `boolean`; default `false`; optional)
- `openOnClick`: Whether to open the combobox when the input is clicked (type `boolean`; default `false`; optional)
- `ignoreFilter`: When `true`, disable the default filters (type `boolean`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the ComboboxCompact component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `update:open`: Emitted when the open state changes. (type `[value: boolean]`; parameters `value: boolean`)
- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: Event handler called when the positioner is placed (type `[]`)
- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)

#### Slots

Slots for the ComboboxCompact component.

- `trigger-leading`: Custom content for the trigger leading slot. (type `(() => any) | undefined`)
- `trigger-value`: Custom content for the trigger value slot. (type `((props: ComboboxCompactTriggerValueSlotProps<M>) => any) | undefined`)
- `trigger-trailing`: Custom content for the trigger trailing slot. (type `(() => any) | undefined`)
- `trigger-icon`: Custom content for the trigger icon slot. (type `(() => any) | undefined`)
- `input-leading`: Custom content for the input leading slot. (type `((props: ComboboxCompactInputSlotProps) => any) | undefined`)
- `input-trailing`: Custom content for the input trailing slot. (type `((props: ComboboxCompactInputSlotProps) => any) | undefined`)
- `empty`: Custom content for the empty slot. (type `(() => any) | undefined`)
- `group-label`: Custom content for the group label slot. (type `((props: ComboboxCompactGroupLabelSlotProps) => any) | undefined`)
- `item-leading`: Custom content for the item leading slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)
- `item-text`: Custom content for the item text slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)
- `item-trailing`: Custom content for the item trailing slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)
- `item-indicator`: Custom content for the item indicator slot. (type `((props: ComboboxCompactItemSlotProps) => any) | undefined`)

### ComboboxContent

#### Props

Properties for the ComboboxContent component.

- `position`: Position. (type `'inline' | 'popper'`; optional)
- `bodyLock`: Whether body lock. (type `boolean`; optional)
- `hideWhenEmpty`: Whether hide when empty. (type `boolean`; optional)
- `popupProps`: Properties forwarded to the popup element. (type `PopperPositioningPopupProps`; optional)
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
- `trapFocus`: When `true`, focus cannot escape the content via keyboard, pointer, or a programmatic focus. (type `boolean`; default `false`; optional)
- `disableOutsidePointerEvents`: When `true`, hover/focus/click interactions will be disabled on elements outside the `DismissableLayer`. Users will need to click twice on outside elements to interact with them: once to close the `DismissableLayer`, and again to trigger the element. (type `boolean`; optional)
- `forceMount`: Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. (type `boolean`; optional)

#### Emits

Events for the ComboboxContent component.

- `escapeKeyDown`: Event handler called when the escape key is down. Can be prevented. (type `[event: KeyboardEvent]`; parameters `event: KeyboardEvent`)
- `pointerDownOutside`: Event handler called when a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. (type `[event: PointerDownOutsideEvent]`; parameters `event: PointerDownOutsideEvent`)
- `focusOutside`: Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. (type `[event: FocusOutsideEvent]`; parameters `event: FocusOutsideEvent`)
- `interactOutside`: Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. (type `[event: PointerDownOutsideEvent | FocusOutsideEvent]`; parameters `event: PointerDownOutsideEvent | FocusOutsideEvent`)
- `openAutoFocus`: Event handler called when auto-focusing on open. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `closeAutoFocus`: Event handler called when auto-focusing on close. Can be prevented. (type `[event: Event]`; parameters `event: Event`)
- `placed`: Event handler called when the positioner is placed (type `[]`)

### ComboboxEmpty

#### Props

Properties for the ComboboxEmpty component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxGroup

- No documented props, emits, slots, or slot props were available.

### ComboboxGroupLabel

- No documented props, emits, slots, or slot props were available.

### ComboboxInput

#### Props

Properties for the ComboboxInput component.

- `displayValue`: Display value. (type `((value: MaybeArray<string>) => string)`; optional)
- `inputRef`: The function to set the input element. (type `((el: HTMLInputElement) => void)`; optional)
- `controlProps`: The props of the input extra props. (type `InputControlProps`; optional)
- `defaultValue`: The default value of the input (type `string`; optional)
- `modelValue`: The controlled value of the input (type `string`; optional)
- `disabled`: When `true`, prevents the user from interacting with the input. (type `boolean`; optional)
- `readonly`: When `true`, the input is read-only. (type `boolean`; optional)
- `rootProps`: Properties forwarded to the root element (type `BaseProps`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)
- `id`: Id of the input element (type `string`; optional)
- `autofocus`: When `true`, the input is auto-focused. (type `boolean`; optional)
- `autocomplete`: The autocomplete attribute of the input. Supports the HTML autofill tokens (including password-manager values such as `current-password` / `new-password`), in addition to the `on` / `off` switches. (type `'search' | 'name' | 'email' | 'tel' | 'url' | 'on' | 'off' | 'username' | 'current-password' | 'new-password' | 'one-...`; optional)
- `maxlength`: The maximum number of characters allowed in the input (type `number`; optional)
- `minlength`: The minimum number of characters allowed in the input (type `number`; optional)
- `pattern`: The pattern attribute of the input (type `string`; optional)
- `placeholder`: The placeholder of the input (type `string`; optional)
- `type`: The type of the input element. (type `InputTypeHTMLAttribute`; optional)

#### Emits

Events for the ComboboxInput component.

- `update:modelValue`: Emitted when the model value changes. (type `[value: string]`; parameters `value: string`)

### ComboboxItem

#### Props

Properties for the ComboboxItem component.

- `textValue`: Text value. (type `string`; optional)
- `value`: The value given as data when submitted with a `name`. (type `string`; required)
- `disabled`: When `true`, prevents the user from interacting with the item. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

#### Emits

Events for the ComboboxItem component.

- `select`: Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. (type `[event: SelectEvent<string>]`; parameters `event: SelectEvent<string>`)

### ComboboxItemIndicator

#### Props

Properties for the ComboboxItemIndicator component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxPortal

- No documented props, emits, slots, or slot props were available.

### ComboboxRoot

#### Props

Properties for the ComboboxRoot component.

- `open`: The controlled open state of the Combobox. Can be bound with `v-model:open`. (type `boolean`; optional)
- `defaultOpen`: The open state of the combobox when it is initially rendered. <br> Use when you do not need to control its open state. (type `boolean`; optional)
- `resetSearchTermOnBlur`: Whether to reset the searchTerm when the Combobox input blurred (type `boolean`; default `true`; optional)
- `resetSearchTermOnSelect`: Whether to reset the searchTerm when the Combobox value is selected (type `boolean`; default `true`; optional)
- `openOnFocus`: Whether to open the combobox when the input is focused (type `boolean`; default `false`; optional)
- `openOnClick`: Whether to open the combobox when the input is clicked (type `boolean`; default `false`; optional)
- `ignoreFilter`: When `true`, disable the default filters (type `boolean`; optional)
- `clearable`: Whether selected item can be cleared when `multiple` is false. (type `boolean`; optional)
- `modelValue`: The controlled value of the selected item(s). Use this when you need to control the state of the items. Can be bound with `v-model` (type `(M extends true ? string[] : string)`; optional)
- `defaultValue`: The default value of the selected item(s). Use this when you need to set the initial state of the items. (type `(M extends true ? string[] : string)`; optional)
- `multiple`: Determines whether a "single" or "multiple" items can be selected at a time. This prop will overwrite the inferred type from `modelValue` and `defaultValue`. (type `M`; optional)
- `disabled`: When `true`, prevents the user from interacting with listbox (type `boolean`; optional)
- `dir`: The reading direction of the listbox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. (type `Direction`; optional)
- `name`: The name of the field. Submitted with its owning form as part of a name/value pair. (type `string`; optional)
- `highlightOnHover`: When `true`, hover over item will trigger highlight (type `boolean`; optional)
- `required`: When `true`, indicates that the user must set the value before the owning form can be submitted. (type `boolean`; optional)

#### Emits

Events for the ComboboxRoot component.

- `update:modelValue`: No description. (type `[value: M extends true ? string[] : string]`; parameters `value: M extends true ? string[] : string`)
- `highlight`: Event handler when highlighted element changes. (type `[payload?: CollectionItemData<ListboxCollectionItemData> | undefined]`; parameters `payload?: CollectionItemData<ListboxCollectionItemData> | undefined`)
- `update:open`: Emitted when the open state changes. (type `[value: boolean]`; parameters `value: boolean`)

### ComboboxSeparator

#### Props

Properties for the ComboboxSeparator component.

- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxTrigger

#### Props

Properties for the ComboboxTrigger component.

- `disabled`: Whether the component is disabled. (type `boolean`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxValue

#### Props

Properties for the ComboboxValue component.

- `items`: Items used to resolve selected labels. (type `ComboboxOptionData[]`; optional)
- `placeholder`: Placeholder rendered when no value is selected. (type `string`; optional)
- `separator`: Separator used to join multiple selected labels. (type `string`; default `', '`; optional)
- `asChild`: Change the default rendered element for the one passed as a child, merging their props and behavior. (type `boolean`; optional)
- `as`: The element or component this component should render as. Can be overwrite by `asChild` (type `AsTag | Component`; default `'div'`; optional)

### ComboboxViewport

#### Props

Properties for the ComboboxViewport component.

- `nonce`: Nonce. (type `string`; optional)

### ComboboxVirtualizer

#### Props

Properties for the ComboboxVirtualizer component.

- `options`: List of items (type `string[]`; required)
- `overscan`: Number of items rendered outside the visible area (type `number`; optional)
- `estimateSize`: Estimated size (in px) of each item (type `number | ((index: number) => number)`; optional)
- `textContent`: Text content for each item to achieve type-ahead feature (type `((option: string) => string)`; optional)

## Notes

### Architecture and benchmark differences

VeanUI builds combobox by reusing the listbox base plus Popper positioning: `ComboboxRoot` (selection state + `useControllableState(open)` + three-state filter) → `ComboboxInput` (`role="combobox"` + `aria-autocomplete`) → `ComboboxTrigger` → `ComboboxContentImpl` (DismissableLayer + FocusScope + bodyLock) → `ComboboxItem` → `ListboxItem`. The `scv()` recipe `comboboxVariants` declares 16 slots and 7 size variants. This mirrors reka-ui / shadcn combobox semantics, with virtual scrolling and the data-driven compact API as VeanUI differentiators.

| Capability                      | VeanUI | reka-ui `Combobox` | shadcn `Combobox` | Ant Design `Select` (showSearch) |
| :------------------------------ | :----: | :----------------: | :---------------: | :------------------------------: |
| Aria/styled split               |   ✅   |         ✅         |         —         |                —                 |
| Type-to-filter + 3-state filter |   ✅   |         ✅         |        ✅         |                ✅                |
| combobox/listbox roles          |   ✅   |         ✅         |        ✅         |                ✅                |
| Keyboard nav + typeahead        |   ✅   |         ✅         |         —         |                ✅                |
| Virtual scrolling               |   ✅   |         ✅         |         —         |                ✅                |
| Grouping + group labels         |   ✅   |         ✅         |        ✅         |                ✅                |
| Cancel button (clear)           |   ✅   |         ✅         |        ✅         |                ✅                |
| Empty state                     |   ✅   |         ✅         |         —         |                —                 |
| Data-driven Compact API         |   ✅   |         —          |         —         |                —                 |
| axe-clean (open state)          |   ✅   |         —          |        ✅         |                —                 |

### Cautions

- The input filters options client-side; for remote/async filtering, disable built-in filtering or debounce `inputValueChange` yourself.
- `resetSearchTermOnBlur` controls whether the search term is kept after blur — set it to match your UX (e.g. `false` keeps the typed term).
- When the root is `disabled`, all items become unselectable — including items that declare their own `disabled` (unified `rootDisabled || item.disabled` guard).

## FAQ

### What is the difference between `SCombobox` and `SSelect`?

`SCombobox` filters options as the user types (`role="combobox"` + `aria-autocomplete`); `SSelect` is trigger-driven with typeahead only. Choose combobox when typing to search matters.

### How do I enable virtual scrolling for large lists?

Add a `ComboboxVirtualizer` (or the equivalent compact flag) in the content; it activates an internal virtual list while preserving keyboard navigation.

### How do I clear the selection or just the search term?

Pass `clearable`. With a selected value, the trigger shows an ✕ clear icon — clicking it deselects and emits an empty `modelValue` (`undefined`, or `[]` when `multiple`). Inside the popup, the cancel button clears only the search input, keeping the selection.

### Why is a disabled item still selectable?

This was a real bug (a Vue `withDefaults` Boolean-prop defaulting issue) and is fixed. Disabled items now honor the unified `rootDisabled || item.disabled` guard, matching `SSelect`.
