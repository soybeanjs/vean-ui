import type { ComputedRef, ShallowRef } from 'vue';
import type { DataOrientation, Direction, ToContext, UiClass } from '../../types';
import type { KbdValue } from '../kbd/types';
import type { PrimitiveWithBaseProps } from '../primitive/types';
import type { TreeMenuBaseOptionData, TreeMenuExpandStrategy } from '../tree-menu/types';

/**
 * Available menu shapes for the SplitNav component.
 *
 * - `dual-vertical`: level-1 vertical + remaining tree vertical.
 * - `vertical-horizontal`: level-1 vertical + nested TreeNav.
 * - `horizontal-vertical`: level-1 horizontal + nested TreeMenu.
 * - `horizontal-dual-vertical`: level-1 horizontal + nested dual-vertical.
 */
export type SplitNavMode = 'dual-vertical' | 'vertical-horizontal' | 'horizontal-vertical' | 'horizontal-dual-vertical';

/**
 * Option data for the SplitNav component.
 *
 * Extends the vertical `TreeMenuBaseOptionData` so a single tree can feed both
 * TreeMenu and TreeNav renderers.
 */
export interface SplitNavBaseOptionData extends TreeMenuBaseOptionData {
  /**
   * The shortcut rendered at the end of a horizontal option.
   */
  shortcut?: KbdValue | KbdValue[];
  /**
   * Whether to show a separator after a horizontal option.
   */
  separator?: boolean;
}

/**
 * Recursive option data for the SplitNav component.
 */
export type SplitNavOptionData<T extends SplitNavBaseOptionData = SplitNavBaseOptionData> = Omit<T, 'children'> & {
  /**
   * Child options.
   */
  children?: SplitNavOptionData<T>[];
};

/**
 * Properties for the SplitNavRoot component.
 */
export interface SplitNavRootProps<T extends SplitNavBaseOptionData = SplitNavBaseOptionData> extends Omit<
  PrimitiveWithBaseProps,
  'onSelect'
> {
  /**
   * The reading direction of the menu when applicable.
   *
   * If omitted, inherits globally from `ConfigProvider` or assumes LTR.
   */
  dir?: Direction;
  /**
   * The menu shape.
   *
   * @default 'dual-vertical'
   */
  mode?: SplitNavMode;
  /**
   * The selected leaf value of the SplitNav component. Can be bound with `v-model`.
   *
   * Parent items are not written here; clicking them only opens the nested pane.
   */
  modelValue?: string;
  /**
   * The selected leaf when initially rendered. Use when you do not need to control the state.
   */
  defaultValue?: string;
  /**
   * The option data for the SplitNav component.
   */
  items: SplitNavOptionData<T>[];
  /**
   * The id of the element to mount horizontal menus into (rendered via `Teleport`).
   *
   * When unset, the horizontal menus render in place. Pass the element id without `#`.
   */
  horizontalMountedId?: string;
  /**
   * The id of the element to mount vertical menus into (rendered via `Teleport`).
   *
   * When unset, the vertical menus render in place. Pass the element id without `#`.
   */
  verticalMountedId?: string;
  /**
   * Whether first-level keyboard navigation loops from last item to first and vice versa.
   *
   * @default true
   */
  loop?: boolean;
  /**
   * The expand strategy of the nested vertical TreeMenu pane.
   *
   * - `keep`: keep the current expanded state; manually expanded or collapsed menus are not affected by activating other menus. The collapsible ancestors of the selected menu are expanded on mount and whenever the selected menu changes from outside (e.g. driven by an external route), so it stays visible.
   * - `selected`: only expand the currently selected menu and all its ancestor menus; non-selected menus are collapsed when the selected menu changes.
   *
   * Only applies to the nested `TreeMenuCompact`; the nested horizontal pane
   * (`TreeNavCompact`) has no expand strategy.
   *
   * @default 'keep'
   */
  expandStrategy?: TreeMenuExpandStrategy;
  /**
   * Whether the nested vertical TreeMenu pane is collapsed.
   *
   * Can be bound with `v-model:collapsed`.
   */
  collapsed?: boolean;
  /**
   * The collapsed state of the nested TreeMenu pane when initially rendered.
   *
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * The width of the nested TreeMenu pane when it is collapsed, in pixels.
   *
   * @default 50
   */
  collapsedWidth?: number;
}

/**
 * Events for the SplitNavRoot component.
 */
export type SplitNavRootEmits<T extends SplitNavBaseOptionData = SplitNavBaseOptionData> = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when a leaf menu item is chosen.
   */
  select: [key: string, event?: Event];
  /**
   * Emitted when a menu item with children is activated and its nested pane opens.
   *
   * The payload is the complete option data of the activated parent, including
   * children, so consumers can react to the expansion — for example, activate
   * the first child at the same time.
   */
  open: [item: SplitNavOptionData<T>, event?: Event];
  /**
   * Emitted when the nested TreeMenu pane collapsed state changes.
   */
  'update:collapsed': [value: boolean];
};

/**
 * Slots for the SplitNavRoot component.
 */
