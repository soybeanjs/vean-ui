import type { ComputedRef, ShallowRef, InputHTMLAttributes } from 'vue';
import type { CollectionItemData } from '../../composables';
import type { BaseProps, Direction, FormFieldCommonProps, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { InputBaseProps } from '../input/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the TagsInputRoot component.
 */
export interface TagsInputRootProps extends InputBaseProps, FormFieldCommonProps, Omit<BaseProps, 'onInvalid'> {
  /** The reading direction of the tags input. */
  dir?: Direction;
  /** The controlled value of the tags input. */
  modelValue?: string[];
  /** The uncontrolled default value of the tags input. */
  defaultValue?: string[];
  /** Whether to add tags on paste. */
  addOnPaste?: boolean;
  /** Whether to add tags on tab. */
  addOnTab?: boolean;
  /** Whether to add tags on blur. */
  addOnBlur?: boolean;
  /** Whether to allow duplicated tags. */
  duplicate?: boolean;
  /** The delimiter used to add tags. */
  delimiter?: string | RegExp;
  /** Maximum number of tags. Set to 0 for unlimited. */
  max?: number;
  /**
   * Display the value of the tag. Useful when you want to apply modifications to the value like adding a suffix
   *
   * @default "(value: string) => value"
   */
  displayValue?: (value: string) => string;
}

/**
 * Events for the TagsInputRoot component.
 */
export type TagsInputRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string[]];
  /**
   * Emitted when invalid occurs.
   */
  invalid: [value: string];
  /**
   * Emitted when add tag occurs.
   */
  addTag: [value: string];
  /**
   * Emitted when remove tag occurs.
   */
  removeTag: [value: string];
};

/**
 * Properties for the TagsInputControl component.
 */
export interface TagsInputControlProps extends BaseProps<InputHTMLAttributes> {}

/**
 * Properties for the TagsInputItem component.
 */
export interface TagsInputItemProps extends PrimitiveWithBaseProps {
  /**
   * Value associated with the tag.
   */
  value: string;
  /** Whether to disable the tag item. */
  disabled?: boolean;
}

/**
 * Properties for the TagsInputItemText component.
 */
export interface TagsInputItemTextProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the TagsInputItemDelete component.
 */
export interface TagsInputItemDeleteProps extends ButtonProps {}

/**
 * Properties for the TagsInputClear component.
 */
export interface TagsInputClearProps extends ButtonProps {}

/**
 * Properties for the TagsInputCompact component.
 */
export interface TagsInputCompactProps extends TagsInputRootProps {
  /** Whether to render the clear trigger. */
  clearable?: boolean;
  /** Props forwarded to the input element. */
  controlProps?: TagsInputControlProps;
  /** Props forwarded to the clear element. */
  clearProps?: TagsInputClearProps;
  /** Props forwarded to the item element. */
  itemProps?: TagsInputItemProps;
  /** Props forwarded to the item text element. */
  itemTextProps?: TagsInputItemTextProps;
  /** Props forwarded to the item delete element. */
  itemDeleteProps?: TagsInputItemDeleteProps;
}

/**
 * Events for the TagsInputCompact component.
 */
export type TagsInputCompactEmits = TagsInputRootEmits;

/**
 * Slot properties for item-related compact slots.
 */
export interface TagsInputCompactSlotProps {
  /** Value associated with the current item. */
  value: string;
  /** Current item index. */
  index: number;
  /** Current item display value. */
  displayedValue: string;
  /** Delete handler for the current item. */
  onDelete: () => void;
  /** Clear handler for the current item. */
  onClear: () => void;
}

/**
 * Slots for the TagsInputCompact component.
 */
export type TagsInputCompactSlots = {
  /** Custom item content or full item replacement. */
  item?: (props: TagsInputCompactSlotProps) => any;
};

/**
 * Type information for TagsInputCollectionItemData.
 */
export type TagsInputCollectionItemData = {
  /**
   * Value associated with the current item.
   */
  value: string;
};

/**
 * Context for the TagsInputRoot component.
 */
export interface TagsInputRootContext extends ToContext<
  TagsInputRootProps,
  | 'id'
  | 'autofocus'
  | 'disabled'
  | 'maxlength'
  | 'minlength'
  | 'pattern'
  | 'placeholder'
  | 'readonly'
  | 'addOnPaste'
  | 'addOnTab'
  | 'addOnBlur'
  | 'disabled'
  | 'delimiter'
  | 'max'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string[]>;
  /**
   * Selected element used by the component context.
   */
  selectedElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Whether an invalid input.
   */
  isInvalidInput: ShallowRef<boolean>;
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Callback invoked when the add value event fires.
   */
  onAddValue: (value: string) => boolean;
  /**
   * Callback invoked when the remove value event fires.
   */
  onRemoveValue: (index: number) => void;
  /**
   * Callback invoked when the input keydown event fires.
   */
  onInputKeydown: (event: KeyboardEvent) => void;
  /**
   * Callback invoked when the clear event fires.
   */
  onClear: () => void;
  /**
   * Get items used by the component context.
   */
  getItems: () => CollectionItemData<TagsInputCollectionItemData>[];
  /**
   * Get display value used by the component context
   */
  displayValue: (value: string) => string;
}

/**
 * Context for the TagsInputItem component.
 */
export interface TagsInputItemContext {
  /**
   * Value associated with the current item.
   */
  value: ComputedRef<string>;
  /**
   * Display value used by the component context.
   */
  displayedValue: ComputedRef<string>;
  /**
   * Whether a selected.
   */
  isSelected: ComputedRef<boolean>;
  /**
   * Whether the component is disabled.
   */
  disabled: ComputedRef<boolean>;
  /**
   * Item element used by the component context.
   */
  itemElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Text id used by the component context.
   */
  textId: ShallowRef<string>;
  /**
   * Callback invoked when the delete event fires.
   */
  onDelete: () => void;
}

/**
 * Available UI slots for the TagsInput component.
 */
export type TagsInputUiSlot = 'root' | 'item' | 'itemText' | 'itemDelete' | 'control' | 'clear';

/**
 * UI class overrides for the TagsInput component.
 */
export type TagsInputUi = UiClass<TagsInputUiSlot>;
