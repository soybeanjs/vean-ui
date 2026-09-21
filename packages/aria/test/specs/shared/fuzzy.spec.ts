import { describe, expect, it } from 'vitest';
import { fuzzySearch } from '../../../src/shared/fuzzy';

interface Item {
  label: string;
  value: string;
  groupLabel?: string;
}

const items: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' }
];

describe('fuzzySearch', () => {
  it('returns empty array for empty query', () => {
    expect(fuzzySearch('', items)).toEqual([]);
    expect(fuzzySearch('   ', items)).toEqual([]);
  });

  it('matches exact text with the highest score', () => {
    const results = fuzzySearch('apple', items, { keys: ['label'] });
    expect(results[0]?.item.label).toBe('Apple');
    expect(results[0]?.score).toBe(1);
  });

  it('ranks prefix matches above substring matches', () => {
    const data = ['grape', 'apricot', 'pineapple'];
    const results = fuzzySearch('ap', data);
    expect(results[0]?.item).toBe('apricot');
    // 'grape' and 'pineapple' are substring matches (equal score, ordered by index)
    expect(results.map(r => r.item)).toEqual(['apricot', 'grape', 'pineapple']);
  });

  it('supports subsequence matching', () => {
    const results = fuzzySearch('apl', ['apple', 'banana']);
    expect(results).toHaveLength(1);
    expect(results[0]?.item).toBe('apple');
  });

  it('is case-insensitive and trims the query', () => {
    const results = fuzzySearch('  APPLE ', items, { keys: ['label'] });
    expect(results[0]?.item.value).toBe('apple');
  });

  it('searches across multiple keys and aggregates scores', () => {
    const results = fuzzySearch('cherry', items, { keys: ['label', 'value', 'groupLabel'] });
    expect(results).toHaveLength(1);
    expect(results[0]?.item.value).toBe('cherry');
  });

  it('supports accessor functions as keys', () => {
    const results = fuzzySearch('ban', items, { keys: [item => item.label] });
    expect(results[0]?.item.value).toBe('banana');
  });

  it('weights keys according to the weights option', () => {
    const data: Item[] = [
      { label: 'no match here', value: 'apple' },
      { label: 'apple', value: 'zzz' }
    ];
    // Heavier weight on label: exact label match wins over exact value match
    const results = fuzzySearch('apple', data, { keys: ['label', 'value'], weights: [3, 1] });
    expect(results[0]?.item.value).toBe('zzz');
  });

  it('limits the number of results', () => {
    const data = ['aa', 'ab', 'ac', 'ad'];
    const results = fuzzySearch('a', data, { limit: 2 });
    expect(results).toHaveLength(2);
  });

  it('returns no results when nothing matches', () => {
    expect(fuzzySearch('zzz', items, { keys: ['label'] })).toEqual([]);
  });

  it('sorts equal scores by original index', () => {
    const data = ['ba', 'ba'];
    const results = fuzzySearch('ba', data);
    expect(results.map(r => r.refIndex)).toEqual([0, 1]);
  });
});
