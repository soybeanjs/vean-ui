import type { ShallowRef } from 'vue';
import type { UseFuseOptions, CollectionItemData } from '../../composables';
import type { BaseProps, Direction, FormFieldCommonProps } from '../../types';
import type { IconValue } from '../_icon/types';
import type {
  ComboboxAnchorProps,
  ComboboxContentEmits,
  ComboboxContentProps,
  ComboboxGroupLabelProps,
  ComboboxGroupProps,
  ComboboxItemEmits,
  ComboboxItemIndicatorProps,
  ComboboxItemProps,
  ComboboxSeparatorProps,
  ComboboxTriggerProps,
  ComboboxViewportProps,
  ComboboxUiSlot as AutocompleteUiSlot,
  ComboboxUi as AutocompleteUi
} from '../combobox/types';
import type { InputControlProps, InputRootEmits as AutocompleteInputEmits, InputRootProps } from '../input/types';
import type { ListboxCollectionItemData } from '../listbox/types';
import type { PortalProps as AutocompletePortalProps } from '../portal/types';

/**
 * Properties for the AutocompleteAnchor component.
 */
export interface AutocompleteAnchorProps extends ComboboxAnchorProps {}

/**
 * Properties for the AutocompleteTrigger component.
 */
export interface AutocompleteTriggerProps extends ComboboxTriggerProps {}

/**
 * Properties for the AutocompleteContent component.
 */
export interface AutocompleteContentProps extends ComboboxContentProps {}

/**
 * Events for the AutocompleteContent component.
 */
export type AutocompleteContentEmits = ComboboxContentEmits;

/**
 * Properties for the AutocompleteViewport component.
 */
export interface AutocompleteViewportProps extends ComboboxViewportProps {}

/**
 * Properties for the AutocompleteGroup component.
 */
export interface AutocompleteGroupProps extends ComboboxGroupProps {}

/**
 * Properties for the AutocompleteGroupLabel component.
 */
export interface AutocompleteGroupLabelProps extends ComboboxGroupLabelProps {}

/**
 * Properties for the AutocompleteItem component.
 */
export interface AutocompleteItemProps extends ComboboxItemProps {}

/**
 * Events for the AutocompleteItem component.
 */
export type AutocompleteItemEmits = ComboboxItemEmits;

/**
 * Properties for the AutocompleteItemIndicator component.
 */
export interface AutocompleteItemIndicatorProps extends ComboboxItemIndicatorProps {}

/**
 * Properties for the AutocompleteSeparator component.
 */
export interface AutocompleteSeparatorProps extends ComboboxSeparatorProps {}

/**
 * Properties for the AutocompleteRoot component.
 */
export interface AutocompleteRootProps extends FormFieldCommonProps, BaseProps {
  /** The controlled value of the autocomplete input. */
  modelValue?: string;
  /** The value of the autocomplete input when initially rendered. */
  defaultValue?: string;
  /** The controlled open state of the autocomplete popup. */
  open?: boolean;
  /** The open state of the autocomplete popup when initially rendered. */
  defaultOpen?: boolean;
  /** The reading direction of the autocomplete when applicable. */
  dir?: Direction;
  /** When `true`, prevents the user from interacting with autocomplete. */
  disabled?: boolean;
  /** When `true`, hover over item will trigger highlight. */
  highlightOnHover?: boolean;
  /** Whether to open the autocomplete when the input is focused. */
  openOnFocus?: boolean;
  /** Whether to open the autocomplete when the input is clicked. */
  openOnClick?: boolean;
  /** When `true`, clearing the search term also resets `modelValue` to an empty string. */
  resetModelValueOnClear?: boolean;
}

/**
 * Type information for AutocompleteHighlightPayload.
 */
export type AutocompleteHighlightPayload = CollectionItemData<ListboxCollectionItemData>;

/**
 * Events for the AutocompleteRoot component.
 */
export type AutocompleteRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when the open state changes.
   */
  'update:open': [value: boolean];
  /**
   * Emitted when highlight occurs.
   */
  highlight: [payload?: AutocompleteHighlightPayload];
};

/**
 * Context for the AutocompleteRoot component.
 */
export interface AutocompleteRootContext {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string | undefined>;
}

/**
 * Properties for the AutocompleteInput component.
 */
export interface AutocompleteInputProps extends Omit<InputRootProps, 'defaultValue' | 'modelValue'> {
  /**
   * Input ref.
   */
  inputRef?: (el: HTMLInputElement) => void;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: InputControlProps;
}

