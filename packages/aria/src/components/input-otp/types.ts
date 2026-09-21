import type { ComputedRef, InputHTMLAttributes, ShallowRef } from 'vue';
import type { BaseProps, FormFieldCommonProps, UiClass } from '../../types';

/**
 * Type information for InputOtpInputMode.
 */
export type InputOtpInputMode = 'numeric' | 'text';

/**
 * Type information for InputOtpPushPasswordManagerStrategy.
 */
export type InputOtpPushPasswordManagerStrategy = 'increase-width' | 'none';

/**
 * Properties for the InputOtpRoot component.
 */
export interface InputOtpRootProps extends FormFieldCommonProps, Omit<BaseProps, 'onInput'> {
  /** The id of the native input element. */
  id?: string;
  /** Autocomplete hint passed to the native input. */
  autocomplete?: string;
  /** Whether the input should be focused on mount. */
  autofocus?: boolean;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Minimum length forwarded to the native input. */
  minlength?: number;
  /** Placeholder characters used by the visual slots. */
  placeholder?: string;
  /** Whether the input is readonly. */
  readonly?: boolean;
  /** Accessible label forwarded to the native input. */
  ariaLabel?: string;
  /** The controlled value of the OTP input. */
  modelValue?: string;
  /** The uncontrolled default value of the OTP input. */
  defaultValue?: string;
  /** The number of OTP slots. */
  maxlength: number;
  /** Virtual keyboard mode for mobile devices. */
  inputmode?: InputOtpInputMode;
  /** Pattern used to validate the whole OTP value. */
  pattern?: string | RegExp;
  /** Strategy used to avoid overlapping password manager badges. */
  pushPasswordManagerStrategy?: InputOtpPushPasswordManagerStrategy;
  /** Transform pasted content before it is inserted. */
  pasteTransformer?: (pasted: string | undefined) => string;
}

/**
 * Events for the InputOtpRoot component.
 */
export type InputOtpRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when complete occurs.
   */
  complete: [value: string];
  /**
   * Emitted when input occurs.
   */
  input: [value: string];
  /**
   * Emitted when change occurs.
   */
  change: [event: Event];
  /**
   * Emitted when select occurs.
   */
  select: [event: Event];
  /**
   * Emitted when focus occurs.
   */
  focus: [event: FocusEvent];
  /**
   * Emitted when blur occurs.
   */
  blur: [event: FocusEvent];
  /**
   * Emitted when mouseover occurs.
   */
  mouseover: [event: MouseEvent];
  /**
   * Emitted when mouseleave occurs.
   */
  mouseleave: [event: MouseEvent];
  /**
   * Emitted when paste occurs.
   */
  paste: [event: ClipboardEvent];
};

/**
 * Properties for the InputOtpPositioner component.
 */
export interface InputOtpPositionerProps extends BaseProps {}

/**
 * Properties for the InputOtpInput component.
 */
export interface InputOtpInputProps extends BaseProps<InputHTMLAttributes> {}

/**
 * Properties for the InputOtpCompact component.
 */
export interface InputOtpCompactProps extends InputOtpRootProps {}

/**
 * Events for the InputOtpCompact component.
 */
export type InputOtpCompactEmits = InputOtpRootEmits;

/**
 * Slots for the InputOtpCompact component.
 */
export type InputOtpCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: InputOtpRootSlotProps) => any;
};

/**
 * Slot properties for the InputOtp component.
 */
export interface InputOtpSlotProps {
  /** The typed character at the current slot. */
  char: string | null;
  /** Placeholder character rendered when the slot is empty. */
  placeholderChar: string | null;
  /** Whether the slot is covered by the current selection or caret. */
  isActive: boolean;
  /** Whether the slot should render a fake caret. */
  hasFakeCaret: boolean;
}

/**
 * Slot properties for the InputOtpRoot component.
 */
export interface InputOtpRootSlotProps {
  /**
   * Slots exposed in the slot scope.
   */
  slots: InputOtpSlotProps[];
  /**
   * Whether the item is focused.
   */
  isFocused: boolean;
  /**
   * Whether the item is hovered.
   */
  isHovering: boolean;
}

