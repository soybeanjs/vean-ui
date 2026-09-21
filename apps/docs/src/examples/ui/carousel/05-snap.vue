<script setup lang="ts">
import { SCard, SCarousel } from '@vean/ui';

const slides = [1, 2, 3, 4, 5];
</script>

<template>
  <div class="flex justify-center w-full">
    <SCarousel :slides="slides" aria-label="Snap carousel" :options="{ loop: true }" class="mx-auto w-full max-w-60">
      <template #item="{ slide }">
        <SCard :ui="{ content: 'aspect-square flex items-center justify-center' }">
          <span class="text-4xl font-semibold">{{ slide }}</span>
        </SCard>
      </template>
      <template #control="{ scrollSnaps, selectedIndex }">
        <div>{{ `${selectedIndex + 1} / ${scrollSnaps.length}` }}</div>
      </template>
    </SCarousel>
  </div>
</template>
