<script setup lang="ts">
import { SAutocomplete } from '@vean/ui';
import type { AutocompleteOptionData } from '@vean/ui';

const items: AutocompleteOptionData[] = [
  {
    label: 'Fruits',
    items: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'blueberry', label: 'Blueberry' }
    ]
  },
  {
    label: 'Vegetables',
    items: [
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'carrot', label: 'Carrot' },
      { value: 'cucumber', label: 'Cucumber' }
    ]
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SAutocomplete :items="items" placeholder="Search foods" class="w-72 lt-md:w-auto" />
  </div>
</template>
