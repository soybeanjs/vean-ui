<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SIcon, SSelect, SSwitch, STree, STreeItem } from '@vean/ui';
import type { SelectOptionData, TreeItemData, TreeSelectBehavior, TreeToggleBehavior } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  selectionBehavior: TreeSelectBehavior;
  toggleBehavior: TreeToggleBehavior;
  propagateSelect: boolean;
  bubbleSelect: boolean;
  allowParentSelect: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  selectionBehavior: 'toggle',
  toggleBehavior: 'multiple',
  propagateSelect: false,
  bubbleSelect: false,
  allowParentSelect: false,
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SELECTION_BEHAVIOR_KEYS: readonly TreeSelectBehavior[] = ['toggle', 'replace'];
const TOGGLE_BEHAVIOR_KEYS: readonly TreeToggleBehavior[] = ['single', 'multiple'];

const selectionBehaviorItems: SelectOptionData<TreeSelectBehavior>[] = toOptions(SELECTION_BEHAVIOR_KEYS);
const toggleBehaviorItems: SelectOptionData<TreeToggleBehavior>[] = toOptions(TOGGLE_BEHAVIOR_KEYS);

const selectionBehavior = shallowRef(DEFAULTS.selectionBehavior);
const toggleBehavior = shallowRef(DEFAULTS.toggleBehavior);
const propagateSelect = shallowRef(DEFAULTS.propagateSelect);
const bubbleSelect = shallowRef(DEFAULTS.bubbleSelect);
const allowParentSelect = shallowRef(DEFAULTS.allowParentSelect);
const disabled = shallowRef(DEFAULTS.disabled);

const reset = (): void => {
  selectionBehavior.value = DEFAULTS.selectionBehavior;
  toggleBehavior.value = DEFAULTS.toggleBehavior;
  propagateSelect.value = DEFAULTS.propagateSelect;
  bubbleSelect.value = DEFAULTS.bubbleSelect;
  allowParentSelect.value = DEFAULTS.allowParentSelect;
  disabled.value = DEFAULTS.disabled;
};

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
  { value: 'nuxt', title: 'nuxt.config.ts', icon: 'vscode-icons:file-type-nuxt' }
];
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="selectionBehavior">
        <SSelect
          v-model="selectionBehavior"
          :items="selectionBehaviorItems"
          :trigger-props="{ 'aria-label': 'Selection behavior' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="toggleBehavior">
        <SSelect
          v-model="toggleBehavior"
          :items="toggleBehaviorItems"
          :trigger-props="{ 'aria-label': 'Toggle behavior' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="propagateSelect">
        <div class="h-8 flex items-center">
          <SSwitch v-model="propagateSelect" :control-props="{ 'aria-label': 'Propagate select' }" />
        </div>
      </FieldItem>
      <FieldItem label="bubbleSelect">
        <div class="h-8 flex items-center">
          <SSwitch v-model="bubbleSelect" :control-props="{ 'aria-label': 'Bubble select' }" />
        </div>
      </FieldItem>
      <FieldItem label="allowParentSelect">
        <div class="h-8 flex items-center">
          <SSwitch v-model="allowParentSelect" :control-props="{ 'aria-label': 'Allow parent select' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <STree
      class="list-none select-none w-56 bg-white text-stone-700 rounded-lg border shadow-sm p-2 text-sm font-medium"
      :items="items"
      :selection-behavior="selectionBehavior"
      :toggle-behavior="toggleBehavior"
      :propagate-select="propagateSelect"
      :bubble-select="bubbleSelect"
      :allow-parent-select="allowParentSelect"
      :disabled="disabled"
      :default-expanded="['components']"
    >
      <template #top>
        <h2 class="font-semibold text-sm text-stone-400 m-0 px-2 pt-1 pb-3">Directory Structure</h2>
      </template>
      <template #item="{ item }">
        <STreeItem
          v-slot="{ isExpanded }"
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
        </STreeItem>
      </template>
    </STree>
  </div>
</template>
