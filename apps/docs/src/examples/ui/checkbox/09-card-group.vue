<script setup lang="ts">
import { computed, ref } from 'vue';
import { SCheckbox, SCheckboxCardGroup } from '@vean/ui';
import type { CheckboxCardGroupOptionData, CheckedState } from '@vean/ui';

const selected = ref<string[]>(['apple', 'orange']);

const items: CheckboxCardGroupOptionData<string>[] = [
  { icon: 'lucide:apple', value: 'apple', label: 'Apple' },
  { icon: 'hugeicons:orange', value: 'orange', label: 'Orange' },
  { icon: 'lucide:banana', value: 'banana', label: 'Banana' },
  { icon: 'lucide:grape', value: 'grape', label: 'Grape' }
];

const checked = computed<CheckedState>({
  get() {
    if (selected.value.length === 0) return false;

    if (selected.value.length === items.length) return true;

    return 'indeterminate';
  },
  set(value) {
    selected.value = value === true ? items.map(item => item.value) : [];
  }
});
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-4">
      <SCheckbox v-model="checked" color="warning">Check All</SCheckbox>
      <SCheckboxCardGroup v-model="selected" :items="items" color="warning" shape="rounded" />
    </div>
  </div>
</template>
