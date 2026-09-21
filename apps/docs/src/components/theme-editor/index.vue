<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ClientOnly } from 'ubean/client';
import { SSegment, SThemeCustomizer, SThemeModeSwitch } from '@vean/ui';
import type { SegmentOptionData } from '@vean/ui';
import SectionCard from './section-card.vue';
import { THEME_EDITOR_SECTIONS } from './sections';
import type { ThemeEditorGroup } from './types';

defineOptions({
  name: 'ThemeEditor'
});

const { t } = useI18n();

const group = ref<ThemeEditorGroup>('all');

const groups = computed<SegmentOptionData<ThemeEditorGroup>[]>(() => [
  { label: t('themeEditor.group.all'), value: 'all' },
  { label: t('themeEditor.group.color'), value: 'color' },
  { label: t('themeEditor.group.size'), value: 'size' },
  { label: t('themeEditor.group.font'), value: 'font' },
  { label: t('themeEditor.group.structure'), value: 'structure' },
  { label: t('themeEditor.group.region'), value: 'region' }
]);

const sections = computed(() =>
  THEME_EDITOR_SECTIONS.filter(section => group.value === 'all' || section.group === group.value)
);

const sectionTitle = (key: string): string => t(`themeEditor.sections.${key}.title`);

const sectionDescription = (key: string): string => t(`themeEditor.sections.${key}.description`);
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-xl font-semibold text-foreground">{{ t('themeEditor.title') }}</h1>
        <p class="mt-1 max-w-3xl text-sm text-muted-foreground">
          {{ t('themeEditor.description') }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs text-muted-foreground">{{ t('themeEditor.mode') }}</span>
        <SThemeModeSwitch />
      </div>
    </header>

    <div class="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <aside class="min-w-0">
        <div class="rounded-xl border border-border bg-card p-3 xl:sticky xl:top-[calc(var(--app-header)+1rem)]">
          <!--
 Client-only: the panel renders the persisted theme state (mode, palette),
               which the prerendered HTML has no way to know — SSR would hydrate-mismatch
               for every visitor whose saved theme is not the default.
-->
          <ClientOnly>
            <SThemeCustomizer :ui="{ root: 'w-full h-200' }" />
          </ClientOnly>
        </div>
      </aside>

      <div class="min-w-0 space-y-5">
        <SSegment v-model="group" :items="groups" shape="rounded" class="max-w-full self-start" />

        <SectionCard
          v-for="section in sections"
          :key="section.key"
          :title="sectionTitle(section.key)"
          :description="sectionDescription(section.key)"
          :tokens="section.tokens"
        >
          <component :is="section.component" />
        </SectionCard>
      </div>
    </div>
  </div>
</template>
