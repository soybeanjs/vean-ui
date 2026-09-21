<script setup lang="ts">
import { ref } from 'vue';
import { SDrawer, SButton } from '@vean/ui';

const open = ref(false);
</script>

<template>
  <div class="flex justify-center w-full">
    <SDrawer
      v-model:open="open"
      swipeable
      :swipe-area-props="{ 'aria-label': 'Swipe up to open the drawer' }"
      title="Swipe Drawer"
      description="Swipe up from the bottom edge to open, then drag the handle down to dismiss."
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>

      <div v-for="i in 30" :key="i" class="h-8">Item {{ i }}</div>
    </SDrawer>
  </div>
</template>
