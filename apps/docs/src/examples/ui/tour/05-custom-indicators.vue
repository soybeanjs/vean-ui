<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <SButton @click="open = true">{{ t('playground.tour.indicators.start') }}</SButton>
    <div id="tour-indicator-profile" class="rounded-md border p-3">{{ t('playground.tour.indicators.profile') }}</div>
    <div id="tour-indicator-settings" class="rounded-md border p-3">{{ t('playground.tour.indicators.settings') }}</div>
    <div id="tour-indicator-projects" class="rounded-md border p-3">{{ t('playground.tour.indicators.projects') }}</div>
    <STour v-model="open">
      <STourStep
        target="#tour-indicator-profile"
        :title="t('playground.tour.indicators.profile')"
        :description="t('playground.tour.indicators.profileDescription')"
      />
      <STourStep
        target="#tour-indicator-settings"
        :title="t('playground.tour.indicators.settings')"
        :description="t('playground.tour.indicators.settingsDescription')"
      />
      <STourStep
        target="#tour-indicator-projects"
        :title="t('playground.tour.indicators.projects')"
        :description="t('playground.tour.indicators.projectsDescription')"
      />
      <template #indicators="{ current, total }">
        <span class="text-xs text-muted-foreground">{{ current + 1 }} / {{ total }}</span>
      </template>
    </STour>
  </div>
</template>
