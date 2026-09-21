import type { FormNameValueProps } from '../types';
import { isArrayValue, isNonNullObject, isPrimitive } from './guard';

/**
 * Generate form field names, supporting nested structures
 *
 * @example
 *   createFieldName('user', 0, 'name'); // 'user[0][name]'
 *   createFieldName('form', 'profile', 'email'); // 'form[profile][email]'
 *
 * @param baseName - Base field name
 * @param paths - Nested paths (can be string or number)
 * @returns Formatted field name, e.g., "user[0][name]"
 */
export function createFieldName(baseName: string, ...paths: (string | number)[]): string {
  return paths.reduce<string>((name, path) => `${name}[${String(path)}]`, baseName);
}

/**
 * Parse primitive values into form fields
 *
 * @param name - Field name
 * @param value - Primitive value
 * @returns Array of form fields
 */
export function parsePrimitiveValue(
  name: string,
  value: string | number | boolean | null | undefined
): FormNameValueProps[] {
  return [{ name, value }];
}

/**
 * Parse array values into form fields
 *
 * @example
 *   parseArrayValue('items', ['a', 'b']);
 *   // [{ name: 'items[0]', value: 'a' }, { name: 'items[1]', value: 'b' }]
 *
 *   parseArrayValue('users', [{ name: 'John', age: 30 }]);
 *   // [{ name: 'users[0][name]', value: 'John' }, { name: 'users[0][age]', value: 30 }]
 *
 * @param baseName - Base field name
 * @param array - Array value
 * @returns Array of form fields
 */
export function parseArrayValue(baseName: string, array: unknown[]): FormNameValueProps[] {
  return array.flatMap((item, index) => {
    if (isNonNullObject(item)) {
      // Handle object arrays
      return Object.entries(item).map(([key, value]) => ({
        name: createFieldName(baseName, index, key),
        value
      }));
    }
    // Handle primitive value arrays
    return {
      name: createFieldName(baseName, index),
      value: item
    };
  });
}

/**
 * Parse object values into form fields
 *
 * @example
 *   parseObjectValue('user', { name: 'John', age: 30 });
 *   // [{ name: 'user[name]', value: 'John' }, { name: 'user[age]', value: 30 }]
 *
 * @param baseName - Base field name
 * @param obj - Object value
 * @returns Array of form fields
 */
export function parseObjectValue(baseName: string, obj: Record<string, unknown>): FormNameValueProps[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: createFieldName(baseName, key),
    value
  }));
}

/**
 * Parse any value into form field array
 *
 * @example
 *   parseFormValue('test', 'hello'); // [{ name: 'test', value: 'hello' }]
 *   parseFormValue('items', [1, 2, 3]); // [{ name: 'items[0]', value: 1 }, ...]
 *   parseFormValue('user', { name: 'John' }); // [{ name: 'user[name]', value: 'John' }]
 *
 * @param name - Field name
 * @param value - Value to parse
 * @returns Array of form fields
 */
export function parseFormValue(name: string, value: unknown): FormNameValueProps[] {
  if (!name) {
    return [];
  }

  // Handle primitive values
  if (isPrimitive(value)) {
    return parsePrimitiveValue(name, value);
  }

  // Handle array values
  if (isArrayValue(value)) {
    return parseArrayValue(name, value);
  }

  // Handle object values
  if (isNonNullObject(value)) {
    return parseObjectValue(name, value);
  }

  // Handle null, undefined
  if (value === null || value === undefined) {
    return [];
  }

  // Fallback handling: convert unknown types to string
  return [{ name, value: String(value) }];
}
