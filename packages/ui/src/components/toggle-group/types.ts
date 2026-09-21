import type {
  ToggleGroupRootEmits as AriaToggleGroupRootEmits,
  ToggleGroupRootProps as AriaToggleGroupRootProps,
  ToggleGroupUi
} from '@vean/aria/toggle-group';
import type { ClassValue, DefinedValue } from '@vean/aria/types';
import type { ToggleGroupVariant } from '@/styles/toggle-group';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the ToggleGroup component.
 */
export interface ToggleGroupProps<
  M extends boolean = false,
  T extends DefinedValue = string
> extends AriaToggleGroupRootProps<M, T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Visual variant of the component.
   */
  variant?: ToggleGroupVariant;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ToggleGroupUi>;
}

/**
 * Events for the ToggleGroup component.
 */
export type ToggleGroupEmits<M extends boolean = false, T extends DefinedValue = string> = AriaToggleGroupRootEmits<
  M,
  T
>;

export type { ToggleGroupVariant };
