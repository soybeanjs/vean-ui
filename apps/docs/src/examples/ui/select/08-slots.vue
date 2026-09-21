<script setup lang="ts">
import { SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

const fruits = [
  'apple',
  'banana',
  'cherry',
  'orange',
  'pear',
  'plum',
  'strawberry',
  'watermelon',
  'kiwi',
  'grape',
  'mango',
  'lemon'
];

const items: SelectOptionData[] = fruits.map(fruit => ({
  label: fruit,
  value: fruit
}));
</script>

<template>
  <div class="flex justify-center w-full">
    <SSelect :items="items" placeholder="Please select a fruit" class="w-60 lt-md:w-auto">
      <template #top>
        <div class="px-2 py-1 text-2xs font-medium text-primary border-b border-border">Top custom content</div>
      </template>
      <template #bottom>
        <div class="px-2 py-1 text-2xs text-muted-foreground border-t border-border">Bottom custom content</div>
      </template>
    </SSelect>
  </div>
</template>
