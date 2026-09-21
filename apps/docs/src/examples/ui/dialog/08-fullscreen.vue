<script setup lang="ts">
import { ref } from 'vue';
import { SButton, SDialog } from '@vean/ui';

const fullscreen = ref(false);
</script>

<template>
  <div class="flex justify-center w-full">
    <SDialog
      v-model:fullscreen="fullscreen"
      class="max-w-2xl"
      show-fullscreen
      title="Fullscreen Dialog"
      description="Toggle the fullscreen button in the header."
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>
      <div>
        Use the fullscreen button in the header to toggle fullscreen mode, or bind
        <code>fullscreen</code>
        with
        <code>v-model</code>
        .
      </div>
    </SDialog>
  </div>
</template>
