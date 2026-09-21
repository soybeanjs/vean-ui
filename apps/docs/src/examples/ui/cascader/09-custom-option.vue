<script setup lang="ts">
import { ref } from 'vue';
import { SCascader } from '@vean/ui';
import type { CascaderOptionData } from '@vean/ui';

const value = ref<string[]>();

const options: CascaderOptionData<string>[] = [
  {
    label: '科技',
    value: 'tech',
    children: [
      { label: '编程', value: 'coding' },
      { label: '硬件', value: 'hardware' }
    ]
  },
  {
    label: '生活',
    value: 'life',
    children: [
      { label: '美食', value: 'food' },
      { label: '旅行', value: 'travel' }
    ]
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCascader v-model="value" multiple check-strictly :options="options" placeholder="自定义选项内容">
        <template #option="{ node, checked, highlighted }">
          <span :class="highlighted ? 'text-primary' : ''" class="flex items-center gap-1">
            <span class="size-1.5 rounded-full bg-primary/60" />
            {{ node.label }}
          </span>
          <span v-if="checked" class="text-primary">✓</span>
        </template>
      </SCascader>
    </div>
  </div>
</template>
