<script setup lang="ts">
import { createDate } from '@vean/aria/date';
import { SCalendar } from '@vean/ui';

const today = createDate(2026, 4, 18);
const isDateDisabled = (date: Date) => date.getDate() % 2 === 0;
</script>

<template>
  <div class="flex justify-center w-full">
    <SCalendar class="max-w-2xl" :default-placeholder="today" :is-date-disabled="isDateDisabled" />
  </div>
</template>
