<script setup lang="ts">
import { SButton, toast } from '@vean/ui';

function openStackedToasts() {
  ['Queued job', 'Processing assets', 'Publishing build', 'Clearing cache'].forEach((title, index) => {
    window.setTimeout(() => {
      toast(title, {
        description: `Stack item ${index + 1} of 4. Hover the toaster to expand all items.`,
        duration: 5000
      });
    }, index * 120);
  });
}
function openBurstSuccess() {
  ['Schema updated', 'Tokens regenerated', 'Preview deployed', 'Observers notified'].forEach((title, index) => {
    window.setTimeout(() => {
      toast.success(title, {
        description: 'This batch is intended to verify the collapsed stack layout.',
        duration: 4200
      });
    }, index * 100);
  });
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-2">
      <SButton variant="pure" @click="openStackedToasts">Push 4 Toasts</SButton>
      <SButton color="success" variant="outline" @click="openBurstSuccess">Push 4 Success Toasts</SButton>
    </div>
  </div>
</template>