/**
 * Option data for the AutocompleteSingle component.
 */
export interface AutocompleteSingleOptionData extends Pick<AutocompleteItemProps, 'disabled' | 'value'> {
  /** Display label in the option list. */
  label?: string;
  /** Icon displayed before the option text. */
  icon?: IconValue;
  /** Additional keywords used for filtering. */
  keywords?: string[];
  /** Whether to show a separator after this option. */
  separator?: boolean;
}

/**
 * Option data for the AutocompleteGroup component.
 */
export interface AutocompleteGroupOptionData<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData> {
  /** Group label in the option list. */
  label: string;
  /** Whether to show a separator after this group. */
  separator?: boolean;
  /**
   * Items rendered by the component.
   */
  items: T[];
}

/**
 * Option data for the Autocomplete component.
 */
export type AutocompleteOptionData<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData> =
  | T
  | AutocompleteGroupOptionData<T>;

/**
 * Option data for the AutocompleteSearch component.
 */
export interface AutocompleteSearchOptionData extends AutocompleteSingleOptionData {
  /**
   * Group label.
   */
  groupLabel?: string;
  /**
   * Group value.
   */
  groupValue?: string;
  /**
   * Whether group separator.
   */
  groupSeparator?: boolean;
}

/**
 * Properties for the AutocompleteCompact component.
 */
export interface AutocompleteCompactProps<
  T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData
> extends Omit<AutocompleteRootProps, 'defaultValue' | 'modelValue' | 'onSelect'> {
  /** The controlled value of the autocomplete input. */
  modelValue?: string;
  /** The initial value of the autocomplete input. */
  defaultValue?: string;
  /**
   * Items rendered by the component.
   */
  items: AutocompleteOptionData<T>[];
  /**
   * Placeholder.
   */
  placeholder?: string;
  /**
   * Whether clearable.
   */
  clearable?: boolean;
  /**
   * Clear label.
   */
  clearLabel?: string;
  /**
   * Empty label.
   */
  emptyLabel?: string;
  /**
   * Fuse options.
   */
  fuseOptions?: UseFuseOptions<AutocompleteSearchOptionData>;
  /**
   * Properties forwarded to the anchor element.
   */
  anchorProps?: AutocompleteAnchorProps;
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: AutocompleteInputProps;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: AutocompleteTriggerProps;
  /**
   * Properties forwarded to the portal element.
   */
  portalProps?: AutocompletePortalProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: AutocompleteContentProps;
  /**
   * Properties forwarded to the viewport element.
   */
  viewportProps?: AutocompleteViewportProps;
  /**
   * Properties forwarded to the group element.
   */
  groupProps?: AutocompleteGroupProps;
  /**
   * Properties forwarded to the group label element.
   */
  groupLabelProps?: AutocompleteGroupLabelProps;
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: Omit<AutocompleteItemProps, 'disabled' | 'value'>;
  /**
   * Properties forwarded to the item indicator element.
   */
  itemIndicatorProps?: AutocompleteItemIndicatorProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: AutocompleteSeparatorProps;
}

/**
 * Events for the AutocompleteCompact component.
 */
export type AutocompleteCompactEmits<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData> =
  AutocompleteRootEmits & {
    /**
     * Emitted when select occurs.
     */
    select: [item: T];
  };

/**
 * Slots for the AutocompleteCompact component.
 */
export type AutocompleteCompactSlots<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData> = {
  /**
   * Custom content for the input leading slot.
   */
  'input-leading'?: () => any;
  /**
   * Custom content for the input trailing slot.
   */
  'input-trailing'?: () => any;
  /**
   * Custom content for the trigger icon slot.
   */
  'trigger-icon'?: () => any;
  /**
   * Custom content for the empty slot.
   */
  empty?: () => any;
  /**
   * Custom content for the group label slot.
   */
  'group-label'?: (props: { item: Extract<AutocompleteOptionData<T>, { items: T[] }> }) => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: { item: T }) => any;
  /**
   * Custom content for the item text slot.
   */
  'item-text'?: (props: { item: T }) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: { item: T }) => any;
  /**
   * Custom content for the item indicator slot.
   */
  'item-indicator'?: (props: { item: T }) => any;
};

export type { AutocompleteInputEmits, AutocompletePortalProps, AutocompleteUiSlot, AutocompleteUi };
