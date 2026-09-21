import type { BaseProps, UiClass } from '../../types';
import type { IconValue } from '../_icon/types';
import type { LinkBaseProps, LinkExtraProps, LinkProps } from '../link/types';

/**
 * Properties for the BreadcrumbRoot component.
 */
export interface BreadcrumbRootProps extends BaseProps {}

/**
 * Properties for the BreadcrumbList component.
 */
export interface BreadcrumbListProps extends BaseProps {}

/**
 * Properties for the BreadcrumbItem component.
 */
export interface BreadcrumbItemProps extends BaseProps {}

/**
 * Properties for the BreadcrumbPage component.
 */
export interface BreadcrumbPageProps extends BaseProps {}

/**
 * Properties for the BreadcrumbSeparator component.
 */
export interface BreadcrumbSeparatorProps extends BaseProps {}

/**
 * Properties for the BreadcrumbEllipsis component.
 */
export interface BreadcrumbEllipsisProps extends BaseProps {}

/**
 * Properties for the BreadcrumbLink component.
 */
export interface BreadcrumbLinkProps extends LinkProps {}

/**
 * Option data for the Breadcrumb component.
 */
export interface BreadcrumbOptionData extends LinkBaseProps {
  /** The value of the option. */
  value?: string;
  /** The label to display in the option. */
  label: string;
  /** The icon of the option. */
  icon?: IconValue;
  /** Whether the option is disabled. */
  disabled?: boolean;
}

/**
 * Properties for the BreadcrumbCompact component.
 */
export interface BreadcrumbCompactProps<T extends BreadcrumbOptionData = BreadcrumbOptionData> extends Omit<
  BreadcrumbRootProps,
  'onClick'
> {
  /**
   * Items rendered by the component.
   */
  items: T[];
  /**
   * The range of items to show ellipsis.
   *
   * When the item count is greater than 4, we will show ellipsis.
   */
  ellipsis?: true | [number, number] | null;
  /**
   * Properties forwarded to the list element.
   */
  listProps?: BreadcrumbListProps;
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: BreadcrumbItemProps;
  /**
   * Properties forwarded to the link element.
   */
  linkProps?: LinkExtraProps;
  /**
   * Properties forwarded to the page element.
   */
  pageProps?: BreadcrumbPageProps;
  /**
   * Properties forwarded to the separator element.
   */
  separatorProps?: BreadcrumbSeparatorProps;
  /**
   * Properties forwarded to the ellipsis element.
   */
  ellipsisProps?: BreadcrumbEllipsisProps;
}

/**
 * Events for the BreadcrumbCompact component.
 */
export type BreadcrumbCompactEmits<T extends BreadcrumbOptionData = BreadcrumbOptionData> = {
  /**
   * Emitted when click occurs.
   */
  click: [item: T];
};

/**
 * Slot properties for the BreadcrumbCompactItem component.
 */
export interface BreadcrumbCompactItemSlotProps<T extends BreadcrumbOptionData = BreadcrumbOptionData> {
  /**
   * Current item data.
   */
  item: T;
  /**
   * Index of the current item.
   */
  index: number;
}

/**
 * Slot properties for the BreadcrumbCompactEllipsis component.
 */
export interface BreadcrumbCompactEllipsisSlotProps<T extends BreadcrumbOptionData = BreadcrumbOptionData> {
  /**
   * Ellipsis items exposed in the slot scope.
   */
  ellipsisItems: T[];
}

/**
 * Slots for the BreadcrumbCompact component.
 */
export type BreadcrumbCompactSlots<T extends BreadcrumbOptionData = BreadcrumbOptionData> = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: BreadcrumbCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the ellipsis slot.
   */
  ellipsis?: (props: BreadcrumbCompactEllipsisSlotProps<T>) => any;
  /**
   * Custom content for the ellipsis icon slot.
   */
  'ellipsis-icon'?: () => any;
  /**
   * Custom content for the separator slot.
   */
  separator?: () => any;
  /**
   * Custom content for the item leading slot.
   */
  'item-leading'?: (props: BreadcrumbCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item link slot.
   */
  'item-link'?: (props: BreadcrumbCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item label slot.
   */
  'item-label'?: (props: BreadcrumbCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the item trailing slot.
   */
  'item-trailing'?: (props: BreadcrumbCompactItemSlotProps<T>) => any;
};

/**
 * Available UI slots for the Breadcrumb component.
 */
export type BreadcrumbUiSlot = 'root' | 'list' | 'item' | 'page' | 'separator' | 'ellipsis' | 'link';

/**
 * UI class overrides for the Breadcrumb component.
 */
export type BreadcrumbUi = UiClass<BreadcrumbUiSlot>;
