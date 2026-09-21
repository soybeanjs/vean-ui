import type { ComputedRef, ShallowRef } from 'vue';
import type { TimeGranularity, TimeInputType, TimeMatcher, TimeValue } from '../../date';
import type { UiClass } from '../../types';
import type {
  DateFieldRootProps,
  DateFieldInputProps as TimeFieldInputProps,
  DateFieldSegment,
  DateFieldRootContext
} from '../date-field/types';

/**
 * Properties for the TimeFieldRoot component.
 */
export interface TimeFieldRootProps extends Omit<
  DateFieldRootProps,
  | 'modelValue'
  | 'defaultValue'
  | 'placeholder'
  | 'defaultPlaceholder'
  | 'granularity'
  | 'maxValue'
  | 'minValue'
  | 'isDateUnavailable'
> {
  /**
   * Default value for the time field.
   */
  defaultValue?: TimeValue;
  /**
   * Current model value.
   */
  modelValue?: TimeValue;
  /**
   * Default placeholder.
   */
  defaultPlaceholder?: TimeValue;
  /**
   * Placeholder.
   */
  placeholder?: TimeValue;
  /**
   * Granularity.
   */
  granularity?: TimeGranularity;
  /**
   * Max value.
   */
  maxValue?: TimeValue;
  /**
   * Min value.
   */
  minValue?: TimeValue;
  /**
   * Whether the time is unavailable.
   */
  isTimeUnavailable?: TimeMatcher;
}

/**
 * Events for the TimeFieldRoot component.
 */
export type TimeFieldRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [time: TimeValue | undefined];
  /**
   * Emitted when the placeholder value changes.
   */
  'update:placeholder': [time: TimeValue];
};

/**
 * Slot properties for the TimeFieldRoot component.
 */
export interface TimeFieldRootSlotProps {
  /**
   * Current model value.
   */
  modelValue: TimeValue | undefined;
  /**
   * Segments used by the default slot.
   */
  segments: DateFieldSegment[];
  /**
   * Whether the current value is invalid.
   */
  isInvalid: boolean;
}

/**
 * Slots for the TimeFieldRoot component.
 */
export type TimeFieldRootSlots = {
  default?: (props: TimeFieldRootSlotProps) => any;
};

/**
 * Context for the TimeFieldRoot component.
 */
export interface TimeFieldRootContext extends Pick<
  DateFieldRootContext,
  | 'disabled'
  | 'readonly'
  | 'isInvalid'
  | 'formatter'
  | 'hourCycle'
  | 'step'
  | 'segmentValues'
  | 'focusNext'
  | 'setFocusedElement'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<TimeValue | undefined>;
  /**
   * Placeholder used by the component context.
   */
  placeholder: ShallowRef<TimeValue>;
  /**
   * Whether the time is unavailable.
   */
  isTimeUnavailable?: TimeMatcher;
  /**
   * Input type used by the component context.
   */
  inputType: ComputedRef<TimeInputType>;
}

/**
 * Properties for the time field compact component.
 */
export interface TimeFieldCompactProps extends TimeFieldRootProps {
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: TimeFieldInputProps;
}

/**
 * Slots for the TimeFieldCompact component.
 */
export type TimeFieldCompactSlots = {
  /**
   * Content rendered before the time segments.
   */
  leading?: () => any;
  /**
   * Content rendered after the time segments.
   */
  trailing?: () => any;
};

/**
 * Events for the time field compact component.
 */
export type TimeFieldCompactEmits = TimeFieldRootEmits;

/**
 * Available UI slots for the TimeField component.
 */
export type TimeFieldUiSlot = 'root' | 'input';
/**
 * UI class overrides for the TimeField component.
 */
export type TimeFieldUi = UiClass<TimeFieldUiSlot>;

export type { TimeFieldInputProps, TimeValue };
