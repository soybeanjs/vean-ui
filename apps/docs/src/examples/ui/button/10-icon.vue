<script setup lang="ts">
import { SButtonIcon } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-3">
      <SButtonIcon size="lg" icon="lucide:skip-back" />
      <SButtonIcon size="lg" icon="lucide:skip-forward" />
      <SButtonIcon size="lg" icon="lucide:pause" />
      <SButtonIcon size="lg" variant="soft" icon="lucide:rocket" />
      <SButtonIcon size="lg" variant="soft" icon="lucide:star" />
      <SButtonIcon size="lg" variant="soft" icon="lucide:heart" />
    </div>
  </div>
</template>
