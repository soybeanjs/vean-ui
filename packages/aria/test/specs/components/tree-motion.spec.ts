import { describe, expect, it } from 'vitest';
import {
  findExpandedKeyChange,
  getMotionRange,
  isTreeMotionItem,
  spliceMotionSentinel
} from '../../../src/components/tree/tree-motion';
import type { FlattenedItem, TreeItemData } from '../../../src/components/tree/types';

function item(value: string): FlattenedItem<TreeItemData> {
  return {
    _id: value,
    index: 0,
    value,
    data: { value } as TreeItemData,
    level: 1,
    hasChildren: false,
    bind: { data: { value } as TreeItemData, level: 1 }
  };
}

function list(...values: string[]): FlattenedItem<TreeItemData>[] {
  return values.map(value => item(value));
}

describe('findExpandedKeyChange', () => {
  it('reports a single added key', () => {
    expect(findExpandedKeyChange(['a'], ['a', 'b'])).toEqual({ add: true, key: 'b' });
  });

  it('reports a single removed key', () => {
    expect(findExpandedKeyChange(['a', 'b'], ['a'])).toEqual({ add: false, key: 'b' });
  });

  it('returns null when nothing changed', () => {
    expect(findExpandedKeyChange(['a', 'b'], ['a', 'b'])).toEqual({ add: false, key: null });
  });

  it('returns null when multiple keys changed at once', () => {
    expect(findExpandedKeyChange(['a'], ['a', 'b', 'c'])).toEqual({ add: false, key: null });
  });
});

describe('getMotionRange', () => {
  it('collects the descendants between the parent and its next sibling', () => {
    const shorter = list('root', 'sibling');
    const longer = list('root', 'child-1', 'child-2', 'sibling');

    expect(getMotionRange(shorter, longer, 'root').map(i => i.value)).toEqual(['child-1', 'child-2']);
  });

  it('collects to the end when the parent has no following sibling', () => {
    const shorter = list('root');
    const longer = list('root', 'child-1', 'grandchild');

    expect(getMotionRange(shorter, longer, 'root').map(i => i.value)).toEqual(['child-1', 'grandchild']);
  });

  it('returns empty when the key is absent from the longer list', () => {
    expect(getMotionRange(list('a'), list('a', 'b'), 'missing')).toEqual([]);
  });
});

describe('spliceMotionSentinel', () => {
  it('inserts the sentinel right after the keyed item', () => {
    const result = spliceMotionSentinel(list('root', 'child', 'sibling'), 'root');

    expect(result).toHaveLength(4);
    expect(isTreeMotionItem(result[1])).toBe(true);
    expect(isTreeMotionItem(result[0])).toBe(false);
    expect(isTreeMotionItem(result[3])).toBe(false);
  });

  it('returns a copy without sentinel when the key is missing', () => {
    const source = list('a', 'b');
    const result = spliceMotionSentinel(source, 'missing');

    expect(result).toHaveLength(2);
    expect(result.every(entry => !isTreeMotionItem(entry))).toBe(true);
    expect(result).not.toBe(source);
  });
});
