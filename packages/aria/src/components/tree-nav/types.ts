import type { ComputedRef } from 'vue';
import type { Direction, Placement, UiClass, ToContext, BaseProps } from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { DropdownMenuTriggerProps, DropdownMenuTriggerType } from '../dropdown-menu/types';
import type { KbdValue } from '../kbd/types';
import type { LinkBaseProps, LinkExtraProps } from '../link/types';
import type {
  MenuArrowProps,
  MenuGroupLabelProps,
  MenuItemProps,
  MenuOptionsCompactSlots,
  MenuPopupProps,
  MenuPortalProps,
  MenuSeparatorProps,
  MenuShortcutProps,
  MenuSubContentProps,
  MenuSubTriggerProps
} from '../menu';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { TreeMenuBaseItemProps } from '../tree-menu/types';

/**
 * Base option data for a TreeNav entry.
 *
 * Item customization beyond the fields below (badges, tags, tooltips,
 * actions...) is provided via slots instead of extra data fields.
 */
export interface TreeNavBaseOptionData extends TreeMenuBaseItemProps, LinkBaseProps {
  /**
   * Whether the option is a pure visual group container that only groups its children and never becomes selected itself.
   */
  isGroup?: boolean;
  /**
   * The label of the option.
   */
  label: string;
  /**
   * The icon rendered before the label.
   */
  icon?: IconValue;
  /**
   * The shortcut rendered at the end of the option inside branch popups.
   */
  shortcut?: KbdValue | KbdValue[];
  /**
   * Whether to show a separator after this option inside branch popups.
   */
  separator?: boolean;
  /**
   * Whether the option is hidden.
   */
  hidden?: boolean;
}

/**
 * Recursive option data for the TreeNav component.
 */
export type TreeNavOptionData<T extends TreeNavBaseOptionData = TreeNavBaseOptionData> = Omit<T, 'children'> & {
  /**
   * Child options rendered inside the branch popup.
   */
  children?: TreeNavOptionData<T>[];
};

/**
 * Properties for the TreeNavRoot component.
 */
export interface TreeNavRootProps extends Omit<PrimitiveWithBaseProps, 'onSelect'> {
  /** The value of the currently selected item. Can be used as `v-model`. */
  modelValue?: string;
  /** The value of the item that should be selected when initially rendered. */
  defaultValue?: string;
  /** The reading direction of the component when applicable. */
  dir?: Direction;
  /**
   * How branch popups are opened.
   *
   * - `click`: The popup will be opened when the trigger is clicked.
   * - `hover`: The popup will be opened when the trigger is hovered.
   *
   * @defaultValue 'hover'
   */
  trigger?: DropdownMenuTriggerType;
  /**
   * The duration from when the pointer enters a branch trigger until the
   * popup gets opened in hover mode.
   *
   * @defaultValue 150
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another branch trigger without
   * incurring a delay again.
   *
   * @defaultValue 300
   */
  skipDelayDuration?: number;
  /**
   * The preferred placement of branch popups relative to their trigger.
   *
   * @defaultValue 'bottom-start'
   */
  placement?: Placement;
  /**
   * Whether branch popups show an arrow.
   *
   * @defaultValue false
   */
  showArrow?: boolean;
  /**
   * Whether the whole navigation bar is disabled.
   */
  disabled?: boolean;
  /**
   * Properties forwarded to the link element of link items.
   */
  linkProps?: LinkExtraProps;
  /**
   * Properties forwarded to the item element of popup items.
   */
  itemProps?: MenuItemProps;
  /**
   * Properties forwarded to the group label element of popup group labels.
   */
  groupLabelProps?: MenuGroupLabelProps;
  /**
   * Properties forwarded to the shortcut element of popup items.
   */
  shortcutProps?: MenuShortcutProps;
  /**
   * Properties forwarded to the separator element of popup separators.
   */
  separatorProps?: MenuSeparatorProps;
  /**
   * Properties forwarded to the sub trigger element of popup branches.
   */
  subTriggerProps?: MenuSubTriggerProps;
  /**
   * Properties forwarded to the sub content element of popup branches.
   */
  subContentProps?: MenuSubContentProps;
  /**
   * Properties forwarded to the portal element of popups.
   */
  portalProps?: MenuPortalProps;
  /**
   * Properties forwarded to the popup element of popups.
   */
  popupProps?: MenuPopupProps;
  /**
   * Properties forwarded to the trigger element of branch popups.
   */
  triggerProps?: DropdownMenuTriggerProps;
  /**
   * Properties forwarded to the arrow element of popups.
   */
  arrowProps?: MenuArrowProps;
}

/**
 * Events for the TreeNavRoot component.
 */
export interface TreeNavRootEmits {
  /**
   * Emitted when the selected value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when an item is selected.
   */
  select: [item: TreeNavOptionData, event: Event];
}

