import { describe, expect, it } from 'vitest';
import { filterNullish } from '../../../src/shared/array';

describe('filterNullish', () => {
  it('removes null and undefined values', () => {
    expect(filterNullish([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
  });

  it('keeps falsy but defined values', () => {
    expect(filterNullish([0, '', false, null, undefined])).toEqual([0, '', false]);
  });

  it('returns empty array for all-nullish input', () => {
    expect(filterNullish([null, undefined])).toEqual([]);
  });

  it('works with mixed object values', () => {
    const value = { id: 1 };
    expect(filterNullish([value, null])).toEqual([value]);
  });
});
