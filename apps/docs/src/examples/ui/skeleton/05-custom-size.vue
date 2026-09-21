<script setup lang="ts">
import { SSkeleton } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-md flex items-start gap-4 rounded-lg border border-border p-4">
      <SSkeleton class="size-12 rounded-full" />
      <div class="flex-1 space-y-3">
        <SSkeleton class="h-4 w-1/3" />
        <SSkeleton class="h-4 w-full" />
        <SSkeleton class="h-4 w-5/6" />
      </div>
    </div>
  </div>
</template>
