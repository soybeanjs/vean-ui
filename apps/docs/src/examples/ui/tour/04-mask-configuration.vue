<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const showMask = shallowRef(true);
const { t } = useI18n();
const ui = { mask: 'fill-primary/35' };

function toggleMask() {
  showMask.value = !showMask.value;
}

function startTour() {
  open.value = true;
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SButton variant="outline" :aria-pressed="showMask" @click="toggleMask">
      {{ t(showMask ? 'playground.tour.mask.on' : 'playground.tour.mask.off') }}
    </SButton>
    <SButton @click="startTour">{{ t('playground.tour.mask.start') }}</SButton>
    <div id="tour-mask-profile" class="rounded-md border p-4">{{ t('playground.tour.mask.target') }}</div>
    <STour v-model="open" :show-mask="showMask" :ui="ui">
      <STourStep
        target="#tour-mask-profile"
        :title="t('playground.tour.mask.title')"
        :description="t('playground.tour.mask.description')"
      />
    </STour>
  </div>
</template>
