<script setup lang="ts">
import { shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import { SDateField } from '@vean/ui';

const value = shallowRef(createDate(2026, 4, 19));
</script>

<template>
  <div class="flex justify-center w-full">
    <SDateField
      v-model="value"
      aria-label="Custom styled date"
      class="w-fit"
      :ui="{
        root: 'rounded-xl border-primary/50 bg-primary/5',
        input: 'font-semibold data-[segment=literal]:font-normal data-[placeholder]:text-primary/50'
      }"
    />
  </div>
</template>
