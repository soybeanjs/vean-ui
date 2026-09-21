import type {
  CheckboxCompactProps,
  CheckboxCompactEmits,
  CheckboxCardCompactProps,
  CheckboxCardCompactEmits,
  CheckboxGroupCompactProps,
  CheckboxGroupCompactEmits,
  CheckboxCardGroupCompactProps,
  CheckboxCardGroupCompactEmits,
  CheckboxGroupOptionData,
  CheckboxCardGroupOptionData,
  CheckboxUi,
  CheckboxCardUi
} from '@vean/aria/checkbox';
import type { ClassValue, DefinedValue } from '@vean/aria/types';
import type { CheckboxShape } from '@/styles/checkbox';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Checkbox component.
 */
export interface CheckboxProps extends CheckboxCompactProps {
  /**
   * the class of root element
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CheckboxUi>;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Shape of the component.
   */
  shape?: CheckboxShape;
}

/**
 * Events for the Checkbox component.
 */
export type CheckboxEmits = CheckboxCompactEmits;

/**
 * Properties for the CheckboxCard component.
 */
export interface CheckboxCardProps extends CheckboxCardCompactProps {
  /**
   * the class of root element
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CheckboxCardUi>;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Shape of the component.
   */
  shape?: CheckboxShape;
  /**
   * Icon rendered by the component.
   */
  icon?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
}

/**
 * Events for the CheckboxCard component.
 */
export type CheckboxCardEmits = CheckboxCardCompactEmits;

/**
 * Properties for the CheckboxGroup component.
 */
export interface CheckboxGroupProps<
  T extends CheckboxGroupOptionData = CheckboxGroupOptionData
> extends CheckboxGroupCompactProps<T> {
  /**
   * the class of group root element
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CheckboxUi>;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Shape of the component.
   */
  shape?: CheckboxShape;
}

/**
 * Events for the CheckboxGroup component.
 */
export type CheckboxGroupEmits<T extends DefinedValue = DefinedValue> = CheckboxGroupCompactEmits<T>;

/**
 * Properties for the CheckboxCardGroup component.
 */
export interface CheckboxCardGroupProps<
  T extends CheckboxCardGroupOptionData = CheckboxCardGroupOptionData
> extends CheckboxCardGroupCompactProps<T> {
  /**
   * the class of group root element
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CheckboxCardUi>;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Shape of the component.
   */
  shape?: CheckboxShape;
}

/**
 * Events for the CheckboxCardGroup component.
 */
export type CheckboxCardGroupEmits<T extends DefinedValue = DefinedValue> = CheckboxCardGroupCompactEmits<T>;

export type { CheckboxGroupOptionData, CheckboxCardGroupOptionData };
