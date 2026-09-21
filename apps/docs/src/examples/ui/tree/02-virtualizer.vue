<script setup lang="ts">
import { ref } from 'vue';
import { SIcon, STreeVirtualizer, STreeVirtualizerItem, SCheckbox } from '@vean/ui';
import type { TreeItemData } from '@vean/ui';

type DemoTree = TreeItemData<{
  value: string;
  title: string;
  icon: string;
}>;

const items: DemoTree[] = [
  {
    value: 'composables',
    title: 'composables',
    icon: 'lucide:folder',
    children: [
      { value: 'auth', title: 'use-auth.ts', icon: 'vscode-icons:file-type-typescript' },
      { value: 'user', title: 'use-user.ts', icon: 'vscode-icons:file-type-typescript' }
    ]
  },
  {
    value: 'components',
    title: 'components',
    icon: 'lucide:folder',
    children: [
      {
        value: 'home',
        title: 'home',
        icon: 'lucide:folder',
        children: [
          { value: 'card', title: 'card.vue', icon: 'vscode-icons:file-type-vue' },
          { value: 'button', title: 'button.vue', icon: 'vscode-icons:file-type-vue' }
        ]
      }
    ]
  },
  { value: 'app', title: 'app.vue', icon: 'vscode-icons:file-type-vue' },
  { value: 'nuxt', title: 'nuxt.config.ts', icon: 'vscode-icons:file-type-nuxt' },
  ...Array.from({ length: 1000 }, (_, index) => ({
    value: `item-${index}`,
    title: `item-${index}`,
    icon: 'lucide:file'
  }))
];

const animated = ref(true);
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2 text-xs text-stone-500">
        <SCheckbox v-model="animated">Enable animated</SCheckbox>
      </label>
      <STreeVirtualizer
        :animated="animated"
        height="240px"
        class="list-none select-none w-56 bg-white text-stone-700 rounded-lg border shadow-sm p-2 text-sm font-medium"
        :items="items"
        :default-expanded="['components']"
      >
        <template #item="{ virtualItem, item }">
          <STreeVirtualizerItem
            v-slot="{ isExpanded }"
            :data="virtualItem"
            :style="{ 'padding-left': `${item.level - 0.5}rem` }"
            :value="item.value"
            :level="item.level"
            class="flex items-center py-1 px-2 rounded outline-none focus:ring-primary/50 focus:ring-2 data-[selected]:bg-primary/15"
          >
            <template v-if="item.hasChildren">
              <SIcon v-if="!isExpanded" icon="lucide:folder" />
              <SIcon v-else icon="lucide:folder-open" />
            </template>
            <SIcon v-else :icon="item.data.icon || 'lucide:file'" />
            <div class="ps-2">
              {{ item.data.title }}
            </div>
          </STreeVirtualizerItem>
        </template>
      </STreeVirtualizer>
    </div>
  </div>
</template>
