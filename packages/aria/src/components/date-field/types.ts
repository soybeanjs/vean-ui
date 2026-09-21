import type { ComputedRef, ShallowRef } from 'vue';
import type { DateValue, DateStep, Granularity, Formatter, HourCycle, SegmentPart, SegmentValueObj } from '../../date';
import type { FormFieldCommonProps, ToContext, UiClass } from '../../types';
import type { CalendarRootProps } from '../calendar/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Type information for DateFieldSegment.
 */
export interface DateFieldSegment {
  /**
   * Part.
   */
  part: SegmentPart;
  /**
   * Value associated with the current item.
   */
  value: string;
}

/**
 * Properties for the DateFieldRoot component.
 */
export interface DateFieldRootProps
  extends
    FormFieldCommonProps,
    Pick<
      CalendarRootProps<false>,
      | 'dir'
      | 'locale'
      | 'modelValue'
      | 'defaultValue'
      | 'placeholder'
      | 'defaultPlaceholder'
      | 'disabled'
      | 'readonly'
      | 'maxValue'
      | 'minValue'
      | 'isDateUnavailable'
    >,
    Omit<PrimitiveWithBaseProps, 'dir' | 'placeholder'> {
  /**
   * Id.
   */
  id?: string;
  /**
   * Granularity.
   */
  granularity?: Granularity;
  /**
   * Hour cycle.
   */
  hourCycle?: HourCycle;
  /**
   * Step.
   */
  step?: DateStep;
  /**
   * Whether hide time zone.
   */
  hideTimeZone?: boolean;
}

/**
 * Events for the DateFieldRoot component.
 */
export type DateFieldRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: DateValue | undefined];
  /**
   * Emitted when the placeholder value changes.
   */
  'update:placeholder': [value: DateValue];
};

/**
 * Properties for the DateFieldRoot slot.
 */
export interface DateFieldRootSlotProps {
  /**
   * Current model value.
   */
  modelValue: DateValue | undefined;
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
 * Slots for the DateFieldRoot component.
 */
export type DateFieldRootSlots = {
  default?: (props: DateFieldRootSlotProps) => any;
};

/**
 * Properties for the DateFieldInput component.
 */
export interface DateFieldInputProps extends PrimitiveWithBaseProps {
  /**
   * Part.
   */
  part: SegmentPart;
}

/**
 * Context for the DateFieldRoot component.
 */
export interface DateFieldRootContext extends ToContext<DateFieldRootProps, 'disabled' | 'readonly'> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<DateValue | undefined>;
  /**
   * Placeholder used by the component context.
   */
  placeholder: ShallowRef<DateValue>;
  /**
   * Whether the current value is invalid.
   */
  isInvalid: ComputedRef<boolean>;
  /**
   * Formatter used by the component context.
   */
  formatter: Formatter;
  /**
   * Hour cycle used by the component context.
   */
  hourCycle: HourCycle;
  /**
   * Step used by the component context.
   */
  step: ComputedRef<DateStep>;
  /**
   * Segment values used by the component context.
   */
  segmentValues: ShallowRef<SegmentValueObj>;
  /**
   * Focus next used by the component context.
   */
  focusNext: () => void;
  /**
   * Set focused element used by the component context.
   */
  setFocusedElement: (el: HTMLElement) => void;
}

/**
 * Properties for the DateFieldCompact component.
 */
export interface DateFieldCompactProps extends DateFieldRootProps {
  /**
   * Properties forwarded to the input element.
   */
  inputProps?: DateFieldInputProps;
}

/**
 * Events for the DateFieldCompact component.
 */
export type DateFieldCompactEmits = DateFieldRootEmits;

/**
 * Available UI slots for the DateField component.
 */
export type DateFieldUiSlot = 'root' | 'input';
/**
 * UI class overrides for the DateField component.
 */
export type DateFieldUi = UiClass<DateFieldUiSlot>;
