<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = shallowRef(false);
const profileButton = shallowRef<{ $el: HTMLButtonElement }>();
const settingsButton = shallowRef<{ $el: HTMLButtonElement }>();
const { t } = useI18n();

function startTour() {
  open.value = true;
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SButton @click="startTour">{{ t('playground.tour.common.start') }}</SButton>
    <SButton ref="profileButton" variant="outline">{{ t('playground.tour.basic.profile') }}</SButton>
    <SButton ref="settingsButton" variant="outline">{{ t('playground.tour.basic.settings') }}</SButton>
    <STour v-model="open">
      <STourStep
        :target="profileButton?.$el"
        :title="t('playground.tour.basic.profileTitle')"
        :description="t('playground.tour.basic.profileDescription')"
      />
      <STourStep
        :target="settingsButton?.$el"
        :title="t('playground.tour.basic.settingsTitle')"
        :description="t('playground.tour.basic.settingsDescription')"
      />
    </STour>
  </div>
</template>
