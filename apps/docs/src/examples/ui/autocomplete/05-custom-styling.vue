<script setup lang="ts">
import { SAutocomplete } from '@vean/ui';
import type { AutocompleteOptionData } from '@vean/ui';

const items: AutocompleteOptionData[] = [
  { value: 'alpine', label: 'Alpine' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'soybean', label: 'Soybean' }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SAutocomplete
      :items="items"
      placeholder="Custom styled"
      :ui="{
        anchor: 'border-primary/40 bg-primary/5',
        popup: 'border-primary/30',
        item: 'data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground'
      }"
      class="w-72 lt-md:w-auto"
    />
  </div>
</template>
