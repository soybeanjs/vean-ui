<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SInputNumber, SSelect, SSlider, SSwitch, useTheme } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  color: ThemeColor;
  size: ThemeSize;
  orientation: DataOrientation;
  range: boolean;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  color: 'primary',
  size: 'md',
  orientation: 'horizontal',
  range: false,
  disabled: false,
  min: 0,
  max: 100,
  step: 1
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
const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];

const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);

const theme = useTheme('SliderCustomizer');

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

const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);
const orientation = shallowRef(DEFAULTS.orientation);
const range = shallowRef(DEFAULTS.range);
const disabled = shallowRef(DEFAULTS.disabled);
/** 数值控件允许空输入：`SInputNumber` 的模型是 `number | null`，空值回落到默认快照。 */
const min = shallowRef<number | null>(DEFAULTS.min);
const max = shallowRef<number | null>(DEFAULTS.max);
const step = shallowRef<number | null>(DEFAULTS.step);

const value = shallowRef<number[]>([40]);

/** 切换范围模式时把值收敛到目标形态：单值滑块只保留第一个拇指。 */
watch(range, isRange => {
  if (isRange) {
    value.value = value.value.length === 2 ? value.value : [20, 80];
  } else {
    value.value = [value.value[0] ?? 40];
  }
});

const displayValue = computed(() => value.value.join(' - '));

const reset = (): void => {
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  orientation.value = DEFAULTS.orientation;
  range.value = DEFAULTS.range;
  disabled.value = DEFAULTS.disabled;
  min.value = DEFAULTS.min;
  max.value = DEFAULTS.max;
  step.value = DEFAULTS.step;
  value.value = [40];
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
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
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="min">
        <SInputNumber v-model="min" :control-props="{ 'aria-label': 'Min' }" class="w-25" />
      </FieldItem>
      <FieldItem label="max">
        <SInputNumber v-model="max" :control-props="{ 'aria-label': 'Max' }" class="w-25" />
      </FieldItem>
      <FieldItem label="step">
        <SInputNumber v-model="step" :min="1" :control-props="{ 'aria-label': 'Step' }" class="w-25" />
      </FieldItem>
      <FieldItem label="range">
        <div class="h-8 flex items-center">
          <SSwitch v-model="range" :control-props="{ 'aria-label': 'Range' }" />
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

  <div class="flex items-center justify-center w-full">
    <div v-if="orientation === 'vertical'" class="h-40 flex items-center gap-6">
      <SSlider
        v-model="value"
        :color="color"
        :size="size"
        :orientation="orientation"
        :disabled="disabled"
        :min="min ?? DEFAULTS.min"
        :max="max ?? DEFAULTS.max"
        :step="step ?? DEFAULTS.step"
        :thumb-props="{ 'aria-label': 'Slider' }"
      />
      <p class="text-sm text-muted-foreground">{{ displayValue }}</p>
    </div>
    <div v-else class="flex-c gap-3 w-80">
      <SSlider
        v-model="value"
        :color="color"
        :size="size"
        :orientation="orientation"
        :disabled="disabled"
        :min="min ?? DEFAULTS.min"
        :max="max ?? DEFAULTS.max"
        :step="step ?? DEFAULTS.step"
        :thumb-props="{ 'aria-label': 'Slider' }"
      />
      <p class="text-sm text-muted-foreground">{{ displayValue }}</p>
    </div>
  </div>
</template>
