<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { SButton, STour, STourStep } from '@vean/ui';

const open = ref(false);
const lockScroll = ref(true);
const target = shallowRef<HTMLElement>();
const { t } = useI18n();

function startTour(shouldLockScroll: boolean) {
  lockScroll.value = shouldLockScroll;
  open.value = true;
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SButton @click="startTour(true)">{{ t('playground.tour.scrollLock.lockedStart') }}</SButton>
    <SButton variant="outline" @click="startTour(false)">{{ t('playground.tour.scrollLock.unlockedStart') }}</SButton>
    <div ref="target" class="rounded-md border p-4">{{ t('playground.tour.scrollLock.target') }}</div>
    <STour v-model="open" :lock-scroll="lockScroll">
      <STourStep
        :target="target"
        :title="t('playground.tour.scrollLock.title')"
        :description="
          lockScroll
            ? t('playground.tour.scrollLock.lockedDescription')
            : t('playground.tour.scrollLock.unlockedDescription')
        "
      />
    </STour>
  </div>
</template>
