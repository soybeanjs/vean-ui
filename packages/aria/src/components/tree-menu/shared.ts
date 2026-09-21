import { COLLECTION_ITEM_ATTRIBUTE } from '../../constants';
import { filterHiddenTreeNodes, getTreePaths } from '../../shared';
import type { TreeNavigationNode } from '../../shared';
import type { Direction } from '../../types';
import type { TreeMenuBaseOptionData, TreeMenuOptionData } from './types';

export const treeMenuCssVars = {
  collapsedWidth: '--vean-tree-menu-collapsed-width',
  indent: '--vean-tree-menu-indent'
};

function collectGroupValues<T extends TreeMenuBaseOptionData>(items: TreeMenuOptionData<T>[]): string[] {
  return items.flatMap(item => [
    ...(item.isGroup ? [item.value] : []),
    ...(item.children ? collectGroupValues(item.children) : [])
  ]);
}

/**
 * Returns the values that should be kept expanded for the given active value:
 * the active value plus every collapsible ancestor. Group nodes are excluded
 * because they are pure visual containers and never expand or collapse.
 */
export function getActiveExpandValues<T extends TreeMenuBaseOptionData>(
  targetValue: string,
  items: TreeMenuOptionData<T>[]
): string[] {
  const paths = getTreePaths(targetValue, items);

  if (paths.length === 0) {
    return paths;
  }

  const groupValues = new Set(collectGroupValues(items));

  return paths.filter(value => !groupValues.has(value));
}

/**
 * Recursively remove options flagged as `hidden`, so rendering, the active path
 * search and the keyboard navigation all agree on the visible tree.
 */
export function filterHiddenTreeMenuOptions<T extends TreeMenuBaseOptionData>(
  items?: TreeMenuOptionData<T>[]
): TreeMenuOptionData<T>[] {
  return filterHiddenTreeNodes(items);
}

/**
 * Flatten the visible tree into keyboard navigation nodes.
 *
 * Hidden items are skipped, group containers stay transparent (their children
 * keep the group's level), and a branch's children are only emitted while the
 * branch is expanded — so the result matches the rendered DOM order exactly.
 */
export function flattenTreeMenuNavigationNodes<T extends TreeMenuBaseOptionData>(
  items: TreeMenuOptionData<T>[],
  isExpanded: (value: string) => boolean
): TreeNavigationNode[] {
  const nodes: TreeNavigationNode[] = [];

  const walk = (list: TreeMenuOptionData<T>[], level: number) => {
    for (const item of list) {
      if (item.hidden) continue;

      // Group containers never receive focus; only their children do.
      if (item.isGroup) {
        walk(item.children ?? [], level);
        continue;
      }

      const children = item.children ?? [];
      const hasChildren = children.some(child => !child.hidden);
      const expanded = hasChildren && isExpanded(item.value);

      nodes.push({ value: item.value, level, hasChildren, expanded, disabled: item.disabled });

      if (expanded) {
        walk(children, level + 1);
      }
    }
  };

  walk(items, 0);

  return nodes;
}

/**
 * Whether the key moves into the collapsed dropdown popup (the forward
 * direction): ArrowRight in LTR and ArrowLeft in RTL.
 */
export function isCollapsedMenuForwardKey(key: string, dir?: Direction): boolean {
  return key === (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
}

/**
 * Whether the key moves out of the collapsed dropdown popup (the backward
 * direction): ArrowLeft in LTR and ArrowRight in RTL.
 */
export function isCollapsedMenuBackwardKey(key: string, dir?: Direction): boolean {
  return key === (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
}

/**
 * Resolve the popup id exposed by the item's dropdown trigger while it is open.
 */
export function getCollapsedMenuPopupId(buttonElement: HTMLElement): string | null {
  const collapsible = buttonElement.closest<HTMLElement>('[data-vean-tree-menu-collapsible-root]');
  const popupTrigger = collapsible?.querySelector<HTMLElement>('[data-vean-dropdown-menu-trigger]');

  return popupTrigger?.getAttribute('aria-controls') ?? null;
}

/**
 * Focus the first item of the dropdown popup opened by a collapsed menu item.
 *
 * The popup is teleported; while open, the item's dropdown trigger exposes its
 * id through `aria-controls`.
 */
export function focusCollapsedMenuPopupItem(buttonElement: HTMLElement): void {
  const popupId = getCollapsedMenuPopupId(buttonElement);
  const popup = popupId ? document.getElementById(popupId) : null;

  popup?.querySelector<HTMLElement>(`[${COLLECTION_ITEM_ATTRIBUTE}]:not([data-disabled])`)?.focus();
}
