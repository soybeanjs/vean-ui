import type { ComputedRef, ShallowRef } from 'vue';
import type { RovingFocusGroupOptions } from '../../composables';
import type { BaseProps, MaybePromise, ToContext, UiClass } from '../../types';
import type { IconValue } from '../_icon/types';
import type { ButtonProps } from '../button/types';
import type { ContextMenuCompactProps } from '../context-menu/types';
import type { MenuOptionData } from '../menu/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the PageTabsRoot component.
 */
export interface PageTabsRootProps
  extends
    Omit<PrimitiveWithBaseProps, 'dir'>,
    Pick<
      RovingFocusGroupOptions,
      'dir' | 'loop' | 'currentTabStopId' | 'defaultCurrentTabStopId' | 'preventScrollOnEntryFocus'
    > {
  /**
   * The active tab value.
   */
  modelValue?: string;
  /**
   * Whether middle-clicking a tab closes it.
   */
  middleClickClose?: boolean;
  /**
   * Whether tabs can be reordered by dragging. Tabs only reorder within
   * their own zone — the pinned group always stays in front. A tab item
   * with an explicit `draggable: false` is locked in place.
   */
  draggable?: boolean;
}

/**
 * Events for the PageTabsRoot component.
 */
export type PageTabsRootEmits = {
  /**
   * Emitted when the active tab change.
   */
  (e: 'update:modelValue', value: string): void;
};

/**
 * Event payload for tab drag operations.
 */
export interface PageTabsDragEvent<T extends PageTabsOptionData = PageTabsOptionData> {
  /**
   * The tab being dragged.
   */
  item: T;
  /**
   * The index the dragged tab currently sits at (updated while dragging).
   */
  index: number;
}

/**
 * Properties for the PageTabsItem component.
 */
export interface PageTabsItemProps extends Omit<BaseProps, 'onClick'> {
  /**
   * The unique value of the tab.
   */
  value: string;
  /**
   * Whether the tab is pinned.
   */
  pinned?: boolean;
  /**
   * Whether drag reordering is enabled for this tab. A non-draggable tab is
   * locked in place: it cannot be dragged and other tabs cannot be dropped
   * onto it. Pinned tabs reorder within the pinned zone only.
   */
  draggable?: boolean;
  /**
   * @internal Index of the tab within `items`, used to build the drag payload.
   */
  index?: number;
}

/**
 * Events for the PageTabsItem component.
 */
export type PageTabsItemEmits = {
  /**
   * Emitted when the tab is clicked.
   */
  (e: 'click'): void;
  /**
   * Emitted when the tab is requested to be closed.
   */
  (e: 'close'): void;
  /**
   * Emitted when the tab is requested to be pinned.
   */
  (e: 'pin', pinned: boolean): void;
  /**
   * Emitted when dragging this tab starts.
   */
  (e: 'tabDragStart'): void;
  /**
   * Emitted while this tab is being dragged.
   */
  (e: 'tabDragMove'): void;
  /**
   * Emitted when the dragged tab crosses onto a new position so the list is
   * reordered in place while dragging (surrounding tabs shift immediately).
   */
  (e: 'tabDragReorder'): void;
  /**
   * Emitted when dragging this tab ends.
   */
  (e: 'tabDragEnd'): void;
};

/**
 * Properties for the PageTabsClose component.
 */
export interface PageTabsCloseProps extends ButtonProps {}

/**
 * Properties for the PageTabsPin component.
 */
export interface PageTabsPinProps extends ButtonProps {}

/**
 * Option data for the PageTabs component.
 */
export interface PageTabsOptionData extends PageTabsItemProps {
  /**
   * Label text rendered by the component.
   */
  label: string;
  /**
   * Icon rendered by the component.
   */
  icon?: IconValue;
  /**
   * Whether to hide the pinned icon on the tab.
   */
  hidePinnedIcon?: boolean;
}

/**
 * State values for PageTabsState.
 */
export interface PageTabsState {
  /**
   * Pin.
   */
  pin: () => void;
  /**
   * Unpin.
   */
  unpin: () => void;
  /**
   * Whether the component can be closed.
   */
  closable: boolean;
  /**
   * Close.
   */
  close: () => Promise<void>;
  /**
   * Whether left closable.
   */
  leftClosable: boolean;
  /**
   * Close left.
   */
  closeLeft: () => void;
  /**
   * Whether right closable.
   */
  rightClosable: boolean;
  /**
   * Close right.
   */
  closeRight: () => void;
  /**
   * Whether other closable.
   */
  otherClosable: boolean;
  /**
   * Close other.
   */
  closeOther: () => void;
  /**
   * Whether all closable.
   */
  allClosable: boolean;
  /**
   * Close all.
   */
  closeAll: () => void;
}

/**
 * Option data for the PageTabs context menu.
 */
