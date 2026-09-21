import type { ShallowRef } from 'vue';
import type { SegmentValueObj, TimeRange, TimeValue } from '../../date';
import type { UiClass } from '../../types';
import type { DateFieldInputProps, DateFieldSegment } from '../date-field/types';
import type { TimeFieldRootProps, TimeFieldRootContext } from '../time-field/types';

/**
 * Properties for the TimeRangeFieldRoot component.
 */
export interface TimeRangeFieldRootProps extends Omit<TimeFieldRootProps, 'defaultValue' | 'modelValue'> {
  /**
   * Default value.
   */
  defaultValue?: TimeRange;
  /**
   * Current model value.
   */
  modelValue?: TimeRange;
  /**
   * Start name.
   */
  startName?: string;
  /**
   * End name.
   */
  endName?: string;
}

/**
 * Events for the TimeRangeFieldRoot component.
 */
export type TimeRangeFieldRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [range: TimeRange];
  /**
   * Emitted when the placeholder value changes.
   */
  'update:placeholder': [time: TimeValue];
  /**
   * Emitted when the start value changes.
   */
  'update:startValue': [time: TimeValue | null];
  /**
   * Emitted when the end value changes.
   */
  'update:endValue': [time: TimeValue | null];
};

/**
 * Slot Props for the TimeRangeField component.
 */
export interface TimeRangeFieldSlotProps {
  /**
   * Current model value.
   */
  modelValue: TimeRange;
  /**
   * Start segments.
   */
  startSegments: DateFieldSegment[];
  /**
   * End segments.
   */
  endSegments: DateFieldSegment[];
  /**
   * Whether the field is invalid.
   */
  isInvalid: boolean;
}

/**
 * Slots for the TimeRangeField component.
 */
export type TimeRangeFieldRootSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: TimeRangeFieldSlotProps) => any;
};

/**
 * Properties for the TimeRangeFieldInput component.
 */
export interface TimeRangeFieldInputProps extends DateFieldInputProps {
  /**
   * Type.
   */
  type?: 'start' | 'end';
}

/**
 * Context for the TimeRangeFieldRoot component.
 */
export interface TimeRangeFieldRootContext extends Pick<
  TimeFieldRootContext,
  'disabled' | 'readonly' | 'placeholder' | 'isInvalid' | 'formatter' | 'hourCycle' | 'step'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<TimeRange>;
  /**
   * Start segment values used by the component context.
   */
  startSegmentValues: ShallowRef<SegmentValueObj>;
  /**
   * End segment values used by the component context.
   */
  endSegmentValues: ShallowRef<SegmentValueObj>;
  /**
   * Focus next used by the component context.
   */
  focusNext: (type: 'start' | 'end') => void;
  /**
   * Set focused element used by the component context.
   */
  setFocusedElement: (el: HTMLElement, type: 'start' | 'end') => void;
}

/**
 * Available UI slots for the TimeRangeField component.
 */
export type TimeRangeFieldUiSlot = 'root' | 'startRoot' | 'endRoot' | 'input' | 'separator';
/**
 * UI class overrides for the TimeRangeField component.
 */
export type TimeRangeFieldUi = UiClass<TimeRangeFieldUiSlot>;

/**
 * Properties for the TimeRangeFieldCompact component.
 */
export interface TimeRangeFieldCompactProps extends TimeRangeFieldRootProps {
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: TimeRangeFieldInputProps;
  /**
   * Separator.
   */
  separator?: string;
}

/**
 * Events for the TimeRangeFieldCompact component.
 */
export type TimeRangeFieldCompactEmits = TimeRangeFieldRootEmits;

/**
 * Slots for the TimeRangeFieldCompact component.
 */
export type TimeRangeFieldCompactSlots = {
  /**
   * Custom content for the leading slot.
   */
  leading?: () => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: () => any;
  /**
   * Custom content for the separator slot.
   */
  separator?: () => any;
};
