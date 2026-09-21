import type { FlattenedItem, TreeItemData } from './types';

export const TREE_SELECT = 'tree.select';
export const TREE_TOGGLE = 'tree.toggle';

export function flattenItems<T extends TreeItemData>(
  items?: T[],
  expandedValues?: string[],
  level: number = 1,
  parent?: T
): FlattenedItem<T>[] {
  if (!items) return [];

  return items.reduce((acc: FlattenedItem<T>[], item: T, index: number) => {
    const children = item.children as T[];
    const isExpanded = expandedValues?.includes(item.value);

    const flattenedItem: FlattenedItem<T> = {
      _id: item.value,
      value: item.value,
      data: item,
      index,
      level,
      parent,
      hasChildren: Boolean(children),
      bind: {
        data: item,
        level,
        'aria-setsize': items.length,
        'aria-posinset': index + 1
      }
    };
    acc.push(flattenedItem);

    if (children && isExpanded) {
      acc.push(...flattenItems(children, expandedValues, level + 1, item));
    }

    return acc;
  }, []);
}

export function recurseCheckChildren(selected: string[], items?: TreeItemData[]): boolean {
  if (!items) return false;

  return items.some(item => {
    if (selected.includes(item.value)) {
      return true;
    }

    return recurseCheckChildren(selected, item.children);
  });
}

/**
 *  Find the array of values of all parent nodes of the specified node (from the root to the parent of the target node)
 * @param targetValue The value of the target node
 * @param items The array of tree nodes
 * @param parentPath The current path (used for recursion)
 * @returns An array of parent node values, or null if not found
 */
export function findParentPath<T extends TreeItemData>(
  targetValue: string,
  items?: T[],
  parentPath: string[] = []
): string[] | null {
  if (!items) return null;

  for (const item of items) {
    if (item.value === targetValue) {
      return parentPath;
    }

    if (item.children) {
      const found = findParentPath(targetValue, item.children, [...parentPath, item.value]);
      if (found !== null) {
        return found;
      }
    }
  }

  return null;
}
