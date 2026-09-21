<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { createDate, createTime } from '@vean/aria/date';
import { SDateField } from '@vean/ui';

const value = shallowRef({ date: createDate(2026, 4, 19), time: createTime(14, 30, 0) });

const formattedValue = computed(() => {
  if (!value.value) return '-';

  return value.value.toString().replace('T', ' ');
});
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <SDateField v-model="value" granularity="second" aria-label="Meeting time" class="w-fit" />
    <p class="text-sm text-muted-foreground">Value: {{ formattedValue }}</p>
  </div>
</template>
