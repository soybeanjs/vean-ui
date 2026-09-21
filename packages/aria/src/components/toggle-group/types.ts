import type { ComputedRef, ShallowRef } from 'vue';
import type {
  DataOrientation,
  DefinedValue,
  Direction,
  FormFieldCommonProps,
  ToContext,
  SelectionEmits,
  SelectionProps,
  UiClass
} from '../../types';
import type { ButtonProps } from '../button/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the ToggleGroupRoot component.
 */
export interface ToggleGroupRootProps<M extends boolean = false, T extends DefinedValue = string>
  extends SelectionProps<M, T>, FormFieldCommonProps, PrimitiveWithBaseProps {
  /** When `false`, navigating through items with arrow keys is disabled. */
  rovingFocus?: boolean;
  /** When `true`, prevents interaction with all items in the group. */
  disabled?: boolean;
  /** The orientation of the component. */
  orientation?: DataOrientation;
  /** The reading direction of the group when applicable. */
  dir?: Direction;
  /** When `true`, keyboard navigation loops from last to first item, and vice versa. */
  loop?: boolean;
}

/**
 * Events for the ToggleGroupRoot component.
 */
export type ToggleGroupRootEmits<M extends boolean = false, T extends DefinedValue = string> = SelectionEmits<M, T>;

/**
 * Parameters used to create the ToggleGroupRoot context.
 */
export type ToggleGroupRootContextParams = ToContext<
  ToggleGroupRootProps<boolean, DefinedValue>,
  'disabled' | 'rovingFocus' | 'orientation' | 'dir' | 'loop' | 'name' | 'required'
> & {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<SelectionProps<boolean, DefinedValue>['modelValue']>;
  /**
   * Handler used to update the model value.
   */
  onModelValueChange: (value: DefinedValue) => void;
  /**
   * Whether the value is selected.
   */
  isValueSelected: (value: DefinedValue) => boolean;
  /**
   * Whether multiple values are supported.
   */
  isMultiple: ComputedRef<boolean>;
};

/**
 * Properties for the ToggleGroupItem component.
 */
export interface ToggleGroupItemProps<T extends DefinedValue = string> extends ButtonProps {
  /** A unique value that identifies the item inside the group. */
  value: T;
}

/**
 * Available UI slots for the ToggleGroup component.
 */
export type ToggleGroupUiSlot = 'root' | 'item';

/**
 * UI class overrides for the ToggleGroup component.
 */
export type ToggleGroupUi = UiClass<ToggleGroupUiSlot>;
