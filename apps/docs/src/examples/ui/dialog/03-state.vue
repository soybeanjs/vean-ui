<script setup lang="ts">
import { ref } from 'vue';
import { SButton, SDialog } from '@vean/ui';

const open = ref(false);
</script>

<template>
  <div class="flex justify-center w-full">
    <SDialog v-model:open="open" class="max-w-2xl" title="Dialog Title">
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>
      <div>Dialog Content</div>
    </SDialog>
  </div>
</template>
