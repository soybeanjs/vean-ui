<script setup lang="ts">
import { ref } from 'vue';
import { SCascader } from '@vean/ui';
import type { CascaderOptionData } from '@vean/ui';

const value = ref<string>();

const children = Array.from({ length: 200 }, (_, index) => ({
  label: `子选项 ${index + 1}`,
  value: `child-${index + 1}`
}));

const options: CascaderOptionData<string>[] = Array.from({ length: 50 }, (_, index) => ({
  label: `分组 ${index + 1}`,
  value: `group-${index + 1}`,
  children
}));
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCascader
        v-model="value"
        virtual-scroll
        :item-size="34"
        :height="240"
        :options="options"
        placeholder="虚拟滚动（每列 200 项）"
      />
      <p class="text-sm text-muted-foreground">Selected: {{ value ?? 'None' }}</p>
    </div>
  </div>
</template>
