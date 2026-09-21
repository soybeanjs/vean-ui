<script setup lang="ts">
import { shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import { SCalendarRange } from '@vean/ui';

const value = shallowRef({
  start: createDate(2026, 4, 18),
  end: createDate(2026, 4, 22)
});
</script>

<template>
  <div class="flex justify-center w-full">
    <SCalendarRange
      v-model="value"
      class="max-w-2xl"
      :default-placeholder="value.start"
      :ui="{
        root: 'rounded-xl border border-primary/30 p-4',
        cellTrigger:
          'data-[selection-start]:bg-primary data-[selection-end]:bg-primary data-[highlighted]:bg-primary/15'
      }"
    />
  </div>
</template>
