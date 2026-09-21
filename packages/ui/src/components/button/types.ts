import type {
  ButtonEmits,
  ButtonGroupProps as _ButtonGroupProps,
  ButtonProps as _ButtonProps
} from '@vean/aria/button';
import type { Align, ClassValue, ToContext } from '@vean/aria/types';
import type { ButtonShadow, ButtonShape, ButtonVariant } from '@/styles/button';
import type { ThemeColor, ThemeSize } from '@/theme';
import type { IconValue, IconProps } from '../icon/types';
import type { LinkProps } from '../link/types';

/**
 * Properties for the Button component.
 */
export interface ButtonProps extends _ButtonProps {
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
  variant?: ButtonVariant;
  /**
   * Shape of the component.
   */
  shape?: ButtonShape;
  /**
   * Shadow style of the component.
   */
  shadow?: ButtonShadow;
  /**
   * Whether the component should fit its content width.
   */
  fitContent?: boolean;
}

/**
 * Properties for the ButtonIcon component.
 */
export interface ButtonIconProps extends ButtonProps {
  /** The icon value of iconify. */
  icon: IconValue;
  /**
   * The class of the icon.
   */
  iconClass?: ClassValue;
  /** The props of the icon. */
  iconProps?: Partial<IconProps>;
}

/**
 * Properties for the ButtonLoading component.
 */
export interface ButtonLoadingProps extends ButtonProps {
  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;
  /**
   * The text to display when the button is loading.
   *
   * It will be displayed when the loading position is center.
   */
  loadingText?: string;
  /**
   * The duration of the loading state in milliseconds.
   *
   * @default 150 ms
   */
  loadingDuration?: number;
  /**
   * Whether to automatically handle loading state during click event. When true, the button will show loading state
   * during click event execution. When false, you need to manually control the loading state.
   *
   * @default false
   */
  autoLoading?: boolean;
  /**
   * The icon name of iconify to display when the button is loading.
   *
   * @default 'svg-spinners:270-ring'
   */
  loadingIcon?: IconValue;
  /** The props of the loading icon. */
  loadingIconProps?: Partial<IconProps>;
  /**
   * The position of the loading icon.
   *
   * @default 'start'
   */
  loadingPosition?: Align;
}

/**
 * Properties for the ButtonLink component.
 */
export type ButtonLinkProps = ButtonProps & LinkProps;

/**
 * Properties for the ButtonGroup component.
 */
export interface ButtonGroupProps extends _ButtonGroupProps {
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
  variant?: ButtonVariant;
  /**
   * Shape of the component.
   */
  shape?: ButtonShape;
  /**
   * Shadow style of the component.
   */
  shadow?: ButtonShadow;
  /**
   * Whether the component should fit its content width.
   */
  fitContent?: boolean;
  /**
   * Whether all descendant buttons are disabled.
   */
  disabled?: boolean;
}

/**
 * Context for the ButtonGroup component.
 */
export interface ButtonGroupContext extends ToContext<
  ButtonGroupProps,
  'color' | 'size' | 'variant' | 'shape' | 'shadow' | 'disabled' | 'fitContent'
> {}

export type { ButtonEmits, ButtonVariant, ButtonShape, ButtonShadow };
