<script setup lang="ts">
import { SButton, SDialog } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SDialog
      class="max-w-2xl"
      title="Dialog Title"
      @pointer-down-outside="e => e.preventDefault()"
      @escape-key-down="e => e.preventDefault()"
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>
      <div>Dialog Content</div>
    </SDialog>
  </div>
</template>
