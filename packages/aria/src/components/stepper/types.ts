import type { ComputedRef, ShallowRef } from 'vue';
import type { DataOrientation, Direction, ToContext, UiClass } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { SeparatorRootProps } from '../separator/types';

/**
 * State values for StepperState.
 */
export type StepperState = 'completed' | 'active' | 'inactive';

/**
 * Properties for the StepperRoot component.
 */
export interface StepperRootProps extends PrimitiveWithBaseProps {
  /**
   * The value of the step that should be active when initially rendered.
   *
   * @defaultValue 1
   */
  defaultValue?: number;
  /**
   * The controlled value of the step to activate. Can be bind as `v-model`.
   */
  modelValue?: number;
  /**
   * The orientation of the stepper.
   *
   * @defaultValue 'horizontal'
   */
  orientation?: DataOrientation;
  /**
   * The reading direction of the stepper.
   */
  dir?: Direction;
  /**
   * Whether the steps must be completed in order.
   *
   * @defaultValue true
   */
  linear?: boolean;
}

/**
 * Events for the StepperRoot component.
 */
export type StepperRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [payload: number];
};

/**
 * Properties for the StepperItem component.
 */
export interface StepperItemProps extends PrimitiveWithBaseProps {
  /** The step index, starting from `1`. */
  step: number;
  /** When `true`, prevents the user from interacting with the step. */
  disabled?: boolean;
  /** Shows whether the step is completed. */
  completed?: boolean;
}

/**
 * Properties for the StepperTrigger component.
 */
export interface StepperTriggerProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the StepperIndicator component.
 */
export interface StepperIndicatorProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the StepperTitle component.
 */
export interface StepperTitleProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the StepperDescription component.
 */
export interface StepperDescriptionProps extends PrimitiveWithBaseProps {}

/**
 * Context for the StepperRoot component.
 */
export interface StepperRootContext extends ToContext<StepperRootProps, 'orientation' | 'dir' | 'linear'> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<number | undefined>;
  /**
   * Stepper items used by the component context.
   */
  stepperItems: ComputedRef<HTMLElement[]>;
  /**
   * Total steps used by the component context.
   */
  totalSteps: ComputedRef<number>;
  /**
   * Change model value used by the component context.
   */
  changeModelValue: (value: number) => void;
  /**
   * Register stepper item used by the component context.
   */
  registerStepperItem: (element: HTMLElement) => void;
  /**
   * Unregister stepper item used by the component context.
   */
  unregisterStepperItem: (element: HTMLElement | undefined) => void;
}

/**
 * Parameters used to create the StepperItem context.
 */
export interface StepperItemContextParams extends ToContext<StepperItemProps, 'step' | 'disabled' | 'completed'> {
  /**
   * State used by the component context.
   */
  state: ComputedRef<StepperState>;
  /**
   * Whether a focusable.
   */
  isFocusable: ComputedRef<boolean>;
  /**
   * Data disabled used by the component context.
   */
  dataDisabled: ComputedRef<string | undefined>;
}

/**
 * Context for the StepperItem component.
 */
export interface StepperItemContext extends StepperItemContextParams {
  /**
   * Title id used by the component context.
   */
  titleId: ShallowRef<string>;
  /**
   * Description id used by the component context.
   */
  descriptionId: ShallowRef<string>;
}

/**
 * Available UI slots for the Stepper component.
 */
export type StepperUiSlot =
  | 'root'
  | 'item'
  | 'trigger'
  | 'indicator'
  | 'indicatorIcon'
  | 'itemContent'
  | 'separator'
  | 'title'
  | 'description';

/**
 * UI class overrides for the Stepper component.
 */
export type StepperUi = UiClass<StepperUiSlot>;

/**
 * Properties for the StepperSeparator component.
 */
export type StepperSeparatorProps = SeparatorRootProps;

/**
 * Type information for StepperItemData.
 */
export interface StepperItemData {
  /**
   * Title text rendered by the component.
   */
  title?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Whether completed.
   */
  completed?: boolean;
}

/**
 * Properties for the StepperCompact component.
 */
export interface StepperCompactProps extends StepperRootProps {
  /**
   * Items rendered by the component.
   */
  items: StepperItemData[];
  /**
   * Properties forwarded to the item element. The `step` is derived from the item order and cannot be overridden.
   */
  itemProps?: Omit<StepperItemProps, 'step'>;
  /**
   * Properties forwarded to the trigger element.
   */
  triggerProps?: StepperTriggerProps;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: StepperIndicatorProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: StepperSeparatorProps;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: StepperTitleProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: StepperDescriptionProps;
}

/**
 * Events for the StepperCompact component.
 */
export type StepperCompactEmits = StepperRootEmits;

/**
 * Slots for the StepperCompact component.
 */
export type StepperCompactSlots = {
  /**
   * Custom content for the item slot.
   */
  item?: (props: StepperItemData & { step: number; state: StepperState }) => any;
  /**
   * Custom content for the indicator slot.
   */
  indicator?: (props: StepperItemData & { step: number; state: StepperState }) => any;
  /**
   * Custom content for the title slot.
   */
  title?: (props: StepperItemData & { step: number; state: StepperState }) => any;
  /**
   * Custom content for the description slot.
   */
  description?: (props: StepperItemData & { step: number; state: StepperState }) => any;
  /**
   * Custom content for the separator slot.
   */
  separator?: (props: StepperItemData & { step: number; state: StepperState }) => any;
};
