import type { Direction } from '../types';

/**
 * A single visible node of a tree flattened for keyboard navigation.
 *
 * Only nodes that are currently rendered (every ancestor branch expanded) take
 * part in navigation, aligned with the WAI-ARIA tree pattern.
 */
export interface TreeNavigationNode {
  /** Unique value of the node. */
  value: string;
  /** Depth of the node inside the visible tree (0 = root level). */
  level: number;
  /** Whether the node renders children. */
  hasChildren: boolean;
  /** Whether the node's children are currently expanded. */
  expanded: boolean;
  /** Whether the node cannot receive focus. */
  disabled?: boolean;
}

/**
 * Logical navigation keys of a tree.
 *
 * `left`/`right` are the physical keys; RTL mapping happens inside
 * `resolveTreeNavigation` so callers can forward the raw event key.
 */
export type TreeNavigationKey = 'up' | 'down' | 'left' | 'right' | 'home' | 'end';

/**
 * Result of resolving a tree navigation key.
 *
 * - `targetValue`: move focus to the node carrying this value.
 * - `toggleExpand`: expand or collapse the current node instead of moving focus.
 */
export interface TreeNavigationResult {
  targetValue?: string;
  toggleExpand?: boolean;
}

const TREE_NAVIGATION_KEY_MAP: Record<string, TreeNavigationKey> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Home: 'home',
  End: 'end'
};

/**
 * Extract the logical tree navigation key from a keyboard event.
 *
 * Returns `null` for every non-navigation key so callers can bail out early.
 */
export function getTreeNavigationKey(event: KeyboardEvent): TreeNavigationKey | null {
  return TREE_NAVIGATION_KEY_MAP[event.key] ?? null;
}

/** Scan from `start` towards the boundary by `step`, returning the first enabled node value. */
function findFocusableInDirection(nodes: TreeNavigationNode[], start: number, step: 1 | -1): string | undefined {
  for (let index = start; index >= 0 && index < nodes.length; index += step) {
    const node = nodes[index];

    if (!node.disabled) return node.value;
  }

  return undefined;
}

/** Find the first focusable child of the subtree rooted at the current node. */
function findFirstFocusableChild(nodes: TreeNavigationNode[], currentIndex: number): string | undefined {
  const current = nodes[currentIndex];

  for (let index = currentIndex + 1; index < nodes.length; index += 1) {
    const node = nodes[index];

    // Left the current subtree: there is no rendered child at all.
    if (node.level <= current.level) return undefined;

    if (node.level === current.level + 1 && !node.disabled) return node.value;
  }

  return undefined;
}

/** Find the focusable parent of the current node (nearest preceding node one level up). */
function findFocusableParent(nodes: TreeNavigationNode[], currentIndex: number): string | undefined {
  const current = nodes[currentIndex];

  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    const node = nodes[index];

    if (node.level < current.level - 1) return undefined;

    if (node.level === current.level - 1) {
      // A disabled parent cannot receive focus; do not skip generations.
      return node.disabled ? undefined : node.value;
    }
  }

  return undefined;
}

/**
 * Resolve a tree navigation key against the flattened visible tree.
 *
 * Rules follow the WAI-ARIA APG tree pattern:
 *
 * - `up`/`down`: move to the previous/next visible node, skipping disabled
 *   nodes, without wrapping around.
 * - `right` (or `left` in RTL): closed branches expand (focus stays); expanded
 *   branches move focus to their first focusable child; leaves are no-ops.
 * - `left` (or `right` in RTL): expanded branches collapse; leaves and closed
 *   branches move focus to the parent; root-level nodes are no-ops.
 * - `home`/`end`: move to the first/last focusable visible node.
 */
export function resolveTreeNavigation(
  nodes: TreeNavigationNode[],
  currentValue: string,
  key: TreeNavigationKey,
  dir: Direction = 'ltr'
): TreeNavigationResult | null {
  const currentIndex = nodes.findIndex(node => node.value === currentValue);

  if (currentIndex === -1) return null;

  const current = nodes[currentIndex];

  switch (key) {
    case 'up': {
      const targetValue = findFocusableInDirection(nodes, currentIndex - 1, -1);

      return targetValue ? { targetValue } : null;
    }
    case 'down': {
      const targetValue = findFocusableInDirection(nodes, currentIndex + 1, 1);

      return targetValue ? { targetValue } : null;
    }
    case 'home': {
      const targetValue = findFocusableInDirection(nodes, 0, 1);

      return targetValue ? { targetValue } : null;
    }
    case 'end': {
      const targetValue = findFocusableInDirection(nodes, nodes.length - 1, -1);

      return targetValue ? { targetValue } : null;
    }
    default: {
      const forward = dir === 'rtl' ? key === 'left' : key === 'right';

      if (forward) {
        if (!current.hasChildren) return null;
        if (!current.expanded) return { toggleExpand: true };

        const targetValue = findFirstFocusableChild(nodes, currentIndex);

        return targetValue ? { targetValue } : null;
      }

      if (current.hasChildren && current.expanded) return { toggleExpand: true };

      const targetValue = findFocusableParent(nodes, currentIndex);

      return targetValue ? { targetValue } : null;
    }
  }
}
