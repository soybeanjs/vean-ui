import { shallowReactive } from 'vue';
import type { DefinedValue } from '../../types';
import type { CascaderFieldKeys, CascaderNode, CascaderOptionData } from './types';

const cascaderNodeUid = (() => {
  let index = 0;
  return () => `cascader-node-${index++}`;
})();

/** Custom event names used to dispatch cancellable select / expand interactions. */
export const CASCADER_SELECT_EVENT = 'cascader.select';
export const CASCADER_EXPAND_EVENT = 'cascader.expand';

const DEFAULTS: Required<CascaderFieldKeys> = {
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled'
};

export function mergeCascaderFieldKeys(fieldKeys?: CascaderFieldKeys): Required<CascaderFieldKeys> {
  return { ...DEFAULTS, ...fieldKeys };
}

/**
 * Builds a reactive cascader node from a raw option, caching `pathValues`, `pathLabels`
 * and `level` so runtime lookups are O(1).
 */
export function createCascaderNode<T extends DefinedValue = DefinedValue>(
  option: CascaderOptionData<T>,
  fieldKeys: Required<CascaderFieldKeys>,
  parent: CascaderNode<T> | null,
  index: number
): CascaderNode<T> {
  const value = (option[fieldKeys.value] ?? index) as T;
  const label = (option[fieldKeys.label] ?? String(value)) as string;
  const disabled = Boolean(option[fieldKeys.disabled]);
  const rawChildren = option[fieldKeys.children];

  // `children === true` marks a lazy-loadable node whose children are not available yet.
  const hasPendingChildren = rawChildren === true;

  // `shallowReactive` avoids ref-unwrapping of the generic value and keeps node
  // mutations (checked / children / loading) reactive at the node level.
  const node = shallowReactive<CascaderNode<T>>({
    uid: cascaderNodeUid(),
    value,
    label,
    disabled,
    raw: option,
    children: null,
    isLeaf: true,
    level: parent ? parent.level + 1 : 0,
    pathValues: parent ? [...parent.pathValues, value] : [value],
    pathLabels: parent ? [...parent.pathLabels, label] : [label],
    loading: false,
    loaded: !hasPendingChildren,
    parent,
    checked: false,
    indeterminate: false
  });

  // Children are created with `node` as their parent so their cached
  // `pathValues` / `pathLabels` / `level` are correct from the start.
  if (hasPendingChildren) {
    node.children = null;
    node.isLeaf = false;
    node.loaded = false;
  } else if (Array.isArray(rawChildren)) {
    const children = (rawChildren as CascaderOptionData<T>[]).map((child, childIndex) =>
      createCascaderNode(child, fieldKeys, node, childIndex)
    );
    node.children = children;
    node.isLeaf = children.length === 0;
  } else {
    node.children = [];
    node.isLeaf = true;
  }

  return node;
}

/**
 * Builds the root level nodes of the cascader tree.
 */
export function buildCascaderNodes<T extends DefinedValue = DefinedValue>(
  options: CascaderOptionData<T>[] | undefined,
  fieldKeys: Required<CascaderFieldKeys>
): CascaderNode<T>[] {
  return (options ?? []).map((option, index) => createCascaderNode(option, fieldKeys, null, index));
}

/**
 * Flattens the tree depth-first, including every node.
 */
export function flattenCascaderNodes<T extends DefinedValue = DefinedValue>(
  nodes: CascaderNode<T>[],
  result: CascaderNode<T>[] = []
): CascaderNode<T>[] {
  for (const node of nodes) {
    result.push(node);
    if (node.children) {
      flattenCascaderNodes(node.children, result);
    }
  }
  return result;
}

/**
 * Finds a node by its value (root first).
 */
export function findCascaderNodeByValue<T extends DefinedValue = DefinedValue>(
  nodes: CascaderNode<T>[],
  value: T
): CascaderNode<T> | undefined {
  for (const node of nodes) {
    if (node.value === value) return node;
    if (node.children) {
      const found = findCascaderNodeByValue(node.children, value);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Finds a node by its full path of values.
 */
export function findCascaderNodeByPath<T extends DefinedValue = DefinedValue>(
  nodes: CascaderNode<T>[],
  path: T[]
): CascaderNode<T> | undefined {
  return findCascaderNodeByPathRecursive(nodes, path, 0);
}

function findCascaderNodeByPathRecursive<T extends DefinedValue = DefinedValue>(
  nodes: CascaderNode<T>[],
  path: T[],
  index: number
): CascaderNode<T> | undefined {
  if (index >= path.length) return undefined;

  const target = path[index];
  for (const node of nodes) {
    if (node.value === target) {
      if (index === path.length - 1) return node;
      if (node.children) {
        return findCascaderNodeByPathRecursive(node.children, path, index + 1);
      }
      return undefined;
    }
  }
  return undefined;
}

/**
 * Returns the ancestors of a node plus the node itself, root first.
 */
export function getCascaderAncestorPath<T extends DefinedValue = DefinedValue>(
  node: CascaderNode<T>
): CascaderNode<T>[] {
  const path: CascaderNode<T>[] = [];
  let current: CascaderNode<T> | null = node;
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

/**
 * Whether `ancestor` is an ancestor of `node` (the node itself is excluded).
 *
 * Used to emphasize the parents of the currently selected node across the
 * linked columns, mirroring the TreeMenu `child-selected` behavior.
 */
export function isCascaderNodeAncestor<T extends DefinedValue = DefinedValue>(
  node: CascaderNode<T>,
  ancestor: CascaderNode<T>
): boolean {
  let current = node.parent;
  while (current) {
    if (current.uid === ancestor.uid) return true;
    current = current.parent;
  }
  return false;
}

/**
 * Whether the children of a node still need to be loaded (lazy mode).
 */
export function isLazyCascaderNode<T extends DefinedValue = DefinedValue>(node: CascaderNode<T>): boolean {
  return node.children === null;
}
