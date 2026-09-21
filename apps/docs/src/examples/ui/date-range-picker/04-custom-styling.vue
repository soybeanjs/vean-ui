<script setup lang="ts">
import { SDateRangePicker } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SDateRangePicker
      class="max-w-2xl"
      :ui="{
        trigger: 'border-primary hover:bg-primary/10',
        popup: 'border-primary/20'
      }"
    />
  </div>
</template>
