/**
 * Type guard: check if value is a string
 *
 * @param value
 * @returns
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard: check if value is a primitive type
 *
 * @param value - The value to check
 * @returns Whether the value is string | number | boolean
 */
export function isPrimitive(value: unknown): value is string | number | boolean | null | undefined {
  const type = typeof value;

  return type === 'string' || type === 'number' || type === 'boolean' || isNullish(value);
}

/**
 * Type guard: check if value is a non-null object (excluding arrays)
 *
 * @param value - The value to check
 * @returns Whether the value is a non-null object
 */
export function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Type guard: check if value is an array
 *
 * @param value - The value to check
 * @returns Whether the value is an array
 */
export function isArrayValue(value: unknown): value is unknown[] {
  return typeof value === 'object' && Array.isArray(value);
}

/**
 * Type guard: check if value is null or undefined
 *
 * @param value - The value to check
 * @returns Whether the value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Type guard: check if value is an empty string
 *
 * @param value - The value to check
 * @returns Whether the value is an empty string
 */
export function isBlankString(value: unknown | undefined): value is string {
  return typeof value === 'string' && value === '';
}

export function isDateObject(value: unknown): value is Date {
  return value instanceof Date;
}

export function isObjectType(value: unknown) {
  return typeof value === 'object';
}

export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return !isNullish(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
}

export function isPromise(value: any): value is PromiseLike<any> {
  return isObject(value) && isFunction(value?.then);
}

export function keysOf<TRecord extends object>(record: TRecord) {
  return Object.keys(record) as (keyof TRecord)[];
}