/**
 * Context for the InputOtpRoot component.
 */
export interface InputOtpRootContext {
  /**
   * Autocomplete used by the component context.
   */
  autocomplete: ComputedRef<string | undefined>;
  /**
   * Autofocus used by the component context.
   */
  autofocus: ComputedRef<boolean | undefined>;
  /**
   * Whether the component is disabled.
   */
  disabled: ComputedRef<boolean | undefined>;
  /**
   * Input attrs used by the component context.
   */
  inputAttrs: ComputedRef<Record<string, unknown>>;
  /**
   * Current model value.
   */
  modelValue: ComputedRef<string>;
  /**
   * Slots used by the component context.
   */
  slots: ComputedRef<InputOtpSlotProps[]>;
  /**
   * Whether will push pwmbadge.
   */
  willPushPWMBadge: ComputedRef<boolean>;
  /**
   * Whether the item is focused.
   */
  isFocused: ShallowRef<boolean>;
  /**
   * Whether the item is hovered.
   */
  isHovering: ShallowRef<boolean>;
  /**
   * Input element used by the component context.
   */
  inputElement: ShallowRef<HTMLInputElement | null>;
  /**
   * Inputmode used by the component context.
   */
  inputmode: ComputedRef<InputOtpInputMode | undefined>;
  /**
   * Maxlength used by the component context.
   */
  maxlength: ComputedRef<number>;
  /**
   * Minlength used by the component context.
   */
  minlength: ComputedRef<number | undefined>;
  /**
   * Mirror selection start used by the component context.
   */
  mirrorSelectionStart: ShallowRef<number | null>;
  /**
   * Mirror selection end used by the component context.
   */
  mirrorSelectionEnd: ShallowRef<number | null>;
  /**
   * Name used by the component context.
   */
  name: ComputedRef<string | undefined>;
  /**
   * Pattern used by the component context.
   */
  pattern: ComputedRef<string | undefined>;
  /**
   * Whether the component is readonly.
   */
  readonly: ComputedRef<boolean | undefined>;
  /**
   * Whether the value is required.
   */
  required: ComputedRef<boolean | undefined>;
  /**
   * Resolved accessible label used by the component context.
   */
  resolvedAccessibleLabel: ComputedRef<string>;
  /**
   * Resolved id used by the component context.
   */
  resolvedId: ComputedRef<string | undefined>;
  /**
   * Resolved placeholder used by the component context.
   */
  resolvedPlaceholder: ComputedRef<string | undefined>;
  /**
   * Focus used by the component context.
   */
  focus: () => void;
  /**
   * Blur used by the component context.
   */
  blur: () => void;
  /**
   * Select used by the component context.
   */
  select: () => void;
  /**
   * Callback invoked when the before input event fires.
   */
  onBeforeInput: (event: InputEvent) => void;
  /**
   * Callback invoked when the native changes.
   */
  onNativeChange: (event: Event) => void;
  /**
   * Callback invoked when the native select event fires.
   */
  onNativeSelect: (event: Event) => void;
  /**
   * Callback invoked when the mouse over event fires.
   */
  onMouseOver: (event: MouseEvent) => void;
  /**
   * Callback invoked when the mouse leave event fires.
   */
  onMouseLeave: (event: MouseEvent) => void;
  /**
   * Callback invoked when the paste event fires.
   */
  onPaste: (event: ClipboardEvent) => void;
  /**
   * Callback invoked when the input event fires.
   */
  onInput: (event: Event) => void;
  /**
   * Callback invoked when the focus event fires.
   */
  onFocus: (event: FocusEvent) => void;
  /**
   * Callback invoked when the blur event fires.
   */
  onBlur: (event: FocusEvent) => void;
}

/**
 * Available UI slots for the InputOtp component.
 */
export type InputOtpUiSlot = 'root' | 'positioner' | 'input' | 'group' | 'slot' | 'char' | 'placeholder' | 'caret';

/**
 * UI class overrides for the InputOtp component.
 */
export type InputOtpUi = UiClass<InputOtpUiSlot>;
