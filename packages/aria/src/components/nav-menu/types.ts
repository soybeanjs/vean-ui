import type { ShallowRef } from 'vue';
import type { Align, BaseProps, DataOrientation, Direction, ForceMountProps, ToContext, UiClass } from '../../types';
import type { IconValue } from '../_icon/types';
import type { LinkBaseProps, LinkBasePropsKey, LinkProps } from '../link/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the NavMenuRoot component.
 */
export interface NavMenuRootProps extends BaseProps {
  /** The controlled value of the active item. Can be used as `v-model`. */
  modelValue?: string;
  /** The value of the item that should be active when initially rendered. */
  defaultValue?: string;
  /** The reading direction of the menu. */
  dir?: Direction;
  /** The orientation of the menu. */
  orientation?: DataOrientation;
  /**
   * The duration from when the pointer enters the trigger until the submenu opens.
   *
   * @defaultValue 200
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   *
   * @defaultValue 300
   */
  skipDelayDuration?: number;
  /**
   * If `true`, the menu cannot be opened by clicking a trigger.
   *
   * @defaultValue false
   */
  disableClickTrigger?: boolean;
  /**
   * If `true`, the menu cannot be opened by hovering a trigger.
   *
   * @defaultValue false
   */
  disableHoverTrigger?: boolean;
  /**
   * If `true`, the menu will not close when the pointer leaves the content.
   *
   * @defaultValue false
   */
  disablePointerLeaveClose?: boolean;
}

/**
 * Events for the NavMenuRoot component.
 */
export type NavMenuRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
};

/**
 * Properties for the NavMenuViewport component (the shared floating surface).
 */
export interface NavMenuViewportProps extends ForceMountProps, BaseProps {
  /** Align the viewport against the active trigger. */
  align?: Align;
  /** Distance in pixels between the trigger and the viewport. */
  sideOffset?: number;
}

/**
 * Properties for the NavMenuItem component.
 */
export interface NavMenuItemProps extends BaseProps {
  /** Value associated with the current item. */
  value?: string;
}

/**
 * Properties for the NavMenuTrigger component.
 */
export interface NavMenuTriggerProps extends PrimitiveWithBaseProps {
  /** Whether the trigger is disabled. */
  disabled?: boolean;
}

/**
 * Properties for the NavMenuContent component.
 */
export interface NavMenuContentProps extends ForceMountProps, BaseProps {}

/**
 * Events for the NavMenuContent component.
 */
export type NavMenuContentEmits = {};

/**
 * Properties for the NavMenuList component.
 */
export interface NavMenuListProps extends BaseProps {}

/**
 * Properties for the NavMenuLink component.
 */
export interface NavMenuLinkProps extends Omit<LinkProps, 'onSelect'> {
  /** Marks the link as the currently selected page. */
  selected?: boolean;
  /**
   * Whether the link is rendered inside a submenu. When `true`, the `subLink` UI slot is
   * used instead of `link` (mirroring the root/sub split of the list).
   */
  sub?: boolean;
}

/**
 * Events for the NavMenuLink component.
 */
export type NavMenuLinkEmits = {
  /**
   * Emitted when a link is selected.
   */
  select: [payload: CustomEvent<{ originalEvent: Event }>];
};

/**
 * Properties for the NavMenuSubTrigger component (the trigger of a nested flyout).
 */
export interface NavMenuSubTriggerProps extends PrimitiveWithBaseProps {
  /** Whether the trigger is disabled. */
  disabled?: boolean;
}

/**
 * Properties for the NavMenuSubContent component (the nested flyout surface).
 */
export interface NavMenuSubContentProps extends ForceMountProps, BaseProps {
  /** Distance in pixels between the sub trigger and the nested flyout. */
  sideOffset?: number;
}

/**
 * Parameters used to create the NavMenuRoot context.
 */
export interface NavMenuRootContextParams extends ToContext<
  Required<NavMenuRootProps>,
  | 'dir'
  | 'orientation'
  | 'delayDuration'
  | 'skipDelayDuration'
  | 'disableClickTrigger'
  | 'disableHoverTrigger'
  | 'disablePointerLeaveClose'
> {
  /** Whether this context is the root. */
  isRoot: boolean;
  /** Current model value. */
  modelValue: ShallowRef<string>;
}

/**
 * Parameters used to create the NavMenuItem context.
 */
export interface NavMenuItemContextParams {
  /** Value associated with the current item. */
  value: string;
  /** Current model value. */
  modelValue: ShallowRef<string>;
  /** Content id used by the component context. */
  contentId: string;
  /** Trigger id used by the component context. */
  triggerId: string;
  /** Callback invoked when the entry key down event fires. */
  onEntryKeyDown: () => void;
  /** Callback invoked when the focus proxy enter event fires. */
  onFocusProxyEnter: (side?: 'start' | 'end') => void;
  /** Callback invoked when the content focus outside event fires. */
  onContentFocusOutside: () => void;
}

