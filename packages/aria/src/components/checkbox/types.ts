import type { ComputedRef, ShallowRef } from 'vue';
import type { RovingFocusGroupOptions } from '../../composables';
import type {
  BaseProps,
  CheckedState,
  DefinedValue,
  ForceMountProps,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { LabelProps as CheckboxLabelProps } from '../label/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the CheckboxRoot component.
 */
export interface CheckboxRootProps extends FormFieldCommonProps, BaseProps {
  /**
   * Id.
   */
  id?: string;
  /** The controlled value of the checkbox. Can be bound with v-model. */
  modelValue?: CheckedState | null;
  /** The value of the checkbox when it is initially rendered. Use when you do not need to control its value. */
  defaultValue?: CheckedState;
  /**
   * The value given as data when submitted with a `name`.
   *
   * @defaultValue on
   */
  value?: DefinedValue;
  /**
   * When `true`, prevents the user from interacting with the checkbox
   *
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Events for the CheckboxRoot component.
 */
export type CheckboxRootEmits = {
  /** Event handler called when the value of the checkbox changes. */
  'update:modelValue': [value: CheckedState | null];
};

/**
 * Properties for the CheckboxControl component.
 */
export interface CheckboxControlProps extends ButtonProps {
  /** Id of the element */
  id?: string;
}

/**
 * Properties for the CheckboxIndicator component.
 */
export interface CheckboxIndicatorProps extends ForceMountProps, PrimitiveWithBaseProps {}

/**
 * Option data for the CheckboxGroup component.
 */
export type CheckboxGroupOptionData<T extends DefinedValue = DefinedValue> = {
  /**
   * Value associated with the current item.
   */
  value: T;
  /**
   * Label text rendered by the component.
   */
  label: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
};

/**
 * Option data for the CheckboxCardGroup component.
 */
export type CheckboxCardGroupOptionData<T extends DefinedValue = DefinedValue> = CheckboxGroupOptionData<T> & {
  /**
   * Icon rendered by the component.
   */
  icon?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
};

/**
 * Properties for the CheckboxGroupRoot component.
 */
export interface CheckboxGroupRootProps<T extends DefinedValue = DefinedValue>
  extends
    Omit<RovingFocusGroupOptions, 'currentTabStopId' | 'defaultCurrentTabStopId' | 'preventScrollOnEntryFocus'>,
    FormFieldCommonProps {
  /** The controlled value of the checkbox. Can be bound with v-model. */
  modelValue?: T[];
  /** The value of the checkbox when it is initially rendered. Use when you do not need to control its value. */
  defaultValue?: T[];
  /**
   * When `false`, navigating through the items using arrow keys will be disabled.
   *
   * @defaultValue true
   */
  rovingFocus?: boolean;
  /**
   * When `true`, prevents the user from interacting with the checkboxes
   *
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Events for the CheckboxGroupRoot component.
 */
export type CheckboxGroupRootEmits<T extends DefinedValue = DefinedValue> = {
  /** Event handler called when the value of the checkbox group changes. */
  'update:modelValue': [value: T[]];
};

/**
 * Properties for the CheckboxCompact component.
 */
export interface CheckboxCompactProps extends CheckboxRootProps {
  /**
   * Label text rendered by the component.
   */
  label?: string;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: CheckboxControlProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: CheckboxIndicatorProps;
  /**
   * Properties forwarded to the label element.
   */
  labelProps?: CheckboxLabelProps;
}

/**
 * Events for the CheckboxCompact component.
 */
export type CheckboxCompactEmits = CheckboxRootEmits;

/**
 * Properties for the CheckboxCardCompact component.
 */
export interface CheckboxCardCompactProps extends CheckboxCompactProps {
  /**
   * Icon rendered by the component.
   */
  icon?: IconValue;
  /**
   * Description text rendered by the component.
   */
  description?: string;
}

/**
 * Events for the CheckboxCardCompact component.
 */
export type CheckboxCardCompactEmits = CheckboxCompactEmits;

/**
 * Properties for the CheckboxGroupCompact component.
 */
export interface CheckboxGroupCompactProps<
  T extends CheckboxGroupOptionData = CheckboxGroupOptionData
> extends CheckboxGroupRootProps<T['value']> {
  /**
   * Items rendered by the component.
   */
  items: T[];
  /**
   * Properties forwarded to the root element.
   */
  rootProps?: CheckboxRootProps;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: CheckboxControlProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: CheckboxIndicatorProps;
  /**
   * Properties forwarded to the label element.
   */
  labelProps?: CheckboxLabelProps;
}

/**
 * Properties for the CheckboxCardGroupCompact component.
 */
export interface CheckboxCardGroupCompactProps<
  T extends CheckboxCardGroupOptionData = CheckboxCardGroupOptionData
> extends CheckboxGroupCompactProps<T> {}

/**
 * Events for the CheckboxGroupCompact component.
 */
export type CheckboxGroupCompactEmits<T extends DefinedValue = DefinedValue> = CheckboxGroupRootEmits<T>;

/**
 * Events for the CheckboxCardGroupCompact component.
 */
export type CheckboxCardGroupCompactEmits<T extends DefinedValue = DefinedValue> = CheckboxGroupRootEmits<T>;

/**
 * Parameters used to create the CheckboxGroupRoot context.
 */
export type CheckboxGroupRootContextParams = ToContext<CheckboxGroupRootProps, 'rovingFocus' | 'disabled'> & {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DefinedValue[] | undefined>;
};

/**
 * Parameters used to create the CheckboxRoot context.
 */
export type CheckboxRootContextParams = ToContext<CheckboxRootProps, 'value' | 'disabled' | 'name' | 'required'> & {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<CheckedState | null | undefined>;
  /**
   * State used by the component context.
   */
  state: ComputedRef<CheckedState>;
};

/**
 * Available UI slots for the Checkbox component.
 */
export type CheckboxUiSlot = 'groupRoot' | 'root' | 'indicator' | 'indicator-icon' | 'label' | 'control';

/**
 * Available UI slots for the CheckboxCard component.
 */
export type CheckboxCardUiSlot = CheckboxUiSlot | 'content' | 'icon' | 'textContent' | 'description';

/**
 * UI class overrides for the Checkbox component.
 */
export type CheckboxUi = UiClass<CheckboxUiSlot>;

/**
 * UI class overrides for the CheckboxCard component.
 */
export type CheckboxCardUi = UiClass<CheckboxCardUiSlot>;

export type { CheckboxLabelProps };
