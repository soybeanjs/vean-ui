import type { CheckedState, DefinedValue, MaybeArray } from '../types';
import { isNullish, isObject } from './guard';
import { compact } from './object';
import { isKey, stringToPath } from './string';

export function isIndeterminate(checked?: CheckedState | null): checked is 'indeterminate' {
  return checked === 'indeterminate';
}

export function getCheckedState(checked?: CheckedState | null) {
  if (isIndeterminate(checked)) {
    return 'indeterminate';
  }
  return checked ? 'checked' : 'unchecked';
}

export function getBinaryCheckedState(checked?: CheckedState | null) {
  return checked === true ? 'checked' : 'unchecked';
}

/**
 * Check if value is enabled based on single or multiple selection mode
 *
 * @param value - The value to check
 * @param modelValue - The model value (can be a single value or array)
 * @param isSingle - Whether it's single selection mode
 * @returns Whether it's enabled
 */
export function getOpenFromSingleOrMultiple(
  value: DefinedValue,
  modelValue: MaybeArray<DefinedValue> | undefined,
  isMultiple: boolean
) {
  if (!isMultiple) {
    return value === modelValue;
  }

  return Array.isArray(modelValue) && modelValue.includes(value);
}

/**
 * Return corresponding string based on open state
 *
 * @param open - Whether it's open
 * @returns 'open' or 'closed'
 */
export function getDisclosureState(open?: boolean) {
  return open ? 'open' : 'closed';
}

/**
 * The `clamp` function restricts a number within a specified range by returning the value itself if it falls within the
 * range, or the closest boundary value if it exceeds the range.
 *
 * @param {number} value - The `value` parameter represents the number that you want to clamp within the specified range
 *   defined by `min` and `max` values.
 * @param {number} min - If the `value` parameter is less than the `min` value, the function will return the `min`
 *   value.
 * @param {number} max - If the `value` parameter is greater than the `max` value, the function will return `max`.
 * @returns The `clamp` function returns the value of `value` constrained within the range defined by `min` and `max`.
 */
export function clamp(
  value: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY
): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * The function `roundToStepPrecision` rounds a number to a specified precision step.
 *
 * @param {number} value - The `value` parameter is the number that you want to round to a specific precision based on
 *   the `step` parameter.
 * @param {number} step - The `step` parameter in the `roundToStepPrecision` function represents the interval at which
 *   you want to round the `value`. For example, if `step` is 0.5, the `value` will be rounded to the nearest half.
 * @returns the `roundedValue` after rounding it to the precision specified by the `step`.
 */
export function roundToStepPrecision(value: number, step: number) {
  let roundedValue = value;
  const stepString = step.toString();
  const pointIndex = stepString.indexOf('.');
  const precision = pointIndex >= 0 ? stepString.length - pointIndex : 0;
  if (precision > 0) {
    const pow = 10 ** precision;
    roundedValue = Math.round(roundedValue * pow) / pow;
  }
  return roundedValue;
}

/**
 * The function `snapValueToStep` snaps a given value to the nearest step within a specified range.
 *
 * @param {number} value - The `value` parameter represents the number that you want to snap to the nearest step value.
 * @param {number | undefined} min - The `min` parameter represents the minimum value that the `value` should be snapped
 *   to. If `value` is less than `min`, it will be snapped to `min`. If `min` is not provided (undefined), then the
 *   snapping will not consider a minimum value.
 * @param {number | undefined} max - The `max` parameter represents the maximum value that the `value` should be snapped
 *   to. It ensures that the snapped value does not exceed this maximum value.
 * @param {number} step - The `step` parameter in the `snapValueToStep` function represents the interval at which the
 *   `value` should be snapped to. It determines the granularity of the snapping operation. For example, if `step` is 5,
 *   the `value` will be snapped to the nearest multiple of
 * @returns a number that has been snapped to the nearest step value within the specified range of minimum and maximum
 *   values.
 */
export function snapValueToStep(value: number, min: number | undefined, max: number | undefined, step: number): number {
  const minValue = Number(min);
  const maxValue = Number(max);
  const remainder = (value - (Number.isNaN(minValue) ? 0 : minValue)) % step;
  let snappedValue = roundToStepPrecision(
    Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder,
    step
  );

  if (!Number.isNaN(minValue)) {
    if (snappedValue < minValue) snappedValue = minValue;
    else if (!Number.isNaN(maxValue) && snappedValue > maxValue)
      snappedValue = minValue + Math.floor(roundToStepPrecision((maxValue - minValue) / step, step)) * step;
  } else if (!Number.isNaN(maxValue) && snappedValue > maxValue) {
    snappedValue = Math.floor(roundToStepPrecision(maxValue / step, step)) * step;
  }

  // correct floating point behavior by rounding to step precision
  snappedValue = roundToStepPrecision(snappedValue, step);

  return snappedValue;
}

export function setValue(obj: Record<string, any>, path: string, value?: any) {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;

    if (key) {
      if (index !== lastIndex) {
        const objValue = obj[key];
        if (isObject(objValue) || Array.isArray(objValue)) {
          newValue = objValue;
        } else if (!Number.isNaN(Number(tempPath[index + 1]))) {
          newValue = [];
        } else {
          newValue = {};
        }
      }
      obj[key] = newValue;
      // eslint-disable-next-line no-param-reassign
      obj = obj[key];
    }
  }
  return obj;
}

export function getValue<T>(obj: T, path: string, defaultValue?: unknown): any {
  if (!path || !isObject(obj)) {
    return defaultValue;
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce<unknown>(
    (res, key) => (isNullish(res) ? res : (res as Record<string, unknown>)[key]),
    obj
  );

  if (result === undefined || result === obj) {
    const objValue = obj[path as keyof T];

    return objValue === undefined ? defaultValue : objValue;
  }

  return result;
}
