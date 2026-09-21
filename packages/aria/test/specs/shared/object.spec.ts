import { describe, expect, it } from 'vitest';
import {
  arrayRemove,
  appendAt,
  chunk,
  defu,
  findValuesBetween,
  flattenChildren,
  insertAt,
  isEqual,
  klona,
  moveAt,
  omit,
  pick,
  prependAt,
  removeAt,
  swapAt,
  updateAt,
  wrapArray,
  getNextMatch
} from '../../../src/shared';

describe('defu', () => {
  it('merges defaults with left-side priority', () => {
    expect(defu({ a: 1 }, { a: 2, b: 3 })).toEqual({ a: 1, b: 3 });
  });

  it('merges nested plain objects recursively', () => {
    expect(defu({ nested: { a: 1 } }, { nested: { a: 9, b: 2 } })).toEqual({
      nested: { a: 1, b: 2 }
    });
  });

  it('does not overwrite defined arrays on the left side', () => {
    expect(defu({ list: [1] }, { list: [2, 3] })).toEqual({ list: [1] });
  });

  it('fills in array values that are missing on the left side', () => {
    expect(defu({}, { list: [2, 3] })).toEqual({ list: [2, 3] });
  });

  it('merges multiple defaults left to right', () => {
    expect(defu({ a: 1 }, { b: 2 }, { c: 3, b: 9 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('does not mutate the source object', () => {
    const source = { a: 1 };
    defu(source, { b: 2 });
    expect(source).toEqual({ a: 1 });
  });
});

describe('isEqual', () => {
  it('treats primitives by identity', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('a', 'a')).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
  });

  it('treats NaN as equal to NaN', () => {
    expect(isEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  it('compares dates by timestamp', () => {
    expect(isEqual(new Date(1000), new Date(1000))).toBe(true);
    expect(isEqual(new Date(1000), new Date(2000))).toBe(false);
  });

  it('compares arrays element-wise', () => {
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
  });

  it('compares objects by own enumerable keys', () => {
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('returns false for structurally different types', () => {
    expect(isEqual({ 0: 1 }, [1])).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
  });
});

describe('klona', () => {
  it('clones plain objects deeply', () => {
    const source = { a: 1, nested: { b: 2 } };
    const clone = klona(source);
    expect(clone).toEqual(source);
    expect(clone).not.toBe(source);
    expect(clone.nested).not.toBe(source.nested);
  });

  it('clones arrays deeply', () => {
    const source = [1, [2], { a: 3 }];
    const clone = klona(source);
    expect(clone).toEqual(source);
    expect(clone[1]).not.toBe(source[1]);
    expect(clone[2]).not.toBe(source[2]);
  });

  it('clones dates by value', () => {
    const date = new Date(12345);
    const clone = klona(date);
    expect(clone).not.toBe(date);
    expect(clone.getTime()).toBe(12345);
  });

  it('returns primitives as-is', () => {
    expect(klona(1)).toBe(1);
    expect(klona('a')).toBe('a');
    expect(klona(null)).toBe(null);
  });
});

describe('pick / omit', () => {
  it('picks the specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('omits the specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

describe('array helpers', () => {
  it('arrayRemove returns a new array without the item', () => {
    const source = [1, 2, 3];
    expect(arrayRemove(source, 2)).toEqual([1, 3]);
    expect(source).toEqual([1, 2, 3]);
    expect(arrayRemove(source, 9)).toEqual([1, 2, 3]);
  });

  it('wrapArray rotates an array at the start index', () => {
    expect(wrapArray(['a', 'b', 'c', 'd'], 2)).toEqual(['c', 'd', 'a', 'b']);
    expect(wrapArray(['a', 'b'], -1)).toEqual(['b', 'a']);
    expect(wrapArray([], 3)).toEqual([]);
  });

  it('appendAt / prependAt append and prepend immutably', () => {
    expect(appendAt([1, 2], 3)).toEqual([1, 2, 3]);
    expect(prependAt([2, 3], 1)).toEqual([1, 2, 3]);
  });

  it('removeAt removes the item at the index', () => {
    expect(removeAt([1, 2, 3], 1)).toEqual([1, 3]);
    expect(removeAt([1, 2, 3])).toEqual([]);
  });

  it('swapAt swaps two positions in place', () => {
    const data = [1, 2, 3];
    swapAt(data, 0, 2);
    expect(data).toEqual([3, 2, 1]);
  });

  it('moveAt moves an item between positions in place', () => {
    const data = [1, 2, 3];
    moveAt(data, 0, 2);
    expect(data).toEqual([2, 3, 1]);
  });

  it('insertAt / updateAt return new arrays', () => {
    expect(insertAt([1, 3], 1, 2)).toEqual([1, 2, 3]);
    expect(updateAt([1, 2, 3], 1, 9)).toEqual([1, 9, 3]);
  });

  it('chunk splits arrays into fixed-size groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(() => chunk([1], 0)).toThrow(RangeError);
  });
});

describe('findValuesBetween', () => {
  it('returns the slice between two values regardless of order', () => {
    const array = ['a', 'b', 'c', 'd'];
    expect(findValuesBetween(array, 'b', 'd')).toEqual(['b', 'c', 'd']);
    expect(findValuesBetween(array, 'd', 'b')).toEqual(['b', 'c', 'd']);
  });

  it('returns an empty array when a bound is missing', () => {
    expect(findValuesBetween(['a', 'b'], 'a', 'z')).toEqual([]);
  });
});

describe('flattenChildren', () => {
  it('flattens nested children depth-first', () => {
    const tree = [{ id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }, { id: 5 }];
    expect(flattenChildren(tree).map(item => item.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns an empty array for undefined input', () => {
    expect(flattenChildren(undefined)).toEqual([]);
  });
});

describe('getNextMatch', () => {
  const values = ['apple', 'banana', 'cherry'];

  it('finds the next value starting with the search', () => {
    expect(getNextMatch(values, 'b')).toBe('banana');
  });

  it('wraps around the array', () => {
    expect(getNextMatch(values, 'a', 'cherry')).toBe('apple');
  });

  it('excludes the current match for single-character searches', () => {
    expect(getNextMatch(values, 'b', 'banana')).toBeUndefined();
  });

  it('keeps the current match for multi-character searches', () => {
    // The current match still satisfies the search, so focus does not move
    expect(getNextMatch(values, 'ba', 'banana')).toBeUndefined();
  });

  it('normalizes repeated characters', () => {
    expect(getNextMatch(values, 'ccc')).toBe('cherry');
  });

  it('returns undefined for empty inputs', () => {
    expect(getNextMatch(undefined, 'a')).toBeUndefined();
    expect(getNextMatch(values, '')).toBeUndefined();
  });
});
