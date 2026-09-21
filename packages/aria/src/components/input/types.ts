import type { Attrs, ComputedRef, InputHTMLAttributes, InputTypeHTMLAttribute, ShallowRef } from 'vue';
import type { BaseProps, FormFieldCommonProps, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';

/**
 * Properties for the InputBase component.
 */
export interface InputBaseProps {
  /** Id of the input element */
  id?: string;
  /** When `true`, the input is auto-focused. */
  autofocus?: boolean;
  /**
   * The autocomplete attribute of the input.
   *
   * Supports the HTML autofill tokens (including password-manager values such as
   * `current-password` / `new-password`), in addition to the `on` / `off` switches.
   */
  autocomplete?:
    | 'on'
    | 'off'
    | 'username'
    | 'current-password'
    | 'new-password'
    | 'one-time-code'
    | 'email'
    | 'tel'
    | 'name'
    | 'given-name'
    | 'family-name'
    | 'organization'
    | 'street-address'
    | 'address-level2'
    | 'postal-code'
    | 'country'
    | 'cc-name'
    | 'cc-number'
    | 'cc-exp'
    | 'cc-csc'
    | 'transaction-amount'
    | 'url'
    | 'search';
  /** When `true`, prevents the user from interacting with the input. */
  disabled?: boolean;
  /** The maximum number of characters allowed in the input */
  maxlength?: number;
  /** The minimum number of characters allowed in the input */
  minlength?: number;
  /** The pattern attribute of the input */
  pattern?: string;
  /** The placeholder of the input */
  placeholder?: string;
  /** When `true`, the input is read-only. */
  readonly?: boolean;
  /**
   * The type of the input element.
   */
  type?: InputTypeHTMLAttribute;
}

/**
 * Properties for the InputRoot component.
 */
export interface InputRootProps extends FormFieldCommonProps, InputBaseProps, BaseProps {
  /** The default value of the input */
  defaultValue?: string;
  /** The controlled value of the input */
  modelValue?: string;
  /** When `true`, prevents the user from interacting with the input. */
  disabled?: boolean;
  /** When `true`, the input is read-only. */
  readonly?: boolean;
  /** Properties forwarded to the root element */
  rootProps?: BaseProps;
}

/**
 * Events for the InputRoot component.
 */
export type InputRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
};

/**
 * Properties for the InputControl component.
 */
export interface InputControlProps extends BaseProps<InputHTMLAttributes> {}

/**
 * Context for the InputRoot component.
 */
export interface InputRootContext extends ToContext<InputRootProps, 'disabled' | 'readonly'> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string | undefined>;
  /**
   * Clear handler.
   */
  onClear: () => void;
  /**
   * The attributes to be spread on the input element.
   */
  inputAttrs: ComputedRef<Attrs>;
}

/**
 * Properties for the InputClear component.
 */
export interface InputClearProps extends ButtonProps {}

/**
 * Events for the InputClear component.
 */
export type InputClearEmits = {
  /**
   * Emitted when the clear button is clicked.
   */
  clear: [event: PointerEvent];
};

/**
 * Available UI slots for the Input component.
 */
export type InputUiSlot = 'root' | 'control' | 'clear';

/**
 * UI class overrides for the Input component.
 */
export type InputUi = UiClass<InputUiSlot>;

/**
 * Slot properties for the InputCompact component.
 */
export interface InputCompactSlotProps {
  /**
   * Current model value.
   */
  modelValue?: string;
  /**
   * Clear handler.
   */
  clear: () => void;
}

/**
 * Properties for the InputCompact component.
 */
export interface InputCompactProps extends InputRootProps {
  /**
   * The function to set the input element.
   */
  inputRef?: (el: HTMLInputElement) => void;
  /**
   * Whether to show the clear trigger.
   *
   * @defaultValue false
   */
  clearable?: boolean;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: InputControlProps;
  /**
   * Properties forwarded to the clear element.
   */
  clearProps?: InputClearProps;
}

/**
 * Events for the InputCompact component.
 */
export type InputCompactEmits = InputRootEmits & InputClearEmits;

/**
 * Slots for the InputCompact component.
 */
export type InputCompactSlots = {
  /**
   * Custom content for the leading slot.
   */
  leading?: (props: InputCompactSlotProps) => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: (props: InputCompactSlotProps) => any;
  /**
   * Custom content for the clear slot.
   */
  clear?: (props: InputCompactSlotProps) => any;
};
