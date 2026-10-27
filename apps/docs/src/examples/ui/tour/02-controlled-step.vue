<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const currentStep = shallowRef(0);
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SButton @click="open = true">{{ t('playground.tour.controlled.startAtStep', { step: currentStep + 1 }) }}</SButton>
    <SButton variant="pure" @click="currentStep = 0">{{ t('playground.tour.controlled.resetStep') }}</SButton>
    <div id="tour-controlled-start" class="rounded-md border p-4">{{ t('playground.tour.controlled.workspace') }}</div>
    <div id="tour-controlled-projects" class="rounded-md border p-4">
      {{ t('playground.tour.controlled.projectList') }}
    </div>
    <STour v-model="open" v-model:current="currentStep">
      <STourStep
        target="#tour-controlled-start"
        :title="t('playground.tour.controlled.workspaceTitle')"
        :description="t('playground.tour.controlled.workspaceDescription')"
      />
      <STourStep
        target="#tour-controlled-projects"
        :title="t('playground.tour.controlled.projectsTitle')"
        :description="t('playground.tour.controlled.projectsDescription')"
        placement="right"
      />
    </STour>
  </div>
</template>
