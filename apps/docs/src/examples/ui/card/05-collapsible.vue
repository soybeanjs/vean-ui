<script setup lang="ts">
import { SCard, SCardCollapsibleTrigger } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SCard class="w-100 max-w-full" title="Title">
      <template #extra>
        <SCardCollapsibleTrigger aria-label="Toggle card content" />
      </template>
      <div class="text-gray-500 dark:text-neutral-400">Card content</div>
    </SCard>
  </div>
</template>
