<script setup lang="ts">
import { SCard, SCarousel } from '@vean/ui';

const slides = [1, 2, 3, 4, 5];
</script>

<template>
  <div class="flex justify-center w-full">
    <SCarousel
      :slides="slides"
      aria-label="Vertical carousel"
      orientation="vertical"
      :options="{ loop: true }"
      :ui="{ container: 'h-60' }"
      class="mx-auto w-full max-w-60"
    >
      <template #item="{ slide }">
        <SCard class="h-full" :ui="{ content: 'flex-center' }">
          <span class="text-4xl font-semibold">{{ slide }}</span>
        </SCard>
      </template>
    </SCarousel>
  </div>
</template>
