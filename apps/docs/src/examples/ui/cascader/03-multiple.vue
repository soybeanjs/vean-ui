<script setup lang="ts">
import { ref } from 'vue';
import { SCascader } from '@vean/ui';
import type { CascaderOptionData } from '@vean/ui';

const value = ref<string[]>();
const value2 = ref<string[]>();

const options: CascaderOptionData<string>[] = [
  {
    label: '前端',
    value: 'frontend',
    children: [
      {
        label: '框架',
        value: 'framework',
        children: [
          { label: 'Vue', value: 'vue' },
          { label: 'React', value: 'react' }
        ]
      },
      {
        label: '样式',
        value: 'style',
        children: [
          { label: 'UnoCSS', value: 'unocss' },
          { label: 'Tailwind', value: 'tailwind' }
        ]
      }
    ]
  },
  {
    label: '后端',
    value: 'backend',
    children: [
      {
        label: '语言',
        value: 'language',
        children: [
          { label: 'Go', value: 'go' },
          { label: 'Rust', value: 'rust' }
        ]
      }
    ]
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-2">
      <div class="w-80 lt-md:w-auto flex-c gap-2">
        <SCascader v-model="value" multiple :options="options" placeholder="多选（回填叶子）" />
      </div>
      <div class="w-80 lt-md:w-auto flex-c gap-2">
        <SCascader
          v-model="value2"
          multiple
          check-strictly
          show-checked-strategy="parent"
          :options="options"
          placeholder="多选（父级策略）"
        />
      </div>
    </div>
  </div>
</template>
