import type { ComputedRef } from 'vue';
import type { DataOrientation, DefinedValue, Direction, UiClass } from '../../types';
import type { ButtonEmits, ButtonProps } from '../button/types';
import type { LinkProps } from '../link/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { SeparatorRootProps } from '../separator/types';
import type {
  ToggleGroupItemProps as BaseToggleGroupItemProps,
  ToggleGroupRootEmits as BaseToggleGroupRootEmits,
  ToggleGroupRootProps as BaseToggleGroupRootProps
} from '../toggle-group/types';

/**
 * Properties for the ToolbarRoot component.
 */
export interface ToolbarRootProps extends PrimitiveWithBaseProps {
  /** The orientation of the toolbar. */
  orientation?: DataOrientation;
  /** The reading direction of the toolbar. */
  dir?: Direction;
  /** Whether keyboard roving focus loops. */
  loop?: boolean;
}

/**
 * Context for the ToolbarRoot component.
 */
export interface ToolbarRootContext {
  /**
   * Orientation of the component.
   */
  orientation: ComputedRef<DataOrientation>;
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction>;
}

/**
 * Parameters used to create the ToolbarRoot context.
 */
export interface ToolbarRootContextParams {
  /**
   * Orientation of the component.
   */
  orientation: ComputedRef<DataOrientation>;
  /**
   * Reading direction of the component.
   */
  dir: ComputedRef<Direction | undefined>;
}

/**
 * Available UI slots for the Toolbar component.
 */
export type ToolbarUiSlot = 'root' | 'button' | 'link' | 'linkIcon' | 'separator' | 'toggleGroup' | 'toggleItem';

/**
 * UI class overrides for the Toolbar component.
 */
export type ToolbarUi = UiClass<ToolbarUiSlot>;

/**
 * Properties for the ToolbarButton component.
 */
export interface ToolbarButtonProps extends ButtonProps {}

/**
 * Events for the ToolbarButton component.
 */
export type ToolbarButtonEmits = ButtonEmits;

/**
 * Properties for the ToolbarLink component.
 */
export interface ToolbarLinkProps extends LinkProps {
  /**
   * Whether or not to show an icon when the `href` prop is provided.
   */
  showIcon?: boolean;
}

/**
 * Properties for the ToolbarSeparator component.
 */
export interface ToolbarSeparatorProps extends Omit<SeparatorRootProps, 'orientation'> {}

/**
 * Properties for the ToolbarToggleGroup component.
 */
export interface ToolbarToggleGroupProps<
  M extends boolean = false,
  T extends DefinedValue = string
> extends BaseToggleGroupRootProps<M, T> {}

/**
 * Events for the ToolbarToggleGroup component.
 */
export type ToolbarToggleGroupEmits<
  M extends boolean = false,
  T extends DefinedValue = string
> = BaseToggleGroupRootEmits<M, T>;

/**
 * Properties for the ToolbarToggleItem component.
 */
export interface ToolbarToggleItemProps<T extends DefinedValue = string> extends BaseToggleGroupItemProps<T> {}
