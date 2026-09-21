<script setup lang="ts">
import { SCard, SIcon } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SCard class="w-100 max-w-full" title="Title">
      <template #title-leading>
        <SIcon icon="lucide:rocket" />
      </template>
      <template #title-trailing>
        <span>Trailing</span>
      </template>
      <div class="text-gray-500 dark:text-neutral-400">Card content</div>
    </SCard>
  </div>
</template>
