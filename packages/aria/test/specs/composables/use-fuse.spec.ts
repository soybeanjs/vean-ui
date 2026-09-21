import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useFuse } from '../../../src/composables/use-fuse';

describe('useFuse', () => {
  const data = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' }
  ];

  it('returns matching results sorted by score', () => {
    const search = ref('an');
    const { results } = useFuse(search, ref(data), {
      fuseOptions: { keys: ['label'] }
    });

    expect(results.value.length).toBeGreaterThan(0);
    expect(results.value.every(result => 'item' in result && 'refIndex' in result && 'score' in result)).toBe(true);
    expect(results.value[0]?.item.label).toBe('Banana');
  });

  it('is reactive to search changes', () => {
    const search = ref('');
    const { results } = useFuse(search, ref(data), { fuseOptions: { keys: ['label'] } });

    search.value = 'cherry';
    expect(results.value).toHaveLength(1);
    expect(results.value[0]?.item.value).toBe('cherry');
  });

  it('returns all items with a score when search is empty and matchAllWhenSearchEmpty is set', () => {
    const { results } = useFuse(ref(''), ref(data), { matchAllWhenSearchEmpty: true });

    expect(results.value).toHaveLength(data.length);
    expect(results.value.map(result => result.item.label)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('returns no results for an empty search by default', () => {
    const { results } = useFuse(ref(''), ref(data), { fuseOptions: { keys: ['label'] } });
    expect(results.value).toEqual([]);
  });

  it('honors resultLimit', () => {
    const many = ['aa', 'ab', 'ac', 'ad'].map(label => ({ label }));
    const { results } = useFuse(ref('a'), ref(many), {
      resultLimit: 2,
      fuseOptions: { keys: ['label'] }
    });

    expect(results.value).toHaveLength(2);
  });

  it('is reactive to data changes', () => {
    const dynamicData = ref([...data]);
    const { results } = useFuse(ref('date'), dynamicData, { fuseOptions: { keys: ['label'] } });

    expect(results.value).toHaveLength(0);

    dynamicData.value = [...dynamicData.value, { label: 'Date', value: 'date' }];
    expect(results.value).toHaveLength(1);
    expect(results.value[0]?.item.label).toBe('Date');
  });
});
