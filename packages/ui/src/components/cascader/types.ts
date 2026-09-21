import type { CascaderCompactEmits, CascaderCompactProps, CascaderCompactSlots, CascaderUi } from '@vean/aria/cascader';
import type { ClassValue, DefinedValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Cascader component.
 */
export interface CascaderProps<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> extends CascaderCompactProps<T, M, P> {
  /**
   * the class of cascader trigger
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<CascaderUi>;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
}

/**
 * Events for the Cascader component.
 */
export type CascaderEmits<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> = CascaderCompactEmits<T, M, P>;

/**
 * Slots for the Cascader component.
 */
export type CascaderSlots<
  T extends DefinedValue = DefinedValue,
  M extends boolean = false,
  P extends boolean = false
> = CascaderCompactSlots<T, M, P>;
