<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setLocale, switchLocalePath } from 'ubean/client';
import { snakeCase } from '@vean/aria/shared';
import type { MenuOptionData } from '@vean/ui';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const iconMap: Record<string, string> = {
  en: 'lucide:spell-check-2',
  zh: 'lucide:languages'
};
const locales = ['zh', 'en'];

const items = computed<MenuOptionData<string>[]>(() => {
  return locales.map(item => {
    return {
      label: t(`locale.${snakeCase(item)}`),
      value: item,
      icon: iconMap[item] || undefined
    };
  });
});

/**
 * Switch locale while keeping the rest of the location intact.
 *
 * `setLocale` navigates by `route.path` alone, and vue-router never learns about the `?tab=` the
 * playground page writes straight to the address bar (`window.history.replaceState`), so the
 * framework's own `router.replace(target)` drops both the query string and the hash. Navigate
 * first with the full location: `setLocale` then sees the localized path already in place and
 * skips its navigation instead of overwriting ours.
 */
const onSelectLocale = async (item: MenuOptionData<string>) => {
  const code = item.value;

  // Same order `setLocale` uses internally (composer locale before the navigation), so the
  // remounted page does not render a frame with the previous language.
  locale.value = code;

  const target = switchLocalePath(code, route.path);

  if (target !== route.path) {
    const { search, hash } = window.location;
    await router.replace(`${target}${search}${hash}`);
  }

  await setLocale(code);
};
</script>

<template>
  <SDropdownMenuRadio
    :modal="false"
    :model-value="locale"
    :items="items"
    indicator-position="end"
    @select="onSelectLocale"
  >
    <template #trigger>
      <SButtonIcon icon="lucide:languages" size="lg" />
    </template>
    <template #item-indicator-icon>
      <SIcon icon="lucide:check" />
    </template>
  </SDropdownMenuRadio>
</template>
