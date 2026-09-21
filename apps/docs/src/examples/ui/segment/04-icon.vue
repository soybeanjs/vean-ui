<script setup lang="ts">
import { shallowRef } from 'vue';
import { SIcon, SSegment } from '@vean/ui';
import type { SegmentOptionData } from '@vean/ui';

interface ThemeSchema extends SegmentOptionData<string> {
  value: string;
  label: string;
  icon: string;
}

const themeSchema = shallowRef<string>('auto');

const themeSchemas: ThemeSchema[] = [
  {
    value: 'light',
    label: 'Light',
    icon: 'lucide:sun'
  },
  {
    value: 'auto',
    label: 'Auto',
    icon: 'lucide:monitor'
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: 'lucide:moon'
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SSegment v-model="themeSchema" class="max-w-2xl" :items="themeSchemas" shape="rounded">
      <template #item="{ icon }">
        <SIcon :icon="icon" />
      </template>
    </SSegment>
  </div>
</template>
