import { isObject } from './guard';

/**
 * Structured deep comparison (covers the common `ohash isEqual` semantics: objects / arrays / Date / NaN).
 *
 * @param a - First value
 * @param b - Second value
 * @returns Whether the two values are structurally equal
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return Number.isNaN(a) && Number.isNaN(b);
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => isEqual(item, b[index]));
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    return keysA.length === keysB.length && keysA.every(key => key in b && isEqual(a[key], b[key]));
  }

  return false;
}

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;

/**
 * Recursive defaults merge: `defu({ a: 1 }, { a: 2, b: 3 })` → `{ a: 1, b: 3 }`.
 * Left side wins; plain objects merge recursively, arrays and other types are taken from the left side.
 */
export function defu<T extends object, D extends object[]>(
  source: T | undefined,
  ...defaults: D
): UnionToIntersection<T | D[number]> {
  const result: Record<string, unknown> = {};

  for (const obj of [source, ...defaults]) {
    if (!isObject(obj)) {
      continue;
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const current = result[key];

      if (current === undefined) {
        result[key] = value;
      } else if (isObject(current) && isObject(value)) {
        result[key] = defu(current, value);
      }
    }
  }

  return result as UnionToIntersection<T | D[number]>;
}

/**
 * Structured deep clone (JSON-cloneable values + Date), replacing `klona`.
 *
 * @param value - The value to clone
 * @returns A deep clone of the value
 */
export function klona<T>(value: T): T {
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (Array.isArray(value)) {
    return value.map(item => klona(item)) as T;
  }

  if (isObject(value)) {
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(value)) {
      result[key] = klona(value[key]);
    }

    return result as T;
  }

  return value;
}

/**
 * Select specified properties from an object
 *
 * @param obj - Source object
 * @param keys - Array of property keys to select
 * @returns New object containing specified properties
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    result[key] = obj[key];
  }

  return result;
}

/**
 * Exclude specified properties from an object
 *
 * @param obj - Source object
 * @param keys - Array of property keys to exclude
 * @returns New object with specified properties excluded
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) {
  const result = {} as Omit<T, K>;

  // eslint-disable-next-line guard-for-in
  for (const key in obj) {
    const k = key as unknown as K;

    if (!keys.includes(k)) {
      (result as T)[k] = obj[k];
    }
  }

  return result;
}

export function compact<T>(value: T[]) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

/**
 * Remove specified element from an array
 *
 * @param array - Source array
 * @param item - Element to remove
 * @returns New array with element removed
 */
export function arrayRemove<T>(array: T[], item: T) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);

  if (index !== -1) {
    updatedArray.splice(index, 1);
  }

  return updatedArray;
}

/**
 * Wraps an array around itself at a given start index Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a',
 * 'b']`
 */
export function wrapArray<T>(array: T[], startIndex: number): T[] {
  if (array.length === 0) return [];

  const normalizedStartIndex = ((startIndex % array.length) + array.length) % array.length;
  return array.map((_, index) => array[(normalizedStartIndex + index) % array.length]!);
}

export function appendAt<T>(data: T[], value: T) {
  return [...data, value];
}

export function prependAt<T>(data: T[], value: T) {
  return [value, ...data];
}

export function removeAt<T>(data: T[], index?: number): T[] {
  if (index === undefined) return [];

  const clone = [...data];
  clone.splice(index, 1);
  return clone;
}

export function swapAt<T>(data: T[], indexA: number, indexB: number) {
  const aValue = data[indexA];
  const bValue = data[indexB];
  data[indexA] = bValue!;
  data[indexB] = aValue!;
}

export function moveAt<T>(data: T[], from: number, to: number) {
  const [fromValue] = data.splice(from, 1);
  data.splice(to, 0, fromValue!);
}

export function insertAt<T>(data: T[], index: number, value: T): T[] {
  return [...data.slice(0, index), value, ...data.slice(index)];
}

export function updateAt<T>(data: T[], index: number, value: T): T[] {
  const clone = [...data];
  clone[index] = value;

  return clone;
}

/**
 * This is the "meat" of the typeahead matching logic. It takes in all the values, the search and the current match, and
 * returns the next match (or `undefined`).
 *
 * We normalize the search because if a user has repeatedly pressed a character, we want the exact same behavior as if
 * we only had that one character (ie. cycle through options starting with that character)
 *
 * We also reorder the values by wrapping the array around the current match. This is so we always look forward from the
 * current match, and picking the first match will always be the correct one.
 *
 * Finally, if the normalized search is exactly one character, we exclude the current match from the values because
 * otherwise it would be the first to match always and focus would never move. This is as opposed to the regular case,
 * where we don't want focus to move if the current match still matches.
 */
export function getNextMatch(values?: string[], search?: string, currentMatch?: string): string | undefined {
  // Early return for edge cases
  if (!values?.length || !search) {
    return undefined;
  }

  // Normalize repeated characters (e.g., "aaa" -> "a")
  const normalizedSearch = search.length > 1 && search[0]?.repeat(search.length) === search ? search[0] : search;

  const normalizedSearchLower = normalizedSearch.toLowerCase();
  const excludeCurrentMatch = normalizedSearch.length === 1;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;

  // Start search from the position after current match
  const startIndex = Math.max(currentMatchIndex, 0);
  const valuesLength = values.length;

  // Search through wrapped array without creating a new array
  for (let i = 0; i < valuesLength; i++) {
    const index = (startIndex + i) % valuesLength;
    const value = values[index];

    // Skip current match if we're excluding it and check if value starts with normalized search
    if ((!excludeCurrentMatch || value !== currentMatch) && value?.toLowerCase().startsWith(normalizedSearchLower)) {
      // Return undefined if it's the same as current match (no change needed)
      return value !== currentMatch ? value : undefined;
    }
  }

  return undefined;
}

/**
 * The function `findValuesBetween` takes an array and two values, then returns a subarray containing elements between
 * the first occurrence of the start value and the first occurrence of the end value in the array.
 *
 * @param {T[]} array - The `array` parameter is an array of values of type `T`.
 * @param {T} start - The `start` parameter is the value that marks the beginning of the range you want to find in the
 *   array.
 * @param {T} end - The `end` parameter in the `findValuesBetween` function represents the end value that you want to
 *   find in the array. This function will return a subarray of values that are between the `start` and `end` values in
 *   the original array.
 * @returns The `findValuesBetween` function returns an array of values from the input array that are between the
 *   `start` and `end` values (inclusive). If either the `start` or `end` values are not found in the input array, an
 *   empty array is returned.
 */
export function findValuesBetween<T>(array: T[], start: T, end: T) {
  const startIndex = array.findIndex(i => isEqual(i, start));
  const endIndex = array.findIndex(i => isEqual(i, end));
  if (startIndex === -1 || endIndex === -1) return [];

  const [minIndex, maxIndex] = ([startIndex, endIndex] as [number, number]).sort((a, b) => a - b);

  return array.slice(minIndex, maxIndex + 1);
}

export function flattenChildren<T extends { children?: any[] }>(items?: T[]) {
  if (!items) return [];

  return items.reduce(
    (acc, item) => {
      acc.push(item);

      if (item.children) {
        acc.push(...flattenChildren(item.children));
      }
      return acc;
    },
    [] as Omit<T, 'children'>[]
  );
}

export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new RangeError('chunk size must be greater than 0');
  }

  const result: T[][] = [];

  for (let index = 0; index < array.length; index += size) {
    result.push(array.slice(index, index + size));
  }

  return result;
}
