import type {
  RadioGroupCompactProps,
  RadioGroupCompactEmits,
  RadioGroupOptionData,
  RadioGroupCardCompactProps,
  RadioGroupCardCompactEmits,
  RadioGroupCardCompactSlots,
  RadioGroupCardOptionData,
  RadioGroupUi,
  RadioGroupCardUi
} from '@vean/aria/radio-group';
import type { DefinedWithBooleanValue, ClassValue } from '@vean/aria/types';
import type { RadioGroupVariant } from '@/styles/radio-group';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the RadioGroup component.
 */
export interface RadioGroupProps<
  T extends RadioGroupOptionData = RadioGroupOptionData
> extends RadioGroupCompactProps<T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual variant of the component.
   */
  variant?: RadioGroupVariant;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<RadioGroupUi>;
}

/**
 * Events for the RadioGroup component.
 */
export type RadioGroupEmits<T extends DefinedWithBooleanValue = DefinedWithBooleanValue> = RadioGroupCompactEmits<T>;

/**
 * Properties for the RadioGroupCard component.
 */
export interface RadioGroupCardProps<
  T extends RadioGroupCardOptionData = RadioGroupCardOptionData
> extends RadioGroupCardCompactProps<T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual variant of the component.
   */
  variant?: RadioGroupVariant;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<RadioGroupCardUi>;
}

/**
 * Events for the RadioGroupCard component.
 */
export type RadioGroupCardEmits<T extends DefinedWithBooleanValue = DefinedWithBooleanValue> =
  RadioGroupCardCompactEmits<T>;

/**
 * Slots for the RadioGroupCard component.
 */
export type RadioGroupCardSlots<T extends RadioGroupCardOptionData = RadioGroupCardOptionData> =
  RadioGroupCardCompactSlots<T>;
