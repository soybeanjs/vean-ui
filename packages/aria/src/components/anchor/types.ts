import type { HTMLAttributes, ShallowRef } from 'vue';
import type { BaseProps, DataOrientation, Direction, ToContext, UiClass } from '../../types';
import type { LinkBaseProps } from '../link/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Type information for AnchorContainer.
 */
export type AnchorContainer = HTMLElement | Window;

/**
 * Type information for AnchorHistoryMode.
 */
export type AnchorHistoryMode = 'push' | 'replace';

/**
 * Type information for AnchorSection.
 */
export interface AnchorSection {
  /**
   * The link of anchor
   */
  href: string;
  /**
   * anchor top position
   */
  top: number;
}

/**
 * Properties for the AnchorRoot component.
 */
export interface AnchorRootProps extends PrimitiveWithBaseProps {
  /**
   * Bounds.
   */
  bounds?: number;
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
  /**
   * Get container.
   */
  getContainer?: () => AnchorContainer | null;
  /**
   * Get current anchor.
   */
  getCurrentAnchor?: (activeHref: string) => string;
  /**
   * Current model value.
   */
  modelValue?: string;
  /**
   * Offset top.
   */
  offsetTop?: number;
  /**
   * Orientation of the component.
   */
  orientation?: DataOrientation;
  /**
   * Whether replace.
   */
  replace?: boolean;
  /**
   * Target offset.
   */
  targetOffset?: number;
}

/**
 * Events for the AnchorRoot component.
 */
export type AnchorRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when active change occurs.
   */
  activeChange: [value: string];
  /**
   * Emitted when item select occurs.
   */
  itemSelect: [event: MouseEvent, payload: { href: string }];
};

/**
 * Properties for the AnchorLink component.
 */
export interface AnchorLinkProps extends LinkBaseProps, PrimitiveWithBaseProps {
  /**
   * The link of anchor
   */
  href: string;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

/**
 * Option data for the Anchor component.
 */
export interface AnchorOptionData extends Pick<AnchorLinkProps, 'disabled' | 'href' | 'target'> {
  /**
   * Nested child items.
   */
  children?: AnchorOptionData[];
  /**
   * Title text rendered by the component.
   */
  title?: string;
}

/**
 * Properties for the AnchorItemCompact component.
 */
export interface AnchorItemCompactProps extends BaseProps {
  /**
   * Current model value.
   */
  modelValue?: string;
  /**
   * Current item data.
   */
  item: AnchorOptionData;
  /**
   * Properties forwarded to the link element.
   */
  linkProps?: Omit<AnchorLinkProps, 'href'>;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: HTMLAttributes;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: HTMLAttributes;
  /**
   * Properties forwarded to the sub element.
   */
  subProps?: HTMLAttributes;
}

/**
 * Properties for the AnchorCompact component.
 */
export interface AnchorCompactProps extends AnchorRootProps {
  /**
   * Items rendered by the component.
   */
  items: AnchorOptionData[];
  /**
   * Properties forwarded to the link element.
   */
  linkProps?: Omit<AnchorLinkProps, 'href'>;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: HTMLAttributes;
  /**
   * Properties forwarded to the title element.
   */
  titleProps?: HTMLAttributes;
  /**
   * Properties forwarded to the sub element.
   */
  subProps?: HTMLAttributes;
}

/**
 * Events for the AnchorCompact component.
 */
export type AnchorCompactEmits = AnchorRootEmits;

/**
 * Parameters used to create the AnchorRoot context.
 */
export interface AnchorRootContextParams extends ToContext<AnchorRootProps, 'dir'> {
  /**
   * Active href used by the component context.
   */
  activeHref: ShallowRef<string>;
  /**
   * Callback invoked when the link click event fires.
   */
  onLinkClick: (event: MouseEvent, payload: { href: string }) => void;
  /**
   * Register link used by the component context.
   */
  registerLink: (href: string) => void;
  /**
   * Scroll to used by the component context.
   */
  scrollTo: (href: string) => void;
  /**
   * Unregister link used by the component context.
   */
  unregisterLink: (href: string) => void;
}

/**
 * Available UI slots for the Anchor component.
 */
export type AnchorUiSlot = 'root' | 'link' | 'sub' | 'item' | 'indicator' | 'title';

/**
 * UI class overrides for the Anchor component.
 */
export type AnchorUi = UiClass<AnchorUiSlot>;
