<script setup lang="ts">
import { ref } from 'vue';
import { SRadioGroupCard } from '@vean/ui';
import type { RadioGroupCardOptionData } from '@vean/ui';

const selected = ref<string>('apple');

const items: RadioGroupCardOptionData<string>[] = [
  { icon: 'lucide:apple', value: 'apple', label: 'Apple', description: 'This is an apple' },
  { icon: 'hugeicons:orange', value: 'orange', label: 'Orange', description: 'This is an orange' },
  { icon: 'lucide:banana', value: 'banana', label: 'Banana', description: 'This is a banana' },
  { icon: 'lucide:grape', value: 'grape', label: 'Grape', description: 'This is a grape' }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SRadioGroupCard v-model="selected" class="max-w-2xl" :items="items" color="destructive" shape="rounded" />
  </div>
</template>
