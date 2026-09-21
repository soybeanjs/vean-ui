import type { IconProps as IconifyIconProps } from '@iconify/vue';
import type { IconValue } from '@vean/aria';

/**
 * Properties for the Icon component.
 */
export interface IconProps extends Omit<IconifyIconProps, 'icon'> {
  /**
   * Icon rendered by the component.
   */
  icon: IconValue;
  /**
   * Whether the icon is hidden from assistive technology.
   *
   * Defaults to `true` for decorative icons. Set to `false` or provide `ariaLabel` / `ariaLabelledby` to expose the icon.
   */
  ariaHidden?: boolean;
  /**
   * Accessible label for the icon. When provided, `aria-hidden` is not set so the label is announced.
   */
  ariaLabel?: string;
  /**
   * ID of an element that labels the icon. When provided, `aria-hidden` is not set so the label is announced.
   */
  ariaLabelledby?: string;
}

export type { IconValue };
