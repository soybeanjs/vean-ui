<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SInput, SInputNumber, SSelect, SSwitch, STreeMenu } from '@vean/ui';
import type { SelectOptionData, ThemeSize, TreeMenuExpandStrategy } from '@vean/ui';
import { themeSizeOptions, themeSizeRatioMap } from '~/constants/theme';
import { treeMenuItems } from './data';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  expandStrategy: TreeMenuExpandStrategy;
  collapsed: boolean;
  collapsedWidth: number;
  indent: number;
  activeValue: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  expandStrategy: 'keep',
  collapsed: false,
  collapsedWidth: 50,
  indent: 16,
  activeValue: ''
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const EXPAND_STRATEGY_KEYS: readonly TreeMenuExpandStrategy[] = ['keep', 'selected'];

const expandStrategyItems: SelectOptionData<TreeMenuExpandStrategy>[] = toOptions(EXPAND_STRATEGY_KEYS);

const size = shallowRef(DEFAULTS.size);
const expandStrategy = shallowRef(DEFAULTS.expandStrategy);
const collapsed = shallowRef(DEFAULTS.collapsed);
const collapsedWidth = shallowRef(DEFAULTS.collapsedWidth);
const indent = shallowRef(DEFAULTS.indent);
const activeValue = shallowRef(DEFAULTS.activeValue);

const reset = (): void => {
  size.value = DEFAULTS.size;
  expandStrategy.value = DEFAULTS.expandStrategy;
  collapsed.value = DEFAULTS.collapsed;
  collapsedWidth.value = DEFAULTS.collapsedWidth;
  indent.value = DEFAULTS.indent;
  activeValue.value = DEFAULTS.activeValue;
};

const BASE_WIDTH = 240;

/** 展开态的侧栏宽度跟随 size 缩放；折叠态由 collapsedWidth 接管。 */
const menuWidth = computed(() => `${(BASE_WIDTH * themeSizeRatioMap[size.value]) / themeSizeRatioMap.md / 16}rem`);
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="expandStrategy">
        <SSelect
          v-model="expandStrategy"
          :items="expandStrategyItems"
          :trigger-props="{ 'aria-label': 'Expand strategy' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="collapsed">
        <div class="h-8 flex items-center">
          <SSwitch v-model="collapsed" :control-props="{ 'aria-label': 'Collapsed' }" />
        </div>
      </FieldItem>
      <FieldItem label="collapsedWidth">
        <SInputNumber
          v-model="collapsedWidth"
          :min="24"
          :max="120"
          :step="2"
          :control-props="{ 'aria-label': 'Collapsed width' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="indent">
        <SInputNumber
          v-model="indent"
          :min="8"
          :max="48"
          :step="2"
          :control-props="{ 'aria-label': 'Indent' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="activeValue">
        <SInput v-model="activeValue" aria-label="Active value" placeholder="e.g. deepseek-coder" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="relative h-120" :style="{ width: menuWidth }">
      <STreeMenu
        v-model:collapsed="collapsed"
        v-model:model-value="activeValue"
        :size="size"
        :expand-strategy="expandStrategy"
        :collapsed-width="collapsedWidth"
        :indent="indent"
        :items="treeMenuItems"
        class="bg-sidebar border rounded-md"
      />
    </div>
  </div>
</template>
