import type { HTMLAttributes } from 'vue';
import type { BaseProps, ClassValue, UiClass } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';
import type { IconValue } from '../icon/types';

/**
 * Properties for the empty root element.
 */
export interface EmptyRootProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the empty header element.
 */
export interface EmptyHeaderProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the empty media element.
 */
export interface EmptyMediaProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the empty content element.
 */
export interface EmptyContentProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the empty title element.
 */
export interface EmptyTitleProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the empty description element.
 */
export interface EmptyDescriptionProps extends BaseProps<HTMLAttributes> {}

/**
 * Available UI slots for the Empty component.
 */
export type EmptyUiSlot = 'root' | 'header' | 'media' | 'content' | 'title' | 'description';

/**
 * UI class overrides for the Empty component.
 */
export type EmptyUi = UiClass<EmptyUiSlot>;

/**
 * Properties for the Empty component.
 */
export interface EmptyProps extends EmptyRootProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<EmptyUi>;
  /**
   * Size variant of the component.
   */
  size?: ThemeSize;
  /**
   * Title text rendered by the component.
   */
  title?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
  /**
   * Icon rendered by the component.
   */
  icon?: IconValue;
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: EmptyHeaderProps;
  /**
   * Properties forwarded to the media element.
   */
  mediaProps?: EmptyMediaProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: EmptyContentProps;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: EmptyTitleProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: EmptyDescriptionProps;
}

/**
 * Slots for the Empty component.
 */
export type EmptySlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the media slot.
   */
  media?: () => any;
  /**
   * Custom content for the title slot.
   */
  title?: () => any;
  /**
   * Custom content for the description slot.
   */
  description?: () => any;
  /**
   * Custom content for the content slot.
   */
  content?: () => any;
};
