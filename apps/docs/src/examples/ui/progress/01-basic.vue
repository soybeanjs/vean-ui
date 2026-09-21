<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SInputNumber, SProgress, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  value: number;
  max: number;
  indeterminate: boolean;
  color: ThemeColor;
  size: ThemeSize;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  value: 65,
  max: 100,
  indeterminate: false,
  color: 'primary',
  size: 'md'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const COLOR_KEYS: ThemeColor[] = [
  'primary',
  'destructive',
  'success',
  'warning',
  'info',
  'carbon',
  'secondary',
  'accent'
];

const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);

const theme = useTheme('ProgressCustomizer');

/** 角色 → 实际颜色：走引擎自己的解析，SSR 安全，明暗与自定义主题变化时自动刷新。 */
const colorValues = computed(() => {
  const colors = resolveThemeColors(theme.theme.value, theme.effectiveMode.value);

  const map = COLOR_KEYS.reduce(
    (acc, key) => {
      acc[key] = colors[key];
      return acc;
    },
    {} as Record<ThemeColor, string>
  );

  return map;
});

const value = shallowRef(DEFAULTS.value);
const max = shallowRef(DEFAULTS.max);
const indeterminate = shallowRef(DEFAULTS.indeterminate);
const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);

const reset = (): void => {
  value.value = DEFAULTS.value;
  max.value = DEFAULTS.max;
  indeterminate.value = DEFAULTS.indeterminate;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="value">
        <SInputNumber v-model="value" :min="0" :max="max" :control-props="{ 'aria-label': 'Value' }" class="w-30" />
      </FieldItem>
      <FieldItem label="max">
        <SInputNumber v-model="max" :min="1" :control-props="{ 'aria-label': 'Max' }" class="w-30" />
      </FieldItem>
      <FieldItem label="color">
        <SSelect v-model="color" :items="colorItems" :trigger-props="{ 'aria-label': 'Color' }" class="w-40">
          <template #trigger-leading>
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: colorValues[color] }"></span>
          </template>
          <template #item-leading="{ item }">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: colorValues[item.value] }"></span>
          </template>
        </SSelect>
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="indeterminate">
        <div class="h-8 flex items-center">
          <SSwitch v-model="indeterminate" :control-props="{ 'aria-label': 'Indeterminate' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SProgress class="w-60" :model-value="indeterminate ? null : value" :max="max" :color="color" :size="size" />
  </div>
</template>
