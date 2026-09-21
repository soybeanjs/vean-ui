<script setup lang="ts">
import { shallowRef } from 'vue';
import type { ColorFormat, ColorSpace } from '@vean/aria/types';
import { SButtonIcon, SColorPicker, SSelect, SSwitch } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  colorSpace: ColorSpace;
  defaultFormat: ColorFormat;
  size: ThemeSize;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  colorSpace: 'hsl',
  defaultFormat: 'hex',
  size: 'md',
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const COLOR_SPACE_KEYS: readonly ColorSpace[] = ['hsl', 'hsv', 'oklch'];
const FORMAT_KEYS: readonly ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];

const colorSpaceItems = toOptions(COLOR_SPACE_KEYS);
const formatItems = toOptions(FORMAT_KEYS);

// 被编辑的颜色本身不是「怎么渲染」的状态，保持为独立的模型值。
const color = shallowRef('#7c3aed');

const swatches = [
  '#7c3aed',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#63f4d2',
  '#0f172a',
  '#db2777',
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#dc2626'
];

const colorSpace = shallowRef(DEFAULTS.colorSpace);
const defaultFormat = shallowRef(DEFAULTS.defaultFormat);
const size = shallowRef(DEFAULTS.size);
const disabled = shallowRef(DEFAULTS.disabled);

const reset = (): void => {
  colorSpace.value = DEFAULTS.colorSpace;
  defaultFormat.value = DEFAULTS.defaultFormat;
  size.value = DEFAULTS.size;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="colorSpace">
        <SSelect
          v-model="colorSpace"
          :items="colorSpaceItems"
          :trigger-props="{ 'aria-label': 'Color space' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="defaultFormat">
        <SSelect
          v-model="defaultFormat"
          :items="formatItems"
          :trigger-props="{ 'aria-label': 'Default format' }"
          class="w-27"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
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
    <SColorPicker
      v-model="color"
      class="max-w-2xl"
      :color-space="colorSpace"
      :default-format="defaultFormat"
      :size="size"
      :disabled="disabled"
      :swatches="swatches"
      placement="bottom-start"
    />
  </div>
</template>
