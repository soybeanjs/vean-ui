import { COLLECTION_ITEM_ATTRIBUTE } from '../../constants';
import type { DataOrientation, Direction } from '../../types';
import type { TreeMenuOptionData } from '../tree-menu/types';
import type { TreeNavOptionData } from '../tree-nav/types';
import type { SplitNavBaseOptionData, SplitNavMode, SplitNavOptionData } from './types';

/**
 * Build a CSS selector for a mounted element id, or `undefined` when the id is empty.
 */
export function toMountedTarget(id?: string): string | undefined {
  if (!id) {
    return undefined;
  }

  return `#${id}`;
}

/**
 * Whether a node has at least one visible child.
 */
export function hasVisibleChildren<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  item: SplitNavOptionData<T>
): boolean {
  return Boolean(item.children?.some(child => !child.hidden));
}

/**
 * Recursively drop `hidden` nodes from a menu tree.
 */
export function toVisibleOptions<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  items: SplitNavOptionData<T>[]
): SplitNavOptionData<T>[] {
  return items
    .filter(item => !item.hidden)
    .map(item => {
      const children = item.children?.length ? toVisibleOptions(item.children as SplitNavOptionData<T>[]) : undefined;

      return {
        ...item,
        children: children?.length ? children : undefined
      };
    });
}

/**
 * Flatten first-level group nodes so the roving list only contains selectable items.
 *
 * A top-level `isGroup` node is not itself a first-level item; its visible children are.
 */
export function flattenFirstLevelItems<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  items: SplitNavOptionData<T>[]
): SplitNavOptionData<T>[] {
  return toVisibleOptions(items).flatMap(item => {
    if (item.isGroup) {
      return item.children?.length ? (item.children as SplitNavOptionData<T>[]) : [];
    }

    return [item];
  });
}

/**
 * Resolve the ancestor path from the tree root to `modelValue`.
 *
 * Returns an array where `values[0]` is the active level-1 value. Empty when
 * `modelValue` is missing or not found.
 */
export function findActivePath<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  items: SplitNavOptionData<T>[],
  modelValue: string,
  path: string[] = []
): string[] {
  if (!modelValue) {
    return [];
  }

  for (const item of items) {
    const currentPath = [...path, item.value];

    if (item.value === modelValue) {
      return currentPath;
    }

    if (item.children?.length) {
      const nested = findActivePath(item.children as SplitNavOptionData<T>[], modelValue, currentPath);

      if (nested.length) {
        return nested;
      }
    }
  }

  return [];
}

/**
 * Derive the open-pane path from a selected value.
 *
 * Parents stay on the path so their nested pane can open without becoming the
 * selected leaf. Leaves are dropped so only ancestor panes remain open.
 */
export function toOpenPath<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  items: SplitNavOptionData<T>[],
  value: string
): string[] {
  const path = findActivePath(items, value);

  if (!path.length) {
    return [];
  }

  const last = findNode(items, path[path.length - 1]);

  if (last && hasVisibleChildren(last)) {
    return path;
  }

  return path.slice(0, -1);
}

/**
 * Whether a first-level keyboard event should open the nested pane.
 *
 * Horizontal rails use ArrowDown (the unused vertical axis). Vertical rails
 * use ArrowLeft / ArrowRight (the unused horizontal axis).
 */
export function isFirstLevelExpandKey(key: string, orientation: DataOrientation): boolean {
  if (orientation === 'horizontal') {
    return key === 'ArrowDown';
  }

  return key === 'ArrowLeft' || key === 'ArrowRight';
}

/**
 * Whether an expand key moves INTO the nested pane (the forward direction).
 *
 * Horizontal rails move into the pane with ArrowDown regardless of direction.
 * Vertical rails move right with ArrowRight in LTR and left with ArrowLeft in RTL.
 */
