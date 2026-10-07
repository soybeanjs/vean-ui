<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScrollState } from '~/composables/use-scroll-state';
import pkg from '../../package.json' with { type: 'json' };
import ToolBar from './tool-bar.vue';

const { t } = useI18n();

const { version } = pkg;

const { isScrolled, isAtTop } = useScrollState();
</script>

<template>
  <header
    :data-scrolled="isScrolled"
    :data-at-top="isAtTop"
    class="docs-header-shell group fixed top-0 start-0 end-0 z-49 px-4 transition-all-800 data-[scrolled=true]:top-3 after:content-empty after:pointer-events-none after:absolute after:bottom-0 after:start-0 after:end-0 after:h-px after:bg-border after:opacity-0 after:transition-opacity after:duration-300 data-[at-top=true]:after:opacity-100 sm:px-6"
  >
    <div
      class="docs-header-frame mx-auto flex max-w-360 min-h-[--app-header-main] items-center justify-between gap-3 px-6 py-3 group-data-[scrolled=true]:min-h-0 lt-md:group-data-[scrolled=true]:py-2 transition-all-300 xl:gap-4"
    >
      <div class="flex min-w-0 items-center gap-4 lg:gap-6 xl:gap-8">
        <SLink to="/" class="group flex items-center gap-3">
          <AppLogo class="size-8 transition-transform duration-300 group-hover:scale-110" />
          <h1
            class="text-lg font-bold bg-clip-text text-transparent whitespace-nowrap bg-gradient-to-r from-primary-600 to-primary dark:from-primary dark:to-primary-300"
          >
            {{ t('components.home.title') }}
          </h1>
        </SLink>
        <SearchDocument />
      </div>

      <div class="flex items-center gap-3 xl:gap-4">
        <HeaderNav class="lt-xl:!hidden" />
        <STag size="lg" variant="soft" color="carbon" shape="rounded" class="lt-xl:!hidden">v{{ version }}</STag>
        <SSeparator orientation="vertical" class="h-8 lt-xl:!hidden" />
        <ToolBar class="lt-xl:!hidden" />

        <SPopover :modal="false" placement="bottom-end">
          <template #trigger>
            <SButtonIcon icon="lucide:menu" class="xl:!hidden text-xl" />
          </template>
          <div class="flex flex-col gap-4">
            <HeaderNav orientation="vertical" />
            <SSeparator />
            <ToolBar />
          </div>
        </SPopover>
      </div>
    </div>
  </header>
</template>
