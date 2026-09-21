import type { HTMLAttributes } from 'vue';
import type { BaseProps, ClassValue, UiClass } from '@vean/aria/types';
import type { BadgePosition } from '@/styles/badge';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the badge root element.
 */
export interface BadgeRootProps extends BaseProps<HTMLAttributes> {
  /**
   * Whether the component is open.
   */
  open?: boolean;
}

/**
 * Events for the badge root element.
 */
export type BadgeRootEmits = {
  /**
   * Emitted when the open state changes.
   */
  'update:open': [open: boolean];
};

/**
 * Properties for the badge content element.
 */
export interface BadgeContentProps extends BaseProps<HTMLAttributes> {}

/**
 * Available UI slots for the Badge component.
 */
export type BadgeUiSlot = 'root' | 'content';

/**
 * UI class overrides for the Badge component.
 */
export type BadgeUi = UiClass<BadgeUiSlot>;

/**
 * Properties for the Badge component.
 */
export interface BadgeProps extends BadgeRootProps {
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
   * Per-slot class overrides for the component.
   */
  ui?: Partial<BadgeUi>;
  /**
   * Position.
   */
  position?: BadgePosition;
  /**
   * Content rendered inside the badge bubble when no content slot is provided.
   */
  content?: string;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: BadgeContentProps;
}

/**
 * Events for the Badge component.
 */
export type BadgeEmits = BadgeRootEmits;

/**
 * Slots for the Badge component.
 */
export type BadgeSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the badge content slot.
   */
  content?: () => any;
};

export type { BadgePosition };
