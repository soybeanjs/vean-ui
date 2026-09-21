import type { FlattenedItem, TreeItemData, TreeMotionListItem, TreeMotionSentinel } from './types';

const MOTION_SENTINEL: TreeMotionSentinel = { __soybeanTreeMotionSentinel__: true };

/**
 * Type guard for the motion sentinel in a motion render list.
 */
export function isTreeMotionItem<T extends TreeItemData>(item: TreeMotionListItem<T>): item is TreeMotionSentinel {
  return Boolean(item && (item as TreeMotionSentinel).__soybeanTreeMotionSentinel__);
}

/**
 * Result of diffing two expanded-key snapshots.
 */
export interface ExpandedKeyChange {
  /**
   * Whether the changed key was added (`show` motion) or removed (`hide` motion).
   */
  add: boolean;
  /**
   * The expanded key that changed, or `null` when the change cannot be
   * attributed to a single key (e.g. multiple keys toggled at once).
   */
  key: string | null;
}

/**
 * Diff two expanded-key snapshots and report the single changed key.
 * Returns a `null` key when nothing changed, both snapshots are equal, or the
 * change spans multiple keys.
 *
 * @param prev Previous expanded keys.
 * @param next Next expanded keys.
 */
export function findExpandedKeyChange(prev: string[], next: string[]): ExpandedKeyChange {
  const prevLength = prev.length;
  const nextLength = next.length;

  if (prevLength === nextLength) return { add: false, key: null };

  function findChanged(shorter: string[], longer: string[]) {
    const cache = new Set(shorter);

    return longer.filter(key => !cache.has(key));
  }

  if (prevLength < nextLength) {
    const changed = findChanged(prev, next);

    return { add: changed.length === 1, key: changed.length === 1 ? changed[0] : null };
  }

  const changed = findChanged(next, prev);

  return { add: false, key: changed.length === 1 ? changed[0] : null };
}

/**
 * Collect the flattened descendant items of `key`: the range between the keyed
 * item and the item that follows it in the shorter (collapsed) snapshot,
 * taken from the longer (expanded) snapshot.
 *
 * @param shorter Flattened items without the motion range.
 * @param longer Flattened items with the motion range.
 * @param key Value of the expanded/collapsed parent item.
 */
export function getMotionRange<T extends TreeItemData>(
  shorter: FlattenedItem<T>[],
  longer: FlattenedItem<T>[],
  key: string
): FlattenedItem<T>[] {
  const shorterEndIndex = shorter.findIndex(item => item.value === key) + 1;
  const shorterEndItem = shorter[shorterEndIndex];
  const longerStartIndex = longer.findIndex(item => item.value === key);

  if (longerStartIndex === -1) return [];

  if (shorterEndItem) {
    const longerEndIndex = longer.findIndex(item => item.value === shorterEndItem.value);

    return longer.slice(longerStartIndex + 1, longerEndIndex);
  }

  return longer.slice(longerStartIndex + 1);
}

/**
 * Copy of a flattened list with the motion sentinel spliced in right after the
 * keyed item. UI layers render the sentinel as the animated subtree block.
 *
 * @param items Flattened items to copy.
 * @param key Value of the expanded/collapsed parent item.
 */
export function spliceMotionSentinel<T extends TreeItemData>(
  items: FlattenedItem<T>[],
  key: string
): Array<FlattenedItem<T> | TreeMotionSentinel> {
  const parentIndex = items.findIndex(item => item.value === key);

  if (parentIndex === -1) return [...items];

  const result: Array<FlattenedItem<T> | TreeMotionSentinel> = items.slice();

  result.splice(parentIndex + 1, 0, MOTION_SENTINEL);

  return result;
}