export interface PageTabsContextMenuOptionData extends MenuOptionData<string> {
  /**
   * Action to perform when the menu item is selected.
   */
  action?: () => MaybePromise<void>;
}

/**
 * Properties for the PageTabsCompact component.
 */
export interface PageTabsCompactProps<T extends PageTabsOptionData = PageTabsOptionData> extends PageTabsRootProps {
  /**
   * Items rendered by the component.
   */
  items: T[];
  /**
   * A factory function to generate context menu options for each tab.
   * @param tab The tab data.
   * @param state The current state and operations for the tab.
   */
  menuFactory?: (tab: T, state: PageTabsState) => PageTabsContextMenuOptionData[];
  /**
   * Callback invoked before closing the tab. Return `false` or a promise that resolves to `false` to prevent closing.
   * @param value The current tab value.
   */
  beforeClose?: (value: string) => MaybePromise<boolean | void>;
  /**
   * Per-slot class overrides for the component.
   */
  itemProps?: BaseProps;
  /**
   * Per-slot class overrides for the component.
   */
  pinProps?: BaseProps;
  /**
   * Per-slot class overrides for the component.
   */
  closeProps?: BaseProps;
  /**
   * Additional props for the context menu component.
   */
  contextMenuProps?: Omit<ContextMenuCompactProps, 'options'>;
}

/**
 * Events for the PageTabsCompact component.
 */
export type PageTabsCompactEmits<T extends PageTabsOptionData = PageTabsOptionData> = PageTabsRootEmits & {
  /**
   * Emitted when the items change.
   */
  (e: 'update:items', items: T[]): void;
  /**
   * Emitted when a tab is clicked.
   */
  (e: 'click', tab: T): void;
  /**
   * Emitted when a tab is closed.
   */
  (e: 'close', tab: T): void;
  /**
   * Emitted when a tab is pinned or unpinned.
   */
  (e: 'pin', tab: T): void;
  /**
   * Emitted when the context target tab changes.
   */
  (e: 'contextmenu', tab: T): void;
  /**
   * Emitted when a context menu item is selected.
   */
  (e: 'selectContextMenu', menu: PageTabsContextMenuOptionData, tab: T): void;
  /**
   * Emitted when dragging a tab starts.
   */
  (e: 'tabDragStart', tab: PageTabsDragEvent<T>): void;
  /**
   * Emitted while a tab is being dragged.
   */
  (e: 'tabDragMove', tab: PageTabsDragEvent<T>): void;
  /**
   * Emitted when the dragged tab crosses onto a new position and the list is
   * reordered in place while dragging.
   */
  (e: 'tabDragReorder', tab: PageTabsDragEvent<T>): void;
  /**
   * Emitted when dragging a tab ends.
   */
  (e: 'tabDragEnd', tab: PageTabsDragEvent<T>): void;
};

/**
 * Slot props for a compact page tab item.
 */
export interface PageTabsCompactItemSlotProps<T extends PageTabsOptionData = PageTabsOptionData> {
  /**
   * Current item data.
   */
  item: T;
  /**
   * Index of the current item.
   */
  index: number;
  /**
   * Whether the current item is selected.
   */
  selected: boolean;
  /**
   * Whether the current item can be closed.
   */
  closable: boolean;
}

/**
 * Slots for the PageTabsCompact component.
 */
export type PageTabsCompactSlots<T extends PageTabsOptionData = PageTabsOptionData> = {
  /**
   * Custom content for the default tab item body.
   */
  item?: (props: PageTabsCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the tab icon.
   */
  icon?: (props: PageTabsCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the tab label.
   */
  label?: (props: PageTabsCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the tab indicator.
   */
  indicator?: (props: PageTabsCompactItemSlotProps<T>) => any;
  /**
   * Custom content for the pin icon.
   */
  'pin-icon'?: () => void;
  /**
   * Custom content for the close icon.
   */
  'close-icon'?: () => void;
};

/**
 * Context for the PageTabsRoot component.
 */
export interface PageTabsRootContext extends ToContext<PageTabsRootProps, 'middleClickClose'> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string>;
}

/**
 * Context for the PageTabsItem component.
 */
export interface PageTabsItemContext extends ToContext<PageTabsItemProps, 'pinned'> {
  /**
   * Whether the component can be closed.
   */
  closable: ComputedRef<boolean>;
  /**
   * Callback invoked when the close event fires.
   */
  onClose: () => Promise<void>;
  /**
   * Callback invoked when the pin event fires.
   */
  onPin: () => void;
}

/**
 * Available UI slots for the PageTabs component.
 */
export type PageTabsUiSlot = 'root' | 'item' | 'close' | 'pin' | 'itemText';

/**
 * UI class overrides for the PageTabs component.
 */
export type PageTabsUi = UiClass<PageTabsUiSlot>;
