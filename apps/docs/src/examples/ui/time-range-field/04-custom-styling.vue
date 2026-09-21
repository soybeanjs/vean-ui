<script setup lang="ts">
import { shallowRef } from 'vue';
import { createTime } from '@vean/aria/date';
import { STimeRangeField } from '@vean/ui';

const value = shallowRef({
  start: createTime(10, 0, 0),
  end: createTime(18, 0, 0)
});
</script>

<template>
  <div class="flex justify-center w-full">
    <STimeRangeField
      v-model="value"
      class="max-w-2xl"
      aria-label="Styled time range"
      :ui="{
        root: 'rounded-xl border-primary/40 bg-primary/4',
        input: 'focus-visible:bg-primary/12',
        separator: 'font-medium text-primary'
      }"
    />
  </div>
</template>
