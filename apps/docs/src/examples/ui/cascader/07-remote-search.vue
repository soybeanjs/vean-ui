<script setup lang="ts">
import { ref } from 'vue';
import { SCascader } from '@vean/ui';
import type { CascaderOptionData } from '@vean/ui';

const value = ref<string>();

const options: CascaderOptionData<string>[] = [
  {
    label: '前端',
    value: 'frontend',
    children: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Svelte', value: 'svelte' }
    ]
  },
  {
    label: '后端',
    value: 'backend',
    children: [
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' }
    ]
  },
  {
    label: '运维',
    value: 'ops',
    children: [
      { label: 'K8s', value: 'k8s' },
      { label: 'Terraform', value: 'terraform' }
    ]
  }
];

const onSearch = (pattern: string) => {
  return new Promise<CascaderOptionData<string>[]>(resolve => {
    window.setTimeout(() => {
      const keyword = pattern.trim().toLowerCase();
      const results: CascaderOptionData<string>[] = [];
      for (const group of options) {
        const children = Array.isArray(group.children) ? group.children : [];
        const matched = children.filter(child => String(child.label).toLowerCase().includes(keyword));
        if (matched.length > 0) {
          // Keep the hierarchy: the group comes first and the matched children below it.
          results.push({ label: group.label, value: group.value, children: matched });
        } else if (String(group.label).toLowerCase().includes(keyword)) {
          // A matching group label matches the whole path, like the local filter.
          results.push({ ...group });
        }
      }
      resolve(results);
    }, 400);
  });
};
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCascader v-model="value" filterable remote :options="options" :on-search="onSearch" placeholder="远程搜索" />
      <p class="text-sm text-muted-foreground">Selected: {{ value ?? 'None' }}</p>
    </div>
  </div>
</template>
