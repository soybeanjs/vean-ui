<script setup lang="ts">
import { ref } from 'vue';
import { SColorArea, SColorSwatch } from '@vean/ui';

const color = ref('oklch(62% 0.22 312)');
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-3">
      <SColorArea
        v-model="color"
        color-space="oklch"
        format="oklch"
        x-channel="chroma"
        y-channel="lightness"
        class="w-50 h-40"
      />
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <SColorSwatch :color="color" />
        <span>{{ color }}</span>
      </div>
    </div>
  </div>
</template>
