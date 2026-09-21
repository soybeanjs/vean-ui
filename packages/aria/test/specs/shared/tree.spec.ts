import { describe, expect, it } from 'vitest';
import { filterHiddenTreeNodes, getTreePaths } from '../../../src/shared';

interface Node {
  value: string;
  hidden?: boolean;
  children?: Node[];
}

const tree: Node[] = [
  {
    value: 'a',
    children: [{ value: 'a1' }, { value: 'a2', children: [{ value: 'a2b' }] }]
  },
  { value: 'b' }
];

describe('getTreePaths', () => {
  it('returns the root-to-node path for a nested target', () => {
    expect(getTreePaths('a2b', tree)).toEqual(['a', 'a2', 'a2b']);
  });

  it('returns the path for a top-level node', () => {
    expect(getTreePaths('b', tree)).toEqual(['b']);
  });

  it('returns an empty path when the target is missing', () => {
    expect(getTreePaths('missing', tree)).toEqual([]);
  });

  it('returns an empty path for nullish targets', () => {
    expect(getTreePaths(null as unknown as string, tree)).toEqual([]);
    expect(getTreePaths(undefined as unknown as string, tree)).toEqual([]);
  });

  it('returns an empty path for an empty tree', () => {
    expect(getTreePaths('a', [])).toEqual([]);
  });
});

describe('filterHiddenTreeNodes', () => {
  it('returns an empty list for missing input', () => {
    expect(filterHiddenTreeNodes()).toEqual([]);
    expect(filterHiddenTreeNodes(undefined)).toEqual([]);
  });

  it('drops hidden nodes and keeps visible siblings in order', () => {
    const input: Node[] = [{ value: 'a' }, { value: 'b', hidden: true }, { value: 'c' }];

    expect(filterHiddenTreeNodes(input).map(node => node.value)).toEqual(['a', 'c']);
  });

  it('drops the whole subtree of a hidden branch', () => {
    const input: Node[] = [{ value: 'a', hidden: true, children: [{ value: 'a1' }] }, { value: 'b' }];

    expect(filterHiddenTreeNodes(input)).toEqual([{ value: 'b' }]);
  });

  it('filters nested children recursively', () => {
    const input: Node[] = [{ value: 'a', children: [{ value: 'a1' }, { value: 'a2', hidden: true }] }];

    expect(filterHiddenTreeNodes(input)[0]?.children?.map(node => node.value)).toEqual(['a1']);
  });

  it('leaves a node without visible children as an empty-children leaf', () => {
    const input: Node[] = [{ value: 'a', children: [{ value: 'a1', hidden: true }] }];

    expect(filterHiddenTreeNodes(input)[0]?.children).toEqual([]);
  });

  it('keeps the original node identity when nothing changes', () => {
    const node: Node = { value: 'a' };

    expect(filterHiddenTreeNodes([node])[0]).toBe(node);
  });
});
