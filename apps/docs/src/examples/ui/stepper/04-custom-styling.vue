<script setup lang="ts">
import { ref } from 'vue';
import { SStepper } from '@vean/ui';

const value = ref(2);

const items = [
  { title: 'Draft', description: 'Prepare the content' },
  { title: 'Review', description: 'Discuss with the team' },
  { title: 'Publish', description: 'Ship to production' }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SStepper
      v-model="value"
      class="max-w-2xl"
      color="success"
      :items="items"
      :ui="{
        root: 'rounded-lg border p-4',
        indicator: 'shadow-sm',
        itemContent: 'gap-1',
        title: 'uppercase tracking-wide'
      }"
    />
  </div>
</template>
