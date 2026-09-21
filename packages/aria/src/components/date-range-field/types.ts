import type { ShallowRef } from 'vue';
import type { DateRange, DateValue, SegmentValueObj } from '../../date';
import type { UiClass } from '../../types';
import type {
  DateFieldRootProps,
  DateFieldInputProps,
  DateFieldSegment,
  DateFieldRootContext
} from '../date-field/types';

/**
 * Properties for the DateRangeFieldRoot component.
 */
export interface DateRangeFieldRootProps extends Omit<DateFieldRootProps, 'modelValue' | 'defaultValue'> {
  /**
   * Default value.
   */
  defaultValue?: DateRange;
  /**
   * Current model value.
   */
  modelValue?: DateRange;
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
 * Events for the DateRangeFieldRoot component.
 */
export type DateRangeFieldRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [range: DateRange];
  /**
   * Emitted when the placeholder value changes.
   */
  'update:placeholder': [date: DateValue];
  /**
   * Emitted when the start value changes.
   */
  'update:startValue': [date: DateValue | null];
  /**
   * Emitted when the end value changes.
   */
  'update:endValue': [date: DateValue | null];
};

/**
 * Slot properties for the DateRangeField component.
 */
export interface DateRangeFieldSlotProps {
  /**
   * Start segments used by the component context.
   */
  startSegments: DateFieldSegment[];
  /**
   * End segments used by the component context.
   */
  endSegments: DateFieldSegment[];
  /**
   * Current model value.
   */
  modelValue: DateRange;
  /**
   * Whether the date is invalid.
   */
  isInvalid: boolean;
}

/**
 * Slots for the DateRangeFieldRoot component.
 */
export type DateRangeFieldRootSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: DateRangeFieldSlotProps) => any;
};

export type DateRangeType = 'start' | 'end';

/**
 * Properties for the DateRangeFieldInput component.
 */
export interface DateRangeFieldInputProps extends DateFieldInputProps {
  /**
   * Type.
   */
  type?: DateRangeType;
}

/**
 * Context for the DateRangeFieldRoot component.
 */
export interface DateRangeFieldRootContext extends Pick<
  DateFieldRootContext,
  'disabled' | 'readonly' | 'placeholder' | 'isInvalid' | 'formatter' | 'hourCycle' | 'step'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DateRange>;
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
  focusNext: (type: DateRangeType) => void;
  /**
   * Set focused element used by the component context.
   */
  setFocusedElement: (el: HTMLElement, type: DateRangeType) => void;
}

/**
 * Available UI slots for the DateRangeField component.
 */
export type DateRangeFieldUiSlot = 'root' | 'input' | 'startRoot' | 'endRoot' | 'separator';
/**
 * UI class overrides for the DateRangeField component.
 */
export type DateRangeFieldUi = UiClass<DateRangeFieldUiSlot>;

/**
 * Properties for the DateRangeFieldCompact component.
 */
export interface DateRangeFieldCompactProps extends DateRangeFieldRootProps {
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: DateRangeFieldInputProps;
  /**
   * Separator.
   */
  separator?: string;
}

/**
 * Events for the DateRangeFieldCompact component.
 */
export type DateRangeFieldCompactEmits = DateRangeFieldRootEmits;

/**
 * Slots for the DateRangeFieldCompact component.
 */
export type DateRangeFieldCompactSlots = {
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
