import type { InputHTMLAttributes, ShallowRef } from 'vue';
import type {
  BaseProps,
  ColorChannel,
  ColorFormat,
  ColorSpace,
  ColorValue,
  NormalizedColor,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the ColorFieldRoot component.
 */
export interface ColorFieldRootProps extends FormFieldCommonProps, PrimitiveWithBaseProps {
  /**
   * Current model value.
   */
  modelValue?: string | ColorValue;
  /**
   * Default value.
   */
  defaultValue?: string | ColorValue;
  /**
   * Color space.
   */
  colorSpace?: ColorSpace;
  /**
   * Channel.
   */
  channel?: ColorChannel;
  /**
   * Format.
   */
  format?: ColorFormat;
  /**
   * Placeholder.
   */
  placeholder?: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Whether the component is readonly.
   */
  readonly?: boolean;
  /**
   * Whether to disable wheel change.
   */
  disableWheelChange?: boolean;
  /**
   * Step.
   */
  step?: number;
}

/**
 * Events for the ColorFieldRoot component.
 */
export type ColorFieldRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when the color value changes.
   */
  'update:color': [value: NormalizedColor];
};

/**
 * Properties for the ColorFieldInput component.
 */
export interface ColorFieldInputProps extends BaseProps<InputHTMLAttributes> {}

/**
 * Properties for the ColorFieldCompact component.
 */
export interface ColorFieldCompactProps extends ColorFieldRootProps {
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: ColorFieldInputProps;
}

/**
 * Events for the ColorFieldCompact component.
 */
export type ColorFieldCompactEmits = ColorFieldRootEmits;

/**
 * Context for the ColorFieldRoot component.
 */
export interface ColorFieldRootContext extends ToContext<
  ColorFieldRootProps,
  'channel' | 'colorSpace' | 'format' | 'disabled' | 'readonly' | 'disableWheelChange' | 'placeholder'
> {
  /**
   * Theme color of the component.
   */
  color: ShallowRef<NormalizedColor>;
  /**
   * Input value used by the component context.
   */
  inputValue: ShallowRef<string>;
  /**
   * Update value used by the component context.
   */
  updateValue: (value: string) => void;
  /**
   * Commit used by the component context.
   */
  commit: () => void;
  /**
   * Increment used by the component context.
   */
  increment: () => void;
  /**
   * Decrement used by the component context.
   */
  decrement: () => void;
  /**
   * Increment page used by the component context.
   */
  incrementPage: () => void;
  /**
   * Decrement page used by the component context.
   */
  decrementPage: () => void;
  /**
   * Increment to max used by the component context.
   */
  incrementToMax: () => void;
  /**
   * Decrement to min used by the component context.
   */
  decrementToMin: () => void;
  /**
   * Handle wheel used by the component context.
   */
  handleWheel: (event: WheelEvent) => void;
}

/**
 * Available UI slots for the ColorField component.
 */
export type ColorFieldUiSlot = 'root' | 'input';

/**
 * UI class overrides for the ColorField component.
 */
export type ColorFieldUi = UiClass<ColorFieldUiSlot>;
