<script setup lang="ts">
import { ref } from 'vue';
import { createDate } from '@vean/aria/date';
import { SDatePicker } from '@vean/ui';

const selectedDate = ref<any>();
</script>

<template>
  <div class="flex justify-center w-full">
    <SDatePicker
      v-model="selectedDate"
      class="max-w-2xl"
      :default-placeholder="createDate(2024, 1, 1)"
      :ui="{
        trigger: 'border-primary/50 bg-primary/5 hover:bg-primary/10',
        popup: 'border-primary/30'
      }"
    />
  </div>
</template>
