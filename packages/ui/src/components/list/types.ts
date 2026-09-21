import type { HTMLAttributes } from 'vue';
import type { BaseProps, ClassValue, UiClass } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the list root element.
 */
export interface ListRootProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the list content element.
 */
export interface ListContentProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the list title element.
 */
export interface ListTitleProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the list description element.
 */
export interface ListDescriptionProps extends BaseProps<HTMLAttributes> {}

/**
 * Available UI slots for the List component.
 */
export type ListUiSlot = 'root' | 'item' | 'content' | 'title' | 'description';

/**
 * UI class overrides for the List component.
 */
export type ListUi = UiClass<ListUiSlot>;

/**
 * Properties for the List component.
 */
export interface ListProps extends ListRootProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ListUi>;
}

/**
 * Properties for the ListItem component.
 */
export interface ListItemProps extends BaseProps<HTMLAttributes> {
  /**
   * Additional class names applied to the item element.
   */
  class?: ClassValue;
  /**
   * Title text rendered by the component.
   */
  title?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: ListContentProps;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: ListTitleProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: ListDescriptionProps;
}

/**
 * Slots for the ListItem component.
 */
export type ListItemSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the leading slot.
   */
  leading?: () => any;
  /**
   * Custom content for the title slot.
   */
  title?: () => any;
  /**
   * Custom content for the description slot.
   */
  description?: () => any;
  /**
   * Custom content for the trailing slot.
   */
  trailing?: () => any;
};
