import type { ComputedRef, ShallowRef } from 'vue';
import type { EventHookOn } from '@vueuse/core';
import type {
  BaseProps,
  DismissableLayerEmits,
  DismissableLayerProps,
  FocusScopeEmits,
  ForceMountProps,
  MaybeArray,
  ToContext,
  TrapFocusProps,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type {
  ListboxFilterEmits,
  ListboxFilterProps,
  ListboxRootEmits,
  ListboxRootProps,
  ListboxItemProps,
  ListboxItemEmits,
  ListboxGroupProps as ComboboxGroupProps,
  ListboxGroupLabelProps,
  ListboxItemIndicatorProps,
  ListboxVirtualizerProps
} from '../listbox/types';
import type {
  PopperAnchorProps,
  PopperArrowProps as ComboboxArrowProps,
  PopperPositioningPopupProps,
  PopperPositioningPositionerEmits,
  PopperPositioningPositionerProps,
  PopperUiSlot
} from '../popper/types';
import type { PortalProps } from '../portal/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the ComboboxRoot component.
 */
export interface ComboboxRootProps<M extends boolean = false> extends Omit<
  ListboxRootProps<M>,
  'orientation' | 'selectionBehavior'
> {
  /** The controlled open state of the Combobox. Can be bound with `v-model:open`. */
  open?: boolean;
  /** The open state of the combobox when it is initially rendered. <br> Use when you do not need to control its open state. */
  defaultOpen?: boolean;
  /**
   * Whether to reset the searchTerm when the Combobox input blurred
   * @defaultValue `true`
   */
  resetSearchTermOnBlur?: boolean;
  /**
   * Whether to reset the searchTerm when the Combobox value is selected
   * @defaultValue `true`
   */
  resetSearchTermOnSelect?: boolean;
  /**
   * Whether to open the combobox when the input is focused
   * @defaultValue `false`
   */
  openOnFocus?: boolean;
  /**
   * Whether to open the combobox when the input is clicked
   * @defaultValue `false`
   */
  openOnClick?: boolean;
  /**
   * When `true`, disable the default filters
   */
  ignoreFilter?: boolean;
}

/**
 * Events for the ComboboxRoot component.
 */
export type ComboboxRootEmits<M extends boolean = false> = Pick<
  ListboxRootEmits<M>,
  'update:modelValue' | 'highlight'
> & {
  /**
   * Emitted when the open state changes.
   */
  'update:open': [value: boolean];
};

/**
 * Properties for the ComboboxAnchor component.
 */
export interface ComboboxAnchorProps extends PopperAnchorProps {}

/**
 * Properties for the ComboboxGroupLabel component.
 */
export interface ComboboxGroupLabelProps extends ListboxGroupLabelProps {}

/**
 * Properties for the ComboboxItemIndicator component.
 */
export interface ComboboxItemIndicatorProps extends ListboxItemIndicatorProps {}

/**
 * Properties for the ComboboxTrigger component.
 */
export interface ComboboxTriggerProps extends PrimitiveWithBaseProps {
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

/**
 * Properties for the ComboboxContentImpl component.
 */
export interface ComboboxContentImplProps
  extends PopperPositioningPositionerProps, TrapFocusProps, DismissableLayerProps, ForceMountProps {
  /**
   * Position.
   */
  position?: 'inline' | 'popper';
  /**
   * Whether body lock.
   */
  bodyLock?: boolean;
  /**
   * Whether hide when empty.
   */
  hideWhenEmpty?: boolean;
  /**
   * Properties forwarded to the popup element.
   */
  popupProps?: PopperPositioningPopupProps;
}

/**
 * Events for the ComboboxContentImpl component.
 */
export type ComboboxContentImplEmits = DismissableLayerEmits & FocusScopeEmits & PopperPositioningPositionerEmits;

/**
 * Properties for the ComboboxContent component.
 */
export interface ComboboxContentProps extends ComboboxContentImplProps {}

/**
 * Events for the ComboboxContent component.
 */
export type ComboboxContentEmits = ComboboxContentImplEmits;

/**
 * Properties for the ComboboxInput component.
 */
export interface ComboboxInputProps extends ListboxFilterProps {
  /**
   * Display value.
   */
  displayValue?: (value: MaybeArray<string> | undefined) => string;
}

/**
 * Events for the ComboboxInput component.
 */
export type ComboboxInputEmits = ListboxFilterEmits;

/**
 * Properties for the ComboboxViewport component.
 */
export interface ComboboxViewportProps extends BaseProps {
  /**
   * Nonce.
   */
  nonce?: string;
}

/**
 * Properties for the ComboboxItem component.
 */
export interface ComboboxItemProps extends ListboxItemProps {
  /**
   * Text value.
   */
  textValue?: string;
}

/**
 * Events for the ComboboxItem component.
 */
export type ComboboxItemEmits = ListboxItemEmits;

/**
 * Properties for the ComboboxEmpty component.
 */
export interface ComboboxEmptyProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ComboboxSeparator component.
 */
export interface ComboboxSeparatorProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ComboboxCancel component.
 */
export interface ComboboxCancelProps extends PrimitiveWithBaseProps {
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

/**
 * Properties for the ComboboxClear component.
 */
export interface ComboboxClearProps {
  /**
   * Aria label for the clear button.
   */
  ariaLabel?: string;
  /**
   * Whether the clear button is disabled.
   */
  disabled?: boolean;
}

/**
 * Properties for the ComboboxValue component.
 */
export interface ComboboxValueProps extends PrimitiveWithBaseProps {
  /**
   * Items used to resolve selected labels.
   */
  items?: ComboboxOptionData[];
  /**
   * Placeholder rendered when no value is selected.
   */
  placeholder?: string;
  /**
   * Separator used to join multiple selected labels.
   * @defaultValue `', '`
   */
  separator?: string;
}

/**
 * Properties for the ComboboxVirtualizer component.
 */
export interface ComboboxVirtualizerProps extends ListboxVirtualizerProps {}

/**
 * Option data for the ComboboxSingle component.
 */
export interface ComboboxSingleOptionData extends Pick<ComboboxItemProps, 'disabled' | 'textValue'> {
  /**
   * Value associated with the current item.
   */
  value: string;
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
 * Option data for the ComboboxGroup component.
 */
export interface ComboboxGroupOptionData extends Pick<ComboboxSingleOptionData, 'label' | 'separator'> {
  /**
   * Items rendered by the component.
   */
  items: ComboboxSingleOptionData[];
}

/**
 * Option data for the Combobox component.
 */
export type ComboboxOptionData = ComboboxSingleOptionData | ComboboxGroupOptionData;

/**
 * Properties for the ComboboxCompact component.
 */
export interface ComboboxCompactProps<M extends boolean = false> extends ComboboxRootProps<M> {
  /**
   * Items rendered by the component.
   */
  items: ComboboxOptionData[];
  /**
   * Placeholder.
   */
  placeholder?: string;
  /**
   * Search placeholder.
   */
  searchPlaceholder?: string;
  /**
   * Clear label.
   */
  clearLabel?: string;
  /**
   * Empty label.
   */
  emptyLabel?: string;
  /**
   * Properties forwarded to the anchor element.
   */
  anchorProps?: ComboboxAnchorProps;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: ComboboxTriggerProps;
  /**
   * Properties forwarded to the cancel element.
   */
  cancelProps?: ComboboxCancelProps;
  /**
   * Properties forwarded to the value element.
   */
  valueProps?: ComboboxValueProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: PortalProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: ComboboxContentProps;
  /**
   * Properties forwarded to the viewport element.
   */
  viewportProps?: ComboboxViewportProps;
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: ComboboxInputProps;
  /**
   * Properties forwarded to the empty element.
   */
  emptyProps?: ComboboxEmptyProps;
  /**
   * Properties forwarded to the group element.
   */
  groupProps?: ComboboxGroupProps;
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: ComboboxGroupLabelProps;
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: ComboboxItemProps;
  /**
   * Properties forwarded to the item indicator element.
   */
  itemIndicatorProps?: ComboboxItemIndicatorProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: ComboboxSeparatorProps;
}

/**
 * Events for the ComboboxCompact component.
 */
export type ComboboxCompactEmits<M extends boolean = false> = ComboboxRootEmits<M> &
  ComboboxContentEmits &
  ComboboxItemEmits;

type ComboboxCompactModelValue<M extends boolean = false> = (M extends true ? string[] : string) | undefined;

/**
 * Slot properties for the ComboboxCompactTriggerValue component.
 */
export interface ComboboxCompactTriggerValueSlotProps<M extends boolean = false> {
  /**
   * Current model value.
   */
  modelValue: ComboboxCompactModelValue<M>;
  /**
   * Selected labels exposed in the slot scope.
   */
  selectedLabels: string[];
  /**
   * Slot text exposed in the slot scope.
   */
  slotText: string | undefined;
}

/**
 * Slot properties for the ComboboxCompactInput component.
 */
export interface ComboboxCompactInputSlotProps {
  /**
   * Clear exposed in the slot scope.
   */
  clear: () => void;
}

/**
 * Slot properties for the ComboboxCompactGroupLabel component.
 */
export interface ComboboxCompactGroupLabelSlotProps {
  /**
   * Current item data.
   */
  item: ComboboxGroupOptionData;
}

/**
 * Slot properties for the ComboboxCompactItem component.
 */
export interface ComboboxCompactItemSlotProps {
  /**
   * Current item data.
   */
  item: ComboboxSingleOptionData;
}

/**
 * Slots for the ComboboxCompact component.
 */
export type ComboboxCompactSlots<M extends boolean = false> = {
  /**
   * Custom content for the trigger leading slot.
   */
  'trigger-leading'?: () => any;
  /**
   * Custom content for the trigger value slot.
   */
  'trigger-value'?: (props: ComboboxCompactTriggerValueSlotProps<M>) => any;
  /**
   * Custom content for the trigger trailing slot.
   */
  'trigger-trailing'?: () => any;
  /**
   * Custom content for the trigger icon slot.
   */
  'trigger-icon'?: () => any;
  /**
   * Custom content for the input leading slot.
   */
  'input-leading'?: (props: ComboboxCompactInputSlotProps) => any;
  /**
   * Custom content for the input trailing slot.
   */
  'input-trailing'?: (props: ComboboxCompactInputSlotProps) => any;
  /**
   * Custom content for the empty slot.
   */
  empty?: () => any;
  /**
   * Custom content for the group label slot.
   */
  'group-label'?: (props: ComboboxCompactGroupLabelSlotProps) => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: ComboboxCompactItemSlotProps) => any;
  /**
   * Custom content for the item text slot.
   */
  'item-text'?: (props: ComboboxCompactItemSlotProps) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: ComboboxCompactItemSlotProps) => any;
  /**
   * Custom content for the item indicator slot.
   */
  'item-indicator'?: (props: ComboboxCompactItemSlotProps) => any;
};

/**
 * Context for the ComboboxRoot component.
 */
export interface ComboboxRootContext extends ToContext<
  ComboboxRootProps,
  | 'dir'
  | 'disabled'
  | 'ignoreFilter'
  | 'resetSearchTermOnBlur'
  | 'resetSearchTermOnSelect'
  | 'openOnFocus'
  | 'openOnClick'
> {
  /**
   * Whether multiple values are supported.
   */
  isMultiple: ComputedRef<boolean | undefined>;
  /**
   * Current model value.
   */
  modelValue: ShallowRef<MaybeArray<string>>;
  /**
   * Handler used to update the model value.
   */
  onModelValueChange: (value: string) => void;
  /**
   * Reset model value used by the component context.
   */
  resetModelValue: () => void;
  /**
   * Whether the component is open.
   */
  open: ShallowRef<boolean>;
  /**
   * Callback invoked when the open changes.
   */
  onOpenChange: (value: boolean) => Promise<void> | void;
  /**
   * Whether an user inputted.
   */
  isUserInputted: ShallowRef<boolean>;
  /**
   * Whether virtualization is enabled.
   */
  isVirtual: ShallowRef<boolean>;
  /**
   * Parent element used by the component context.
   */
  parentElement: ComputedRef<HTMLElement | undefined>;
  /**
   * Content id used by the component context.
   */
  contentId: ShallowRef<string>;
  /**
   * Init content id used by the component context.
   */
  initContentId: () => void;
  /**
   * Input element used by the component context.
   */
  inputElement: ShallowRef<HTMLInputElement | undefined>;
  /**
   * Callback invoked when the input element changes.
   */
  onInputElementChange: (node: HTMLInputElement) => void;
  /**
   * Trigger element used by the component context.
   */
  triggerElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Callback invoked when the trigger element changes.
   */
  onTriggerElementChange: (node: HTMLElement) => void;
  /**
   * Popup element used by the component context.
   */
  popupElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Callback invoked when the popup element changes.
   */
  onPopupElementChange: (node: HTMLElement) => void;
  /**
   * Highlighted element used by the component context.
   */
  highlightedElement: ComputedRef<HTMLElement | null | undefined>;
  /**
   * Callback invoked when the reset search term event fires.
   */
  onResetSearchTerm: EventHookOn<undefined>;
  /**
   * Filter search used by the component context.
   */
  filterSearch: ShallowRef<string>;
  /**
   * All items used by the component context.
   */
  allItems: ShallowRef<Map<string, string>>;
  /**
   * All groups used by the component context.
   */
  allGroups: ShallowRef<Map<string, Set<string>>>;
  /**
   * Filter state used by the component context.
   */
  filterState: ComputedRef<{
    count: number;
    items: Map<string, number>;
    groups: Set<string>;
  }>;
}

/**
 * Available UI slots for the Combobox component.
 */
export type ComboboxUiSlot =
  | PopperUiSlot
  | 'root'
  | 'trigger'
  | 'value'
  | 'triggerIcon'
  | 'clear'
  | 'cancel'
  | 'viewport'
  | 'inputRoot'
  | 'inputControl'
  | 'group'
  | 'groupLabel'
  | 'item'
  | 'itemIndicator'
  | 'empty'
  | 'separator'
  | 'virtualizer';

/**
 * UI class overrides for the Combobox component.
 */
export type ComboboxUi = UiClass<ComboboxUiSlot>;

export type { ComboboxArrowProps, ComboboxGroupProps };
