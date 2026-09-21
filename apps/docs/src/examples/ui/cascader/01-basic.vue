<script setup lang="ts">
import { shallowRef } from 'vue';
import { SCascader, SButtonIcon, SInput, SSelect, SSwitch } from '@vean/ui';
import type { CascaderOptionData, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  multiple: boolean;
  pathMode: boolean;
  clearable: boolean;
  expandTrigger: 'click' | 'hover';
  checkStrictly: boolean;
  showCheckedStrategy: 'child' | 'parent';
  filterable: boolean;
  disabled: boolean;
  placeholder: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  multiple: false,
  pathMode: false,
  clearable: false,
  expandTrigger: 'click',
  checkStrictly: false,
  showCheckedStrategy: 'child',
  filterable: false,
  disabled: false,
  placeholder: '请选择区域'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const EXPAND_TRIGGER_KEYS: readonly CustomizerState['expandTrigger'][] = ['click', 'hover'];
const STRATEGY_KEYS: readonly CustomizerState['showCheckedStrategy'][] = ['child', 'parent'];

const expandTriggerItems: SelectOptionData<CustomizerState['expandTrigger']>[] = toOptions(EXPAND_TRIGGER_KEYS);
const strategyItems: SelectOptionData<CustomizerState['showCheckedStrategy']>[] = toOptions(STRATEGY_KEYS);

const size = shallowRef(DEFAULTS.size);
const multiple = shallowRef(DEFAULTS.multiple);
const pathMode = shallowRef(DEFAULTS.pathMode);
const clearable = shallowRef(DEFAULTS.clearable);
const expandTrigger = shallowRef(DEFAULTS.expandTrigger);
const checkStrictly = shallowRef(DEFAULTS.checkStrictly);
const showCheckedStrategy = shallowRef(DEFAULTS.showCheckedStrategy);
const filterable = shallowRef(DEFAULTS.filterable);
const disabled = shallowRef(DEFAULTS.disabled);
const placeholder = shallowRef(DEFAULTS.placeholder);

/** multiple / pathMode 都是动态开关，选中值按四种形态的并集保存。 */
const value = shallowRef<string | string[] | string[][] | undefined>();

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
  },
  {
    label: '上海',
    value: 'shanghai',
    children: [
      { label: '浦东新区', value: 'pudong' },
      { label: '静安区', value: 'jingan' }
    ]
  }
];

const reset = (): void => {
  size.value = DEFAULTS.size;
  multiple.value = DEFAULTS.multiple;
  pathMode.value = DEFAULTS.pathMode;
  clearable.value = DEFAULTS.clearable;
  expandTrigger.value = DEFAULTS.expandTrigger;
  checkStrictly.value = DEFAULTS.checkStrictly;
  showCheckedStrategy.value = DEFAULTS.showCheckedStrategy;
  filterable.value = DEFAULTS.filterable;
  disabled.value = DEFAULTS.disabled;
  placeholder.value = DEFAULTS.placeholder;
  value.value = undefined;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="expandTrigger">
        <SSelect
          v-model="expandTrigger"
          :items="expandTriggerItems"
          :trigger-props="{ 'aria-label': 'Expand trigger' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="showCheckedStrategy">
        <SSelect
          v-model="showCheckedStrategy"
          :items="strategyItems"
          :trigger-props="{ 'aria-label': 'Show checked strategy' }"
          class="w-27.5"
        />
      </FieldItem>
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" placeholder="Trigger placeholder" />
      </FieldItem>
      <FieldItem label="multiple">
        <div class="h-8 flex items-center">
          <SSwitch v-model="multiple" :control-props="{ 'aria-label': 'Multiple' }" />
        </div>
      </FieldItem>
      <FieldItem label="pathMode">
        <div class="h-8 flex items-center">
          <SSwitch v-model="pathMode" :control-props="{ 'aria-label': 'Path mode' }" />
        </div>
      </FieldItem>
      <FieldItem label="clearable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="clearable" :control-props="{ 'aria-label': 'Clearable' }" />
        </div>
      </FieldItem>
      <FieldItem label="checkStrictly">
        <div class="h-8 flex items-center">
          <SSwitch v-model="checkStrictly" :control-props="{ 'aria-label': 'Check strictly' }" />
        </div>
      </FieldItem>
      <FieldItem label="filterable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="filterable" :control-props="{ 'aria-label': 'Filterable' }" />
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
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCascader
        v-model="value"
        :options="options"
        :size="size"
        :multiple="multiple"
        :path-mode="pathMode"
        :clearable="clearable"
        :expand-trigger="expandTrigger"
        :check-strictly="checkStrictly"
        :show-checked-strategy="showCheckedStrategy"
        :filterable="filterable"
        :disabled="disabled"
        :placeholder="placeholder"
      />
      <p class="text-sm text-muted-foreground">Selected: {{ JSON.stringify(value ?? 'None') }}</p>
    </div>
  </div>
</template>
