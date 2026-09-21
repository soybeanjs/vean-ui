<script setup lang="ts">
import { SCard, SCarousel, SProgress } from '@vean/ui';

const slides = [1, 2, 3, 4, 5];
</script>

<template>
  <div class="flex justify-center w-full">
    <SCarousel
      :slides="slides"
      aria-label="Progress carousel"
      :options="{ loop: true }"
      :ui="{
        item: 'basis-2/3 p-1'
      }"
      class="mx-auto w-full max-w-60"
    >
      <template #item="{ slide }">
        <SCard :ui="{ content: 'aspect-square flex items-center justify-center' }">
          <span class="text-4xl font-semibold">{{ slide }}</span>
        </SCard>
      </template>
      <template #control="{ progress }">
        <SProgress :model-value="progress" size="xs" class="w-25" />
      </template>
    </SCarousel>
  </div>
</template>
