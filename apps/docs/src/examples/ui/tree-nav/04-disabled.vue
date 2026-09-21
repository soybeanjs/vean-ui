<script setup lang="ts">
import { ref } from 'vue';
import { SButton, STreeNav } from '@vean/ui';
import type { TreeNavOptionData } from '@vean/ui';

const disabled = ref(false);

const items: TreeNavOptionData[] = [
  {
    value: 'products',
    label: 'Products',
    disabled: true,
    children: [{ value: 'ui', label: 'VeanUI' }]
  },
  {
    value: 'resources',
    label: 'Resources',
    children: [
      { value: 'templates', label: 'Templates', disabled: true },
      { value: 'icons', label: 'Icons' }
    ]
  },
  { value: 'support', label: 'Support' }
];

const toggleDisabled = () => {
  disabled.value = !disabled.value;
};
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-3">
      <div class="w-fit">
        <SButton size="sm" variant="outline" @click="toggleDisabled">Toggle bar disabled</SButton>
      </div>
      <STreeNav :items="items" :disabled="disabled" trigger="click" />
    </div>
  </div>
</template>