/**
 * Available UI slots for the NavMenu component.
 */
export type NavMenuUiSlot =
  | 'root'
  | 'list'
  | 'item'
  | 'trigger'
  | 'content'
  | 'viewport'
  | 'link'
  | 'subLink'
  | 'subLinkContent'
  | 'subLinkLabel'
  | 'subLinkDescription'
  | 'subList'
  | 'subTrigger'
  | 'subTriggerIcon'
  | 'subContent'
  | 'itemIcon'
  | 'linkIcon'
  | 'triggerIcon'
  | 'arrow'
  | 'positioner';

/**
 * UI class overrides for the NavMenu component.
 */
export type NavMenuUi = UiClass<NavMenuUiSlot>;

/**
 * Option data for the NavMenu component.
 */
export interface NavMenuOptionData extends LinkBaseProps {
  /** The value of the option. */
  value: string;
  /** The label to display in the option. */
  label: string;
  /** The description of the option. */
  description?: string;
  /** The icon of the option. */
  icon?: IconValue;
  /** Whether the option is hidden. */
  hidden?: boolean;
  /** Whether the option is disabled. */
  disabled?: boolean;
  /** Whether the option is selected. */
  selected?: boolean;
  /** The children of the option (rendered as links inside the submenu). */
  children?: NavMenuOptionData[];
}

/**
 * Properties for the NavMenuCompact component.
 */
export interface NavMenuCompactProps extends NavMenuRootProps, Omit<NavMenuOptionCompactProps, 'item'> {
  /** The items to render in the navigation menu. */
  items: NavMenuOptionData[];
}

/**
 * Events for the NavMenuCompact component.
 */
export type NavMenuCompactEmits = NavMenuRootEmits & NavMenuLinkEmits;

/**
 * Slots for the NavMenuCompact component.
 */
export type NavMenuCompactSlots = {
  item: (props: { item: NavMenuOptionData; isTrigger?: boolean }) => any;
  'item-leading': (props: { item: NavMenuOptionData }) => any;
  'item-trailing': (props: { item: NavMenuOptionData }) => any;
  'item-link-icon': (props: { item: NavMenuOptionData }) => any;
  'item-trigger-icon': (props: { item: NavMenuOptionData }) => any;
  'item-children': (props: { item: NavMenuOptionData }) => any;
};

/**
 * Properties for the NavMenuOptionCompact component.
 */
export interface NavMenuOptionCompactProps {
  /** Current item data. */
  item: NavMenuOptionData;
  /** Properties forwarded to the item element. */
  itemProps?: NavMenuItemProps;
  /** Properties forwarded to the link element. */
  linkProps?: Omit<NavMenuLinkProps, LinkBasePropsKey>;
  /** Properties forwarded to the trigger element. */
  triggerProps?: NavMenuTriggerProps;
  /** Properties forwarded to the content element. */
  contentProps?: NavMenuContentProps;
  /** Properties forwarded to the viewport element. */
  viewportProps?: NavMenuViewportProps;
  /** Properties forwarded to the list element. */
  listProps?: NavMenuListProps;
  /** Properties forwarded to the nested flyout trigger element. */
  subTriggerProps?: NavMenuSubTriggerProps;
  /** Properties forwarded to the nested flyout content element. */
  subContentProps?: NavMenuSubContentProps;
}

/**
 * Events for the NavMenuOptionCompact component.
 */
export type NavMenuOptionCompactEmits = NavMenuLinkEmits;

/**
 * Slots for the NavMenuOptionCompact component.
 */
export type NavMenuOptionCompactSlots = NavMenuCompactSlots;

/**
 * Properties for the NavMenuSubOptionCompact component (a recursively rendered sub item).
 */
export interface NavMenuSubOptionCompactProps {
  /** Current sub item data. */
  item: NavMenuOptionData;
  /** Properties forwarded to the sub link element. */
  linkProps?: Omit<NavMenuLinkProps, LinkBasePropsKey>;
  /** Properties forwarded to the nested flyout trigger element. */
  subTriggerProps?: NavMenuSubTriggerProps;
  /** Properties forwarded to the nested flyout content element. */
  subContentProps?: NavMenuSubContentProps;
}

/**
 * Events for the NavMenuSubOptionCompact component.
 */
export type NavMenuSubOptionCompactEmits = NavMenuLinkEmits;

/**
 * Slots for the NavMenuSubOptionCompact component.
 */
export type NavMenuSubOptionCompactSlots = NavMenuCompactSlots;
