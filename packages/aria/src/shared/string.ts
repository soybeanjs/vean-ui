import { compact } from './object';

export function capitalize(str: string): string {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** 'helloWorld' | 'hello_world' | 'Hello World' | 'SButton' → 'hello-world' | 's-button' */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * 'hello-world' | 'hello_world' | 'hello world' | 'SButton' | 'HTTPRequest' → 'HelloWorld' | 'SButton' | 'HTTPRequest'
 *
 * Splits on both separators and camel-case boundaries so already-cased names
 * (e.g. 'SButton', 'AccordionRoot') keep their inner capitals.
 */
export function pascalCase(str: string): string {
  const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]|\d+/g) ?? [];

  return words.map(word => capitalize(word)).join('');
}

/** 'hello-world' | 'hello_world' | 'Hello World' → 'helloWorld' */
export function camelCase(str: string): string {
  const pascal = pascalCase(str);

  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function snakeCase(str: string): string {
  return kebabCase(str).replace(/-/g, '_');
}

/**
 * Convert string to path
 *
 * @param str - The string to convert
 * @returns Path
 */
export function stringToPath(str: string) {
  return compact(str.replace(/["|']|\]/g, '').split(/\.|\[/));
}

/**
 * Check if string is a key
 *
 * @param str - The string to check
 * @returns Whether the string is a key
 */
export function isKey(str: string) {
  return /^\w*$/.test(str);
}

/**
 * Replace `{key}` placeholders in a template string with values from `params`.
 * Unknown keys are left as-is.
 */
export function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => params[key] ?? match);
}
