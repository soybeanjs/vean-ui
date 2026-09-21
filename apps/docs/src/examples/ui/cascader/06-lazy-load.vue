<script setup lang="ts">
import { ref } from 'vue';
import { SCascader } from '@vean/ui';
import type { CascaderNode, CascaderOptionData } from '@vean/ui';

const value = ref<string>();

const regions: Record<string, CascaderOptionData<string>[]> = {
  zhejiang: [
    {
      label: '杭州',
      value: 'hangzhou',
      children: [
        { label: '西湖区', value: 'xihu' },
        { label: '滨江区', value: 'binjiang' }
      ]
    },
    { label: '宁波', value: 'ningbo', children: [{ label: '海曙区', value: 'haishu' }] }
  ],
  jiangsu: [
    {
      label: '南京',
      value: 'nanjing',
      children: [
        { label: '鼓楼区', value: 'gulou' },
        { label: '玄武区', value: 'xuanwu' }
      ]
    },
    { label: '苏州', value: 'suzhou', children: [{ label: '姑苏区', value: 'gusu' }] }
  ]
};

const provinces: CascaderOptionData<string>[] = [
  { label: '浙江', value: 'zhejiang', children: true },
  { label: '江苏', value: 'jiangsu', children: true }
];

const onLoad = (node: CascaderNode<string>) => {
  return new Promise<CascaderOptionData<string>[]>(resolve => {
    window.setTimeout(() => {
      resolve(regions[node.value] ?? []);
    }, 500);
  });
};
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCascader v-model="value" lazy :options="provinces" :on-load="onLoad" placeholder="懒加载子级" />
      <p class="text-sm text-muted-foreground">Selected: {{ value ?? 'None' }}</p>
    </div>
  </div>
</template>
