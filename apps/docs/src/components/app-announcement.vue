<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * Brand transition notice for the frozen legacy site.
 *
 * This component is intentionally static: no dismissal state and no
 * `localStorage`, so the SSR output and the first client frame are identical
 * and hydration stays clean. The bar is time-boxed by the dates it prints.
 */
const REBRAND_GUIDE_URL = 'https://veanui.com/overview/migration/rebrand/';
</script>

<template>
  <div
    class="docs-notice-shell fixed top-0 start-0 end-0 z-50 h-[--docs-notice-h] overflow-hidden bg-primary text-primary-foreground"
    role="region"
    :aria-label="t('legacy_notice.region')"
  >
    <div
      class="mx-auto flex h-full max-w-360 min-w-0 items-center justify-center gap-x-2 overflow-hidden px-4 text-2xs leading-tight lt-sm:gap-x-1.5 sm:px-6 sm:text-xs"
    >
      <strong class="shrink-0 font-semibold whitespace-nowrap">{{ t('legacy_notice.brand') }}</strong>
      <span class="shrink-0 opacity-60" aria-hidden="true">·</span>
      <SLink
        :href="REBRAND_GUIDE_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 font-semibold underline underline-offset-2 hover:no-underline"
      >
        {{ t('legacy_notice.cta') }}
      </SLink>
      <span class="truncate opacity-75 lt-sm:hidden">
        <span class="lt-md:hidden">{{ t('legacy_notice.detail') }}</span>
        <span class="lt-lg:hidden">{{ t('legacy_notice.timeline') }}</span>
      </span>
    </div>
  </div>
</template>
