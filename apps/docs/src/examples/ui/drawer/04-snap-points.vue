<script setup lang="ts">
import { ref } from 'vue';
import { SDrawer, SButton } from '@vean/ui';

const open = ref(false);
const snapPoint = ref<number | string | null>(0.5);
</script>

<template>
  <div class="flex justify-center w-full">
    <SDrawer
      v-model:open="open"
      v-model:snap-point="snapPoint"
      title="Snap Points"
      description="Drag the handle, or release the drawer, to move between the 25%, 50%, and 75% snap levels."
      :snap-points="[0.25, 0.5, 0.75]"
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>

      <div class="flex flex-col gap-3 py-2">
        <p class="text-sm text-muted-foreground">Active snap point: {{ snapPoint }}</p>
        <div v-for="i in 40" :key="i" class="h-8">Item {{ i }}</div>
      </div>
    </SDrawer>
  </div>
</template>
