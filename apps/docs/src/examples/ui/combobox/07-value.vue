<script setup lang="ts">
import { ref } from 'vue';
import { ComboboxValue } from '@vean/aria/combobox';
import { SCombobox } from '@vean/ui';

interface OptionItem {
  label: string;
  value: string;
}

const items: (OptionItem | { label: string; items: OptionItem[] })[] = [
  {
    label: 'Fruits',
    items: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' }
    ]
  },
  {
    label: 'Vegetables',
    items: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Potato', value: 'potato' }
    ]
  }
];

const singleValue = ref('banana');
const multipleValue = ref<string[]>(['banana', 'carrot']);
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-4">
      <SCombobox v-model="singleValue" :items="items" placeholder="Select a fruit" search-placeholder="Search...">
        <template #trigger-leading>
          <span class="i-lucide-cookie text-muted-foreground" />
        </template>
        <template #trigger-value>
          <ComboboxValue :items="items" class="font-medium" />
        </template>
      </SCombobox>

      <SCombobox
        v-model="multipleValue"
        multiple
        :items="items"
        placeholder="Select fruits"
        search-placeholder="Search..."
      >
        <template #trigger-value="{ selectedLabels }">
          <ComboboxValue :items="items" separator=" · " class="font-medium" />
          <span v-if="selectedLabels.length" class="text-xs text-muted-foreground">({{ selectedLabels.length }})</span>
        </template>
      </SCombobox>
    </div>
  </div>
</template>
