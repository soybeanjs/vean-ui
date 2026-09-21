import { isNullish } from './guard';

export function filterNullish<T>(list: readonly (T | null | undefined)[]): T[] {
  return list.filter(value => !isNullish(value)) as T[];
}

export function arrayMove<T extends any[]>(array: T, from: number, to: number) {
  if (from === to) {
    return array;
  }
  const newArray = array.slice();

  newArray.splice(to, 0, newArray.splice(from, 1)[0]);

  return newArray as T;
}
