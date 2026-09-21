<script setup lang="ts">
import { ref } from 'vue';
import { SColorPicker } from '@vean/ui';

const color = ref('oklch(62% 0.22 312)');
</script>

<template>
  <div class="flex justify-center w-full">
    <SColorPicker
      v-model="color"
      class="max-w-2xl"
      placement="bottom-start"
      color-space="oklch"
      default-format="oklch"
    />
  </div>
</template>
