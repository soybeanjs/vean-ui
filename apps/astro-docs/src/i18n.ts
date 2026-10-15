import en from './locales/en.json';
import zh from './locales/zh.json';
import type { Locale } from './plugin/routes';

const messages: Record<Locale, Record<string, unknown>> = { en, zh };

export const locales: { code: Locale; language: string; name: string }[] = [
  { code: 'en', language: 'en', name: 'English' },
  { code: 'zh', language: 'zh-CN', name: '中文' }
];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'zh';
}

/**
 * Message lookup by dotted key against the same `src/locales/*.json` files the
 * ubean site loads (`apps/docs/src/locales`), so both sites render identical copy.
 */
export function createTranslator(locale: Locale) {
  const table = messages[locale] ?? messages[defaultLocale];

  return function t(key: string, fallback?: string): string {
    const resolved = key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part];
      }

      return undefined;
    }, table);

    if (typeof resolved === 'string') {
      return resolved;
    }

    return fallback ?? key;
  };
}

/** Locale for a URL path (`prefix_except_default`: `/zh/...` is Chinese). */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en';
}
