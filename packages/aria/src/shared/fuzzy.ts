export interface FuzzyOptions<T> {
  /** 参与匹配的字段；缺省时把 item 本身当字符串处理。 */
  keys?: readonly (keyof T | ((item: T) => string | undefined))[];
  /** 各字段权重，与 keys 一一对应；缺省全部为 1。 */
  weights?: readonly number[];
  /** 结果数量上限。 */
  limit?: number;
}

export interface FuzzyResult<T> {
  item: T;
  refIndex: number;
  score: number;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * 单字段打分：精确 > 前缀 > 连续子串 > 子序列。
 * 返回 0–1，0 表示不匹配。
 */
function scoreText(text: string, query: string): number {
  if (!query) {
    return 0;
  }

  if (text === query) {
    return 1;
  }

  if (text.startsWith(query)) {
    return 0.9;
  }

  if (text.includes(query)) {
    return 0.75;
  }

  // 子序列匹配：query 的字符按顺序出现在 text 中
  let cursor = 0;

  for (const char of text) {
    if (char === query[cursor]) {
      cursor += 1;

      if (cursor === query.length) {
        break;
      }
    }
  }

  if (cursor < query.length) {
    return 0;
  }

  // 命中越紧凑（text 与 query 长度差越小）得分越高
  const compactness = query.length / text.length;
  return 0.3 + 0.3 * compactness;
}

function resolveFieldText<T>(item: T, key: keyof T | ((value: T) => string | undefined)): string {
  const raw = typeof key === 'function' ? key(item) : item[key];
  return raw === undefined || raw === null ? '' : normalize(String(raw));
}

/**
 * 轻量模糊搜索（fuse.js 替代）：规范化 + 精确/前缀/子串/子序列打分 + 字段加权。
 * 面向 < 1k 条目的 Command / Autocomplete 场景。
 */
export function fuzzySearch<T>(query: string, data: readonly T[], options: FuzzyOptions<T> = {}): FuzzyResult<T>[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  const { keys = [], weights = [], limit } = options;

  const results: FuzzyResult<T>[] = [];

  data.forEach((item, refIndex) => {
    if (keys.length === 0) {
      const score = scoreText(normalize(String(item)), normalizedQuery);

      if (score > 0) {
        results.push({ item, refIndex, score });
      }

      return;
    }

    let totalWeight = 0;
    let weightedScore = 0;

    keys.forEach((key, keyIndex) => {
      const weight = weights[keyIndex] ?? 1;
      const score = scoreText(resolveFieldText(item, key), normalizedQuery);

      totalWeight += weight;
      weightedScore += score * weight;
    });

    const score = totalWeight > 0 ? weightedScore / totalWeight : 0;

    if (score > 0) {
      results.push({ item, refIndex, score });
    }
  });

  results.sort((a, b) => b.score - a.score || a.refIndex - b.refIndex);

  return limit === undefined ? results : results.slice(0, limit);
}
