import type { AcceptableValue, DefinedValue, MaybeArray } from '../types';
import { isNullish } from './guard';

/**
 * Check if value is equal or exists in array
 *
 * @param base - Base value (can be a single value, array, or undefined)
 * @param current - Current value (can be a single value, array, or undefined)
 * @returns Whether it's equal or exists
 */
export function isValueEqualOrExist(base: MaybeArray<DefinedValue> | undefined, current: AcceptableValue) {
  if (isNullish(base) || isNullish(current)) return false;
  if (Array.isArray(base)) {
    return base.includes(current);
  }
  return base === current;
}
