import type { ComputedRef, ShallowRef } from 'vue';
import type { Direction, FormFieldCommonProps, ToContext, UiClass, VNodeRef } from '../../types';
import type { ButtonProps } from '../button/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Type information for EditableActivationMode.
 */
export type EditableActivationMode = 'focus' | 'dblclick' | 'none';

/**
 * Type information for EditableSubmitMode.
 */
export type EditableSubmitMode = 'blur' | 'enter' | 'none' | 'both';

/**
 * State values for EditableEventState.
 */
export type EditableEventState = 'edit' | 'submit' | 'cancel';

/**
 * State values for EditableViewState.
 */
export type EditableViewState = 'preview' | 'edit';

/**
 * Type information for EditablePlaceholder.
 */
export interface EditablePlaceholder {
  /**
   * Edit.
   */
  edit?: string;
  /**
   * Preview.
   */
  preview?: string;
}

/**
 * Properties for the EditableRoot component.
 */
export interface EditableRootProps
  extends FormFieldCommonProps, Omit<PrimitiveWithBaseProps, 'onSubmit' | 'placeholder'> {
  /** The default value of the editable field. */
  defaultValue?: string;
  /** The controlled value of the editable field. */
  modelValue?: string;
  /** The placeholder for the editable field. */
  placeholder?: string | EditablePlaceholder;
  /** The reading direction of the editable field when applicable. */
  dir?: Direction;
  /** When `true`, prevents the user from interacting with the editable field. */
  disabled?: boolean;
  /** When `true`, prevents the user from editing the value. */
  readonly?: boolean;
  /** The activation event of the editable field. */
  activationMode?: EditableActivationMode;
  /** Whether to select the text in the input when it is focused. */
  selectOnFocus?: boolean;
  /** The submit event of the editable field. */
  submitMode?: EditableSubmitMode;
  /** Whether to start with the edit mode active. */
  startWithEditMode?: boolean;
  /** The maximum number of characters allowed. */
  maxLength?: number;
  /** Whether the editable field should auto resize. */
  autoResize?: boolean;
  /** The id of the field. */
  id?: string;
}

/**
 * Events for the EditableRoot component.
 */
export type EditableRootEmits = {
  /** Event handler called whenever the model value changes. */
  'update:modelValue': [value: string];
  /** Event handler called when a value is submitted. */
  submit: [value: string];
  /** Event handler called when the editable field changes state. */
  'update:state': [state: EditableEventState];
};

/**
 * Properties for the EditableArea component.
 */
export interface EditableAreaProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the EditablePreview component.
 */
export interface EditablePreviewProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the EditableInput component.
 */
export interface EditableInputProps extends Omit<PrimitiveWithBaseProps, 'id'> {
  /**
   * Id.
   */
  id?: string;
}

/**
 * Properties for the EditableEditTrigger component.
 */
export interface EditableEditTriggerProps extends ButtonProps {}

/**
 * Properties for the EditableSubmitTrigger component.
 */
export interface EditableSubmitTriggerProps extends ButtonProps {}

/**
 * Properties for the EditableCancelTrigger component.
 */
export interface EditableCancelTriggerProps extends ButtonProps {}

/**
 * Parameters used to create the EditableRoot context.
 */
export interface EditableRootContextParams extends ToContext<
  EditableRootProps,
  | 'id'
  | 'name'
  | 'maxLength'
  | 'disabled'
  | 'readonly'
  | 'activationMode'
  | 'submitMode'
  | 'selectOnFocus'
  | 'startWithEditMode'
  | 'dir'
  | 'required'
  | 'autoResize'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string | undefined>;
  /**
   * Input value used by the component context.
   */
  inputValue: ShallowRef<string | undefined>;
  /**
   * Placeholder used by the component context.
   */
  placeholder: ComputedRef<EditablePlaceholder>;
  /**
   * Whether an editing.
   */
  isEditing: ShallowRef<boolean>;
  /**
   * Whether an empty.
   */
  isEmpty: ComputedRef<boolean>;
  /**
   * Edit used by the component context.
   */
  edit: () => void;
  /**
   * Whether the component can cel.
   */
  cancel: () => void;
  /**
   * Submit used by the component context.
   */
  submit: () => void;
}

/**
 * Context for the EditableRoot component.
 */
export interface EditableRootContext extends Omit<EditableRootContextParams, 'dir'> {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Input element used by the component context.
   */
  inputElement: ShallowRef<HTMLInputElement | undefined>;
  /**
   * Set input element used by the component context.
   */
  setInputElement: (nodeRef: VNodeRef) => void;
  /**
   * Data disabled used by the component context.
   */
  dataDisabled: ComputedRef<string | undefined>;
  /**
   * Data readonly used by the component context.
   */
  dataReadonly: ComputedRef<string | undefined>;
  /**
   * Data state used by the component context.
   */
  dataState: ComputedRef<EditableViewState>;
}

/**
 * Available UI slots for the Editable component.
 */
export type EditableUiSlot =
  | 'root'
  | 'area'
  | 'preview'
  | 'input'
  | 'controls'
  | 'editTrigger'
  | 'submitTrigger'
  | 'cancelTrigger';

/**
 * UI class overrides for the Editable component.
 */
export type EditableUi = UiClass<EditableUiSlot>;

/**
 * Properties for the EditableCompact component.
 */
export interface EditableCompactProps extends EditableRootProps {
  /**
   * Properties forwarded to the area element.
   */
  areaProps?: EditableAreaProps;
  /**
   * Properties forwarded to the preview element.
   */
  previewProps?: EditablePreviewProps;
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: EditableInputProps;
  /**
   * Properties forwarded to the edit trigger element.
   */
  editTriggerProps?: EditableEditTriggerProps;
  /**
   * Properties forwarded to the submit trigger element.
   */
  submitTriggerProps?: EditableSubmitTriggerProps;
  /**
   * Properties forwarded to the cancel trigger element.
   */
  cancelTriggerProps?: EditableCancelTriggerProps;
}

/**
 * Events for the EditableCompact component.
 */
export type EditableCompactEmits = EditableRootEmits;
/**
 * Slot properties for the EditableCompact component.
 */
export interface EditableCompactSlotProps {
  /**
   * Current model value.
   */
  modelValue: string | undefined;
  /**
   * Input value exposed in the slot scope.
   */
  inputValue: string;
  /**
   * Whether an editing.
   */
  isEditing: boolean;
  /**
   * Whether an empty.
   */
  isEmpty: boolean;
  /**
   * Edit exposed in the slot scope.
   */
  edit: () => void;
  /**
   * Whether the component can cel.
   */
  cancel: () => void;
  /**
   * Submit exposed in the slot scope.
   */
  submit: () => void;
}

/**
 * Slots for the EditableCompact component.
 */
export type EditableCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: EditableCompactSlotProps) => any;
  /**
   * Custom content for the preview slot.
   */
  preview?: (props: EditableCompactSlotProps) => any;
  /**
   * Custom content for the input slot.
   */
  input?: (props: EditableCompactSlotProps) => any;
  /**
   * Custom content for the edit trigger slot.
   */
  'edit-trigger'?: (props: EditableCompactSlotProps) => any;
  /**
   * Custom content for the submit trigger slot.
   */
  'submit-trigger'?: (props: EditableCompactSlotProps) => any;
  /**
   * Custom content for the cancel trigger slot.
   */
  'cancel-trigger'?: (props: EditableCompactSlotProps) => any;
};