export function isFirstLevelForwardExpandKey(key: string, orientation: DataOrientation, dir?: Direction): boolean {
  if (orientation === 'horizontal') {
    return key === 'ArrowDown';
  }

  return key === (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
}

/** Nested pane selectors, resolved per rail orientation and nav mode. */
const SUB_VERTICAL_SELECTOR = '[data-vean-split-nav-sub-vertical]';
const SUB_HORIZONTAL_SELECTOR = '[data-vean-split-nav-sub-horizontal]';
const VERTICAL_FIRST_LEVEL_SELECTOR = '[data-vean-split-nav-vertical-first-level]';

/**
 * Locates the pane a first-level branch opens, per rail orientation and nav mode.
 *
 * `mountedIdKey` names the root prop whose mount target hosts the pane when the
 * consumer renders SplitNav through mounted elements.
 *
 * The horizontal rail of `horizontal-dual-vertical` opens the nested dual-vertical
 * pane whose first level is a vertical rail, while the vertical rail of the same
 * mode opens the regular sub-vertical tree pane.
 */
const FIRST_LEVEL_PANE_QUERY: Record<
  DataOrientation,
  Partial<
    Record<
      SplitNavMode,
      {
        mountedIdKey: 'horizontalMountedId' | 'verticalMountedId';
        paneSelector: string;
      }
    >
  >
> = {
  vertical: {
    'dual-vertical': { mountedIdKey: 'verticalMountedId', paneSelector: SUB_VERTICAL_SELECTOR },
    'vertical-horizontal': {
      mountedIdKey: 'horizontalMountedId',
      paneSelector: SUB_HORIZONTAL_SELECTOR
    },
    'horizontal-dual-vertical': {
      mountedIdKey: 'verticalMountedId',
      paneSelector: SUB_VERTICAL_SELECTOR
    }
  },
  horizontal: {
    'vertical-horizontal': {
      mountedIdKey: 'horizontalMountedId',
      paneSelector: SUB_HORIZONTAL_SELECTOR
    },
    'horizontal-vertical': {
      mountedIdKey: 'verticalMountedId',
      paneSelector: SUB_VERTICAL_SELECTOR
    },
    'horizontal-dual-vertical': {
      mountedIdKey: 'verticalMountedId',
      paneSelector: VERTICAL_FIRST_LEVEL_SELECTOR
    }
  }
};

/**
 * Focus the first focusable item of the pane opened by the active first-level branch.
 *
 * The pane lives inside the mount target for the mode when provided, otherwise it
 * renders in place: inside the enclosing dual-vertical pane, or next to the rail.
 */
export function focusFirstLevelPaneItem(options: {
  itemElement: HTMLElement;
  orientation: DataOrientation;
  mode?: SplitNavMode;
  horizontalMountedId?: string;
  verticalMountedId?: string;
}): void {
  const { itemElement, orientation, mode, horizontalMountedId, verticalMountedId } = options;

  const query = mode ? FIRST_LEVEL_PANE_QUERY[orientation][mode] : undefined;

  if (!query) {
    return;
  }

  const mountedId = query.mountedIdKey === 'verticalMountedId' ? verticalMountedId : horizontalMountedId;
  const mountedElement = mountedId ? document.getElementById(mountedId) : null;
  const rail = itemElement.closest<HTMLElement>('[data-vean-split-nav-first-level]');
  const scope = mountedElement ?? rail?.closest('[data-vean-split-nav-dual-vertical]') ?? rail?.parentElement;

  const pane = scope?.querySelector(query.paneSelector);
  const item = pane?.querySelector<HTMLElement>('[data-vean-roving-focus-item]:not([data-disabled])');

  item?.focus();
}

/**
 * Whether an expand key moves OUT of the nested pane back to its rail (the
 * backward direction).
 *
 * Vertical rails release focus with the horizontal key opposite to the forward
 * one; horizontal rails use ArrowUp, the axis their ArrowDown expand leaves
 * free.
 */
export function isFirstLevelBackwardExpandKey(key: string, orientation: DataOrientation, dir?: Direction): boolean {
  if (orientation === 'horizontal') {
    return key === 'ArrowUp';
  }

  return key === (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
}

/**
 * Whether the event rests on the first visible top-level item of the pane —
 * the boundary where roaming can go no further and the focus may fall back to
 * the owning rail.
 */
export function isPaneBoundaryKey(
  event: KeyboardEvent,
  paneElement: HTMLElement,
  matches: (key: string) => boolean
): boolean {
  if (!matches(event.key)) {
    return false;
  }

  const target = event.target instanceof Element ? event.target : null;
  const item = target?.closest<HTMLElement>(`[${COLLECTION_ITEM_ATTRIBUTE}]`);

  if (!item || !paneElement.contains(item)) {
    return false;
  }

  const firstItem = Array.from(paneElement.querySelectorAll<HTMLElement>(`[${COLLECTION_ITEM_ATTRIBUTE}]`)).find(
    candidate => !candidate.closest('[data-vean-tree-menu-collapsible-content]')
  );

  return Boolean(firstItem) && firstItem === item;
}

/**
 * Find the item in a level list that sits on the active path.
 */
export function findActiveInLevel<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  levelItems: SplitNavOptionData<T>[],
  activePath: readonly string[]
): SplitNavOptionData<T> | undefined {
  return levelItems.find(item => activePath.includes(item.value));
}

/**
 * Find a node by value in a menu tree.
 */
export function findNode<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  items: SplitNavOptionData<T>[],
  value: string
): SplitNavOptionData<T> | undefined {
  for (const item of items) {
    if (item.value === value) {
      return item;
    }

    if (item.children?.length) {
      const found = findNode(item.children as SplitNavOptionData<T>[], value);

      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

/**
 * Map SplitNav options to `TreeMenuOptionData[]` for nested vertical menus.
 */
export function toTreeMenuOptions<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  data: SplitNavOptionData<T>[]
): TreeMenuOptionData[] {
  return toVisibleOptions(data).map(item => {
    const children = item.children?.length ? toTreeMenuOptions(item.children as SplitNavOptionData<T>[]) : undefined;

    return {
      value: item.value,
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      hidden: item.hidden,
      isGroup: item.isGroup,
      badge: item.badge,
      badgeProps: item.badgeProps,
      tag: item.tag,
      tagProps: item.tagProps,
      tooltipProps: item.tooltipProps,
      dropdownMenuProps: item.dropdownMenuProps,
      actions: item.actions,
      actionMenuProps: item.actionMenuProps,
      onActionSelect: item.onActionSelect,
      to: item.to,
      href: item.href,
      target: item.target,
      external: item.external,
      children: children?.length ? children : undefined
    };
  });
}

/**
 * Map SplitNav options to `TreeNavOptionData[]` for nested horizontal menus.
 */
export function toTreeNavOptions<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(
  data: SplitNavOptionData<T>[]
): TreeNavOptionData[] {
  return toVisibleOptions(data).map(item => {
    const children = item.children?.length ? toTreeNavOptions(item.children as SplitNavOptionData<T>[]) : undefined;

    return {
      value: item.value,
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      hidden: item.hidden,
      isGroup: item.isGroup,
      shortcut: item.shortcut,
      separator: item.separator,
      to: item.to,
      href: item.href,
      target: item.target,
      external: item.external,
      children: children?.length ? children : undefined
    };
  });
}

/**
 * Levels one pane or rail renders for a state.
 */
export interface SplitNavLevels<T extends SplitNavBaseOptionData = SplitNavBaseOptionData> {
  /** Source items of the level, with hidden nodes dropped. */
  sourceItems: SplitNavOptionData<T>[];
  /** Selectable items of the level: `isGroup` nodes are flattened into their children. */
  firstLevelItems: SplitNavOptionData<T>[];
  /** Ancestry of the selected value in the root tree. */
  selectionPath: string[];
  /** Item of the level the open path or the selection path selects. */
  activeItem: SplitNavOptionData<T> | undefined;
  /** Visible children of `activeItem`: the items the pane below this level renders. */
  childItems: SplitNavOptionData<T>[];
}

/**
 * Derive the levels a pane or rail renders from a state.
 *
 * `useSplitNavDerived` wraps this in computeds. It is also the core of
 * `resolveSplitNavSidebarColumns`, so a consumer that sizes a container around
 * the panes resolves the very same levels instead of restating the rules.
 *
 * `levelItems` renders a nested pane: its items are a subtree rather than the
 * root tree, while the selection path keeps being resolved against the root.
 */
export function resolveSplitNavLevels<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(options: {
  /** Root tree of the instance. */
  items: SplitNavOptionData<T>[];
  /** Source items of this level. Defaults to the root tree. */
  levelItems?: SplitNavOptionData<T>[];
  /** Selected leaf value. */
  modelValue: string;
  /** Path of the parents whose panes are open. */
  openPath: readonly string[];
}): SplitNavLevels<T> {
  const { items, levelItems, modelValue, openPath } = options;

  const sourceItems = toVisibleOptions((levelItems ?? items) as SplitNavOptionData<T>[]);
  const firstLevelItems = flattenFirstLevelItems(sourceItems);
  const selectionPath = findActivePath(items, modelValue);
  const activeItem = findActiveInLevel(firstLevelItems, openPath) ?? findActiveInLevel(firstLevelItems, selectionPath);

  return {
    sourceItems,
    firstLevelItems,
    selectionPath,
    activeItem,
    childItems: activeItem?.children?.length ? toVisibleOptions(activeItem.children as SplitNavOptionData<T>[]) : []
  };
}

/**
 * Vertical panes a mode renders inside a sidebar, outermost first.
 */
export interface SplitNavSidebarColumns {
  /** Whether the sidebar renders its first-level rail column. */
  rail: boolean;
  /** Whether the sidebar renders the pane column of the next level. */
  pane: boolean;
}

/**
 * Which sidebar columns a mode renders for a state.
 *
 * `SplitNavRoot` fills the sidebar with one or two vertical panes, and which of
 * them exist depends on the state: the mode decides which levels of the tree the
 * panes show, and a level only exists once the item above it is active and has
 * children. A consumer that has to size a container around those panes — the
 * `SAppShell` sidebar, which sizes the layout before rendering and cannot
 * measure during server rendering — asks here instead of restating the rules.
 *
 * - `dual-vertical`: the rail is the root level, the pane the level below it.
 * - `vertical-horizontal`: the sidebar is the rail alone, the pane renders in the header.
 * - `horizontal-vertical`: the sidebar is the pane alone.
 * - `horizontal-dual-vertical`: the sidebar hosts a dual-vertical pane of the active
 *   first-level item, so its rail is the second level and its pane the third.
 *
 * `openPath` is the path `SplitNavRoot` keeps internally; a consumer mirroring it
 * passes it here, and omitting it falls back to the selected value alone.
 */
export function resolveSplitNavSidebarColumns<T extends SplitNavBaseOptionData = SplitNavBaseOptionData>(options: {
  mode: SplitNavMode;
  items: SplitNavOptionData<T>[];
  modelValue: string;
  openPath?: readonly string[];
}): SplitNavSidebarColumns {
  const { mode, items, modelValue, openPath = [] } = options;
  const firstLevel = resolveSplitNavLevels({ items, modelValue, openPath });

  if (mode === 'vertical-horizontal') {
    return { rail: firstLevel.firstLevelItems.length > 0, pane: false };
  }

  if (mode === 'horizontal-vertical') {
    return { rail: false, pane: firstLevel.childItems.length > 0 };
  }

  if (mode === 'horizontal-dual-vertical') {
    const nested = resolveSplitNavLevels({
      items,
      levelItems: firstLevel.childItems,
      modelValue,
      openPath
    });

    return { rail: firstLevel.childItems.length > 0, pane: nested.childItems.length > 0 };
  }

  return { rail: firstLevel.firstLevelItems.length > 0, pane: firstLevel.childItems.length > 0 };
}
