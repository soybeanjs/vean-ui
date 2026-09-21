<script setup lang="ts">
import { SClipboard, SIcon } from '@vean/ui';

const value = 'custom-styling-example';
</script>

<template>
  <div class="flex justify-center w-full">
    <SClipboard
      :value="value"
      variant="outline"
      color="info"
      copy-text="Copy custom style action"
      copied-text="Copied custom style action"
      class="border-dashed max-w-2xl"
    >
      <template #leading="{ icon }">
        <SIcon :icon="icon" class="text-info" />
      </template>
      <template #default="{ text }">
        {{ text }}
      </template>
    </SClipboard>
  </div>
</template>
