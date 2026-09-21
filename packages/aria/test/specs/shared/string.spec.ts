import { describe, expect, it } from 'vitest';
import {
  camelCase,
  capitalize,
  interpolate,
  isKey,
  kebabCase,
  pascalCase,
  snakeCase,
  stringToPath
} from '../../../src/shared';

describe('case conversion', () => {
  it('capitalize uppercases the first character', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('')).toBe('');
  });

  it('kebabCase converts camel, snake, and space cases', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world');
    expect(kebabCase('hello_world')).toBe('hello-world');
    expect(kebabCase('Hello World')).toBe('hello-world');
    expect(kebabCase('SButton')).toBe('s-button');
  });

  it('pascalCase converts kebab, snake, and space cases', () => {
    expect(pascalCase('hello-world')).toBe('HelloWorld');
    expect(pascalCase('hello_world')).toBe('HelloWorld');
    expect(pascalCase('hello world')).toBe('HelloWorld');
  });

  it('pascalCase preserves already-cased component names', () => {
    expect(pascalCase('SButton')).toBe('SButton');
    expect(pascalCase('SDialog')).toBe('SDialog');
    expect(pascalCase('AccordionRoot')).toBe('AccordionRoot');
  });

  it('camelCase converts to lower camel case', () => {
    expect(camelCase('hello-world')).toBe('helloWorld');
    expect(camelCase('hello_world')).toBe('helloWorld');
  });

  it('snakeCase converts to snake case', () => {
    expect(snakeCase('helloWorld')).toBe('hello_world');
    expect(snakeCase('hello_world')).toBe('hello_world');
  });
});

describe('stringToPath / isKey', () => {
  it('converts dotted and bracketed strings to paths', () => {
    expect(stringToPath('a.b.c')).toEqual(['a', 'b', 'c']);
    expect(stringToPath('a[0].b')).toEqual(['a', '0', 'b']);
    expect(stringToPath('a["key"].b')).toEqual(['a', 'key', 'b']);
  });

  it('detects simple keys', () => {
    expect(isKey('foo')).toBe(true);
    expect(isKey('foo_bar')).toBe(true);
    expect(isKey('foo.bar')).toBe(false);
  });
});

describe('interpolate', () => {
  it('replaces placeholders with params', () => {
    expect(interpolate('Hello {name}, you have {count} messages', { name: 'A', count: '3' })).toBe(
      'Hello A, you have 3 messages'
    );
  });

  it('leaves unknown placeholders untouched', () => {
    expect(interpolate('Hi {unknown}', {})).toBe('Hi {unknown}');
  });
});
