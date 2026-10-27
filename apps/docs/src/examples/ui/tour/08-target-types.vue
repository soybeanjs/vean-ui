<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const profileTarget = shallowRef<HTMLElement>();
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SButton @click="open = true">{{ t('playground.tour.targetTypes.start') }}</SButton>
    <div id="tour-target-selector" class="rounded-md border p-4">{{ t('playground.tour.targetTypes.selector') }}</div>
    <div ref="profileTarget" class="rounded-md border p-4">{{ t('playground.tour.targetTypes.templateRef') }}</div>
    <STour v-model="open">
      <STourStep
        target="#tour-target-selector"
        :title="t('playground.tour.targetTypes.selector')"
        :description="t('playground.tour.targetTypes.selectorDescription')"
      />
      <STourStep
        :target="profileTarget"
        :title="t('playground.tour.targetTypes.templateRefTitle')"
        :description="t('playground.tour.targetTypes.templateRefDescription')"
      />
    </STour>
  </div>
</template>
