import type { HTMLAttributes } from 'vue';
import type {
  CollapsibleContentProps,
  CollapsibleRootEmits,
  CollapsibleRootProps,
  CollapsibleTriggerProps
} from '@vean/aria/collapsible';
import type { BaseProps, ClassValue, UiClass } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the card root element. The card composes `CollapsibleRoot`, so the
 * collapsible open/disabled contract is shared with the collapsible family.
 */
export interface CardRootProps extends CollapsibleRootProps {}

/**
 * Events for the card root element.
 */
export type CardRootEmits = CollapsibleRootEmits;

/**
 * Properties for the card header element.
 */
export interface CardHeaderProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the card content element.
 */
export interface CardContentProps extends CollapsibleContentProps {}

/**
 * Properties for the card footer element.
 */
export interface CardFooterProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the card title root element.
 */
export interface CardTitleRootProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the card title element.
 */
export interface CardTitleProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the card description element.
 */
export interface CardDescriptionProps extends BaseProps<HTMLAttributes> {}

/**
 * Properties for the card collapsible trigger element.
 */
export interface CardCollapsibleTriggerProps extends CollapsibleTriggerProps {}

/**
 * Available UI slots for the Card component.
 */
export type CardUiSlot = 'root' | 'header' | 'content' | 'footer' | 'titleRoot' | 'title' | 'description' | 'trigger';

/**
 * UI class overrides for the Card component.
 */
export type CardUi = UiClass<CardUiSlot>;

/**
 * Properties for the Card component.
 */
export interface CardProps extends CardRootProps {
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
  ui?: Partial<CardUi>;
  /**
   * If true, the content will be scrollable when the root has height and content is taller than the root
   *
   * @default false
   */
  scrollable?: boolean;
  /**
   * If true, the card will add divider between title and content and footer
   *
   * @default false
   */
  split?: boolean;
  /**
   * Title text rendered by the component.
   */
  title?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
  /**
   * Properties forwarded to the header element.
   */
  headerProps?: CardHeaderProps;
  /**
   * Properties forwarded to the content element.
   */
  contentProps?: CardContentProps;
  /**
   * Properties forwarded to the footer element.
   */
  footerProps?: CardFooterProps;
  /**
   * Properties forwarded to the title root element.
   */
  titleRootProps?: CardTitleRootProps;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: CardTitleProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: CardDescriptionProps;
}

/**
 * Events for the Card component.
 */
export type CardEmits = CardRootEmits;

/**
 * Slots for the Card component.
 */
export type CardSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the header slot.
   */
  header?: () => any;
  /**
   * Custom content for the title slot.
   */
  title?: () => any;
  /**
   * Custom content for the title leading slot.
   */
  'title-leading'?: () => any;
  /**
   * Custom content for the title trailing slot.
   */
  'title-trailing'?: () => any;
  /**
   * Custom content for the extra slot.
   */
  extra?: () => any;
  /**
   * Custom content for the footer slot.
   */
  footer?: () => any;
  /**
   * Custom content for the description slot.
   */
  description?: () => any;
};
