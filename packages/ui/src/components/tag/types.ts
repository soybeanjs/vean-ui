import type { BaseProps, ClassValue } from '@vean/aria/types';
import type { TagShape, TagVariant } from '@/styles/tag';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Tag component.
 */
export interface TagProps extends BaseProps {
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
  variant?: TagVariant;
  /**
   * Shape of the component.
   */
  shape?: TagShape;
  /**
   * Content.
   */
  content?: string;
  /**
   * Whether the component can be closed.
   */
  closable?: boolean;
  /**
   * Whether the component is open. Controlled when provided.
   */
  open?: boolean;
}

/**
 * Events for the Tag component.
 */
export type TagEmits = {
  /**
   * Emitted when the open state changes.
   */
  'update:open': [open: boolean];
};

export type { TagVariant, TagShape };
