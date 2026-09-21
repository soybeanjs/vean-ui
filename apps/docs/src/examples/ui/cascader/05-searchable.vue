<script setup lang="ts">
import { ref } from 'vue';
import { SCascader } from '@vean/ui';
import type { CascaderOptionData } from '@vean/ui';

const value = ref<string>();

const options: CascaderOptionData<string>[] = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' }
        ]
      },
      {
        label: '宁波',
        value: 'ningbo',
        children: [{ label: '海曙区', value: 'haishu' }]
      }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '鼓楼区', value: 'gulou' },
          { label: '玄武区', value: 'xuanwu' }
        ]
      },
      {
        label: '苏州',
        value: 'suzhou',
        children: [{ label: '姑苏区', value: 'gusu' }]
      }
    ]
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCascader v-model="value" filterable :options="options" placeholder="输入关键词过滤（支持路径匹配）" />
      <p class="text-sm text-muted-foreground">Selected: {{ value ?? 'None' }}</p>
    </div>
  </div>
</template>
