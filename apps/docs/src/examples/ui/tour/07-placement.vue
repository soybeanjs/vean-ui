<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';
import type { Placement } from '@vean/ui';

const open = shallowRef(false);
const { t } = useI18n();
const placements: Placement[] = [
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end'
];
const placementNames = computed<Record<Placement, string>>(() => ({
  'top-start': t('playground.tour.placement.topStart'),
  top: t('playground.tour.placement.top'),
  'top-end': t('playground.tour.placement.topEnd'),
  'right-start': t('playground.tour.placement.rightStart'),
  right: t('playground.tour.placement.right'),
  'right-end': t('playground.tour.placement.rightEnd'),
  'bottom-start': t('playground.tour.placement.bottomStart'),
  bottom: t('playground.tour.placement.bottom'),
  'bottom-end': t('playground.tour.placement.bottomEnd'),
  'left-start': t('playground.tour.placement.leftStart'),
  left: t('playground.tour.placement.left'),
  'left-end': t('playground.tour.placement.leftEnd')
}));
</script>

<template>
  <div class="flex items-center justify-center gap-4">
    <SButton @click="open = true">{{ t('playground.tour.placement.start') }}</SButton>
    <div id="tour-placement-target" class="rounded-md border p-4">{{ t('playground.tour.placement.target') }}</div>
    <STour v-model="open" class="w-80">
      <STourStep
        v-for="placement in placements"
        :key="placement"
        target="#tour-placement-target"
        :title="placementNames[placement]"
        :description="t('playground.tour.placement.description', { placement: placementNames[placement] })"
        :placement="placement"
      />
    </STour>
  </div>
</template>
