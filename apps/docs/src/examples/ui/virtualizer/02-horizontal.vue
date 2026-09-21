<script setup lang="ts">
import { SVirtualizer, SVirtualizerItem } from '@vean/ui';

const items = Array.from({ length: 1000 }, (_, index) => ({
  value: `item-${index}`,
  title: `item-${index}`
}));
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto border rounded-md">
      <SVirtualizer :items="items" height="60px" :options="{ horizontal: true, estimateSize: () => 100 }">
        <template #item="{ virtualItem, item }">
          <SVirtualizerItem :data="virtualItem" class="px-2 py-1 border-r">
            {{ item.title }}
          </SVirtualizerItem>
        </template>
      </SVirtualizer>
    </div>
  </div>
</template>
