import { describe, expect, it } from 'vitest';
import {
  isArrayValue,
  isBlankString,
  isClient,
  isDateObject,
  isFunction,
  isIOS,
  isNullish,
  isObject,
  isPrimitive,
  isString,
  keysOf,
  refreshIOSDetection,
  supportsInert
} from '../../../src/shared';

describe('type guards', () => {
  it('isNullish detects null and undefined only', () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish(0)).toBe(false);
    expect(isNullish('')).toBe(false);
  });

  it('isString / isBlankString', () => {
    expect(isString('a')).toBe(true);
    expect(isString(1)).toBe(false);
    expect(isBlankString('')).toBe(true);
    expect(isBlankString('a')).toBe(false);
  });

  it('isPrimitive covers string, number, boolean and nullish', () => {
    expect(isPrimitive('a')).toBe(true);
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive({})).toBe(false);
  });

  it('isObject excludes null, arrays and dates', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(new Date())).toBe(false);
  });

  it('isArrayValue / isDateObject / isFunction', () => {
    expect(isArrayValue([])).toBe(true);
    expect(isArrayValue({})).toBe(false);
    expect(isDateObject(new Date())).toBe(true);
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction('x')).toBe(false);
  });

  it('keysOf returns the own keys of an object', () => {
    expect(keysOf({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });
});

describe('environment', () => {
  it('isClient is true in the happy-dom test environment', () => {
    expect(isClient).toBe(true);
  });

  it('supportsInert reflects the runtime capability', () => {
    expect(supportsInert()).toBe(typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype);
  });

  it('isIOS caches its result and can be refreshed', () => {
    const first = refreshIOSDetection();
    expect(isIOS()).toBe(first);
    expect(refreshIOSDetection()).toBe(first);
  });
});
