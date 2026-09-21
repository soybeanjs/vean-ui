import { describe, expect, it } from 'vitest';
import {
  createFieldName,
  parseArrayValue,
  parseFormValue,
  parseObjectValue,
  parsePrimitiveValue
} from '../../../src/shared';

describe('createFieldName', () => {
  it('builds bracketed nested names', () => {
    expect(createFieldName('user', 0, 'name')).toBe('user[0][name]');
    expect(createFieldName('form', 'profile', 'email')).toBe('form[profile][email]');
  });
});

describe('parseFormValue', () => {
  it('parses primitive values into a single field', () => {
    expect(parseFormValue('test', 'hello')).toEqual([{ name: 'test', value: 'hello' }]);
    expect(parseFormValue('count', 3)).toEqual([{ name: 'count', value: 3 }]);
  });

  it('parses arrays with primitive items', () => {
    expect(parseFormValue('items', ['a', 'b'])).toEqual([
      { name: 'items[0]', value: 'a' },
      { name: 'items[1]', value: 'b' }
    ]);
  });

  it('parses arrays with object items', () => {
    expect(parseFormValue('users', [{ name: 'John' }])).toEqual([{ name: 'users[0][name]', value: 'John' }]);
  });

  it('parses objects into one field per key', () => {
    expect(parseFormValue('user', { name: 'John', age: 30 })).toEqual([
      { name: 'user[name]', value: 'John' },
      { name: 'user[age]', value: 30 }
    ]);
  });

  it('treats nullish values as primitive fields', () => {
    expect(parseFormValue('', 'x')).toEqual([]);
    expect(parseFormValue('field', null)).toEqual([{ name: 'field', value: null }]);
    expect(parseFormValue('field', undefined)).toEqual([{ name: 'field', value: undefined }]);
  });

  it('falls back to string conversion for unknown types', () => {
    const fn = () => 'x';
    expect(parseFormValue('field', fn)).toEqual([{ name: 'field', value: String(fn) }]);
  });
});

describe('parse helpers', () => {
  it('parsePrimitiveValue / parseObjectValue match parseFormValue output', () => {
    expect(parsePrimitiveValue('a', 1)).toEqual([{ name: 'a', value: 1 }]);
    expect(parseObjectValue('user', { age: 1 })).toEqual([{ name: 'user[age]', value: 1 }]);
  });

  it('parseArrayValue handles mixed item shapes', () => {
    expect(parseArrayValue('mix', [1, { a: 2 }])).toEqual([
      { name: 'mix[0]', value: 1 },
      { name: 'mix[1][a]', value: 2 }
    ]);
  });
});
