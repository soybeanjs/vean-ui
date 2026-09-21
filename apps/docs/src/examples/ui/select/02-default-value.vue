<script setup lang="ts">
import { SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

const fruits = ['apple', 'banana', 'cherry', 'orange', 'pear', 'plum', 'strawberry', 'watermelon'];

const items: SelectOptionData<string>[] = fruits.map(fruit => ({
  label: fruit,
  value: fruit
}));

const defaultFruit: string = 'strawberry';
</script>

<template>
  <div class="flex justify-center w-full">
    <SSelect
      :items="items"
      :default-value="defaultFruit"
      placeholder="Please select a fruit"
      class="w-60 lt-md:w-auto"
    />
  </div>
</template>
