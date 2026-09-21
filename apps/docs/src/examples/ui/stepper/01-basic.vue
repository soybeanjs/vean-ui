<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SInputNumber, SSelect, SStepper, SSwitch, useTheme } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  orientation: DataOrientation;
  linear: boolean;
  color: ThemeColor;
  size: ThemeSize;
  step: number;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  linear: true,
  color: 'primary',
  size: 'md',
  step: 2
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
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

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);

const theme = useTheme('StepperCustomizer');

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

const orientation = shallowRef<DataOrientation>(DEFAULTS.orientation);
const linear = shallowRef(DEFAULTS.linear);
const color = shallowRef<ThemeColor>(DEFAULTS.color);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const step = shallowRef(DEFAULTS.step);

const items = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Complete your profile' },
  { title: 'Review', description: 'Confirm and submit' }
];

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  linear.value = DEFAULTS.linear;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  step.value = DEFAULTS.step;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
        />
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
      <FieldItem label="step">
        <SInputNumber v-model="step" :min="1" :max="items.length" aria-label="Step" class="w-25" />
      </FieldItem>
      <FieldItem label="linear">
        <div class="h-8 flex items-center">
          <SSwitch v-model="linear" :control-props="{ 'aria-label': 'Linear' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SStepper
      v-model="step"
      :orientation="orientation"
      :linear="linear"
      :color="color"
      :size="size"
      :items="items"
      class="max-w-150"
    />
  </div>
</template>
