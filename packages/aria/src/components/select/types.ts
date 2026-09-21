import type { ComputedRef, ShallowRef } from 'vue';
import type {
  BaseProps,
  DefinedValue,
  Direction,
  DismissableLayerProps,
  ForceMountProps,
  FormFieldCommonProps,
  MaybeArray,
  PointerDownOutsideEvent,
  ToContext,
  SelectionEmits,
  SelectionProps,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { PopperAnchorProps, PopperArrowProps, PopperPositioningPositionerProps } from '../popper/types';
import type { PortalProps } from '../portal/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

// SelectRoot
/**
 * Properties for the SelectRoot component.
 */
export interface SelectRootProps<T extends DefinedValue = DefinedValue, M extends boolean = false>
  extends SelectionProps<M, T>, FormFieldCommonProps {
  /** The controlled open state of the Select. Can be bind as `v-model:open`. */
  open?: boolean;
  /** The open state of the select when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean;
  /** The value of the hidden native select option when the model value is nullish. */
  nullableValue?: string;
  /**
   * The reading direction of the combobox when applicable. <br> If omitted, inherits globally from `ConfigProvider` or
   * assumes LTR (left-to-right) reading mode.
   */
  dir?: Direction;
  /** Native html input `autocomplete` attribute. */
  autocomplete?: string;
  /** When `true`, prevents the user from interacting with Select */
  disabled?: boolean;
}

/**
 * Events for the SelectRoot component.
 */
export type SelectRootEmits<T extends DefinedValue = DefinedValue, M extends boolean = false> = SelectionEmits<M, T> & {
  /** Event handler called when the open state of the context menu changes. */
  'update:open': [value: boolean];
};

/**
 * Type information for SelectOption.
 */
export interface SelectOption {
  /**
   * Value associated with the current item.
   */
  value: DefinedValue;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Text content.
   */
  textContent: string;
}

/**
 * Properties for the SelectPopup component.
 */
export interface SelectPopupProps extends BaseProps {}

// SelectItemAlignedPosition
/**
 * Properties for the SelectItemAlignedPosition component.
 */
export interface SelectItemAlignedPositionProps extends BaseProps {}

/**
 * Type information for SelectPosition.
 */
export type SelectPosition = 'item-aligned' | 'popper';

// SelectContentImpl
/**
 * Properties for the SelectContentImpl component.
 */
export interface SelectContentImplProps extends PopperPositioningPositionerProps, DismissableLayerProps {
  /**
   * The positioning mode to use
   *
   * `item-aligned (default)` - behaves similarly to a native MacOS menu by positioning content relative to the active
   * item. <br> `popper` - positions content in the same way as our other primitives, for example `Popover` or
   * `DropdownMenu`.
   */
  position?: SelectPosition;
  /**
   * The document.body will be lock, and scrolling will be disabled.
   *
   * @defaultValue true
   */
  bodyLock?: boolean;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: SelectPopupProps;
}

/**
 * Events for the SelectContentImpl component.
 */
export type SelectContentImplEmits = {
  /**
   * Emitted when close auto focus occurs.
   */
  closeAutoFocus: [event: Event];
  /** Event handler called when the escape key is down. Can be prevented. */
  escapeKeyDown: [event: KeyboardEvent];
  /** Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. */
  pointerDownOutside: [event: PointerDownOutsideEvent];
};

// SelectContent
/**
 * Properties for the SelectContent component.
 */
export interface SelectContentProps extends SelectContentImplProps, ForceMountProps {}

/**
 * Events for the SelectContent component.
 */
export type SelectContentEmits = SelectContentImplEmits;

/**
 * Properties for the SelectTeleportProvider component.
 */
export interface SelectTeleportProviderProps extends Pick<SelectContentImplProps, 'position'> {
  /**
   * Popup element.
   */
  popupElement?: HTMLElement;
}

// Viewport
/**
 * Properties for the SelectViewport component.
 */
export interface SelectViewportProps extends BaseProps {
  /**
   * Will add `nonce` attribute to the style tag which can be used by Content Security Policy. <br> If omitted, inherits
   * globally from `ConfigProvider`.
   */
  nonce?: string;
}

// SelectGroup
/**
 * Properties for the SelectGroup component.
 */
export interface SelectGroupProps extends Omit<BaseProps, 'onSelect'> {}

// SelectGroupLabel
/**
 * Properties for the SelectGroupLabel component.
 */
export interface SelectGroupLabelProps extends BaseProps {}

// SelectTrigger
/**
 * Properties for the SelectTrigger component.
 */
export interface SelectTriggerProps extends PopperAnchorProps {
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

// SelectTriggerIcon
/**
 * Properties for the SelectTriggerIcon component.
 */
export interface SelectTriggerIconProps extends BaseProps {}

// SelectItem
/**
 * Properties for the SelectItem component.
 */
export interface SelectItemProps extends Omit<PrimitiveWithBaseProps, 'onSelect'> {
  /** The value given as data when submitted with a `name`. */
  value: DefinedValue;
  /** When `true`, prevents the user from interacting with the item. */
  disabled?: boolean;
  /**
   * Optional text used for typeahead purposes. By default the typeahead behavior will use the `.textContent` of the
   * `SelectItemText` part. Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;
}

/**
 * Type information for SelectItemEvent.
 */
export type SelectItemEvent<T extends DefinedValue = DefinedValue> = CustomEvent<{
  /**
   * Original event.
   */
  originalEvent: PointerEvent | KeyboardEvent;
  /**
   * Value associated with the current item.
   */
  value: T;
}>;
/**
 * Events for the SelectItem component.
 */
export type SelectItemEmits<T extends DefinedValue = DefinedValue> = {
  /** Event handler called when the selecting item. <br> It can be prevented by calling `event.preventDefault`. */
  select: [event: SelectItemEvent<T>];
};

/**
 * Properties for the SelectClear component.
 */
export interface SelectClearProps extends BaseProps {
  /**
   * Aria label for the clear button.
   */
  ariaLabel?: string;
  /**
   * Whether the clear button is disabled.
   */
  disabled?: boolean;
}

// SelectItemText
/**
 * Properties for the SelectItemText component.
 */
export interface SelectItemTextProps extends BaseProps {}

// SelectItemIndicator
/**
 * Properties for the SelectItemIndicator component.
 */
export interface SelectItemIndicatorProps extends PrimitiveWithBaseProps {}

/**
 * Events for the SelectItemAlignedPosition component.
 */
export type SelectItemAlignedPositionEmits = {
  /**
   * Emitted when placed occurs.
   */
  placed: [];
};

/**
 * Option data for the SelectSingle component.
 */
export interface SelectSingleOptionData<T extends DefinedValue = DefinedValue> extends Pick<
  SelectItemProps,
  'disabled' | 'textValue'
> {
  /**
   * Value associated with the current item.
   */
  value: T;
  /**
   * Icon rendered by the component.
   */
  icon?: IconValue;
  /**
   * Label text rendered by the component.
   */
  label: string;
  /**
   * Whether separator.
   */
  separator?: boolean;
}

/**
 * Option data for the SelectGroup component.
 */
export interface SelectGroupOptionData<T extends DefinedValue = DefinedValue> extends Pick<
  SelectSingleOptionData<T>,
  'label' | 'separator'
> {
  /**
   * Items rendered by the component.
   */
  items: SelectSingleOptionData<T>[];
}

/**
 * Option data for the Select component.
 */
export type SelectOptionData<T extends DefinedValue = DefinedValue> =
  | SelectSingleOptionData<T>
  | SelectGroupOptionData<T>;

/**
 * Properties for the SelectCompact component.
 */
export interface SelectCompactProps<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false
> extends SelectRootProps<T, M> {
  /**
   * Items rendered by the component.
   */
  items: SelectOptionData<T>[];
  /**
   * Whether to show an arrow.
   */
  showArrow?: boolean;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: SelectTriggerProps;
  /**
   * Properties forwarded to the trigger icon element.
   */
  triggerIconProps?: SelectTriggerIconProps;
  /**
   * Whether to show the trigger icon.
   *
   * @default true
   */
  showTriggerIcon?: boolean;
  /**
   * Clear label.
   */
  clearLabel?: string;
  /**
   * Properties forwarded to the clear element.
   */
  clearProps?: SelectClearProps;
  /**
   * Placeholder.
   */
  placeholder?: string;
  /**
   * Properties forwarded to the value element.
   */
  valueProps?: SelectValueProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: PortalProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: SelectContentProps;
  /**
   * Placement.
   */
  placement?: PopperPositioningPositionerProps['placement'];
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: SelectPopupProps;
  /**
   * Properties forwarded to the viewport element.
   */
  viewportProps?: SelectViewportProps;
  /**
   * Properties forwarded to the scroll down button element.
   */
  scrollDownButtonProps?: SelectScrollDownButtonProps;
  /**
   * Properties forwarded to the scroll up button element.
   */
  scrollUpButtonProps?: SelectScrollUpButtonProps;
  /**
   * Properties forwarded to the group element.
   */
  groupProps?: SelectGroupProps;
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: SelectGroupLabelProps;
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: SelectItemProps;
  /**
   * Properties forwarded to the item text element.
   */
  itemTextProps?: SelectItemTextProps;
  /**
   * Properties forwarded to the item indicator element.
   */
  itemIndicatorProps?: SelectItemIndicatorProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: SelectSeparatorProps;
  /**
   * Properties forwarded to the arrow element.
   */
  arrowProps?: PopperArrowProps;
}

/**
 * Events for the SelectCompact component.
 */
export type SelectCompactEmits<T extends DefinedValue = DefinedValue, M extends boolean = false> = SelectRootEmits<
  T,
  M
> &
  SelectContentEmits &
  SelectItemEmits<T>;

type SelectCompactModelValue<T extends DefinedValue = DefinedValue, M extends boolean = false> =
  | (M extends true ? T[] : T)
  | undefined;

/**
 * Slot properties for the SelectCompactTriggerValue component.
 */
export interface SelectCompactTriggerValueSlotProps<T extends DefinedValue = DefinedValue, M extends boolean = false> {
  /**
   * Current model value.
   */
  modelValue: SelectCompactModelValue<T, M>;
  /**
   * Selected label exposed in the slot scope.
   */
  selectedLabel: string[];
  /**
   * Slot text exposed in the slot scope.
   */
  slotText: string;
}

/**
 * Slot properties for the SelectCompactGroupLabel component.
 */
export interface SelectCompactGroupLabelSlotProps<T extends DefinedValue = DefinedValue> {
  /**
   * Current item data.
   */
  item: SelectGroupOptionData<T>;
}

/**
 * Slot properties for the SelectCompactItem component.
 */
export interface SelectCompactItemSlotProps<T extends DefinedValue = DefinedValue> {
  /**
   * Current item data.
   */
  item: SelectSingleOptionData<T>;
}

/**
 * Slots for the SelectCompact component.
 */
export type SelectCompactSlots<T extends DefinedValue = DefinedValue, M extends boolean = false> = {
  /**
   * Custom content rendered at the top of the popup, fixed above the scrollable list.
   */
  top?: () => any;
  /**
   * Custom content rendered at the bottom of the popup, fixed below the scrollable list.
   */
  bottom?: () => any;
  /**
   * Custom content for the trigger leading slot.
   */
  'trigger-leading'?: () => any;
  /**
   * Custom content for the trigger value slot.
   */
  'trigger-value'?: (props: SelectCompactTriggerValueSlotProps<T, M>) => any;
  /**
   * Custom content for the trigger trailing slot.
   */
  'trigger-trailing'?: () => any;
  /**
   * Custom content for the trigger icon slot.
   */
  'trigger-icon'?: () => any;
  /**
   * Custom content for the scroll up button slot.
   */
  'scroll-up-button'?: () => any;
  /**
   * Custom content for the scroll down button slot.
   */
  'scroll-down-button'?: () => any;
  /**
   * Custom content for the group label slot.
   */
  'group-label'?: (props: SelectCompactGroupLabelSlotProps<T>) => any;
  /**
   * Custom content for the item text slot.
   */
  'item-text'?: (props: SelectCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: SelectCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: SelectCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item indicator slot.
   */
  'item-indicator'?: (props: SelectCompactItemSlotProps<T>) => any;
};

// SelectValue
/**
 * Properties for the SelectValue component.
 */
export interface SelectValueProps extends BaseProps {
  /** The content that will be rendered inside the `SelectValue` when no `value` or `defaultValue` is set. */
  placeholder?: string;
}

// SelectSeparator
/**
 * Properties for the SelectSeparator component.
 */
export interface SelectSeparatorProps extends BaseProps {}

// SelectScrollButtonImpl
/**
 * Properties for the SelectScrollButtonImpl component.
 */
export interface SelectScrollButtonImplProps extends ButtonProps {}

/**
 * Events for the SelectScrollButtonImpl component.
 */
export type SelectScrollButtonImplEmits = {
  /**
   * Emitted when auto scroll occurs.
   */
  autoScroll: [];
};

// SelectScrollDownButton
/**
 * Properties for the SelectScrollDownButton component.
 */
export interface SelectScrollDownButtonProps extends SelectScrollButtonImplProps {}

// SelectScrollUpButton
/**
 * Properties for the SelectScrollUpButton component.
 */
export interface SelectScrollUpButtonProps extends SelectScrollButtonImplProps {}

// BubbleSelect
/**
 * Properties for the SelectBubbleSelect component.
 */
export interface SelectBubbleSelectProps {
  /**
   * Autocomplete.
   */
  autocomplete?: string;
  /**
   * Whether autofocus.
   */
  autofocus?: boolean;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Form.
   */
  form?: string;
  /**
   * Whether multiple values are supported.
   */
  multiple?: boolean;
  /**
   * Name.
   */
  name?: string;
  /**
   * Whether the value is required.
   */
  required?: boolean;
  /**
   * Visual size of the component.
   */
  size?: number;
  /**
   * Value associated with the current item.
   */
  value?: any;
}

/**
 * Parameters used to create the SelectRoot context.
 */
export interface SelectRootContextParams extends ToContext<
  SelectRootProps,
  'dir' | 'autocomplete' | 'disabled' | 'required' | 'clearable'
> {
  /**
   * Whether the component is open.
   */
  open: ShallowRef<boolean | undefined>;
  /**
   * Current model value.
   */
  modelValue: ShallowRef<MaybeArray<DefinedValue> | undefined>;
  /**
   * Handler used to update the model value.
   */
  onModelValueChange: (value: DefinedValue) => void;
  /**
   * Whether multiple values are supported.
   */
  isMultiple: ComputedRef<boolean>;
  /**
   * Whether the model value is empty.
   */
  isEmptyModelValue: ComputedRef<boolean>;
  /**
   * Resets the model value to empty.
   */
  resetModelValue: () => void;
}

/**
 * Parameters used to create the SelectContent context.
 */
export interface SelectContentContextParams
  extends ToContext<SelectContentProps, 'position'>, Pick<SelectRootContextParams, 'modelValue' | 'isMultiple'> {
  /**
   * Search used by the component context.
   */
  search: ShallowRef<string>;
  /**
   * Popup element used by the component context.
   */
  popupElement: ShallowRef<HTMLElement | undefined>;
}

/**
 * Context for the SelectItemAlignedPosition component.
 */
export interface SelectItemAlignedPositionContext {
  /**
   * Positioner element used by the component context.
   */
  positionerElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Whether the component should expand on scroll.
   */
  shouldExpandOnScroll: ShallowRef<boolean>;
  /**
   * Callback invoked when the scroll button changes.
   */
  onScrollButtonChange: (node: HTMLElement | undefined) => void;
}

/**
 * Parameters used to create the SelectItem context.
 */
export interface SelectItemContextParams extends ToContext<SelectItemProps, 'textValue' | 'disabled'> {
  /**
   * Value associated with the current item.
   */
  value: DefinedValue;
  /**
   * Whether a selected.
   */
  isSelected: ComputedRef<boolean>;
}

/**
 * Type information for SelectItemCollectionItemData.
 */
export interface SelectItemCollectionItemData {
  /**
   * Text value.
   */
  textValue: string;
}

// Theme Context
/**
 * Available UI slots for the Select component.
 */
export type SelectUiSlot =
  | 'trigger'
  | 'triggerIcon'
  | 'value'
  | 'clear'
  | 'positioner'
  | 'popup'
  | 'viewport'
  | 'group'
  | 'groupLabel'
  | 'item'
  | 'itemText'
  | 'itemIndicator'
  | 'separator'
  | 'scrollUpButton'
  | 'scrollDownButton'
  | 'arrow';

/**
 * UI class overrides for the Select component.
 */
export type SelectUi = UiClass<SelectUiSlot>;

export type { PopperArrowProps as SelectArrowProps } from '../popper/types';
export type { PortalProps as SelectPortalProps } from '../portal/types';