export type SplitNavRootSlots<T extends SplitNavBaseOptionData = SplitNavBaseOptionData> = {
  /**
   * Custom content for a first-level item.
   *
   * `selected` is true for a selected leaf. `open` is true for a parent whose nested pane is showing.
   */
  'first-level-item'?: (props: { item: SplitNavOptionData<T>; selected: boolean; open: boolean }) => any;
  /**
   * Custom content rendered above the first-level rail of a dual-vertical menu.
   *
   * The cell is as wide as the rail, so a brand can sit in the menu's own
   * top-left corner instead of beside it; the divider between the two columns is
   * the pane's own leading edge, so it runs through this band as well.
   * `collapsed` reports whether the nested pane is folded.
   */
  'top-left'?: (props: { collapsed: boolean }) => any;
  /**
   * Custom content rendered above the nested pane of a dual-vertical menu.
   *
   * The cell only renders while the pane column exists — the active first-level
   * item has visible children — and follows that column's width, folded state
   * included. `collapsed` reports whether the pane is folded.
   */
  'top-right'?: (props: { collapsed: boolean }) => any;
  /**
   * Custom content for a nested TreeMenu / TreeNav item.
   */
  item?: (props: { item: T }) => any;
  /**
   * Custom content for a nested TreeMenu / TreeNav item leading slot.
   */
  'item-leading'?: (props: { item: T }) => any;
  /**
   * Custom content for a nested TreeMenu / TreeNav item trailing slot.
   */
  'item-trailing'?: (props: { item: T }) => any;
  /**
   * Custom content for a nested TreeNav item trigger icon.
   */
  'item-trigger-icon'?: (props: { item: T }) => any;
  /**
   * Custom content for a nested TreeNav item link icon.
   */
  'item-link-icon'?: (props: { item: T }) => any;
};

/**
 * Properties for the VerticalFirstLevelMenu component.
 */
export interface VerticalFirstLevelMenuProps extends PrimitiveWithBaseProps {
  /**
   * First-level items rendered by the vertical rail.
   */
  items: SplitNavOptionData[];
}

/**
 * Properties for the HorizontalFirstLevelMenu component.
 */
export interface HorizontalFirstLevelMenuProps extends PrimitiveWithBaseProps {
  /**
   * First-level items rendered by the horizontal bar.
   */
  items: SplitNavOptionData[];
}

/**
 * Properties for the internal first-level menu.
 */
export interface FirstLevelMenuProps extends PrimitiveWithBaseProps {
  /**
   * First-level items rendered by the menu.
   */
  items: SplitNavOptionData[];
  /**
   * Orientation of the first-level roving focus group.
   */
  orientation: DataOrientation;
}

/**
 * Properties for a first-level item.
 */
export interface FirstLevelItemProps {
  /**
   * Option data for the item.
   */
  item: SplitNavOptionData;
  /**
   * Orientation of the first-level rail this item belongs to.
   */
  orientation: DataOrientation;
}

/**
 * Properties for the DualVerticalMenu component.
 */
export interface DualVerticalMenuProps {
  /**
   * Option data rendered as this dual-vertical pane's first level.
   *
   * When omitted, the pane uses the root `items`. Nested `horizontal-dual-vertical`
   * passes the children of the active horizontal first-level item.
   */
  items?: SplitNavOptionData[];
}

/**
 * Parameters used to create the SplitNavRoot context.
 */
export interface SplitNavRootContextParams extends ToContext<
  SplitNavRootProps,
  'mode' | 'items' | 'horizontalMountedId' | 'verticalMountedId' | 'loop' | 'expandStrategy' | 'collapsedWidth'
> {
  /**
   * Current model value.
   */
  modelValue: ShallowRef<string>;
  /**
   * Whether the nested vertical TreeMenu pane is collapsed.
   */
  collapsed: ShallowRef<boolean>;
  /**
   * Reading direction prop, resolved against `ConfigProvider` in the context.
   */
  dir: ComputedRef<Direction | undefined>;
  /**
   * Residual HTML attributes forwarded to the standalone dual-vertical pane.
   */
  rootAttrs: ComputedRef<Record<string, unknown>>;
  /**
   * Path of first-level / nested parents whose panes are currently open.
   *
   * Independent from `modelValue` so clicking a parent only expands its pane.
   */
  openPath: ShallowRef<string[]>;
  /**
   * First-level rail items of this instance keyed by value.
   *
   * Panes and rails may live in separate DOM trees (mounted targets), so the
   * focus fallback resolves its target through this registry instead of a
   * document query that would cross other SplitNav instances.
   */
  railItemElements: Map<string, HTMLElement>;
  /**
   * Activate an item by value: opens a parent pane, or selects a leaf.
   */
  onItemActivate: (value: string, event?: Event) => void;
}

/**
 * Available UI slots for the SplitNav component.
 */
export type SplitNavUiSlot =
  | 'verticalPane'
  | 'verticalRail'
  | 'verticalRailMenu'
  | 'topLeft'
  | 'topRight'
  | 'firstLevel'
  | 'firstLevelItem'
  | 'firstLevelItemIcon'
  | 'firstLevelItemLabel'
  | 'subVertical'
  | 'subHorizontal';

/**
 * UI class overrides for the SplitNav component.
 */
export type SplitNavUi = UiClass<SplitNavUiSlot>;
