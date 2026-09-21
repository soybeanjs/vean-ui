<script setup lang="ts">
import { SProgress } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SProgress class="max-w-2xl" :model-value="66" size="xl">
      <template #default="{ valuePercent }">
        <div class="flex h-full items-center justify-end px-2 text-xs font-medium text-primary-foreground">
          {{ Math.round(valuePercent ?? 0) }}%
        </div>
      </template>
    </SProgress>
  </div>
</template>
