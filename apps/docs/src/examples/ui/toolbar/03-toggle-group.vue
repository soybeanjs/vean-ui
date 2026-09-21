<script setup lang="ts">
import { ref } from 'vue';
import { SToolbar, SToolbarSeparator, SToolbarToggleGroup, SToolbarToggleItem } from '@vean/ui';

const value = ref('bold');
</script>

<template>
  <div class="flex justify-center w-full">
    <SToolbar class="max-w-2xl">
      <SToolbarToggleGroup v-model="value">
        <SToolbarToggleItem value="bold">Bold</SToolbarToggleItem>
        <SToolbarToggleItem value="italic">Italic</SToolbarToggleItem>
        <SToolbarToggleItem value="underline">Underline</SToolbarToggleItem>
      </SToolbarToggleGroup>
      <SToolbarSeparator />
      <span class="text-sm text-muted-foreground">{{ value }}</span>
    </SToolbar>
  </div>
</template>
