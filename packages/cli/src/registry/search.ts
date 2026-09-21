/**
 * Enhanced registry search system for Vean CLI.
 *
 * Supports:
 * - Full-text search by component name and description
 * - Filtering by type (component, hook, utility, etc.)
 * - Sorting by relevance, name, or date
 * - Fuzzy matching
 */

import type { RegistryItem } from './schema';

export interface SearchOptions {
  query?: string;
  type?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'name' | 'date';
}

export interface SearchResult {
  items: RegistryItem[];
  total: number;
  offset: number;
  limit: number;
  query?: string;
}

/**
 * Levenshtein distance for fuzzy matching.
 */
function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  const dp: number[][] = Array(aLen + 1)
    .fill(null)
    .map(() => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= bLen; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[aLen][bLen];
}

/**
 * Calculate relevance score for search match.
 * Returns score 0-100, where 100 is exact match.
 */
function calculateRelevance(item: RegistryItem, query: string): number {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = item.name.toLowerCase();
  const description = item.description?.toLowerCase() ?? '';
  const tags = (item.meta?.tags ?? []).map((t: string) => t.toLowerCase());

  let score = 0;

  // Exact name match
  if (normalizedName === normalizedQuery) {
    return 100;
  }

  // Name starts with query
  if (normalizedName.startsWith(normalizedQuery)) {
    score += 80;
  }

  // Name contains query
  if (normalizedName.includes(normalizedQuery)) {
    score += 60;
  }

  // Description contains query
  if (description.includes(normalizedQuery)) {
    score += 40;
  }

  // Tags contain query
  if (tags.some((t: string) => t === normalizedQuery || t.includes(normalizedQuery))) {
    score += 50;
  }

  // Fuzzy match
  const distance = levenshteinDistance(normalizedName, normalizedQuery);
  if (distance <= 2) {
    score += 70 - distance * 20;
  }

  return Math.min(100, score);
}

/**
 * Filter registry items by type.
 */
function filterByType(items: RegistryItem[], type: string): RegistryItem[] {
  return items.filter(item => {
    const itemType = item.type ?? 'component';
    return itemType === type || itemType.includes(type);
  });
}

/**
 * Search registry items with full-text search and filtering.
 */
export function searchRegistry(items: RegistryItem[], options: SearchOptions): SearchResult {
  let filtered = items;

  // Filter by type
  if (options.type) {
    filtered = filterByType(filtered, options.type);
  }

  // Search and rank
  let ranked = filtered;

  if (options.query) {
    ranked = filtered
      .map(item => ({
        item,
        score: calculateRelevance(item, options.query!)
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }

  // Sort
  if (!options.query) {
    ranked = ranked.sort((a, b) => {
      switch (options.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date': {
          const dateA =
            a.meta && typeof a.meta === 'object' && 'updated' in a.meta ? new Date(a.meta.updated as any).getTime() : 0;
          const dateB =
            b.meta && typeof b.meta === 'object' && 'updated' in b.meta ? new Date(b.meta.updated as any).getTime() : 0;
          return dateB - dateA;
        }
        default:
          // Keep original order for relevance (already sorted)
          return 0;
      }
    });
  }

  // Paginate
  const offset = options.offset ?? 0;
  const limit = options.limit ?? 10;
  const paginated = ranked.slice(offset, offset + limit);

  return {
    items: paginated,
    total: ranked.length,
    offset,
    limit,
    query: options.query
  };
}

/**
 * Find similar components based on tags and description.
 */
export function findSimilarComponents(item: RegistryItem, allItems: RegistryItem[], limit = 5): RegistryItem[] {
  const itemTags = new Set(item.meta?.tags ?? []);
  const scores = allItems
    .filter(i => i.name !== item.name)
    .map(i => {
      const iTags = new Set(i.meta?.tags ?? []);
      const commonTags = [...itemTags].filter(t => iTags.has(t)).length;
      const tagScore = (commonTags / Math.max(itemTags.size, 1)) * 100;

      return { item: i, score: tagScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scores.map(s => s.item);
}

/**
 * Get registry statistics.
 */
export function getRegistryStats(items: RegistryItem[]): {
  totalCount: number;
  byType: Record<string, number>;
  totalSize: number;
  avgDescriptionLength: number;
} {
  const byType: Record<string, number> = {};
  let totalSize = 0;
  let totalDescLength = 0;

  for (const item of items) {
    const type = item.type ?? 'component';
    byType[type] = (byType[type] ?? 0) + 1;
    totalSize += JSON.stringify(item).length;
    totalDescLength += item.description?.length ?? 0;
  }

  return {
    totalCount: items.length,
    byType,
    totalSize,
    avgDescriptionLength: Math.round(totalDescLength / items.length)
  };
}
