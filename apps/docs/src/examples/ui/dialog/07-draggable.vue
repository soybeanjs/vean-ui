<script setup lang="ts">
import { SButton, SDialog } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SDialog class="max-w-2xl" draggable title="Draggable Dialog" description="Drag the header to move this dialog.">
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>
      <div class="w-80">
        Drag the header to move the dialog around the screen. The position is preserved after you stop dragging.
      </div>
    </SDialog>
  </div>
</template>
