<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <SButton @click="open = true">{{ t('playground.tour.primary.start') }}</SButton>
    <div id="tour-primary-overview" class="rounded-md border p-3">{{ t('playground.tour.primary.workspace') }}</div>
    <div id="tour-primary-projects" class="rounded-md border p-3">{{ t('playground.tour.primary.projects') }}</div>
    <STour v-model="open" :show-mask="false" type="primary">
      <STourStep
        target="#tour-primary-overview"
        :title="t('playground.tour.primary.workspace')"
        :description="t('playground.tour.primary.workspaceDescription')"
      />
      <STourStep
        target="#tour-primary-projects"
        :title="t('playground.tour.primary.projects')"
        :description="t('playground.tour.primary.projectsDescription')"
      />
    </STour>
  </div>
</template>
