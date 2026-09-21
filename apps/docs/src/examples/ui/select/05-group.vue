<script setup lang="ts">
import { SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

const fruits = ['apple', 'banana', 'cherry', 'orange', 'pear', 'plum', 'strawberry', 'watermelon'];

const vegetables = ['carrot', 'potato', 'onion', 'garlic', 'tomato', 'lettuce', 'broccoli', 'cauliflower'];

const groups: SelectOptionData[] = [
  {
    label: 'Fruits',
    items: fruits.map(fruit => ({ label: fruit, value: fruit }))
  },
  {
    label: 'Vegetables',
    items: vegetables.map(vegetable => ({ label: vegetable, value: vegetable }))
  }
];

const onUpdateModelValue = (value: string | number) => {
  console.log('Selected value:', value);
};
</script>

<template>
  <div class="flex justify-center w-full">
    <SSelect
      :items="groups"
      placeholder="Please select a fruit or vegetable"
      class="w-60 lt-md:w-auto"
      @update:model-value="onUpdateModelValue"
    />
  </div>
</template>
