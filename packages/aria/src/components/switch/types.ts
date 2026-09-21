import type { HtmlHTMLAttributes, ShallowRef } from 'vue';
import type {
  BaseProps,
  AcceptableBooleanValue,
  Direction,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { ButtonProps } from '../button/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Type information for SwitchValueConfig.
 */
export interface SwitchValueConfig<T extends AcceptableBooleanValue = boolean> {
  /**
   * The value given as data when submitted with a `name`.
   *
   * @default true
   */
  trueValue?: NonNullable<T>;
  /**
   * The value given as data when submitted with a `name`.
   *
   * @default false
   */
  falseValue?: NonNullable<T>;
}

/**
 * Properties for the SwitchRoot component.
 */
export interface SwitchRootProps<T extends AcceptableBooleanValue>
  extends FormFieldCommonProps, SwitchValueConfig<T>, BaseProps<HtmlHTMLAttributes> {
  /** The state of the switch when it is initially rendered. Use when you do not need to control its state. */
  defaultValue?: NonNullable<T>;
  /** The controlled state of the switch. Can be bind as `v-model`. */
  modelValue?: T;
  /** When `true`, prevents the user from interacting with the switch. */
  disabled?: boolean;
  /** The value given as data when submitted with a `name`. */
  value?: string;
  /** The direction the switch should animate towards when changing state. */
  dir?: Direction;
}

/**
 * Events for the SwitchRoot component.
 */
export type SwitchRootEmits<T extends AcceptableBooleanValue = boolean> = {
  /** Event handler called when the value of the switch changes. */
  'update:modelValue': [payload: NonNullable<T>];
};

/**
 * Properties for the SwitchControl component.
 */
export interface SwitchControlProps extends ButtonProps {
  /** Id of the element */
  id?: string;
}

/**
 * Properties for the SwitchThumb component.
 */
export interface SwitchThumbProps extends PrimitiveWithBaseProps {}

/**
 * Slot properties for the SwitchCompact component.
 */
export interface SwitchCompactSlotProps<T extends AcceptableBooleanValue = boolean> {
  /**
   * Current model value.
   */
  modelValue: T | undefined;
}

/**
 * Properties for the SwitchCompact component.
 */
export interface SwitchCompactProps<T extends AcceptableBooleanValue = boolean> extends SwitchRootProps<T> {
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: SwitchControlProps;
  /**
   * Properties forwarded to the thumb element.
   */
  thumbProps?: SwitchThumbProps;
}

/**
 * Events for the SwitchCompact component.
 */
export type SwitchCompactEmits<T extends AcceptableBooleanValue = boolean> = SwitchRootEmits<T>;

/**
 * Slots for the SwitchCompact component.
 */
export type SwitchCompactSlots<T extends AcceptableBooleanValue = boolean> = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: SwitchCompactSlotProps<T>) => any;
  /**
   * Custom content for the leading slot.
   */
  leading?: (props: SwitchCompactSlotProps<T>) => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: (props: SwitchCompactSlotProps<T>) => any;
};

/**
 * Parameters used to create the SwitchRoot context.
 */
export interface SwitchRootContextParams<T extends AcceptableBooleanValue = boolean> extends ToContext<
  SwitchRootProps<T>,
  'disabled' | 'required' | 'trueValue' | 'falseValue'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<T>;
}

/**
 * Available UI slots for the Switch component.
 */
export type SwitchUiSlot = 'root' | 'control' | 'thumb';

/**
 * UI class overrides for the Switch component.
 */
export type SwitchUi = UiClass<SwitchUiSlot>;
