<script setup lang="ts">
import { SCombobox } from '@vean/ui';
import type { ComboboxOptionData } from '@vean/ui';

const items: ComboboxOptionData[] = [
  { label: 'Planning', value: 'planning' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SCombobox
      :items="items"
      placeholder="Pick a status"
      :ui="{
        trigger: 'rounded-full border-primary/40 bg-primary/5',
        popup: 'border-primary/30 shadow-lg',
        item: 'data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary',
        groupLabel: 'uppercase tracking-wide text-primary'
      }"
      class="w-80 lt-md:w-auto"
    />
  </div>
</template>
