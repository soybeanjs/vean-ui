<script setup lang="ts">
import { ref } from 'vue';
import { SCombobox } from '@vean/ui';
import type { ComboboxOptionData } from '@vean/ui';

const value = ref('vue');

const items: ComboboxOptionData[] = [
  {
    label: 'Frontend',
    items: [
      { label: 'Vue', value: 'vue', icon: 'logos:vue' },
      { label: 'React', value: 'react', icon: 'logos:react' },
      { label: 'Svelte', value: 'svelte', icon: 'logos:svelte-icon' }
    ]
  },
  {
    label: 'Backend',
    separator: true,
    items: [
      { label: 'Node', value: 'node', icon: 'logos:nodejs-icon' },
      { label: 'Go', value: 'go', icon: 'logos:go' }
    ]
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SCombobox
      v-model="value"
      :items="items"
      placeholder="Choose a stack"
      search-placeholder="Search stacks"
      class="w-80 lt-md:w-auto"
    />
  </div>
</template>
