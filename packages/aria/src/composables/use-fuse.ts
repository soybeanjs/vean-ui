import { computed, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { fuzzySearch } from '../shared';
import type { FuzzyOptions, FuzzyResult } from '../shared';

export type FuseOptions<T> = FuzzyOptions<T>;

export interface UseFuseOptions<T> {
  fuseOptions?: FuseOptions<T>;
  resultLimit?: number;
  matchAllWhenSearchEmpty?: boolean;
}

export interface UseFuseReturn<T> {
  results: ComputedRef<FuzzyResult<T>[]>;
}

/**
 * Reactive fuzzy search over a list of items, backed by the dependency-free
 * `fuzzySearch` utility (fuse.js replacement). Scoring: exact > prefix > substring > subsequence,
 * with optional per-key weights and a result limit.
 *
 * @param search - The search query (supports reactive values)
 * @param data - The items to search (supports reactive values)
 * @param options - Search options: key/weight config, result limit, and whether an empty
 * query returns all items
 */
export function useFuse<T>(
  search: MaybeRefOrGetter<string>,
  data: MaybeRefOrGetter<T[]>,
  options?: MaybeRefOrGetter<UseFuseOptions<T>>
): UseFuseReturn<T> {
  const results = computed<FuzzyResult<T>[]>(() => {
    const resolved = toValue(options);
    const query = toValue(search);
    const items = toValue(data) ?? [];

    if (resolved?.matchAllWhenSearchEmpty && !query) {
      return items.map((item, index) => ({ item, refIndex: index, score: 1 }));
    }

    return fuzzySearch(query, items, {
      ...resolved?.fuseOptions,
      limit: resolved?.resultLimit ?? resolved?.fuseOptions?.limit
    });
  });

  return {
    results
  };
}
