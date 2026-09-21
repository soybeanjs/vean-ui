<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SSelect, SSplitNav, SSwitch } from '@vean/ui';
import type { SelectOptionData, SplitNavMode, ThemeSize, TreeMenuExpandStrategy } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';
import { splitNavItems } from './data';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  mode: SplitNavMode;
  size: ThemeSize;
  expandStrategy: TreeMenuExpandStrategy;
  collapsed: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  mode: 'dual-vertical',
  size: 'md',
  expandStrategy: 'keep',
  collapsed: false
};

/**
 * 容器布局：一级是竖直 rail 的模式把二级面板排在 rail 右侧并顶部对齐，
 * 一级是顶栏的模式把二级面板排在顶栏下方。
 *
 * 混合模式的各个面板是彼此独立的片段（只有 `dual-vertical` 自带 flex 容器），
 * 所以方向由使用方容器提供，并且必须跟着 `mode` 切换。
 */
const CONTAINER_LAYOUT: Record<SplitNavMode, string> = {
  'dual-vertical': 'flex-row items-start',
  'vertical-horizontal': 'flex-row items-start',
  'horizontal-vertical': 'flex-col',
  'horizontal-dual-vertical': 'flex-col'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const MODE_KEYS: readonly SplitNavMode[] = [
  'dual-vertical',
  'vertical-horizontal',
  'horizontal-vertical',
  'horizontal-dual-vertical'
];
const EXPAND_STRATEGY_KEYS: readonly TreeMenuExpandStrategy[] = ['keep', 'selected'];

const modeItems: SelectOptionData<SplitNavMode>[] = toOptions(MODE_KEYS);
const expandStrategyItems: SelectOptionData<TreeMenuExpandStrategy>[] = toOptions(EXPAND_STRATEGY_KEYS);

const active = shallowRef('vean-ui');
const mode = shallowRef<SplitNavMode>(DEFAULTS.mode);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const expandStrategy = shallowRef<TreeMenuExpandStrategy>(DEFAULTS.expandStrategy);
const collapsed = shallowRef(DEFAULTS.collapsed);

const containerClass = computed(() => CONTAINER_LAYOUT[mode.value]);

const reset = (): void => {
  active.value = 'vean-ui';
  mode.value = DEFAULTS.mode;
  size.value = DEFAULTS.size;
  expandStrategy.value = DEFAULTS.expandStrategy;
  collapsed.value = DEFAULTS.collapsed;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="mode">
        <SSelect v-model="mode" :items="modeItems" :trigger-props="{ 'aria-label': 'Mode' }" class="w-60" />
      </FieldItem>
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
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="h-110 flex border rounded-md bg-sidebar" :class="containerClass">
    <SSplitNav
      v-model="active"
      v-model:collapsed="collapsed"
      :mode="mode"
      :size="size"
      :expand-strategy="expandStrategy"
      :items="splitNavItems"
      class="h-full"
    />
  </div>
</template>
