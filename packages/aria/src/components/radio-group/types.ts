import type { ComputedRef, ShallowRef } from 'vue';
import type {
  BaseProps,
  DataOrientation,
  DefinedWithBooleanValue,
  Direction,
  EmitsToHookProps,
  ForceMountProps,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { LabelProps as RadioGroupLabelProps } from '../label/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the RadioGroupRoot component.
 */
export interface RadioGroupRootProps<T extends DefinedWithBooleanValue = DefinedWithBooleanValue>
  extends FormFieldCommonProps, BaseProps {
  /** The controlled value of the radio item to check. Can be bound as `v-model`. */
  modelValue?: T | null;
  /**
   * The value of the radio item that should be checked when initially rendered. Use when you do not need to control the
   * state of the radio items.
   */
  defaultValue?: T;
  /** When `true`, prevents the user from interacting with radio items. */
  disabled?: boolean;
  /** The orientation of the component. */
  orientation?: DataOrientation;
  /** The reading direction of the radio group when applicable. */
  dir?: Direction;
  /** When `true`, keyboard navigation will loop from last item to first, and vice versa. */
  loop?: boolean;
}

/**
 * Events for the RadioGroupRoot component.
 */
export type RadioGroupRootEmits<T extends DefinedWithBooleanValue> = {
  /** Event handler called when the radio group value changes */
  'update:modelValue': [payload: T | null];
};

/**
 * Context for the RadioGroupRoot component.
 */
export type RadioGroupRootContext = ToContext<
  RadioGroupRootProps,
  'disabled' | 'orientation' | 'dir' | 'loop' | 'name' | 'required'
> & {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DefinedWithBooleanValue | null>;
};

/**
 * Properties for the RadioGroupItem component.
 */
export interface RadioGroupItemProps extends FormFieldCommonProps, BaseProps {
  /** The value given as data when submitted with a `name`. */
  value: DefinedWithBooleanValue;
  /** When `true`, prevents the user from interacting with the radio item. */
  disabled?: boolean;
}

/**
 * Type information for RadioSelectEvent.
 */
export type RadioSelectEvent = CustomEvent<{
  /**
   * Original event.
   */
  originalEvent: MouseEvent | KeyboardEvent;
  /**
   * Value associated with the current item.
   */
  value: DefinedWithBooleanValue;
}>;

/**
 * Events for the RadioGroupItem component.
 */
export type RadioGroupItemEmits = {
  /** Event handler called when the radio item is selected */
  select: [event: RadioSelectEvent];
};

/**
 * Properties for the RadioGroupControl component.
 */
export interface RadioGroupControlProps extends ButtonProps {
  /** Id of the element */
  id?: string;
}

/**
 * Properties for the RadioGroupIndicator component.
 */
export interface RadioGroupIndicatorProps extends ForceMountProps, PrimitiveWithBaseProps {}

/**
 * Option data for the RadioGroup component.
 */
export interface RadioGroupOptionData<T extends DefinedWithBooleanValue = DefinedWithBooleanValue> {
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
}

/**
 * Properties for the RadioGroupCompact component.
 */
export interface RadioGroupCompactProps<
  T extends RadioGroupOptionData = RadioGroupOptionData
> extends RadioGroupRootProps<T['value']> {
  /**
   * Items rendered by the component.
   */
  items: T[];
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: RadioGroupItemProps;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: RadioGroupControlProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: RadioGroupIndicatorProps;
  /**
   * Properties forwarded to the label element.
   */
  labelProps?: RadioGroupLabelProps;
}

/**
 * Events for the RadioGroupCompact component.
 */
export type RadioGroupCompactEmits<T extends DefinedWithBooleanValue = DefinedWithBooleanValue> =
  RadioGroupRootEmits<T>;

/**
 * Option data for the RadioGroupCard component.
 */
export interface RadioGroupCardOptionData<
  T extends DefinedWithBooleanValue = DefinedWithBooleanValue
> extends RadioGroupOptionData<T> {
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
 * Properties for the RadioGroupCard component.
 */
export interface RadioGroupCardCompactProps<
  T extends RadioGroupCardOptionData = RadioGroupCardOptionData
> extends RadioGroupCompactProps<T> {
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: BaseProps;
  /**
   * Properties forwarded to the text content element.
   */
  textContentProps?: BaseProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: BaseProps;
}

/**
 * Events for the RadioGroupCardCompact component.
 */
export type RadioGroupCardCompactEmits<T extends DefinedWithBooleanValue = DefinedWithBooleanValue> =
  RadioGroupCompactEmits<T>;

/**
 * Slots for the RadioGroupCompact component.
 */
export type RadioGroupCardCompactSlots<T extends RadioGroupCardOptionData = RadioGroupCardOptionData> = {
  /**
   * Slot for rendering custom description content within the radio card.
   */
  description?: (props: { item: T }) => any;
};

/**
 * Parameters used to create the RadioGroupItem context.
 */
export type RadioGroupItemContextParams = ToContext<
  Pick<RadioGroupItemProps, 'name' | 'required' | 'value' | 'disabled'>
> &
  EmitsToHookProps<RadioGroupItemEmits> & {
    /** Whether the radio item is checked */
    checked: ComputedRef<boolean>;
    /**
     * Event handler called when the radio item is selected
     *
     * @param event - The event object
     */
    onSelect: (event: RadioSelectEvent) => void;
  };

/**
 * Available UI slots for the RadioGroup component.
 */
export type RadioGroupUiSlot = 'root' | 'item' | 'indicator' | 'label' | 'control';

/**
 * UI class overrides for the RadioGroup component.
 */
export type RadioGroupUi = UiClass<RadioGroupUiSlot>;

/**
 * Available UI slots for the RadioGroupCard component.
 */
export type RadioGroupCardUiSlot = RadioGroupUiSlot | 'content' | 'textContent' | 'description' | 'icon';

/**
 * UI class overrides for the RadioGroupCard component.
 */
export type RadioGroupCardUi = UiClass<RadioGroupCardUiSlot>;

export type { RadioGroupLabelProps };
