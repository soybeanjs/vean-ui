<script setup lang="ts">
import { SButton, SEmpty } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SEmpty
      class="min-h-72 border-primary/30 bg-primary/3 max-w-2xl"
      title="No activity"
      description="Custom styles can adapt the empty state to different scenes."
      icon="lucide:activity"
      :ui="{
        media: 'bg-primary/10 text-primary',
        title: 'text-primary'
      }"
    >
      <SButton>Start activity</SButton>
    </SEmpty>
  </div>
</template>
