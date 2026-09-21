import type { ComputedRef, SVGAttributes } from 'vue';
import type { BaseProps, Direction, UiClass } from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * State values for ProgressState.
 */
export type ProgressState = 'indeterminate' | 'loading' | 'complete';

/**
 * Properties for the ProgressRoot component.
 */
export interface ProgressRootProps extends PrimitiveWithBaseProps {
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
  /** The controlled progress value. Can be bind as `v-model`. */
  modelValue?: number | null;
  /** The maximum progress value. */
  max?: number;
  /** The accessible label of the current progress value. */
  getValueLabel?: (value: number | null | undefined, max: number) => string | undefined;
  /** The accessible text of the current progress value. */
  getValueText?: (value: number | null | undefined, max: number) => string | undefined;
}

/**
 * Events for the ProgressRoot component.
 */
export type ProgressRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: number | null | undefined];
  /**
   * Emitted when the max value changes.
   */
  'update:max': [value: number];
};

/**
 * Properties for the ProgressIndicator component.
 */
export interface ProgressIndicatorProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ProgressCircleSvg component.
 */
export interface ProgressCircleSvgProps extends BaseProps<SVGAttributes> {
  /**
   * Stroke width.
   */
  strokeWidth?: number;
}

/**
 * Slot properties for the Progress component family.
 */
export interface ProgressSlotProps {
  /**
   * Current model value.
   */
  modelValue: number | null | undefined;
  /**
   * Max used by the component.
   */
  max: number;
  /**
   * Progress state used by the component.
   */
  progressState: ProgressState;
  /**
   * Current progress percentage.
   */
  valuePercent: number | null;
}

/**
 * Properties for the ProgressCompact component.
 */
export interface ProgressCompactProps extends ProgressRootProps {
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: ProgressIndicatorProps;
}

/**
 * Events for the ProgressCompact component.
 */
export type ProgressCompactEmits = ProgressRootEmits;

/**
 * Slots for the ProgressCompact component.
 */
export type ProgressCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: ProgressSlotProps) => any;
};

/**
 * Properties for the ProgressCircleCompact component.
 */
export interface ProgressCircleCompactProps extends ProgressRootProps {
  /**
   * Stroke width.
   */
  strokeWidth?: number;
  /**
   * Properties forwarded to the ProgressCircleSvg component.
   */
  circleSvgProps?: ProgressCircleSvgProps;
}

/**
 * Events for the ProgressCircleCompact component.
 */
export type ProgressCircleCompactEmits = ProgressRootEmits;

/**
 * Slots for the ProgressCircleCompact component.
 */
export type ProgressCircleCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: ProgressSlotProps) => any;
};

/**
 * Properties for the ProgressProvider component.
 */
export interface ProgressProviderProps extends ProgressOptions {}

/**
 * Context for the ProgressRoot component.
 */
export interface ProgressRootContext {
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
  /**
   * Current model value.
   */
  modelValue: ComputedRef<number | null | undefined>;
  /**
   * Max used by the component context.
   */
  max: ComputedRef<number>;
  /**
   * Progress state used by the component context.
   */
  progressState: ComputedRef<ProgressState>;
  /**
   * Value percent used by the component context.
   */
  valuePercent: ComputedRef<number | null>;
}

/**
 * Available UI slots for the Progress component.
 */
export type ProgressUiSlot = 'root' | 'indicator' | 'circleSvg' | 'track' | 'label';

/**
 * UI class overrides for the Progress component.
 */
export type ProgressUi = UiClass<ProgressUiSlot>;

/**
 * Available UI slots for the ProgressProvider component.
 */
export type ProgressProviderUiSlot = 'root' | 'indicator';

/**
 * UI class overrides for the ProgressProvider component.
 */
export type ProgressProviderUi = UiClass<ProgressProviderUiSlot>;

/**
 * Type information for ProgressOptions.
 */
export interface ProgressOptions {
  /**
   * Direction.
   */
  direction?: Direction;
  /**
   * Minimum.
   */
  minimum?: number;
  /**
   * Maximum.
   */
  maximum?: number;
  /**
   * Easing.
   */
  easing?: string;
  /**
   * Speed.
   */
  speed?: number;
  /**
   * Whether trickle.
   */
  trickle?: boolean;
  /**
   * Trickle speed.
   */
  trickleSpeed?: number;
}
