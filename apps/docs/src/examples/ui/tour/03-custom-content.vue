<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';
import type { TourSlotProps } from '@vean/ui';

const open = shallowRef(false);
const { t } = useI18n();

function startTour() {
  open.value = true;
}

function finishStep(slotProps: TourSlotProps) {
  slotProps.next();
}
</script>

<template>
  <div class="flex items-center gap-4">
    <SButton @click="startTour">{{ t('playground.tour.customContent.start') }}</SButton>
    <div id="tour-custom-content" class="rounded-md border p-4">{{ t('playground.tour.customContent.target') }}</div>
    <STour v-model="open">
      <STourStep target="#tour-custom-content" :title="t('playground.tour.customContent.title')">
        <p class="text-muted-foreground">{{ t('playground.tour.customContent.description') }}</p>
      </STourStep>
      <template #next="slotProps">
        <SButton size="sm" @click="finishStep(slotProps)">{{ t('playground.tour.customContent.gotIt') }}</SButton>
      </template>
    </STour>
  </div>
</template>
