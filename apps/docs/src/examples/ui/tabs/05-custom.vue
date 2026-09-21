<script setup lang="ts">
import { ref } from 'vue';
import { STabs } from '@vean/ui';

const tabValue = ref('1');
const tabs = [
  { value: '1', label: 'Tab 1' },
  { value: '2', label: 'Tab 2' },
  { value: '3', label: 'Tab 3' }
];
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="w-80 lt-md:w-auto">
      <STabs
        v-model="tabValue"
        :items="tabs"
        :ui="{
          list: 'border-border border-b-0.5 bg-transparent rounded-none',
          content: 'p-4 border border-border rounded-1',
          indicatorContent: 'absolute -bottom-0.5 h-0.5 rounded-1 bg-primary'
        }"
      >
        <template #trigger="{ label, selected }">
          <div :class="{ 'text-primary fw-bold': selected }">{{ label }}</div>
        </template>
        <template #content="{ value }">
          <div>The Tab Content: {{ value }}</div>
        </template>
      </STabs>
    </div>
    <div class="mt-4 w-80 lt-md:w-auto">
      <STabs
        v-model="tabValue"
        :items="tabs"
        orientation="vertical"
        class="mt-24px"
        :ui="{
          list: 'border-border border-l-0.5 bg-transparent rounded-none',
          content: 'p-4 border border-border rounded-1',
          indicatorContent: 'absolute -start-0.5 w-0.5 rounded-1 bg-primary'
        }"
      >
        <template #trigger="{ label, selected }">
          <div :class="{ 'text-primary fw-bold': selected }">{{ label }}</div>
        </template>
        <template #content="{ value }">
          <div>The Tab Content: {{ value }}</div>
        </template>
      </STabs>
    </div>
  </div>
</template>
