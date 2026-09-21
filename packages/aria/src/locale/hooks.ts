import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { defu } from '../shared';
import { useConfigProvider } from '../components/config-provider/context';
import { resolveLocale } from './locales';
import type { LocaleMessages, LocaleMessagesOverrides } from './types';

/**
 * Returns merged locale messages for the current locale.
 *
 * Resolution order (first match wins per key):
 * 1. User-supplied `messages` overrides on the nearest `ConfigProvider`
 * 2. Registered messages for `ConfigProvider.locale` (fallback to `en`)
 */
export function useLocaleMessages(): ComputedRef<LocaleMessages> {
  const context = useConfigProvider();

  return computed(() => {
    const locale = context?.locale ?? 'en';
    const baseMessages = resolveLocale(locale);
    const userMessages = context?.messages as LocaleMessagesOverrides | undefined;

    if (!userMessages) {
      return baseMessages;
    }

    return defu(userMessages, baseMessages) as LocaleMessages;
  });
}