/**
 * Slots for the TreeNavRoot component.
 */
export interface TreeNavRootSlots {
  /**
   * Default content rendered inside the nav root.
   */
  default?: () => any;
}

/**
 * Properties for the TreeNavRoot component
 */
export interface TreeNavOverflowProps extends BaseProps {}

/**
 * Collection data registered by each top-level trigger so popup key
 * navigation can map trigger values back to their elements.
 */
export interface TreeNavTriggerItemData {
  /** The stable value of the trigger. */
  value: string;
  /** Whether the trigger opens a branch popup. */
  isBranch?: boolean;
}

/**
 * Configuration shared by the TreeNav primitives.
 *
 * Top-level link and popup-related props are provided as individual reactive
 * entries (`toContext`), so each field stays independently
 * consumable instead of being nested inside grouped prop objects.
 */
export interface TreeNavRootContextParams extends ToContext<
  TreeNavRootProps,
  | 'dir'
  | 'disabled'
  | 'trigger'
  | 'delayDuration'
  | 'skipDelayDuration'
  | 'placement'
  | 'showArrow'
  | 'portalProps'
  | 'popupProps'
  | 'triggerProps'
  | 'arrowProps'
  | 'itemProps'
  | 'linkProps'
  | 'groupLabelProps'
  | 'shortcutProps'
  | 'separatorProps'
  | 'subTriggerProps'
  | 'subContentProps'
> {
  /**
   * Current selected value.
   */
  selected: ComputedRef<string | undefined>;
  /**
   * Select an entry. Guarded against disabled bars and entries.
   */
  onSelect(item: TreeNavOptionData, event: Event): void;
  /**
   * The value of the branch popup that is currently open, if any. Drives the
   * controlled popups so the root can switch them during key navigation.
   */
  openValue: ComputedRef<string | undefined>;
  /**
   * Track branch popup open state changes reported by the popups.
   */
  onBranchOpenChange(value: string, isOpen: boolean): void;
  /**
   * Menubar-style ArrowLeft/ArrowRight while a branch popup is open: move to
   * the previous/next trigger, opening its popup (branch) or focusing it
   * (link/leaf). Reported from both the popup and its own trigger so the
   * navigation also works while the focus rests on the open trigger.
   */
  onPopupArrowNavigation(value: string, event: KeyboardEvent): void;
}

/**
 * Properties for the TreeNavOptionCompact component.
 */
export interface TreeNavOptionCompactProps {
  /**
   * Current item data.
   */
  item: TreeNavOptionData;
  /**
   * Whether the selected leaf lives inside this branch subtree.
   */
  childSelected?: boolean;
}

/**
 * Display entry describing the trailing "more" trigger when `collapsible`.
 */
export interface TreeNavMoreEntry {
  /** Label of the "more" trigger. */
  label: string;
  /** Icon of the "more" trigger. */
  icon?: IconValue;
}

/**
 * Properties for the TreeNavOptionsCompact component.
 */
export interface TreeNavOptionsCompactProps {
  /**
   * Top-level items rendered as visible entries.
   */
  items: TreeNavOptionData[];
  /**
   * Items collapsed into the trailing "more" popup.
   */
  moreItems?: TreeNavOptionData[];
  /**
   * Label of the trailing "more" trigger.
   *
   * @defaultValue 'More'
   */
  moreLabel?: string;
  /**
   * Icon of the trailing "more" trigger.
   *
   * @defaultValue 'lucide:ellipsis'
   */
  moreIcon?: IconValue;
  /**
   * Properties forwarded to the trailing "more" trigger button.
   */
  moreProps?: ButtonProps;
}

/**
 * Slots for the TreeNavOptionsCompact component.
 */
export type TreeNavOptionsCompactSlots = MenuOptionsCompactSlots & {
  /**
   * Custom content for the trailing "more" trigger when present.
   */
  'more-trigger'?: (props: TreeNavMoreEntry) => any;
};

/**
 * Properties for the TreeNavCompact component.
 */
export interface TreeNavCompactProps extends TreeNavRootProps, TreeNavOptionsCompactProps {
  /**
   * Whether top-level overflow items collapse into a trailing "more" branch
   * popup so the bar always fits inside its container.
   *
   * @defaultValue false
   */
  collapsible?: boolean;
}

/**
 * Events for the TreeNavCompact component.
 */
export type TreeNavCompactEmits = TreeNavRootEmits;

/**
 * Slots for the TreeNavCompact component.
 */
export type TreeNavCompactSlots = TreeNavOptionsCompactSlots;

/**
 * Available UI slots for the TreeNav component.
 */
export type TreeNavUiSlot = 'root' | 'overflow' | 'item' | 'itemIcon' | 'itemTriggerIcon' | 'itemLinkIcon';

/**
 * UI class overrides for the TreeNav component.
 */
export type TreeNavUi = UiClass<TreeNavUiSlot>;
