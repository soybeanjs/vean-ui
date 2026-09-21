import type { ComputedRef, Attrs, InputHTMLAttributes, ShallowRef } from 'vue';
import type { BaseProps, FormFieldCommonProps, ToContext, UiClass } from '../../types';
import type { ButtonProps } from '../button/types';
import type { InputBaseProps } from '../input/types';

/**
 * Properties for the InputNumberRoot component.
 */
export interface InputNumberRootProps extends FormFieldCommonProps, InputBaseProps, BaseProps {
  /** The default value of the input */
  defaultValue?: number;
  /** The controlled value of the input */
  modelValue?: number | null;
  /** The smallest value allowed for the input. */
  min?: number;
  /** The largest value allowed for the input. */
  max?: number;
  /** The amount that the input value changes with each increment or decrement "tick". */
  step?: number;
  /** When `false`, prevents the value from snapping to the nearest increment of the step value */
  stepSnapping?: boolean;
  /** When `true`, the input will be focused when the value changes. */
  focusOnChange?: boolean;
  /**
   * Formatting options for the value displayed in the number field. This also affects what characters are allowed to be
   * typed by the user.
   */
  formatOptions?: Intl.NumberFormatOptions;
  /** The locale to use for formatting dates */
  locale?: string;
  /** When `true`, prevents the value from changing on wheel scroll. */
  disableWheelChange?: boolean;
  /** When `true`, inverts the direction of the wheel change. */
  invertWheelChange?: boolean;
  /**
   * Properties forwarded to the root element.
   */
  rootProps?: BaseProps;
}

/**
 * Events for the InputNumberRoot component.
 */
export type InputNumberRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [val: number | null];
};

/**
 * Properties for the InputNumberControl component.
 */
export interface InputNumberControlProps extends BaseProps<InputHTMLAttributes> {}

/**
 * Properties for the InputNumberIncrement component.
 */
export interface InputNumberIncrementProps extends ButtonProps {}

/**
 * Properties for the InputNumberDecrement component.
 */
export interface InputNumberDecrementProps extends ButtonProps {}

/**
 * Properties for the InputNumberClear component.
 */
export interface InputNumberClearProps extends ButtonProps {}

/**
 * Events for the InputNumberClear component.
 */
export type InputNumberClearEmits = {
  /**
   * Emitted when the clear button is clicked.
   */
  clear: [event: PointerEvent];
};

/**
 * Slot properties for the InputNumberCompact component.
 */
export interface InputNumberCompactSlotProps {
  /**
   * Current model value.
   */
  modelValue?: number | null;
  /**
   * Clear handler.
   */
  clear: () => void;
}

/**
 * Properties for the InputNumberCompact component.
 */
export interface InputNumberCompactProps extends InputNumberRootProps {
  /**
   * Whether to show the clear trigger.
   *
   * @defaultValue false
   */
  clearable?: boolean;
  /**
   * The function to set the input element.
   */
  inputRef?: (el: HTMLInputElement) => void;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: InputNumberControlProps;
  /**
   * Properties forwarded to the increment element.
   */
  incrementProps?: InputNumberIncrementProps;
  /**
   * Properties forwarded to the decrement element.
   */
  decrementProps?: InputNumberDecrementProps;
  /**
   * Properties forwarded to the clear element.
   */
  clearProps?: ButtonProps;
}

/**
 * Events for the InputNumberCompact component.
 */
export type InputNumberCompactEmits = InputNumberRootEmits & InputNumberClearEmits;

/**
 * Slots for the InputNumberCompact component.
 */
export type InputNumberCompactSlots = {
  /**
   * Custom content for the leading slot.
   */
  leading?: (props: InputNumberCompactSlotProps) => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: (props: InputNumberCompactSlotProps) => any;
  /**
   * Custom content for the clear slot.
   */
  clear?: (props: InputNumberCompactSlotProps) => any;
  /**
   * Custom content for the decrement slot.
   */
  decrement?: (props: InputNumberCompactSlotProps) => any;
  /**
   * Custom content for the increment slot.
   */
  increment?: (props: InputNumberCompactSlotProps) => any;
};

/**
 * Parameters used to create the InputNumberRoot context.
 */
export interface InputNumberRootContextParams extends ToContext<
  InputNumberRootProps,
  | 'disabled'
  | 'readonly'
  | 'locale'
  | 'min'
  | 'max'
  | 'step'
  | 'focusOnChange'
  | 'formatOptions'
  | 'stepSnapping'
  | 'disableWheelChange'
  | 'invertWheelChange'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<number | null | undefined>;
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
 * Available UI slots for the InputNumber component.
 */
export type InputNumberUiSlot = 'root' | 'increment' | 'decrement' | 'control' | 'clear';

/**
 * UI class overrides for the InputNumber component.
 */
export type InputNumberUi = UiClass<InputNumberUiSlot>;
