<script setup lang="ts">
import { ref } from 'vue';
import { SCheckboxCard } from '@vean/ui';
import type { CheckedState } from '@vean/ui';

const model = ref<CheckedState | null>(null);
</script>

<template>
  <div class="flex justify-center w-full">
    <SCheckboxCard
      v-model="model"
      class="max-w-2xl"
      color="carbon"
      icon="lucide:swatch-book"
      label="Label"
      description="this is a description"
    />
  </div>
</template>
