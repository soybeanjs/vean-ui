import type { ComputedRef, ShallowRef } from 'vue';
import type { DataOrientation, Direction, FormFieldCommonProps, ToContext } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the RatingRoot component.
 */
export interface RatingRootProps extends FormFieldCommonProps, PrimitiveWithBaseProps {
  /** The controlled value of the rating. Can be bound as `v-model`. */
  modelValue?: number;
  /** The initial value of the rating when uncontrolled. */
  defaultValue?: number;
  /** The maximum rating value (number of items). */
  max?: number;
  /** Whether half-star precision is allowed. */
  allowHalf?: boolean;
  /** Whether clicking the current value clears the rating to 0. */
  allowClear?: boolean;
  /** Whether the rating is read-only (focusable but not interactive). */
  readonly?: boolean;
  /** Whether the rating is disabled (inert). */
  disabled?: boolean;
  /** The orientation of the rating. */
  orientation?: DataOrientation;
  /** The reading direction of the rating. */
  dir?: Direction;
}

/**
 * Events for the RatingRoot component.
 */
export type RatingRootEmits = {
  /** Event handler called when the rating value changes. */
  'update:modelValue': [value: number];
  /** Event handler called when the hover preview value changes. `null` when the pointer leaves. */
  hoverChange: [value: number | null];
  /** Event handler called when a rating interaction is committed (click or keyboard). */
  valueCommit: [value: number];
};

/**
 * Properties for the RatingItem component.
 */
export interface RatingItemProps extends PrimitiveWithBaseProps {
  /** The zero-based index of the item within the rating. */
  index: number;
}

/**
 * Events for the RatingItem component.
 */
export type RatingItemEmits = Record<string, never>;

/**
 * The visual state of a rating item.
 */
export type RatingItemState = 'full' | 'half' | 'empty';

/**
 * Context for the RatingRoot component.
 */
export interface RatingRootContext extends ToContext<
  RatingRootProps,
  'max' | 'allowHalf' | 'allowClear' | 'readonly' | 'disabled' | 'dir' | 'orientation'
> {
  /** Current model value (controllable state ref). */
  modelValue: ShallowRef<number | undefined>;
  /** Current model value used by the component context. */
  currentModelValue: ComputedRef<number>;
  /** Current hover preview value, or `null` when not hovering. */
  hoverValue: ComputedRef<number | null>;
  /** Whether the orientation is horizontal. */
  isHorizontal: ComputedRef<boolean>;
  /** Set the rating value (handles snapping, clamping, and `allowClear`). */
  setValue: (value: number) => void;
  /** Set the hover preview value. */
  setHover: (value: number) => void;
  /** Clear the hover preview value. */
  clearHover: () => void;
}
