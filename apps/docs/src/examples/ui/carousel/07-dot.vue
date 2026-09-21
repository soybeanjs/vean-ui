<script setup lang="ts">
import { SCard, SCarousel } from '@vean/ui';

const slides = [1, 2, 3, 4, 5];
</script>

<template>
  <div class="flex justify-center w-full">
    <SCarousel
      :slides="slides"
      aria-label="Dot carousel"
      :options="{ loop: true }"
      :ui="{
        item: 'basis-1/2 md:basis-1/3 p-2'
      }"
      class="mx-auto w-full max-w-lg"
    >
      <template #item="{ slide, selected }">
        <SCard
          :ui="{ content: 'aspect-square flex items-center justify-center' }"
          :class="{ 'border-primary/30 bg-primary/10': selected }"
        >
          <span class="text-4xl font-semibold">{{ slide }}</span>
        </SCard>
      </template>
      <template #control="{ scrollSnaps, selectedIndex }">
        <div class="flex gap-1">
          <div
            v-for="(_, index) in scrollSnaps"
            :key="index"
            :class="{ 'border-primary': index === selectedIndex }"
            class="size-3 rounded-full border-2 border-border"
          ></div>
        </div>
      </template>
    </SCarousel>
  </div>
</template>
